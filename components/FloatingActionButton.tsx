import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  interpolate,
  withRepeat,
  runOnJS,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export function FloatingActionButton(props: BottomTabBarButtonProps) {
  const scaleAnim = useSharedValue(1);
  const rotateAnim = useSharedValue(0);
  const pulseAnim = useSharedValue(0);
  const isActive = props.accessibilityState?.selected;

  // Main button animation style
  const animatedButtonStyle = useAnimatedStyle(() => {
    const rotation = interpolate(rotateAnim.value, [0, 1], [0, 45]);
    
    return {
      transform: [
        { scale: scaleAnim.value },
        { rotate: `${rotation}deg` }
      ],
    };
  });

  // Subtle pulse animation
  const animatedPulseStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulseAnim.value, [0, 1], [1, 1.2]);
    const opacity = interpolate(pulseAnim.value, [0, 1], [0.3, 0]);
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  useEffect(() => {
    // Subtle continuous pulse
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 2000, easing: Easing.in(Easing.quad) })
      ),
      -1,
      true
    );

    // Rotation for active state
    if (isActive) {
      rotateAnim.value = withSpring(1, {
        damping: 15,
        stiffness: 200,
      });
    } else {
      rotateAnim.value = withSpring(0, {
        damping: 15,
        stiffness: 200,
      });
    }
  }, [isActive, pulseAnim, rotateAnim]);

  const triggerHapticFeedback = () => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handlePressIn = (ev: any) => {
    scaleAnim.value = withSpring(0.9, {
      damping: 20,
      stiffness: 400,
    });

    runOnJS(triggerHapticFeedback)();
    props.onPressIn?.(ev);
  };

  const handlePressOut = (ev: any) => {
    scaleAnim.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });

    props.onPressOut?.(ev);
  };

  return (
    <View style={styles.container}>
      {/* Subtle pulse effect */}
      <Animated.View style={[styles.pulseRing, animatedPulseStyle]}>
        <View style={styles.pulseCircle} />
      </Animated.View>

      {/* Main FAB */}
      <Animated.View style={[styles.fabContainer, animatedButtonStyle]}>
        <LinearGradient
          colors={['#FFD345', '#FFC107', '#FF9800']}
          style={[StyleSheet.absoluteFillObject, styles.gradientBackground]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        {/* Subtle inner highlight */}
        <View style={styles.innerHighlight} />
        
        {/* Plus Icon */}
        <View style={styles.iconContainer}>
          {props.children}
        </View>
        
        <PlatformPressable
          {...props}
          style={styles.pressable}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width / 5, // Match tab item width
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: -35, // Elevate further above the tab bar
  },
  pulseRing: {
    position: 'absolute',
    width: 65,
    height: 65,
    borderRadius: 32.5,
  },
  pulseCircle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 32.5,
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
  },
  fabContainer: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    overflow: 'hidden',
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  gradientBackground: {
    borderRadius: 30,
  },
  innerHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
});
