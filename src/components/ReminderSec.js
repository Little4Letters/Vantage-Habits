import { View, Switch, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText as Text } from "./Typography.js";
import { palette as theme } from "../theme.js";

export default function ReminderRow({ icon, title, detail, value, onChange }) {
  return (
    <View style={styles.reminderRow}>
      <View style={styles.reminderIcon}>
        <Ionicons name={icon} size={20} color="#656670" />
      </View>
      <View style={styles.reminderCopy}>
        <Text style={styles.reminderTitle}>{title}</Text>
        <Text style={styles.reminderDetail}>{detail}</Text>
      </View>
      <Switch
        accessibilityLabel={title}
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#D9D9DE", true: "#F2A0AE" }}
        thumbColor={value ? theme.primary[600] : theme.white}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  reminderRow: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E9E9EC",
    gap: 11,
  },
  reminderIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#ECECEF",
    alignItems: "center",
    justifyContent: "center",
  },
  reminderCopy: { flex: 1 },
  reminderTitle: {
    color: theme.tertiary[900],
    fontSize: 13,
    fontWeight: "700",
  },
  reminderDetail: { color: theme.natural[500], fontSize: 11, marginTop: 4 },
});
