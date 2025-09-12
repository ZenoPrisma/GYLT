import React, { useEffect, useMemo, useState, useCallback, memo } from "react";
import { View, FlatList, Alert } from "react-native";
import { Searchbar, IconButton, Card, Text, FAB, useTheme, Icon } from "react-native-paper";
import { canUseBiometrics, authWithBiometrics, hasStoredPin, verifyPin } from "./Notes.auth";
import { styles } from "./Notes.styles";
import { CreateNoteModal } from "./components/CreateNoteModal";
import { BottomActionBar } from "./components/BottomActionBar";
import { PinPromptModal } from "./components/PinPromptModal";
import { NoteDetailModal } from "./components/NoteDetailModal";
import { loadNotes, saveNotes } from "./Notes.storage";
import type { Note, NotesState } from "./Notes.types";
import * as Crypto from "expo-crypto";

const makeId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const fmtDate = (ms: number) => new Date(ms).toLocaleDateString();

export function NotesScreen() {
  const [state, setState] = useState<NotesState>({ notes: [], pin: null });
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [onlyFav, setOnlyFav] = useState(false);
  const [sortAsc, setSortAsc] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openNoteId, setOpenNoteId] = useState<string | null>(null);
  const openNote = state.notes.find(n => n.id === openNoteId) || null;
  const [askPinForId, setAskPinForId] = useState<string | null>(null);
  const [hasPin, setHasPin] = useState(false);
  const [pinMode, setPinMode] = useState<"set" | "verify">("verify");

  useEffect(() => { (async () => setHasPin(await hasStoredPin()))(); }, []);
  useEffect(() => { (async () => { setState(await loadNotes()); setLoaded(true); })(); }, []);
  useEffect(() => { if (loaded) saveNotes(state); }, [state, loaded]);

  const visibleNotes = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = state.notes
      .filter(n => (onlyFav ? n.favorite : true))
      .filter(n => (q ? (n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)) : true));
    filtered.sort((a, b) => (sortAsc ? a.createdAt - b.createdAt : b.createdAt - a.createdAt));
    return filtered;
  }, [state.notes, search, onlyFav, sortAsc]);

  const isAnySelected = selected.size > 0;
  const selectedNotes = useMemo(() => state.notes.filter(n => selected.has(n.id)), [state.notes, selected]);
  const anyLocked = selectedNotes.some(n => n.locked);

  const toggleSelect = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  // ERSTELLEN (hash der Notiz-PIN)
  const handleCreate = useCallback(async (title: string, body: string, favorite: boolean, locked: boolean, notePin?: string) => {
    let passHash: string | undefined = undefined;
    if (locked) {
      const digits = (notePin ?? "").replace(/\D+/g, "");
      if (digits.length < 4) return; // Guard: sollte nicht passieren, da Button disabled
      passHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, digits);
    }
    const note: Note = { id: makeId(), title, body, createdAt: Date.now(), favorite, locked, passHash };
    setState(s => ({ ...s, notes: [note, ...s.notes] }));
  }, []);

  // ÖFFNEN (Biometrie → Notiz-PIN → globale PIN [Altbestand])
  const handlePressNote = useCallback(async (note: Note) => {
    if (isAnySelected) { toggleSelect(note.id); return; }
    if (!note.locked) { setOpenNoteId(note.id); return; }

    if (await canUseBiometrics()) {
      const ok = await authWithBiometrics("Mit Fingerabdruck entsperren");
      if (ok) { setOpenNoteId(note.id); return; }
    }

    if (note.passHash) {
      setPinMode("verify");        // Notiz-PIN
      setAskPinForId(note.id);
      return;
    }

    // Altbestand ohne passHash → globale PIN (falls vorhanden)
    const exists = await hasStoredPin();
    setPinMode(exists ? "verify" : "set");
    setAskPinForId(note.id);
  }, [isAnySelected, toggleSelect]);

  const onToggleLockWithPin = useCallback(async (pin: string) => {
    const digits = (pin ?? "").replace(/\D+/g, "");
    const hash = digits.length >= 4
      ? await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, digits)
      : undefined;

    // Optional: globalen PIN für Altbestand prüfen (nur 1x)
    const globalOk = await (async () => {
      // wenn du keinen globalen PIN mehr nutzt, return false;
      try { return await verifyPin(digits); } catch { return false; }
    })();

    let unlocked = 0, failed = 0, lockedNew = 0;

    setState(s => {
      const notes = s.notes.map(n => {
        if (!selected.has(n.id)) return n;

        // TOGGLE: wenn aktuell gesperrt -> entsperren; sonst sperren
        if (n.locked) {
          // Entsperren: nur bei passendem Notiz-PIN bzw. (Altbestand) globalem PIN
          if (n.passHash) {
            if (hash && hash === n.passHash) {
              unlocked++;
              return { ...n, locked: false, passHash: undefined }; // Sperre komplett entfernen
            } else {
              failed++;
              return n; // falscher PIN, bleibt gesperrt
            }
          } else {
            // Altbestand ohne passHash
            if (globalOk) {
              unlocked++;
              return { ...n, locked: false, passHash: undefined };
            } else {
              failed++;
              return n;
            }
          }
        } else {
          // Sperren: nur mit gültigem PIN möglich
          if (hash) {
            lockedNew++;
            return { ...n, locked: true, passHash: n.passHash ?? hash };
          } else {
            // kein valider PIN -> ignorieren
            failed++;
            return n;
          }
        }
      });
      return { ...s, notes };
    });

    setSelected(new Set());

    if (unlocked || lockedNew || failed) {
      const parts = [];
      if (unlocked) parts.push(`${unlocked} entsperrt`);
      if (lockedNew) parts.push(`${lockedNew} gesperrt`);
      if (failed) parts.push(`${failed} fehlgeschlagen`);
      Alert.alert("Aktion", parts.join(", "));
    }
  }, [selected]);

  const handleLongPressNote = useCallback((id: string) => toggleSelect(id), [toggleSelect]);

  const applyToSelected = useCallback((fn: (n: Note) => Note | null) => {
    setState(s => ({ ...s, notes: s.notes.flatMap(n => (selected.has(n.id) ? (fn(n) ? [fn(n)!] : []) : [n])) }));
    setSelected(new Set());
  }, [selected]);

  const onDelete = useCallback(() => {
    Alert.alert("Löschen", "Ausgewählte Notizen löschen?", [
      { text: "Abbrechen", style: "cancel" },
      { text: "Löschen", style: "destructive", onPress: () => applyToSelected(() => null) },
    ]);
  }, [applyToSelected]);

  const saveOpenNote = useCallback((title: string, body: string, favorite: boolean) => {
    if (!openNote) return;
    setState(s => ({
      ...s,
      notes: s.notes.map(n => (n.id === openNote.id ? { ...n, title, body, favorite } : n)),
    }));
    setOpenNoteId(null);
  }, [openNote]);

  const theme = useTheme();

  const NoteCard = memo(({ item }: { item: Note }) => {
    const isSel = selected.has(item.id);
    return (
      <Card
        onLongPress={() => handleLongPressNote(item.id)}
        onPress={() => handlePressNote(item)}
        style={[styles.noteCard, isSel && styles.selected]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            {item.locked && (
              <View style={styles.cardIcon}>
                <Icon
                  source="lock"
                  size={16}
                  color={theme.colors.onSurfaceVariant}
                />
              </View>
            )}
            <Text
              variant="titleMedium"
              numberOfLines={1}
              style={styles.cardTitle}
            >
              {item.title}
            </Text>
          </View>
          <View style={styles.cardIcon}>
            <Icon
              source={item.favorite ? "star" : "star-outline"}
              size={16}
              color={item.favorite ? theme.colors.primary : theme.colors.onSurfaceVariant}
            />
          </View>
        </View>
        <Card.Content>
          <Text numberOfLines={3}>{item.locked ? "Geschützt" : item.body || " "}</Text>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <Text style={styles.noteMeta}>{fmtDate(item.createdAt)}</Text>
        </Card.Actions>
      </Card>
    );
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Suche + Favoriten- und Sort-Filter */}
      <View style={styles.headerRow}>
        <Searchbar
          style={styles.search}
          placeholder="Suchen (Titel, Beschreibung)…"
          value={search}
          onChangeText={setSearch}
        />
        <IconButton
          icon={onlyFav ? "star" : "star-outline"}
          onPress={() => setOnlyFav(f => !f)}
          accessibilityLabel="Favoriten filtern"
        />
        <IconButton
          icon={sortAsc ? "sort-ascending" : "sort-descending"}
          onPress={() => setSortAsc(v => !v)}
          accessibilityLabel="Sortieren"
        />
      </View>

      {/* Auswahl-Zähler zwischen Suche und Grid */}
      {isAnySelected && (
        <View style={styles.selectionInline}>
          <Text>{selected.size} ausgewählt</Text>
        </View>
      )}

      {/* Grid */}
      <FlatList
        data={visibleNotes}
        keyExtractor={(n) => n.id}
        renderItem={({ item }) => <NoteCard item={item} />}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 120 }}
        style={styles.grid}
        ListEmptyComponent={<Text>Keine Notizen.</Text>}
        removeClippedSubviews
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        updateCellsBatchingPeriod={50}
      />

      {/* FAB */}
      <FAB style={styles.fab} icon="plus" onPress={() => setCreateOpen(true)} />

      {/* Create + PIN + Detail */}
      <CreateNoteModal
        visible={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />

      <PinPromptModal
        visible={!!askPinForId}
        mode={pinMode}
        onCancel={() => setAskPinForId(null)}
        onSubmit={async (enteredRaw) => {
        const currentId = askPinForId;
        if (!currentId) return; // Sicherheitsnetz

        // nur Ziffern prüfen
        const entered = enteredRaw.replace(/\D+/g, "");
        if (entered.length < 4) return;

        const note = state.notes.find(n => n.id === currentId);
        if (!note) { setAskPinForId(null); return; }

        if (note.passHash) {
          const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, entered);
          if (hash !== note.passHash) { Alert.alert("Falscher PIN", "Bitte erneut versuchen."); return; }
          setOpenNoteId(note.id);
          setAskPinForId(null);
          return; // ← WICHTIG: kein Fallthrough
        }

        // Altbestand: globale PIN
        if (pinMode === "set") {
          // hier würdest du setPinIfMissing(entered) nutzen, falls du globalen PIN noch möchtest
          // await setPinIfMissing(entered);
          setOpenNoteId(note.id);
          setAskPinForId(null);
          return;
        }

        const ok = await verifyPin(entered);
        if (!ok) { Alert.alert("Falscher PIN", "Bitte erneut versuchen."); return; }
        setOpenNoteId(note.id);
        setAskPinForId(null);
      }}/>

      {/* BottomActionBar verwenden */}
      {isAnySelected && (
        <BottomActionBar
          anyLocked={selectedNotes.some(n => n.locked)}
          hasPin={hasPin}
          onDelete={onDelete}
          onToggleLockWithPin={onToggleLockWithPin}
        />
      )}

      <NoteDetailModal
        visible={!!openNote}
        initialTitle={openNote?.title ?? ""}
        initialBody={openNote?.body ?? ""}
        initialFavorite={openNote?.favorite ?? false}
        onClose={() => setOpenNoteId(null)}
        onSave={saveOpenNote}
      />
    </View>
  );
}
