import { StyleSheet } from 'react-native';

export const calendarHeaderStyles = StyleSheet.create({
  container: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  accent1: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFD700',
    opacity: 0.2,
  },
  accent2: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFC107',
    opacity: 0.2,
  },
  content: {
    zIndex: 1,
    padding: 20,
  },
  monthText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 5,
  },
  progressSection: {
    marginTop: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F9FAFB',
    overflow: 'hidden',
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F9FAFB',
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 10,
    marginTop: 5,
  },
  nextMilestone: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 10,
    textAlign: 'center',
  },
});
