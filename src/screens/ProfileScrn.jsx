import React, { useState } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AppText as Text,
  AppTextInput as TextInput,
} from "../components/Typography.js";
import { palette as theme } from "../theme.js";

export default function ProfileScreen() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Habit Builder");
  const [email, setEmail] = useState("habit.builder@email.com");
  const [gender, setGender] = useState("Male");
  const [birthDate, setBirthDate] = useState("12 / 05 / 1996");
  const [activeAction, setActiveAction] = useState("");
  const menuItems = [
    { icon: "share-social-outline", title: "Share This App" },
    { icon: "star-outline", title: "Rate Us 5 Star" },
    { icon: "information-circle-outline", title: "About Us" },
    { icon: "call-outline", title: "Contact Us" },
    { icon: "document-text-outline", title: "Terms of Use" },
    { icon: "shield-checkmark-outline", title: "Data Privacy" },
    { icon: "lock-closed-outline", title: "Change Password" },
    { icon: "log-out-outline", title: "Logout" },
  ];

  return (
    <SafeAreaView
      style={[styles.safeArea, !editing && styles.profileSafeArea]}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={styles.screenContent}
        keyboardShouldPersistTaps="handled"
      >
        {editing ? (
          <View>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => setEditing(false)}
              style={styles.editHeading}
            >
              <View style={styles.editBack}>
                <Ionicons
                  name="chevron-back"
                  size={18}
                  color={theme.tertiary[800]}
                />
              </View>
              <View style={styles.editHeadingCopy}>
                <Text style={styles.editTitle}>Edit Account</Text>
                <Text style={styles.editSubtitle}>
                  Make changes on your account
                </Text>
              </View>
            </TouchableOpacity>

            <TextInput
              accessibilityLabel="Name"
              value={name}
              onChangeText={setName}
              style={styles.profileInput}
            />
            <TextInput
              accessibilityLabel="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.profileInput}
            />

            <Text style={styles.fieldLabel}>What is your gender?</Text>
            <View style={styles.genderRow}>
              {[
                { label: "Male", icon: "male" },
                { label: "Female", icon: "female" },
                { label: "Other", icon: "male-female" },
              ].map((option) => (
                <TouchableOpacity
                  key={option.label}
                  accessibilityRole="button"
                  accessibilityState={
                    gender === option.label ? { selected: true } : {}
                  }
                  onPress={() => setGender(option.label)}
                  style={[
                    styles.genderOption,
                    gender === option.label && styles.genderSelected,
                  ]}
                >
                  <Ionicons
                    name={option.icon}
                    size={19}
                    color={
                      gender === option.label ? theme.white : theme.natural[400]
                    }
                  />
                  <Text
                    style={[
                      styles.genderText,
                      gender === option.label && styles.genderTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>What is your date of birth?</Text>
            <View style={styles.birthDateRow}>
              {birthDate.split(" / ").map((part, index) => (
                <TextInput
                  key={index}
                  accessibilityLabel={
                    ["Birth day", "Birth month", "Birth year"][index]
                  }
                  value={part}
                  onChangeText={(value) =>
                    setBirthDate((current) =>
                      current
                        .split(" / ")
                        .map((datePart, partIndex) =>
                          partIndex === index ? value : datePart,
                        )
                        .join(" / "),
                    )
                  }
                  style={[styles.profileInput, styles.birthDateInput]}
                />
              ))}
            </View>

            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => setEditing(false)}
              style={styles.updateButton}
            >
              <Text style={styles.updateButtonText}>Update</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.profileBanner}>
              <View style={styles.profileBannerTop}>
                <View style={styles.profileCopy}>
                  <Text style={styles.profileName}>{name}</Text>
                  <Text style={styles.profileSubtitle}>{email}</Text>
                </View>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Edit account"
                  onPress={() => setEditing(true)}
                  style={styles.editButton}
                >
                  <Ionicons
                    name="create-outline"
                    size={19}
                    color={theme.white}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.menuList}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.title}
                  accessibilityRole="button"
                  onPress={() => setActiveAction(item.title)}
                  style={styles.menuItem}
                >
                  <View style={styles.menuIcon}>
                    <Ionicons name={item.icon} size={16} color={theme.white} />
                  </View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={15}
                    color={theme.natural[500]}
                  />
                </TouchableOpacity>
              ))}
            </View>
            {activeAction ? (
              <Text style={styles.actionNote}>
                {activeAction} is a frontend preview action.
              </Text>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.natural[50] },
  profileSafeArea: { backgroundColor: "#FF637D" },
  screenContent: { paddingTop: 16, paddingHorizontal: 17, paddingBottom: 126 },
  pageEyebrow: {
    color: theme.primary[400],
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
    marginBottom: 7,
  },
  pageTitle: {
    color: theme.tertiary[900],
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
  profileCopy: { flex: 1, marginLeft: 0, paddingRight: 50 },
  profileName: { color: theme.white, fontSize: 18, fontWeight: "800" },
  profileSubtitle: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 11,
    marginTop: 4,
  },
  editButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)",
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
  profileBanner: {
    minHeight: 162,
    justifyContent: "flex-end",
    backgroundColor: "#FF637D",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 19,
    marginBottom: 17,
    marginTop: -16,
    marginHorizontal: -17,
    overflow: "hidden",
  },
  profileBannerTop: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingTop: 18,
    paddingHorizontal: 5,
  },
  menuList: {
    gap: 8,
  },
  menuItem: {
    minHeight: 57,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F0F0F2",
    borderRadius: 12,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.tertiary[900],
  },
  menuTitle: {
    flex: 1,
    color: theme.tertiary[800],
    fontSize: 11,
    fontWeight: "600",
  },
  actionNote: {
    color: theme.natural[500],
    fontSize: 10,
    marginTop: 12,
    textAlign: "center",
  },
  editHeading: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },
  editBack: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.tertiary[50],
  },
  editHeadingCopy: { flex: 1 },
  editTitle: { color: theme.tertiary[900], fontSize: 15, fontWeight: "800" },
  editSubtitle: { color: theme.natural[400], fontSize: 9, marginTop: 2 },
  profileInput: {
    minHeight: 46,
    paddingHorizontal: 12,
    backgroundColor: theme.white,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: theme.tertiary[100],
    color: theme.tertiary[900],
    fontSize: 11,
    marginBottom: 11,
  },
  fieldLabel: {
    color: theme.tertiary[800],
    fontSize: 11,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 9,
  },
  genderRow: { flexDirection: "row", gap: 8 },
  genderOption: {
    flex: 1,
    minHeight: 62,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: theme.tertiary[50],
    borderRadius: 11,
  },
  genderSelected: { backgroundColor: theme.tertiary[900] },
  genderText: { color: theme.natural[500], fontSize: 10, fontWeight: "600" },
  genderTextSelected: { color: theme.white },
  birthDateRow: { flexDirection: "row", gap: 8 },
  birthDateInput: { flex: 1, textAlign: "center", paddingHorizontal: 6 },
  updateButton: {
    minHeight: 45,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.tertiary[900],
    borderRadius: 23,
    marginTop: 22,
  },
  updateButtonText: { color: theme.white, fontSize: 11, fontWeight: "700" },
});
