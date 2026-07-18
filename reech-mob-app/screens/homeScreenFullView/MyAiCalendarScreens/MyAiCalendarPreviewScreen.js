import React, { useEffect, useRef, useState } from 'react'
import { Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { LinearGradient } from 'expo-linear-gradient';

//customs
import { COLORS, icons, images } from "../../../constants";
import NavHeader from "@/components/Headers/NavHeader";
import { useListMyProfilesQuery } from "../../../redux/api/api-slice";
import { setProfileImage } from "../../../redux/features/profile-image-slice";
import { ImageBackground } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const MyAiCalendarPreviewScreen = () => {
    const navigation = useNavigation();

    const dispatch = useDispatch();
    const [myProfiles, setMyProfiles] = useState([]);
    const [profileOptionModal, setProfileOptionModal] = useState(false);

    const user = useSelector((state) => state.user.current_user);
    const image = useSelector((state) => state.profile_images.profileImages);

    const cache_profiles = useSelector((state) => state.profiles.user_profiles);

    const { data: fetched_profiles } = useListMyProfilesQuery(user?._id);

    useEffect(() => { setMyProfiles(fetched_profiles?.data ?? cache_profiles) }, [cache_profiles, fetched_profiles]);

    useEffect(() => {
        if (user) { if (!image[user?.profileImage] && user?.profileImage?.startsWith("http")) _loadImage(user?.profileImage); }
    }, [user]);

    const _loadImage = async (url) => {
        try {
            if (url) {
                const response = await fetch(url);

                const blob = await response.blob();
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    dispatch(setProfileImage({ url, data: reader.result }));
                };
            }
        } catch (error) {
            console.error(`Error loading image: ${error}`);
        }
    };

    const date = moment();
    const formattedDate = date.format("dddd, D MMMM YYYY");

    //time slots available
    const timeSlotData = [
        "00h00",
        "00h30",
        "01h00",
        "01h30",
        "02h00",
        "02h30",
        "03h00",
        "03h30",
        "04h00",
        "04h30",
        "05h00",
        "05h30",
        "06h00",
        "06h30",
        "07h00",
        "07h30",
        "08h00",
        "08h30",
        "09h00",
        "09h30",
        "10h00",
        "10h30",
        "11h00",
        "11h30",
        "12h00",
        "12h30",
        "13h00",
        "13h30",
        "14h00",
        "14h30",
        "15h00",
        "15h30",
        "16h00",
        "16h30",
        "17h00",
        "17h30",
        "18h00",
        "18h30",
        "19h00",
        "19h30",
        "20h00",
        "20h30",
        "21h00",
        "21h30",
        "22h00",
        "22h30",
        "23h00",
        "23h30",
    ];

    const timeScrollViewRef = useRef(null);
    const profileScrollViewRef = useRef(null);

    // Handler to update the scroll position of the profile ScrollView when the time ScrollView is scrolled
    const handleTimeScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        profileScrollViewRef.current.scrollTo({ y: offsetY, animated: false });
    };

    // Handler to update the scroll position of the time ScrollView when the profile ScrollView is scrolled
    const handleProfileScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        timeScrollViewRef.current.scrollTo({ y: offsetY, animated: false });
    };



    //screen header section
    function renderScreenHeaderComponentSection() {
        return (
            <View style={styles.screenHeaderComponentContainer}>
                <NavHeader message="What would you like to do?" />

                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerMainTextItem}>{formattedDate}</Text>
                </View>
            </View>
        )
    }

    //time and profile availability section
    function renderTimeAndProfileAvailabilitySection() {
        return (
            <View style={styles.timeAndProfileAvailabilityContainer}>
                {/*time scroll section*/}
                <ScrollView
                    ref={timeScrollViewRef}
                    showsVerticalScrollIndicator={false}
                    style={styles.timeAvailabilityIndicatorContainer}
                    onScroll={handleTimeScroll}
                    scrollEventThrottle={10}
                >
                    {timeSlotData.map((timeSlot, i) => (
                        <View key={i} style={[styles.timeSlotContainer,
                        {
                            marginTop: i === 0 ? 0 : 5,
                            marginBottom: i === timeSlotData.length - 1 ? 0 : 12.5,
                        }
                        ]}>
                            <Text style={styles.timeSlotTextItem}>{timeSlot}</Text>
                        </View>
                    ))}
                </ScrollView>

                <View style={styles.timeAndProfileLineSeparator} />

                {/*profile availability scroll section*/}
                <ScrollView
                    ref={profileScrollViewRef}
                    showsVerticalScrollIndicator={false}
                    style={styles.profileAvailabilityIndicatorContainer}
                    onScroll={handleProfileScroll}
                    scrollEventThrottle={10}
                >
                    {/*user profile map section*/}
                    <View style={styles.userProfileMapContainer}>
                        {myProfiles.map((profile, i) => (
                            <View key={i} style={styles.userProfileMappedContainer}>
                                {/*time slot image indicator*/}
                                <Image source={
                                    profile.profileImage
                                        ? {
                                            uri:
                                                image[profile.profileImage] ?? profile.profileImage,
                                        }
                                        : images.defaultRounded
                                }
                                    style={[
                                        styles.userProfileMappedImageItem,
                                        (i === 1) ? { borderColor: COLORS.purple } : (i === 2) ? { borderColor: COLORS.teal } : COLORS.transparent,
                                        (i === 1) ? { top: 305 } : (i === 2) ? { top: 45 } : 0,
                                        (i === 0 || i === 1 || i === 3) ? { opacity: 0.4 } : 1,
                                        (i === 0 || i === 3) ? { borderWidth: 0 } : 5,
                                    ]}
                                />

                                {/*time slot indicator*/}
                                <View
                                    style={[styles.timeSlotIndicatorContainer,
                                    (i === 1) ? { opacity: 0.4 } : 1,
                                    (i === 1) ? { top: 300, height: "100%" } : (i === 2) ? { top: 42, height: "83%" } : 0,
                                    (i === 1) ? { backgroundColor: COLORS.purple } : (i === 2) ? { backgroundColor: COLORS.teal } : COLORS.transparent,
                                    ]}
                                >
                                    <Text style={styles.timeSlotIndicatorTextItem}>
                                        {(i === 1) ? "Germiston" : (i === 2) ? "Sandton" : ""}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        )
    }

    //add availability button section
    function renderAddAvailabilityButtonSection() {
        return (
            <View style={styles.addAvailabilityButtonContainer}>
                <View style={styles.addAvailabilityContent}>
                    <TouchableOpacity
                        onPress={() => setProfileOptionModal(true)}
                        style={styles.addAvailabilityContainer}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
                            style={styles.addAvailabilityGradientContainer}
                        >
                            <Text style={styles.addAvailabilityTextItem}>
                                Add availability
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    //profile popup modal
    function renderProfilePopUpModalSection() {
        return (
            <Modal
                visible={profileOptionModal}
                statusBarTranslucent={true}
                animationType="slide"
                transparent={true}
                style={styles.profileModalContainer}
            >
                <ImageBackground
                    source={icons.popupBg}
                    style={styles.profileInnerModalContainer}
                >
                    {/*close modal section*/}
                    <View style={styles.profileInnerModalContent}>
                        <Pressable onPress={() => setProfileOptionModal(false)}>
                            <AntDesign name="closecircle" size={18} color={COLORS.white} />
                        </Pressable>
                    </View>

                    {/*header modal section*/}
                    <View style={styles.profileModalHeaderTextContainer}>
                        <Text style={styles.profileModalHeaderTextItem}>
                            Pick a profile to add an availability for
                        </Text>
                    </View>

                    <View style={styles.profileOptionModalLiner} />

                    {myProfiles.map((profile, i) => (
                        <View key={i} style={styles.profileOptionMapContainer}>
                            {console.log("i: ", profile._id)}
                            <TouchableOpacity
                                onPress={() => { navigation.navigate("AddAvailabilityCalendarScreen", { profile: profile }), setProfileOptionModal(false) }}
                                style={styles.profileOptionMapContent}>
                                {/*profile image item*/}
                                <View style={styles.profileMapImageContainer}>
                                    <Image source={
                                        profile.profileImage
                                            ? {
                                                uri:
                                                    image[profile.profileImage] ?? profile.profileImage,
                                            }
                                            : images.defaultRounded
                                    }
                                        style={styles.profileMapImageItem}
                                    />
                                </View>

                                {/*profile name item*/}
                                <View style={styles.profileMapTextContainer}>
                                    <Text style={styles.profileMapTextItem}>
                                        {profile?.jobTitleId?.jobTitle}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ImageBackground>
            </Modal>
        )
    }

    //screen content list
    function renderScreenContentList() {
        return (
            <>
                {renderScreenHeaderComponentSection()}
                {renderTimeAndProfileAvailabilitySection()}
                {renderAddAvailabilityButtonSection()}
                {renderProfilePopUpModalSection()}
            </>
        )
    }

    return (
        <View style={styles.aiCalendarPreviewContainer}>
            {renderScreenContentList()}
        </View>
    )
}

const styles = StyleSheet.create({
    aiCalendarPreviewContainer: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    screenHeaderComponentContainer: {
        marginTop: Platform.OS === "ios" ? "10%" : 0,
    },
    headerTextContainer: {
        marginTop: 10,
        paddingHorizontal: 15,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    headerMainTextItem: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: "PoppinsLight"
    },

    //time and profile availability section
    timeAndProfileAvailabilityContainer: {
        width: "100%",
        height: Platform.OS === "ios" ? "75%" : "78%",
        marginTop: Platform.OS === "ios" ? 25 : 25,
        paddingHorizontal: 15,
        flexDirection: "row",
    },
    timeAvailabilityIndicatorContainer: {
        width: "15%",
        flexDirection: "column",
    },
    timeSlotContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    timeSlotTextItem: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsLight"
    },
    timeAndProfileLineSeparator: {
        width: 1,
        marginHorizontal: 10,
        backgroundColor: COLORS.darkGray,
    },
    profileAvailabilityIndicatorContainer: {
        width: "75%",
        maxHeight: "100%",
        flexDirection: "column",
    },
    timeIndicatorLineItem: {
        width: "100%",
        borderBottomWidth: StyleSheet.hairlineWidth * 1,
        borderBottomColor: COLORS.darkGray,
    },
    userProfileMapContainer: {
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "center",
    },
    userProfileMappedContainer: {
        width: Platform.OS === "ios" ? 50 : 40,
        marginHorizontal: 10,
        flexDirection: "column",
        alignItems: "center",
    },
    userProfileMappedImageItem: {
        width: 35,
        height: 35,
        resizeMode: "cover",
        borderRadius: 35,
        borderWidth: 2,
        zIndex: 1,
    },
    timeSlotIndicatorContainer: {
        width: 22,
        paddingVertical: 2,
        justifyContent: "center",
        alignItems: "center",
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
    },
    timeSlotIndicatorTextItem: {
        width: 10.5,
        color: COLORS.white,
        fontSize: 14,
        fontFamily: "PoppinsLight",
        textAlign: "center",
        textAlignVertical: "center",
        lineHeight: 25,
        textTransform: "uppercase",
    },

    //add button section
    addAvailabilityButtonContainer: {
        marginTop: 10,
        paddingHorizontal: 15,
        alignItems: "flex-end",
        justifyContent: "flex-end",
    },
    addAvailabilityContent: {
        width: "35%",
    },
    addAvailabilityContainer: {
        top: 10,
    },
    addAvailabilityGradientContainer: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30,
        height: 45,
        width: "100%",
    },
    addAvailabilityTextItem: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsLight",
    },

    //popup modal
    profileModalContainer: {
        marginTop: 10,
    },
    profileInnerModalContainer: {
        flex: 1,
        marginTop: Platform.OS === "ios" ? "134%" : "121%",
        padding: "4%",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: "hidden",
    },
    profileInnerModalContent: {
        right: 5,
        flexDirection: "row",
        justifyContent: "flex-end",
        zIndex: 99,
    },
    profileModalHeaderTextContainer: {
        marginTop: 5,
        marginBottom: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    profileModalHeaderTextItem: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: "PoppinsLight",
    },
    profileOptionModalLiner: {
        width: "40%",
        marginVertical: 6,
        alignSelf: "center",
        borderBottomColor: COLORS.darkGray,
        borderBottomWidth: StyleSheet.hairlineWidth * 3,
    },
    profileOptionMapContainer: {
        width: "100%",
        paddingHorizontal: 15,
        flexDirection: "column",
    },
    profileOptionMapContent: {
        width: "100%",
        flexDirection: "row",
        marginBottom: 10,
        marginTop: Platform.OS === "ios" ? 8 : 2,
    },
    profileMapImageContainer: {
        width: "15%",
        justifyContent: "center",
        alignItems: "center"
    },
    profileMapImageItem: {
        width: 40,
        height: 40,
        resizeMode: "cover",
        borderRadius: 40
    },
    profileMapTextContainer: {
        width: "80%",
        justifyContent: "center",
        alignItems: "flex-start",
        marginLeft: 5,
    },
    profileMapTextItem: {
        color: COLORS.white,
        fontSize: 14,
        fontFamily: "PoppinsLight"
    },
});

export default MyAiCalendarPreviewScreen;