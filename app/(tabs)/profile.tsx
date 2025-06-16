import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Platform,
  Dimensions,
  Switch
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width } = Dimensions.get('window');

// Mock user data
const USER_DATA = {
  name: 'Pedro Morais',
  email: 'pedro@example.com',
  joinDate: 'June 2024',
  streakDays: 42,
  completedChallenges: 15,
  level: 'Intermediate',
  avatarUrl: null, // We'll use an icon instead
};

// Settings options
const SETTINGS_OPTIONS = [
  { id: 'notifications', label: 'Notifications', icon: 'bell.fill', hasToggle: true },
  { id: 'darkMode', label: 'Dark Mode', icon: 'moon.fill', hasToggle: true },
  { id: 'currency', label: 'Currency', icon: 'dollarsign.circle.fill', value: 'USD' },
  { id: 'language', label: 'Language', icon: 'globe', value: 'English' },
  { id: 'security', label: 'Security', icon: 'lock.fill' },
  { id: 'help', label: 'Help & Support', icon: 'questionmark.circle.fill' },
  { id: 'about', label: 'About', icon: 'info.circle.fill' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: colorScheme === 'dark',
  });

  const handleToggle = (settingId: string) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: !prev[settingId as keyof typeof prev],
    }));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <LinearGradient
          colors={['#FFD345', '#FFC107']}
          style={[styles.header, { paddingTop: insets.top + 20 }]}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <IconSymbol name="person.fill" size={40} color="#333" />
            </View>
          </View>
          <ThemedText style={styles.userName}>{USER_DATA.name}</ThemedText>
          <ThemedText style={styles.userEmail}>{USER_DATA.email}</ThemedText>
          
          <View style={styles.statsContainer}>
            <Animated.View 
              entering={FadeInDown.delay(300).springify()}
              style={styles.statItem}
            >
              <IconSymbol name="flame.fill" size={20} color="#FF6B6B" />
              <ThemedText style={styles.statValue}>{USER_DATA.streakDays}</ThemedText>
              <ThemedText style={styles.statLabel}>Days</ThemedText>
            </Animated.View>
            
            <Animated.View 
              entering={FadeInDown.delay(400).springify()}
              style={styles.statItem}
            >
              <IconSymbol name="checkmark.seal.fill" size={20} color="#4ECDC4" />
              <ThemedText style={styles.statValue}>{USER_DATA.completedChallenges}</ThemedText>
              <ThemedText style={styles.statLabel}>Challenges</ThemedText>
            </Animated.View>
            
            <Animated.View 
              entering={FadeInDown.delay(500).springify()}
              style={styles.statItem}
            >
              <IconSymbol name="star.fill" size={20} color="#FFD345" />
              <ThemedText style={styles.statValue}>{USER_DATA.level}</ThemedText>
              <ThemedText style={styles.statLabel}>Level</ThemedText>
            </Animated.View>
          </View>
        </LinearGradient>

        {/* Settings Section */}
        <View style={styles.settingsContainer}>
          <ThemedText style={styles.sectionTitle}>Settings</ThemedText>
          
          {SETTINGS_OPTIONS.map((option, index) => (
            <Animated.View 
              key={option.id}
              entering={FadeIn.delay(600 + index * 100).springify()}
            >
              <TouchableOpacity 
                style={styles.settingItem}
                onPress={() => {
                  if (option.hasToggle) {
                    handleToggle(option.id);
                  }
                }}
              >
                <View style={styles.settingIconContainer}>
                  <IconSymbol name={option.icon} size={22} color="#FFD345" />
                </View>
                <View style={styles.settingContent}>
                  <ThemedText style={styles.settingLabel}>{option.label}</ThemedText>
                  {option.value && (
                    <ThemedText style={styles.settingValue}>{option.value}</ThemedText>
                  )}
                </View>
                {option.hasToggle ? (
                  <Switch
                    value={settings[option.id as keyof typeof settings]}
                    onValueChange={() => handleToggle(option.id)}
                    trackColor={{ false: '#D1D1D6', true: '#FFD345' }}
                    thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : settings[option.id as keyof typeof settings] ? '#FFC107' : '#F4F4F4'}
                    ios_backgroundColor="#D1D1D6"
                  />
                ) : (
                  <IconSymbol name="chevron.right" size={18} color="#999" />
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
        
        {/* Account Actions */}
        <Animated.View 
          entering={FadeInDown.delay(1200).springify()}
          style={styles.actionsContainer}
        >
          <TouchableOpacity style={styles.actionButton}>
            <ThemedText style={styles.actionButtonText}>Export Financial Data</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.logoutButton]}>
            <ThemedText style={styles.logoutButtonText}>Log Out</ThemedText>
          </TouchableOpacity>
        </Animated.View>
        
        <View style={styles.versionContainer}>
          <ThemedText style={styles.versionText}>Financial Tips v1.0.0</ThemedText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100, // Extra space for tab bar
  },
  header: {
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '100%',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  settingsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 211, 69, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  actionsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  logoutButtonText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  versionContainer: {
    padding: 20,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
});
