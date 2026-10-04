import { useState } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import HabitSec from "../components/HabitsSec.js";
import { PoppinsText as Text } from "../components/Typography.js";

function getWeekDates() {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return {
      key: date.toISOString(),
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      number: date.getDate(),
    };
  });
}

export default function HomeScreen({ navigation, habits, onToggleHabit }) {
  const dates = getWeekDates();
  const todayIndex = (new Date().getDay() + 6) % 7;
  const [selectedDate, setSelectedDate] = useState(todayIndex);
  const [showMonth, setShowMonth] = useState(false);
  const upcomingHabits = habits.filter((habit) => !habit.completed);
  const completedHabits = habits.filter((habit) => habit.completed);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Good <Text style={styles.greetingHighlight}>Afternoon</Text>
            </Text>
            <Text style={styles.weather}>
              <Ionicons name="partly-sunny" size={15} color="#F1B84B" /> 32 °C
            </Text>
          </View>
          <View style={styles.headerActions}>
            <View style={styles.brandMark}>
              <Ionicons name="checkmark-done" size={23} color="#E56B78" />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Show current month"
              onPress={() => setShowMonth((visible) => !visible)}
              style={styles.calendarButton}
            >
              <Ionicons name="calendar-outline" size={20} color="#3E4049" />
            </Pressable>
          </View>
        </View>

        {showMonth && (
          <Text style={styles.monthLabel}>
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </Text>
        )}

        <View style={styles.dateStrip}>
          {dates.map((date, index) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${date.day}, ${date.number}`}
              accessibilityState={
                selectedDate === index ? { selected: true } : {}
              }
              key={date.key}
              onPress={() => setSelectedDate(index)}
              style={[
                styles.dateCard,
                selectedDate === index && styles.dateCardActive,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  selectedDate === index && styles.textWhite,
                ]}
              >
                {date.day}
              </Text>
              <Text
                style={[
                  styles.dateNum,
                  selectedDate === index && styles.textWhite,
                ]}
              >
                {date.number}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Habits</Text>
          <Pressable
            onPress={() => navigation.navigate("Add")}
            accessibilityRole="button"
          >
            <Text style={styles.manageText}>Add new</Text>
          </Pressable>
        </View>

        {upcomingHabits.length ? (
          upcomingHabits.map((habit) => (
            <HabitSec
              key={habit.id}
              {...habit}
              isCompleted={false}
              onPress={() => onToggleHabit(habit.id)}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>
            All habits are complete for today.
          </Text>
        )}

        <View style={[styles.sectionHeader, styles.completedHeader]}>
          <Text style={styles.sectionTitle}>Completed</Text>
          <Text style={styles.completedCount}>{completedHabits.length}</Text>
        </View>

        {completedHabits.map((habit) => (
          <HabitSec
            key={habit.id}
            {...habit}
            isCompleted
            onPress={() => onToggleHabit(habit.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F7F7F8" },
  container: {
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 125,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  greeting: { fontSize: 22, fontWeight: "800", color: "#20212A" },
  greetingHighlight: { color: "#E36F80", fontWeight: "800" },
  weather: { fontSize: 13, color: "#85858D", marginTop: 6 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 12 },
  brandMark: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 21,
    elevation: 1,
  },
  monthLabel: {
    color: "#85858D",
    fontSize: 12,
    marginTop: -17,
    marginBottom: 12,
  },
  dateStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
    marginBottom: 28,
  },
  dateCard: {
    flex: 1,
    minWidth: 38,
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#EEEEF0",
    borderRadius: 13,
  },
  dateCardActive: { backgroundColor: "#F05E79" },
  dayText: { fontSize: 11, color: "#888891", marginBottom: 4 },
  dateNum: { fontSize: 17, fontWeight: "700", color: "#292A33" },
  textWhite: { color: "#FFFFFF" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#252630" },
  manageText: { fontSize: 12, color: "#909099", fontWeight: "600" },
  completedHeader: { marginTop: 14 },
  completedCount: { color: "#9A9AA2", fontSize: 12 },
  emptyText: { color: "#85858D", fontSize: 13, paddingVertical: 18 },
});
