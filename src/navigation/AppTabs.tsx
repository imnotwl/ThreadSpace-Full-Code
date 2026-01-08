import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedScreen from "../screens/FeedScreen";
import AccountScreen from "../screens/AccountScreen";
import type { AppTabsParamList } from "./types";

const Tabs = createBottomTabNavigator<AppTabsParamList>();

export default function AppTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0f1b33",
          borderTopColor: "rgba(255,255,255,0.10)",
        },
        tabBarActiveTintColor: "#5aa7ff",
        tabBarInactiveTintColor: "#9fb0d0",
      }}
    >
      <Tabs.Screen name="Feed" component={FeedScreen} options={{ title: "Feed" }} />
      <Tabs.Screen name="Account" component={AccountScreen} options={{ title: "Account" }} />
    </Tabs.Navigator>
  );
}
