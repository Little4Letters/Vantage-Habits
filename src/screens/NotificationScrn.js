import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText as Text } from "../components/Typography.js";
import { palette as theme } from "../theme.js";

const notifications = [
  {
    id: "workout",
    icon: "barbell-outline",
    title: "Workout",
    detail: "Hurry up, it is time for your 30 minute workout.",
    action: "12 min",
    color: "#9660E8",
  },
  {
    id: "ice-bath",
    icon: "water-outline",
    title: "Ice Bath",
    detail: "Oops, you missed your ice bath.",
    action: "View",
    color: theme.primary[500],
  },
  {
    id: "daily-action",
    icon: "fitness-outline",
    title: "Daily Action",
    detail: "Check out your daily actions.",
    action: "Add+",
    color: "#4388F5",
  },
];

export default function AlertsScreen({ navigation }) {
  const [morningReminder, setMorningReminder] = useState(true);
  const [eveningReminder, setEveningReminder] = useState(false);
  const [streakNotice, setStreakNotice] = useState(true);
  const [readIds, setReadIds] = useState([]);
  const [verified, setVerified] = useState(false);

  const markRead = (id) => {
    setReadIds((current) =>
      current.includes(id) ? current : [...current, id],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.screenContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageEyebrow}>STAY ON TRACK</Text>
        <Text style={styles.pageTitle}>Notifications</Text>
        <Text style={styles.pageSubtitle}>Notifications and Live Alerts</Text>

        <View style={styles.alertHighlight}>
          <View style={styles.alertIcon}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={theme.primary[500]}
            />
          </View>
          <View style={styles.alertHighlightCopy}>
            <Text style={styles.alertHighlightTitle}>Your reminders</Text>
            <Text style={styles.alertHighlightDetail}>
              Stay consistent with your daily habits.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>DAILY REMINDERS</Text>
        <View style={styles.reminderList}>
          <View style={styles.reminderRow}>
            <View style={styles.reminderCopy}>
              <Text style={styles.reminderTitle}>Morning reminder</Text>
              <Text style={styles.reminderDetail}>
                Start your day with your habits
              </Text>
            </View>
            <Switch
              value={morningReminder}
              onValueChange={setMorningReminder}
            />
          </View>
          <View style={styles.reminderRow}>
            <View style={styles.reminderCopy}>
              <Text style={styles.reminderTitle}>Evening reminder</Text>
              <Text style={styles.reminderDetail}>
                Review your progress for the day
              </Text>
            </View>
            <Switch
              value={eveningReminder}
              onValueChange={setEveningReminder}
            />
          </View>
          <View style={styles.reminderRow}>
            <View style={styles.reminderCopy}>
              <Text style={styles.reminderTitle}>Streak alerts</Text>
              <Text style={styles.reminderDetail}>
                Get notified about your habit streaks
              </Text>
            </View>
            <Switch value={streakNotice} onValueChange={setStreakNotice} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>LIVE ALERTS</Text>
        <View style={styles.notificationList}>
          {notifications.map((item) => {
            const isRead = readIds.includes(item.id);
            return (
              <View
                key={item.id}
                style={[
                  styles.notificationCard,
                  { backgroundColor: item.color },
                  isRead && styles.notificationRead,
                ]}
              >
                <View style={styles.notificationIcon}>
                  <Ionicons name={item.icon} size={22} color={item.color} />
                </View>
                <View style={styles.notificationCopy}>
                  <Text style={styles.notificationTitle}>{item.title}</Text>
                  <Text numberOfLines={2} style={styles.notificationDetail}>
                    {item.detail}
                  </Text>
                </View>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={`${item.action}: ${item.title}`}
                  onPress={() =>
                    item.id === "daily-action"
                      ? navigation?.navigate("Add")
                      : markRead(item.id)
                  }
                  style={styles.notificationAction}
                >
                  <Text style={styles.notificationActionText}>
                    {isRead && item.action !== "Add+" ? "Done" : item.action}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>OTHER NOTIFICATIONS</Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={verified ? "Email verified" : "Verify email"}
          onPress={() => setVerified(true)}
          style={styles.emailCard}
        >
          <View style={styles.emailIcon}>
            <Ionicons
              name={verified ? "checkmark-circle-outline" : "mail-outline"}
              size={20}
              color={theme.natural[600]}
            />
          </View>
          <View style={styles.notificationCopy}>
            <Text style={styles.emailTitle}>
              {verified ? "Email Verified" : "Email Verification"}
            </Text>
            <Text style={styles.emailDetail}>
              {verified
                ? "Your email is verified."
                : "We sent a verification code to your email."}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.white },
  screenContent: { paddingTop: 20, paddingHorizontal: 18, paddingBottom: 126 },
  pageEyebrow: {
    color: theme.primary[500],
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  pageTitle: {
    color: theme.tertiary[900],
    fontSize: 23,
    fontWeight: "800",
    marginBottom: 3,
  },
  pageSubtitle: { color: theme.natural[400], fontSize: 11, marginBottom: 18 },
  alertHighlight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: theme.tertiary[50],
    marginBottom: 23,
  },
  alertIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: theme.white,
    alignItems: "center",
    justifyContent: "center",
  },
  alertHighlightCopy: { flex: 1 },
  alertHighlightTitle: {
    color: theme.tertiary[800],
    fontSize: 13,
    fontWeight: "800",
  },
  alertHighlightDetail: {
    color: theme.natural[400],
    fontSize: 10,
    marginTop: 3,
  },
  sectionTitle: {
    color: theme.tertiary[800],
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
  },
  reminderList: { gap: 8, marginBottom: 23 },
  reminderRow: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: theme.tertiary[50],
  },
  reminderCopy: { flex: 1 },
  reminderTitle: {
    color: theme.tertiary[800],
    fontSize: 11,
    fontWeight: "700",
  },
  reminderDetail: { color: theme.natural[400], fontSize: 9, marginTop: 3 },
  notificationList: { gap: 9, marginBottom: 23 },
  notificationCard: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    padding: 9,
    borderRadius: 13,
  },
  notificationRead: { opacity: 0.66 },
  notificationIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: theme.white,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationCopy: { flex: 1, minWidth: 0 },
  notificationTitle: { color: theme.white, fontSize: 12, fontWeight: "800" },
  notificationDetail: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 9,
    marginTop: 3,
  },
  notificationAction: {
    minWidth: 50,
    minHeight: 26,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    paddingHorizontal: 8,
    backgroundColor: "rgba(24,23,30,0.18)",
  },
  notificationActionText: {
    color: theme.white,
    fontSize: 9,
    fontWeight: "700",
  },
  emailCard: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 13,
    backgroundColor: theme.tertiary[50],
  },
  emailIcon: {
    width: 37,
    height: 37,
    borderRadius: 10,
    backgroundColor: theme.white,
    alignItems: "center",
    justifyContent: "center",
  },
  emailTitle: { color: theme.tertiary[800], fontSize: 11, fontWeight: "700" },
  emailDetail: { color: theme.natural[400], fontSize: 9, marginTop: 3 },
});
