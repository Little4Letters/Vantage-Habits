import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";

const ACCOUNT_KEY = "@vantage-habits/account";
const SESSION_KEY = "@vantage-habits/session";
const PROFILE_KEY = "@vantage-habits/profile";

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

async function hashPassword(password, salt) {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${password}`,
  );
}

export async function createAccount({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password) {
    throw new Error("Email and password are required.");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const existingAccount = await SecureStore.getItemAsync(ACCOUNT_KEY);
  if (existingAccount) {
    throw new Error("An account already exists on this device.");
  }

  const saltBytes = await Crypto.getRandomBytesAsync(16);
  const salt = bytesToHex(saltBytes);
  const passwordHash = await hashPassword(password, salt);
  const account = {
    id: Crypto.randomUUID(),
    name: name.trim() || "Habit Builder",
    email: normalizedEmail,
    passwordHash,
    passwordSalt: salt,
  };

  await SecureStore.setItemAsync(ACCOUNT_KEY, JSON.stringify(account));
  await saveProfile({
    name: account.name,
    email: account.email,
    gender: "Male",
    birthDate: "12 / 05 / 1996",
  });
  await saveSession(account.id);

  return account;
}

export async function loginAccount(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const storedAccount = await SecureStore.getItemAsync(ACCOUNT_KEY);

  if (!storedAccount) {
    throw new Error(
      "No account exists on this device. Create an account first.",
    );
  }

  const account = JSON.parse(storedAccount);
  if (account.email !== normalizedEmail) {
    throw new Error("Incorrect email or password.");
  }

  const passwordHash = await hashPassword(password, account.passwordSalt);
  if (passwordHash !== account.passwordHash) {
    throw new Error("Incorrect email or password.");
  }

  await saveSession(account.id);
  return account;
}

export async function getSessionAccount() {
  const sessionId = await AsyncStorage.getItem(SESSION_KEY);
  if (!sessionId) return null;

  const storedAccount = await SecureStore.getItemAsync(ACCOUNT_KEY);
  if (!storedAccount) return null;

  const account = JSON.parse(storedAccount);
  return account.id === sessionId ? account : null;
}

export async function clearSession() {
  await AsyncStorage.removeItem(SESSION_KEY);
}

async function saveSession(accountId) {
  await AsyncStorage.setItem(SESSION_KEY, accountId);
}

export async function loadProfile() {
  const storedProfile = await AsyncStorage.getItem(PROFILE_KEY);
  if (!storedProfile) return null;

  const profile = JSON.parse(storedProfile);
  return typeof profile === "object" && profile ? profile : null;
}

export async function saveProfile(profile) {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));

  const storedAccount = await SecureStore.getItemAsync(ACCOUNT_KEY);
  if (storedAccount) {
    const account = JSON.parse(storedAccount);
    await SecureStore.setItemAsync(
      ACCOUNT_KEY,
      JSON.stringify({
        ...account,
        name: profile.name,
        email: profile.email,
      }),
    );
  }
}
