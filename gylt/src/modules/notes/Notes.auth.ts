import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";

const PIN_KEY = "notes_app_pin_sha256";

export async function canUseBiometrics() {
  const hw = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return hw && enrolled;
}

export async function authWithBiometrics(reason = "Entsperren") {
  const res = await LocalAuthentication.authenticateAsync({
    promptMessage: reason,
    cancelLabel: "Abbrechen",
    disableDeviceFallback: true, // nur Biometrics hier
  });
  return res.success;
}

export async function hasStoredPin() {
  const v = await SecureStore.getItemAsync(PIN_KEY);
  return !!v;
}

export async function setPinIfMissing(pin: string) {
  const exists = await hasStoredPin();
  if (exists) return;
  const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, pin);
  await SecureStore.setItemAsync(PIN_KEY, hash, { keychainService: PIN_KEY });
}

export async function verifyPin(pin: string) {
  const saved = await SecureStore.getItemAsync(PIN_KEY);
  if (!saved) return false;
  const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, pin);
  return hash === saved;
}
