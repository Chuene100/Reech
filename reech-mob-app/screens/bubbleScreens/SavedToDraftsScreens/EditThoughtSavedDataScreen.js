import React, { useState, useEffect } from "react";
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions, } from "react-native";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";

//custom
import { COLORS, icons } from "../../../constants";
import {
    DescriptionComponent,
    CustomAccountToggler,
    CustomLocationMain,
    CustomTextInputMain,
    BlurbComponent,
} from "../../../components";
import { useListMyProfilesQuery } from "../../../redux/api/api-slice";
import NavHeader from "@/components/Headers/NavHeader";
import DropDown from "@/components/UI/DropDown";
import { citedReference } from "@/assets/data/dropDownData";
import { useReadBubbleMatesQuery } from "redux-standby/api/api-slice";
import { useListChannelsQuery } from "@/redux/api/channel";


const EditThoughtSavedDataScreen = ({ route }) => {
    const { item } = route.params;

    const navigation = useNavigation();
    const { height } = useWindowDimensions();
    const { control, handleSubmit, watch } = useForm();

    //state handlers
    const [hasGalleryPermission, setHasGalleryPermission] = useState("false");
    const [thoughtMedia, setThoughtMedia] = useState(null);
    const [selectedChannel, setChannel] = useState({});
    const [myProfiles, setMyProfiles] = useState([]);
    const [bubbleMates, setBubbleMates] = useState([]);

    const user = useSelector((state) => state.user.current_user);
    const cache_profiles = useSelector((state) => state.profiles.user_profiles);

    const mates_arr = user?.bubbleMates?.filter((m) => m.status === "Mate");

    const { data } = useReadBubbleMatesQuery(mates_arr);
    const { data: fetched_profiles } = useListMyProfilesQuery(user?._id ?? null);
    const { data: channels } = useListChannelsQuery();

    useEffect(() => {
        setMyProfiles(cache_profiles?.data ?? fetched_profiles?.data);
    }, [cache_profiles, fetched_profiles]);

    useEffect(() => {
        setBubbleMates(data?.data ?? []);
    }, [data]);

    const [watchThoughtType] = watch(["thoughtType"]);

    useEffect(() => {
        async () => {
            const galleryStatus =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === "granted");
        };
    }, []);

    const pickImage = async () => {
        let chosenImage = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (chosenImage.canceled) {
            return alert(
                "You haven't chosen any image file.\n Do you wanna try again?"
            );
        }

        if (!chosenImage.canceled) {
            setThoughtMedia(chosenImage.assets[0]);
        }
    };

    if (hasGalleryPermission === false) {
        return alert("Permission to access your gallery is required!");
    }

    const previewButtonPressed = (data) => {
        const fileName = thoughtMedia?.uri?.split("/").pop();
        const loc = data.location.split("|");

        const newData = {
            notifyBubble: data.notifyBubble == undefined ? false : data.notifyBubble,
            fileLink: {
                name: "_thoughtMedia-" + fileName,
                uri: thoughtMedia?.uri,
                type: thoughtMedia?.type,
            },
            fileType: "",
            profileId: data.profile?.split("|")?.[1],
            userId: user?._id,
            title: data.title,
            address: loc[0],
            location: { type: "Point", coordinates: [loc[2], loc[1]] },
            description: data.description,
            channelId: data?.channel?._id,
            subChannelId: data?.subChannel?._id,
            tags: [{ userId: data.thoughtTags?.split("|")?.[1] }],
            thoughtType: data?.thoughtType,
            thoughtReference: data?.thoughtType === "Original" ? null : [{ userId: data.thoughtReference?.split("|")?.[1] }],
            thought: data.thought
        };
        navigation.navigate("PreviewThoughtScreen", {
            data: newData,
        });
    };

    //header section
    function renderHeaderSection() {
        return (
            <View style={styles.headerEditContainer}>
                <NavHeader message="What would you like to do?" />
            </View>
        )
    }

    //notify bubble mates
    function renderNotifySection() {
        return (
            <View style={styles.topsSectionContent}>
                <View style={styles.topsSectionTextContainer}>
                    <Text style={styles.topsSectionText}>Notify bubble</Text>
                </View>

                <View style={styles.notifiers}>
                    <CustomAccountToggler name="notifyBubble" control={control} />
                </View>
            </View>
        );
    }

    //image picker section
    function renderImagePickerSection() {
        return (
            <View style={styles.imagesPickerContainer}>
                <>
                    <View style={styles.imagesContainer}>
                        <TouchableOpacity
                            style={styles.touchsPicture}
                            onPress={() => pickImage()}
                        >
                            {thoughtMedia?.uri ? (
                                <View style={styles.imagesPicker}>
                                    <Image
                                        source={{
                                            uri: thoughtMedia?.uri,
                                        }}
                                        style={[
                                            styles.imagesPicker,
                                            styles.imagess,
                                            { height: height * 0.26, borderWidth: 0 },
                                        ]}
                                        resizeMode="cover"
                                    />
                                </View>
                            ) : (
                                <View style={styles.imagesPicker}>
                                    <View
                                        style={[
                                            styles.imagesPicker,
                                            styles.imagess,
                                            { height: height * 0.26 },
                                        ]}
                                    >
                                        <Text style={styles.imagesText}>Add a cover or video</Text>
                                        <Text style={styles.imagesSubText}>(max size 5mb)</Text>
                                        <Image
                                            source={icons.addIconPicture}
                                            style={styles.addsIconPicture}
                                        />
                                    </View>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </>
            </View>
        );
    }

    //form items section
    function renderFormItemSection() {
        return (
            <View style={styles.formsItemContainer}>
                {/*select profile section*/}
                <View style={styles.formsItemProfileContent}>
                    <DropDown
                        name="profile"
                        control={control}
                        data={myProfiles && myProfiles.map(
                            (profile) => `${profile?.jobTitleId?.jobTitle}|${profile?._id}`
                        )}
                        rules={{ required: "Please select a profile" }}
                        placeholder={"Select a profile"}
                        minimal={true}
                    />
                </View>

                {/*add title section*/}
                <View style={styles.formsItemTitleTopContent}>
                    <CustomTextInputMain
                        name="title"
                        control={control}
                        placeholder={"Add a title"}
                        rules={{ required: "Please provide a thought title" }}
                    />
                </View>

                {/*add location section*/}
                <View style={styles.formsItemLocationContent}>
                    <CustomLocationMain
                        name="location"
                        control={control}
                        placeholder="Location"
                        rules={{ required: "Please enter a location" }}
                    />
                </View>

                {/*location spacer*/}
                <View style={styles.linesSpacerContainer}>
                    <View style={styles.horizontalsLine} />
                </View>

                {/*add description section*/}
                <View style={styles.formsItemDescriptionContent}>
                    <View style={styles.formsTextTitleItemContainer}>
                        <Text style={styles.formsTextTitleItem}>Description</Text>
                    </View>

                    <View style={styles.formsDescriptionComponentItem}>
                        <DescriptionComponent
                            name="description"
                            control={control}
                            rules={{
                                required:
                                    "Please ensure you provide a description for your thought.",
                                maxLength: {
                                    value: 200,
                                    message: "Description must only be 200 characters long",
                                },
                            }}
                            placeholder="Write a description (max 200 characters)..."
                        />
                    </View>

                    <View style={styles.linesSpacerContainer}>
                        <View style={styles.horizontalsLine} />
                    </View>
                </View>

                {/*add category section*/}
                <View style={styles.formsItemTitleContent}>
                    <DropDown
                        name="channel"
                        data={channels?.data ?? []}
                        control={control}
                        placeholder="Select a channel"
                        rules={{ required: " Please select a thought channel" }}
                        notifyChange={({ value }) => {
                            setChannel(value);
                        }}
                        rowText={'channel'}
                        minimal={true}
                    />

                    <View style={styles.formsSubComponent}>
                        <DropDown
                            name="subChannel"
                            data={selectedChannel?.subChannelId}
                            control={control}
                            type="title"
                            placeholder="   Select a sub-channel"
                            rules={{ required: " Please select a thought sub channel" }}
                            rowText={'subChannel'}
                            minimal={true}
                        />
                    </View>
                </View>

                {/*tag people or places section*/}
                <View style={styles.formsItemTagContent}>
                    <DropDown
                        name="thoughtTags"
                        control={control}
                        data={bubbleMates && bubbleMates.map(
                            (user) => `${user?.firstName + " " + user?.lastName}|${user?._id}`
                        )}
                        placeholder="Tag people or places"
                        rules={{ required: "Please select a tag" }}
                        minimal={true}
                    />
                </View>

                {/*reference dropdown section*/}
                <View style={styles.formsItemTitleContent}>
                    <DropDown
                        name="thoughtType"
                        data={citedReference}
                        control={control}
                        placeholder="Is this an original thought or is it cited?"
                        rules={{ required: "Please select a thought type" }}
                        minimal={true}
                    />

                    {watchThoughtType === "Cited" ? (
                        <View style={styles.formsReferenceComponentItem}>
                            <DropDown
                                name="thoughtReference"
                                data={bubbleMates && bubbleMates.map(
                                    (user) => `${user?.firstName + " " + user?.lastName}|${user?._id}`
                                )}//{thoughtReference}
                                control={control}
                                placeholder="     Add your references"
                                rules={{ required: "Please select a reference" }}
                                minimal={true}
                            />
                        </View>
                    ) : null}
                </View>

                <View style={styles.formDescriptionComponentItem}>
                    <BlurbComponent
                        name="thought"
                        control={control}
                        rules={{
                            required: "Please ensure you provide a thought.",
                            maxLength: {
                                value: 10000,
                                message: "Thought must only be 10000 characters long",
                            },
                        }}
                        placeholder="Start writing your thought here..."
                    />
                </View>
            </View>
        );
    }

    //thought button section
    function renderSubmitButtonSection() {
        return (
            <View style={styles.buttonItemsContainer}>
                <Pressable
                    onPress={handleSubmit(previewButtonPressed)}
                    style={styles.buttonContainer}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
                        style={styles.buttonGradientContainer}
                    >
                        <Text style={styles.buttonTextItem}>Preview</Text>
                    </LinearGradient>
                </Pressable>
            </View>
        )
    }

    //screen content list
    function renderScreenContentList() {
        return (
            <>
                {renderHeaderSection()}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.screenScrollingMainContainer}
                >
                    {renderNotifySection()}
                    {renderImagePickerSection()}
                    {renderFormItemSection()}
                </ScrollView>
                {renderSubmitButtonSection()}
            </>
        )
    }

    return (
        <View style={styles.editThoughtScreenContainer}>
            {renderScreenContentList()}
        </View>
    )
}

