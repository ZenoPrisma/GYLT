import React, { useState, useEffect } from "react";
import { Portal, Dialog, TextInput, Button } from "react-native-paper";

type Props = {
  visible: boolean;
  mode: "set" | "verify";
  title?: string;
  onCancel: () => void;
  onSubmit: (pin: string) => void;
  minLength?: number;
};

export function PinPromptModal({ visible, mode, title, onCancel, onSubmit, minLength = 4 }: Props) {
  const [pin, setPin] = useState("");

  const onChange = (val: string) => {
    const digits = val.replace(/\D+/g, "");
    setPin(digits);
  };

  useEffect(() => { if (!visible) setPin(""); }, [visible]);

  const okDisabled = pin.length < minLength;

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel}>
        <Dialog.Title>{title ?? (mode === "set" ? "PIN festlegen" : "PIN eingeben")}</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Nur Ziffern (min. 4)"
            value={pin}
            onChangeText={onChange}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={12}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button disabled={okDisabled} onPress={() => { if (!okDisabled) onSubmit(pin); }}>OK</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
