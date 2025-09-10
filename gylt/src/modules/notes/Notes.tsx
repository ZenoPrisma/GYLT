// src/modules/notes/Notes.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, Alert } from "react-native";
import { styles } from "./Notes.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "notes.v1";

export function NotesScreen() {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Laden beim Start
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setNotes(JSON.parse(raw));
      } catch (e) {
        console.warn("Load notes failed", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // Speichern bei Änderungen (nachdem initial geladen wurde)
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      } catch (e) {
        console.warn("Save notes failed", e);
      }
    })();
  }, [notes, loaded]);

  const addNote = () => {
    if (!text.trim()) return;
    setNotes((n) => [text.trim(), ...n]);
    setText("");
  };

  const clearAll = async () => {
    Alert.alert("Alle Notizen löschen?", "Das kann nicht rückgängig gemacht werden.", [
      { text: "Abbrechen", style: "cancel" },
      { text: "Löschen", style: "destructive", onPress: () => setNotes([]) },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notizen</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Neue Notiz…"
          value={text}
          onChangeText={setText}
          onSubmitEditing={addNote}
          returnKeyType="done"
        />
        <Button title="Add" onPress={addNote} />
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item, idx) => item + idx}
        renderItem={({ item }) => <Text style={styles.noteItem}>• {item}</Text>}
        contentContainerStyle={{ gap: 8, paddingBottom: 24 }}
        ListEmptyComponent={<Text>Noch keine Notizen.</Text>}
      />

      <Button title="Alle löschen" onPress={clearAll} />
    </View>
  );
}
