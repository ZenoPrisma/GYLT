// src/App.tsx
import React from "react";
import { StatusBar } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import ModuleContainer from "./navigation/ModuleContainer";

/**
 * Wrap the application in PaperProvider to enable react-native-paper components
 * with a consistent theme across modules.
 */
export default function App() {
  return (
    <PaperProvider>
      <StatusBar />
      <ModuleContainer />
    </PaperProvider>
  );
}
