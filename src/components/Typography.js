import {
  StyleSheet,
  Text as NativeText,
  TextInput as NativeTextInput,
} from "react-native";

const fontByWeight = {
  normal: "Poppins_400Regular",
  400: "Poppins_400Regular",
  500: "Poppins_500Medium",
  600: "Poppins_600SemiBold",
  700: "Poppins_700Bold",
  bold: "Poppins_700Bold",
  800: "Poppins_800ExtraBold",
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

export function PoppinsText({ style, ...props }) {
  return <NativeText {...props} style={resolveTextStyle(style)} />;
}

export function PoppinsTextInput({ style, ...props }) {
  return <NativeTextInput {...props} style={resolveTextStyle(style)} />;
}
