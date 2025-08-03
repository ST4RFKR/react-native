import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../../screens/HomeScreen';
import RegisterTechnicScreen from '../../screens/RegisterTechnicScreen';
import SyncScreen from '../../screens/SyncScreen';
import WorkTimeTrackingScreen from '../../screens/WorkTimeTrackingScreen';

const Stack = createNativeStackNavigator();

export default function HomeNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Головна сторінка' }} />
        <Stack.Screen name="WorkTimeTracking" component={WorkTimeTrackingScreen} options={{ title: 'Облік робочого часу' }} />
        <Stack.Screen name="RegisterTechnic" component={RegisterTechnicScreen} options={{ title: 'Реєстрація техніки' }} />
        <Stack.Screen name="Sync" component={SyncScreen} options={{ title: 'Синхронізація' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
