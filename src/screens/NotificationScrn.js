import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import ReminderRow from "../components/ReminderSec.js";
import { PoppinsText as Text } from "../components/Typography.js";

export default function AlertsScreen() {
  const [morningReminder, setMorningReminder] = useState(true);
  const [eveningReminder, setEveningReminder] = useState(false);
  const [streakNotice, setStreakNotice] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.screenContent}>
        <Text style={styles.pageEyebrow}>STAY ON TRACK</Text>
        <Text style={styles.pageTitle}>Alerts</Text>
        <View style={styles.alertHighlight}>
          <View style={styles.alertIcon}>
            <Ionicons name="notifications" size={22} color="#F05E79" />
          </View>
          <View style={styles.alertHighlightCopy}>
            <Text style={styles.alertHighlightTitle}>Your reminders</Text>
            <Text style={styles.alertHighlightDetail}>
              A little nudge at the right time.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>DAILY REMINDERS</Text>
        <ReminderRow
          icon="sunny-outline"
          title="Morning check-in"
          detail="Every day · 8:00 AM"
          value={morningReminder}
          onChange={setMorningReminder}
        />
        <ReminderRow
          icon="moon-outline"
          title="Evening wrap-up"
          detail="Every day · 8:30 PM"
          value={eveningReminder}
          onChange={setEveningReminder}
        />
        <Text style={[styles.sectionTitle, styles.alertSectionTitle]}>
          MILESTONES
        </Text>
        <ReminderRow
          icon="flame-outline"
          title="Streak reminders"
          detail="When a streak is at risk"
          value={streakNotice}
          onChange={setStreakNotice}
        />
        <Text style={styles.localNote}>
          Reminder preferences are saved for this preview only.
        </Text>
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
  sectionTitle: {
    color: "#33343D",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 14,
  },
  alertHighlight: {
    minHeight: 83,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 28,
  },
  alertIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#FFF0F2",
    alignItems: "center",
    justifyContent: "center",
  },
  alertHighlightCopy: { flex: 1 },
  alertHighlightTitle: { color: "#292A34", fontSize: 14, fontWeight: "700" },
  alertHighlightDetail: { color: "#85858D", fontSize: 11, marginTop: 5 },
  alertSectionTitle: { marginTop: 16 },
  localNote: { color: "#9A9AA2", fontSize: 11, lineHeight: 16, marginTop: 21 },
});
