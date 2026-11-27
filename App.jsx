import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
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

function LogoutTransition({ onComplete }) {
  const [opacity] = useState(() => new Animated.Value(0));
  const [translateY] = useState(() => new Animated.Value(14));
  const [iconScale] = useState(() => new Animated.Value(0.75));

  useEffect(() => {
    const entrance = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 420,
        useNativeDriver: Platform.OS !== "web",
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 7,
        useNativeDriver: Platform.OS !== "web",
      }),
      Animated.spring(iconScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: Platform.OS !== "web",
      }),
    ]);

    entrance.start();
    const timeout = setTimeout(onComplete, 2600);

    return () => {
      entrance.stop();
      clearTimeout(timeout);
    };
  }, [iconScale, onComplete, opacity, translateY]);

  return (
    <View style={styles.logoutTransition}>
      <Animated.View
        style={[
          styles.logoutTransitionContent,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <Animated.View
          style={[styles.logoutIcon, { transform: [{ scale: iconScale }] }]}
        >
          <Ionicons
            name="checkmark-done"
            size={34}
            color={theme.primary[600]}
          />
        </Animated.View>
        <Text style={styles.logoutEyebrow}>UNTIL NEXT TIME</Text>
        <Text style={styles.logoutTitle}>
          Thanks for showing up for yourself.
        </Text>
        <Text style={styles.logoutMessage}>
          Every small step counts. Your habits and progress will be here when
          you’re ready to continue.
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={onComplete}
          style={styles.logoutContinueButton}
        >
          <Text style={styles.logoutContinueText}>Continue</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

function HabitTabs({
  accountId,
  accountName,
  profile,
  isNewAccount,
  onUpdateProfile,
  onLogout,
}) {
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
            accountName={accountName}
            profile={profile}
            isNewAccount={isNewAccount}
            habits={habits}
            onToggleHabit={toggleHabit}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Progress">
        {(props) => (
          <ProgressScreen
            {...props}
            accountId={accountId}
            habits={habits}
            onToggleHabit={toggleHabit}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Add">
        {(props) => (
          <AddHabitScrn
            {...props}
            accountId={accountId}
            habits={habits}
            onAddHabit={addHabit}
            onUpdateHabit={updateHabit}
            onDeleteHabit={deleteHabit}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Alerts">
        {(props) => <AlertsScreen {...props} accountId={accountId} />}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {(props) => (
          <ProfileScreen
            {...props}
            accountId={accountId}
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
  const [isNewAccount, setIsNewAccount] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const {
    account,
    profile,
    isLoading: isAuthLoading,
    register,
    login,
    updateProfile,
    logout,
  } = useAuth();
  const finishLogout = useCallback(() => {
    setIsLoggingOut(false);
    setEntryScreen("onboarding");
  }, []);

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
        {isLoggingOut ? (
          <LogoutTransition onComplete={finishLogout} />
        ) : account ? (
          <HabitTabs
            accountId={account.id}
            accountName={account.name}
            profile={profile}
            isNewAccount={isNewAccount}
            onUpdateProfile={updateProfile}
            onLogout={async () => {
              setIsLoggingOut(true);
              try {
                await logout();
                setIsNewAccount(false);
              } catch (error) {
                setIsLoggingOut(false);
                throw error;
              }
            }}
          />
        ) : entryScreen === "login" ? (
          <LoginScreen
            initialMode={loginMode}
            onBack={() => setEntryScreen("onboarding")}
            onLogin={async (email, password) => {
              await login(email, password);
              setIsNewAccount(false);
            }}
            onRegister={async (details) => {
              await register(details);
              setIsNewAccount(true);
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
  logoutTransition: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: theme.natural[50],
  },
  logoutTransitionContent: {
    width: "100%",
    maxWidth: 390,
    alignItems: "center",
    paddingHorizontal: 18,
  },
  logoutIcon: {
    width: 82,
    height: 82,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 41,
    backgroundColor: theme.white,
    marginBottom: 22,
  },
  logoutEyebrow: {
    color: theme.primary[600],
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  logoutTitle: {
    color: theme.tertiary[900],
    fontSize: 25,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 10,
  },
  logoutMessage: {
    color: theme.natural[500],
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 12,
  },
  logoutContinueButton: {
    minWidth: 150,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: theme.tertiary[900],
    marginTop: 26,
    paddingHorizontal: 24,
  },
  logoutContinueText: { color: theme.white, fontSize: 13, fontWeight: "700" },
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
