import { supabase } from '../config/supabase';

export const userService = {
  // Ambil profil user
  getProfile: async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) return null;

    const { data, error } = await supabase
      .from('users_profile')
      .select('*')
      .eq('id', userData.user.id)
      .single();

    if (error) throw error;
    return data;
  },

  // Update profil (tambah XP, naik level, tambah gold, tambah stat spesifik)
  updateStats: async (xpGain, goldGain = 0, statCategory = null) => {
    const profile = await userService.getProfile();
    if (!profile) throw new Error('Profile not found');

    let newXp = profile.xp + xpGain;
    let newLevel = profile.level;
    let newGold = profile.gold + goldGain;

    // Logika Level Up Sederhana: Butuh 100 XP per level
    const xpNeededForNextLevel = newLevel * 100;
    
    if (newXp >= xpNeededForNextLevel) {
      newLevel += 1;
      newXp = newXp - xpNeededForNextLevel; // Reset/Kurangi XP yang sudah terpakai
    }

    const updates = {
      level: newLevel,
      xp: newXp,
      gold: newGold
    };

    if (statCategory) {
      const statKey = statCategory.toLowerCase();
      const validStats = ['str', 'int', 'cha', 'vit', 'agi'];
      if (validStats.includes(statKey)) {
        updates[statKey] = (profile[statKey] || 0) + 1;
      }
    }

    const { data, error } = await supabase
      .from('users_profile')
      .update(updates)
      .eq('id', profile.id)
      .select()
      .single();

    if (error) throw error;
    return { data, levelUp: profile.level < newLevel };
  }
};
