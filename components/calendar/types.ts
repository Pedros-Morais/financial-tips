export interface ActivityType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  totalActiveDays: number;
}

export interface CalendarData {
  streakData: StreakData;
  activeDates: Record<number, string[]>;
  activityTypes: ActivityType[];
}

export const ACTIVITY_TYPES: ActivityType[] = [
  { id: 'save', name: 'Saved Money', icon: 'dollarsign.circle.fill', color: '#10B981' },
  { id: 'invest', name: 'Invested', icon: 'chart.line.uptrend.xyaxis', color: '#3B82F6' },
  { id: 'learn', name: 'Learned', icon: 'book.fill', color: '#8B5CF6' },
  { id: 'budget', name: 'Budgeted', icon: 'list.bullet.clipboard', color: '#F59E0B' },
];

export const MOCK_STREAK_DATA: StreakData = {
  currentStreak: 7,
  bestStreak: 15,
  totalActiveDays: 42,
};

export const MOCK_ACTIVE_DATES: Record<number, string[]> = {
  1: ['save'],
  3: ['save', 'invest'],
  5: ['learn'],
  7: ['save', 'budget'],
  9: ['invest', 'learn'],
  12: ['save'],
  14: ['save', 'invest', 'learn'],
  16: ['budget'],
  18: ['save', 'learn'],
  20: ['invest'],
  22: ['save', 'budget', 'learn'],
  24: ['save'],
  26: ['invest', 'learn'],
  28: ['save', 'budget'],
  30: ['save', 'invest', 'learn', 'budget'],
};
