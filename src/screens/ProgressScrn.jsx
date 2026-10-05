import React, { useState } from "react";
import { TouchableOpacity, ScrollView, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText as Text } from "../components/Typography.js";
import HabitGlyph from "../components/HabitGlyph.js";
import { palette as theme } from "../theme.js";

const periods = ["Today", "This Week", "This Month"];

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getPeriodDateKeys(period, today) {
  if (period === "Today") return [getDateKey(today)];

  if (period === "This Week") {
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return getDateKey(date);
    });
  }

  return Array.from(
    {
      length: new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate(),
    },
    (_, index) =>
      getDateKey(new Date(today.getFullYear(), today.getMonth(), index + 1)),
  );
}

function isHabitCompletedOn(habit, dateKey, todayKey) {
  return (
    (habit.completedDates || []).includes(dateKey) ||
    (dateKey === todayKey && habit.completed)
  );
}

function getCurrentStreak(habit, today) {
  const completedDates = new Set(habit.completedDates || []);
  if (habit.completed) completedDates.add(getDateKey(today));

  let streak = 0;
  const date = new Date(today);
  while (completedDates.has(getDateKey(date))) {
    streak += 1;
    date.setDate(date.getDate() - 1);
  }
  return streak;
}

export default function ProgressScreen({ habits, onToggleHabit }) {
  const [period, setPeriod] = useState("This Week");
  const today = new Date();
  const todayKey = getDateKey(today);
  const periodDateKeys = getPeriodDateKeys(period, today);
  const totalChecks = habits.length * periodDateKeys.length;
  const completedChecks = habits.reduce(
    (total, habit) =>
      total +
      periodDateKeys.filter((dateKey) =>
        isHabitCompletedOn(habit, dateKey, todayKey),
      ).length,
    0,
  );
  const score = totalChecks
    ? Math.round((completedChecks / totalChecks) * 100)
    : 0;
  const weekDates = getPeriodDateKeys("This Week", today);
  const currentStreak = Math.max(
    0,
    ...habits.map((habit) => getCurrentStreak(habit, today)),
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.screenContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageEyebrow}>YOUR CONSISTENCY</Text>
        <Text style={styles.pageTitle}>Progress</Text>

        <View style={styles.segment}>
          {periods.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => setPeriod(option)}
              style={[
                styles.segmentOption,
                period === option && styles.segmentActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  period === option && styles.segmentTextActive,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.scorePanel}>
          <View style={styles.scoreCopy}>
            <Text style={styles.panelHeading}>Habits</Text>

            <View style={styles.legendRow}>
              <View
                style={[styles.legendDot, { backgroundColor: "#F05E79" }]}
              />
              <Text style={styles.legendText}>Completed {completedChecks}</Text>
            </View>

            <View style={styles.legendRow}>
              <View
                style={[styles.legendDot, { backgroundColor: "#F5C85B" }]}
              />

              <Text style={styles.legendText}>
                Remaining {Math.max(totalChecks - completedChecks, 0)}
              </Text>
            </View>

            <View style={styles.legendRow}>
              <View
                style={[styles.legendDot, { backgroundColor: "#292A35" }]}
              />
              <Text style={styles.legendText}>Overdue 0</Text>
            </View>
          </View>
          <View style={styles.scoreRing}>
            <Svg width={116} height={116} viewBox="0 0 116 116">
              <Circle
                cx="58"
                cy="58"
                r="49"
                fill="none"
                stroke="#ECECEF"
                strokeWidth="10"
              />
              <Circle
                cx="58"
                cy="58"
                r="49"
                fill="none"
                stroke="#FF6B86"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 49}`}
                strokeDashoffset={`${2 * Math.PI * 49 * (1 - score / 100)}`}
                transform="rotate(-90 58 58)"
              />
            </Svg>
            <View style={styles.ringCutout}>
              <Text style={styles.scoreCaption}>Habit score</Text>
              <Text style={styles.scoreValue}>{score}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCell}>
            <Text style={styles.summaryValue}>
              {completedChecks}/{totalChecks}
            </Text>
            <Text style={styles.summaryLabel}>Done {period.toLowerCase()}</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryCell}>
            <Text style={styles.summaryValue}>{currentStreak} days</Text>
            <Text style={styles.summaryLabel}>Current streak</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Habits progress</Text>
        {habits.map((habit) => {
          const habitCompleted = periodDateKeys.filter((dateKey) =>
            isHabitCompletedOn(habit, dateKey, todayKey),
          ).length;
          const habitProgress = periodDateKeys.length
            ? Math.round((habitCompleted / periodDateKeys.length) * 100)
            : 0;

          return (
            <View
              key={habit.id}
              style={[
                styles.progressCard,
                { backgroundColor: habit.color || "#4388F5" },
              ]}
            >
              <View style={styles.progressTopRow}>
                <View style={styles.progressIcon}>
                  <HabitGlyph
                    icon={habit.icon || "sparkles-outline"}
                    iconType={habit.iconType}
                    size={21}
                    color={habit.color || "#4388F5"}
                  />
                </View>

                <Text numberOfLines={1} style={styles.progressHabitName}>
                  {habit.title}
                </Text>

                <Text style={styles.streakPill}>
                  {habitCompleted} / {periodDateKeys.length}
                </Text>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[styles.progressFill, { width: `${habitProgress}%` }]}
                />
              </View>

              <View style={styles.weekRow}>
                {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => {
                  const dateKey = weekDates[index];
                  const marked = isHabitCompletedOn(habit, dateKey, todayKey);
                  return (
                    <TouchableOpacity
                      key={`${day}-${index}`}
                      accessibilityRole="checkbox"
                      accessibilityLabel={`${habit.title}, ${day}, ${dateKey}`}
                      accessibilityState={{ checked: marked }}
                      onPress={() => onToggleHabit(habit.id, dateKey)}
                      style={styles.dayStatus}
                      hitSlop={5}
                    >
                      <View
                        style={[styles.dayMark, marked && styles.dayMarkDone]}
                      >
                        {marked && (
                          <Ionicons
                            name="checkmark"
                            size={11}
                            color={habit.color || "#4388F5"}
                          />
                        )}
                      </View>
                      <Text style={styles.dayLabel}>{day}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.natural[50] },
  screenContent: { paddingTop: 18, paddingHorizontal: 21, paddingBottom: 126 },
  pageEyebrow: {
    color: "#E36F80",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
    marginBottom: 7,
  },
  pageTitle: {
    color: "#252630",
    fontSize: 29,
    fontWeight: "800",
    marginBottom: 23,
  },
  segment: {
    height: 44,
    flexDirection: "row",
    backgroundColor: "#ECECEF",
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  segmentOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
  },
  segmentActive: { backgroundColor: "#FFFFFF", elevation: 1 },
  segmentText: { color: "#71717A", fontSize: 12, fontWeight: "600" },
  segmentTextActive: { color: "#34353E" },
  scorePanel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 154,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E9E9EC",
  },
  scoreCopy: { gap: 10 },
  panelHeading: {
    color: "#252630",
    borderColor: theme.primary[500],
    borderTopColor: theme.secondary[500],
    marginBottom: 2,
  },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  legendDot: { width: 11, height: 11, borderRadius: 6 },
  legendText: { color: "#565760", fontSize: 12 },
  scoreRing: {
    width: 116,
    height: 116,
    borderRadius: 58,
    alignItems: "center",
    justifyContent: "center",
  },
  ringCutout: {
    position: "absolute",
    alignItems: "center",
  },
  scoreCaption: { color: "#92929A", fontSize: 9 },
  scoreValue: {
    color: "#252630",
    fontSize: 21,
    fontWeight: "800",
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    marginBottom: 7,
  },
  summaryCell: { flex: 1 },
  summaryValue: { color: "#292A34", fontSize: 17, fontWeight: "800" },
  summaryLabel: { color: "#8B8B93", fontSize: 11, marginTop: 4 },
  summaryDivider: {
    width: 1,
    height: 34,
    backgroundColor: "#E5E5E8",
    marginHorizontal: 18,
  },
  sectionTitle: {
    color: "#33343D",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 14,
  },
  progressCard: {
    minHeight: 136,
    borderRadius: 17,
    padding: 12,
    marginBottom: 13,
  },
  progressTopRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  progressIcon: {
    width: 37,
    height: 37,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  progressHabitName: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  streakPill: {
    overflow: "hidden",
    color: "#FFFFFF",
    backgroundColor: "rgba(32,33,45,0.18)",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 16,
    fontSize: 11,
    fontWeight: "700",
  },
  progressTrack: {
    height: 9,
    backgroundColor: "rgba(34,35,46,0.2)",
    borderRadius: 5,
    marginTop: 10,
    marginLeft: 46,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#FFFFFF", borderRadius: 5 },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingHorizontal: 2,
  },
  dayStatus: {
    minWidth: 34,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  dayMark: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  dayMarkDone: { borderColor: "#FFFFFF", backgroundColor: "#FFFFFF" },
  dayLabel: { color: "rgba(255,255,255,0.8)", fontSize: 9 },
});
