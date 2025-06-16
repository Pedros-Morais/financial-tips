import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Dimensions } from 'react-native';

import { FloatingActionButton } from '@/components/FloatingActionButton';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { width } = Dimensions.get('window');
  const itemWidth = width / 5; // Distribute space equally for exactly 5 items

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFD345',
        headerShown: false,
        tabBarButton: props => <HapticTab {...props} itemWidth={itemWidth} />,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: 90,
            paddingTop: 5,
            paddingBottom: 20, // Account for safe area
            marginHorizontal: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            alignItems: 'center',
            justifyContent: 'space-around',
          },
          default: {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            height: 75,
            paddingTop: 3,
            paddingBottom: 10,
            marginHorizontal: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            shadowOpacity: 0,
            elevation: 0,
            alignItems: 'center',
            justifyContent: 'space-around',
          },
        }),
        tabBarLabelStyle: {
          fontSize: 0, // Hide labels
          height: 0,
          marginBottom: 0,
          marginTop: 0,
        },
        tabBarIconStyle: {
          marginTop: Platform.OS === 'ios' ? 5 : 3,
          marginBottom: -5,
        },
        tabBarItemStyle: {
          width: itemWidth,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 26 : 24} 
              name="house.fill" 
              color={focused ? '#FFD345' : '#999'} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 26 : 24} 
              name="calendar.circle.fill" 
              color={focused ? '#FFD345' : '#999'} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarButton: props => <FloatingActionButton {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={20} 
              name="plus" 
              color="#FFFFFF" 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 26 : 24} 
              name="chart.line.uptrend.xyaxis" 
              color={focused ? '#FFD345' : '#999'} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 26 : 24} 
              name="person.crop.circle.fill" 
              color={focused ? '#FFD345' : '#999'} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
