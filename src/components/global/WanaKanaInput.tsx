/**
 * WanaKanaInput uses the WanaKana library to make a text input box used for quizzes.
 *
 * Able to detect correct/incorrect answers and changes style based on submitted
 * responses.
 *
 * @param {WKIProps} q_type - The quiz type.
 * @param {WKIProps} answers - A list of acceptable readings/meanings
 *
 * @returns {JSX.Element}
 */
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { TextInput, TextInputProps } from "react-native";
import { isHiragana, toHiragana, isKatakana, toKatakana } from "wanakana";

export interface WanaKanaInputRef {
    clear: () => void;
    isCorrect: () => boolean;
    isValid: () => boolean;
    getText: () => string;
}

interface WKIProps extends TextInputProps {
    q_type: "reading" | "meaning";
    answers: {
        reading?: string;
        meaning?: string;
        type?: string;
        primary: boolean;
    }[];
}

const WanaKanaInput = forwardRef<WanaKanaInputRef, WKIProps>(
    ({ style, ...props }, ref) => {
        const [text, setText] = useState("");

        const handleChangeText = (input: string) => {
            if (props.q_type === "reading") {
                const is_katakana = isKatakana(
                    props.answers?.[0]?.reading || "",
                );
                const textConverter = is_katakana ? toKatakana : toHiragana;
                const converted_text = textConverter(input, { IMEMode: true });
                setText(converted_text);
            } else {
                setText(input);
            }
        };

        useImperativeHandle(ref, () => ({
            clear: () => {
                setText("");
            },
            isCorrect: () => {
                const A_TYPE = props.q_type;

                const answer = props.answers.find(
                    (a) =>
                        a[A_TYPE]?.toLowerCase() === text.toLowerCase().trim(),
                );
                return !!answer;
            },
            isValid: () => {
                if (props.q_type === "reading") {
                    const is_katakana = isKatakana(
                        props.answers?.[0]?.reading || "",
                    );
                    const syntaxChecker = is_katakana ? isKatakana : isHiragana;

                    return syntaxChecker(text);
                } else {
                    return text.length > 0;
                }
            },
            getText: () => {
                return text;
            },
        }));

        return (
            <TextInput
                style={style}
                {...props}
                value={text}
                onChangeText={handleChangeText}
            />
        );
    },
);

export default WanaKanaInput;
