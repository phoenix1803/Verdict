import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ColdOpen } from '../screens/ColdOpen';
import { TodayVerdict } from '../screens/TodayVerdict';
import { Evidence } from '../screens/Evidence';
import { Archive } from '../screens/Archive';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="ColdOpen" component={ColdOpen} />
        <Stack.Screen name="TodayVerdict" component={TodayVerdict} />
        <Stack.Screen name="Evidence" component={Evidence} />
        <Stack.Screen name="Archive" component={Archive} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
