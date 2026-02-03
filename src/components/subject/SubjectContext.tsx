/**
 * SubjectContext component displays a list of example context sentences for the
 * vocab subject
 *
 * @param {SubjectSlugProps} props - The props for the SubjectContext component.
 * @param {string} props.context_sentences - The context sentences in both English and Japanese.
 *
 * @returns {JSX.Element}
 */
import React from "react";
import { View, Text } from "react-native";

// Styling
import { SubjectContextStyles as styles } from "../../styles/subject/subject.definition.styles";
import { Colors } from "../../constants/colors";

interface SubjectContextProps {
    context_sentences: Array<{ en: string; ja: string }>;
}

const SubjectContext: React.FC<SubjectContextProps> = ({
    context_sentences,
}) => {
    return (
        <View style={{ marginTop: 12 }}>
            {/* Meaning Header and Divider */}
            <Text style={styles.header}>Context</Text>
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: Colors.OPTIONS_GREY,
                    marginBottom: 12,
                }}
            />

            {/* Subject Context Sentences */}
            <Text style={styles.context_sentence}>Context Sentences</Text>
            {context_sentences.map((c_sent) => {
                return (
                    <View
                        key={c_sent.ja + c_sent.en}
                        style={{
                            paddingBottom: 12,
                        }}
                    >
                        <Text
                            selectable
                            style={{
                                fontFamily: "NotoSansJP-Regular",
                                fontSize: 14,
                                lineHeight: 18,
                            }}
                        >
                            {c_sent.ja}
                        </Text>
                        <Text
                            selectable
                            style={{ fontSize: 14, color: Colors.LESSON_GREY }}
                        >
                            {c_sent.en}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
};

export default SubjectContext;
