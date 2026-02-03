/**
 * @file HomeScreen.tsx
 * @description
 *   Main home screen for Tabi.
 *   Displays assignment and review dashboard cards and the user's progress and current level.
 */

import React, { useState } from "react";
import { View, ScrollView, RefreshControl, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import FontAwesome from "@react-native-vector-icons/fontawesome";

// API
import { UserAPI } from "../api/user";
import { AssignmentsAPI } from "../api/assignments";

import { UserProps } from "../interfaces/User";

// Components
import ProfileSection from "../components/home/menu/ProfileSection";
import MenuModal from "../components/home/menu/MenuModal";
import AssignmentCard from "../components/home/dashboard/AssignmentCard";
import ProgressSection from "../components/home/progress/ProgressSection";

// Styles
import { HomeStyles as styles } from "../styles/globals";

const HomeScreen = () => {
    const [user, setUser] = useState<UserProps>();
    const [lessons, setLessons] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);

    // Login and get user level and other preferences
    const fetchUser = async () => {
        try {
            const user_raw = await UserAPI.getUser();
            if (user_raw) {
                const user = user_raw.data;
                setUser(user);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Get all available user lessons
    const fetchLessons = async () => {
        try {
            const lessons = await AssignmentsAPI.getAvailableLessons();
            if (lessons) {
                setLessons(lessons.data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Get all available user reviews
    const fetchReviews = async () => {
        try {
            const reviews = await AssignmentsAPI.getAvailableReviews();
            if (reviews) {
                setReviews(reviews.data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Refresh the page and its components on back page event or reload event
    useFocusEffect(
        React.useCallback(() => {
            fetchUser();
            fetchLessons();
            fetchReviews();
            setLoading(false);
        }, []),
    );
    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);

        try {
            await Promise.all([fetchUser(), fetchLessons(), fetchReviews()]);
        } catch (e) {
            console.error(e);
        } finally {
            setRefreshing(false);
        }
    }, []);

    // Default loading state view
    if (loading) {
        return (
            <View
                style={{
                    ...styles.container,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            ></View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {/* Main Menu Modal */}
                <MenuModal
                    isVisible={menuVisible}
                    handleVisible={setMenuVisible}
                />

                <View style={styles.container}>
                    {/* Menu Bar */}
                    <View style={styles.menu}>
                        {/* Profile Section */}
                        <ProfileSection
                            username={user?.username}
                            level={user?.level}
                            subscription_type={user?.subscription.type}
                        />

                        {/* Main Menu Button */}
                        <Pressable
                            style={{ marginLeft: "auto", marginRight: 10 }}
                            onPress={() => setMenuVisible(true)}
                        >
                            <FontAwesome name="bars" size={20} />
                        </Pressable>
                    </View>

                    {/* Lessons & Reviews Dashboard */}
                    <View style={styles.dashboard}>
                        {lessons && (
                            <AssignmentCard
                                label="Lessons"
                                assignments={lessons}
                                user={user}
                            ></AssignmentCard>
                        )}
                        {reviews && (
                            <AssignmentCard
                                label="Reviews"
                                assignments={reviews}
                                user={user}
                            ></AssignmentCard>
                        )}
                    </View>

                    {/* Current Level & Radical/Kanji Progress */}
                    <ProgressSection userLevel={user?.level || 0} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;
