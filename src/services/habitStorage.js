import AsyncStorage from "@react-native-async-storage/async-storage";

// Separate storage keys keep the habit records and dated completion log consistent.
export const HABITS_STORAGE_KEY = "@vantage-habits/habits";
export const COMPLETION_HISTORY_KEY = "@vantage-habits/completion-history";

// AsyncStorage stores text. Load it, then parse and validate the JSON array.
export async function loadStoredHabits() {
  const storedHabits = await AsyncStorage.getItem(HABITS_STORAGE_KEY);

  if (!storedHabits) return null;

  const parsedHabits = JSON.parse(storedHabits);
  return Array.isArray(parsedHabits) ? parsedHabits : null;
}

// Convert the habit array to text before saving it to device storage.
export async function saveStoredHabits(habits) {
  await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
}

// Completion history is stored separately for durable, date-based progress records.
export async function loadStoredCompletionHistory() {
  const storedHistory = await AsyncStorage.getItem(COMPLETION_HISTORY_KEY);

  if (!storedHistory) return [];

  const parsedHistory = JSON.parse(storedHistory);
  return Array.isArray(parsedHistory) ? parsedHistory : [];
}

export async function saveStoredCompletionHistory(completionHistory) {
  await AsyncStorage.setItem(
    COMPLETION_HISTORY_KEY,
    JSON.stringify(completionHistory),
  );
}
