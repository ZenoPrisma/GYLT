// src/navigation/ModuleContainer.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getEnabledModules } from "../modules/registry";
import { Text } from "react-native";

const Tab = createBottomTabNavigator();

export default function ModuleContainer() {
  const mods = getEnabledModules();

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
            options={{
              // später: Icons via react-native-vector-icons oder @expo/vector-icons
              tabBarIcon: () => <Text>⬤</Text>,
            }}
          />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
