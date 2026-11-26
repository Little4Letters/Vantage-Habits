import AsyncStorage from "@react-native-async-storage/async-storage";

// Separate storage keys keep the habit records and dated completion log consistent.
export const HABITS_STORAGE_KEY = "@vantage-habits/habits";
export const COMPLETION_HISTORY_KEY = "@vantage-habits/completion-history";

function scopedKey(key, accountId) {
  return accountId ? `${key}:${accountId}` : key;
}

// AsyncStorage stores text. Load it, then parse and validate the JSON array.
export async function loadStoredHabits(accountId) {
  const storedHabits = await AsyncStorage.getItem(
    scopedKey(HABITS_STORAGE_KEY, accountId),
  );

  if (!storedHabits) return null;

  const parsedHabits = JSON.parse(storedHabits);
  return Array.isArray(parsedHabits) ? parsedHabits : null;
}

// Convert the habit array to text before saving it to device storage.
export async function saveStoredHabits(habits, accountId) {
  await AsyncStorage.setItem(
    scopedKey(HABITS_STORAGE_KEY, accountId),
    JSON.stringify(habits),
  );
}

// Completion history is stored separately for durable, date-based progress records.
export async function loadStoredCompletionHistory(accountId) {
  const storedHistory = await AsyncStorage.getItem(
    scopedKey(COMPLETION_HISTORY_KEY, accountId),
  );

  if (!storedHistory) return [];

  const parsedHistory = JSON.parse(storedHistory);
  return Array.isArray(parsedHistory) ? parsedHistory : [];
}

export async function saveStoredCompletionHistory(
  completionHistory,
  accountId,
) {
  await AsyncStorage.setItem(
    scopedKey(COMPLETION_HISTORY_KEY, accountId),
    JSON.stringify(completionHistory),
  );
}
