import React, { useEffect, useState } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AppText as Text,
  AppTextInput as TextInput,
} from "../components/Typography.js";
import { palette as theme } from "../theme.js";
import ScreenTutorial from "../components/ScreenTutorial.js";

const detailPages = {
  "About Us": [
    {
      heading: "Small steps, built into your day",
      body: "Vantage Habits helps you create routines, check in each day, and see your progress over time.",
    },
    {
      heading: "Make it your own",
      body: "Create habits that matter to you, choose when to work on them, and use your progress history to celebrate consistency.",
    },
  ],
  "Contact Us": [
    {
      heading: "We're here to help",
      body: "For help with your habits or account, use the support channel provided with your copy of Vantage Habits. A direct support email is not configured in this version of the app.",
    },
    {
      heading: "When you get in touch",
      body: "Include a short description of the issue and your device type. Never share your password or other sensitive account information.",
    },
  ],
  "Terms of Use": [
    {
      heading: "Using the app",
      body: "Vantage Habits is a personal tool for creating habits and tracking your progress. Use it lawfully and keep your sign-in details private.",
    },
    {
      heading: "Your information",
      body: "You are responsible for the profile information and habit details you enter. Keep your device and account access secure.",
    },
    {
      heading: "Availability",
      body: "The app is provided as-is. Features may change, and we cannot guarantee uninterrupted access or that information stored on your device will always be available.",
    },
  ],
  "Data Privacy": [
    {
      heading: "Information you enter",
      body: "The app uses your name, email address, and account details to support your profile, along with the habits and completion history you choose to record.",
    },
    {
      heading: "Where it is stored",
      body: "Your account information and habit data are stored on your device. Account information uses secure device storage when available, with local storage as a fallback; habits and progress are stored locally.",
    },
    {
      heading: "Your control",
      body: "Signing out ends your current session but does not delete the profile or habit information saved on the device. Avoid entering sensitive information in habit names or notes.",
    },
  ],
};

