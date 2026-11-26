import { useState } from "react";
import {
  Alert,
  Image,
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
  initialMode?: "login" | "register";
  onBack: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (details: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
};

const colors = {
  coral: "#FF6B86",
  ink: "#191922",
  muted: "#92929A",
  field: "#F2F2F5",
  line: "#E5E5E9",
  white: "#FFFFFF",
};

export default function LoginScreen({
  initialMode = "login",
  onBack,
  onLogin,
  onRegister,
}: LoginScreenProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showPreviewMessage = (featureName: string) => {
    Alert.alert(
      "Front-end preview",
      `${featureName} is not connected to an account service yet.`,
      [{ text: "OK" }],
    );
  };

  const submitAuth = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      Alert.alert("Required details", "Enter your email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      Alert.alert(
        "Invalid email format",
        "Enter a complete email address, such as name@example.com.",
      );
      return;
    }

    if (mode === "register") {
      if (!trimmedName) {
        Alert.alert(
          "Name required",
          "Enter the name you want on your account.",
        );
        return;
      }
      if (trimmedName.length < 2 || trimmedName.length > 40) {
        Alert.alert("Invalid name", "Use a name between 2 and 40 characters.");
        return;
      }
      if (!/^[\p{L}][\p{L}\p{M}' .-]*$/u.test(trimmedName)) {
        Alert.alert(
          "Invalid name",
          "Use letters for your name. Symbols and numbers are not allowed.",
        );
        return;
      }
      if (password.length < 8) {
        Alert.alert(
          "Weak password",
          "Use at least 8 characters, including an uppercase letter and a number.",
        );
        return;
      }
      if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        Alert.alert(
          "Weak password",
          "Include at least one uppercase letter and one number.",
        );
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert(
          "Passwords do not match",
          "Re-enter the same password in both password fields.",
        );
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (mode === "register") {
        await onRegister({
          name: trimmedName,
          email: trimmedEmail,
          password,
        });
      } else {
        await onLogin(trimmedEmail, password);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "";

      if (message.includes("An account already exists")) {
        Alert.alert(
          "Account already set up",
          "This device already has a Vantage Habits account. Log in or continue with the existing account.",
        );
      } else if (
        message.includes("No account exists") ||
        message.includes("Incorrect email or password")
      ) {
        Alert.alert(
          "Unable to log in",
          "The email or password could not be verified. Check both details and try again.",
        );
      } else if (
        message.includes("Name") ||
        message.includes("Invalid email") ||
        message.includes("Password is weak")
      ) {
        Alert.alert(
          "Details need correction",
          "Review your name, email, and password. They must meet the account requirements.",
        );
      } else if (
        message.toLowerCase().includes("securestore") ||
        message.toLowerCase().includes("secure store") ||
        message.toLowerCase().includes("native module")
      ) {
        Alert.alert(
          "Secure storage unavailable",
          "Account setup could not access protected device storage. Restart the app and try again.",
        );
      } else {
        Alert.alert(
          mode === "register"
            ? "Account setup unsuccessful"
            : "Login unsuccessful",
          mode === "register"
            ? "Device storage could not complete setup. Restart the app and try again."
            : "Your login could not be verified. Check your details and try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
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
              <Image
                accessibilityLabel="Vantage Habits"
                resizeMode="contain"
                source={require("../../assets/vantage-habits-symbol.png")}
                style={styles.brandImage}
              />
            </View>

            <View style={styles.header}>
              <Text style={styles.title}>
                {mode === "register" ? "Create Account" : "Welcome Back"}
              </Text>
              <Text style={styles.subtitle}>
                {mode === "register"
                  ? "Create your account with your Email and Password"
                  : "Login to your account with your Email\nand Password"}
              </Text>
            </View>

            <View style={styles.form}>
              {mode === "register" && (
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="person-outline"
                    size={19}
                    color={colors.muted}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    accessibilityLabel="Name"
                    placeholder="Enter name"
                    placeholderTextColor="#A7A7AE"
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              )}
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
                  onSubmitEditing={submitAuth}
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

              {mode === "register" && (
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={19}
                    color={colors.muted}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    accessibilityLabel="Confirm password"
                    autoCapitalize="none"
                    placeholder="Confirm password"
                    placeholderTextColor="#A7A7AE"
                    secureTextEntry
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onSubmitEditing={submitAuth}
                  />
                </View>
              )}

              {mode === "login" && (
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() =>
                    Alert.alert(
                      "Password recovery",
                      "Password recovery requires a server-backed account service.",
                    )
                  }
                  style={styles.forgotButton}
                >
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                accessibilityRole="button"
                disabled={isSubmitting}
                onPress={submitAuth}
                style={styles.loginButton}
              >
                <Text style={styles.loginButtonText}>
                  {isSubmitting
                    ? "Please wait..."
                    : mode === "register"
                      ? "Create Account"
                      : "Login"}
                </Text>
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
                  onPress={() =>
                    setMode((current) =>
                      current === "login" ? "register" : "login",
                    )
                  }
                >
                  <Text style={styles.createText}>
                    {mode === "register" ? "Back to Login" : "Create Now"}
                  </Text>
                </TouchableOpacity>
              </View>
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
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 18,
  },
  brandImage: {
    width: 72,
    height: 72,
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
});
