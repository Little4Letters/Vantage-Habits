import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

type LoginScreenProps = {
  onBack: () => void;
  onEnterApp: () => void;
};

const colors = {
  coral: "#FF6B86",
  ink: "#191922",
  muted: "#92929A",
  field: "#F2F2F5",
  line: "#E5E5E9",
  white: "#FFFFFF",
};

export default function LoginScreen({ onBack, onEnterApp }: LoginScreenProps) {
  const [email, setEmail] = useState("designer.wrteam@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const showPreviewMessage = (featureName: string) => {
    Alert.alert(
      "Front-end preview",
      `${featureName} is not connected to an account service yet.`,
      [{ text: "OK" }],
    );
  };

  const previewLogin = () => {
    Alert.alert(
      "Preview only",
      "No credentials will be sent or stored. Continue to Vantage Habits?",
      [
        { text: "Stay here", style: "cancel" },
        { text: "Continue", onPress: onEnterApp },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Back to welcome screen"
              hitSlop={10}
              onPress={onBack}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={20} color={colors.ink} />
            </TouchableOpacity>
            <View style={styles.brandMark}>
              <Ionicons name="checkmark-done" size={25} color={colors.coral} />
            </View>

            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Login to your account with your Email{"\n"}and Password
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={19}
                  color={colors.muted}
                  style={styles.inputIcon}
                />
                <TextInput
                  accessibilityLabel="Email address"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  keyboardType="email-address"
                  placeholder="Enter email"
                  placeholderTextColor="#A7A7AE"
                  returnKeyType="next"
                  selectionColor={colors.coral}
                  style={styles.input}
                  textContentType="emailAddress"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={19}
                  color={colors.muted}
                  style={styles.inputIcon}
                />
                <TextInput
                  accessibilityLabel="Password"
                  autoCapitalize="none"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  placeholderTextColor="#A7A7AE"
                  returnKeyType="done"
                  secureTextEntry={!showPassword}
                  selectionColor={colors.coral}
                  style={styles.input}
                  textContentType="password"
                  value={password}
                  onChangeText={setPassword}
                  onSubmitEditing={previewLogin}
                />
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword ? "Hide password" : "Show password"
                  }
                  accessibilityState={{ selected: showPassword }}
                  hitSlop={8}
                  onPress={() => setShowPassword((visible) => !visible)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={19}
                    color={colors.muted}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => showPreviewMessage("Password recovery")}
                style={styles.forgotButton}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                accessibilityRole="button"
                onPress={previewLogin}
                style={styles.loginButton}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialRow}>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Continue with Google"
                  onPress={() => showPreviewMessage("Google login")}
                  style={styles.socialButton}
                >
                  <AntDesign name="google" size={19} color={colors.ink} />
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Continue with Apple"
                  onPress={() => showPreviewMessage("Apple login")}
                  style={styles.socialButton}
                >
                  <FontAwesome name="apple" size={21} color={colors.ink} />
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Continue with Facebook"
                  onPress={() => showPreviewMessage("Facebook login")}
                  style={styles.socialButton}
                >
                  <FontAwesome name="facebook" size={19} color="#1877F2" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.footer}>
              <View style={styles.signUpRow}>
                <Text style={styles.footerText}>
                  Don&apos;t have an account?{" "}
                </Text>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => showPreviewMessage("Account creation")}
                >
                  <Text style={styles.createText}>Create Now</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={onEnterApp}
                style={styles.skipButton}
              >
                <Text style={styles.skipText}>Skip Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 24,
  },
  content: { width: "100%", maxWidth: 430, alignSelf: "center" },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    marginBottom: 4,
    borderRadius: 20,
    backgroundColor: colors.field,
  },
  brandMark: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 16,
    backgroundColor: "#FFF2F4",
    marginBottom: 22,
  },
  header: { alignItems: "center", marginBottom: 32 },
  title: {
    color: colors.ink,
    fontFamily: "NunitoSans_800ExtraBold",
    fontSize: 27,
    marginBottom: 7,
  },
  subtitle: {
    color: colors.muted,
    fontFamily: "NunitoSans_400Regular",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
  form: { width: "100%" },
  inputWrapper: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 13,
    paddingHorizontal: 14,
    marginBottom: 13,
    backgroundColor: colors.white,
  },
  inputIcon: { marginRight: 11 },
  input: {
    flex: 1,
    minWidth: 0,
    color: colors.ink,
    fontFamily: "NunitoSans_600SemiBold",
    fontSize: 13,
    paddingVertical: 12,
  },
  eyeButton: { padding: 5, marginLeft: 5 },
  forgotButton: {
    alignSelf: "flex-start",
    paddingVertical: 5,
    marginBottom: 18,
  },
  forgotText: {
    color: colors.coral,
    fontFamily: "NunitoSans_700Bold",
    fontSize: 12,
  },
  loginButton: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 26,
    backgroundColor: colors.ink,
  },
  loginButtonText: {
    color: colors.white,
    fontFamily: "NunitoSans_700Bold",
    fontSize: 14,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 23,
    marginBottom: 19,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.line },
  dividerText: {
    color: colors.muted,
    fontFamily: "NunitoSans_600SemiBold",
    fontSize: 11,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 18,
    marginBottom: 27,
  },
  socialButton: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 23,
    backgroundColor: colors.field,
  },
  footer: { alignItems: "center", marginTop: 4 },
  signUpRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    color: colors.muted,
    fontFamily: "NunitoSans_400Regular",
    fontSize: 12,
  },
  createText: {
    color: colors.coral,
    fontFamily: "NunitoSans_700Bold",
    fontSize: 12,
  },
  skipButton: { paddingVertical: 15, paddingHorizontal: 16 },
  skipText: {
    color: colors.coral,
    fontFamily: "NunitoSans_700Bold",
    fontSize: 13,
  },
});
