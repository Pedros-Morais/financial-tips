import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

const { width } = Dimensions.get('window');

// Mock data for learning progress
const learningRoadmap = [
  { id: 1, title: 'Financial Basics', completed: true, lessons: 5, icon: 'book.fill' },
  { id: 2, title: 'Budgeting', completed: true, lessons: 8, icon: 'chart.pie.fill' },
  { id: 3, title: 'Saving Strategies', completed: false, lessons: 6, icon: 'banknote.fill' },
  { id: 4, title: 'Investment Fundamentals', completed: false, lessons: 10, icon: 'chart.line.uptrend.xyaxis' },
  { id: 5, title: 'Risk Management', completed: false, lessons: 7, icon: 'shield.fill' },
];

// Mock streak data
const streakData = [
  { day: 'M', completed: true },
  { day: 'T', completed: true },
  { day: 'W', completed: false },
  { day: 'T', completed: true },
  { day: 'F', completed: true },
  { day: 'S', completed: false },
  { day: 'S', completed: false },
];

export default function HomeScreen() {
  const router = useRouter();
  const [currentStreak, setCurrentStreak] = useState(5);
  const [totalXP, setTotalXP] = useState(245);

  const navigateToQuestions = () => {
    router.push('/questions');
  };

  const RoadmapItem = ({ item, index }: { item: any, index: number }) => (
    <TouchableOpacity 
      style={[styles.roadmapItem, item.completed && styles.roadmapCompleted]}
      onPress={navigateToQuestions}
    >
      <View style={styles.roadmapIconContainer}>
        <IconSymbol 
          name={item.icon} 
          size={24} 
          color={item.completed ? '#4CAF50' : '#999'} 
        />
      </View>
      <View style={styles.roadmapContent}>
        <ThemedText type="defaultSemiBold" style={[
          styles.roadmapTitle,
          item.completed && styles.completedText
        ]}>
          {item.title}
        </ThemedText>
        <ThemedText style={styles.roadmapLessons}>
          {item.lessons} lessons
        </ThemedText>
      </View>
      {item.completed && (
        <IconSymbol name="checkmark.circle.fill" size={20} color="#4CAF50" />
      )}
    </TouchableOpacity>
  );

  const StreakDay = ({ day, completed }: { day: string, completed: boolean }) => (
    <View style={styles.streakDay}>
      <View style={[styles.streakCircle, completed && styles.streakCompleted]}>
        {completed && <IconSymbol name="flame.fill" size={16} color="#FFD345" />}
      </View>
      <ThemedText style={styles.streakDayText}>{day}</ThemedText>
    </View>
  );

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#FFD345', '#FFC107']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View>
            <ThemedText style={styles.greeting}>Good evening!</ThemedText>
            <ThemedText style={styles.welcomeText}>Ready to learn today?</ThemedText>
          </View>
          <View style={styles.profileContainer}>
            <View style={styles.profileImage}>
              <IconSymbol name="person.fill" size={24} color="#333" />
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <IconSymbol name="flame.fill" size={28} color="#FF6B35" />
          <ThemedText type="defaultSemiBold" style={styles.statNumber}>{currentStreak}</ThemedText>
          <ThemedText style={styles.statLabel}>Day Streak</ThemedText>
        </View>
        <View style={styles.statCard}>
          <IconSymbol name="star.fill" size={28} color="#FFD345" />
          <ThemedText type="defaultSemiBold" style={styles.statNumber}>{totalXP}</ThemedText>
          <ThemedText style={styles.statLabel}>Total XP</ThemedText>
        </View>
        <View style={styles.statCard}>
          <IconSymbol name="chart.line.uptrend.xyaxis" size={28} color="#4CAF50" />
          <ThemedText type="defaultSemiBold" style={styles.statNumber}>2/5</ThemedText>
          <ThemedText style={styles.statLabel}>Completed</ThemedText>
        </View>
      </View>

      {/* Weekly Progress */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>This Week</ThemedText>
        <View style={styles.streakContainer}>
          {streakData.map((item, index) => (
            <StreakDay key={index} day={item.day} completed={item.completed} />
          ))}
        </View>
      </ThemedView>

      {/* Continue Learning Button */}
      <TouchableOpacity style={styles.continueButton} onPress={navigateToQuestions}>
        <LinearGradient
          colors={['#FFD345', '#FFC107']}
          style={styles.continueGradient}
        >
          <IconSymbol name="play.fill" size={20} color="#333" />
          <ThemedText style={styles.continueText}>Continue Learning</ThemedText>
        </LinearGradient>
      </TouchableOpacity>

      {/* Learning Roadmap */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Learning Roadmap</ThemedText>
        <ThemedText style={styles.sectionDescription}>
          Master financial literacy step by step
        </ThemedText>
        <View style={styles.roadmapContainer}>
          {learningRoadmap.map((item, index) => (
            <RoadmapItem key={item.id} item={item} index={index} />
          ))}
        </View>
      </ThemedView>

      {/* Quick Actions */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Quick Actions</ThemedText>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickAction}>
            <IconSymbol name="target" size={24} color="#007AFF" />
            <ThemedText style={styles.quickActionText}>Daily Goal</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <IconSymbol name="trophy.fill" size={24} color="#FFD700" />
            <ThemedText style={styles.quickActionText}>Achievements</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <IconSymbol name="person.2.fill" size={24} color="#34C759" />
            <ThemedText style={styles.quickActionText}>Leaderboard</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  headerGradient: {
    height: 200,
    paddingHorizontal: 20,
    paddingVertical: 60,
    paddingTop: 80,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  profileContainer: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  profileImage: {
    width: 50,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginTop: -30,
    marginHorizontal: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  section: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  streakDay: {
    alignItems: 'center',
  },
  streakCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  streakCompleted: {
    borderColor: '#FFD345',
    backgroundColor: '#FFF9E6',
  },
  streakDayText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontWeight: '600',
  },
  continueButton: {
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  continueGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
    gap: 10,
  },
  continueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  roadmapContainer: {
    paddingVertical: 10,
  },
  roadmapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: '#F8F9FA',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  roadmapCompleted: {
    backgroundColor: '#FFF9E6',
    borderLeftWidth: 4,
    borderLeftColor: '#FFD345',
  },
  roadmapIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  roadmapContent: {
    flex: 1,
  },
  roadmapTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  completedText: {
    color: '#4CAF50',
  },
  roadmapLessons: {
    fontSize: 14,
    color: '#666',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  quickAction: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    minWidth: 80,
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontWeight: '600',
  },
});
