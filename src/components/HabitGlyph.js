import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// The HabitGlyph component is a reusable component that renders an icon or emoji based on the provided props.

// It accepts the following props:
// - icon: The name of the icon to be displayed (for Ionicons) or the emoji character.
// - iconType: A string that determines whether to render an icon ("icon") or an emoji ("emoji"). Default is "icon".
// - size: The size of the icon or emoji. Default is 20.
// - color: The color of the icon (only applicable for Ionicons).
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
