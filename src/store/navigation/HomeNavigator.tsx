import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../../screens/HomeScreen';
import RegisterTechnicScreen from '../../screens/RegisterTechnicScreen';
import SyncScreen from '../../screens/SyncScreen';

const Stack = createNativeStackNavigator();

export default function HomeNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Головна сторінка' }} />
        <Stack.Screen name="RegisterTechnic" component={RegisterTechnicScreen} />
        <Stack.Screen name="Sync" component={SyncScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
