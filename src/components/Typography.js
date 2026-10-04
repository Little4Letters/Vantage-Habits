import {
  StyleSheet,
  Text as NativeText,
  TextInput as NativeTextInput,
} from "react-native";

const fontByWeight = {
  normal: "NunitoSans_400Regular",
  400: "NunitoSans_400Regular",
  500: "NunitoSans_500Medium",
  600: "NunitoSans_600SemiBold",
  700: "NunitoSans_700Bold",
  bold: "NunitoSans_700Bold",
  800: "NunitoSans_800ExtraBold",
};

function resolveTextStyle(style) {
  const flattenedStyle = StyleSheet.flatten(style) || {};
  const { fontWeight, fontFamily, ...otherStyles } = flattenedStyle;

  return {
    ...otherStyles,
    fontFamily:
      fontFamily ||
      fontByWeight[String(fontWeight || "400")] ||
      fontByWeight["400"],
  };
}

export function AppText({ style, ...props }) {
  return <NativeText {...props} style={resolveTextStyle(style)} />;
}

export function AppTextInput({ style, ...props }) {
  return <NativeTextInput {...props} style={resolveTextStyle(style)} />;
}
