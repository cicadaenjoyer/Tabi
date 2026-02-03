/**
 * SubjectDefinition component acts as a parent component for SubjectSlug, Meaning, etc.
 *
 * @param {SubjectProps} subject - The subject to display.
 *
 * @returns {JSX.Element}
 */
import React, { useState, useEffect } from "react";
import { View } from "react-native";

// API
import { SubjectsAPI } from "../../api/subjects";

// Utils
import { C_Utils } from "../../utils/convert";

// Components
import RelatedSubjects from "../subject/RelatedSubjects";
import SubjectSlug from "../subject/SubjectSlug";
import SubjectMeaning from "../subject/SubjectMeaning";
import SubjectReading from "../subject/SubjectReading";
import SubjectContext from "../subject/SubjectContext";

// Styling
import { Colors } from "../../constants/colors";

// Interfaces
import { SubjectProps } from "../../interfaces/Subject";

const SubjectDefinition: React.FC<{ subject: SubjectProps }> = ({
    subject,
}) => {
    const subject_type = subject.type;
    const subject_slug =
        subject.type === "radical" ? subject.characters?.[0] : subject.slug;
    const subject_readings = subject?.readings || "";
    const subject_main_meaning =
        subject?.meanings?.find((r) => r.primary)?.meaning || "";
    const subject_alt_meanings =
        subject?.meanings
            ?.filter((m) => !m.primary)
            ?.map((m) => m.meaning)
            .join(", ") || "";
    const r_explanation = subject?.r_explanation || "";
    const m_explanation = subject?.m_explanation || "";
    const r_hint = subject?.r_hint || "";
    const m_hint = subject?.m_hint || "";
    const pronunciations = subject?.pronunciation_audios || [];
    const c_sentences = subject?.context_sentences || [];
    const related_subject_ids = subject.related_subject_ids;

    const [relatedSubjects, setRelatedSubjects] = useState({
        radicals: new Array(),
        kanji: new Array(),
        vocabulary: new Array(),
    });

    let subject_color;
    switch (subject.type) {
        case "radical":
            subject_color = Colors.RADICAL_BLUE;
            break;
        case "kanji":
            subject_color = Colors.KANJI_PINK;
            break;
        case "vocabulary":
            subject_color = Colors.VOCAB_PURPLE;
            break;
        default:
            subject_color = Colors.BASIC_BLACK;
            break;
    }

    // Fetch related subjects on mount
    useEffect(() => {
        const fetchSubjects = async () => {
            const subjects_raw = await SubjectsAPI.getSubjectsWithId(
                related_subject_ids.join(","),
            );
            const subjects_formatted = C_Utils.convertSubjects(
                subjects_raw.data,
            );
            const related_subjects = {
                radicals: subjects_formatted.filter(
                    (subject) => subject.type === "radical",
                ),
                kanji: subjects_formatted.filter(
                    (subject) => subject.type === "kanji",
                ),
                vocabulary: subjects_formatted.filter(
                    (subject) => subject.type === "vocabulary",
                ),
            };

            setRelatedSubjects(related_subjects);
        };
        fetchSubjects();
    }, []);

    return (
        <View
            style={{
                flex: 1,
                padding: 20,
            }}
        >
            {/* Subject Slug, Meaning, & Image */}
            <SubjectSlug
                fill={subject_color}
                slug={subject_slug}
                main_meaning={subject_main_meaning}
                // subject_image={subject_image}
            />

            {/* (KANJI) Radical Combination */}
            {subject_type === "kanji" &&
                relatedSubjects.radicals.length > 0 && (
                    <RelatedSubjects
                        header="Radical Combination"
                        subjects={relatedSubjects.radicals}
                    />
                )}

            {/* Subject Detailed Primary/Alt Meanings, Explanation, & Hint */}
            {!!subject_main_meaning && (
                <SubjectMeaning
                    type={subject_type}
                    main_meaning={subject_main_meaning}
                    alt_meanings={subject_alt_meanings}
                    meaning_explanation={m_explanation}
                    meaning_hint={m_hint}
                />
            )}

            {/* Subject Detailed Reading, Explanation, & Hint */}
            {subject_readings && (
                <SubjectReading
                    type={subject_type}
                    readings_raw={subject_readings}
                    pronunciations={pronunciations}
                    reading_explanation={r_explanation}
                    reading_hint={r_hint}
                />
            )}

            {/* Subject Context */}
            {c_sentences?.length > 0 && (
                <SubjectContext context_sentences={c_sentences} />
            )}

            {/* (RADICAL) Found in Kanji */}
            {subject_type === "radical" && relatedSubjects.kanji.length > 0 && (
                <RelatedSubjects
                    header="Found in Kanji"
                    subjects={relatedSubjects.kanji}
                />
            )}

            {/* (KANJI) Visually Similar Kanji */}
            {subject_type === "kanji" && relatedSubjects.kanji.length > 0 && (
                <RelatedSubjects
                    header="Visually Similar Kanji"
                    subjects={relatedSubjects.kanji}
                />
            )}

            {/* (KANJI) Found in Vocabulary */}
            {subject_type === "kanji" &&
                relatedSubjects.vocabulary.length > 0 && (
                    <RelatedSubjects
                        header="Found in Vocabulary"
                        subjects={relatedSubjects.vocabulary}
                    />
                )}

            {/* (VOCAB) Kanji Composition */}
            {subject_type === "vocabulary" &&
                relatedSubjects.kanji.length > 0 && (
                    <RelatedSubjects
                        header="Kanji Composition"
                        subjects={relatedSubjects.kanji}
                    />
                )}
        </View>
    );
};

export default SubjectDefinition;
