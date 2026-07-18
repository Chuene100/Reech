import React, { useEffect, useState } from 'react'
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Feather, Ionicons } from '@expo/vector-icons';

//custom
import { COLORS, images } from '../../../constants';
import NavHeader from "@/components/Headers/NavHeader";
import { useListMyProfilesQuery } from "../../../redux/api/api-slice";
import { setProfileImage } from "../../../redux/features/profile-image-slice";
import { CustomReechForLocation } from '@/components/index';
import { LinearGradient } from 'expo-linear-gradient';

const AddAvailabilityCalendarScreen = ({ route }) => {
    const profile = route.params.profile;

    
    const navigation = useNavigation();

    
    const { control, handleSubmit } = useForm({});

    const dispatch = useDispatch();
    
    const [myProfiles, setMyProfiles] = useState([]);
    const [remoteLocation, setRemoteLocation] = useState(false);
    const [noRecurrence, setNoRecurrence] = useState(false);
    const [oneWeekRecurrence, setOneWeekRecurrence] = useState(false);
    const [oneMonthRecurrence, setOneMonthRecurrence] = useState(false);
    const [timeFrom, setTimeFrom] = useState(moment().hour(0).minute(0));
    const [timeTo, setTimeTo] = useState(moment().hour(0).minute(0));
    const [cost, setCost] = useState(0);

    const noRecurring = () => {
        setNoRecurrence(true);
        setOneWeekRecurrence(false);
        setOneMonthRecurrence(false);
    };
    const oneWeekRecurring = () => {
        setNoRecurrence(false);
        setOneWeekRecurrence(true);
        setOneMonthRecurrence(false);
    };
    const oneMonthRecurring = () => {
        setNoRecurrence(false);
        setOneWeekRecurrence(false);
        setOneMonthRecurrence(true);
    };

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

    const updateTimeFrom = (increment) => {
        if (increment) { setTimeFrom(timeFrom.clone().add(30, 'minutes')) }
        else { setTimeFrom(timeFrom.clone().subtract(30, 'minutes')) }
        calculateCost();
    };

    const updateTimeTo = (increment) => {
        if (increment) { setTimeTo(timeTo.clone().add(30, 'minutes')) }
        else { setTimeTo(timeTo.clone().subtract(30, 'minutes')) }
        calculateCost();
    };

    const calculateCost = () => {
        const timeDifference = timeTo.diff(timeFrom, 'hours', true);
        const hourlyRate = 1;
        const calculatedCost = (timeDifference * hourlyRate).toFixed(2);

        if (noRecurrence) {
            setCost(calculatedCost);
        } else if (oneWeekRecurrence) {
            setCost(calculatedCost * 7);
        } else if (oneMonthRecurrence) {
            setCost(calculatedCost * 30);
        } else {
            setCost(calculatedCost);
        }
    };

    const addAvailabilityCreate = () => {
        console.log("add availability of profile");
        navigation.navigate("MyAiCalendarHomeScreen");
    }

    //screen header section
    function renderHeaderComponentSection() {
        return (
            <View style={styles.screenHeaderComponentContainer}>
                <NavHeader message="What would you like to do?" />

                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerMainTextItem}>Add Availability</Text>
                    <Text style={styles.headerSubTextItem}>{formattedDate}</Text>
                </View>
            </View>
        )
    }

    //form section
    function renderFormSection() {
        return (
            <View style={styles.formScreenContainer}>
                <View style={styles.headingContentContainer}>
                    <View style={styles.headingTopLinearItem} />
                    <Text style={styles.headingTextItem}>Add your availability</Text>
                </View>

                {/*adding availability profile identity*/}
                <View style={styles.profileAvailabilityContainer}>
                    <View style={styles.profileAvailabilityImageContainer}>
                        <Image
                            source={
                                profile.profileImage
                                    ? {
                                        uri:
                                            image[profile.profileImage] ?? profile.profileImage,
                                    }
                                    : images.defaultRounded
                            }
                            style={styles.profileAvailabilityImageItem}
                        />
                    </View>

                    <View style={styles.profileAvailabilityTextContainer}>
                        <Text style={styles.profileAvailabilityTextItem}>{profile?.jobTitleId?.jobTitle}</Text>
                    </View>
                </View>

                {/*form items section*/}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    listViewDisplayed={false}
                    nestedScrollEnabled={true}
                    keyboardShouldPersistTaps="handled"
                    style={styles.scrollingSectionContainer}
                >
                    {renderFormLocationItemsSection()}
                    {renderFormAvailableTimeSection()}
                    {renderFormRecurringOptionsSection()}
                    {renderFormCostSection()}
                    {renderAddAvailabilityButtonSection()}
                </ScrollView>
            </View>
        )
    }

    //form location items section
    function renderFormLocationItemsSection() {
        return (
            <View style={styles.formItemsContainer}>
                <View style={styles.formItemContainer}>
                    <Text style={styles.formSubheaderTextItem}>Set your preferred location</Text>

                    {/*location section item*/}
                    <View style={styles.formOptionContainer}>
                        <Text style={styles.formTextItem}>Remote</Text>
                        <View style={styles.formRemoteLocationContainer}>
                            <Feather
                                name={remoteLocation ? "check-circle" : "circle"}
                                size={20}
                                color={remoteLocation ? COLORS.purpleDark : COLORS.darkGray}
                                onPress={() => setRemoteLocation(!remoteLocation)}
                            />
                        </View>
                    </View>

                    {/*map section item*/}
                    <View style={styles.searchComponentContainer}>
                        {remoteLocation === true ? null : (
                            <CustomReechForLocation
                                name="address"
                                control={control}
                                placeholder="Search location here"
                            />
                        )}
                    </View>
                </View>
            </View>
        )
    }

    //form available time
    function renderFormAvailableTimeSection() {
        return (
            <View style={styles.formItemsContainers}>
                <View style={styles.formItemContent}>
                    <Text style={styles.formSubheaderTextItem}>Choose your available times</Text>

                    <View style={styles.formTimeSelectorContainer}>
                        <View style={styles.formTimeSelectorContent}>
                            <Feather
                                onPress={() => updateTimeFrom(false)}
                                name="minus-circle"
                                size={20}
                                color={COLORS.darkGray}
                            />
                            <Text style={styles.formTimeSelectorTextItem}>
                                {timeFrom.format('HH[h]mm')}
                            </Text>
                            <Ionicons
                                onPress={() => updateTimeFrom(true)}
                                name="add-circle-outline"
                                size={20}
                                color={COLORS.darkGray}
                            />
                        </View>
                        <View style={styles.formTimeTextSelectorContainer}>
                            <Text style={styles.formTimeTextSelectorTextItem}>to</Text>
                        </View>
                        <View style={styles.formTimeSelectorContent}>
                            <Feather
                                onPress={() => updateTimeTo(false)}
                                name="minus-circle"
                                size={20}
                                color={COLORS.darkGray}
                            />
                            <Text style={styles.formTimeSelectorTextItem}>
                                {timeTo.format('HH[h]mm')}
                            </Text>
                            <Ionicons
                                onPress={() => updateTimeTo(true)}
                                name="add-circle-outline"
                                size={20}
                                color={COLORS.darkGray}
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    //form recurring section
    function renderFormRecurringOptionsSection() {
        return (
            <View style={styles.formRecurringContainer}>
                <View style={styles.formItemContainer}>
                    <Text style={styles.formSubheaderTextItem}>Make recurring?</Text>
                    {/*no recurring section*/}
                    <View style={styles.recurringContainer}>
                        <Text style={styles.recurringTextItem}>No, this is once off</Text>
                        <TouchableOpacity onPress={noRecurring} style={styles.formRemoteLocationContainer}>
                            <Feather
                                name={noRecurrence ? "check-circle" : "circle"}
                                size={20}
                                color={noRecurrence ? COLORS.purpleDark : COLORS.darkGray}
                            />
                        </TouchableOpacity>
                    </View>

                    {/*one week recurring section*/}
                    <View style={styles.recurringContainer}>
                        <Text style={styles.recurringTextItem}>Yes, for 1 week</Text>
                        <TouchableOpacity onPress={oneWeekRecurring} style={styles.formRemoteLocationContainer}>
                            <Feather
                                name={oneWeekRecurrence ? "check-circle" : "circle"}
                                size={20}
                                color={oneWeekRecurrence ? COLORS.purpleDark : COLORS.darkGray}
                            />
                        </TouchableOpacity>
                    </View>

                    {/*one month recurring section*/}
                    <View style={styles.recurringContainer}>
                        <Text style={styles.recurringTextItem}>Yes, for 1 month</Text>
                        <TouchableOpacity onPress={oneMonthRecurring} style={styles.formRemoteLocationContainer}>
                            <Feather
                                name={oneMonthRecurrence ? "check-circle" : "circle"}
                                size={20}
                                color={oneMonthRecurrence ? COLORS.purpleDark : COLORS.darkGray}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    //cost section
    function renderFormCostSection() {
        return (
            <View style={styles.formRecurringContainer}>
                <View style={styles.formItemContainer}>
                    <View style={styles.formSubheaderTextContainer}>
                        <Text style={styles.formSubheaderTextItem}>Cost</Text>
                        <Text style={styles.formCostExplanationTextItem}>We will charge you 50c per hour</Text>
                    </View>
                    <Text style={styles.formCostTextItem}>R{cost}</Text>
                </View>
            </View>
        )
    }

    //add availability button section
    function renderAddAvailabilityButtonSection() {
        return (
            <View style={styles.acceptAvailabilityButtonContainer}>
                <View style={styles.acceptAvailabilityContent}>
                    <TouchableOpacity
                        onPress={() => handleSubmit(addAvailabilityCreate)}
                        style={styles.acceptAvailabilityContainer}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
                            style={styles.acceptAvailabilityGradientContainer}
                        >
                            <Text style={styles.acceptAvailabilityTextItem}>
                                Accept
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    //screen content items section
    function renderScreenContentList() {
        return (
            <>
                {renderHeaderComponentSection()}
                {renderFormSection()}
            </>
        )
    }

    return (
        <View style={styles.addAvailabilityContainer}>
            {renderScreenContentList()}
        </View>
    )
}


const styles = StyleSheet.create({
    addAvailabilityContainer: {
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
        fontFamily: "PoppinsBold"
    },
    headerSubTextItem: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: "PoppinsLight"
    },

    //form section
    formScreenContainer: {
        marginTop: 15,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        backgroundColor: "#141414",
    },
    headingContentContainer: {
        marginTop: 25,
        marginBottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    headingTopLinearItem: {
        width: "15%",
        marginBottom: 15,
        borderBottomColor: COLORS.white,
        borderBottomWidth: StyleSheet.hairlineWidth * 3,
    },
    headingTextItem: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: "PoppinsBold",
    },
    scrollingSectionContainer: {
        height: Platform.OS === "ios" ? 700 : 620,
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    profileAvailabilityContainer: {
        width: "100%",
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    profileAvailabilityImageContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    profileAvailabilityImageItem: {
        width: 45,
        height: 45,
        resizeMode: "cover",
        borderRadius: 45,
    },
    profileAvailabilityTextContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
    },
    profileAvailabilityTextItem: {
        color: COLORS.white,
        fontSize: 14,
        fontFamily: "PoppinsLight",
    },

    //form items section
    formItemsContainer: {
        width: "100%",
    },
    formItemsContainers: {
        width: "100%",
        zIndex: -99,
    },
    formItemContainer: {
        flexDirection: "column",
    },
    formItemContent: {
        marginTop: 10,
        flexDirection: "column",
    },
    formSubheaderTextItem: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: "PoppinsBold"
    },
    formOptionContainer: {
        marginTop: 10,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    formTextItem: {
        color: COLORS.white,
        fontSize: 14,
        fontFamily: "PoppinsLight"
    },
    formRemoteLocationContainer: {
        paddingHorizontal: 18,
        justifyContent: "center",
        alignItems: "flex-end",
    },

    //search component section
    searchComponentContainer: {
        flexDirection: "column",
        marginTop: 10,
        minHeight: 50,
        backgroundColor: COLORS.transparent,
        zIndex: 99,
    },

    //time selector section
    formTimeSelectorContainer: {
        width: "100%",
        marginTop: 15,
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 80,
        flexDirection: "row",
    },
    formTimeSelectorContent: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    formTimeSelectorTextItem: {
        color: COLORS.white,
        fontSize: 14,
        fontFamily: "PoppinsLight",
        marginVertical: 5,
    },
    formTimeTextSelectorContainer: {
        width: "20%",
        justifyContent: "center",
        alignItems: "center",
    },
    formTimeTextSelectorTextItem: {
        color: COLORS.white,
        fontSize: 14,
        fontFamily: "PoppinsLight"
    },

    //form recurring section
    formRecurringContainer: {
        width: "100%",
        marginTop: 15,
        zIndex: -99,
    },
    recurringContainer: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    recurringTextItem: {
        color: COLORS.white,
        fontSize: 14,
        fontFamily: "PoppinsLight"
    },
    formSubheaderTextContainer: {
        flexDirection: "row",
    },
    formCostExplanationTextItem: {
        marginTop: 3,
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsLight",
        opacity: 0.5,
        marginLeft: 10,
    },
    formCostTextItem: {
        marginTop: 5,
        color: COLORS.white,
        fontSize: 20,
        fontFamily: "PoppinsBold"
    },

    //accept button section
    acceptAvailabilityButtonContainer: {
        marginTop: 10,
        paddingHorizontal: 15,
        alignItems: "flex-end",
        justifyContent: "flex-end",
    },
    acceptAvailabilityContent: {
        width: "35%",
    },
    acceptAvailabilityContainer: {
        top: 10,
    },
    acceptAvailabilityGradientContainer: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30,
        height: 45,
        width: "100%",
    },
    acceptAvailabilityTextItem: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsLight",
    },
});

export default AddAvailabilityCalendarScreen;
