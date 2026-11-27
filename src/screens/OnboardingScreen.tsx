import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { palette as theme } from "../theme.js";

// ine an mga habit na makikita mo sa screen mao an image carousel
const habitShowcase = [
  {
    label: "#Reading",
    description: "A person reading a book",
    image:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=900&auto=format&fit=crop",
  },
  {
    label: "#Movement",
    description: "A person exercising outdoors",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=900&auto=format&fit=crop",
  },
  {
    label: "#Hydration",
    description: "A glass of water",
    image:
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=900&auto=format&fit=crop",
  },
  {
    label: "#Rest",
    description: "A calm bedroom prepared for sleep",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=900&auto=format&fit=crop",
  },
  {
    label: "#Mindfulness",
    description: "A person practicing meditation",
    image:
      "https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=900&auto=format&fit=crop",
  },
];

// Ini an props nga ginkikinahanglan san OnboardingScreen
// An onLogin ngan onCreateAccount asya an functions nga tikang sa parent component
type OnboardingScreenProps = {
  onLogin: () => void;
  onCreateAccount: () => void;
};

export default function OnboardingScreen({
  onLogin,
  onCreateAccount,
}: OnboardingScreenProps) {

  // Ini nga useState nagtatago san current width san image carousel.
  const [carouselWidth, setCarouselWidth] = useState(0);

  // Ini nga useState nagtatago san index san active nga habit image.
  const [activeHabit, setActiveHabit] = useState(0);

  return (

    // SafeAreaView para diri matabunan san phone status bar an UI
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>

    // ine an para sa scrollView para ma scroll an page kon diri maigo sa screen.
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        //Main container san bug-os nga screen.
        <View style={styles.content}>
          <View style={styles.illustration}>
            <View style={[styles.sideCard, styles.leftSideCard]} />
            <View style={[styles.sideCard, styles.rightSideCard]} />

            <View style={styles.mainCard}>
              <ScrollView
                horizontal
                pagingEnabled
                directionalLockEnabled
                showsHorizontalScrollIndicator={false}
                style={styles.carousel}
                onLayout={(event) =>
                  setCarouselWidth(event.nativeEvent.layout.width)
                }
                scrollEventThrottle={32}
                onScroll={(event) => {
                  if (carouselWidth > 0) {
                    const nextIndex = Math.min(
                      habitShowcase.length - 1,
                      Math.max(
                        0,
                        Math.round(
                          event.nativeEvent.contentOffset.x / carouselWidth,
                        ),
                      ),
                    );
                    setActiveHabit((current) =>
                      current === nextIndex ? current : nextIndex,
                    );
                  }
                }}
              >
                {habitShowcase.map((habit) => (
                  <View
                    key={habit.label}
                    style={[
                      styles.imageFrame,
                      { width: carouselWidth || "100%" },
                    ]}
                  >
                    <Image
                      accessibilityLabel={habit.description}
                      source={{ uri: habit.image }}
                      resizeMode="cover"
                      style={styles.cardImage}
                    />
                    <View style={styles.imageTint} />
                    <View style={styles.hashtagBadge}>
                      <Text style={styles.hashtagText}>{habit.label}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <View
                style={styles.pagination}
                accessibilityLabel={`Habit image ${activeHabit + 1} of ${habitShowcase.length}`}
              >
                {habitShowcase.map((habit, index) => (
                  <View key={habit.label} style={styles.paginationHitArea}>
                    <View
                      style={[
                        styles.paginationDot,
                        activeHabit === index && styles.paginationDotActive,
                      ]}
                    />
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.textSection}>
            <Text style={styles.title}>Stay Tuned, Stay Healthy</Text>
            <Text style={styles.subtitle}>
              Create, track, and manage your daily habits in a simple way. Small
              steps make a lasting routine.
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={onLogin}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={onCreateAccount}
              style={styles.createButton}
            >
              <Text style={styles.createButtonText}>Create new account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.white },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
    justifyContent: "space-between",
  },
  illustration: {
    width: "100%",
    minHeight: 310,
    maxHeight: 420,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    marginBottom: 10,
  },
  mainCard: {
    width: "72%",
    maxWidth: 310,
    aspectRatio: 0.78,
    maxHeight: 370,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  carousel: {
    width: "100%",
    height: "100%",
    borderRadius: 34,
  },
  imageFrame: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    borderRadius: 34,
    backgroundColor: "#FFD45E",
  },
  cardImage: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
  },
  imageTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(255, 192, 48, 0.16)",
  },
  hashtagBadge: {
    position: "absolute",
    bottom: 42,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: theme.white,
    elevation: 3,
    shadowColor: theme.tertiary[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  hashtagText: {
    color: theme.tertiary[900],
    fontFamily: "NunitoSans_800ExtraBold",
    fontSize: 18,
  },
  pagination: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 2,
  },
  paginationHitArea: {
    minWidth: 24,
    minHeight: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.72)",
  },
  paginationDotActive: {
    width: 16,
    backgroundColor: theme.white,
  },
  sideCard: {
    position: "absolute",
    top: "20%",
    width: 34,
    height: "60%",
    borderRadius: 18,
  },
  leftSideCard: { left: -10, backgroundColor: theme.primary[400] },
  rightSideCard: { right: -10, backgroundColor: theme.tertiary[900] },
  textSection: {
    alignItems: "center",
    paddingHorizontal: 12,
    marginVertical: 16,
  },
  title: {
    color: theme.tertiary[900],
    fontFamily: "NunitoSans_800ExtraBold",
    fontSize: 21,
    textAlign: "center",
    marginBottom: 7,
  },
  subtitle: {
    maxWidth: 330,
    color: theme.natural[500],
    fontFamily: "NunitoSans_400Regular",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  actions: { width: "100%", alignItems: "center", paddingHorizontal: 7 },
  loginButton: {
    width: "100%",
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 26,
    backgroundColor: theme.tertiary[900],
    marginBottom: 11,
  },
  loginButtonText: {
    color: theme.white,
    fontFamily: "NunitoSans_700Bold",
    fontSize: 13,
  },
  createButton: {
    width: "100%",
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: theme.tertiary[900],
    borderRadius: 26,
    marginBottom: 7,
  },
  createButtonText: {
    color: theme.tertiary[900],
    fontFamily: "NunitoSans_700Bold",
    fontSize: 13,
  },
});
