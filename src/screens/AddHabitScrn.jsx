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
  AppText as Text,
  AppTextInput as TextInput,
} from "../components/Typography.js";
import HabitPresetCard from "../components/HabitPresetCard.js";
import { palette as theme } from "../theme.js";

const colors = [
  theme.primary[600],
  theme.primary[400],
  theme.secondary[500],
  theme.tertiary[500],
  "#4388F5",
  "#47B9A7",
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
    title: "Sports",
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
          <View style={styles.headingRow}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Go back to home"
              onPress={() => navigation.navigate("Home")}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={18} color="#30313A" />
            </TouchableOpacity>
            <View style={styles.headingCopy}>
              <Text style={styles.headingTitle}>
                {mode === "create" && editingId
                  ? "Edit Habit"
                  : mode === "create"
                    ? "Create "
                    : "Manage "}
                {!(mode === "create" && editingId) && (
                  <Text style={styles.headingHighlight}>Habits</Text>
                )}
              </Text>
              <Text style={styles.headingSubtitle}>
                {mode === "create"
                  ? editingId
                    ? "Update your habit details"
                    : "Create your custom habit"
                  : "Update and delete your habits"}
              </Text>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={
                mode === "create" ? "Manage habits" : "Add a habit"
              }
              onPress={() => {
                if (mode === "create") {
                  resetForm();
                  setMode("manage");
                } else {
                  resetForm();
                  setMode("create");
                }
              }}
              style={styles.modeButton}
            >
              {mode === "manage" && (
                <Ionicons name="add" size={16} color="#FFFFFF" />
              )}
              <Text style={styles.modeButtonText}>
                {mode === "create" ? "Manage" : "Add Habit"}
              </Text>
            </TouchableOpacity>
          </View>

          {mode === "create" ? (
            <>
              <View style={styles.sectionHeadingRow}>
                <View>
                  <Text style={styles.sectionHeading}>Quick start</Text>
                  <Text style={styles.sectionHint}>
                    Pick a template or create your own
                  </Text>
                </View>
                <View style={styles.templateCount}>
                  <Text style={styles.templateCountText}>
                    {String(presets.length).padStart(2, "0")}
                  </Text>
                </View>
              </View>
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
  safeArea: { flex: 1, backgroundColor: "#F4F5F8" },
  keyboardView: { flex: 1 },
  container: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 120 },
  headingRow: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
  },
  headingCopy: { flex: 1, minWidth: 0 },
  headingTitle: {
    color: theme.tertiary[900],
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  headingHighlight: { color: theme.primary[600] },
  headingSubtitle: { color: theme.natural[400], fontSize: 11, marginTop: 3 },
  sectionHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionHeading: {
    color: theme.tertiary[900],
    fontSize: 14,
    fontWeight: "700",
  },
  sectionHint: { color: theme.natural[400], fontSize: 10, marginTop: 3 },
  templateCount: {
    minWidth: 32,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
  },
  templateCountText: {
    color: theme.natural[500],
    fontSize: 10,
    fontWeight: "700",
  },
  modeButton: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingHorizontal: 13,
    borderRadius: 18,
    backgroundColor: theme.tertiary[900],
  },
  modeButtonText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  presetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
    marginBottom: 18,
  },
  formPanel: {
    padding: 16,
    backgroundColor: theme.white,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EEF0F4",
    shadowColor: "#1B2233",
    shadowOpacity: 0.035,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  inputHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 9,
  },
  sectionTitle: {
    color: theme.tertiary[800],
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
  },
  previewIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: theme.tertiary[50],
    color: theme.tertiary[900],
    fontSize: 14,
  },
  errorText: { color: "#D64E64", fontSize: 11, marginTop: 7 },
  colorRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 14,
    gap: 12,
  },
  colorChoice: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: theme.white,
    elevation: 2,
  },
  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  timeOption: {
    width: "48%",
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 12,
    backgroundColor: "#F4F5F7",
    borderRadius: 12,
  },
  timeSelected: { backgroundColor: theme.tertiary[900] },
  timeText: { color: "#565760", fontSize: 11, fontWeight: "600" },
  timeTextSelected: { color: "#FFFFFF" },
  frequencyRow: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
  },
  frequencyOption: {
    flex: 1,
    minHeight: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
  },
  frequencySelected: { backgroundColor: theme.white, elevation: 1 },
  frequencyText: { color: "#6F7079", fontSize: 10 },
  frequencyTextSelected: { color: "#2C2D36", fontWeight: "700" },
  dayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
    marginTop: 12,
  },
  dayOption: {
    flex: 1,
    minHeight: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },
  daySelected: { backgroundColor: theme.tertiary[900] },
  dayText: { color: "#62636C", fontSize: 9, fontWeight: "600" },
  dayTextSelected: { color: "#FFFFFF" },
  durationPanel: { paddingVertical: 14 },
  durationHeading: { flexDirection: "row", alignItems: "center", gap: 9 },
  dateIcon: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },
  durationRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  durationOption: {
    flex: 1,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
  },
  durationSelected: { backgroundColor: theme.tertiary[900] },
  durationText: { color: "#62636C", fontSize: 10 },
  durationTextSelected: { color: "#FFFFFF" },
  createButton: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 25,
    backgroundColor: theme.tertiary[900],
    marginTop: 4,
  },
  createButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  manageSection: { paddingTop: 2 },
  managedHabit: {
    minHeight: 74,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  managedHabitMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
    gap: 11,
  },
  managedIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  managedCopy: { flex: 1, minWidth: 0 },
  managedTitle: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  managedDetail: {
    color: "rgba(255,255,255,0.84)",
    fontSize: 10,
    marginTop: 3,
  },
  deleteButton: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 10,
    backgroundColor: "rgba(32,33,45,0.22)",
    borderRadius: 10,
    marginLeft: 8,
  },
  deleteText: { color: "#FFFFFF", fontSize: 10, fontWeight: "600" },
  emptyState: {
    minHeight: 140,
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
  },
  emptyText: { color: "#96969E", fontSize: 12 },
});
