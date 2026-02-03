/**
 * A component meant to display the user's current lessons/reviews for the day.
 *
 * Displays the assignment count and a button that will redirect user to the
 * Lesson/Review screen to start their assignments.
 *
 * Fetches assignment data from WK API on mount and handles loading/authorization
 * states
 *
 * @param {AssignmentsProps} props - The props for the Assignments component.
 * @param {string} props.label - The label used to determine if card is type Lessons or Reviews.
 * @param {Array<RawAssignmentProps>} props.assignments - The assignments currently available.
 * @param {object} props.userPref - A JSON object containing user preferred settings.
 *
 * @returns {JSX.Element} The rendered Assignments component.
 */

import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/navigation";

// Styling
import { DashboardStyles as styles } from "../../../styles/home/dashboard.styles";
import { Colors } from "../../../constants/colors";

// API
import { SubjectsAPI } from "../../../api/subjects";

// Utils
import { C_Utils } from "../../../utils/convert";

// Interfaces
import { UserProps } from "../../../interfaces/User";
import { RawAssignmentProps } from "../../../interfaces/RawAssignment";
import { SubjectProps } from "../../../interfaces/Subject";

interface AssignmentProps {
    label: "Lessons" | "Reviews";
    assignments: Array<RawAssignmentProps>;
    user?: UserProps; // NOTE: leaving as object for now until I know what to use for
}

const AssignmentCard: React.FC<AssignmentProps> = ({
    label,
    assignments,
    user,
}) => {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { width, height } = useWindowDimensions();

    const goToReviews = async () => {
        const review_ids = assignments
            .map((assignment) => {
                return assignment.data.subject_id;
            })
            .join(",");
        const subjects_raw = await SubjectsAPI.getSubjectsWithId(review_ids);
        const subjects = C_Utils.convertSubjects(subjects_raw.data);

        // Creating a map to assign assignment ids to subjects
        const subject_to_assignment_map = new Map(
            assignments.map((assignment) => {
                return [assignment.data.subject_id, assignment.id];
            }),
        );

        const subjects_with_assignments = subjects.map(
            (subject: SubjectProps) => ({
                ...subject,
                assignment_id: subject_to_assignment_map.get(subject.id),
            }),
        );

        navigation.navigate("Review", {
            subjects: subjects_with_assignments,
            assignment_type: "review",
        });
    };
    const goToLessons = async () => {
        const batch_size = 15; // NOTE: Temporary, swap for user pref in future

        const review_ids = assignments
            .map((assignment) => {
                return assignment.data.subject_id;
            })
            .join(",");
        const subjects_raw = await SubjectsAPI.getSubjectsWithId(review_ids);
        const subjects = C_Utils.convertSubjects(subjects_raw.data);

        // Creating a map to assign assignment ids to subjects
        const subject_to_assignment_map = new Map(
            assignments.map((assignment) => {
                return [assignment.data.subject_id, assignment.id];
            }),
        );

        const subjects_with_assignments = subjects.map(
            (subject: SubjectProps) => ({
                ...subject,
                assignment_id: subject_to_assignment_map.get(subject.id),
            }),
        );

        navigation.navigate("Lesson", {
            subjects: subjects_with_assignments.slice(0, batch_size),
        });
    };

    const AssignmentStyles = {
        primary_color:
            label === "Lessons" ? Colors.KANJI_PINK : Colors.RADICAL_BLUE,
        accent_color:
            label === "Lessons"
                ? Colors.KANJI_HIGHLIGHT_FILL
                : Colors.RADICAL_HIGHLIGHT_FILL,
        description:
            label === "Lessons"
                ? "We cooked up these lessons just for you."
                : "Review these items to level them up!",
        description_no_assignments:
            label === "Lessons"
                ? "All done. Do your Reviews to unlock more Lessons."
                : "There are no more Reviews to do right now.",
        image:
            label === "Lessons"
                ? require("../../../assets/images/buttons/lessons.png")
                : require("../../../assets/images/buttons/review.png"),
        image_no_assignments:
            label === "Lessons"
                ? require("../../../assets/images/buttons/no_lessons.png")
                : require("../../../assets/images/buttons/no_review.png"),
        goTo: label === "Lessons" ? goToLessons : goToReviews,
    };

    const no_assignments =
        assignments.length === 0 || user?.current_vacation_started_at !== null;

    return (
        <Pressable
            style={[
                styles.assignment,
                no_assignments
                    ? { backgroundColor: "gray" }
                    : { backgroundColor: AssignmentStyles.primary_color },
            ]}
            onPress={AssignmentStyles.goTo}
            disabled={no_assignments}
        >
            {/* Themed Image */}
            <View style={styles.assignment_icon}>
                <Image
                    source={
                        no_assignments
                            ? AssignmentStyles.image_no_assignments
                            : AssignmentStyles.image
                    }
                    style={{
                        width: width * 0.265,
                        height: height * 0.1,
                        resizeMode: "contain",
                    }}
                />
            </View>

            {/* Assignment Count and Start Button */}
            <View style={styles.assignment_info}>
                <Text style={styles.assignment_header}>
                    {label} {no_assignments ? 0 : assignments.length}
                </Text>
                <Text style={styles.assignment_subheader}>
                    {no_assignments
                        ? AssignmentStyles.description_no_assignments
                        : AssignmentStyles.description}
                </Text>
                {!no_assignments && (
                    <View
                        style={{
                            ...styles.assignment_button_container,
                            borderColor: no_assignments
                                ? "black"
                                : AssignmentStyles.accent_color,
                        }}
                    >
                        <Text style={styles.assignment_button_text}>
                            Start {label}
                        </Text>
                    </View>
                )}
            </View>
        </Pressable>
    );
};

export default AssignmentCard;
