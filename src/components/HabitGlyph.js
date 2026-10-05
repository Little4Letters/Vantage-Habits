import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HabitGlyph({
  icon,
  iconType = "icon",
  size = 20,
  color,
}) {
  if (iconType === "emoji") {
    return <Text style={{ fontSize: size + 2 }}>{icon}</Text>;
  }

  return (
    <Ionicons name={icon || "sparkles-outline"} size={size} color={color} />
  );
}
