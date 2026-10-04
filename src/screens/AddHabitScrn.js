import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
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

const colors = ["#4388F5", "#F58D60", "#9660E8", "#F05E79", "#47B9A7"];
const icons = [
  "walk-outline",
  "tennisball-outline",
  "bed-outline",
  "book-outline",
  "water-outline",
  "fitness-outline",
];
const frequencies = ["Every day", "Weekdays", "Weekly"];

export default function AddHabitScrn({ navigation, onAddHabit }) {
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState(frequencies[0]);
  const [color, setColor] = useState(colors[0]);
  const [icon, setIcon] = useState(icons[0]);
  const [error, setError] = useState("");

  const saveHabit = () => {
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError("Enter a name for your habit first.");
      return;
    }
    onAddHabit({
      id: `${Date.now()}`,
      title: cleanTitle,
      frequency,
      color,
      icon,
      completed: false,
    });
    navigation.navigate("Home");
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
            <View>
              <Text style={styles.eyebrow}>BUILD YOUR ROUTINE</Text>
              <Text style={styles.title}>New habit</Text>
            </View>
            <View style={[styles.previewIcon, { backgroundColor: color }]}>
              <Ionicons name={icon} size={23} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Habit name</Text>
            <TextInput
              accessibilityLabel="Habit name"
              style={styles.input}
              placeholder="e.g. Morning walk"
              placeholderTextColor="#9999A1"
              value={title}
              onChangeText={(value) => {
                setTitle(value);
                setError("");
              }}
              maxLength={36}
              returnKeyType="done"
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Repeat</Text>
            <View style={styles.frequencyRow}>
              {frequencies.map((option) => (
                <Pressable
                  key={option}
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
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Choose an icon</Text>
            <View style={styles.iconRow}>
              {icons.map((option) => (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityLabel={`Choose ${option.replace("-outline", "").replace("-", " ")} icon`}
                  accessibilityState={icon === option ? { selected: true } : {}}
                  onPress={() => setIcon(option)}
                  style={[
                    styles.iconOption,
                    icon === option && styles.iconSelected,
                  ]}
                >
                  <Ionicons
                    name={option}
                    size={21}
                    color={icon === option ? "#E45E77" : "#777780"}
                  />
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Card color</Text>
            <View style={styles.colorRow}>
              {colors.map((option) => (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityLabel={`Choose color ${option}`}
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
                    <Ionicons name="checkmark" size={17} color="#FFFFFF" />
                  )}
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.buttonRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.navigate("Home")}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={saveHabit}
              style={styles.saveButton}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.saveText}>Save habit</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F7F7F8" },
  keyboardView: { flex: 1 },
  container: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 125 },
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  eyebrow: {
    color: "#E36F80",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
    marginBottom: 7,
  },
  title: { color: "#252630", fontSize: 28, fontWeight: "800" },
  previewIcon: {
    width: 52,
    height: 52,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  formGroup: { marginBottom: 27 },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#30313A",
    marginBottom: 11,
  },
  input: {
    height: 52,
    paddingHorizontal: 15,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    color: "#252630",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#ECECEF",
  },
  errorText: { color: "#D64E64", fontSize: 12, marginTop: 8 },
  frequencyRow: { flexDirection: "row", gap: 8 },
  frequencyOption: {
    flex: 1,
    minHeight: 42,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ECECEF",
    borderRadius: 12,
    paddingHorizontal: 5,
  },
  frequencySelected: { backgroundColor: "#F05E79" },
  frequencyText: { color: "#6F7079", fontSize: 12, fontWeight: "600" },
  frequencyTextSelected: { color: "#FFFFFF" },
  iconRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  iconOption: {
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECECEF",
  },
  iconSelected: { borderColor: "#E45E77", backgroundColor: "#FFF2F4" },
  colorRow: { flexDirection: "row", alignItems: "center", gap: 15 },
  colorChoice: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  colorSelected: { borderWidth: 3, borderColor: "#FFFFFF", elevation: 3 },
  buttonRow: { flexDirection: "row", gap: 10, marginTop: 3 },
  cancelButton: {
    flex: 1,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E9E9EC",
    borderRadius: 14,
  },
  cancelText: { color: "#484952", fontSize: 14, fontWeight: "700" },
  saveButton: {
    flex: 1.5,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "#F05E79",
    borderRadius: 14,
  },
  saveText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
});
