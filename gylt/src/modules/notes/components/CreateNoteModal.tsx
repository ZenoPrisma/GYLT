// src/modules/notes/components/CreateNoteModal.tsx
import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Portal, Modal, TextInput, Button, IconButton, Text, Surface } from "react-native-paper";
import { DEFAULT_NOTE_PIN } from "../Notes.constants";

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreate: (title: string, body: string, favorite: boolean, locked: boolean, notePin?: string) => void;
};

export function CreateNoteModal({ visible, onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [locked, setLocked] = useState(false);
  const [pin, setPin] = useState("");

  useEffect(() => {
    if (!visible) { setTitle(""); setBody(""); setFavorite(false); setLocked(false); setPin(""); }
  }, [visible]);

  const onChangePin = (v: string) => setPin(v.replace(/\D+/g, ""));
  const canCreate = () => !(locked && pin.length < 4);
  const fillDefaultPin = () => setPin(DEFAULT_NOTE_PIN);

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={{ margin: 16 }}>
        <Surface style={{ padding: 16, borderRadius: 20 }} elevation={2}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <Text variant="titleMedium">Neue Notiz</Text>
            <View style={{ flexDirection: "row" }}>
              <IconButton
                icon={favorite ? "star" : "star-outline"}
                onPress={() => setFavorite(f => !f)}
                accessibilityLabel="Favorisieren"
              />
              <IconButton
                icon={locked ? "lock" : "lock-open"}
                onPress={() => {
                  setLocked(l => !l);
                  setPin("");
                }}
                accessibilityLabel="Sichern"
              />
            </View>
          </View>

          <TextInput
            mode="outlined"
            label="Titel"
            value={title}
            onChangeText={setTitle}
            style={{ marginBottom: 8 }}
          />
          <TextInput
            mode="outlined"
            label="Beschreibung"
            value={body}
            onChangeText={setBody}
            multiline
            style={{ marginBottom: 8, minHeight: 120 }}
          />

          {locked && (
            <View style={{ marginBottom: 8 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text>PIN (nur Ziffern, min. 4)</Text>
                <Button onPress={fillDefaultPin} compact>StandardPW</Button>
              </View>
              <TextInput
                mode="outlined"
                label="PIN"
                value={pin}
                onChangeText={onChangePin}
                keyboardType="number-pad"
                secureTextEntry
                maxLength={12}
              />
            </View>
          )}

          <Button
            mode="contained"
            onPress={() => {
              onCreate(title.trim(), body.trim(), favorite, locked, locked ? pin : undefined);
              onClose();
            }}
            disabled={!canCreate()}
          >
            Erstellen
          </Button>
        </Surface>
      </Modal>
    </Portal>
  );
}
