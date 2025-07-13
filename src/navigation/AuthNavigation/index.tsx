import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from 'screens/Home';
import { ROUTES } from 'constants/routes';

const AuthStack = createNativeStackNavigator();

export default function AuthNavigation() {
  return (
    <AuthStack.Navigator
      initialRouteName={ROUTES.HOME}
      screenOptions={{ headerShown: false }}
    >
      <AuthStack.Screen name={ROUTES.HOME} component={Home} />
    </AuthStack.Navigator>
  );
}