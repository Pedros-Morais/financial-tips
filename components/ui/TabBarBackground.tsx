import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

export default function TabBarBackground() {
  const floatingAnimation = useSharedValue(0);
  const pulseAnimation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(floatingAnimation.value, [0, 1], [0, -4]);
    return {
      transform: [{ translateY }],
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(pulseAnimation.value, [0, 1], [0.3, 0.7]);
    const scale = interpolate(pulseAnimation.value, [0, 1], [1, 1.05]);
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  useEffect(() => {
    // Floating animation
    floatingAnimation.value = withRepeat(
      withSequence(
        withSpring(1, { duration: 3000 }),
        withSpring(0, { duration: 3000 })
      ),
      -1,
      true
    );

    // Pulse animation for the glow effect
    pulseAnimation.value = withRepeat(
      withSequence(
        withSpring(1, { duration: 2000 }),
        withSpring(0, { duration: 2000 })
      ),
      -1,
      true
    );
  }, [floatingAnimation, pulseAnimation]);

  return (
    <View style={styles.container}>
      {/* Outer glow effect */}
      <Animated.View style={[styles.glowContainer, glowStyle]}>
        <LinearGradient
          colors={['rgba(255, 211, 69, 0.4)', 'rgba(255, 211, 69, 0.1)', 'transparent']}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      {/* Main floating island */}
      <Animated.View style={[styles.islandContainer, animatedStyle]}>
        {/* Background with multiple layers */}
        <View style={styles.backgroundLayer}>
          {/* Primary background */}
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.95)',
              'rgba(255, 248, 225, 0.9)',
              'rgba(255, 255, 255, 0.95)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFillObject, styles.gradientBackground]}
          />

          {/* Glass effect overlay */}
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.8)',
              'rgba(255, 255, 255, 0.2)',
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.7 }}
            style={[StyleSheet.absoluteFillObject, styles.glassOverlay]}
          />

          {/* Top highlight */}
          <View style={styles.topHighlight} />
          
          {/* Bottom shadow line */}
          <View style={styles.bottomShadow} />
        </View>
      </Animated.View>
    </View>
  );
}

export function useBottomTabOverflow() {
  return Platform.OS === 'ios' ? 0 : 0;
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 15 : 8,
    paddingHorizontal: 20,
  },
  glowContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 12 : 5,
    width: '85%', 
    height: 70,
    borderRadius: 40,
  },
  islandContainer: {
    width: '98%', 
    height: 60,
    borderRadius: 35,
    overflow: 'hidden',
  },
  backgroundLayer: {
    flex: 1,
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: Platform.OS === 'ios' ? 12 : 8 
    },
    shadowOpacity: Platform.OS === 'ios' ? 0.25 : 0.35,
    shadowRadius: Platform.OS === 'ios' ? 25 : 15,
    elevation: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 211, 69, 0.3)',
  },
  gradientBackground: {
    borderRadius: 35,
  },
  glassOverlay: {
    borderRadius: 35,
    height: '60%',
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  bottomShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
});
