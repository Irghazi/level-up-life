import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '../services/userService';
import { useAuth } from './AuthContext';

const ProfileContext = createContext({});

export const ProfileProvider = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ level: 1, xp: 0, gold: 0 });
  const [hp, setHp] = useState(100);
  const [maxHp] = useState(100);
  const [loading, setLoading] = useState(true);
  const [deathEvent, setDeathEvent] = useState(null);

  const fetchProfile = async () => {
    if (!user) {
      setProfile({ level: 1, xp: 0, gold: 0 });
      setHp(100);
      setLoading(false);
      return;
    }
    
    try {
      const data = await userService.getProfile();
      if (data) {
        setProfile(data);
      }
      const savedHp = await AsyncStorage.getItem(`@hp_${user.id}`);
      if (savedHp !== null) {
        setHp(parseInt(savedHp, 10));
      } else {
        setHp(100);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const saveHp = async (newHp) => {
    setHp(newHp);
    if (user) {
      await AsyncStorage.setItem(`@hp_${user.id}`, newHp.toString());
    }
  };

  const healHp = (amount) => {
    setHp((prev) => {
      const next = Math.min(prev + amount, maxHp);
      if (user) AsyncStorage.setItem(`@hp_${user.id}`, next.toString());
      return next;
    });
  };

  const triggerDeathPenalty = async (currentProfile) => {
    try {
      // Lose 50% XP
      const lostXp = Math.floor(currentProfile.xp * 0.5);
      const newXp = currentProfile.xp - lostXp;
      
      // Lose 50% Gold
      const lostGold = Math.floor((currentProfile.gold || 0) * 0.5);
      const newGold = (currentProfile.gold || 0) - lostGold;
      
      // Reduce 1 from all stats
      const updates = { xp: newXp, gold: newGold };
      const statKeys = ['str', 'int', 'cha', 'vit', 'agi'];
      for (const stat of statKeys) {
        const val = currentProfile[stat] || 0;
        updates[stat] = Math.max(0, val - 1);
      }

      const { supabase } = require('../config/supabase');
      await supabase.from('users_profile').update(updates).eq('id', user.id);
      
      const newProfile = { ...currentProfile, ...updates };
      setDeathEvent({ lostXp, lostGold });
      setProfile(newProfile);
      saveHp(100); // Revive with full HP

      return { penaltyApplied: true, newProfile, lostXp, lostGold };
    } catch (err) {
      console.error('Death penalty error', err);
      return { penaltyApplied: false };
    }
  };

  const takeDamage = async (amount, reason) => {
    let newHp = hp;
    setHp((prev) => {
      // Calculate defense based on vit (e.g., 2% reduction per vit, max 50%)
      const vit = profile.vit || 0;
      const reduction = Math.min(0.5, vit * 0.02);
      const finalDamage = Math.max(1, Math.floor(amount * (1 - reduction)));
      
      newHp = Math.max(0, prev - finalDamage);
      if (user) AsyncStorage.setItem(`@hp_${user.id}`, newHp.toString());
      return newHp;
    });

    if (newHp <= 0) {
      return await triggerDeathPenalty(profile);
    }
    return { penaltyApplied: false, currentHp: newHp };
  };

  const addXp = async (amount, goldAmount = 0, statCategory = null) => {
    try {
      const result = await userService.updateStats(amount, goldAmount, statCategory); 
      if (result.data) {
        setProfile(result.data);
      }
      if (result.levelUp) {
        saveHp(maxHp); // Full heal on level up
      }
      return { success: true, levelUp: result.levelUp, data: result.data };
    } catch (error) {
      console.error('Error adding XP:', error);
      return { success: false, error };
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, loading, fetchProfile, addXp, hp, maxHp, healHp, takeDamage, deathEvent, setDeathEvent }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  return useContext(ProfileContext);
};
