import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NotificationsScreen from '@/components/Notifications/NotificationsScreen';
import TrustedConnectionsScreen from '@/components/Recovery/TrustedConnectionsScreen';
import BackupScreen from '@/components/Recovery/BackupScreen';

const Stack = createStackNavigator();

const Notifications = () => (
  <Stack.Navigator>
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen
      name="TrustedConnections"
      component={TrustedConnectionsScreen}
    />
    <Stack.Screen name="Backup" component={BackupScreen} />
  </Stack.Navigator>
);

export default Notifications;
