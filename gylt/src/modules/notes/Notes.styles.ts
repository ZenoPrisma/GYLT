// src/modules/notes/Notes.styles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  search: {
    flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  filterBtn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: "#ddd" },

  // Grid
  grid: {},
  noteCard: {
    flex: 1, aspectRatio: 1, borderRadius: 14, borderWidth: 1, borderColor: "#e6e6e6",
    padding: 10, margin: 6, backgroundColor: "white", justifyContent: "space-between",
  },
  noteTitle: { fontSize: 16, fontWeight: "600" },
  noteMeta: { fontSize: 12, color: "#666" },
  favBadge: { fontSize: 12 },
  selected: { borderColor: "#6aa7ff", borderWidth: 2 },

  // FAB
  fab: {
    position: "absolute", right: 16, bottom: 80,
    width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center",
    backgroundColor: "#1f75fe", elevation: 3,
  },
  fabText: { color: "white", fontSize: 26, marginTop: -2 },

  // Auswahl-Zähler (oben)
  selectionBanner: {
    position: "absolute", left: 12, right: 12, top: 8,
    backgroundColor: "#ffffffee", borderWidth: 1, borderColor: "#eaeaea", borderRadius: 10,
    paddingVertical: 6, paddingHorizontal: 10, alignSelf: "center",
    alignItems: "center",
  },
  selectionBannerText: { fontWeight: "600" },

  // Kompakte Bottom-Aktionsleiste
  actionBar: {
    position: "absolute", left: 0, right: 0, bottom: 0,
    backgroundColor: "#fff", borderTopWidth: 1, borderColor: "#eee",
    paddingHorizontal: 12, paddingTop: 6, paddingBottom: 8,
  },
  actionRow: { flexDirection: "row", justifyContent: "space-around" },
  actionBtnSmall: {
    alignItems: "center", justifyContent: "center",
    paddingVertical: 6, paddingHorizontal: 10, minWidth: 72,
  },
  actionIcon: { fontSize: 16, marginBottom: 2 },
  actionLabel: { fontSize: 12 },

  selectionInline: {
    alignSelf: "stretch",
    backgroundColor: "#ffffff",
    borderWidth: 1, borderColor: "#eaeaea",
    borderRadius: 10,
    paddingVertical: 6, paddingHorizontal: 10,
    alignItems: "center",
    marginBottom: 6,   // sitzt unter der Suche, über dem Grid
  },

  sortBtn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: "#ddd" },

});

