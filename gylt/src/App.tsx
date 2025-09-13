// src/App.tsx
import React from "react";
import { StatusBar } from "react-native";
import { Provider as PaperProvider, MD3DarkTheme } from "react-native-paper";
import ModuleContainer from "./navigation/ModuleContainer";

/**
 * Wrap the application in PaperProvider to enable react-native-paper components
 * with a consistent theme across modules.
 */
export default function App() {
  const theme = {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      background: "#2e2e2e",
      surface: "#333333",
      surfaceVariant: "#424242",
    },
  };

  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle="light-content" />
      <ModuleContainer />
    </PaperProvider>
  );
}
