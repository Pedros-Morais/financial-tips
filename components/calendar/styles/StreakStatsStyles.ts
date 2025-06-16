import { StyleSheet } from 'react-native';

export const streakStatsStyles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  achievementBadges: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  badgeEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  badgeLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  card: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    minWidth: 80,
  },
  number: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  emoji: {
    fontSize: 20,
    marginTop: 5,
  },
  dailyChallengeContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 20,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  challengeReward: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 4,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 10,
  },
  challengeButton: {
    backgroundColor: '#10B981',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  challengeButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
