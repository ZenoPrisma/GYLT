// src/modules/notes/components/CreateNoteModal.tsx
import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, Button, TouchableOpacity } from "react-native";
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

  const onChangePin = (v: string) => setPin(v.replace(/\D+/g, "")); // nur Ziffern
  const canCreate = () => !(locked && pin.length < 4);

  const fillDefaultPin = () => setPin(DEFAULT_NOTE_PIN);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
      <View style={{ flex:1, backgroundColor:"rgba(0,0,0,0.25)", justifyContent:"flex-end" }}>
        <View style={{ backgroundColor:"#fff", padding:16, borderTopLeftRadius:16, borderTopRightRadius:16, gap:12 }}>
          <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center" }}>
            <Text style={{ fontSize:18, fontWeight:"600" }}>Neue Notiz</Text>
            <View style={{ flexDirection:"row", gap:16 }}>
              <TouchableOpacity onPress={() => setFavorite(f => !f)} accessibilityLabel="Favorisieren">
                <Text style={{ fontSize:22 }}>{favorite ? "★" : "☆"}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setLocked(l => !l); setPin(""); }} accessibilityLabel="Sichern">
                <Text style={{ fontSize:22 }}>{locked ? "🔒" : "🔓"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            placeholder="Titel"
            value={title}
            onChangeText={setTitle}
            style={{ borderWidth:1, borderColor:"#ddd", borderRadius:10, padding:10 }}
          />

          <TextInput
            placeholder="Beschreibung"
            value={body}
            onChangeText={setBody}
            multiline
            textAlignVertical="top"
            style={{ borderWidth:1, borderColor:"#ddd", borderRadius:10, padding:10, minHeight:120 }}
          />

          {locked && (
            <View style={{ gap:8 }}>
              <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center" }}>
                <Text style={{ fontWeight:"600" }}>PIN (nur Ziffern, min. 4)</Text>
                <TouchableOpacity onPress={fillDefaultPin} accessibilityLabel="Standard-PIN einfügen">
                  <Text style={{ fontSize:14, textDecorationLine:"underline" }}>StandardPW</Text>
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
                style={{ borderWidth:1, borderColor:"#ddd", borderRadius:10, padding:10 }}
              />
            </View>
          )}

          <View style={{ flexDirection:"row", justifyContent:"flex-end" }}>
            <Button
              title="Erstellen"
              disabled={!canCreate()}
              onPress={() => {
                onCreate(title.trim(), body.trim(), favorite, locked, locked ? pin : undefined);
                onClose();
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
