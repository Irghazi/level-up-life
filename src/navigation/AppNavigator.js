import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import TodoScreen from '../screens/TodoScreen';
import ChatScreen from '../screens/ChatScreen';
import CreateTodoScreen from '../screens/CreateTodoScreen';
import CalendarTodoScreen from '../screens/CalendarTodoScreen';
import GuildScreen from '../screens/GuildScreen';
import CreateGuildScreen from '../screens/CreateGuildScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AccountSecurityScreen from '../screens/AccountSecurityScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import LanguageScreen from '../screens/LanguageScreen';
import SettingsDetailScreen from '../screens/SettingsDetailScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4A6CF7" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Todo" component={TodoScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="CreateTodo" component={CreateTodoScreen} />
            <Stack.Screen name="CalendarTodo" component={CalendarTodoScreen} />
            <Stack.Screen name="Guild" component={GuildScreen} />
            <Stack.Screen name="CreateGuild" component={CreateGuildScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="AccountSecurity" component={AccountSecurityScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Language" component={LanguageScreen} />
            <Stack.Screen name="SettingsDetail" component={SettingsDetailScreen} />
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F7FF',
  },
});

export default AppNavigator;
