// src/modules/notes/components/CreateNoteModal.tsx
import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { useTheme, Button } from "react-native-paper";
import { DEFAULT_NOTE_PIN } from "../Notes.constants";

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreate: (title: string, body: string, favorite: boolean, locked: boolean, notePin?: string) => void;
};

export function CreateNoteModal({ visible, onClose, onCreate }: Props) {
  const theme = useTheme();
  const c = theme.colors as any;

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

  const baseInputStyle = {
    borderWidth: 1,
    borderColor: c.primary,
    backgroundColor: c.surface,
    color: c.onSurface,
    borderRadius: 10,
    padding: 10,
  } as const;

  const placeholderColor = c.onSurfaceVariant ?? c.onSurface;
  const selectionColor = c.primary;
  const underlineTransparent = "transparent";

  // Textfarbe für den (aktiven) Button in demselben Grau wie disabled:
  const buttonTextGrey = c.onSurfaceDisabled ?? "#9E9E9E";

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.25)", justifyContent: "flex-end" }}>
        <View
          style={{
            backgroundColor: c.surface,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 16,
            gap: 12,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: c.onSurface }}>Neue Notiz</Text>
            <View style={{ flexDirection: "row", gap: 16 }}>
              <TouchableOpacity onPress={() => setFavorite(f => !f)} accessibilityLabel="Favorisieren">
                <Text
                  style={{
                    fontSize: 22,
                    // Lieblingsfarbe: lila, sonst dezenter Text
                    color: favorite ? c.primary : (c.onSurfaceVariant ?? c.onSurface),
                  }}
                >
                  {favorite ? "★" : "☆"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setLocked(l => !l); setPin(""); }}
                accessibilityLabel="Sichern"
              >
                <Text style={{ fontSize: 22, color: c.onSurface }}>{locked ? "🔒" : "🔓"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            placeholder="Titel"
            value={title}
            onChangeText={setTitle}
            style={baseInputStyle}
            placeholderTextColor={placeholderColor}
            selectionColor={selectionColor}
            cursorColor={selectionColor}
            autoCorrect={false}
            autoComplete="off"
            autoCapitalize="sentences"
            underlineColorAndroid={underlineTransparent}
          />

          <TextInput
            placeholder="Beschreibung"
            value={body}
            onChangeText={setBody}
            multiline
            textAlignVertical="top"
            scrollEnabled
            style={[baseInputStyle, { minHeight: 120 }]}
            placeholderTextColor={placeholderColor}
            selectionColor={selectionColor}
            cursorColor={selectionColor}
            autoCorrect={false}
            autoComplete="off"
            autoCapitalize="sentences"
            underlineColorAndroid={underlineTransparent}
          />

          {locked && (
            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontWeight: "600", color: c.onSurface }}>PIN (nur Ziffern, min. 4)</Text>
                <TouchableOpacity onPress={fillDefaultPin} accessibilityLabel="Standard-PIN einfügen">
                  <Text style={{ fontSize: 14, textDecorationLine: "underline", color: c.primary }}>StandardPW</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                placeholder="PIN"
                value={pin}
                onChangeText={onChangePin}
                keyboardType="number-pad"
                inputMode="numeric"
                secureTextEntry
                maxLength={12}
                style={baseInputStyle}
                placeholderTextColor={placeholderColor}
                selectionColor={selectionColor}
                cursorColor={selectionColor}
                autoCorrect={false}
                autoComplete="off"
                underlineColorAndroid={underlineTransparent}
              />
            </View>
          )}

          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Button
              // Android: 'color' steuert die Textfarbe.
              mode="contained"
              disabled={!canCreate()}
              onPress={() => {
                onCreate(title.trim(), body.trim(), favorite, locked, locked ? pin : undefined);
                onClose();
              }}
            > Erstellen </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
