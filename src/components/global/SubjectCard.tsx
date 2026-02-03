/**
 * SubjectCard component shows the subject's slug, main reading, and meaning in a condensed
 * card format.
 *
 * @param {SubjectProps} subject - The subject to display.
 * @param {SubjectProps} s_idx - The unique subject view id.
 *
 * @returns {JSX.Element}
 */
import React from "react";
import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/navigation";

// Styling
import { SubjectCardStyles as styles } from "../../styles/subject/subject.card.styles";

// Interfaces
import { SubjectProps } from "../../interfaces/Subject";

const SubjectCard: React.FC<{ subject: SubjectProps }> = ({ subject }) => {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const goToSubject = (converted_subject: SubjectProps) => {
        navigation.push("Subject", { subject: converted_subject });
    };

    const subject_main_reading =
        subject?.readings?.find((reading) => reading.primary)?.reading || "";
    const subject_main_meaning =
        subject?.meanings?.find((meaning) => meaning.primary)?.meaning || "";

    return (
        <Pressable
            style={styles.container}
            onPress={() => goToSubject(subject)}
        >
            {/* Main Character/Symbol */}
            <View
                style={{
                    ...styles.slug,
                    backgroundColor: subject.fill,
                }}
            >
                <Text style={styles.slug_text}>
                    {subject.type === "radical"
                        ? subject?.characters?.[0]
                        : subject?.slug}
                </Text>
            </View>

            {/* Main Reading */}
            {!!subject_main_reading && (
                <Text style={styles.reading}>{subject_main_reading}</Text>
            )}

            {/* Main Meaning */}
            {!!subject_main_meaning && (
                <Text style={styles.meaning}>{subject_main_meaning}</Text>
            )}
        </Pressable>
    );
};

export default SubjectCard;
