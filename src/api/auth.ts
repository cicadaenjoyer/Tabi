import * as SecureStore from "expo-secure-store";

const WEB_URL = "https://api.wanikani.com/v2";

/**
 * Sends the WK API token to the API to fetch user information and stores token
 * in memory
 *
 * @param {string} api_token - The WK API token
 *
 * @returns {Object} - User information
 */
async function login(api_token: string) {
    const headers: Headers = new Headers();
    headers.set("Authorization", `Bearer ${api_token}`);

    const response = await fetch(`${WEB_URL}/user`, {
        method: "GET",
        headers: headers,
    });

    if (!response.ok) {
        switch (response.status) {
            case 401:
                throw new Error("Unauthorized: Invalid API token");
            case 404:
                throw new Error("Not Found: Endpoint does not exist");
            default:
                throw new Error(
                    `API Error: ${response.status} ${response.statusText}`,
                );
        }
    } else if (await SecureStore.getItemAsync("WK_TOKEN")) {
        console.log("API Token has already been stored. How'd you get here?");
        return true;
    } else {
        try {
            await SecureStore.setItemAsync("WK_TOKEN", api_token);
            console.log("Successfully stored API Token.");
            return true;
        } catch (e) {
            console.error(e);
        }
    }

    return await response.json();
}

/**
 * Deletes the WK API token from cache and returns to Login screen
 */
async function logout(navigation: any) {
    await SecureStore.deleteItemAsync("WK_TOKEN");
    await SecureStore.deleteItemAsync("GRAVATAR_EMAIL");

    navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
    });
}

export const AuthAPI = {
    login,
    logout,
};
