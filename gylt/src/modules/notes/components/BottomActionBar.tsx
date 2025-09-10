// entfernt: Favorisieren-Button + Props allFavorite, onToggleFav
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, Button } from "react-native";
import { styles } from "../Notes.styles";

type Props = {
  selectedCount: number;
  anyLocked: boolean;
  hasPin: boolean;
  onDelete: () => void;
  onToggleLockWithPin: (pin: string) => void;
};

export function BottomActionBar({ selectedCount, anyLocked, hasPin, onDelete, onToggleLockWithPin }: Props) {
  const [pinModal, setPinModal] = useState(false);
  const [pin, setPin] = useState("");

  return (
    <>
      <View style={styles.actionBar}>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtnSmall} onPress={() => setPinModal(true)}>
            <Text style={styles.actionIcon}>{anyLocked ? "🔓" : "🔒"}</Text>
            <Text style={styles.actionLabel}>{anyLocked ? "Entsichern" : "Sichern"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtnSmall} onPress={onDelete}>
            <Text style={styles.actionIcon}>🗑️</Text>
            <Text style={styles.actionLabel}>Löschen</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={pinModal} transparent animationType="fade" onRequestClose={() => setPinModal(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.25)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: "#fff", padding: 16, width: "86%", borderRadius: 12, gap: 10 }}>
            <Text style={{ fontWeight: "600" }}>{hasPin ? "PIN eingeben" : "Neue PIN festlegen"}</Text>
            <TextInput
              placeholder="PIN (min. 4 Ziffern)"
              value={pin}
              onChangeText={setPin}
              keyboardType="number-pad"
              secureTextEntry
              style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 10 }}
            />
            <View style={{ flexDirection: "row", gap: 8, justifyContent: "flex-end" }}>
              <Button title="OK" onPress={() => {
                if (pin.trim().length < 4) return;
                onToggleLockWithPin(pin.trim());
                setPin(""); setPinModal(false);
              }} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
