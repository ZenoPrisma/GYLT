// src/modules/notes/components/PinPromptModal.tsx
import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, Button } from "react-native";

type Props = {
  visible: boolean;
  mode: "set" | "verify";
  title?: string;
  onCancel: () => void;
  onSubmit: (pin: string) => void; // bekommt nur Ziffern (gefiltert)
  minLength?: number;              // default 4
};

export function PinPromptModal({
  visible, mode, title, onCancel, onSubmit, minLength = 4,
}: Props) {
  const [pin, setPin] = useState("");

  // Nur Ziffern zulassen
  const onChange = (val: string) => {
    const digits = val.replace(/\D+/g, ""); // filter non-digits
    setPin(digits);
  };

  useEffect(() => { if (!visible) setPin(""); }, [visible]);

  const okDisabled = pin.length < minLength;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={{ flex:1, backgroundColor:"rgba(0,0,0,0.25)", justifyContent:"center", alignItems:"center" }}>
        <View style={{ backgroundColor:"#fff", padding:16, width:"86%", borderRadius:12, gap:10 }}>
          <Text style={{ fontWeight:"600" }}>
            {title ?? (mode === "set" ? "PIN festlegen" : "PIN eingeben")}
          </Text>
          <TextInput
            placeholder="Nur Ziffern (min. 4)"
            value={pin}
            onChangeText={onChange}
            keyboardType="number-pad"
            inputMode="numeric"
            secureTextEntry
            maxLength={12}
            style={{ borderWidth:1, borderColor:"#ddd", borderRadius:10, padding:10 }}
          />
          <View style={{ flexDirection:"row", gap:8, justifyContent:"flex-end" }}>
            <Button
              title="OK"
              disabled={okDisabled}
              onPress={() => {
                if (okDisabled) return;
                onSubmit(pin);
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
