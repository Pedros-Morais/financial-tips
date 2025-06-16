import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, RefreshControl, Dimensions, View, Text, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  SlideInRight,
  BounceIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
  SlideInDown,
  FadeInUp,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Mock financial news data - in a real app, this would come from an API
const FINANCIAL_NEWS = [
  {
    id: 1,
    title: "Fed Signals Rate Changes",
    summary: "Monetary policy adjustments could impact savings strategies",
    category: "Policy",
    readTime: "3m",
    trending: true,
    icon: "banknote",
    color: "#10B981"
  },
  {
    id: 2,
    title: "Markets Hit New Highs",
    summary: "Tech sector drives continued investor confidence",
    category: "Markets",
    readTime: "2m",
    trending: true,
    icon: "chart.line.uptrend.xyaxis",
    color: "#3B82F6"
  },
  {
    id: 3,
    title: "Crypto Regulation Update",
    summary: "New guidelines for digital asset adoption",
    category: "Crypto",
    readTime: "4m",
    trending: false,
    icon: "bitcoinsign.circle",
    color: "#F59E0B"
  }
];

// Mock market data
const MARKET_DATA = [
  { symbol: "S&P", value: "4,567", change: "+1.2%", positive: true },
  { symbol: "NASDAQ", value: "14,234", change: "+0.8%", positive: true },
  { symbol: "DOW", value: "34,890", change: "-0.3%", positive: false },
  { symbol: "BTC", value: "$43,250", change: "+2.1%", positive: true },
];

// Financial tips categories
const TIP_CATEGORIES = [
  { title: "Budget", icon: "chart.pie.fill", color: "#10B981", tips: "12 tips" },
  { title: "Invest", icon: "chart.line.uptrend.xyaxis", color: "#3B82F6", tips: "18 tips" },
  { title: "Save", icon: "banknote", color: "#F59E0B", tips: "15 tips" },
  { title: "Debt", icon: "creditcard.fill", color: "#EF4444", tips: "8 tips" },
];

interface NewsCardProps {
  item: typeof FINANCIAL_NEWS[0];
  index: number;
}

