/**
 * @file ProgressSection.tsx
 * @description
 *   Displays the user's current level and progress. Also displays the current level's Radical
 *   and Kanji assignments, as well as the user's level of mastery on each Subject.
 *
 * @module components/home/progress/ProgressSection
 */

import React from "react";
import { View, Text } from "react-native";

// Styling
import { HomeStyles as styles } from "../../../styles/globals";

// Components
import Bar from "./Bar";
import SubjectProgressGrid from "./SubjectProgressGrid";

interface ProgressSectionProps {
    userLevel: number;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({ userLevel }) => {
    return (
        <View style={styles.progress}>
            <Text style={styles.level_header}>Level {userLevel} Progress</Text>
            <Bar level={userLevel} />
            <SubjectProgressGrid level={userLevel} type={"radical"} />
            <SubjectProgressGrid level={userLevel} type={"kanji"} />
        </View>
    );
};

export default ProgressSection;
