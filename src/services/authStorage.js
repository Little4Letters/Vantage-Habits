// What is this file for?
// This file provides functions for managing user authentication and profile data in a React Native application.
// It uses AsyncStorage and SecureStore to securely store account information, session data, and user profiles.

// The functions include creating an account, logging in, retrieving the current session account, clearing the session,
// loading and saving the user profile, and hashing passwords for secure storage.

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";

// Define keys for storing data in SecureStore and AsyncStorage
// These keys are used to uniquely identify the stored account, session, and profile data in the respective storage systems.

// Why this matters?
// Using unique keys ensures that the data can be retrieved and managed correctly without conflicts.

const ACCOUNT_KEY = "@vantage-habits/account";
const SESSION_KEY = "@vantage-habits/session";
const PROFILE_KEY = "@vantage-habits/profile";

// Converts a sequence of bytes to a hexadecimal string.
// Why this matters?

// This function is used to convert the random salt bytes generated for password hashing into a string format that can be stored and retrieved from SecureStore.
// The hexadecimal representation is a common way to represent binary data in a readable format.

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

// Hashes a password using SHA-256 with a given salt.
// Why this matters?
// This function securely hashes the user's password combined with a unique salt to protect against rainbow table attacks,
// And ensure that even if two users have the same password, their stored hashes will be different.

async function hashPassword(password, salt) {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${password}`,
  );
}

// Creates a new user account with the provided name, email, and password.
export async function createAccount({ name, email, password }) {
  const normalizedName = String(name || "").trim();
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();

  if (!normalizedName) {
    throw new Error("Name is required.");
  }
  if (normalizedName.length < 2 || normalizedName.length > 40) {
    throw new Error("Name must be between 2 and 40 characters.");
  }
  if (!/^\p{L}[\p{L}\p{M}' .-]*$/u.test(normalizedName)) {
    throw new Error("Name contains invalid characters.");
  }
  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error("Invalid email format.");
  }
  if (!password) {
    throw new Error("Password is required.");
  }
  if (
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    throw new Error("Password is weak.");
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
    name: normalizedName,
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

// Logs in a user with the provided email and password, returning the account if successful.
// Why this matters?
// This function verifies the user's credentials by checking the stored account information and comparing the hashed password.

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

// Saves the user profile to AsyncStorage and updates the stored account information with the new name and email.
// Why this matters?
// This function ensures that the user's profile information is persisted across app sessions and that the account information remains consistent with the profile data.
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
