import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { palette as theme } from "../theme.js";

type OnboardingScreenProps = {
  onLogin: () => void;
  onEnterApp: () => void;
};

export default function OnboardingScreen({
  onLogin,
  onEnterApp,
}: OnboardingScreenProps) {
  const showCreateAccountNotice = () => {
    Alert.alert(
      "Front-end preview",
      "Account creation is not connected yet. You can continue with the preview or sign in to the demo screen.",
      [{ text: "OK" }],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.illustration}>
            <View style={[styles.sideCard, styles.leftSideCard]} />
            <View style={[styles.sideCard, styles.rightSideCard]} />

            <View style={styles.mainCard}>
              <View style={styles.imageFrame}>
                <Image
                  accessibilityLabel="A person reading a book"
                  source={{
                    uri: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=900&auto=format&fit=crop",
                  }}
                  resizeMode="cover"
                  style={styles.cardImage}
                />
                <View style={styles.imageTint} />
                <View style={styles.hashtagBadge}>
                  <Text style={styles.hashtagText}>#Reading</Text>
                </View>
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
              <Text style={styles.loginButtonText}>Login to your account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={showCreateAccountNotice}
              style={styles.createButton}
            >
              <Text style={styles.createButtonText}>Create new account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={onEnterApp}
              style={styles.skipButton}
            >
              <Text style={styles.skipButtonText}>Skip Login</Text>
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
  imageFrame: {
    width: "100%",
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
    bottom: 22,
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
  skipButton: { paddingHorizontal: 16, paddingVertical: 11 },
  skipButtonText: {
    color: theme.primary[400],
    fontFamily: "NunitoSans_700Bold",
    fontSize: 12,
  },
});
