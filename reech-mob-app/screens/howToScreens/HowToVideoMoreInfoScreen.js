import React, { useState, useEffect } from 'react';
import { Modal, ImageBackground, ActivityIndicator, Platform, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, Feather, Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import Toast from "react-native-toast-message";
import { usePostCommentMutation } from "@/redux/api/comment";
import { useReadHowToDetailsQuery } from '@/redux/api/how-to';
import io from "socket.io-client";

//custom
import { COLORS, icons, images } from '../../constants';
import NavHeader from '../../components/Headers/NavHeader';
import { CustomInput } from "../../components";
import moment from 'moment';

///__________________Tracking database changes__________________
const SOCKET_SERVER_URL = "https://reech-node-api-7o3szyfdpq-uc.a.run.app/";
//`${process.env.REACT_APP_API_URL}${process.env.MAIN_API_BASE_PATH}`;

const HowToVideoMoreInfoScreen = ({ route }) => {
    const navigation = useNavigation();
    const { control, handleSubmit, setValue } = useForm();

    const itm = route.params.item;
    const current_user = useSelector((state) => state.user.current_user);

    //state handlers
    const [following, setFollowing] = useState(itm?.isFollow ?? false);
    const [isSaved, setIsSaved] = useState(itm?.saved ?? false);
    const [isAppreciated, setIsAppreciated] = useState(itm?.isAppreciated ?? false);
    const [modalSeeMore, setModalSeeMore] = useState(false);
    const [expandedComments, setExpandedComments] = useState([]);
    const [reportModal, setReportModal] = useState(false);
    const [shareModal, setShareModal] = useState(false);
    const [toggleText, setToggleText] = useState(false);
    const [item, setItem] = useState(itm)

    const [postCommentFn, { isLoading }] = usePostCommentMutation()
    const { data: read_post, refetch } = useReadHowToDetailsQuery(itm?._id)

    useEffect(() => {
        setItem(read_post)
    }, [read_post])

    useEffect(() => {
        const connectSocket = async () => {
            const socket = io(SOCKET_SERVER_URL, {
                transports: ["websocket"],
                extraHeaders: {
                    "Svc-Tkn": `Bearer ${process.env.SvcTkn_Main_API}`,
                },
            });
            socket.on("comment-updated", () => {
                refetch();
                console.log("comment-updated")
            });
        };
        connectSocket();
    }, []);

    const showError = (res) =>
        Toast.show({
            type: "error",
            text1: "Error",
            text2: "Something went wrong. Please try again",
        });


    const showToast = (message) =>
        Toast.show({
            type: "success",
            text1: "Success",
            text2: message,
        });

    const onComment = (data) => {
        const payload = {
            userId: current_user?._id,
            commentAbout: "HowTo",
            commentAboutId: item?._id,
            message: data.userComment,
        }

        postCommentFn(payload)
            .then((res) => {
                if (res.error) {
                    showError(res)
                    return
                }
                setValue('userComment', '')
                showToast(res?.data?.message)
            })
            .catch(err => console.log(err))
    }

    const onPrioritiesPressed = () => {
        console.log("onPrioritiesPressed");
    };

    const onMutePressed = () => {
        console.log("onMutePressed");
    };

    const onRemovePressed = () => {
        console.log("onRemovePressed");
    };

    const onReportPressed = () => {
        console.log("onReportPressed");
    };

    //individual comment toggler
    const toggleCommentExpansion = (index) => {
        const newExpandedComments = [...expandedComments];
        newExpandedComments[index] = !newExpandedComments[index];
        setExpandedComments(newExpandedComments);
    };

    const formattedTotalVideoCount =
        item?.totalVideos >= 1000
            ? `${(item?.totalVideos ?? 1 / 1000).toFixed(1)}` + "k"
            : item?.totalVideos ?? 1;

    const formattedAppreciationCount =
        item?.appreciationCount ?? 0 >= 1000
            ? `${(item?.appreciationCount / 1000).toFixed(1)}` + "k"
            : item?.appreciationCount ?? 0;

    const formattedTotalCommentCount =
        item?.userComments?.length ?? 0 >= 1000
            ? `${(item?.userComments?.length ?? 1 / 1000).toFixed(1)}` + "k"
            : item?.userComments?.length;

    //header section
    function renderHeaderContentSection() {
        return (
            <View style={styles.howToVideoHeaderContainer}>
                <NavHeader message={"What would you like to do?"} />
            </View>
        )
    }

    //user top section
    function renderUserTopSection() {
        return (
            <View style={styles.videoModalInfoSectionContainer}>
                {/*owner picture section*/}
                <TouchableOpacity
                    onPress={() => {
                        if (item?.userId?._id === current_user?._id)
                            navigation.navigate("LoggedInAccountUserScreen");
                        else
                            navigation.navigate("AccountFullViewScreen", {
                                userId: item?.userId?._id,
                            });
                    }} style={styles.videoOwnerImageContainer}>
                    <ImageBackground
                        source={images.userFrame}
                        style={styles.videoOwnerBackgroundImage}
                    >
                        <Image
                            source={{ uri: item?.userId?.profileImage }}
                            style={styles.videoOwnerImageItem}
                        />
                    </ImageBackground>
                </TouchableOpacity>

                {/*owner details and action section*/}
                <View style={styles.videoOwnerTextInfoContainer}>
                    {/*owner name section*/}
                    <View style={styles.videoOwnerTextNameContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                if (item?.userId?._id === current_user?._id)
                                    navigation.navigate("LoggedInAccountUserScreen");
                                else
                                    navigation.navigate("AccountFullViewScreen", {
                                        userId: item?.userId?._id,
                                    });
                            }}
                            style={styles.videoOwnerTextNameContent}
                        >
                            <Text numberOfLines={1} style={styles.videoOwnerNameItem}>
                                {item?.userId?.firstName} {item?.userId?.lastName}
                            </Text>
                        </TouchableOpacity>

                        {item?.userId?._id === current_user?._id ? null : <TouchableOpacity
                            onPress={() => setReportModal(true)}
                            style={styles.videoOwnerReportModalIconContent}
                        >
                            <Feather name="more-vertical" size={20} color={COLORS.white} />
                        </TouchableOpacity>}
                    </View>

                    {/*owner profile section*/}
                    <Text numberOfLines={1} style={styles.videoOwnerProfileNameItem}>
                        {item?.profileId?.jobTitleId?.jobTitle}
                    </Text>

                    {/*owner blurb section*/}
                    <Text numberOfLines={2} style={styles.videoOwnerBlurbItem}>
                        {item?.userId?.blurb}
                    </Text>

                    {/*owner action section*/}
                    <View style={styles.videoOwnerActionContainer}>
                        {/*follow action section*/}
                        <Text
                            onPress={() => setFollowing(!following)}
                            style={styles.followOwnerTextItem}
                        >
                            {following ? "Unfollow" : "Follow"}
                        </Text>

                        {/*video count section*/}
                        <Text style={styles.totalOwnerVideoTextItem}>
                            {formattedTotalVideoCount} videos posted
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    //video description section
    function renderVideoDescriptionSection() {
        return (
            <View style={styles.videoOwnerDescriptionContainer}>
                {/*video name section*/}
                <Text style={styles.videoOwnerNameTextItem}>{item?.title}</Text>

                {/*video name section*/}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.videoOwnerDescriptionTextContainer}
                >
                    <Text
                        onPress={() => setModalSeeMore(!modalSeeMore)}
                        numberOfLines={modalSeeMore ? undefined : 4}
                        style={styles.videoOwnerDescriptionTextItem}
                    >
                        {item?.description}
                    </Text>

                    {/*see more toggler*/}
                    {item?.description?.length > 250 && <TouchableOpacity
                        onPress={() => setToggleText(!toggleText)}
                        style={styles.seesMoreToggleContainer}
                    >
                        <Text style={styles.seesMoreToggleItem}>
                            {!toggleText ? "See more" : "Hide"}
                        </Text>
                    </TouchableOpacity>}
                </ScrollView>
            </View>
        )
    }

    //video channel section
    function renderVideoChannelSection() {
        return (
            <View style={styles.videoOwnerModalChannelContainer}>
                {/*channel section*/}
                <View style={styles.videoOwnerModalChannelContent}>
                    {/*sub channel image section*/}
                    <View style={styles.videoChannelImageContainer}>
                        <Image
                            source={icons.arrowIcon}
                            style={styles.videoChannelImageItem}
                        />
                    </View>

                    {/*sub channel section*/}
                    <View style={styles.videoOwnerTextItemContainer}>
                        <Text style={styles.videoOwnerTextItemItem}>
                            {item?.channelId?.channel} Channel
                        </Text>
                    </View>
                </View>

                {/*tip button section*/}
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("TipCreatorScreen", {
                            profilePicture: item?.userId?.profileImage,
                            title: item?.profileId?.jobTitleId?.jobTitle,
                            userName: item?.userId?.firstName + " " + item?.userId?.lastName,
                            video: item?.title,
                            item: item,
                        });
                    }}
                    style={styles.tipVideoOwnerButtonContainer}
                >
                    <Image
                        source={images.tipButton}
                        style={styles.tipVideoOwnerButtonImage}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    //video reaction section
    function renderVideoReactionSection() {
        return (
            <View style={styles.videoOwnerReactionContainer}>
                {/*video appreciate section*/}
                <TouchableOpacity
                    onPress={() => setIsAppreciated(!isAppreciated)}
                    style={styles.videoOwnerReactionContent}
                >
                    <Text style={styles.videoOwnerReactionTextItem}>
                        {isAppreciated
                            ? formattedAppreciationCount + 1
                            : formattedAppreciationCount}
                        {"  "}
                        <MaterialCommunityIcons
                            name="hand-clap"
                            size={16}
                            color={COLORS.white}
                        />
                    </Text>
                </TouchableOpacity>

                {/*video share section*/}
                <TouchableOpacity
                    onPress={() => setShareModal(!shareModal)}
                    style={styles.videoOwnerReactionContent}
                >
                    <Text style={styles.videoOwnerReactionTextItem}>
                        {shareModal ? "Shared" : "Share"}
                        {"  "}
                        <FontAwesome
                            name="share-square-o"
                            size={16}
                            color={COLORS.white}
                        />
                    </Text>
                </TouchableOpacity>

                {/*video save section*/}
                <TouchableOpacity
                    onPress={() => setIsSaved(!isSaved)}
                    style={styles.videoOwnerReactionContent}
                >
                    <Text style={styles.videoOwnerReactionTextItem}>
                        {isSaved ? "Saved" : "Save"}
                        {"  "}
                        {isSaved ? (
                            <Ionicons
                                name="md-bookmarks"
                                size={16}
                                color={COLORS.white}
                            />
                        ) : (
                            <FontAwesome5
                                name="bookmark"
                                size={16}
                                color={COLORS.white}
                            />
                        )}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    //video comment top section 
    function renderVideoCommentTopSection() {
        return (
            <View style={styles.videoCommentCountContainer}>
                {/*total comment count section*/}
                <View style={styles.videoCommentTotalCountContainer}>
                    <Text style={styles.videoCommentTotalCountItem}>
                        {formattedTotalCommentCount} comments
                    </Text>
                </View>

                {/*add a comment section*/}
                <View style={styles.videoAddCommentContainer}>
                    {/*logged in user picture section*/}
                    <TouchableOpacity
                        onPress={() => navigation.navigate("LoggedInAccountUserScreen")}
                        style={styles.loggedCommenterImageContainer}
                    >
                        <ImageBackground
                            source={images.userFrame}
                            style={styles.loggedCommenterBackgroundImageContainer}
                        >
                            <Image
                                source={{ uri: current_user?.profileImage }}
                                style={styles.loggedCommentImageItem}
                            />
                        </ImageBackground>
                    </TouchableOpacity>

                    {/*comment submit section*/}
                    <View style={styles.commentSubmitContainer}>
                        <CustomInput
                            name="userComment"
                            control={control}
                            placeholder="Add comment..."
                            rules={{
                                required: "Please enter a text before submitting!",
                            }}
                        />
                    </View>
                </View>

                {/*comment submit button section*/}
                <TouchableOpacity
                    onPress={handleSubmit(onComment)}
                    style={styles.videoAddCommentButtonContainer}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
                        style={styles.videoAddCommentGradientContainer}
                    >
                        {isLoading ?
                            <ActivityIndicator size={'small'} color={"#fff"} />
                            :
                            <Text style={styles.videoAddCommentTextItem}>
                                <FontAwesome name="send" size={16} color={COLORS.white} />
                                {"  "}Comment
                            </Text>}
                    </LinearGradient>
                </TouchableOpacity>
                <View style={styles.reechModalSeparator} />
            </View>
        )
    }

    //video previous section
    function renderVideoPreviousCommentSection() {
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scrollingCommentListContainer}
            >
                <View style={styles.scrollingInnerCommentContent}>
                    {/*comment items section*/}
                    {item?.commentIds?.map((commentList, i) => (
                        <View key={i} style={styles.addedCommentListItemContainer}>
                            {/*commenter image section*/}
                            <View style={styles.commenterImageContainer}>
                                <ImageBackground
                                    source={images.userFrame}
                                    style={styles.commentImageBackgroundContainer}
                                >
                                    <Image
                                        source={{ uri: commentList?.userId?.profileImage }}
                                        style={styles.commentImageItem}
                                    />
                                </ImageBackground>
                            </View>

                            {/*commenter text content section*/}
                            <View style={styles.commenterTextItemContainer}>
                                {/*commenter name*/}
                                <View style={styles.commenterNameTextContainer}>
                                    <Text
                                        numberOfLines={1}
                                        style={styles.commenterNameTextItem}
                                    >
                                        {commentList?.userId?.firstName} {commentList?.userId?.lastName}
                                    </Text>
                                </View>

                                {/*commenter description*/}
                                <TouchableOpacity
                                    onPress={() => toggleCommentExpansion(i)}
                                    style={styles.commenterCommentTextContainer}
                                >
                                    <Text
                                        numberOfLines={expandedComments[i] ? 50 : 3}
                                        style={styles.commenterCommentTextItem}
                                    >
                                        {commentList?.message}
                                    </Text>
                                </TouchableOpacity>

                                {/*commenter timestamp*/}
                                <View style={styles.commenterTimestampContainer}>
                                    <Text style={styles.commenterTimestampTextItem}>
                                        {moment(commentList?.createdAt).fromNow()}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        )
    }

    //report video modal 
    function renderVideoReportPosterModalSection() {
        return (
            <Modal
                visible={reportModal}
                statusBarTranslucent={true}
                animationType="slide"
                transparent={true}
                style={styles.reportModalContainer}
            >
                <View style={styles.reportInnerModalContainer}>
                    {/*modal close action section*/}
                    <View style={styles.reportInnerModalContent}>
                        <TouchableOpacity onPress={() => setReportModal(false)}>
                            <Ionicons name="close" size={18} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>

                    {/*more modal option section */}
                    <View style={styles.reportModalOptionContent}>
                        {/*prior option*/}
                        <TouchableOpacity
                            onPress={() => onPrioritiesPressed()}
                            style={styles.reportModalOptionContainer}
                        >
                            {/*icon section*/}
                            <View style={styles.reportModalOptionIconContainer}>
                                <Image
                                    source={icons.noHeart}
                                    style={styles.reportModalOptionIconItem}
                                />
                            </View>

                            {/*modal option text section*/}
                            <View style={styles.reportModalOptionTextContainer}>
                                <Text style={styles.reportModalOptionHeaderText}>
                                    Prioritise
                                </Text>
                                <Text style={styles.reportModalOptionInfoText}>
                                    See more from {item?.userId?.firstName} {item?.userId?.lastName}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/*mute option*/}
                        <TouchableOpacity
                            onPress={() => onMutePressed()}
                            style={styles.reportModalOptionContainer}
                        >
                            {/*icon section*/}
                            <View style={styles.reportModalOptionIconContainer}>
                                <Image
                                    source={icons.noSound}
                                    style={styles.reportModalOptionIconItem}
                                />
                            </View>

                            {/*modal option text section*/}
                            <View style={styles.reportModalOptionTextContainer}>
                                <Text style={styles.reportModalOptionHeaderText}>Mute</Text>
                                <Text style={styles.reportModalOptionInfoText}>
                                    Take a from {item?.userId?.firstName} {item?.userId?.lastName}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/*remove option*/}
                        <TouchableOpacity
                            onPress={() => onRemovePressed()}
                            style={styles.reportModalOptionContainer}
                        >
                            {/*icon section*/}
                            <View style={styles.reportModalOptionIconContainer}>
                                <Image
                                    source={icons.noUser}
                                    style={styles.reportModalOptionIconItem}
                                />
                            </View>

                            {/*modal option text section*/}
                            <View style={styles.reportModalOptionTextContainer}>
                                <Text style={styles.reportModalOptionHeaderText}>Remove</Text>
                                <Text style={styles.reportModalOptionInfoText}>
                                    Remove {item?.userId?.firstName} {item?.userId?.lastName}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/*report option*/}
                        <TouchableOpacity
                            onPress={() => onReportPressed()}
                            style={styles.reportModalOptionContainer}
                        >
                            {/*icon section*/}
                            <View style={styles.reportModalOptionIconContainer}>
                                <Image
                                    source={icons.noHeart}
                                    style={styles.reportModalOptionIconItem}
                                />
                            </View>

                            {/*modal option text section*/}
                            <View style={styles.reportModalOptionTextContainer}>
                                <Text style={styles.reportModalOptionHeaderText}>Report</Text>
                                <Text style={styles.reportModalOptionInfoText}>
                                    {`Do you want to hide ${item?.userId?.firstName}'s videos?`}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }

    //screen content list
    function renderScreenContentList() {
        return (
            <>
                {renderHeaderContentSection()}
                {renderUserTopSection()}
                {renderVideoDescriptionSection()}
                {renderVideoChannelSection()}
                {renderVideoReactionSection()}
                {renderVideoCommentTopSection()}
                {renderVideoPreviousCommentSection()}
                {renderVideoReportPosterModalSection()}
            </>
        )
    }

    return (
        <View style={styles.howToVideoInfoContainer}>
            {renderScreenContentList()}
        </View>
    )
}

const styles = StyleSheet.create({
    howToVideoInfoContainer: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    howToVideoHeaderContainer: {
        marginTop: Platform.OS === "ios" ? "10%" : 0,
    },

    //video info section
    videoModalInfoSectionContainer: {
        width: "100%",
        marginTop: 20,
        paddingHorizontal: 15,
        flexDirection: "row",
    },
    videoOwnerImageContainer: {
        width: "20%",
        justifyContent: "center",
        alignItems: "center",
    },
    videoOwnerBackgroundImage: {
        width: 90,
        height: 90,
        justifyContent: "center",
        alignItems: "center",
    },
    videoOwnerImageItem: {
        width: 80,
        height: 80,
        resizeMode: "cover",
        borderRadius: 8,
    },
    videoOwnerTextInfoContainer: {
        width: "75%",
        marginLeft: Platform.OS === "ios" ? 20 : 30,
        flexDirection: "column",
    },
    videoOwnerTextNameContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    videoOwnerTextNameContent: {
        width: "95%",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    videoOwnerReportModalIconContent: {
        width: "5%",
        justifyContent: "center",
        alignItems: "flex-end",
    },
    videoOwnerNameItem: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: "PoppinsBold",
    },
    videoOwnerProfileNameItem: {
        color: COLORS.white,
        fontSize: 14,
        fontFamily: "PoppinsLight",
        textTransform: "capitalize",
        marginVertical: 2.5,
    },
    videoOwnerBlurbItem: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsLight",
    },
    videoOwnerActionContainer: {
        marginTop: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    followOwnerTextItem: {
        color: COLORS.purple,
        fontSize: 12,
        fontFamily: "PoppinsBold",
    },
    totalOwnerVideoTextItem: {
        color: COLORS.darkGray,
        fontSize: 12,
        fontFamily: "PoppinsLight",
    },

    //video description section
    videoOwnerDescriptionContainer: {
        width: "100%",
        marginTop: 20,
        paddingHorizontal: Platform.OS === "ios" ? 8 : 0,
        flexDirection: "column",
    },
    videoOwnerNameTextItem: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: "PoppinsBold",
        marginBottom: 5,
    },
    videoOwnerDescriptionTextContainer: {
        minHeight: 50,
    },
    videoOwnerDescriptionTextItem: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsLight",
        marginBottom: 5,
    },
    seesMoreToggleContainer: {
        marginTop: 5,
        justifyContent: "center",
        alignItems: "flex-end",
    },
    seesMoreToggleItem: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsBold",
        opacity: 0.5,
    },

    //video channel section
    videoOwnerModalChannelContainer: {
        width: "100%",
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    videoOwnerModalChannelContent: {
        width: "60%",
        flexDirection: "row",
        justifyContent: "center",
    },
    videoChannelImageContainer: {
        width: "20%",
        justifyContent: "center",
        alignItems: "center",
    },
    videoChannelImageItem: {
        width: 30,
        height: 30,
        resizeMode: "cover",
    },
    videoOwnerTextItemContainer: {
        width: "80%",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    videoOwnerTextItemItem: {
        color: COLORS.darkGray,
        fontSize: 14,
        fontFamily: "PoppinsLight",
    },
    tipVideoOwnerButtonContainer: {
        width: "39%",
        justifyContent: "center",
        alignItems: "center",
    },
    tipVideoOwnerButtonImage: {
        width: "100%",
        height: 42,
        resizeMode: "contain",
    },

    //video reaction section
    videoOwnerReactionContainer: {
        width: "100%",
        marginTop: 15,
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    videoOwnerReactionContent: {
        width: "30%",
        height: 35,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 25,
        borderWidth: 0.2,
        borderColor: COLORS.darkGray,
        backgroundColor: COLORS.reechGray,
    },
    videoOwnerReactionTextItem: {
        color: COLORS.white,
        fontSize: 14,
        fontFamily: "PoppinsLight",
    },

    //video comment action section
    videoCommentCountContainer: {
        width: "100%",
        marginTop: 15,
        paddingHorizontal: 10,
        flexDirection: "column",
    },
    videoCommentTotalCountContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    videoCommentTotalCountItem: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsBold",
    },
    videoAddCommentContainer: {
        width: "100%",
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    loggedCommenterImageContainer: {
        width: "20%",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    loggedCommenterBackgroundImageContainer: {
        width: 60,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
    },
    loggedCommentImageItem: {
        width: 52,
        height: 52,
        resizeMode: "cover",
        borderRadius: 6,
    },
    commentSubmitContainer: {
        width: Platform.OS === "ios" ? "80%" : "78%",
        justifyContent: "center",
        alignItems: "center",
    },
    videoAddCommentButtonContainer: {
        width: "100%",
        marginTop: 20,
    },
    videoAddCommentGradientContainer: {
        height: 45,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30,
    },
    videoAddCommentTextItem: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: "PoppinsLight",
    },
    reechModalSeparator: {
        width: "100%",
        marginVertical: 12,
        alignSelf: "center",
        borderBottomColor: COLORS.darkGray,
        borderBottomWidth: StyleSheet.hairlineWidth * 3,
    },

    //scrolling comment list section
    scrollingCommentListContainer: {
        maxHeight: "32%",
        flexDirection: "column",
    },
    scrollingInnerCommentContent: {
        flexDirection: "column",
    },
    addedCommentListItemContainer: {
        flexDirection: "row",
        marginVertical: 10,
    },
    commenterImageContainer: {
        width: "20%",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    commentImageBackgroundContainer: {
        width: 55,
        height: 55,
        justifyContent: "center",
        alignItems: "center",
    },
    commentImageItem: {
        width: 47,
        height: 47,
        resizeMode: "cover",
        borderRadius: 5,
    },
    commenterTextItemContainer: {
        width: "78%",
        flexDirection: "column",
    },
    commenterNameTextContainer: {
        width: "100%",
        marginBottom: 2.5,
    },
    commenterNameTextItem: {
        color: COLORS.white,
        fontSize: 14,
        fontFamily: "PoppinsBold",
    },
    commenterCommentTextContainer: {
        width: "100%",
        marginBottom: 5,
    },
    commenterCommentTextItem: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsLight",
    },
    commenterTimestampContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    commenterTimestampTextItem: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsLight",
    },

    //report pop-up modal
    reportModalContainer: {
        marginTop: 10,
    },
    reportInnerModalContainer: {
        marginTop: Platform.OS === "ios" ? "134%" : "125%",
        padding: "4%",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: "hidden",
        backgroundColor: COLORS.black,
    },
    reportInnerModalContent: {
        flexDirection: "column",
        alignItems: "flex-end",
    },
    reportModalOptionContent: {
        left: Platform.OS === "ios" ? 18 : 30,
        flexDirection: "column",
    },
    reportModalOptionContainer: {
        top: 30,
        marginBottom: 25,
        flexDirection: "row",
    },
    reportModalOptionIconContainer: {
        width: "15%",
        justifyContent: "center",
        alignItems: "center",
    },
    reportModalOptionIconItem: {
        height: 25,
        width: 25,
    },
    reportModalOptionTextContainer: {
        left: Platform.OS === "ios" ? 20 : 20,
        width: "65%",
        flexDirection: "column",
    },
    reportModalOptionHeaderText: {
        color: COLORS.white,
        fontSize: 14,
        fontFamily: "PoppinsBold",
    },
    reportModalOptionInfoText: {
        marginTop: 3,
        opacity: 0.8,
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsLight",
    },
});

export default HowToVideoMoreInfoScreen;