import React, { useState } from "react";
import { View } from "react-native";
import { Surface, IconButton, Portal, Dialog, TextInput, Button } from "react-native-paper";
import { styles } from "../Notes.styles";

type Props = {
  anyLocked: boolean;
  hasPin: boolean;
  onDelete: () => void;
  onToggleLockWithPin: (pin: string) => void;
};

export function BottomActionBar({ anyLocked, hasPin, onDelete, onToggleLockWithPin }: Props) {
  const [pinModal, setPinModal] = useState(false);
  const [pin, setPin] = useState("");

  return (
    <>
      <Surface style={styles.actionBar} elevation={4}>
        <View style={styles.actionRow}>
          <IconButton icon={anyLocked ? "lock-open" : "lock"} onPress={() => setPinModal(true)} accessibilityLabel={anyLocked ? "Entsichern" : "Sichern"} />
          <IconButton icon="delete" onPress={onDelete} accessibilityLabel="Löschen" />
        </View>
      </Surface>

      <Portal>
        <Dialog visible={pinModal} onDismiss={() => setPinModal(false)}>
          <Dialog.Title>{hasPin ? "PIN eingeben" : "Neue PIN festlegen"}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="PIN (min. 4 Ziffern)"
              value={pin}
              onChangeText={setPin}
              keyboardType="number-pad"
              secureTextEntry
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                if (pin.trim().length < 4) return;
                onToggleLockWithPin(pin.trim());
                setPin("");
                setPinModal(false);
              }}
            >
              OK
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
