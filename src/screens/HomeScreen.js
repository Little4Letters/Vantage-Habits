import { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import HabitSec from "../components/HabitsSec.js";
import { AppText as Text } from "../components/Typography.js";
import { palette as theme } from "../theme.js";

function getWeekDates() {
  // This function calculates the dates for the current week starting from Monday.
  // It creates an array of 7 objects, each representing a day of the week with its corresponding date and day name.

  // This is still a prototype diri pa na sa final implementation.

  // This section is diri pa synchronized an exact format of the callender.
  // It is still uses the current date to determine the start of the week (Monday) and then generates the dates for the entire week.

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

function getMonthDates(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const leadingDays = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return [
    ...Array(leadingDays).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, index) => new Date(year, month, index + 1),
    ),
  ];
}

export default function HomeScreen({ navigation, habits, onToggleHabit }) {
  // This function is used to get the dates of the current week starting from Monday.
  // It creates an array of 7 objects only para ma follow as a week concept

  // Each representing a day of the week with its corresponding date and day name.
  const dates = getWeekDates();
  const todayIndex = (new Date().getDay() + 6) % 7;
  const [selectedDate, setSelectedDate] = useState(dates[todayIndex].key);
  const [showMonth, setShowMonth] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const monthDates = getMonthDates(visibleMonth);
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
              <Ionicons
                name="partly-sunny"
                size={15}
                color={theme.secondary[500]}
              />{" "}
              32 °C
            </Text>
          </View>
          <View style={styles.headerActions}>
            <View style={styles.brandMark}>
              <Ionicons name="checkmark-done" size={23} color="#E56B78" />
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Toggle full calendar"
              onPress={() => setShowMonth((visible) => !visible)}
              style={styles.calendarButton}
            >
              <Ionicons name="calendar-outline" size={20} color="#3E4049" />
            </TouchableOpacity>
          </View>
        </View>

        {showMonth && (
          <View style={styles.calendarPanel}>
            <View style={styles.calendarHeading}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Previous month"
                onPress={() =>
                  setVisibleMonth(
                    new Date(
                      visibleMonth.getFullYear(),
                      visibleMonth.getMonth() - 1,
                      1,
                    ),
                  )
                }
                style={styles.monthArrow}
              >
                <Ionicons
                  name="chevron-back"
                  size={17}
                  color={theme.tertiary[800]}
                />
              </TouchableOpacity>
              <Text style={styles.monthTitle}>
                {visibleMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </Text>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Next month"
                onPress={() =>
                  setVisibleMonth(
                    new Date(
                      visibleMonth.getFullYear(),
                      visibleMonth.getMonth() + 1,
                      1,
                    ),
                  )
                }
                style={styles.monthArrow}
              >
                <Ionicons
                  name="chevron-forward"
                  size={17}
                  color={theme.tertiary[800]}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.monthGrid}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <Text key={day} style={styles.monthWeekday}>
                  {day}
                </Text>
              ))}
              {monthDates.map((date, index) => {
                if (!date)
                  return (
                    <View key={`blank-${index}`} style={styles.monthBlank} />
                  );
                const dateKey = date.toISOString();
                const selected = selectedDate === dateKey;
                return (
                  <TouchableOpacity
                    key={dateKey}
                    accessibilityRole="button"
                    accessibilityLabel={date.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                    })}
                    accessibilityState={selected ? { selected: true } : {}}
                    onPress={() => setSelectedDate(dateKey)}
                    style={[
                      styles.monthDay,
                      selected && styles.monthDaySelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.monthDayText,
                        selected && styles.textWhite,
                      ]}
                    >
                      {date.getDate()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.dateStrip}>
          {dates.map((date, index) => (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={`${date.day}, ${date.number}`}
              accessibilityState={
                selectedDate === date.key ? { selected: true } : {}
              }
              key={date.key}
              onPress={() => setSelectedDate(index)}
              style={[
                styles.dateCard,
                selectedDate === date.key && styles.dateCardActive,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  selectedDate === date.key && styles.textWhite,
                ]}
              >
                {date.day}
              </Text>
              <Text
                style={[
                  styles.dateNum,
                  selectedDate === date.key && styles.textWhite,
                ]}
              >
                {date.number}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Habits</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Add")}
            accessibilityRole="button"
          >
            <Text style={styles.manageText}>Add new</Text>
          </TouchableOpacity>
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
  safeArea: { flex: 1, backgroundColor: theme.natural[50] },
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
  greeting: { fontSize: 22, fontWeight: "800", color: theme.tertiary[900] },
  greetingHighlight: { color: theme.primary[400], fontWeight: "800" },
  weather: { fontSize: 13, color: theme.natural[500], marginTop: 6 },
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
    backgroundColor: theme.white,
    borderRadius: 21,
    elevation: 1,
  },
  calendarPanel: {
    backgroundColor: theme.white,
    borderRadius: 15,
    padding: 12,
    marginTop: -12,
    marginBottom: 18,
  },
  calendarHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  monthArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.tertiary[50],
  },
  monthTitle: { color: theme.tertiary[900], fontSize: 13, fontWeight: "700" },
  monthGrid: { flexDirection: "row", flexWrap: "wrap" },
  monthWeekday: {
    width: "14.285%",
    textAlign: "center",
    color: theme.natural[500],
    fontSize: 9,
    paddingVertical: 7,
  },
  monthBlank: { width: "14.285%", height: 34 },
  monthDay: {
    width: "14.285%",
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  monthDaySelected: { backgroundColor: theme.primary[600] },
  monthDayText: { color: theme.tertiary[800], fontSize: 11, fontWeight: "600" },
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
    backgroundColor: theme.natural[100],
    borderRadius: 13,
  },
  dateCardActive: { backgroundColor: theme.primary[600] },
  dayText: { fontSize: 11, color: theme.natural[600], marginBottom: 4 },
  dateNum: { fontSize: 17, fontWeight: "700", color: theme.tertiary[900] },
  textWhite: { color: theme.white },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: theme.tertiary[900] },
  manageText: { fontSize: 12, color: theme.natural[500], fontWeight: "600" },
  completedHeader: { marginTop: 14 },
  completedCount: { color: theme.natural[400], fontSize: 12 },
  emptyText: { color: theme.natural[500], fontSize: 13, paddingVertical: 18 },
});
