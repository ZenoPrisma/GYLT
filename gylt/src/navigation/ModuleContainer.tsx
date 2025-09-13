// src/navigation/ModuleContainer.tsx
import React, { useMemo } from "react";
import { NavigationContainer, DarkTheme as NavDarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getEnabledModules } from "../modules/registry";
import { useTheme, Icon } from "react-native-paper";

type TabParamList = Record<string, undefined>;
const Tab = createBottomTabNavigator<TabParamList>();

export default function ModuleContainer() {
  // modules nur einmal berechnen (falls getEnabledModules() stabil ist)
  const mods = useMemo(() => getEnabledModules(), []);
  const theme = useTheme();
  const navTheme = {
    ...NavDarkTheme,
    colors: {
      ...NavDarkTheme.colors,
      background: theme.colors.background,
      card: theme.colors.elevation.level2,
      text: theme.colors.onSurface,
      primary: theme.colors.primary,
      border: theme.colors.outline,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerTitleAlign: "center",
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { backgroundColor: theme.colors.elevation.level2 },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
          headerStyle: { backgroundColor: theme.colors.elevation.level2 },
          headerTintColor: theme.colors.onSurface,
        }}
      >
        {mods.map((m) => (
          <Tab.Screen
            key={m.id}
            name={m.title}
            component={m.component}
            options={(_props) => ({
              tabBarIcon: ({ color, size }) =>
                m.tabIcon ? <Icon source={m.tabIcon} color={color} size={size} /> : undefined,
              tabBarTestID: `tab-${m.id}`, // nützlich fürs Debug/Tests
            })}
          />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
