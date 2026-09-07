import React, { useReducer, useEffect } from "react";
import { authReducer, initialState } from "./AuthReducer";
import { AuthContext } from "./AuthContext";
import * as authService from "../../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { unregisterPushNotifications } from '../../services/pushService'; 

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const { user, token, loading, error, initializing } = state;

  const restoreSession = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const user = await AsyncStorage.getItem("user");

      if (token && user) {
        dispatch({
          type: "RESTORE_SESSION",
          payload: {
            token,
            user: JSON.parse(user),
          },
        });
      } else {
        dispatch({
          type: "RESTORE_SESSION_COMPLETE",
        });
      }
    } catch (err) {
      console.log("Failed to restore session:", err);
      dispatch({
        type: "RESTORE_SESSION_COMPLETE",
      });
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const login = async ({ email, password }) => {
    dispatch({ type: "LOGIN_START" });

    try {
      const response = await authService.login({
        email,
        password,
      });
      await AsyncStorage.setItem("token", response.token);
      await AsyncStorage.setItem("user", JSON.stringify(response.user));
      
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: response.user,
          token: response.token,
        },
      });
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: {
          error: error.message,
        },
      });
      throw error;
    }
  };

  const signup = async ({ name, email, password, phone }) => {
    dispatch({
      type: "SIGNUP_START",
    });

    try {
      await authService.signup({
        name,
        email,
        password,
        phone,
      });

      dispatch({
        type: "SIGNUP_SUCCESS",
      });
    } catch (error) {
      dispatch({
        type: "SIGNUP_FAILURE",
        payload: {
          error: error.message,
        },
      });
      throw error;
    }
  };

  // --- RESTORED: updateUser function ---
  const updateUser = async (updatedFields) => {
    const newUser = { ...user, ...updatedFields };
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
    dispatch({
      type: "UPDATE_USER",
      payload: updatedFields,
    });
  };

 

 const logout = async () => {
    // 1. Unregister push notifications (dynamically loaded to prevent circular loops)
    try {
      const pushService = require('../../services/pushService');
      if (pushService?.unregisterPushNotifications) {
        await pushService.unregisterPushNotifications();
      }
    } catch (error) {
      console.error("Failed to unregister push notifications:", error);
    }

    // 2. Clear local storage and state
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Failed to clear storage on logout:", error);
    }
  };

  // Added updateUser back into the context value
  const value = {
    user,
    token,
    loading,
    error,
    initializing,
    login,
    signup,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;