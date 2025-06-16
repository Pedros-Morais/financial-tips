import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  BounceIn,
  Easing,
  FadeIn,
  FadeOut,
  FlipInEasyX,
  interpolate,
  runOnJS,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  ZoomIn
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Sample questions data - this would ideally come from an API or data file
const SAMPLE_QUESTIONS = [
  {
    id: 1,
    question: 'Which of these is typically the safest investment?',
    options: ['Cryptocurrency', 'Individual stocks', 'Government bonds', 'Penny stocks'],
    correctAnswer: 'Government bonds',
    explanation: 'Government bonds are backed by the full faith and credit of the government, making them generally safer than stocks or cryptocurrency, which can be more volatile.'
  },
  {
    id: 2,
    question: 'What is compound interest?',
    options: [
      'Interest earned only on the principal amount',
      'Interest earned on both principal and accumulated interest',
      'A fixed interest rate that never changes',
      'Interest that is compounded and then subtracted from principal'
    ],
    correctAnswer: 'Interest earned on both principal and accumulated interest',
    explanation: 'Compound interest is calculated on the initial principal and also on the accumulated interest from previous periods. This is why it can significantly grow your investments over time.'
  },
  {
    id: 3,
    question: 'What is diversification?',
    options: [
      'Investing all your money in one promising stock',
      'Spreading investments across various assets to reduce risk',
      'Moving all investments to cash during market volatility',
      'Investing only in your employer\'s stock'
    ],
    correctAnswer: 'Spreading investments across various assets to reduce risk',
    explanation: 'Diversification involves spreading investments across different asset classes and securities to reduce exposure to any single risk.'
  },
  {
    id: 4,
    question: 'What does "emergency fund" typically mean?',
    options: [
      'Money set aside for investment opportunities',
      'Savings for 3-6 months of living expenses',
      'Money for vacation and entertainment',
      'Funds for buying luxury items'
    ],
    correctAnswer: 'Savings for 3-6 months of living expenses',
    explanation: 'An emergency fund is money set aside to cover unexpected expenses or financial emergencies, typically covering 3-6 months of living expenses.'
  },
  {
    id: 5,
    question: 'What is the main benefit of starting to invest early?',
    options: [
      'You can take bigger risks',
      'Investment fees are lower',
      'More time for compound growth',
      'Market volatility is reduced'
    ],
    correctAnswer: 'More time for compound growth',
    explanation: 'Starting early gives your investments more time to benefit from compound growth, where your returns generate their own returns over time.'
  },
  {
    id: 6,
    question: 'What is a 401(k)?',
    options: [
      'A type of savings account',
      'An employer-sponsored retirement plan',
      'A government bond',
      'A type of insurance policy'
    ],
    correctAnswer: 'An employer-sponsored retirement plan',
    explanation: 'A 401(k) is an employer-sponsored retirement savings plan that allows employees to save and invest for retirement on a tax-deferred basis.'
  },
  {
    id: 7,
    question: 'What does "dollar-cost averaging" mean?',
    options: [
      'Buying stocks only when prices are low',
      'Investing the same amount regularly regardless of price',
      'Averaging the cost of all your investments',
      'Only investing in dollar-denominated assets'
    ],
    correctAnswer: 'Investing the same amount regularly regardless of price',
    explanation: 'Dollar-cost averaging involves investing a fixed amount of money at regular intervals, regardless of market conditions, which can help reduce the impact of volatility.'
  },
  {
    id: 8,
    question: 'What is inflation?',
    options: [
      'When investment values increase rapidly',
      'The general increase in prices over time',
      'A type of investment strategy',
      'When interest rates go down'
    ],
    correctAnswer: 'The general increase in prices over time',
    explanation: 'Inflation is the rate at which the general level of prices for goods and services rises, reducing purchasing power over time.'
  },
];

const { width: screenWidth } = Dimensions.get('window');

