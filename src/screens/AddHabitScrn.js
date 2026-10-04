import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  PoppinsText as Text,
  PoppinsTextInput as TextInput,
} from "../components/Typography.js";
import HabitPresetCard from "../components/HabitPresetCard.js";

const colors = [
  "#4388F5",
  "#F05E79",
  "#9660E8",
  "#F58D60",
  "#47B9A7",
  "#F2B84B",
];
const frequencies = ["One Time", "Daily", "Monthly"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const durations = ["1 Month", "2 Months", "3 Months"];
const times = [
  { label: "Anytime", icon: "time-outline" },
  { label: "Morning", icon: "sunny-outline" },
  { label: "Afternoon", icon: "partly-sunny-outline" },
  { label: "Evening", icon: "moon-outline" },
];
const presets = [
  {
    title: "Meditation",
    detail: "Every day",
    icon: "flower-outline",
    color: "#4388F5",
    repeat: "Daily",
    days,
  },
  {
    title: "Yoga",
    detail: "Sat, Sun",
    icon: "body-outline",
    color: "#F05E79",
    repeat: "Weekly",
    days: ["Sat", "Sun"],
  },
  {
    title: "Tennis",
    detail: "Monday, Thursday",
    icon: "tennisball-outline",
    color: "#F58D60",
    repeat: "Weekly",
    days: ["Mon", "Thu"],
  },
  {
    title: "Workout",
    detail: "Every day",
    icon: "fitness-outline",
    color: "#9660E8",
    repeat: "Daily",
    days,
  },
  {
    title: "Chess",
    detail: "Every day",
    icon: "game-controller-outline",
    color: "#6AA4F5",
    repeat: "Daily",
    days,
  },
  {
    title: "Swimming",
    detail: "Fri, Sat, Sun",
    icon: "water-outline",
    color: "#F0778B",
    repeat: "Weekly",
    days: ["Fri", "Sat", "Sun"],
  },
  {
    title: "Reading",
    detail: "Every day",
    icon: "book-outline",
    color: "#E878AE",
    repeat: "Daily",
    days,
  },
  {
    title: "Sleep",
    detail: "Every day",
    icon: "bed-outline",
    color: "#F2B84B",
    repeat: "Daily",
    days,
  },
];

export default function AddHabitScrn({
  navigation,
  habits,
  onAddHabit,
  onUpdateHabit,
  onDeleteHabit,
}) {
  const [mode, setMode] = useState("create");
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [color, setColor] = useState(colors[0]);
  const [icon, setIcon] = useState("flower-outline");
  const [time, setTime] = useState("Anytime");
  const [selectedDays, setSelectedDays] = useState(days);
  const [duration, setDuration] = useState("2 Months");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const resetForm = () => {
    setTitle("");
    setFrequency("Daily");
    setColor(colors[0]);
    setIcon("flower-outline");
    setTime("Anytime");
    setSelectedDays(days);
    setDuration("2 Months");
    setEditingId(null);
    setError("");
  };

  const selectPreset = (preset) => {
    setTitle(preset.title);
    setIcon(preset.icon);
    setColor(preset.color);
    setFrequency(preset.repeat);
    setSelectedDays(preset.days);
    setError("");
  };

  const editHabit = (habit) => {
    setTitle(habit.title);
    setFrequency(habit.repeat || "Daily");
    setColor(habit.color || colors[0]);
    setIcon(habit.icon || "flower-outline");
    setTime(habit.time || "Anytime");
    setSelectedDays(habit.days || days);
    setDuration(habit.duration || "2 Months");
    setEditingId(habit.id);
    setError("");
    setMode("create");
  };

  const saveHabit = () => {
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError("Enter a habit name or choose one above.");
      return;
    }

    const habit = {
      id: editingId || `${Date.now()}`,
      title: cleanTitle,
      frequency:
        frequency === "Daily"
          ? "Every day"
          : frequency === "Weekly"
            ? selectedDays.join(", ")
            : frequency,
      repeat: frequency,
      color,
      icon,
      time,
      days: selectedDays,
      duration,
      completed: false,
    };

    if (editingId) {
      onUpdateHabit(habit);
      resetForm();
      setMode("manage");
    } else {
      onAddHabit(habit);
      resetForm();
      navigation.navigate("Home");
    }
  };

  const toggleDay = (day) => {
    setSelectedDays((current) =>
      current.includes(day)
        ? current.filter((selectedDay) => selectedDay !== day)
        : [...current, day],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => navigation.navigate("Home")}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={18} color="#30313A" />
              <Text style={styles.backText}>Go Back</Text>
            </TouchableOpacity>
            {mode === "create" ? (
              <TouchableOpacity
                accessibilityRole="button"
                onPress={saveHabit}
                style={styles.topAction}
              >
                <Text style={styles.topActionText}>
                  {editingId ? "Update" : "Create"}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => {
                  resetForm();
                  setMode("create");
                }}
                style={styles.topAction}
              >
                <Ionicons name="add" size={17} color="#FFFFFF" />
                <Text style={styles.topActionText}>Add Habit</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.headingRow}>
            <View style={styles.headingIcon}>
              <Ionicons
                name={mode === "create" ? "chevron-back" : "options-outline"}
                size={19}
                color="#5A5B64"
              />
            </View>
            <View style={styles.headingCopy}>
              <Text style={styles.headingTitle}>
                {mode === "create" ? "Create Habits" : "Manage Habits"}
              </Text>
              <Text style={styles.headingSubtitle}>
                {mode === "create"
                  ? "Create Your Custom Habit"
                  : "Update and delete your habits"}
              </Text>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => {
                if (mode === "manage") resetForm();
                setMode(mode === "create" ? "manage" : "create");
              }}
              style={styles.modeButton}
            >
              <Text style={styles.modeButtonText}>
                {mode === "create" ? "Manage" : "Create"}
              </Text>
            </TouchableOpacity>
          </View>

          {mode === "create" ? (
            <>
              <View style={styles.presetGrid}>
                {presets.map((preset) => (
                  <HabitPresetCard
                    key={preset.title}
                    {...preset}
                    selected={title === preset.title && icon === preset.icon}
                    onPress={() => selectPreset(preset)}
                  />
                ))}
              </View>

              <View style={styles.formPanel}>
                <View style={styles.inputHeading}>
                  <Text style={styles.sectionTitle}>Habit title</Text>
                  <View
                    style={[styles.previewIcon, { backgroundColor: color }]}
                  >
                    <Ionicons name={icon} size={18} color="#FFFFFF" />
                  </View>
                </View>
                <TextInput
                  accessibilityLabel="Habit title"
                  style={styles.input}
                  placeholder="Type here"
                  placeholderTextColor="#A1A1A8"
                  value={title}
                  onChangeText={(value) => {
                    setTitle(value);
                    setError("");
                  }}
                  maxLength={36}
                  returnKeyType="done"
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.colorRow}>
                  {colors.map((option) => (
                    <TouchableOpacity
                      key={option}
                      accessibilityRole="button"
                      accessibilityLabel={`Choose card color ${option}`}
                      accessibilityState={
                        color === option ? { selected: true } : {}
                      }
                      onPress={() => setColor(option)}
                      style={[
                        styles.colorChoice,
                        { backgroundColor: option },
                        color === option && styles.colorSelected,
                      ]}
                    >
                      {color === option && (
                        <Ionicons name="checkmark" size={15} color="#FFFFFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formPanel}>
                <Text style={styles.sectionTitle}>Do it at</Text>
                <View style={styles.timeGrid}>
                  {times.map((option) => (
                    <TouchableOpacity
                      key={option.label}
                      accessibilityRole="button"
                      accessibilityState={
                        time === option.label ? { selected: true } : {}
                      }
                      onPress={() => setTime(option.label)}
                      style={[
                        styles.timeOption,
                        time === option.label && styles.timeSelected,
                      ]}
                    >
                      <Ionicons
                        name={option.icon}
                        size={15}
                        color={time === option.label ? "#F5C85B" : "#A4A5AC"}
                      />
                      <Text
                        style={[
                          styles.timeText,
                          time === option.label && styles.timeTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formPanel}>
                <Text style={styles.sectionTitle}>Repeat</Text>
                <View style={styles.frequencyRow}>
                  {frequencies.map((option) => (
                    <TouchableOpacity
                      key={option}
                      accessibilityRole="button"
                      accessibilityState={
                        frequency === option ? { selected: true } : {}
                      }
                      onPress={() => setFrequency(option)}
                      style={[
                        styles.frequencyOption,
                        frequency === option && styles.frequencySelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.frequencyText,
                          frequency === option && styles.frequencyTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.dayRow}>
                  {days.map((day) => (
                    <TouchableOpacity
                      key={day}
                      accessibilityRole="button"
                      accessibilityLabel={`${selectedDays.includes(day) ? "Remove" : "Add"} ${day}`}
                      accessibilityState={
                        selectedDays.includes(day) ? { selected: true } : {}
                      }
                      onPress={() => toggleDay(day)}
                      style={[
                        styles.dayOption,
                        selectedDays.includes(day) && styles.daySelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          selectedDays.includes(day) && styles.dayTextSelected,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={[styles.formPanel, styles.durationPanel]}>
                <View style={styles.durationHeading}>
                  <View style={styles.dateIcon}>
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color="#656670"
                    />
                  </View>
                  <Text style={styles.sectionTitle}>Set end date</Text>
                </View>
                <View style={styles.durationRow}>
                  {durations.map((option) => (
                    <TouchableOpacity
                      key={option}
                      accessibilityRole="button"
                      accessibilityState={
                        duration === option ? { selected: true } : {}
                      }
                      onPress={() => setDuration(option)}
                      style={[
                        styles.durationOption,
                        duration === option && styles.durationSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.durationText,
                          duration === option && styles.durationTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                accessibilityRole="button"
                onPress={saveHabit}
                style={styles.createButton}
              >
                <Text style={styles.createButtonText}>
                  {editingId ? "Update habit" : "Create your own"}
                </Text>
                <Ionicons name="add" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.manageSection}>
              <Text style={styles.sectionTitle}>Current Habits</Text>
              {habits.length ? (
                habits.map((habit) => (
                  <View
                    key={habit.id}
                    style={[
                      styles.managedHabit,
                      { backgroundColor: habit.color || colors[0] },
                    ]}
                  >
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel={`Edit ${habit.title}`}
                      onPress={() => editHabit(habit)}
                      style={styles.managedHabitMain}
                    >
                      <View style={styles.managedIcon}>
                        <Ionicons
                          name={habit.icon || "sparkles-outline"}
                          size={19}
                          color={habit.color || colors[0]}
                        />
                      </View>
                      <View style={styles.managedCopy}>
                        <Text numberOfLines={1} style={styles.managedTitle}>
                          {habit.title}
                        </Text>
                        <Text style={styles.managedDetail}>
                          {habit.frequency || "Every day"}
                        </Text>
                      </View>
                      <Ionicons
                        name="create-outline"
                        size={18}
                        color="#FFFFFF"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel={`Delete ${habit.title}`}
                      onPress={() => onDeleteHabit(habit.id)}
                      style={styles.deleteButton}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={16}
                        color="#FFFFFF"
                      />
                      <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="leaf-outline" size={24} color="#9A9AA2" />
                  <Text style={styles.emptyText}>
                    Your habit list is empty.
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FAF8F8" },
  keyboardView: { flex: 1 },
  container: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 130 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 17,
  },
  backButton: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    backgroundColor: "#EAE9E9",
    borderRadius: 22,
  },
  backText: { color: "#363740", fontSize: 11, fontWeight: "600" },
  topAction: {
    minHeight: 40,
    minWidth: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 15,
    backgroundColor: "#22232D",
    borderRadius: 22,
  },
  topActionText: { color: "#FFFFFF", fontSize: 11, fontWeight: "600" },
  headingRow: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    marginBottom: 16,
    elevation: 1,
  },
  headingIcon: {
    width: 33,
    height: 33,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: "#F2F2F3",
    marginRight: 10,
  },
  headingCopy: { flex: 1, minWidth: 0 },
  headingTitle: { color: "#2B2C35", fontSize: 15, fontWeight: "700" },
  headingSubtitle: { color: "#96969E", fontSize: 9, marginTop: 2 },
  modeButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: "#F5F3F4",
  },
  modeButtonText: { color: "#656670", fontSize: 10, fontWeight: "600" },
  presetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 9,
    marginBottom: 14,
  },
  formPanel: {
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginBottom: 10,
  },
  inputHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  sectionTitle: {
    color: "#353640",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 8,
  },
  previewIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    minHeight: 40,
    paddingHorizontal: 11,
    borderRadius: 10,
    backgroundColor: "#F1F1F2",
    color: "#292A34",
    fontSize: 12,
  },
  errorText: { color: "#D64E64", fontSize: 10, marginTop: 6 },
  colorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 11,
    gap: 8,
  },
  colorChoice: {
    flex: 1,
    height: 17,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  colorSelected: {
    height: 21,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    elevation: 2,
  },
  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  timeOption: {
    width: "48%",
    minHeight: 35,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 9,
    backgroundColor: "#F1F1F2",
    borderRadius: 10,
  },
  timeSelected: { backgroundColor: "#22232D" },
  timeText: { color: "#565760", fontSize: 10 },
  timeTextSelected: { color: "#FFFFFF" },
  frequencyRow: {
    flexDirection: "row",
    gap: 5,
    padding: 3,
    backgroundColor: "#F0F0F1",
    borderRadius: 10,
  },
  frequencyOption: {
    flex: 1,
    minHeight: 29,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  frequencySelected: { backgroundColor: "#FFFFFF", elevation: 1 },
  frequencyText: { color: "#6F7079", fontSize: 9 },
  frequencyTextSelected: { color: "#2C2D36", fontWeight: "600" },
  dayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
    marginTop: 9,
  },
  dayOption: {
    flex: 1,
    minHeight: 27,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#F0F0F1",
  },
  daySelected: { backgroundColor: "#22232D" },
  dayText: { color: "#62636C", fontSize: 8 },
  dayTextSelected: { color: "#FFFFFF" },
  durationPanel: { paddingVertical: 10 },
  durationHeading: { flexDirection: "row", alignItems: "center", gap: 7 },
  dateIcon: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#F0F0F1",
  },
  durationRow: { flexDirection: "row", gap: 6, marginTop: 5 },
  durationOption: {
    flex: 1,
    minHeight: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F0F1",
    borderRadius: 8,
  },
  durationSelected: { backgroundColor: "#22232D" },
  durationText: { color: "#62636C", fontSize: 8 },
  durationTextSelected: { color: "#FFFFFF" },
  createButton: {
    minHeight: 43,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 22,
    backgroundColor: "#22232D",
    marginTop: 2,
  },
  createButtonText: { color: "#FFFFFF", fontSize: 11, fontWeight: "600" },
  manageSection: { paddingTop: 5 },
  managedHabit: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 9,
    marginBottom: 9,
  },
  managedHabitMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
    gap: 9,
  },
  managedIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  managedCopy: { flex: 1, minWidth: 0 },
  managedTitle: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  managedDetail: { color: "rgba(255,255,255,0.84)", fontSize: 9, marginTop: 3 },
  deleteButton: {
    minHeight: 37,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 8,
    backgroundColor: "rgba(32,33,45,0.22)",
    borderRadius: 10,
    marginLeft: 8,
  },
  deleteText: { color: "#FFFFFF", fontSize: 9, fontWeight: "600" },
  emptyState: {
    minHeight: 110,
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
  },
  emptyText: { color: "#96969E", fontSize: 11 },
});