const NewsCard: React.FC<NewsCardProps> = ({ item, index }) => {
  const scaleAnim = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scaleAnim.value = withSequence(
      withSpring(0.98, { damping: 15, stiffness: 300 }),
      withSpring(1, { damping: 15, stiffness: 300 })
    );
  };

  return (
    <Animated.View
      entering={SlideInRight.delay(index * 100).duration(600)}
      style={[styles.newsCard, animatedStyle]}
    >
      <TouchableOpacity onPress={handlePress} style={styles.newsCardContent}>
        <View style={styles.newsCardInner}>
          <View style={styles.newsHeader}>
            <View style={[styles.newsIcon, { backgroundColor: item.color }]}>
              <IconSymbol name={item.icon as any} size={20} color="white" />
            </View>
            
            <View style={styles.newsMetadata}>
              <Text style={styles.newsCategory}>{item.category}</Text>
              <Text style={styles.newsReadTime}>{item.readTime}</Text>
            </View>
            
            {item.trending && (
              <View style={styles.trendingBadge}>
                <Text style={styles.trendingText}>🔥</Text>
              </View>
            )}
          </View>

          <Text style={styles.newsTitle}>{item.title}</Text>
          <Text style={styles.newsSummary}>{item.summary}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface MarketTickerProps {
  data: typeof MARKET_DATA[0];
  index: number;
}

const MarketTicker: React.FC<MarketTickerProps> = ({ data, index }) => (
  <Animated.View
    entering={FadeIn.delay(index * 100).duration(600)}
    style={styles.marketItem}
  >
    <View style={styles.marketItemInner}>
      <Text style={styles.marketSymbol}>{data.symbol}</Text>
      <Text style={styles.marketValue}>{data.value}</Text>
      <View style={styles.marketChangeContainer}>
        <Text style={[
          styles.marketChange, 
          { color: data.positive ? "#10B981" : "#EF4444" }
        ]}>
          {data.change}
        </Text>
      </View>
    </View>
  </Animated.View>
);

interface CategoryCardProps {
  item: typeof TIP_CATEGORIES[0];
  index: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ item, index }) => {
  const scaleAnim = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scaleAnim.value = withSequence(
      withSpring(0.95, { damping: 15, stiffness: 300 }),
      withSpring(1, { damping: 15, stiffness: 300 })
    );
  };

  return (
    <Animated.View
      entering={BounceIn.delay(index * 100).duration(800)}
      style={[styles.categoryCard, animatedStyle]}
    >
      <TouchableOpacity onPress={handlePress} style={styles.categoryCardContent}>
        <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
          <IconSymbol name={item.icon as any} size={24} color="white" />
        </View>
        <Text style={styles.categoryTitle}>{item.title}</Text>
        <Text style={styles.categoryCount}>{item.tips}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Get current time for dynamic greeting
const getCurrentGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

// Header component with minimalist design
const ImpressionHeader = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const floatAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(1);

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Subtle floating animation
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000 }),
        withTiming(0, { duration: 4000 })
      ),
      -1,
      true
    );

    return () => clearInterval(timer);
  }, []);

  const animatedFloatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(floatAnim.value, [0, 1], [0, -5]) }],
  }));

  const animatedScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  const handleProfilePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scaleAnim.value = withSequence(
      withSpring(0.95, { damping: 15, stiffness: 300 }),
      withSpring(1, { damping: 15, stiffness: 300 })
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <View style={styles.headerContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFD700" />
      
      {/* Clean Yellow Background */}
      <LinearGradient
        colors={['#FFD700', '#FFC107']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        {/* Subtle Background Element */}
        <Animated.View style={[styles.backgroundAccent, animatedFloatStyle]} />
        
        {/* Header Content */}
        <Animated.View 
          style={styles.headerContent}
          entering={FadeInUp.delay(200).duration(600)}
        >
          {/* Top Row - Time and Profile */}
          <View style={styles.headerTopRow}>
            <Animated.View entering={SlideInDown.delay(300).duration(500)}>
              <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            </Animated.View>
            
            <Animated.View style={animatedScaleStyle}>
              <TouchableOpacity 
                style={styles.profileContainer}
                onPress={handleProfilePress}
                activeOpacity={0.7}
              >
                <View style={styles.profileButton}>
                  <IconSymbol name="person.circle.fill" size={24} color="#1F2937" />
                  <View style={styles.notificationDot} />
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Main Title Section */}
          <Animated.View 
            style={styles.titleSection}
            entering={FadeInUp.delay(400).duration(600)}
          >
            <Text style={styles.greetingText}>
              {getCurrentGreeting()} 
              <Animated.Text style={[styles.waveEmoji, animatedFloatStyle]}>
                👋
              </Animated.Text>
            </Text>
            
            <Text style={styles.mainTitle}>Financial Explorer</Text>
          </Animated.View>

          {/* Simple Stats */}
          <Animated.View 
            style={styles.statsContainer}
            entering={SlideInDown.delay(500).duration(500)}
          >
            <View style={styles.statCard}>
              <Text style={styles.statValue}>$12,450</Text>
              <Text style={styles.statLabel}>Portfolio Value</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>+8.2%</Text>
              <Text style={styles.statLabel}>Monthly Growth</Text>
            </View>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

export default function ExploreScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  return (
    <View style={styles.mainContainer}>
      {/* Impressive Header */}
      <ImpressionHeader />
      
      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Market Overview */}
        <Animated.View style={styles.section} entering={FadeIn.delay(200).duration(800)}>
          <Text style={styles.sectionTitle}>Market Overview</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.marketTicker}
            contentContainerStyle={styles.marketTickerContent}
          >
            {MARKET_DATA.map((item, index) => (
              <MarketTicker key={item.symbol} data={item} index={index} />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View style={styles.section} entering={FadeIn.delay(300).duration(800)}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#10B981' }]}>
                <IconSymbol name="plus.forwardslash.minus" size={20} color="white" />
              </View>
              <Text style={styles.quickActionText}>Calculator</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#3B82F6' }]}>
                <IconSymbol name="chart.bar.fill" size={20} color="white" />
              </View>
              <Text style={styles.quickActionText}>Portfolio</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#F59E0B' }]}>
                <IconSymbol name="target" size={20} color="white" />
              </View>
              <Text style={styles.quickActionText}>Goals</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#8B5CF6' }]}>
                <IconSymbol name="book.fill" size={20} color="white" />
              </View>
              <Text style={styles.quickActionText}>Learn</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Learning Categories */}
        <Animated.View style={styles.section} entering={FadeIn.delay(400).duration(800)}>
          <Text style={styles.sectionTitle}>Explore Topics</Text>
          <View style={styles.categoriesGrid}>
            {TIP_CATEGORIES.map((item, index) => (
              <CategoryCard key={item.title} item={item} index={index} />
            ))}
          </View>
        </Animated.View>

        {/* Financial News */}
        <Animated.View style={styles.section} entering={FadeIn.delay(500).duration(800)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest News</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          {FINANCIAL_NEWS.map((item, index) => (
            <NewsCard key={item.id} item={item} index={index} />
          ))}
        </Animated.View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    paddingVertical: 20,
  },
  headerContainer: {
    height: 250,
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  backgroundAccent: {
    position: 'absolute',
    top: 50,
    left: 50,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  notificationDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3B30',
  },
  titleSection: {
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 18,
    color: '#1F2937',
  },
  waveEmoji: {
    fontSize: 18,
    marginLeft: 5,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  marketTicker: {
    height: 100,
  },
  marketTickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  marketItem: {
    width: 120,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  marketItemInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  marketSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    paddingVertical: 10,
  },
  marketValue: {
    fontSize: 14,
    color: '#1F2937',
    textAlign: 'center',
  },
  marketChangeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  marketChange: {
    fontSize: 12,
    color: '#1F2937',
    marginLeft: 5,
  },
  newsCard: {
    width: screenWidth - 40,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  newsCardContent: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  newsCardInner: {
    flex: 1,
    padding: 20,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  newsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsMetadata: {
    marginLeft: 10,
  },
  newsCategory: {
    fontSize: 12,
    color: '#6B7280',
  },
  newsReadTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  trendingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  trendingText: {
    fontSize: 12,
    color: '#FF4444',
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  newsSummary: {
    fontSize: 14,
    color: '#1F2937',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (screenWidth - 60) / 2,
    height: 120,
    borderRadius: 10,
    marginBottom: 20,
  },
  categoryCardContent: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickActionCard: {
    width: (screenWidth - 60) / 4,
    height: 80,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 14,
    color: '#1F2937',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seeAllText: {
    fontSize: 14,
    color: '#6B7280',
  },
  bottomSpacing: {
    height: 100,
  },
});
