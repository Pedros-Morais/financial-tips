import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, {
  FadeInUp,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { streakStatsStyles } from './styles/StreakStatsStyles';

interface StreakData {
  currentStreak: number;
  bestStreak: number;
  totalActiveDays: number;
}

interface StreakStatsProps {
  data: StreakData;
}

export const StreakStats: React.FC<StreakStatsProps> = ({ data }) => {
  const scaleAnim = useSharedValue(1);
  const badgeAnim = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeAnim.value }],
    opacity: badgeAnim.value,
  }));

  useEffect(() => {
    scaleAnim.value = withSequence(
      withSpring(1.05, { damping: 15 }),
      withSpring(1, { damping: 15 })
    );

    badgeAnim.value = withDelay(
      500,
      withSpring(1, { damping: 12 })
    );
  }, []);

  const getAchievementBadges = (streak: number) => {
    const badges = [];
    if (streak >= 7) badges.push({ emoji: '🔥', label: 'Week Warrior' });
    if (streak >= 14) badges.push({ emoji: '💪', label: 'Two Week Champion' });
    if (streak >= 30) badges.push({ emoji: '👑', label: 'Monthly Master' });
    return badges;
  };

  const badges = getAchievementBadges(data.currentStreak);

  return (
    <Animated.View 
      style={streakStatsStyles.container}
      entering={SlideInDown.delay(300).duration(600)}
    >
      <View style={streakStatsStyles.header}>
        <Text style={streakStatsStyles.title}>Your Progress</Text>
        {badges.length > 0 && (
          <Animated.View style={[streakStatsStyles.achievementBadges, badgeAnimatedStyle]}>
            {badges.map((badge, index) => (
              <View key={index} style={streakStatsStyles.achievementBadge}>
                <Text style={streakStatsStyles.badgeEmoji}>{badge.emoji}</Text>
                <Text style={streakStatsStyles.badgeLabel}>{badge.label}</Text>
              </View>
            ))}
          </Animated.View>
        )}
      </View>
      
      <View style={streakStatsStyles.stats}>
        <Animated.View style={[streakStatsStyles.card, animatedStyle]}>
          <Text style={streakStatsStyles.number}>{data.currentStreak}</Text>
          <Text style={streakStatsStyles.label}>Current Streak</Text>
          <Text style={streakStatsStyles.emoji}>🔥</Text>
        </Animated.View>
        
        <TouchableOpacity 
          style={streakStatsStyles.card}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={streakStatsStyles.number}>{data.bestStreak}</Text>
          <Text style={streakStatsStyles.label}>Best Streak</Text>
          <Text style={streakStatsStyles.emoji}>🏆</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={streakStatsStyles.card}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={streakStatsStyles.number}>{data.totalActiveDays}</Text>
          <Text style={streakStatsStyles.label}>Total Days</Text>
          <Text style={streakStatsStyles.emoji}>📈</Text>
        </TouchableOpacity>
      </View>

      <Animated.View 
        style={streakStatsStyles.dailyChallengeContainer}
        entering={FadeInUp.delay(800).duration(600)}
      >
        <View style={streakStatsStyles.challengeHeader}>
          <Text style={streakStatsStyles.challengeTitle}>💡 Today's Challenge</Text>
          <View style={streakStatsStyles.challengeReward}>
            <Text style={streakStatsStyles.rewardText}>+2 🔥</Text>
          </View>
        </View>
        <Text style={streakStatsStyles.challengeDescription}>
          Track one expense to continue your streak
        </Text>
        <TouchableOpacity 
          style={streakStatsStyles.challengeButton}
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }}
        >
          <Text style={streakStatsStyles.challengeButtonText}>Complete Challenge</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};
