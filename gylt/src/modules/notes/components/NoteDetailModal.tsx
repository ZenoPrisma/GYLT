import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Portal, Modal, TextInput, Button, Appbar } from "react-native-paper";

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
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <Appbar.Header>
            <Appbar.Content title="Notiz" />
            <Appbar.Action icon={fav ? "star" : "star-outline"} onPress={() => setFav(v => !v)} accessibilityLabel="Favorisieren" />
          </Appbar.Header>
          <View style={{ flex: 1, padding: 16 }}>
            <TextInput label="Titel" value={title} onChangeText={setTitle} style={{ marginBottom: 8 }} />
            <TextInput label="Beschreibung" value={body} onChangeText={setBody} multiline style={{ flex: 1, marginBottom: 8 }} />
            <Button mode="contained" onPress={() => onSave(title.trim(), body.trim(), fav)}>Speichern</Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
}
