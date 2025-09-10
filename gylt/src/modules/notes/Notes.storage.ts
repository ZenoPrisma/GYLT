import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NotesState } from "./Notes.types";

const NOTES_KEY = "notes.v2";

export async function loadNotes(): Promise<NotesState> {
  const raw = await AsyncStorage.getItem(NOTES_KEY);
  return raw ? JSON.parse(raw) : { notes: [], pin: null };
}
export async function saveNotes(state: NotesState) {
  await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(state));
}
