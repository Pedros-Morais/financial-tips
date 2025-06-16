import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { calendarHeaderStyles } from './styles/CalendarHeaderStyles';

interface CalendarHeaderProps {
  currentStreak: number;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentStreak }) => {
  const [currentDate] = useState(new Date());
  const pulseAnim = useSharedValue(1);
  const floatAnim = useSharedValue(0);
  const progressAnim = useSharedValue(0);
  
  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withSpring(1.05, { damping: 20 }),
        withSpring(1, { damping: 20 })
      ),
      -1,
      true
    );

    floatAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000 }),
        withTiming(0, { duration: 4000 })
      ),
      -1,
      true
    );

    progressAnim.value = withDelay(
      1000,
      withSpring((currentStreak / 30), { damping: 15 })
    );
  }, [currentStreak]);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const animatedFloatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(floatAnim.value, [0, 1], [0, -5]) }],
  }));

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${Math.min(progressAnim.value * 100, 100)}%`,
  }));

  return (
    <View style={calendarHeaderStyles.container}>
      <LinearGradient
        colors={['#FFD700', '#FFC107', '#FF9800']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={calendarHeaderStyles.gradient}
      >
        <Animated.View style={[calendarHeaderStyles.accent1, animatedFloatStyle]} />
        <Animated.View style={[calendarHeaderStyles.accent2, animatedPulseStyle]} />
        
        <Animated.View 
          style={calendarHeaderStyles.content}
          entering={FadeInUp.delay(200).duration(600)}
        >
          <Text style={calendarHeaderStyles.monthText}>{formatMonth(currentDate)}</Text>
          
          <Animated.View style={[calendarHeaderStyles.progressSection, animatedFloatStyle]}>
            <View style={calendarHeaderStyles.progressHeader}>
              <Text style={calendarHeaderStyles.progressTitle}>Monthly Progress</Text>
              <Text style={calendarHeaderStyles.progressPercentage}>
                {Math.round((currentStreak / 30) * 100)}%
              </Text>
            </View>
            
            <View style={calendarHeaderStyles.progressBarContainer}>
              <View style={calendarHeaderStyles.progressBarBackground}>
                <Animated.View 
                  style={[calendarHeaderStyles.progressBarFill, animatedProgressStyle]}
                />
              </View>
              <Text style={calendarHeaderStyles.progressText}>
                {currentStreak} of 30 days
              </Text>
            </View>

            <Text style={calendarHeaderStyles.nextMilestone}>
              {currentStreak < 7 ? `${7 - currentStreak} days to weekly goal` :
               currentStreak < 15 ? `${15 - currentStreak} days to 2-week streak` :
               currentStreak < 30 ? `${30 - currentStreak} days to monthly goal` :
               '🎉 Monthly goal achieved!'}
            </Text>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};
