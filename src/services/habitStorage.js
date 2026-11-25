import AsyncStorage from "@react-native-async-storage/async-storage";

// One storage key keeps habit reads and writes consistent across the app.
export const HABITS_STORAGE_KEY = "@vantage-habits/habits";

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
