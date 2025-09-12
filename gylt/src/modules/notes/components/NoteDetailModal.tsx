import React, { useEffect, useRef, useState, memo } from "react";
import { Modal, View, TextInput as RNTextInput, Text, TouchableOpacity } from "react-native";
import { Surface, Appbar, Button } from "react-native-paper";

type Props = {
  visible: boolean;
  initialTitle: string;
  initialBody: string;
  initialFavorite: boolean;
  onClose: () => void;
  onSave: (title: string, body: string, favorite: boolean) => void;
};

export const NoteDetailModal = memo(function NoteDetailModal({
  visible, initialTitle, initialBody, initialFavorite, onClose, onSave
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [fav, setFav] = useState(initialFavorite);

  // nur beim Öffnen/Prop-Change resetten – kein Effekt beim Tippen
  useEffect(() => {
    if (visible) { setTitle(initialTitle); setBody(initialBody); setFav(initialFavorite); }
  }, [visible, initialTitle, initialBody, initialFavorite]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent={false}>
      <Surface style={{ flex: 1, borderRadius: 0 /* keine teure Clip-Rundung */, elevation: 0 }}>
        <Appbar.Header>
          <Appbar.Content title="Notizen" />
          <Appbar.Action icon={fav ? "star" : "star-outline"} onPress={() => setFav(v => !v)} />
          <Appbar.Action icon="close" onPress={onClose} />
        </Appbar.Header>

        <View style={{ flex: 1, padding: 12 }}>
          {/* Titel: Paper weglassen → nativer RN Input */}
          <RNTextInput
            placeholder="Titel"
            value={title}
            onChangeText={setTitle}
            style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 10, marginBottom: 10 }}
            autoCorrect={false}
            autoComplete="off"
            autoCapitalize="sentences"
            underlineColorAndroid="transparent"
          />

          {/* Body: reine RN-Variante, begrenzte Höhe statt flex:1 */}
          <RNTextInput
            placeholder="Beschreibung"
            value={body}
            onChangeText={setBody}
            multiline
            scrollEnabled
            textAlignVertical="top"
            style={{ minHeight: 180, maxHeight: 360, borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 10, marginBottom: 12 }}
            autoCorrect={false}
            autoComplete="off"
            autoCapitalize="sentences"
            underlineColorAndroid="transparent"
            importantForAutofill="no"
            disableFullscreenUI
          />

          <Button mode="contained" onPress={() => onSave(title.trim(), body.trim(), fav)}>
            Speichern
          </Button>
        </View>
      </Surface>
    </Modal>
  );
});
