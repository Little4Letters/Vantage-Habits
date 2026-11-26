import { useState } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
// eslint-disable-next-line import/namespace, import/no-named-as-default, import/no-named-as-default-member
import ProfileScreen from "./src/screens/ProfileScrn.jsx";
import LoginScreen from "./src/screens/LoginScreen.tsx";
import OnboardingScreen from "./src/screens/OnboardingScreen.tsx";
import { palette as theme } from "./src/theme.js";
import { useHabits } from "./src/hooks/useHabits.js";
import { useAuth } from "./src/hooks/useAuth.js";

const Tab = createBottomTabNavigator();

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
              activeOpacity={0.78}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              style={styles.tabButton}
              hitSlop={8}
            >
              <Animated.View
                style={[
                  styles.tabIconHit,
                  focused && !isAdd && styles.tabIconSelected,
                  isAdd && styles.addTabButton,
                  !isAdd && { transform: [{ scale: focused ? 1.06 : 1 }] },
                ]}
              >
                <Ionicons
                  name={focused ? activeIcon : inactiveIcon}
                  size={isAdd ? 27 : 21}
                  color={iconColor}
                />
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function HabitTabs({ accountId, profile, onUpdateProfile, onLogout }) {
  const {
    habits,
    isLoadingHabits,
    habitsLoadError,
    retryLoading,
    toggleHabit,
    addHabit,
    updateHabit,
    deleteHabit,
  } = useHabits(accountId);

  if (isLoadingHabits) {
    return (
      <View style={styles.storageStateContainer}>
        <ActivityIndicator size="large" color={theme.primary[600]} />
        <Text style={styles.storageStateText}>Loading your habits...</Text>
      </View>
    );
  }

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
        animation: "fade",
        sceneStyle: { backgroundColor: theme.natural[50] },
      }}
    >
      <Tab.Screen name="Home">
        {(props) => (
          <HomeScreen
            {...props}
            accountId={accountId}
            habits={habits}
            onToggleHabit={toggleHabit}
          />
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
  const [fontsLoaded] = useFonts({
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
            accountId={account.id}
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
            }}
            onRegister={async (details) => {
              await register(details);
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.natural[50],
  },
  storageStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.natural[50],
    paddingHorizontal: 24,
  },
  storageStateText: { color: theme.tertiary[700], marginTop: 12 },
  storageErrorText: {
    color: theme.tertiary[900],
    textAlign: "center",
    marginBottom: 16,
  },
  storageRetryButton: {
    backgroundColor: theme.primary[500],
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 11,
  },
  storageRetryText: { color: theme.white, fontWeight: "700" },
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
  tabIconSelected: { backgroundColor: theme.white, borderRadius: 14 },
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
