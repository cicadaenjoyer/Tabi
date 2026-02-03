import * as SecureStore from "expo-secure-store";

// Interfaces
import { ReviewProps } from "../interfaces/Review";

const WEB_URL = "https://api.wanikani.com/v2";

async function putAssignment(assignment: ReviewProps) {
    const api_token = SecureStore.getItem("WK_TOKEN");

    if (api_token && assignment.assignment_id) {
        const headers: Headers = new Headers();
        headers.set("Authorization", `Bearer ${api_token}`);
        headers.set("Wanikani-Revision", "20170710");
        headers.set("Content-Type", "application/json");

        const response = await fetch(
            `${WEB_URL}/assignments/${assignment.assignment_id}/start`,
            {
                method: "PUT",
                headers: headers,
            },
        );

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
        }
    }
}

async function getAssignments(query: string = "") {
    const api_token = SecureStore.getItem("WK_TOKEN");

    if (api_token) {
        const headers: Headers = new Headers();
        headers.set("Authorization", `Bearer ${api_token}`);
        headers.set("Wanikani-Revision", "20170710");

        const response = await fetch(`${WEB_URL}/assignments/${query}`, {
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
    }
}

async function getAvailableLessons() {
    const assignments = await getAssignments(
        "?immediately_available_for_lessons=true",
    );

    return {
        ...assignments,
        data: assignments.data,
        total_count: assignments.data.length,
    };
}

async function getAvailableReviews() {
    return await getAssignments("?immediately_available_for_review=true");
}

async function getKanjiAssignments() {
    return await getAssignments("?subject_types=kanji");
}

async function getKanjiAssignmentsAtLevel(level: number) {
    return await getAssignments(`?subject_types=kanji&levels=${level}`);
}

async function getRadicalAssignments() {
    return await getAssignments("?subject_types=radical");
}

async function getRadicalAssignmentsAtLevel(level: number) {
    return await getAssignments(`?subject_types=radical&levels=${level}`);
}

export const AssignmentsAPI = {
    putAssignment,
    getAssignments,
    getAvailableLessons,
    getAvailableReviews,
    getKanjiAssignments,
    getKanjiAssignmentsAtLevel,
    getRadicalAssignments,
    getRadicalAssignmentsAtLevel,
};
