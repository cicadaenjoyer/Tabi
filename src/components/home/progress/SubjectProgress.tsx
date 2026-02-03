/**
 * @file SubjectProgress.tsx
 * @description
 *   A component that displays a given Subject's main reading and their level of mastery.
 *
 * @module components/home/progress/SubjectProgress
 */

import React from "react";
import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/navigation";

// Utils
import { C_Utils } from "../../../utils/convert";

// Interfaces
import { RawSubjectProps } from "../../../interfaces/RawSubject";

// Styling
import { ProgressStyles as styles } from "../../../styles/home/progress.styles";
import { Colors } from "../../../constants/colors";

interface SubjectProps {
    type: "radical" | "kanji";
    subject: RawSubjectProps;
}

const type_colors: Record<"radical" | "kanji", string> & { default: string } = {
    radical: Colors.RADICAL_BLUE,
    kanji: Colors.KANJI_PINK,
    default: Colors.OPTIONS_GREY,
};

const SubjectProgress: React.FC<SubjectProps> = ({ type, subject }) => {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const character_color =
        subject.srs_stage === 0 ? type_colors.default : type_colors[type];

    const goToSubject = () => {
        const converted_subject = C_Utils.convertSubject(subject)?.[0];
        navigation.navigate("Subject", { subject: converted_subject });
    };

    return (
        <View style={styles.progress_container}>
            {/* Subject Text and Background */}
            <Pressable
                style={[
                    styles.progress_fill,
                    { backgroundColor: character_color },
                ]}
                onPress={goToSubject}
            >
                <Text style={styles.progress_text}>
                    {subject?.data?.characters || "?"}
                </Text>
            </Pressable>

            {/* SRS Progression */}
            <View style={styles.srs_bar}>
                <View
                    style={[
                        styles.srs_bar_filler,
                        {
                            width: `${
                                Math.min(subject.srs_stage / 5, 1) * 100
                            }%`,
                        },
                    ]}
                />
            </View>
        </View>
    );
};

export default SubjectProgress;
