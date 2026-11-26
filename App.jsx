// Module: Diri malabtan

import { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// SafeAreaProvider is a component that provides safe area insets to its children,
// Ensuring that content is not obscured by device notches or other screen elements.
// The useSafeAreaInsets hook allows components to access the safe area insets for layout adjustments.
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

// The following imports presented here as App.jsx is the main entry point of the app and,
// It imports various components and screens from the src directory.
// The code also includes a custom tab bar for navigation between different screens in the app.

import {
  useFonts,
  NunitoSans_400Regular,
  NunitoSans_500Medium,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold,
  NunitoSans_800ExtraBold,
} from "@expo-google-fonts/nunito-sans";

// Paging
import HomeScreen from "./src/screens/HomeScreen.jsx";
import AddHabitScrn from "./src/screens/AddHabitScrn.jsx";
import ProgressScreen from "./src/screens/ProgressScrn.jsx";
import AlertsScreen from "./src/screens/NotificationScrn.jsx";

// CONDITIONS!!! The following are;

// ProfileScrn.jsx contains TypeScript syntax, so avoid named-export parsing for this default import.
// eslint-disable-next-line import/namespace, import/no-named-as-default, import/no-named-as-default-member
import ProfileScreen from "./src/screens/ProfileScrn.jsx";
import LoginScreen from "./src/screens/LoginScreen.tsx";
import OnboardingScreen from "./src/screens/OnboardingScreen.tsx";
import { palette as theme } from "./src/theme.js";
import { useHabits } from "./src/hooks/useHabits";
import { useAuth } from "./src/hooks/useAuth";

const Tab = createBottomTabNavigator();

const tabIcons = {
  Home: ["home-outline", "home"],
  Progress: ["stats-chart-outline", "stats-chart"],
  Add: ["add", "add"],
  Alerts: ["notifications-outline", "notifications"],
  Profile: ["person-outline", "person"],
};

//
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

// AsyncStorage is used to persist habit data and completion history across app sessions.

// The useHabits hook manages the state of habits, including loading from storage, toggling completion, and adding/updating/deleting habits.
// The useAuth hook manages user authentication, including session restoration, login, registration, profile updates, and logout.
function HabitTabs({ profile, onUpdateProfile, onLogout }) {
  const {
    habits,
    isLoadingHabits,
    habitsLoadError,
    retryLoading,
    toggleHabit,
    addHabit,
    updateHabit,
    deleteHabit,
  } = useHabits();

  // Loading state: keep the app from rendering an incomplete habit dataset.
  if (isLoadingHabits) {
    return (
      <View style={styles.storageStateContainer}>
        <ActivityIndicator size="large" color={theme.primary[600]} />
        <Text style={styles.storageStateText}>Loading your habits...</Text>
      </View>
    );
  }

  // Error state: allow the user to retry the AsyncStorage read.
  if (habitsLoadError) {
    return (
      <View style={styles.storageStateContainer}>
        <Text style={styles.storageErrorText}>{habitsLoadError}</Text>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={retryLoading}
          style={styles.storageRetryButton}
        >
          <Text style={styles.storageRetryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
      <Tab.Screen name="Profile">
        {(props) => (
          <ProfileScreen
            {...props}
            profile={profile}
            onUpdateProfile={onUpdateProfile}
            onLogout={onLogout}
          />
        )}
      </Tab.Screen>
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
  const [loginMode, setLoginMode] = useState("login");
  const {
    account,
    profile,
    isLoading: isAuthLoading,
    register,
    login,
    updateProfile,
    logout,
  } = useAuth();

  // Loading state for fonts and restored authentication/session data.
  if (!fontsLoaded || isAuthLoading) {
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
        {account ? (
          <HabitTabs
            profile={profile}
            onUpdateProfile={updateProfile}
            onLogout={async () => {
              await logout();
              setEntryScreen("onboarding");
            }}
          />
        ) : entryScreen === "login" ? (
          <LoginScreen
            initialMode={loginMode}
            onBack={() => setEntryScreen("onboarding")}
            onLogin={async (email, password) => {
              await login(email, password);
              setEntryScreen("app");
            }}
            onRegister={async (details) => {
              await register(details);
              setEntryScreen("app");
            }}
          />
        ) : (
          <OnboardingScreen
            onLogin={() => {
              setLoginMode("login");
              setEntryScreen("login");
            }}
            onCreateAccount={() => {
              setLoginMode("register");
              setEntryScreen("login");
            }}
          />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  storageStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: theme.natural[50],
  },
  storageStateText: {
    marginTop: 12,
    color: theme.tertiary[800],
    fontSize: 16,
  },
  storageErrorText: {
    textAlign: "center",
    color: theme.tertiary[900],
    fontSize: 16,
  },
  storageRetryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: theme.primary[600],
  },
  storageRetryText: {
    color: theme.white,
    fontSize: 15,
    fontWeight: "700",
  },
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
