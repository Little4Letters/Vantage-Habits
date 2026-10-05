import { useState } from "react";
import {
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

// The following imports presented here as App.jsx is the main entry point of the app and,
// It imports various components and screens from the src directory. The code also includes a custom tab bar for navigation between different screens in the app.

import {
  useFonts,
  NunitoSans_400Regular,
  NunitoSans_500Medium,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold,
  NunitoSans_800ExtraBold,
} from "@expo-google-fonts/nunito-sans";

import HomeScreen from "./src/screens/HomeScreen.jsx";
import AddHabitScrn from "./src/screens/AddHabitScrn.jsx";
import ProgressScreen from "./src/screens/ProgressScrn.jsx";
import AlertsScreen from "./src/screens/NotificationScrn.jsx";
import ProfileScreen from "./src/screens/ProfileScrn.jsx";
import LoginScreen from "./src/screens/LoginScreen.tsx";
import OnboardingScreen from "./src/screens/OnboardingScreen.tsx";
import { palette as theme } from "./src/theme.js";

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
    title: "Sports",
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

function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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
          const iconColor = isAdd
            ? theme.white
            : focused
              ? theme.tertiary[900]
              : "#A1A1AD";

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
  const [habits, setHabits] = useState(() => {
    const today = getDateKey();
    return startingHabits.map((habit) => ({
      ...habit,
      completedDates: habit.completed ? [today] : [],
    }));
  });
  const toggleHabit = (habitId, date = getDateKey()) => {
    setHabits((current) =>
      current.map((habit) =>
        habit.id !== habitId
          ? habit
          : (() => {
              const completedDates = habit.completedDates || [];
              const isCompleted = completedDates.includes(date);
              const nextDates = isCompleted
                ? completedDates.filter(
                    (completedDate) => completedDate !== date,
                  )
                : [...completedDates, date];
              return {
                ...habit,
                completedDates: nextDates,
                completed:
                  date === getDateKey() ? !isCompleted : habit.completed,
              };
            })(),
      ),
    );
  };
  const addHabit = (habit) => setHabits((current) => [...current, habit]);
  const updateHabit = (updatedHabit) =>
    setHabits((current) =>
      current.map((habit) =>
        habit.id === updatedHabit.id ? { ...habit, ...updatedHabit } : habit,
      ),
    );
  const deleteHabit = (habitId) =>
    setHabits((current) => current.filter((habit) => habit.id !== habitId));

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: theme.natural[50] },
      }}
    >
      <Tab.Screen name="Home">
        {(props) => (
          <HomeScreen {...props} habits={habits} onToggleHabit={toggleHabit} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Progress">
        {(props) => (
          <ProgressScreen
            {...props}
            habits={habits}
            onToggleHabit={toggleHabit}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Add">
        {(props) => (
          <AddHabitScrn
            {...props}
            habits={habits}
            onAddHabit={addHabit}
            onUpdateHabit={updateHabit}
            onDeleteHabit={deleteHabit}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  let [fontsLoaded] = useFonts({
    NunitoSans_400Regular,
    NunitoSans_500Medium,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
  });
  const [entryScreen, setEntryScreen] = useState("onboarding");

  // ADDED: Show a loading screen until the fonts are ready
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary[600]} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        {entryScreen === "app" ? (
          <HabitTabs />
        ) : entryScreen === "login" ? (
          <LoginScreen
            onBack={() => setEntryScreen("onboarding")}
            onEnterApp={() => setEntryScreen("app")}
          />
        ) : (
          <OnboardingScreen
            onLogin={() => setEntryScreen("login")}
            onEnterApp={() => setEntryScreen("app")}
          />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.natural[50],
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
    backgroundColor: theme.tertiary[900],
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
    backgroundColor: theme.white,
    borderRadius: 14,
  },
  addTabButton: {
    width: 54,
    height: 54,
    marginTop: -18,
    borderRadius: 27,
    backgroundColor: theme.primary[600],
    borderWidth: 5,
    borderColor: theme.tertiary[900],
  },
});
