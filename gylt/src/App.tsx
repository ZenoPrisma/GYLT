// src/App.tsx
import React from "react";
import { StatusBar } from "react-native";
import ModuleContainer from "./navigation/ModuleContainer";

export default function App() {
  return (
    <>
      <StatusBar />
      <ModuleContainer />
    </>
  );
}
