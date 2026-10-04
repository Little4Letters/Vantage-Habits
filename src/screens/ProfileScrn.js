import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import ReminderRow from "../components/ReminderSec.js";
import { PoppinsText as Text } from "../components/Typography.js";

export default function ProfileScreen() {
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [quietMode, setQuietMode] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.screenContent}>
        <Text style={styles.pageEyebrow}>YOUR SPACE</Text>
        <Text style={styles.pageTitle}>Profile</Text>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={31} color="#FFFFFF" />
          </View>
          <View style={styles.profileCopy}>
            <Text style={styles.profileName}>Habit Builder</Text>
            <Text style={styles.profileSubtitle}>Small steps, every day</Text>
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
            style={styles.editButton}
          >
            <Ionicons name="create-outline" size={20} color="#62636C" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileStats}>
          <View style={styles.profileStat}>
            <Text style={styles.profileStatValue}>12</Text>
            <Text style={styles.profileStatLabel}>Day streak</Text>
          </View>
          <View style={styles.profileStatDivider} />
          <View style={styles.profileStat}>
            <Text style={styles.profileStatValue}>8</Text>
            <Text style={styles.profileStatLabel}>Habits done</Text>
          </View>
          <View style={styles.profileStatDivider} />
          <View style={styles.profileStat}>
            <Text style={styles.profileStatValue}>4</Text>
            <Text style={styles.profileStatLabel}>Best streak</Text>
          </View>
        </View>
        <Text style={[styles.sectionTitle, styles.profileSectionTitle]}>
          PREFERENCES
        </Text>
        <ReminderRow
          icon="bar-chart-outline"
          title="Weekly Summary"
          detail="A recap of your progress"
          value={weeklySummary}
          onChange={setWeeklySummary}
        />
        <ReminderRow
          icon="moon-outline"
          title="Quiet Mode"
          detail="Reduce reminder notifications"
          value={quietMode}
          onChange={setQuietMode}
        />
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => {}}
          style={styles.profileLink}
        >
          <View style={styles.reminderIcon}>
            <Ionicons name="help-circle-outline" size={20} color="#656670" />
          </View>
          <Text style={styles.profileLinkText}>Help and support</Text>
          <Ionicons name="chevron-forward" size={17} color="#96969E" />
        </TouchableOpacity>
        <Text style={styles.localNote}>
          This profile is a visual preview. Your information stays on this
          screen.
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
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#9562E8",
    alignItems: "center",
    justifyContent: "center",
  },
  profileCopy: { flex: 1, marginLeft: 13 },
  profileName: { color: "#292A34", fontSize: 16, fontWeight: "800" },
  profileSubtitle: { color: "#85858D", fontSize: 12, marginTop: 5 },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F1F1F3",
    alignItems: "center",
    justifyContent: "center",
  },
  profileStats: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 18,
    marginBottom: 30,
  },
  profileStat: { flex: 1, alignItems: "center" },
  profileStatValue: { color: "#292A34", fontSize: 18, fontWeight: "800" },
  profileStatLabel: { color: "#85858D", fontSize: 10, marginTop: 5 },
  profileStatDivider: { height: 30, width: 1, backgroundColor: "#E8E8EB" },
  profileSectionTitle: { marginBottom: 5 },
  profileLink: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E9E9EC",
    gap: 11,
  },
  reminderIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#ECECEF",
    alignItems: "center",
    justifyContent: "center",
  },
  profileLinkText: {
    flex: 1,
    color: "#33343D",
    fontSize: 13,
    fontWeight: "600",
  },
  localNote: { color: "#9A9AA2", fontSize: 11, lineHeight: 16, marginTop: 21 },
});
