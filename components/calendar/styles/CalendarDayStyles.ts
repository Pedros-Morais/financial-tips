import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export const calendarDayStyles = StyleSheet.create({
  container: {
    width: (screenWidth - 80) / 7,
    height: (screenWidth - 80) / 7,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    position: 'relative',
  },
  activeBackground: {
    backgroundColor: '#10B981',
  },
  todayBorder: {
    borderColor: '#10B981',
    borderWidth: 2,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  activeDayText: {
    color: '#fff',
  },
  todayText: {
    color: '#10B981',
  },
  activityDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    position: 'absolute',
    bottom: 4,
  },
  activityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 1,
  },
  moreActivities: {
    fontSize: 8,
    color: '#6B7280',
    marginLeft: 2,
  },
  activityCountBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityCountText: {
    fontSize: 10,
    color: '#fff',
  },
  streakIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakFire: {
    fontSize: 10,
  },
  todayIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayDot: {
    fontSize: 8,
    color: '#fff',
  },
});
