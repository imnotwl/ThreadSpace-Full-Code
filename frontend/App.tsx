import React from "react";
import { NavigationContainer, DarkTheme, Theme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthProvider, useAuth } from "./src/auth/AuthContext";
import AuthStack from "./src/navigation/AuthStack";
import AppTabs from "./src/navigation/AppTabs";
import PostDetailScreen from "./src/screens/PostDetailScreen";
import EditPostScreen from "./src/screens/EditPostScreen";
import { RootStackParamList } from "./src/navigation/types";
import { colors } from "./src/ui/theme";

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.card,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
    notification: colors.primary,
  },
};

function RootNavigator() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      {token ? (
        <>
          {/* Main app tabs */}
          <Stack.Screen
            name="App"
            component={AppTabs}
            options={{ headerShown: false }}
          />

          {/* View post */}
          <Stack.Screen
            name="PostDetail"
            component={PostDetailScreen}
            options={{ title: "Post" }}
          />

          {/* Create / Edit post */}
          <Stack.Screen
            name="EditPost"
            component={EditPostScreen}
            options={{ title: "Post Editor" }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Auth"
          component={AuthStack}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer theme={navTheme}>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
