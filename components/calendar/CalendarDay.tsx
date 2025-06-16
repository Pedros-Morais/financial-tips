import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, {
  BounceIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { calendarDayStyles } from './styles/CalendarDayStyles';

interface ActivityType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CalendarDayProps {
  day: number;
  isActive: boolean;
  activities: string[];
  activityTypes: ActivityType[];
  onPress: () => void;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({ 
  day, 
  isActive, 
  activities, 
  activityTypes,
  onPress 
}) => {
  const scaleAnim = useSharedValue(1);
  const glowAnim = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: glowAnim.value * 0.3,
    shadowRadius: glowAnim.value * 8,
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    scaleAnim.value = withSequence(
      withSpring(0.95, { damping: 15 }),
      withSpring(1, { damping: 15 })
    );

    if (isActive) {
      glowAnim.value = withSequence(
        withSpring(1, { damping: 10 }),
        withSpring(0, { damping: 10 })
      );
    }

    onPress();
  };

  const getActivityCount = () => {
    return activities.length;
  };

  const isToday = () => {
    // Use June 16, 2025 as the fixed date
    const today = new Date(2025, 5, 16); // Month is 0-indexed, so 5 = June
    return day === today.getDate();
  };

  return (
    <Animated.View style={[animatedStyle, glowStyle]}>
      <TouchableOpacity
        style={[
          calendarDayStyles.container,
          isActive && calendarDayStyles.activeBackground,
          isToday() && calendarDayStyles.todayBorder,
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text style={[
          calendarDayStyles.dayNumber,
          isActive && calendarDayStyles.activeDayText,
          isToday() && calendarDayStyles.todayText,
        ]}>
          {day}
        </Text>

        {activities.length > 0 && (
          <View style={calendarDayStyles.activityDotsContainer}>
            {activities.slice(0, 3).map((activityId, index) => {
              const activityType = activityTypes.find(type => type.id === activityId);
              return (
                <View
                  key={index}
                  style={[
                    calendarDayStyles.activityDot,
                    { backgroundColor: activityType?.color || '#6B7280' }
                  ]}
                />
              );
            })}
            {activities.length > 3 && (
              <Text style={calendarDayStyles.moreActivities}>+{activities.length - 3}</Text>
            )}
          </View>
        )}

        {activities.length > 0 && (
          <View style={calendarDayStyles.activityCountBadge}>
            <Text style={calendarDayStyles.activityCountText}>{getActivityCount()}</Text>
          </View>
        )}

        {isActive && (
          <Animated.View 
            style={calendarDayStyles.streakIndicator}
            entering={BounceIn.delay(100)}
          >
            <Text style={calendarDayStyles.streakFire}>🔥</Text>
          </Animated.View>
        )}

        {isToday() && (
          <View style={calendarDayStyles.todayIndicator}>
            <Text style={calendarDayStyles.todayDot}>●</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};
