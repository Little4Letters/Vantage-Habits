import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText as Text } from "../components/Typography.js";//src, custom Text component nga ginagamit sa screen.
import { palette as theme } from "../theme.js"; //src, color palette nga ginagamit san design.
import ScreenTutorial from "../components/ScreenTutorial.js"; //src, tutorial component nga nagpapakita guide sa user.

// notification nga makikita sa Live Alerts section.
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

// Main function san Notifications Screen.
export default function AlertsScreen({ navigation, accountId }) {
  //Ini an useState nga nagtatago kon enabled or disabled an kada reminder.
  const [reminderSettings, setReminderSettings] = useState({
    morningReminder: true,
    eveningReminder: false,
    streakNotice: true,
  });
   // Checks if saved reminder settings have finished loading.
  const [remindersLoaded, setRemindersLoaded] = useState(false);
  // nagtatago san IDs san mga notification nga nabasa na
  const [readIds, setReadIds] = useState([]); 
   // Checks if the email verification button was pressed
  const [verified, setVerified] = useState(false);

 // ASYNC STORAGE: Ginkukuha an saved reminder settings san current account.
  // Ini para ma-load utro an previous settings san user.
  useEffect(() => {
    let isMounted = true;

    const loadReminders = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem(
          `@vantage-habits/reminders:${accountId}`,
        );
         // Kon may saved settings, inbabalik san reminderSettings
        if (storedSettings && isMounted) {
          setReminderSettings((current) => ({
            ...current,
            ...JSON.parse(storedSettings),
          }));
        }
        //NAGPAPAKITA SAN ERROR KUN D MA LOAD
      } catch (error) {
        console.warn("Could not load reminder settings:", error);
        Alert.alert(
          "Couldn't load reminders",
          "Your saved reminder settings could not be loaded.",
        );
      } finally {
        if (isMounted) setRemindersLoaded(true);
      }
    };

    loadReminders();
    // Cleanup para diri mag-update an state kon diri na mounted an screen.
    return () => {
      isMounted = false;
    };
  }, [accountId]);

// function NA nagsa-save san bag-o nga reminder setting kon napindot an switch.
  const updateReminder = async (setting, value, label) => {
    const nextSettings = { ...reminderSettings, [setting]: value };
    try {
      // Ginsasave an updated settings gamit an AsyncStorage.
      await AsyncStorage.setItem(
        `@vantage-habits/reminders:${accountId}`,
        JSON.stringify(nextSettings),
      );
      setReminderSettings(nextSettings); // Gin-uupdate an reminder settings sa screen.
      // Nagpapakita confirmation kon successfully saved.
      Alert.alert("Reminder saved", `${label} ${value ? "enabled" : "disabled"}.`);
    } catch (error) { //kun d ma save
      Alert.alert(
        "Couldn't save reminder",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  };

   // Ini nga function nagdadagdag san notification ID sa list san mga nabasa na.
  const markRead = (id) => {
    setReadIds((current) =>
      current.includes(id) ? current : [...current, id],
    );
  };

  // PAGE UI
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
    {/* Src/components/ScreenTutorial.js */}
      <ScreenTutorial
        accountId={accountId}
        screenKey="alerts"
        steps={[
          {
            icon: "notifications-outline",
            title: "Choose reminders",
            text: "Turn morning, evening, and streak reminders on or off.",
          },
          {
            icon: "mail-unread-outline",
            title: "Check live alerts",
            text: "Open an alert to mark it read and review your latest updates.",
          },
          {
            icon: "shield-checkmark-outline",
            title: "Keep it personal",
            text: "Reminder settings stay available for the current account.",
          },
        ]}
      />
      {/* Makes the page scrollable. */}
      <ScrollView
        contentContainerStyle={styles.screenContent}
        showsVerticalScrollIndicator={false}
      > {/* PAGE HEADER */}
        <Text style={styles.pageEyebrow}>STAY ON TRACK</Text>
        <Text style={styles.pageTitle}>Notifications</Text>
        <Text style={styles.pageSubtitle}>Notifications and Live Alerts</Text>

        {/* REMINDER INTRODUCTION CARD */}
        <View style={styles.alertHighlight}>
          <View style={styles.alertIcon}>
            <Ionicons //notif. icon nagamit Ionicons
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

        {/* DAILY REMINDERS SECTION */}
        <Text style={styles.sectionTitle}>DAILY REMINDERS</Text>
        <View style={styles.reminderList}>
          {/* MORNING REMINDER SWITCH */}
          <View style={styles.reminderRow}>
            <View style={styles.reminderCopy}>
              <Text style={styles.reminderTitle}>Morning reminder</Text>
              <Text style={styles.reminderDetail}>
                Start your day with your habits
              </Text>
            </View>
            <Switch
              value={reminderSettings.morningReminder}
              disabled={!remindersLoaded}
              onValueChange={(value) =>
                updateReminder("morningReminder", value, "Morning reminder")
              }
            />
          </View>
          {/* EVENING REMINDER SWITCH */}
          <View style={styles.reminderRow}>
            <View style={styles.reminderCopy}>
              <Text style={styles.reminderTitle}>Evening reminder</Text>
              <Text style={styles.reminderDetail}>
                Review your progress for the day
              </Text>
            </View>
            <Switch
              value={reminderSettings.eveningReminder}
              disabled={!remindersLoaded}
              onValueChange={(value) =>
                updateReminder("eveningReminder", value, "Evening reminder")
              }
            />
          </View>
          {/* STREAK ALERT SWITCH */} 
          <View style={styles.reminderRow}>
            <View style={styles.reminderCopy}>
              <Text style={styles.reminderTitle}>Streak alerts</Text>
              <Text style={styles.reminderDetail}>
                Get notified about your habit streaks
              </Text>
            </View>
            <Switch
              value={reminderSettings.streakNotice}
              disabled={!remindersLoaded}
              onValueChange={(value) =>
                updateReminder("streakNotice", value, "Streak alerts")
              }
            />
          </View>
        </View>

        {/* Didi makikita an Workout, Ice Bath, ngan Daily Action. */}
        <Text style={styles.sectionTitle}>LIVE ALERTS</Text>
        <View style={styles.notificationList}>

          {/* Map para ipakita an ngatanan nga notification tikang sa notifications array. */}
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
              > {/* ALERT ICON */}
                <View style={styles.notificationIcon}>
                  <Ionicons name={item.icon} size={22} color={item.color} />
                </View>
                {/* ALERT TITLE AND DESCRIPTION */}
                <View style={styles.notificationCopy}>
                  <Text style={styles.notificationTitle}>{item.title}</Text>
                  <Text numberOfLines={2} style={styles.notificationDetail}>
                    {item.detail}
                  </Text>
                </View>

                {/* ALERT ACTION BUTTON: Button para sa kada notification. */}
                {/* Daily Action nag-o-open san Add screen. An iba nga alerts minamarkahan nga read. */}
                {/* GO TO: App navigation setup para makita an "Add" screen route. */}
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
        {/* OTHER NOTIFICATIONS SECTION */} 
        <Text style={styles.sectionTitle}>OTHER NOTIFICATIONS</Text>
        {/* EMAIL VERIFICATION CARD */}
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
