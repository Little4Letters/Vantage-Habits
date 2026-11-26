import { useEffect, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { AppText as Text } from "./Typography.js";
import { palette as theme } from "../theme.js";

export default function ScreenTutorial({ accountId, screenKey, steps }) {
  const [visible, setVisible] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [fade] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!accountId || !screenKey) return;

    let active = true;
    AsyncStorage.getItem(
      `@vantage-habits/tutorial:${accountId}:${screenKey}`,
    ).then((seen) => {
      if (active && !seen) {
        setStepIndex(0);
        setVisible(true);
        Animated.timing(fade, {
          toValue: 1,
          duration: 260,
          useNativeDriver: Platform.OS !== "web",
        }).start();
      }
    });

    return () => {
      active = false;
    };
  }, [accountId, screenKey, fade]);

  const finishTutorial = async () => {
    if (accountId) {
      await AsyncStorage.setItem(
        `@vantage-habits/tutorial:${accountId}:${screenKey}`,
        "seen",
      );
    }

    Animated.timing(fade, {
      toValue: 0,
      duration: 180,
      useNativeDriver: Platform.OS !== "web",
    }).start(() => setVisible(false));
  };

  if (!visible) return null;

  const step = steps[stepIndex];

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={finishTutorial}
    >
      <View style={styles.backdrop}>
        <Animated.View style={[styles.card, { opacity: fade }]}>
          <Text style={styles.eyebrow}>
            QUICK START {stepIndex + 1} OF {steps.length}
          </Text>
          <View style={styles.iconWrap}>
            <Ionicons name={step.icon} size={34} color={theme.primary[500]} />
          </View>
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.text}>{step.text}</Text>
          <View style={styles.dots}>
            {steps.map((item, index) => (
              <View
                key={item.title}
                style={[styles.dot, index === stepIndex && styles.dotActive]}
              />
            ))}
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => {
              if (stepIndex === steps.length - 1) finishTutorial();
              else setStepIndex((current) => current + 1);
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {stepIndex === steps.length - 1 ? "Got it" : "Next"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "rgba(25,25,34,0.58)",
  },
  card: {
    width: "100%",
    maxWidth: 390,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: theme.white,
    paddingHorizontal: 24,
    paddingVertical: 26,
  },
  eyebrow: {
    color: theme.primary[500],
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  iconWrap: {
    width: 68,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 34,
    backgroundColor: theme.natural[100],
    marginTop: 18,
  },
  title: {
    color: theme.tertiary[900],
    fontSize: 20,
    fontWeight: "800",
    marginTop: 16,
  },
  text: {
    color: theme.natural[500],
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
  },
  dots: { flexDirection: "row", gap: 7, marginTop: 18 },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.natural[200],
  },
  dotActive: { width: 18, backgroundColor: theme.primary[500] },
  button: {
    height: 46,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 23,
    backgroundColor: theme.tertiary[900],
    marginTop: 20,
  },
  buttonText: { color: theme.white, fontSize: 13, fontWeight: "800" },
});
