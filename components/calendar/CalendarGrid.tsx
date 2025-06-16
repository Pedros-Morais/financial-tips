import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { CalendarDay } from './CalendarDay';
import { calendarGridStyles } from './styles/CalendarGridStyles';

interface ActivityType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface StreakData {
  currentStreak: number;
  bestStreak: number;
  totalActiveDays: number;
}

interface CalendarGridProps {
  data: StreakData;
  activityTypes: ActivityType[];
  mockActiveDates: Record<number, string[]>;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ data, activityTypes, mockActiveDates }) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDayPress = (day: number) => {
    console.log(`Day ${day} pressed`);
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<View key={`empty-${i}`} style={calendarGridStyles.emptyDay} />);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const activities = mockActiveDates[day] || [];
      const isActive = activities.length > 0;
      
      days.push(
        <CalendarDay
          key={day}
          day={day}
          isActive={isActive}
          activities={activities}
          activityTypes={activityTypes}
          onPress={() => handleDayPress(day)}
        />
      );
    }
    
    return days;
  };

  return (
    <Animated.View 
      style={calendarGridStyles.container}
      entering={FadeIn.delay(400).duration(600)}
    >
      <Text style={calendarGridStyles.title}>
        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </Text>
      
      <View style={calendarGridStyles.weekdayHeaders}>
        {weekdays.map((day) => (
          <Text key={day} style={calendarGridStyles.weekdayText}>
            {day}
          </Text>
        ))}
      </View>
      
      <View style={calendarGridStyles.grid}>
        {renderCalendarDays()}
      </View>
    </Animated.View>
  );
};
