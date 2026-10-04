import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText as Text } from "./Typography.js";
import { palette as theme } from "../theme.js";

export default function HabitCard({
  title,
  frequency,
  color,
  icon,
  isCompleted,
  onPress,
}) {
  return (
    <View
      style={[
        styles.card,
        isCompleted
          ? styles.cardCompleted
          : { backgroundColor: color || "#4388F5" },
      ]}
    >
      <View style={styles.leftContent}>
        <View
          style={[
            styles.iconPlaceholder,
            isCompleted && styles.iconPlaceholderCompleted,
          ]}
        >
          <Ionicons
            name={icon || "sparkles-outline"}
            size={21}
            color={isCompleted ? theme.tertiary[500] : color || "#4388F5"}
          />
        </View>
        <View style={styles.copy}>
          <Text style={[styles.title, isCompleted && styles.titleCompleted]}>
            {title}
          </Text>
          <Text
            style={[styles.frequency, isCompleted && styles.frequencyCompleted]}
          >
            {frequency}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        accessibilityRole="checkbox"
        accessibilityLabel={`${isCompleted ? "Mark" : "Complete"} ${title}`}
        accessibilityState={{ checked: isCompleted }}
        onPress={onPress}
        style={[styles.checkCircle, isCompleted && styles.checkCircleCompleted]}
      >
        {isCompleted && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 78,
    paddingVertical: 12,
    paddingHorizontal: 13,
    borderRadius: 15,
    marginBottom: 10,
  },

  cardCompleted: {
    backgroundColor: theme.white,
  },

  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },
  copy: { flex: 1, minWidth: 0 },

  iconPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  iconPlaceholderCompleted: { backgroundColor: "#F5F2FA" },

  title: { fontSize: 14, fontWeight: "700", color: "#FFFFFF" },

  titleCompleted: { color: theme.tertiary[900] },

  frequency: { fontSize: 11, color: "rgba(255,255,255,0.82)", marginTop: 4 },

  frequencyCompleted: { color: theme.natural[500] },

  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    marginLeft: 10,
  },

  checkCircleCompleted: {
    backgroundColor: theme.tertiary[900],
    borderColor: theme.tertiary[900],
    alignItems: "center",
    justifyContent: "center",
  },
});
