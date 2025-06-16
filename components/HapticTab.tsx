import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
type CustomTabBarButtonProps = BottomTabBarButtonProps & { itemWidth?: number };
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

export function HapticTab(props: CustomTabBarButtonProps) {
  const scaleAnim = useSharedValue(1);
  const glowAnim = useSharedValue(0);
  const rippleAnim = useSharedValue(0);
  const translateYAnim = useSharedValue(0);
  const isActive = props.accessibilityState?.selected;

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scaleAnim.value },
        { translateY: translateYAnim.value }
      ],
    };
  });

  const animatedGlowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(glowAnim.value, [0, 1], [0, 0.8]);
    const scale = interpolate(glowAnim.value, [0, 1], [1, 1.2]);
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const animatedRippleStyle = useAnimatedStyle(() => {
    const scale = interpolate(rippleAnim.value, [0, 1], [0, 2]);
    const opacity = interpolate(rippleAnim.value, [0, 0.3, 1], [0, 0.3, 0]);
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  useEffect(() => {
    // Scale animation for active state
    scaleAnim.value = withSpring(isActive ? 1.15 : 1, {
      damping: 15,
      stiffness: 400,
    });
    
    // Subtle vertical movement for active tabs
    translateYAnim.value = withSpring(isActive ? -3 : 0, {
      damping: 20,
      stiffness: 300,
    });

    // Glow animation for active state
    if (isActive) {
      glowAnim.value = withRepeat(
        withSequence(
          withSpring(1, { duration: 1500 }),
          withSpring(0.7, { duration: 1500 })
        ),
        -1,
        true
      );
    } else {
      glowAnim.value = withSpring(0, { duration: 300 });
    }
  }, [isActive, scaleAnim, glowAnim]);

  const triggerHapticFeedback = () => {
    if (process.env.EXPO_OS === 'ios') {
      if (isActive) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  };

  const handlePressIn = (ev: any) => {
    // Press animation
    scaleAnim.value = withSpring(0.9, {
      damping: 20,
      stiffness: 600,
    });

    // Ripple effect
    rippleAnim.value = 0;
    rippleAnim.value = withSpring(1, {
      damping: 15,
      stiffness: 200,
    });

    runOnJS(triggerHapticFeedback)();
    props.onPressIn?.(ev);
  };

  const handlePressOut = (ev: any) => {
    // Release animation
    scaleAnim.value = withSpring(isActive ? 1.15 : 1, {
      damping: 15,
      stiffness: 400,
    });

    props.onPressOut?.(ev);
  };

  return (
    <View style={[styles.container, props.itemWidth ? { width: props.itemWidth } : undefined]}>
      {/* Glow effect for active state */}
      {isActive && (
        <Animated.View style={[styles.glowContainer, animatedGlowStyle]}>
          <LinearGradient
            colors={[
              'rgba(255, 211, 69, 0.6)',
              'rgba(255, 211, 69, 0.3)',
              'transparent'
            ]}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
      )}

      {/* Ripple effect */}
      <Animated.View style={[styles.rippleContainer, animatedRippleStyle]}>
        <View style={styles.ripple} />
      </Animated.View>

      {/* Main button */}
      <Animated.View style={[styles.buttonContainer, animatedButtonStyle]}>
        {isActive && (
          <LinearGradient
            colors={[
              'rgba(255, 211, 69, 0.2)',
              'rgba(255, 211, 69, 0.1)',
            ]}
            style={[StyleSheet.absoluteFillObject, styles.activeBackground]}
          />
        )}
        
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
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowContainer: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  rippleContainer: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    backgroundColor: 'rgba(255, 211, 69, 0.3)',
  },
  buttonContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  activeBackground: {
    borderRadius: 20,
  },
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    minHeight: 45,
    minWidth: 45,
  },
});
