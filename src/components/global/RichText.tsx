/**
 * RichText component converts rich text from WK API to special text blocks
 *
 * @param {RichTextProps} props - The props for the RichText component.
 * @param {string} props.text - The rich text to be converted
 *
 * @returns {JSX.Element}
 */

import React from "react";
import { Text } from "react-native";

// Styling
import { Colors } from "../../constants/colors";

interface RichTextProps {
    text: string;
}

const RichText: React.FC<RichTextProps> = ({ text }) => {
    const RT_REGEX =
        /(<(?:kanji|radical|vocabulary|reading|em)>.*?<\/(?:kanji|radical|vocabulary|reading|em)>)|([^<]+)/g;

    return (
        <Text
            style={{
                fontFamily: "NotoSans-Regular",
                fontSize: 14,
                flexWrap: "wrap",
            }}
        >
            {text.match(RT_REGEX)?.map((e, idx) => {
                const RM_REGEX =
                    /<\/?(?:vocabulary|kanji|radical|reading|em)>/g;
                const word_type =
                    e
                        .match(RM_REGEX)?.[0]
                        ?.replace(/[<>]/g, "")
                        ?.toUpperCase() || null;
                const background_fill = word_type
                    ? Colors[`${word_type}_HIGHLIGHT_BACK`]
                    : "";
                const txt_fill = word_type
                    ? Colors[`${word_type}_HIGHLIGHT_FILL`]
                    : "";

                return (
                    <Text
                        style={{
                            backgroundColor: background_fill,
                            color: txt_fill,
                            fontFamily:
                                word_type === "EM"
                                    ? "NotoSans-Italic"
                                    : "NotoSans-Regular",
                        }}
                        key={idx}
                    >
                        {e.replace(RM_REGEX, "")}
                    </Text>
                );
            })}
        </Text>
    );
};

export default RichText;