export default function ProfileScreen({
  profile,
  onUpdateProfile,
  onLogout,
  accountId,
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile?.name || "Habit Builder");
  const [email, setEmail] = useState(profile?.email || "");
  const [gender, setGender] = useState(profile?.gender || "Male");
  const [birthDate, setBirthDate] = useState(
    profile?.birthDate || "12 / 05 / 1996",
  );
  const [activeAction, setActiveAction] = useState("");
  const [logoutScale] = useState(() => new Animated.Value(1));
  const [detailTransition] = useState(() => new Animated.Value(0));
  const [detailOpacity] = useState(() => new Animated.Value(0));
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const isDetailPage =
    activeAction === "Rate Us 5 Star" ||
    Object.prototype.hasOwnProperty.call(detailPages, activeAction);

  useEffect(() => {
    if (!isDetailPage) return undefined;

    detailTransition.setValue(28);
    detailOpacity.setValue(0);
    Animated.parallel([
      Animated.timing(detailTransition, {
        toValue: 0,
        duration: 230,
        useNativeDriver: Platform.OS !== "web",
      }),
      Animated.timing(detailOpacity, {
        toValue: 1,
        duration: 190,
        useNativeDriver: Platform.OS !== "web",
      }),
    ]).start();

    return () => {
      detailTransition.stopAnimation();
      detailOpacity.stopAnimation();
    };
  }, [detailOpacity, detailTransition, isDetailPage]);

  const closeDetailPage = () => {
    Animated.parallel([
      Animated.timing(detailTransition, {
        toValue: 28,
        duration: 190,
        useNativeDriver: Platform.OS !== "web",
      }),
      Animated.timing(detailOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: Platform.OS !== "web",
      }),
    ]).start(({ finished }) => {
      if (finished) setActiveAction("");
    });
  };

  // The ProfileScreen component manages the user's profile information, allowing them to view and edit their account details.
  // It includes state variables for editing mode, name, email, gender, birth date, and active action. The component renders a profile banner, a list of menu items for various actions, and an editing form when in editing mode.

  // The user can update their information and select gender and birth date through interactive elements.
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

  // What is return? This is the main rendering of the ProfileScreen component.
  // It returns a SafeAreaView that contains a ScrollView. Inside the ScrollView, it conditionally renders either the editing form or the profile view based on the editing state. The profile view includes a banner with user information and a list of menu items for various actions. The editing form allows users to update their name, email, gender, and birth date, with appropriate input fields and buttons for saving changes.
  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        !editing && !isDetailPage && styles.profileSafeArea,
      ]}
      edges={isDetailPage ? [] : ["top"]}
    >
      <ScreenTutorial
        accountId={accountId}
        screenKey="profile"
        steps={[
          {
            icon: "person-outline",
            title: "Review your account",
            text: "Your name and email appear at the top of this screen.",
          },
          {
            icon: "create-outline",
            title: "Edit account details",
            text: "Use Edit account to update your profile information.",
          },
          {
            icon: "log-out-outline",
            title: "Sign out safely",
            text: "Use Logout to end the current session. Your saved habits remain with this account.",
          },
        ]}
      />
      <ScrollView
        contentContainerStyle={styles.screenContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Editing Form */}
        {editing ? (
          <View>
            {/* Edit Heading */}
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => setEditing(false)}
              style={styles.editHeading}
            >
              {/* Back Button */}
              <View style={styles.editBack}>
                <Ionicons
                  name="chevron-back"
                  size={18}
                  color={theme.tertiary[800]}
                />

                {/* Edit Title paragraph sa Heading ini */}
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
              onPress={async () => {
                await onUpdateProfile({ name, email, gender, birthDate });
                setEditing(false);
              }}
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
                  onPress={async () => {
                    if (item.title === "Logout") {
                      Animated.sequence([
                        Animated.timing(logoutScale, {
                          toValue: 0.96,
                          duration: 90,
                          useNativeDriver: Platform.OS !== "web",
                        }),
                        Animated.timing(logoutScale, {
                          toValue: 1,
                          duration: 140,
                          useNativeDriver: Platform.OS !== "web",
                        }),
                      ]).start(async () => {
                        await onLogout();
                      });
                    } else {
                      if (item.title === "Rate Us 5 Star") {
                        setSelectedRating(0);
                        setRatingSubmitted(false);
                      }
                      setActiveAction(item.title);
                    }
                  }}
                  style={[
                    styles.menuItem,
                    item.title === "Logout" && {
                      transform: [{ scale: logoutScale }],
                    },
                  ]}
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
              !isDetailPage && (
                <Text style={styles.actionNote}>
                  {activeAction} is a frontend preview action.
                </Text>
              )
            ) : null}
          </>
        )}
      </ScrollView>
      {isDetailPage ? (
        <Animated.View
          style={[
            styles.detailPage,
            {
              opacity: detailOpacity,
              transform: [{ translateX: detailTransition }],
            },
          ]}
        >
          <SafeAreaView style={styles.detailSafeArea} edges={["top"]}>
            <View style={styles.detailHeader}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Back to profile"
                onPress={closeDetailPage}
                style={styles.detailBackButton}
              >
                <Ionicons
                  name="chevron-back"
                  size={21}
                  color={theme.tertiary[900]}
                />
              </TouchableOpacity>
              <Text style={styles.detailHeaderTitle}>{activeAction}</Text>
              <View style={styles.detailHeaderSpacer} />
            </View>
            <ScrollView
              contentContainerStyle={styles.detailContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.detailHero}>
                <View style={styles.detailHeroIcon}>
                  <Ionicons
                    name={
                      activeAction === "Rate Us 5 Star"
                        ? "star"
                        : menuItems.find((item) => item.title === activeAction)
                            ?.icon
                    }
                    size={25}
                    color={theme.white}
                  />
                </View>
                <Text style={styles.detailHeroTitle}>
                  {activeAction === "Rate Us 5 Star"
                    ? "Enjoying Vantage Habits?"
                    : activeAction === "About Us"
                      ? "Build habits that stick"
                      : activeAction === "Contact Us"
                        ? "Get in touch"
                        : activeAction === "Terms of Use"
                          ? "Using Vantage Habits"
                          : "Your data, your device"}
                </Text>
                <Text style={styles.detailHeroText}>
                  {activeAction === "Rate Us 5 Star"
                    ? "Choose a rating to let us know how the app is working for you."
                    : activeAction === "Data Privacy"
                      ? "A clear overview of the information this app uses."
                      : "Learn more about Vantage Habits and how to use it."}
                </Text>
              </View>
              {activeAction === "Rate Us 5 Star" ? (
                <View style={styles.ratingCard}>
                  <Text style={styles.detailSectionTitle}>Your rating</Text>
                  <View style={styles.ratingStars}>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <TouchableOpacity
                        key={rating}
                        accessibilityRole="button"
                        accessibilityLabel={`${rating} star${rating === 1 ? "" : "s"}`}
                        accessibilityState={
                          selectedRating === rating ? { selected: true } : {}
                        }
                        onPress={() => setSelectedRating(rating)}
                        style={styles.ratingStarButton}
                      >
                        <Ionicons
                          name={
                            rating <= selectedRating ? "star" : "star-outline"
                          }
                          size={34}
                          color={
                            rating <= selectedRating
                              ? theme.secondary[600]
                              : theme.natural[300]
                          }
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={styles.ratingFeedback}>
                    {ratingSubmitted
                      ? "Thanks for letting us know!"
                      : selectedRating
                        ? `${selectedRating} out of 5 stars`
                        : "Tap a star to rate your experience"}
                  </Text>
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityState={{
                      disabled: selectedRating === 0 || ratingSubmitted,
                    }}
                    disabled={selectedRating === 0 || ratingSubmitted}
                    onPress={() => setRatingSubmitted(true)}
                    style={[
                      styles.ratingSubmitButton,
                      (selectedRating === 0 || ratingSubmitted) &&
                        styles.ratingSubmitDisabled,
                    ]}
                  >
                    <Text style={styles.ratingSubmitText}>
                      {ratingSubmitted ? "Thanks for rating" : "Submit rating"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.detailSectionList}>
                  {detailPages[activeAction].map((section) => (
                    <View key={section.heading} style={styles.detailSection}>
                      <Text style={styles.detailSectionTitle}>
                        {section.heading}
                      </Text>
                      <Text style={styles.detailSectionText}>
                        {section.body}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      ) : null}
    </SafeAreaView>
  );
}

// Syling for the ProfileScreen component
// Defining the layout and appearance of various elements such as the safe area, profile banner, menu items, input fields, and buttons.
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.natural[50] },
  profileSafeArea: { backgroundColor: "#FF637D" },
  screenContent: {
    paddingTop: 16,
    paddingHorizontal: 17,
    paddingBottom: 126,
    backgroundColor: theme.natural[50],
  },
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
  detailPage: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: theme.natural[50],
  },
  detailSafeArea: { flex: 1 },
  detailHeader: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 17,
    backgroundColor: theme.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.natural[100],
  },
  detailBackButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    backgroundColor: theme.tertiary[50],
  },
  detailHeaderTitle: {
    flex: 1,
    color: theme.tertiary[900],
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },
  detailHeaderSpacer: { width: 38 },
  detailContent: {
    paddingHorizontal: 17,
    paddingTop: 19,
    paddingBottom: 126,
  },
  detailHero: {
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 24,
    marginBottom: 16,
    backgroundColor: theme.primary[600],
    borderRadius: 20,
  },
  detailHeroIcon: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  detailHeroTitle: {
    color: theme.white,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  detailHeroText: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 7,
  },
  detailSectionList: { gap: 10 },
  detailSection: {
    padding: 16,
    backgroundColor: theme.white,
    borderRadius: 14,
  },
  detailSectionTitle: {
    color: theme.tertiary[900],
    fontSize: 13,
    fontWeight: "800",
  },
  detailSectionText: {
    color: theme.natural[500],
    fontSize: 12,
    lineHeight: 19,
    marginTop: 7,
  },
  ratingCard: {
    alignItems: "center",
    padding: 18,
    backgroundColor: theme.white,
    borderRadius: 14,
  },
  ratingStars: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  ratingStarButton: { paddingHorizontal: 5, paddingVertical: 7 },
  ratingFeedback: {
    color: theme.natural[500],
    fontSize: 12,
    marginTop: 5,
  },
  ratingSubmitButton: {
    minHeight: 46,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    borderRadius: 23,
    backgroundColor: theme.tertiary[900],
  },
  ratingSubmitDisabled: { opacity: 0.45 },
  ratingSubmitText: {
    color: theme.white,
    fontSize: 12,
    fontWeight: "700",
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
