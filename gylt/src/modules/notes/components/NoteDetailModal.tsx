import React, { useEffect, useState } from "react";
import { View, TextInput as RNTextInput } from "react-native";
import { Portal, Modal, Button, Appbar, Surface, useTheme } from "react-native-paper";

type Props = {
  visible: boolean;
  initialTitle: string;
  initialBody: string;
  initialFavorite: boolean;
  onClose: () => void;
  onSave: (title: string, body: string, favorite: boolean) => void;
};

export function NoteDetailModal({
  visible,
  initialTitle,
  initialBody,
  initialFavorite,
  onClose,
  onSave,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [fav, setFav] = useState(initialFavorite);
  const theme = useTheme();

  useEffect(() => {
    if (visible) {
      setTitle(initialTitle);
      setBody(initialBody);
      setFav(initialFavorite);
    }
  }, [visible]);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={{ flex: 1, margin: 16 }}
      >
        <Surface style={{ flex: 1, borderRadius: 20, overflow: "hidden" }} elevation={2}>
          <Appbar.Header>
            <Appbar.Content title="Notiz" />
            <Appbar.Action
              icon={fav ? "star" : "star-outline"}
              onPress={() => setFav(v => !v)}
              accessibilityLabel="Favorisieren"
            />
          </Appbar.Header>
          <View style={{ flex: 1, padding: 16 }}>
            <RNTextInput
              placeholder="Titel"
              value={title}
              onChangeText={setTitle}
              style={{
                borderWidth: 1,
                borderColor: theme.colors.outline,
                borderRadius: 4,
                padding: 12,
                marginBottom: 8,
              }}
              autoCorrect={false}
            />
            <RNTextInput
              placeholder="Beschreibung"
              value={body}
              onChangeText={setBody}
              multiline
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: theme.colors.outline,
                borderRadius: 4,
                padding: 12,
                textAlignVertical: "top",
                marginBottom: 8,
              }}
              autoCorrect={false}
            />
            <Button
              mode="contained"
              onPress={() => onSave(title.trim(), body.trim(), fav)}
            >
              Speichern
            </Button>
          </View>
        </Surface>
      </Modal>
    </Portal>
  );
}

