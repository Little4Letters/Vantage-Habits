import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PoppinsText as Text } from "./Typography.js";

export default function HabitPresetCard({
  title,
  detail,
  icon,
  color,
  selected,
  onPress,
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Select ${title} habit`}
      accessibilityState={selected ? { selected: true } : {}}
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor: color },
        selected && styles.selectedCard,
      ]}
    >
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={21} color={color} />
      </View>
      <View style={styles.copy}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Text numberOfLines={1} style={styles.detail}>
          {detail}
        </Text>
      </View>
      {selected && (
        <View style={styles.check}>
          <Ionicons name="checkmark" size={13} color={color} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    minHeight: 92,
    padding: 10,
    borderRadius: 14,
    justifyContent: "space-between",
  },
  selectedCard: { borderWidth: 2, borderColor: "#FFFFFF" },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  copy: { paddingRight: 8, marginTop: 7 },
  title: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  detail: { color: "rgba(255,255,255,0.86)", fontSize: 9, marginTop: 2 },
  check: {
    position: "absolute",
    right: 8,
    top: 8,
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
