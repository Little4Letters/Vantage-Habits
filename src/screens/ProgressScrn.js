import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { PoppinsText as Text } from "../components/Typography.js";

const periods = ["Today", "This Week", "This Month"];

export default function ProgressScreen({ habits }) {
  const [period, setPeriod] = useState("This Week");
  const complete = habits.filter((habit) => habit.completed).length;
  const score = habits.length
    ? Math.round((complete / habits.length) * 100)
    : 0;

  // Reasons about SafeAreaView and ScrollView:

  // 1. SafeAreaView is used to ensure that the content is displayed within the safe area boundaries of the device
  // 2. Avoiding notches and other screen obstructions. The ScrollView allows for vertical scrolling of the content,
  // 3. Making it accessible on smaller screens. The Pressable components are used for interactive elements and,
  // 4. Allowing users to select different time periods for viewing their progress.

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
            <Pressable
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
            </Pressable>
          ))}
        </View>

        <View style={styles.scorePanel}>
          <View style={styles.scoreCopy}>
            <Text style={styles.panelHeading}>Habits</Text>

            <View style={styles.legendRow}>
              <View
                style={[styles.legendDot, { backgroundColor: "#F05E79" }]}
              />
              <Text style={styles.legendText}>Completed {complete}</Text>
            </View>

            <View style={styles.legendRow}>
              <View
                style={[styles.legendDot, { backgroundColor: "#F5C85B" }]}
              />

              <Text style={styles.legendText}>
                Remaining {Math.max(habits.length - complete, 0)}
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
            <View style={styles.ringCutout}>
              <Text style={styles.scoreCaption}>Habit score</Text>
              <Text style={styles.scoreValue}>{score}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCell}>
            <Text style={styles.summaryValue}>
              {complete}/{habits.length}
            </Text>
            <Text style={styles.summaryLabel}>Done {period.toLowerCase()}</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryCell}>
            <Text style={styles.summaryValue}>{complete ? "4" : "0"} days</Text>
            <Text style={styles.summaryLabel}>Best streak</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Habits progress</Text>
        {habits.map((habit) => (
          <View
            key={habit.id}
            style={[
              styles.progressCard,
              { backgroundColor: habit.color || "#4388F5" },
            ]}
          >
            <View style={styles.progressTopRow}>
              <View style={styles.progressIcon}>
                <Ionicons
                  name={habit.icon || "sparkles-outline"}
                  size={21}
                  color={habit.color || "#4388F5"}
                />
              </View>

              <Text numberOfLines={1} style={styles.progressHabitName}>
                {habit.title}
              </Text>

              <Text style={styles.streakPill}>
                {habit.completed ? "4 Days" : "2 Days"}
              </Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: habit.completed ? "76%" : "38%" },
                ]}
              />
            </View>

            <View style={styles.weekRow}>
              {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => {
                const marked =
                  habit.completed ||
                  index < (habit.title === "Jogging" ? 2 : 4);
                return (
                  <View key={`${day}-${index}`} style={styles.dayStatus}>
                    <View
                      style={[styles.dayMark, marked && styles.dayMarkDone]}
                    >
                      {marked && (
                        <Ionicons name="checkmark" size={11} color="#9660E8" />
                      )}
                    </View>
                    <Text style={styles.dayLabel}>{day}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F7F7F8" },
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
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 2,
  },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  legendDot: { width: 11, height: 11, borderRadius: 6 },
  legendText: { color: "#565760", fontSize: 12 },
  scoreRing: {
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 11,
    borderColor: "#F05E79",
    borderTopColor: "#F5CB58",
    borderRightColor: "#E8E8EA",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-35deg" }],
  },
  ringCutout: { alignItems: "center", transform: [{ rotate: "35deg" }] },
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
  dayStatus: { alignItems: "center", gap: 4 },
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
