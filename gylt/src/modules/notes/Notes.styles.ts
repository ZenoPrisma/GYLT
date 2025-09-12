import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  search: { flex: 1 },
  grid: {},
  noteCard: { flex: 1, margin: 6, borderRadius: 12 },
  selected: { borderWidth: 2, borderColor: "#1f75fe" },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
  },
  cardHeaderLeft: { flexDirection: "row", alignItems: "center", flexShrink: 1 },
  cardTitle: { flexShrink: 1 },
  cardIcon: { marginHorizontal: 4 },
  cardActions: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  noteMeta: { fontSize: 12, color: "#bbb" },
  fab: { position: "absolute", right: 16, bottom: 80 },
  selectionInline: {
    alignSelf: "stretch",
    backgroundColor: "#3a3a3a",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: "center",
    marginBottom: 6,
  },
  actionBar: { position: "absolute", left: 0, right: 0, bottom: 0 },
  actionRow: { flexDirection: "row", justifyContent: "space-around" },
});
