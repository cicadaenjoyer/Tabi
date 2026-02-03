/**
 * @file LoginScreen.tsx
 * @description
 *  Login screen for Tabi.
 *  Allows the user to enter their WaniKani API token and Gravatar API Token and Email (optional)
 *  and handles authentication.
 *
 *  Redirects to Home if a valid token is already stored.
 */

import React, { useState, useEffect } from "react";
import {
    View,
    SafeAreaView,
    TextInput,
    Linking,
    Text,
    Image,
    Pressable,
    useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/navigation";

// API
import { GravatarAPI } from "../api/gravatar";
import { AuthAPI } from "../api/auth";
import * as SecureStore from "expo-secure-store";

// Styling
import { LoginStyles as styles } from "../styles/globals";

const SIGNUP_URL = "https://www.wanikani.com/signup";

const LoginScreen = () => {
    const [token, setToken] = useState("");
    const [gravatarEmail, setGravatarEmail] = useState("");
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { height } = useWindowDimensions();

    const goToSignUp = async (url: string) => {
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            console.error(`Error: Cannot open URL ${url}`);
        }
    };

    const handleLogin = async () => {
        await AuthAPI.login(token);
        await GravatarAPI.setUserIcon(gravatarEmail);
        const has_token = await SecureStore.getItemAsync("WK_TOKEN");

        if (has_token) {
            navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
            });
        }
    };

    // Check for existing token on mount
    useEffect(() => {
        const checkToken = async () => {
            const hasToken = await SecureStore.getItemAsync("WK_TOKEN");
            if (hasToken) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Home" }],
                });
            }
        };
        checkToken();
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            {/* Main Graphic */}
            <Image
                source={require("../assets/images/login/sign_in.png")}
                style={{
                    ...styles.banner,
                    height: height * 0.15,
                }}
            />

            <View style={{ gap: 20, width: "65%" }}>
                {/* API Token Text Box */}
                <View>
                    <Text style={styles.label}>WaniKani API Token</Text>
                    <TextInput style={styles.input} onChangeText={setToken} />
                </View>

                {/* Gravatar Email Text Box */}
                <View>
                    <Text style={styles.label}>Gravatar Email (Optional)</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setGravatarEmail}
                    />
                </View>

                {/* Login Button */}
                <Pressable style={styles.submit} onPress={handleLogin}>
                    <Text style={styles.label}>Login</Text>
                </Pressable>
            </View>

            {/* Divider Graphic */}
            <View style={styles.divider} />

            {/* Sign Up Link */}
            <Pressable onPress={() => goToSignUp(SIGNUP_URL)}>
                <Text style={styles.hyperlink}>Sign Up</Text>
            </Pressable>
        </SafeAreaView>
    );
};

export default LoginScreen;
