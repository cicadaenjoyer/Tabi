/**
 * RelatedSubjects component displays subjects for 'Kanji Composition', 'Radical
 * Combination', 'Found in Vocabulary', 'Visually Similar Kanji', and
 * 'Found in Kanji' sections
 *
 * @param {RelatedSubjectsProps} props - The props for the RelatedSubjects component.
 * @param {string} props.header - Header that shows the relation between parent and related subjects.
 * @param {SubjectProps} props.subjects - The related subjects.
 *
 * @returns {JSX.Element}
 */

import React from "react";
import { View, Text } from "react-native";

// Components
import SubjectCard from "../global/SubjectCard";

// Styling
import { RelatedSubjectsStyles as styles } from "../../styles/subject/subject.definition.styles";
import { Colors } from "../../constants/colors";

// Interfaces
import { SubjectProps } from "../../interfaces/Subject";

interface RelatedSubjectsProps {
    header: string;
    subjects: Array<SubjectProps>;
}

const RelatedSubjects: React.FC<RelatedSubjectsProps> = ({
    header,
    subjects,
}) => {
    return (
        <View style={{ marginTop: 12 }}>
            {/* Related Subjects Header and Divider */}
            <Text style={styles.header}>{header}</Text>
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: Colors.OPTIONS_GREY,
                    marginBottom: 12,
                }}
            />

            {/* Related Subjects */}
            <View style={styles.grid}>
                {subjects.map((subject) => {
                    return (
                        <View key={subject.id}>
                            <SubjectCard subject={subject} />
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

export default RelatedSubjects;
