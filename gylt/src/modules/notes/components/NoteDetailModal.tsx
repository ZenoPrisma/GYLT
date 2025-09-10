import React, { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, Button } from "react-native";

type Props = {
  visible: boolean;
  initialTitle: string;
  initialBody: string;
  initialFavorite: boolean;
  onClose: () => void;
  onSave: (title: string, body: string, favorite: boolean) => void;
};

export function NoteDetailModal({ visible, initialTitle, initialBody, initialFavorite, onClose, onSave }: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [fav, setFav] = useState(initialFavorite);

  useEffect(() => {
    if (visible) { setTitle(initialTitle); setBody(initialBody); setFav(initialFavorite); }
  }, [visible, initialTitle, initialBody, initialFavorite]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, padding: 12, gap: 10 }}>
        {/* Kopfzeile bis ganz oben */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>Notizen</Text>
          <TouchableOpacity onPress={() => setFav(v => !v)} accessibilityLabel="Favorisieren">
            <Text style={{ fontSize: 22 }}>{fav ? "★" : "☆"}</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Titel"
          value={title}
          onChangeText={setTitle}
          style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 10 }}
        />

        {/* Body füllt den Rest vollständig; eigenes Scrollen via TextInput */}
        <View style={{ flex: 1 }}>
          <TextInput
            placeholder="Beschreibung"
            value={body}
            onChangeText={setBody}
            multiline
            scrollEnabled
            textAlignVertical="top"
            style={{
              flex: 1,                               // << füllt fast den kompletten Dialog
              borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 10,
            }}
          />
        </View>

        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <Button title="Speichern" onPress={() => onSave(title.trim(), body.trim(), fav)} />
        </View>
      </View>
    </Modal>
  );
}
