/**
 * SubjectMeaning component displays the header, primary/alt meanings, explanations,
 * and a hint
 *
 * @param {SubjectSlugProps} props - The props for the SubjectMeaning component.
 * @param {string} props.type - The subject type (Radical, Kanji, or Vocab).
 * @param {string} props.main_meaning - The main subject meaning.
 * @param {string} props.alt_meanings - The alternate subject meanings.
 * @param {string} props.meaning_explanation - An explanation for the main meaning.
 * @param {string} props.meaning_hint - A hint (optional) to help rememeber the subject meaning(s).
 *
 * @returns {JSX.Element}
 */
import React from "react";
import { View, Text } from "react-native";

// Components
import RichText from "../global/RichText";

// Styling
import { SubjectMeaningStyles as styles } from "../../styles/subject/subject.definition.styles";
import { Colors } from "../../constants/colors";

interface SubjectMeaningProps {
    type: string;
    main_meaning: string;
    alt_meanings: string;
    meaning_explanation: string;
    meaning_hint: string;
}

const SubjectMeaning: React.FC<SubjectMeaningProps> = ({
    type,
    main_meaning,
    alt_meanings,
    meaning_explanation,
    meaning_hint,
}) => {
    return (
        <View style={{ marginTop: 12 }}>
            {/* Meaning Header and Divider */}
            <Text style={styles.header}>
                {type === "radical" ? "Name" : "Meaning"}
            </Text>
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: Colors.OPTIONS_GREY,
                    marginBottom: 12,
                }}
            />

            {/* Primary/Alt Meanings */}
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.meaning}>Primary{"\t\t"}</Text>
                <Text
                    selectable
                    style={{
                        ...styles.meaning,
                        color: Colors.BASIC_BLACK,
                    }}
                >
                    {main_meaning}
                </Text>
            </View>

            {alt_meanings && (
                <View style={{ flexDirection: "row" }}>
                    <Text style={styles.meaning}>Alternatives{"\t\t"}</Text>
                    <Text
                        selectable
                        style={{
                            ...styles.meaning,
                            fontFamily: "NotoSans-Regular",
                        }}
                    >
                        {alt_meanings}
                    </Text>
                </View>
            )}

            {/* NOTE: Add word type? */}

            {/* Meaning Explanation & Hint */}
            <Text style={styles.explanation}>
                {type === "vocabulary" ? "Explanation" : "Mnemonic"}
            </Text>
            <View
                style={{
                    paddingBottom: 12,
                }}
            >
                <Text style={{ color: Colors.LESSON_GREY }}>
                    <RichText text={meaning_explanation} />
                </Text>
            </View>
            {meaning_hint && (
                <View style={styles.hint}>
                    <Text style={{ ...styles.meaning, color: "inherit" }}>
                        Hints
                    </Text>
                    <RichText text={meaning_hint} />
                </View>
            )}
        </View>
    );
};

export default SubjectMeaning;