export default function QuestionsScreen() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  
  // Animation values
  const progressAnim = useSharedValue(0);
  const scoreAnim = useSharedValue(0);
  const livesAnim = useSharedValue(1);
  const questionScale = useSharedValue(1);
  const celebrationAnim = useSharedValue(0);
  const shakeAnim = useSharedValue(0);
  
  const currentQuestion = SAMPLE_QUESTIONS[currentQuestionIndex];

  // Animated styles
  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressAnim.value}%`,
      transform: [{ scaleY: interpolate(progressAnim.value, [0, 100], [0.8, 1]) }],
    };
  });

  const animatedScoreStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scoreAnim.value },
        { rotate: `${interpolate(scoreAnim.value, [1, 1.3, 1], [0, 10, 0])}deg` }
      ],
    };
  });

  const animatedLivesStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: livesAnim.value },
        { translateX: shakeAnim.value }
      ],
    };
  });

  const animatedQuestionStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: questionScale.value }],
    };
  });

  const animatedCelebrationStyle = useAnimatedStyle(() => {
    const scale = interpolate(celebrationAnim.value, [0, 1], [0, 2]);
    const opacity = interpolate(celebrationAnim.value, [0, 0.5, 1], [0, 1, 0]);
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  useEffect(() => {
    // Animate progress bar
    progressAnim.value = withSpring(
      ((currentQuestionIndex + 1) / SAMPLE_QUESTIONS.length) * 100,
      { damping: 15, stiffness: 100 }
    );

    // Animate question entrance
    questionScale.value = withSequence(
      withTiming(0.8, { duration: 200 }),
      withSpring(1, { damping: 12, stiffness: 150 })
    );
  }, [currentQuestionIndex]);

  const triggerScoreAnimation = () => {
    scoreAnim.value = withSequence(
      withSpring(1.3, { damping: 8, stiffness: 200 }),
      withSpring(1, { damping: 12, stiffness: 150 })
    );
    
    // Celebration particles
    celebrationAnim.value = withTiming(1, { 
      duration: 800, 
      easing: Easing.out(Easing.quad) 
    }, () => {
      celebrationAnim.value = 0;
    });
  };

  const triggerLivesAnimation = () => {
    // Shake animation for wrong answer
    shakeAnim.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
    
    livesAnim.value = withSequence(
      withSpring(1.2, { damping: 8, stiffness: 200 }),
      withSpring(1, { damping: 12, stiffness: 150 })
    );
  };

  const handleOptionSelect = (option: string) => {
    if (selectedOption) return; // Prevent changing answer
    
    setSelectedOption(option);
    const correct = option === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setScore(score + 10);
      runOnJS(triggerScoreAnimation)();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setLives(lives - 1);
      runOnJS(triggerLivesAnimation)();
      if (lives <= 1) {
        setGameOver(true);
      }
    }
    
    // Show explanation after selection
    setTimeout(() => {
      setShowExplanation(true);
    }, 1000);
  };

  const handleNextQuestion = () => {
    if (gameOver) {
      // Reset game
      setCurrentQuestionIndex(0);
      setScore(0);
      setLives(3);
      setGameOver(false);
    } else if (currentQuestionIndex < SAMPLE_QUESTIONS.length - 1) {
      // Go to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Game completed
      setGameOver(true);
    }
    
    // Reset state
    setSelectedOption(null);
    setIsCorrect(null);
    setShowExplanation(false);
  };

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.fullScreenContainer}>
      <ThemedView style={styles.container}>
        {/* Celebration particles overlay */}
        <Animated.View style={[styles.celebrationOverlay, animatedCelebrationStyle]} pointerEvents="none">
          <View style={[styles.particle, { backgroundColor: '#FFD700', top: '20%', left: '20%' }]} />
          <View style={[styles.particle, { backgroundColor: '#FF6B35', top: '30%', right: '20%' }]} />
          <View style={[styles.particle, { backgroundColor: '#4CAF50', bottom: '30%', left: '30%' }]} />
          <View style={[styles.particle, { backgroundColor: '#2196F3', bottom: '20%', right: '30%' }]} />
        </Animated.View>

        {/* Header */}
        <Animated.View style={styles.header} entering={FadeIn.delay(200)}>
          <TouchableOpacity onPress={goBack} style={styles.closeButton}>
            <IconSymbol name="xmark" size={18} color="#FFD700" />
          </TouchableOpacity>
          
          <ThemedView style={styles.statsContainer}>
            <Animated.View style={[styles.lives, animatedLivesStyle]}>
              {[...Array(3)].map((_, i) => (
                <Animated.View
                  key={i}
                  entering={BounceIn.delay(i * 100)}
                  style={[
                    styles.heartContainer,
                    { opacity: i < lives ? 1 : 0.3 }
                  ]}
                >
                  <IconSymbol name="heart.fill" size={20} color="#FF3B30" />
                </Animated.View>
              ))}
            </Animated.View>
            <Animated.View style={[styles.score, animatedScoreStyle]}>
              <IconSymbol name="star.fill" size={20} color="#FFCC00" />
              <ThemedText style={styles.scoreText}>{score}</ThemedText>
            </Animated.View>
          </ThemedView>
        </Animated.View>

        {/* Progress bar */}
        <Animated.View style={styles.progressContainer} entering={SlideInRight.delay(300)}>
          <Animated.View style={[styles.progressBar, animatedProgressStyle]}>
            <LinearGradient
              colors={['#4CAF50', '#8BC34A', '#CDDC39']}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </Animated.View>
        </Animated.View>

        {/* Question */}
        {!gameOver ? (
          <>
            <Animated.View style={[styles.questionContainer, animatedQuestionStyle]}>
              <Animated.View
                key={currentQuestionIndex}
                entering={FadeIn.delay(400)}
                exiting={FadeOut}
                style={styles.questionCard}
              >
                <LinearGradient
                  colors={['rgba(0, 122, 255, 0.1)', 'rgba(0, 122, 255, 0.05)']}
                  style={StyleSheet.absoluteFillObject}
                />
                <ThemedText type="subtitle" style={styles.questionText}>
                  {currentQuestion.question}
                </ThemedText>
              </Animated.View>
            </Animated.View>

            {/* Options */}
            <ThemedView style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => (
                <OptionButton
                  key={`${currentQuestionIndex}-${index}`}
                  option={option}
                  index={index}
                  selectedOption={selectedOption}
                  correctAnswer={currentQuestion.correctAnswer}
                  onPress={() => handleOptionSelect(option)}
                  disabled={!!selectedOption}
                />
              ))}
            </ThemedView>

            {/* Explanation */}
            {showExplanation && (
              <Animated.View
                entering={FadeIn.delay(200)}
                style={styles.explanationContainer}
              >
                <LinearGradient
                  colors={isCorrect 
                    ? ['rgba(76, 175, 80, 0.1)', 'rgba(76, 175, 80, 0.05)']
                    : ['rgba(244, 67, 54, 0.1)', 'rgba(244, 67, 54, 0.05)']
                  }
                  style={StyleSheet.absoluteFillObject}
                />
                <Animated.View entering={ZoomIn.delay(300)}>
                  <ThemedText type="defaultSemiBold" style={[
                    styles.explanationTitle,
                    { color: isCorrect ? '#4CAF50' : '#F44336' }
                  ]}>
                    {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                  </ThemedText>
                </Animated.View>
                <ThemedText style={styles.explanationText}>
                  {currentQuestion.explanation}
                </ThemedText>
              </Animated.View>
            )}
          </>
        ) : (
          <Animated.View 
            style={styles.gameOverContainer} 
            entering={FlipInEasyX.duration(800)}
          >
            {/* Animated Background Gradient */}
            <LinearGradient
              colors={['#FF6B6B', '#FF8E8E', '#FFB3B3']}
              style={StyleSheet.absoluteFillObject}
            />
            
            {/* Floating Broken Hearts Animation */}
            <Animated.View style={styles.brokenHeartsContainer}>
              {[...Array(8)].map((_, i) => (
                <Animated.View
                  key={i}
                  entering={BounceIn.delay(i * 150).duration(1000)}
                  style={[
                    styles.floatingHeart,
                    {
                      left: `${10 + (i * 10)}%`,
                      top: `${20 + (i % 3) * 15}%`,
                      transform: [
                        { rotate: `${-15 + (i * 5)}deg` },
                        { scale: 0.8 + (i % 3) * 0.2 }
                      ]
                    }
                  ]}
                >
                  <IconSymbol name="heart.slash" size={24} color="#8B0000" />
                </Animated.View>
              ))}
            </Animated.View>

            {/* Main Game Over Content */}
            <Animated.View 
              style={styles.gameOverContent}
              entering={ZoomIn.delay(500).duration(800)}
            >
              {/* Animated Skull or Sad Face */}
              <Animated.View 
                style={styles.gameOverIcon}
                entering={BounceIn.delay(800).duration(1200)}
              >
                <View style={styles.sadFaceContainer}>
                  <View style={styles.sadFace}>
                    <View style={[styles.eye, styles.leftEye]} />
                    <View style={[styles.eye, styles.rightEye]} />
                    <View style={styles.sadMouth} />
                  </View>
                  {/* Animated Tears */}
                  <Animated.View 
                    style={[styles.tear, styles.leftTear]}
                    entering={FadeIn.delay(1200).duration(800)}
                  />
                  <Animated.View 
                    style={[styles.tear, styles.rightTear]}
                    entering={FadeIn.delay(1400).duration(800)}
                  />
                </View>
              </Animated.View>

              {/* Glitch Effect Title */}
              <Animated.View 
                style={styles.titleContainer}
                entering={FadeIn.delay(1000).duration(600)}
              >
                <ThemedText style={styles.gameOverTitle}>💔 GAME OVER!</ThemedText>
                <ThemedText style={styles.gameOverSubtitle}>Financial Dreams Shattered</ThemedText>
              </Animated.View>

              {/* Animated Score Display */}
              <Animated.View 
                style={styles.finalScoreContainer}
                entering={SlideInRight.delay(1200).duration(800)}
              >
                <LinearGradient
                  colors={['#8B0000', '#A52A2A', '#CD5C5C']}
                  style={styles.scoreCard}
                >
                  <IconSymbol name="chart.line.downtrend.xyaxis" size={32} color="#FFB3B3" />
                  <ThemedText style={styles.finalScoreLabel}>Final Score</ThemedText>
                  <ThemedText style={styles.finalScoreValue}>{score}</ThemedText>
                  <ThemedText style={styles.scoreMessage}>
                    {score >= 50 ? "Not bad! Keep learning!" : 
                     score >= 30 ? "Room for improvement!" : 
                     "Time to study more!"}
                  </ThemedText>
                </LinearGradient>
              </Animated.View>

              {/* Motivational Message with Typewriter Effect */}
              <Animated.View 
                style={styles.motivationContainer}
                entering={FadeIn.delay(1600).duration(1000)}
              >
                <ThemedText style={styles.motivationText}>
                  💪 Every expert was once a beginner!
                </ThemedText>
                <ThemedText style={styles.motivationSubtext}>
                  Learn from mistakes and try again
                </ThemedText>
              </Animated.View>

              {/* Animated Statistics */}
              <Animated.View 
                style={styles.statsGrid}
                entering={SlideInRight.delay(1800).duration(800)}
              >
                <View style={styles.statItem}>
                  <IconSymbol name="target" size={20} color="#FFB3B3" />
                  <ThemedText style={styles.statLabel}>Accuracy</ThemedText>
                  <ThemedText style={styles.statValue}>
                    {Math.round((score / (currentQuestionIndex * 10)) * 100) || 0}%
                  </ThemedText>
                </View>
                <View style={styles.statItem}>
                  <IconSymbol name="clock" size={20} color="#FFB3B3" />
                  <ThemedText style={styles.statLabel}>Questions</ThemedText>
                  <ThemedText style={styles.statValue}>{currentQuestionIndex}</ThemedText>
                </View>
                <View style={styles.statItem}>
                  <IconSymbol name="star" size={20} color="#FFB3B3" />
                  <ThemedText style={styles.statLabel}>Best Streak</ThemedText>
                  <ThemedText style={styles.statValue}>
                    {Math.max(1, Math.floor(score / 10))}
                  </ThemedText>
                </View>
              </Animated.View>
            </Animated.View>

            {/* Floating Money Symbols (Lost Money Effect) */}
            <Animated.View style={styles.floatingMoneyContainer}>
              {['💸', '💰', '📉', '💔', '😢'].map((emoji, i) => (
                <Animated.View
                  key={i}
                  entering={BounceIn.delay(2000 + i * 200).duration(1000)}
                  style={[
                    styles.floatingEmoji,
                    {
                      left: `${15 + (i * 15)}%`,
                      bottom: `${10 + (i % 2) * 20}%`,
                      transform: [{ rotate: `${-10 + (i * 4)}deg` }]
                    }
                  ]}
                >
                  <ThemedText style={styles.emojiText}>{emoji}</ThemedText>
                </Animated.View>
              ))}
            </Animated.View>
          </Animated.View>
        )}

        {/* Bottom button */}
        {(selectedOption || gameOver) && (
          <Animated.View
            entering={SlideInRight.delay(500)}
            style={styles.nextButtonContainer}
          >
            <TouchableOpacity 
              style={styles.nextButton}
              onPress={handleNextQuestion}
            >
              <LinearGradient
                colors={['#F7DC6F', '#F2C464', '#FFD700']}
                style={StyleSheet.absoluteFillObject}
              />
              <IconSymbol 
                name={gameOver ? "arrow.clockwise" : "arrow.right"} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
          </Animated.View>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

// Animated Option Button Component
function OptionButton({ 
  option, 
  index, 
  selectedOption, 
  correctAnswer, 
  onPress, 
  disabled 
}: {
  option: string;
  index: number;
  selectedOption: string | null;
  correctAnswer: string;
  onPress: () => void;
  disabled: boolean;
}) {
  const scaleAnim = useSharedValue(1);
  const glowAnim = useSharedValue(0);

  const isSelected = selectedOption === option;
  const isCorrect = option === correctAnswer;
  const showResult = !!selectedOption;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleAnim.value }],
    };
  });

  const animatedGlowStyle = useAnimatedStyle(() => {
    const glowOpacity = interpolate(glowAnim.value, [0, 1], [0, 0.6]);
    return {
      opacity: glowOpacity,
      transform: [{ scale: interpolate(glowAnim.value, [0, 1], [1, 1.1]) }],
    };
  });

  useEffect(() => {
    if (showResult && isCorrect) {
      glowAnim.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0, { duration: 300 })
        ),
        3,
        false
      );
    }
  }, [showResult, isCorrect]);

  const handlePressIn = () => {
    scaleAnim.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scaleAnim.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const getButtonStyle = () => {
    if (!showResult) return styles.optionButton;
    
    if (isSelected && isCorrect) return [styles.optionButton, styles.correctOption];
    if (isSelected && !isCorrect) return [styles.optionButton, styles.incorrectOption];
    if (!isSelected && isCorrect) return [styles.optionButton, styles.correctOption];
    
    return [styles.optionButton, styles.neutralOption];
  };

  return (
    <Animated.View
      entering={SlideInRight.delay(600 + index * 100)}
      style={animatedStyle}
    >
      {/* Glow effect for correct answer */}
      {showResult && isCorrect && (
        <Animated.View style={[styles.glowEffect, animatedGlowStyle]} />
      )}
      
      <TouchableOpacity
        style={getButtonStyle()}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        {showResult && (
          <LinearGradient
            colors={
              isSelected && isCorrect
                ? ['rgba(76, 175, 80, 0.2)', 'rgba(76, 175, 80, 0.1)']
                : isSelected && !isCorrect
                ? ['rgba(244, 67, 54, 0.2)', 'rgba(244, 67, 54, 0.1)']
                : isCorrect
                ? ['rgba(76, 175, 80, 0.15)', 'rgba(76, 175, 80, 0.05)']
                : ['rgba(0, 0, 0, 0.02)', 'rgba(0, 0, 0, 0.01)']
            }
            style={StyleSheet.absoluteFillObject}
          />
        )}
        
        <ThemedText style={[
          styles.optionText,
          showResult && isCorrect && styles.correctText,
          showResult && isSelected && !isCorrect && styles.incorrectText
        ]}>
          {option}
        </ThemedText>
        
        {showResult && isSelected && (
          <Animated.View
            entering={ZoomIn.delay(200)}
            style={styles.resultIcon}
          >
            <ThemedText style={styles.resultIconText}>
              {isCorrect ? '✓' : '✗'}
            </ThemedText>
          </Animated.View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  celebrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  lives: {
    flexDirection: 'row',
    gap: 4,
  },
  heartContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  score: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  questionContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  questionCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  questionText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    bottom: 20,
    color:"#fff",
    borderColor: '#E0E0E0',
  },
  correctOption: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: '#4CAF50',
  },
  incorrectOption: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    borderColor: '#F44336',
  },
  neutralOption: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderColor: '#E0E0E0',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  correctText: {
    color: '#4CAF50',
  },
  incorrectText: {
    color: '#F44336',
  },
  glowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  resultIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
  },
  resultIconText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  explanationContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 16,
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  gameOverTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  gameOverSubtitle: {
    fontSize: 18,
    color: '#FF8E8E',
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  nextButton: {
    backgroundColor: '#F7DC6F',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  brokenHeartsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingHeart: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  gameOverIcon: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  sadFaceContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sadFace: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  eye: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8B0000',
  },
  leftEye: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  rightEye: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  sadMouth: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: '#8B0000',
  },
  tear: {
    position: 'absolute',
    width: 10,
    height: 20,
    borderRadius: 5,
    backgroundColor: '#8B0000',
  },
  leftTear: {
    top: 40,
    left: 30,
  },
  rightTear: {
    top: 40,
    right: 30,
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  finalScoreContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreCard: {
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finalScoreLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFB3B3',
  },
  finalScoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFB3B3',
  },
  scoreMessage: {
    fontSize: 16,
    color: '#FFB3B3',
  },
  motivationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  motivationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  motivationSubtext: {
    fontSize: 16,
    color: '#FF8E8E',
  },
  statsGrid: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  statItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 16,
    color: '#FFB3B3',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFB3B3',
  },
  floatingMoneyContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingEmoji: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 24,
    color: '#FFB3B3',
  },
});
