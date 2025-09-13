// src/modules/weather/Weather.styles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 8 },
  search: { marginBottom: 8 },
  loading: { marginVertical: 8 },
  currentCard: { marginBottom: 8 },
  suggestionsCard: { marginBottom: 8 },
  forecastList: { paddingVertical: 8 },
  dayCard: { width: 120, marginRight: 8 },
  radarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  radar: { height: 300, marginTop: 8 },
});
