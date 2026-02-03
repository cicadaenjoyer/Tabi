/**
 * SubjectSlug component displays a Subject's main reading (slug) and meaning
 *
 * @param {SubjectSlugProps} props - The props for the SubjectSlug component.
 * @param {string} props.fill - The color corresponding to the subject type.
 * @param {string} props.slug - The main subject character(s).
 * @param {string} props.main_meaning - The main subject meaning.
 * @param {string} props.subject_image - A helper image used mainly for Radical subjects.
 *
 * @returns {JSX.Element}
 */

import React from "react";
import { View, Text } from "react-native";

// Styling
import { SubjectSlugStyles } from "../../styles/subject/subject.definition.styles";

interface SubjectSlugProps {
    fill: string;
    slug: string;
    main_meaning: string;
    // subject_image: string;
}

const SubjectSlug: React.FC<SubjectSlugProps> = ({
    fill,
    slug,
    main_meaning,
}) => {
    return (
        <View>
            {/* Main Subject Slug */}
            <View
                style={{
                    ...SubjectSlugStyles.slug,
                    backgroundColor: fill,
                }}
            >
                <Text selectable style={SubjectSlugStyles.slug_text}>
                    {slug}
                </Text>
            </View>

            {/* Subject Main Meaning & Helper Image */}
            <Text selectable style={SubjectSlugStyles.meaning}>
                {main_meaning}
            </Text>
        </View>
    );
};

export default SubjectSlug;
