// src/navigation/ModuleContainer.tsx
import React, { useMemo } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getEnabledModules } from "../modules/registry";
import { Text } from "react-native";

type TabParamList = Record<string, undefined>;
const Tab = createBottomTabNavigator<TabParamList>();

export default function ModuleContainer() {
  // modules nur einmal berechnen (falls getEnabledModules() stabil ist)
  const mods = useMemo(() => getEnabledModules(), []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerTitleAlign: "center",
          tabBarLabelStyle: { fontSize: 12 },
        }}
      >
        {mods.map((m) => (
          <Tab.Screen
            key={m.id}
            name={m.title}
            component={m.component}
            options={(_props) => ({
              // Tipp: später @expo/vector-icons nutzen (keine nackten Strings!)
              tabBarIcon: () => <Text>⬤</Text>,
              tabBarTestID: `tab-${m.id}`, // nützlich fürs Debug/Tests
            })}
          />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
