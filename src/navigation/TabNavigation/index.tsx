import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { BottomParamList } from '@types';
//import { usePopup } from 'Context';
import * as React from 'react';
import { Alert } from 'react-native';


import CustomTab from '../CustomTab';


const Tab = createBottomTabNavigator<BottomParamList>();
const Stack = createStackNavigator();
const BottomNavigation = () => {
  //const { show } = usePopup();
  return (
    <Tab.Navigator
      backBehavior={'history'}
      initialRouteName={'Contents'}
      tabBar={(props) => <CustomTab {...props} />}
    >
      
    </Tab.Navigator>
  );
};

export default BottomNavigation;