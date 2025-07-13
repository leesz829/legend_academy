import { createStackNavigator } from '@react-navigation/stack';
import { StackParamList } from '@types';
import BottomNavigation from '../TabNavigation';
import React from 'react';


const CommonStack = createStackNavigator<StackParamList>();

const CommonNavigation = () => {
  return (
    <CommonStack.Navigator screenOptions={{ headerShown: false }}>
      <CommonStack.Screen name="Main" component={BottomNavigation} />
    </CommonStack.Navigator>
  );
};

export default CommonNavigation;
