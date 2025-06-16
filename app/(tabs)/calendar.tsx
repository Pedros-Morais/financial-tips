import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  CalendarHeader, 
  StreakStats, 
  CalendarGrid, 
  ActivityLegend,
  MOCK_STREAK_DATA,
  MOCK_ACTIVE_DATES,
  ACTIVITY_TYPES
} from '../../components/calendar';

export default function CalendarScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <CalendarHeader currentStreak={MOCK_STREAK_DATA.currentStreak} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <StreakStats data={MOCK_STREAK_DATA} />
        
        <CalendarGrid 
          data={MOCK_STREAK_DATA}
          activityTypes={ACTIVITY_TYPES}
          mockActiveDates={MOCK_ACTIVE_DATES}
        />
        
        <ActivityLegend activityTypes={ACTIVITY_TYPES} />
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
  bottomPadding: {
    height: 100,
  },
});
