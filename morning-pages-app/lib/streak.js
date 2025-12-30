const STREAK_KEY = 'morningpages_streak';

export function getStreakData() {
  if (typeof window === 'undefined') {
    return {
      currentStreak: 0,
      longestStreak: 0,
      completedDays: [],
      totalWords: 0,
      totalDays: 0
    };
  }
  
  try {
    const data = localStorage.getItem(STREAK_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error loading streak data:', e);
  }
  
  return {
    currentStreak: 0,
    longestStreak: 0,
    completedDays: [],
    totalWords: 0,
    totalDays: 0
  };
}

export function updateStreakData(wordCount, completed) {
  const today = new Date().toDateString();
  const streakData = getStreakData();
  
  if (streakData.completedDays.includes(today)) {
    return streakData;
  }
  
  if (completed) {
    streakData.completedDays.push(today);
    streakData.totalDays++;
    streakData.totalWords += wordCount;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    if (streakData.completedDays.includes(yesterdayStr) || streakData.currentStreak === 0) {
      streakData.currentStreak++;
    } else {
      streakData.currentStreak = 1;
    }
    
    if (streakData.currentStreak > streakData.longestStreak) {
      streakData.longestStreak = streakData.currentStreak;
    }
  }
  
  localStorage.setItem(STREAK_KEY, JSON.stringify(streakData));
  return streakData;
}

export function calculateCurrentStreak() {
  const streakData = getStreakData();
  const today = new Date();
  let streak = 0;
  
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toDateString();
    
    if (streakData.completedDays.includes(dateStr)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  
  return streak;
}

export function getLast30Days() {
  const streakData = getStreakData();
  const days = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toDateString();
    days.push({
      date: checkDate,
      completed: streakData.completedDays.includes(dateStr),
      isToday: i === 0
    });
  }
  
  return days;
}

export function getTodayKey() {
  return `morningpages_${new Date().toDateString()}`;
}

export function saveTodayText(text) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(getTodayKey(), text);
  }
}

export function loadTodayText() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(getTodayKey()) || '';
  }
  return '';
}
