/**
 * SubjectReading component displays the header, primary/alt readings, explanations,
 * and a hint
 *
 * @param {SubjectSlugProps} props - The props for the SubjectReading component.
 * @param {string} props.type - The subject type (Radical, Kanji, or Vocab).
 * @param {Array<{ reading: string; primary: boolean; type: string }>} props.readings_raw - The subject readings before formatting.
 * @param {string} props.reading_explanation - An explanation for the main reading.
 * @param {string} props.reading_hint - A hint (optional) to help rememeber the subject reading(s).
 *
 * @returns {JSX.Element}
 */

import React from "react";
import { View, Text, Pressable } from "react-native";
import { Audio } from "expo-av";

// Components
import RichText from "../global/RichText";

// Styling
import { SubjectReadingStyles as styles } from "../../styles/subject/subject.definition.styles";
import { Colors } from "../../constants/colors";

interface SubjectReadingProps {
    type: string;
    readings_raw: Array<{ reading: string; primary: boolean; type: string }>;
    pronunciations: Array<{
        url: string;
        metadata: {
            gender: string;
            voice_actor_name: string;
            voice_description: string;
        };
    }>;
    reading_explanation: string;
    reading_hint: string;
}

const SubjectReading: React.FC<SubjectReadingProps> = ({
    type,
    readings_raw,
    pronunciations,
    reading_explanation,
    reading_hint,
}) => {
    const playPronunciationAudio = async (uri: string) => {
        try {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
            });

            const { sound } = await Audio.Sound.createAsync(
                { uri: uri },
                { shouldPlay: true },
            );

            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    sound.unloadAsync();
                }
            });
        } catch (error) {
            console.error("Failed to play audio:", error);
        }
    };

    const subject_readings = [
        {
            type: "On'yomi",
            value:
                readings_raw
                    ?.filter((r) => r.type === "onyomi")
                    ?.map((r) => r.reading)
                    ?.join(", ") || "None",
            primary: readings_raw?.find((r) => r.type === "onyomi")?.primary,
        },
        {
            type: "Kun'yomi",
            value:
                readings_raw
                    ?.filter((r) => r.type === "kunyomi")
                    ?.map((r) => r.reading)
                    ?.join(", ") || "None",
            primary: readings_raw?.find((r) => r.type === "kunyomi")?.primary,
        },
        {
            type: "Nanori",
            value:
                readings_raw
                    ?.filter((r) => r.type === "nanori")
                    ?.map((r) => r.reading)
                    ?.join(", ") || "None",
            primary: readings_raw?.find((r) => r.type === "nanori")?.primary,
        },
    ];

    return (
        <View style={{ marginTop: 12 }}>
            {/* Reading Header and Divider */}
            <Text style={styles.header}>Reading</Text>
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: Colors.OPTIONS_GREY,
                    marginBottom: 12,
                }}
            />

            {/* Primary/Alt Reading & Pronunciations (Vocab)*/}
            <View style={styles.readings_table}>
                {type !== "vocabulary" &&
                    subject_readings.map((reading, ridx) => {
                        return (
                            <View
                                key={reading.value + ridx}
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {!!reading.type && (
                                    <Text
                                        style={{
                                            ...styles.reading,
                                            fontFamily:
                                                reading.primary &&
                                                readings_raw.length !== 1
                                                    ? "NotoSans-Bold"
                                                    : "NotoSans-Regular",
                                        }}
                                    >
                                        {reading.type.at(0)?.toUpperCase() +
                                            reading.type.slice(1)}
                                    </Text>
                                )}
                                <Text
                                    selectable
                                    style={{
                                        ...styles.reading,
                                        fontFamily:
                                            reading.primary &&
                                            readings_raw.length !== 1
                                                ? "NotoSansJP-Bold"
                                                : "NotoSansJP-Regular",
                                        color: Colors.BASIC_BLACK,
                                        lineHeight: 18,
                                    }}
                                >
                                    {reading.value}
                                </Text>
                            </View>
                        );
                    })}
                {type === "vocabulary" && (
                    <Text
                        selectable
                        style={{
                            ...styles.reading,
                            fontFamily: "NotoSansJP-Regular",
                            color: Colors.BASIC_BLACK,
                            lineHeight: 18,
                        }}
                    >
                        {readings_raw?.[0].reading}
                    </Text>
                )}
            </View>
            {pronunciations.map((pronunciation) => {
                return (
                    <Pressable
                        key={pronunciation.url}
                        onPress={() =>
                            playPronunciationAudio(pronunciation.url)
                        }
                    >
                        <Text style={{ fontSize: 10, marginTop: 4 }}>
                            <Text style={styles.pronunciation}>
                                {"▶︎ "}
                                {pronunciation.metadata.voice_actor_name?.toUpperCase()}
                            </Text>
                            <Text style={{ fontFamily: "NotoSans-Light" }}>
                                {" "}
                                (
                                {pronunciation.metadata.voice_description?.toUpperCase()}
                                {", "}
                                {pronunciation.metadata.gender?.toUpperCase()})
                            </Text>
                        </Text>
                    </Pressable>
                );
            })}

            {/* Reading Explanation & Hint */}
            <Text style={styles.explanation}>
                {type === "vocabulary" ? "Explanation" : "Mnemonic"}
            </Text>
            <View
                style={{
                    paddingBottom: 12,
                }}
            >
                <Text style={{ color: Colors.LESSON_GREY }}>
                    <RichText text={reading_explanation} />
                </Text>
            </View>
            {reading_hint && (
                <View style={styles.hint}>
                    <Text style={{ fontFamily: "NotoSans-Bold", fontSize: 14 }}>
                        Hints
                    </Text>
                    <RichText text={reading_hint} />
                </View>
            )}
        </View>
    );
};

export default SubjectReading;