const styles = StyleSheet.create({
    editThoughtScreenContainer: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    screenScrollingMainContainer: {
        marginTop: 10,
        maxHeight: Platform.OS === "ios" ? "81%" : "87%",
    },
    headerEditContainer: {
        marginTop: Platform.OS === "ios" ? "10%" : 0,
    },

    //notifier
    topsSectionContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: Platform.OS === "android" ? "5%" : "4%",
    },
    topsSectionTextContainer: {
        marginTop: "1%",
    },
    topsSectionText: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: "PoppinsLight",
    },
    notifiers: {
        marginTop: "0%",
    },

    //image picker section
    imagesPickerContainer: {
        marginTop: Platform.OS === "ios" ? 15 : 0,
        width: "100%",
        height: "26.5%",
    },
    imagesContainer: {
        flex: 1,
        marginLeft: "8%",
    },
    touchsPicture: {
        zIndex: 10,
    },
    imagesPicker: {
        right: Platform.OS === "ios" ? 15 : 8,
        width: Platform.OS === "ios" ? 420 : 335,
    },
    imagess: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderColor: COLORS.white,
        borderWidth: 1,
        borderRadius: 1,
    },
    imagesText: {
        fontSize: 16,
        color: COLORS.white,
        fontFamily: "PoppinsLight",
        marginBottom: 2,
    },
    imagesSubText: {
        fontSize: 16,
        color: COLORS.darkGray,
        fontFamily: "PoppinsLight",
    },
    addsIconPicture: {
        height: 80,
        width: 80,
        marginTop: 20,
    },

    //form item section
    formsItemContainer: {
        flexDirection: "column",
        paddingHorizontal: 8,
        marginTop: Platform.OS === "ios" ? -55 : -90,
    },
    formsItemProfileContent: {
        marginBottom: 0,
        zIndex: 1,
    },
    formsItemLocationContent: {
        marginBottom: 0,
        zIndex: 99,
    },
    formsItemTitleTopContent: {
        marginBottom: -10,
    },
    formsItemTitleContent: {
        marginVertical: 0,
    },
    formsSubComponent: {
        marginTop: -10,
        marginBottom: -5,
    },
    formsItemDescriptionContent: {
        marginTop: 0,
    },
    formsTextTitleItemContainer: {
        marginTop: 8,
        marginLeft: 18,
    },
    formsTextTitleItem: {
        color: COLORS.white,
        fontSize: 14,
        fontFamily: "PoppinsLight",
    },
    formsDescriptionComponentItem: {
        paddingTop: 5,
        paddingHorizontal: 10,
        height: Platform.OS === "ios" ? 80 : 50,
    },
    linesSpacerContainer: {
        marginVertical: 5,
    },
    horizontalsLine: {
        alignSelf: "center",
        width: "100%",
        borderBottomColor: COLORS.reechGray,
        borderBottomWidth: 1,
    },
    formsItemTagContent: {
        marginTop: 0,
        marginBottom: 0,
        zIndex: 1,
    },
    formsReferenceComponentItem: {
        height: 50,
    },
    formDescriptionComponentItem: {
        paddingTop: Platform.OS === "ios" ? 5 : 10,
        paddingHorizontal: 10,
        height: "100%",
        marginBottom: Platform.OS === "ios" ? 400 : 300,
    },

    //button section
    buttonItemsContainer: {
        width: "100%",
        paddingTop: 10,
        paddingHorizontal: 10,
        justifyContent: "flex-end",
        alignItems: "flex-end",
        zIndex: 9999,
    },
    buttonContainer: {
        width: "45%",
    },
    buttonGradientContainer: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30,
        height: 45,
        width: "100%",
    },
    buttonTextItem: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: "PoppinsBold",
    },
});

export default EditThoughtSavedDataScreen;

