import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from "@expo-google-fonts/poppins";

import HomeScreen from "./src/screens/HomeScreen.js";
import AddHabitScrn from "./src/screens/AddHabitScrn.js";
import ProgressScreen from "./src/screens/ProgressScrn.js";
import AlertsScreen from "./src/screens/NotificationScrn.js";
import ProfileScreen from "./src/screens/ProfileScrn.js";

const Tab = createBottomTabNavigator();

const startingHabits = [
  {
    id: "jogging",
    title: "Jogging",
    frequency: "Every day",
    color: "#4388F5",
    icon: "walk-outline",
    completed: false,
  },
  {
    id: "tennis",
    title: "Tennis",
    frequency: "Monday, Thursday",
    color: "#F58D60",
    icon: "tennisball-outline",
    completed: false,
  },
  {
    id: "sleep",
    title: "8 Hour Sleep",
    frequency: "Every day",
    color: "#9660E8",
    icon: "bed-outline",
    completed: false,
  },
  {
    id: "reading",
    title: "Read 10 pages",
    frequency: "Every day",
    color: "#47B9A7",
    icon: "book-outline",
    completed: true,
  },
];

const tabIcons = {
  Home: ["home-outline", "home"],
  Progress: ["stats-chart-outline", "stats-chart"],
  Add: ["add", "add"],
  Alerts: ["notifications-outline", "notifications"],
  Profile: ["person-outline", "person"],
};

function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabDockPosition, { bottom: insets.bottom + 10 }]}>
      <View style={styles.tabDock}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const [inactiveIcon, activeIcon] = tabIcons[route.name];
          const isAdd = route.name === "Add";
          const iconColor = isAdd ? "#FFFFFF" : focused ? "#22232D" : "#A1A1AD";

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityLabel={
                route.name === "Add" ? "Add habit" : route.name
              }
              accessibilityState={focused ? { selected: true } : {}}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented)
                  navigation.navigate(route.name);
              }}
              style={styles.tabButton}
              hitSlop={8}
            >
              <View
                style={[
                  styles.tabIconHit,
                  focused && !isAdd && styles.tabIconSelected,
                  isAdd && styles.addTabButton,
                ]}
              >
                <Ionicons
                  name={focused ? activeIcon : inactiveIcon}
                  size={isAdd ? 27 : 21}
                  color={iconColor}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function HabitTabs() {
  const [habits, setHabits] = useState(startingHabits);
  const toggleHabit = (habitId) => {
    setHabits((current) =>
      current.map((habit) =>
        habit.id === habitId
          ? { ...habit, completed: !habit.completed }
          : habit,
      ),
    );
  };
  const addHabit = (habit) => setHabits((current) => [...current, habit]);

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: "#F7F7F8" },
      }}
    >
      <Tab.Screen name="Home">
        {(props) => (
          <HomeScreen {...props} habits={habits} onToggleHabit={toggleHabit} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Progress">
        {(props) => <ProgressScreen {...props} habits={habits} />}
      </Tab.Screen>
      <Tab.Screen name="Add">
        {(props) => <AddHabitScrn {...props} onAddHabit={addHabit} />}
      </Tab.Screen>
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  // ADDED: Show a loading screen until the fonts are ready
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F05E79" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <HabitTabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F7F8",
  },
  tabDockPosition: {
    position: "absolute",
    left: 20,
    right: 20,
    alignItems: "center",
  },
  tabDock: {
    height: 68,
    width: "100%",
    maxWidth: 440,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#20212D",
    borderRadius: 36,
  },
  tabButton: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconHit: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconSelected: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
  },
  addTabButton: {
    width: 54,
    height: 54,
    marginTop: -18,
    borderRadius: 27,
    backgroundColor: "#F45F78",
    borderWidth: 5,
    borderColor: "#20212D",
  },
});
