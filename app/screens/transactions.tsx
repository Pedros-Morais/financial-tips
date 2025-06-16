import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TransactionsScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#4CAF50', dark: '#1D3D47' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#FFFFFF"
          name="list.bullet.rectangle.fill"
          style={styles.headerImage}
        />
      }
      contentContainerStyle={styles.contentContainer}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Transaction History</ThemedText>
      </ThemedView>
      <ThemedText>
        View and manage all your financial transactions, track spending patterns, and analyze your financial behavior.
      </ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#FFFFFF',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contentContainer: {
    paddingBottom: 60,
  },
});
