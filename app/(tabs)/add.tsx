import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Platform, 
  ScrollView, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  FadeIn,
  SlideInDown,
} from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const TRANSACTION_TYPES = [
  { id: 'expense', label: 'Expense', icon: 'minus.circle.fill', color: '#FF6B6B' },
  { id: 'income', label: 'Income', icon: 'plus.circle.fill', color: '#4ECDC4' },
  { id: 'transfer', label: 'Transfer', icon: 'arrow.left.arrow.right.circle.fill', color: '#45B7D1' },
];

const CATEGORIES = {
  expense: [
    { id: 'food', label: 'Food & Dining', icon: 'fork.knife' },
    { id: 'transport', label: 'Transportation', icon: 'car.fill' },
    { id: 'shopping', label: 'Shopping', icon: 'bag.fill' },
    { id: 'entertainment', label: 'Entertainment', icon: 'tv.fill' },
    { id: 'bills', label: 'Bills & Utilities', icon: 'bolt.fill' },
    { id: 'health', label: 'Healthcare', icon: 'cross.case.fill' },
    { id: 'education', label: 'Education', icon: 'book.fill' },
    { id: 'other', label: 'Other', icon: 'ellipsis.circle.fill' },
  ],
  income: [
    { id: 'salary', label: 'Salary', icon: 'banknote.fill' },
    { id: 'freelance', label: 'Freelance', icon: 'laptopcomputer' },
    { id: 'investment', label: 'Investment', icon: 'chart.line.uptrend.xyaxis' },
    { id: 'gift', label: 'Gift', icon: 'gift.fill' },
    { id: 'other', label: 'Other', icon: 'ellipsis.circle.fill' },
  ],
  transfer: [
    { id: 'savings', label: 'To Savings', icon: 'banknote.fill' },
    { id: 'checking', label: 'To Checking', icon: 'creditcard.fill' },
    { id: 'investment', label: 'To Investment', icon: 'chart.pie.fill' },
  ],
};

export default function AddScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [transactionType, setTransactionType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation values
  const headerOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(50);

  useEffect(() => {
    // Trigger entrance animations
    headerOpacity.value = withDelay(200, withSpring(1, { damping: 20, stiffness: 300 }));
    formTranslateY.value = withDelay(400, withSpring(0, { damping: 20, stiffness: 300 }));
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: formTranslateY.value }],
    opacity: formTranslateY.value === 0 ? 1 : 0.7,
  }));

  const handleSubmit = async () => {
    if (!amount || !description || !selectedCategory) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    if (isNaN(parseFloat(amount))) {
      Alert.alert('Invalid Amount', 'Please enter a valid number for the amount.');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Success!', 
        `${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)} of $${amount} has been added.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setAmount('');
              setDescription('');
              setSelectedCategory('');
              // Navigate back to home
              router.push('/(tabs)/');
            }
          }
        ]
      );
    }, 1500);
  };

  const currentCategories = CATEGORIES[transactionType as keyof typeof CATEGORIES] || [];
  const selectedTypeData = TRANSACTION_TYPES.find(type => type.id === transactionType);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with proper safe area */}
        <Animated.View style={headerAnimatedStyle}>
          <LinearGradient
            colors={['#FFD345', '#FFC107']}
            style={[styles.header, { paddingTop: insets.top + 20 }]}
          >
            <View style={styles.headerContent}>
              <ThemedText style={styles.headerTitle}>Add Transaction</ThemedText>
              <ThemedText style={styles.headerSubtitle}>Track your financial activity</ThemedText>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
          {/* Transaction Type Selector */}
          <Animated.View 
            entering={SlideInDown.delay(600).springify().damping(20).stiffness(300)}
            style={styles.section}
          >
            <ThemedText style={styles.sectionTitle}>Transaction Type</ThemedText>
            <View style={styles.typeSelector}>
              {TRANSACTION_TYPES.map((type, index) => (
                <Animated.View 
                  key={type.id}
                  entering={FadeIn.delay(800 + index * 100).springify()}
                >
                  <TouchableOpacity
                    style={[
                      styles.typeOption,
                      transactionType === type.id && styles.typeOptionSelected
                    ]}
                    onPress={() => {
                      setTransactionType(type.id);
                      setSelectedCategory(''); // Reset category when type changes
                    }}
                  >
                    <IconSymbol 
                      name={type.icon} 
                      size={24} 
                      color={transactionType === type.id ? '#FFFFFF' : type.color} 
                    />
                    <ThemedText style={[
                      styles.typeOptionText,
                      transactionType === type.id && styles.typeOptionTextSelected
                    ]}>
                      {type.label}
                    </ThemedText>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Amount Input */}
          <Animated.View 
            entering={SlideInDown.delay(1000).springify().damping(20).stiffness(300)}
            style={styles.section}
          >
            <ThemedText style={styles.sectionTitle}>Amount</ThemedText>
            <View style={styles.amountContainer}>
              <ThemedText style={styles.currencySymbol}>$</ThemedText>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor="#999"
                keyboardType="numeric"
                returnKeyType="next"
              />
            </View>
          </Animated.View>

          {/* Category Selector */}
          <Animated.View 
            entering={SlideInDown.delay(1200).springify().damping(20).stiffness(300)}
            style={styles.section}
          >
            <ThemedText style={styles.sectionTitle}>Category</ThemedText>
            <View style={styles.categoryGrid}>
              {currentCategories.map((category, index) => (
                <Animated.View 
                  key={category.id}
                  entering={FadeIn.delay(1400 + index * 50).springify()}
                >
                  <TouchableOpacity
                    style={[
                      styles.categoryOption,
                      selectedCategory === category.id && styles.categoryOptionSelected
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <IconSymbol 
                      name={category.icon} 
                      size={20} 
                      color={selectedCategory === category.id ? '#FFFFFF' : selectedTypeData?.color || '#999'} 
                    />
                    <ThemedText style={[
                      styles.categoryOptionText,
                      selectedCategory === category.id && styles.categoryOptionTextSelected
                    ]}>
                      {category.label}
                    </ThemedText>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Description Input */}
          <Animated.View 
            entering={SlideInDown.delay(1600).springify().damping(20).stiffness(300)}
            style={styles.section}
          >
            <ThemedText style={styles.sectionTitle}>Description</ThemedText>
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter transaction description..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              returnKeyType="done"
            />
          </Animated.View>

          {/* Submit Button */}
          <Animated.View 
            entering={SlideInDown.delay(1800).springify().damping(20).stiffness(300)}
          >
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <LinearGradient
                colors={isSubmitting ? ['#CCC', '#999'] : ['#FFD345', '#FFC107']}
                style={styles.submitButtonGradient}
              >
                {isSubmitting ? (
                  <ThemedText style={styles.submitButtonText}>Adding...</ThemedText>
                ) : (
                  <>
                    <IconSymbol name="checkmark.circle.fill" size={20} color="#333" />
                    <ThemedText style={styles.submitButtonText}>Add Transaction</ThemedText>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  typeOptionSelected: {
    backgroundColor: '#FFD345',
  },
  typeOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  typeOptionTextSelected: {
    color: '#FFFFFF',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    paddingVertical: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: (width - 60) / 2.2, // Responsive width
  },
  categoryOptionSelected: {
    backgroundColor: '#FFD345',
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flexShrink: 1,
  },
  categoryOptionTextSelected: {
    color: '#FFFFFF',
  },
  descriptionInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    minHeight: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
