import React from 'react';
import { View, Text } from 'react-native';
import Animated, { SlideInUp } from 'react-native-reanimated';
import { activityLegendStyles } from './styles/ActivityLegendStyles';

interface ActivityType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface ActivityLegendProps {
  activityTypes: ActivityType[];
}

export const ActivityLegend: React.FC<ActivityLegendProps> = ({ activityTypes }) => {
  return (
    <Animated.View 
      style={activityLegendStyles.container}
      entering={SlideInUp.delay(600).duration(600)}
    >
      <Text style={activityLegendStyles.title}>Activity Types</Text>
      
      <View style={activityLegendStyles.grid}>
        {activityTypes.map((activity) => (
          <View key={activity.id} style={activityLegendStyles.item}>
            <View 
              style={[
                activityLegendStyles.dot,
                { backgroundColor: activity.color }
              ]} 
            />
            <Text style={activityLegendStyles.text}>{activity.name}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
};
