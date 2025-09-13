export type Note = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  favorite: boolean;
  locked: boolean;
  passHash?: string; // ← neu: Hash des Notiz-Passworts (pro Notiz)
};

export type NotesState = {
  notes: Note[];
  pin?: string | null; // App-PIN (später: SecureStore + Hash)
};
