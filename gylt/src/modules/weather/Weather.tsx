// src/modules/weather/Weather.tsx
import React from "react";
import { View, Text } from "react-native";
import { styles } from ".//Weather.styles";

export function WeatherScreen() {
  // Später: echte Wetter-API, Standort etc.
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wetter</Text>
      <Text>Hier kommt später die aktuelle Vorhersage hin.</Text>
    </View>
  );
}
