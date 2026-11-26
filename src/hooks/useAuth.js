// This custom React hook, `useAuth`, manages user authentication state and profile information.

// It provides functions for registering, logging in, updating the profile, and logging out.
// The hook also handles session restoration on component mount and maintains loading state during asynchronous operations.

// Likely the operators san Async that any data follows the CRUD element

import { useEffect, useState } from "react";
import {
  clearSession,
  createAccount,
  getSessionAccount,
  loadProfile,
  loginAccount,
  saveProfile,
} from "../services/authStorage";

// The `useAuth` hook manages user authentication and profile state.
// It initializes state variables for the account, profile, and loading status.

// On component mount, it attempts to restore the user session by fetching the session account and profile from storage.
// The hook provides functions to register a new account, log in an existing account, update the user's profile, and log out.
// Each function updates the relevant state variables accordingly.

// The hook returns the current account, profile, loading status, and the authentication functions for use in components.
export function useAuth() {
  const [account, setAccount] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const [sessionAccount, savedProfile] = await Promise.all([
          getSessionAccount(),
          loadProfile(),
        ]);

        if (isMounted) {
          setAccount(sessionAccount);
          setProfile(savedProfile);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    restoreSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const register = async (accountDetails) => {
    const createdAccount = await createAccount(accountDetails);
    const savedProfile = await loadProfile();
    setAccount(createdAccount);
    setProfile(savedProfile);
    return createdAccount;
  };

  const login = async (email, password) => {
    const signedInAccount = await loginAccount(email, password);
    const savedProfile = await loadProfile();
    setAccount(signedInAccount);
    setProfile(savedProfile);
    return signedInAccount;
  };

  const updateProfile = async (nextProfile) => {
    await saveProfile(nextProfile);
    setProfile(nextProfile);
    setAccount((current) =>
      current
        ? { ...current, name: nextProfile.name, email: nextProfile.email }
        : current,
    );
  };

  const logout = async () => {
    await clearSession();
    setAccount(null);
  };

  return {
    account,
    profile,
    isLoading,
    register,
    login,
    updateProfile,
    logout,
  };
}
