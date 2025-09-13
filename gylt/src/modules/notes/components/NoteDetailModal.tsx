import React, { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity} from "react-native";
import { useTheme, Button } from "react-native-paper";

type Props = {
  visible: boolean;
  initialTitle: string;
  initialBody: string;
  initialFavorite: boolean;
  onClose: () => void;
  onSave: (title: string, body: string, favorite: boolean) => void;
};

export function NoteDetailModal({
  visible, initialTitle, initialBody, initialFavorite, onClose, onSave
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [fav, setFav] = useState(initialFavorite);

  const theme = useTheme();
  const c = theme.colors;

  useEffect(() => {
    if (visible) {
      setTitle(initialTitle);
      setBody(initialBody);
      setFav(initialFavorite);
    }
  }, [visible, initialTitle, initialBody, initialFavorite]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, padding: 12, gap: 10, backgroundColor: c.background }}>
        
        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#fff" }}>Notizen</Text>
          <TouchableOpacity onPress={() => setFav(v => !v)} accessibilityLabel="Favorisieren">
            <Text style={{ fontSize: 22, color: fav ? c.primary : "#999" }}>
              {fav ? "★" : "☆"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Titel */}
        <TextInput
          placeholder="Titel"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
          cursorColor={c.primary}
          style={{
            borderWidth: 1,
            borderColor: c.primary,
            borderRadius: 10,
            padding: 10,
            color: "#fff"
          }}
        />

        {/* Beschreibung füllt Rest */}
        <TextInput
          placeholder="Beschreibung"
          placeholderTextColor="#999"
          value={body}
          onChangeText={setBody}
          multiline
          scrollEnabled
          textAlignVertical="top"
          cursorColor={c.primary}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: c.primary,
            borderRadius: 10,
            padding: 10,
            color: "#fff"
          }}
        />

        {/* Speichern-Button (unverändert) */}
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <Button mode="contained" onPress={() => onSave(title.trim(), body.trim(), fav)}> Speichern </Button>
        </View>
      </View>
    </Modal>
  );
}
