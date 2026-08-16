import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  id: {
    halo: 'Halo,',
    startDayMascot: 'Siap untuk menyelesaikan tugas dan naik level hari ini?',
    startNow: 'Mulai Sekarang',
    weeklyStats: 'STATISTIK MINGGUAN',
    featuredHighlights: 'SOROTAN FITUR',
    streakSub: 'Pertahankan streak-mu!',
    tasksCompletedSub: 'Tugas selesai bulan ini.',
    dailyClaimSub: 'Klaim hadiah harianmu.',
    viewPetSub: 'Beri makan pet kamu.',
    chatPromoTitle: 'Butuh teman ngobrol?',
    chatPromoSub: 'Mellisa siap menemani 24/7!',
    settingsTitle: 'PENGATURAN',
    settingsSub: 'Kelola preferensi dan keamanan akun kamu.',
    dailyLoginSub: 'Klaim hadiah harianmu.',
    petSub: 'Beri makan pet kamu.',
    // Guild Screen
    guildTitle: 'Grup Kamu',
    guildSub: 'Temukan dan bergabung dengan komunitas.',
    createGuildBtn: 'Buat Grup',
    searchGuild: 'Cari grup...',
    recommendedGuilds: 'GRUP REKOMENDASI',
    // Todo Screen
    mainCharacter: 'Pahlawan Utama',
    searchTask: 'Cari tugas...',
    todayTab: 'Hari Ini',
    pendingTab: 'Tertunda',
    completedTab: 'Selesai',
    todayTasks: 'TUGAS HARI INI',
    backBtn: 'Kembali',
    selectLanguageTitle: 'Pilih Bahasa',
    availableLanguagesSub: 'Pilihan bahasa yang tersedia.',
    langChangedToast: 'Bahasa Diperbarui!'
  },
  en: {
    halo: 'Hello,',
    startDayMascot: 'Ready to complete tasks and level up today?',
    startNow: 'Start Now',
    weeklyStats: 'WEEKLY STATS',
    featuredHighlights: 'FEATURED HIGHLIGHTS',
    streakSub: 'Keep up your streak!',
    tasksCompletedSub: 'Tasks completed this month.',
    dailyClaimSub: 'Claim your daily reward.',
    viewPetSub: 'Feed your virtual pet.',
    chatPromoTitle: 'Need someone to talk to?',
    chatPromoSub: 'Mellisa is ready 24/7!',
    settingsTitle: 'SETTINGS',
    settingsSub: 'Manage your preferences and security.',
    dailyLoginSub: 'Claim your daily reward.',
    petSub: 'Feed your virtual pet.',
    // Guild Screen
    guildTitle: 'Your Guild',
    guildSub: 'Find and join a community.',
    createGuildBtn: 'Create Guild',
    searchGuild: 'Search guilds...',
    recommendedGuilds: 'RECOMMENDED GUILDS',
    // Todo Screen
    mainCharacter: 'Main Character',
    searchTask: 'Search tasks...',
    todayTab: 'Today',
    pendingTab: 'Pending',
    completedTab: 'Completed',
    todayTasks: 'TODAY\'S TASKS',
    backBtn: 'Back'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('id'); // Default bahasa Indonesia

  const t = (key) => {
    return translations[language][key] || key;
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
