/**
 * @file SubjectProgressGrid.tsx
 * @description
 *   A grid style view that displays each Subject and their level of mastery at a given level.
 *
 * @module components/home/progress/SubjectProgressGrid
 */

import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

// Styling
import { ProgressStyles } from "../../../styles/home/progress.styles";

// API
import { SubjectsAPI } from "../../../api/subjects";
import { AssignmentsAPI } from "../../../api/assignments";

// Components
import SubjectProgress from "./SubjectProgress";

// Interfaces
import { RawAssignmentProps } from "../../../interfaces/RawAssignment";
import { RawSubjectProps } from "../../../interfaces/RawSubject";

interface SubjectProgressGrid {
    level: number;
    type: "radical" | "kanji";
}

const SubjectProgressGrid: React.FC<SubjectProgressGrid> = ({
    level,
    type,
}) => {
    const [subjects, setSubjects] = useState<RawSubjectProps[]>([]);

    useEffect(() => {
        //  Getting the appropriate functions and storing them as pointers
        const getSubjectAssignments =
            type === "radical"
                ? AssignmentsAPI.getRadicalAssignmentsAtLevel
                : AssignmentsAPI.getKanjiAssignmentsAtLevel;
        const getSubjects =
            type === "radical"
                ? SubjectsAPI.getRadicalsAtLevel
                : SubjectsAPI.getKanjiAtLevel;

        const fetchKanji = async () => {
            try {
                // Get all user-seen subject assignments at current level
                const all_learned_raw = await getSubjectAssignments(level);
                // Get all assignments from site at current level
                const all_subjects_raw = await getSubjects(level);

                if (all_learned_raw && all_subjects_raw) {
                    // Merging all subjects into one collection and sorting based on SRS value
                    const all_learned = new Map(
                        all_learned_raw.data.map(
                            (learned: RawAssignmentProps) => [
                                learned.data.subject_id,
                                learned.data?.passed_at
                                    ? 5
                                    : learned.data.srs_stage,
                            ],
                        ),
                    );
                    const all_subjects = all_subjects_raw.data
                        .map((subject: RawSubjectProps) => ({
                            ...subject,
                            srs_stage: all_learned.get(subject.id) ?? 0,
                        }))
                        .sort(
                            (a: RawSubjectProps, b: RawSubjectProps) =>
                                b.srs_stage - a.srs_stage,
                        );

                    setSubjects(all_subjects);
                }
            } catch (e) {
                console.error(e);
            } finally {
                // No cleanup needed
            }
        };
        fetchKanji();
    }, [level, type]);

    return (
        <View style={ProgressStyles.grid}>
            <Text
                style={{
                    ...ProgressStyles.label,
                    fontFamily: "NotoSans-Bold",
                }}
            >
                {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
            <View style={{ ...ProgressStyles.grid, borderWidth: 0 }}>
                {subjects.map((subject) => (
                    <SubjectProgress
                        key={subject.id}
                        type={type}
                        subject={subject}
                    />
                ))}
            </View>
        </View>
    );
};

export default SubjectProgressGrid;
