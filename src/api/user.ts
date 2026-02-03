import * as SecureStore from "expo-secure-store";

const WEB_URL = "https://api.wanikani.com/v2";

import { UserProps } from "../interfaces/User";

async function getUser(): Promise<{ data: UserProps }> {
    const api_token = SecureStore.getItem("WK_TOKEN");

    if (api_token) {
        const headers: Headers = new Headers();
        headers.set("Authorization", `Bearer ${api_token}`);
        headers.set("Wanikani-Revision", "20170710");

        const response = await fetch(`${WEB_URL}/user`, {
            method: "GET",
            headers: headers,
        });

        if (response.ok) {
            return await response.json();
        } else {
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
        }
    } else {
        throw new Error("Missing API Token");
    }
}

export const UserAPI = {
    getUser,
};
