import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    const { token, initializing } = useAuth();

    if (initializing) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#0A1931" />
            </View>
        );
    }

    // By placing the swap inside a Stack.Navigator, React Navigation is 
    // forced to natively destroy the App tree and mount the Auth tree.
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {token ? (
                <Stack.Screen name="AppFlow" component={AppNavigator} />
            ) : (
                <Stack.Screen name="AuthFlow" component={AuthNavigator} />
            )}
        </Stack.Navigator>
    );
};

export default RootNavigator;