import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    Platform,
    Image,
    ScrollView,
    ActivityIndicator,
    Modal,
    ImageBackground,
    TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons, FontAwesome, FontAwesome5, Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import { usePostCommentMutation } from "@/redux/api/comment";
import { useReadThoughtDetailsQuery } from "@/redux/api/thought";
import { useSelector } from "react-redux";
import moment from "moment";
import io from "socket.io-client";

//customs
import { COLORS, images, icons } from "../../constants";
import NavHeader from "../../components/Headers/NavHeader";
import { CustomInput } from "../../components";

//track database changes
const SOCKET_SERVER_URL = "https://reech-node-api-7o3szyfdpq-uc.a.run.app/";
//`${process.env.REACT_APP_API_URL}${process.env.MAIN_API_BASE_PATH}/`

const ThoughtMoreUserInfoScreen = ({ route }) => {
    const { control, handleSubmit, setValue } = useForm();
    const navigation = useNavigation();
    const { item: itm } = route.params;

    const current_user = useSelector((state) => state.user.current_user);

    //state handlers
    const [isAppreciated, setIsAppreciated] = useState(false);
    const [following, setFollowing] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [modalSeeMore, setModalSeeMore] = useState(false);
    const [reportModal, setReportModal] = useState(false);
    const [shareModal, setShareModal] = useState(false);
    const [expandedComments, setExpandedComments] = useState([]);
    const [item, setItem] = useState(itm)

    const [postCommentFn, { isLoading }] = usePostCommentMutation()
    const { data: read_post, refetch } = useReadThoughtDetailsQuery(itm?._id)

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
            commentAbout: "Thought",
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

    const formattedTotalThoughtCount =
        item?.totalThoughts >= 1000
            ? `${(item?.totalThoughts / 1000).toFixed(1)}K`
            : item?.totalThoughts ?? 1;

    const formattedAppreciationCount =
        item?.ThoughtLikeArray?.length >= 1000
            ? `${(item?.ThoughtLikeArray?.length / 1000).toFixed(1)}K`
            : item?.ThoughtLikeArray?.length;

    const formattedTotalCommentCount =
        item?.userComments?.length >= 1000
            ? `${(item?.userComments?.length / 1000).toFixed(1)}` + "k"
            : item?.userComments?.length ?? 0;

    //individual comment toggler
    const toggleCommentExpansion = (index) => {
        const newExpandedComments = [...expandedComments];
        newExpandedComments[index] = !newExpandedComments[index];
        setExpandedComments(newExpandedComments);
    };

    //header section
    function renderHeaderComponentSection() {
        return (
            <View style={styles.thoughtMoreHeaderContainer}>
                <NavHeader message={"What would you like to do?"} />
            </View>
        )
    }

    //thought to user section
    function renderThoughtUserTopSection() {
        return (
            <View style={styles.thoughtModalInfoSectionContainer}>
                {/*owner picture section*/}
                <TouchableOpacity
                    onPress={() => {
                        if (item?.userId?._id === current_user?._id)
                            navigation.navigate("LoggedInAccountUserScreen");
                        else
                            navigation.navigate("AccountFullViewScreen", {
                                userId: item?.userId?._id,
                            });
                    }} style={styles.thoughtOwnerImageContainer}>
                    <ImageBackground
                        source={images.userFrame}
                        style={styles.thoughtOwnerBackgroundImage}
                    >
                        <Image
                            source={{ uri: item?.userId?.profileImage }}
                            style={styles.thoughtOwnerImageItem}
                        />
                    </ImageBackground>
                </TouchableOpacity>

                {/*owner details and action section*/}
                <View style={styles.thoughtOwnerTextInfoContainer}>
                    {/*owner name section*/}
                    <View style={styles.thoughtOwnerTextNameContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                if (item?.userId?._id === current_user?._id)
                                    navigation.navigate("LoggedInAccountUserScreen");
                                else
                                    navigation.navigate("AccountFullViewScreen", {
                                        userId: item?.userId?._id,
                                    });
                            }}
                            style={styles.thoughtOwnerTextNameContent}
                        >
                            <Text numberOfLines={1} style={styles.thoughtOwnerNameItem}>
                                {item?.userId?.firstName} {item?.userId?.lastName}
                            </Text>
                        </TouchableOpacity>

                        {item?.userId?._id === current_user?._id ? null : <TouchableOpacity
                            onPress={() => setReportModal(true)}
                            style={styles.thoughtOwnerReportModalIconContent}
                        >
                            <Feather name="more-vertical" size={20} color={COLORS.white} />
                        </TouchableOpacity>}
                    </View>

                    {/*owner profile section*/}
                    <Text
                        numberOfLines={1}
                        style={styles.thoughtOwnerProfileNameItem}
                    >
                        {item?.profileId?.jobTitleId?.jobTitle}
                    </Text>

                    {/*owner blurb section*/}
                    <Text numberOfLines={2} style={styles.thoughtOwnerBlurbItem}>
                        {item?.userId?.blurb}
                    </Text>

                    {/*owner action section*/}
                    <View style={styles.thoughtOwnerActionContainer}>
                        {/*follow action section*/}
                        <Text
                            onPress={() => setFollowing(!following)}
                            style={styles.followThoughtOwnerTextItem}
                        >
                            {following ? "Unfollow" : "Follow"}
                        </Text>

                        {/*thought count section*/}
                        <Text style={styles.totalOwnerThoughtTextItem}>
                            {formattedTotalThoughtCount} thoughts posted
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    //thought description section
    function renderThoughtDescriptionSection() {
        return (
            <View style={styles.thoughtOwnerDescriptionContainer}>
                {/*thought name section*/}
                <Text style={styles.thoughtTypeTextItem}>
                    {item?.thoughtType == "Cited" ? "Cited" : "Original"}
                </Text>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.thoughtOwnerDescriptionTextContainer}
                >
                    <Text
                        onPress={() => setModalSeeMore(!modalSeeMore)}
                        numberOfLines={modalSeeMore ? 100 : 4}
                        style={styles.thoughtOwnerDescriptionTextItem}
                    >
                        {item?.description}
                    </Text>

                    {/*see more toggler*/}
                    {item?.description?.length > 250 && <TouchableOpacity
                        onPress={() => setModalSeeMore(!modalSeeMore)}
                        style={styles.seeMoreTogglerContainer}
                    >
                        <Text style={styles.seeMoreTogglerItem}>
                            {!modalSeeMore ? "...see more" : "...hide"}
                        </Text>
                    </TouchableOpacity>}
                </ScrollView>
            </View>
        )
    }

    //thought channel section
    function renderThoughtChannelSection() {
        return (
            <View style={styles.thoughtOwnerModalChannelContainer}>
                {/*channel section*/}
                <View style={styles.thoughtOwnerModalChannelContent}>
                    {/*sub channel image section*/}
                    <View style={styles.thoughtChannelImageContainer}>
                        <Image
                            source={icons.arrowIcon}
                            style={styles.thoughtChannelImageItem}
                        />
                    </View>

                    {/*sub channel section*/}
                    <View style={styles.thoughtOwnerTextItemContainer}>
                        <Text style={styles.thoughtOwnerTextItemItem}>
                            {item?.channelId?.channel} Channel
                        </Text>
                    </View>
                </View>

                {/*tip button section*/}
                {item?.thoughtType == "Cited" ? null : (
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("TipCreatorScreen", {
                                profilePicture: item?.userId?.profileImage,
                                title: item?.userId?.firstName + " " + item?.userId?.lastName,
                                profileName: item?.profileId?.jobTitleId?.jobTitle,
                                video: item?.fileLink,
                                thoughtType: item?.thoughtType,
                                item: item,
                            })
                        }}
                        style={styles.tipThoughtOwnerButtonContainer}
                    >
                        <Image
                            source={images.tipButton}
                            style={styles.tipThoughtOwnerButtonImage}
                        />
                    </TouchableOpacity>
                )}
            </View>
        )
    }

    //thought action section
    function renderThoughtActionSection() {
        return (
            <View style={styles.thoughtOwnerReactionContainer}>
                {/*thought appreciate section*/}
                <TouchableOpacity
                    onPress={() => setIsAppreciated(!isAppreciated)}
                    style={styles.thoughtOwnerReactionContent}
                >
                    <Text style={styles.thoughtOwnerReactionTextItem}>
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

                {/*thought share section*/}
                <TouchableOpacity
                    onPress={() => setShareModal(!shareModal)}
                    style={styles.thoughtOwnerReactionContent}
                >
                    <Text style={styles.thoughtOwnerReactionTextItem}>
                        {shareModal ? "Shared" : "Share"}
                        {"  "}
                        <FontAwesome
                            name="share-square-o"
                            size={16}
                            color={COLORS.white}
                        />
                    </Text>
                </TouchableOpacity>

                {/*thought save section*/}
                <TouchableOpacity
                    onPress={() => setIsSaved(!isSaved)}
                    style={styles.thoughtOwnerReactionContent}
                >
                    <Text style={styles.thoughtOwnerReactionTextItem}>
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

    //thought comment entry section
    function renderThoughtCommentEntrySection() {
        return (
            <View style={styles.thoughtCommentCountContainer}>
                {/*total comment count section*/}
                <View style={styles.thoughtCommentTotalCountContainer}>
                    <Text style={styles.thoughtCommentTotalCountItem}>
                        {formattedTotalCommentCount} comment{formattedTotalCommentCount == 1 ? "" : "s"}
                    </Text>
                </View>

                {/*add a comment section*/}
                <View style={styles.thoughtAddCommentContainer}>
                    {/*logged in user picture section*/}
                    <TouchableOpacity
                        onPress={() => navigation.navigate("LoggedInAccountUserScreen")}
                        style={styles.thoughtLoggedCommenterImageContainer}
                    >
                        <ImageBackground
                            source={images.userFrame}
                            style={styles.thoughtLoggedCommenterBackgroundImageContainer}
                        >
                            <Image
                                source={{ uri: current_user?.profileImage }}
                                style={styles.thoughtLoggedCommentImageItem}
                            />
                        </ImageBackground>
                    </TouchableOpacity>

                    {/*comment submit section*/}
                    <View style={styles.thoughtCommentSubmitContainer}>
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
                    style={styles.thoughtAddCommentButtonContainer}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
                        style={styles.thoughtAddCommentGradientContainer}
                    >
                        {isLoading ?
                            <ActivityIndicator size={'small'} color={"#fff"} />
                            :
                            <Text style={styles.thoughtAddCommentTextItem}>
                                <FontAwesome name="send" size={16} color={COLORS.white} />
                                {"  "}Comment
                            </Text>}
                    </LinearGradient>
                </TouchableOpacity>
                <View style={styles.reechThoughtModalSeparator} />
            </View>
        )
    }

    //thought comment list section
    function renderThoughtCommentListSection() {
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scrollingThoughtCommentListContainer}
            >
                <View style={styles.scrollingThoughtInnerCommentContent}>
                    {/*comment items section*/}
                    {item?.commentIds?.map((commentList, i) => (
                        <View
                            key={i}
                            style={styles.addedThoughtCommentListItemContainer}
                        >
                            {/*commenter image section*/}
                            <View style={styles.commenterThoughtImageContainer}>
                                <ImageBackground
                                    source={images.userFrame}
                                    style={styles.commentThoughtImageBackgroundContainer}
                                >
                                    <Image
                                        source={{ uri: commentList?.userId?.profileImage }}
                                        style={styles.commentThoughtImageItem}
                                    />
                                </ImageBackground>
                            </View>

                            {/*commenter text content section*/}
                            <View style={styles.commenterThoughtTextItemContainer}>
                                {/*commenter name*/}
                                <View style={styles.commenterThoughtNameTextContainer}>
                                    <Text
                                        numberOfLines={1}
                                        style={styles.commenterThoughtNameTextItem}
                                    >
                                        {commentList?.userId?.firstName} {commentList?.userId?.lastName}
                                    </Text>
                                </View>

                                {/*commenter description*/}
                                <TouchableOpacity
                                    onPress={() => toggleCommentExpansion(i)}
                                    style={styles.commenterThoughtCommentTextContainer}
                                >
                                    <Text
                                        numberOfLines={expandedComments[i] ? 50 : 3}
                                        style={styles.commenterThoughtCommentTextItem}
                                    >
                                        {commentList?.message}
                                    </Text>
                                </TouchableOpacity>

                                {/*commenter timestamp*/}
                                <View style={styles.commenterThoughtTimestampContainer}>
                                    <Text style={styles.commenterThoughtTimestampTextItem}>
                                    {moment(commentList?.createdAt).startOf('m').fromNow()}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        )
    }

    function renderThoughtReportModal() {
        return (
            <Modal
                visible={reportModal}
                statusBarTranslucent={true}
                animationType="slide"
                transparent={true}
                style={styles.reportThoughtModalContainer}
            >
                <View style={styles.reportThoughtInnerModalContainer}>
                    {/*modal close action section*/}
                    <View style={styles.reportThoughtInnerModalContent}>
                        <TouchableOpacity onPress={() => setReportModal(false)}>
                            <Ionicons name="close" size={18} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>

                    {/*more modal option section */}
                    <View style={styles.reportThoughtModalOptionContent}>
                        {/*prior option*/}
                        <TouchableOpacity
                            onPress={() => onPrioritiesPressed()}
                            style={styles.reportThoughtModalOptionContainer}
                        >
                            {/*icon section*/}
                            <View style={styles.reportThoughtModalOptionIconContainer}>
                                <Image
                                    source={icons.noHeart}
                                    style={styles.reportThoughtModalOptionIconItem}
                                />
                            </View>

                            {/*modal option text section*/}
                            <View style={styles.reportThoughtModalOptionTextContainer}>
                                <Text style={styles.reportThoughtModalOptionHeaderText}>
                                    Prioritise
                                </Text>
                                <Text style={styles.reportThoughtModalOptionInfoText}>
                                    See more from {item?.userId?.firstName} {item?.userId?.lastName}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/*mute option*/}
                        <TouchableOpacity
                            onPress={() => onMutePressed()}
                            style={styles.reportThoughtModalOptionContainer}
                        >
                            {/*icon section*/}
                            <View style={styles.reportThoughtModalOptionIconContainer}>
                                <Image
                                    source={icons.noSound}
                                    style={styles.reportThoughtModalOptionIconItem}
                                />
                            </View>

                            {/*modal option text section*/}
                            <View style={styles.reportThoughtModalOptionTextContainer}>
                                <Text style={styles.reportThoughtModalOptionHeaderText}>
                                    Mute
                                </Text>
                                <Text style={styles.reportThoughtModalOptionInfoText}>
                                    Take a from {item?.userId?.firstName} {item?.userId?.lastName}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/*remove option*/}
                        <TouchableOpacity
                            onPress={() => onRemovePressed()}
                            style={styles.reportThoughtModalOptionContainer}
                        >
                            {/*icon section*/}
                            <View style={styles.reportThoughtModalOptionIconContainer}>
                                <Image
                                    source={icons.noUser}
                                    style={styles.reportThoughtModalOptionIconItem}
                                />
                            </View>

                            {/*modal option text section*/}
                            <View style={styles.reportThoughtModalOptionTextContainer}>
                                <Text style={styles.reportThoughtModalOptionHeaderText}>
                                    Remove
                                </Text>
                                <Text style={styles.reportThoughtModalOptionInfoText}>
                                    Remove {item?.userId?.firstName} {item?.userId?.lastName}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/*report option*/}
                        <TouchableOpacity
                            onPress={() => onReportPressed()}
                            style={styles.reportThoughtModalOptionContainer}
                        >
                            {/*icon section*/}
                            <View style={styles.reportThoughtModalOptionIconContainer}>
                                <Image
                                    source={icons.noHeart}
                                    style={styles.reportThoughtModalOptionIconItem}
                                />
                            </View>

                            {/*modal option text section*/}
                            <View style={styles.reportThoughtModalOptionTextContainer}>
                                <Text style={styles.reportThoughtModalOptionHeaderText}>
                                    Report
                                </Text>
                                <Text style={styles.reportThoughtModalOptionInfoText}>
                                    {`Do you want to hide ${item?.userId?.firstName}'s thoughts?`}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }

    //screen content list
    function renderScreenContentSection() {
        return (
            <>
                {renderHeaderComponentSection()}
                {renderThoughtUserTopSection()}
                {renderThoughtDescriptionSection()}
                {renderThoughtChannelSection()}
                {renderThoughtActionSection()}
                {renderThoughtCommentEntrySection()}
                {renderThoughtCommentListSection()}
                {renderThoughtReportModal()}
            </>
        )
    }

    return (
        <View style={styles.thoughtMoreMainContainer}>
            {renderScreenContentSection()}
        </View>
    )
}

const styles = StyleSheet.create({
    thoughtMoreMainContainer: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    thoughtMoreHeaderContainer: {
        marginTop: Platform.OS === "ios" ? "10%" : 0,
    },

    //thought modal info section
    thoughtModalInfoSectionContainer: {
        width: "100%",
        marginTop: 20,
        paddingHorizontal: 15,
        flexDirection: "row",
    },
    thoughtOwnerImageContainer: {
        width: "20%",
        justifyContent: "center",
        alignItems: "center",
    },
    thoughtOwnerBackgroundImage: {
        width: 90,
        height: 90,
        justifyContent: "center",
        alignItems: "center",
    },
    thoughtOwnerImageItem: {
        width: 80,
        height: 80,
        resizeMode: "cover",
        borderRadius: 8,
    },
    thoughtOwnerTextInfoContainer: {
        width: "75%",
        marginLeft: Platform.OS === "ios" ? 20 : 30,
        flexDirection: "column",
    },
    thoughtOwnerTextNameContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    thoughtOwnerTextNameContent: {
        width: "95%",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    thoughtOwnerReportModalIconContent: {
        width: "5%",
        justifyContent: "center",
        alignItems: "flex-end",
    },
    thoughtOwnerNameItem: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: "PoppinsBold",
    },
    thoughtOwnerProfileNameItem: {
        color: COLORS.white,
        fontSize: 14,
        fontFamily: "PoppinsLight",
        textTransform: "capitalize",
        marginVertical: 2.5,
    },
    thoughtOwnerBlurbItem: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsLight",
    },
    thoughtOwnerActionContainer: {
        marginTop: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    followThoughtOwnerTextItem: {
        color: COLORS.purple,
        fontSize: 12,
        fontFamily: "PoppinsBold",
    },
    totalOwnerThoughtTextItem: {
        color: COLORS.darkGray,
        fontSize: 12,
        fontFamily: "PoppinsLight",
    },

    //thought modal description section
    thoughtOwnerDescriptionContainer: {
        width: "100%",
        marginTop: 15,
        paddingHorizontal: Platform.OS === "ios" ? 8 : 0,
        flexDirection: "column",
    },
    thoughtOwnerDescriptionTextContainer: {
        minHeight: 50,
    },
    thoughtTypeTextItem: {
        color: COLORS.darkGray,
        fontSize: 16,
        fontFamily: "PoppinsLight",
        marginBottom: 5,
    },
    thoughtOwnerDescriptionTextItem: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsLight",
    },
    seeMoreTogglerContainer: {
        marginTop: 5,
        justifyContent: "center",
        alignItems: "flex-end",
    },
    seeMoreTogglerItem: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsBold",
        opacity: 0.5,
    },

    //thought modal channel section
    thoughtOwnerModalChannelContainer: {
        width: "100%",
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    thoughtOwnerModalChannelContent: {
        width: "60%",
        flexDirection: "row",
        justifyContent: "center",
    },
    thoughtChannelImageContainer: {
        width: "20%",
        justifyContent: "center",
        alignItems: "center",
    },
    thoughtChannelImageItem: {
        width: 30,
        height: 30,
        resizeMode: "cover",
    },
    thoughtOwnerTextItemContainer: {
        width: "80%",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    thoughtOwnerTextItemItem: {
        color: COLORS.darkGray,
        fontSize: 14,
        fontFamily: "PoppinsLight",
    },
    tipThoughtOwnerButtonContainer: {
        width: "39%",
        justifyContent: "center",
        alignItems: "center",
    },
    tipThoughtOwnerButtonImage: {
        width: "100%",
        height: 42,
        resizeMode: "contain",
    },

    //thought modal reaction section
    thoughtOwnerReactionContainer: {
        width: "100%",
        marginTop: 15,
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    thoughtOwnerReactionContent: {
        width: "30%",
        height: 35,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 25,
        borderWidth: 0.2,
        borderColor: COLORS.darkGray,
        backgroundColor: COLORS.reechGray,
    },
    thoughtOwnerReactionTextItem: {
        color: COLORS.white,
        fontSize: 14,
        fontFamily: "PoppinsLight",
    },

    //thought comment action section
    thoughtCommentCountContainer: {
        width: "100%",
        marginTop: 15,
        paddingHorizontal: 10,
        flexDirection: "column",
    },
    thoughtCommentTotalCountContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    thoughtCommentTotalCountItem: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsBold",
    },
    thoughtAddCommentContainer: {
        width: "100%",
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    thoughtLoggedCommenterImageContainer: {
        width: "20%",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    thoughtLoggedCommenterBackgroundImageContainer: {
        width: 60,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
    },
    thoughtLoggedCommentImageItem: {
        width: 50,
        height: 50,
        resizeMode: "cover",
        borderRadius: 5,
    },
    thoughtCommentSubmitContainer: {
        width: Platform.OS === "ios" ? "80%" : "78%",
        justifyContent: "center",
        alignItems: "center",
    },
    thoughtAddCommentButtonContainer: {
        width: "100%",
        marginTop: 20,
    },
    thoughtAddCommentGradientContainer: {
        height: 45,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30,
    },
    thoughtAddCommentTextItem: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: "PoppinsLight",
    },
    reechThoughtModalSeparator: {
        width: "100%",
        marginVertical: 15,
        borderColor: COLORS.darkGray,
        borderWidth: StyleSheet.hairlineWidth * 1,
    },

    //scrolling thought comment list section
    scrollingThoughtCommentListContainer: {
        maxHeight: "32%",
        flexDirection: "column",
    },
    scrollingThoughtInnerCommentContent: {
        flexDirection: "column",
    },
    addedThoughtCommentListItemContainer: {
        flexDirection: "row",
        marginVertical: 10,
    },
    commenterThoughtImageContainer: {
        width: "20%",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    commentThoughtImageBackgroundContainer: {
        width: 55,
        height: 55,
        justifyContent: "center",
        alignItems: "center",
    },
    commentThoughtImageItem: {
        width: 47,
        height: 47,
        resizeMode: "cover",
        borderRadius: 5,
    },
    commenterThoughtTextItemContainer: {
        width: "78%",
        flexDirection: "column",
    },
    commenterThoughtNameTextContainer: {
        width: "100%",
        marginBottom: 2.5,
    },
    commenterThoughtNameTextItem: {
        color: COLORS.white,
        fontSize: 14,
        fontFamily: "PoppinsBold",
    },
    commenterThoughtCommentTextContainer: {
        width: "100%",
        marginBottom: 5,
    },
    commenterThoughtCommentTextItem: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsLight",
    },
    commenterThoughtTimestampContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    commenterThoughtTimestampTextItem: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsLight",
    },


    //report thought pop-up modal
    reportThoughtModalContainer: {
        marginTop: 10,
    },
    reportThoughtInnerModalContainer: {
        marginTop: Platform.OS === "ios" ? "134%" : "125%",
        padding: "4%",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: "hidden",
        backgroundColor: COLORS.black,
    },
    reportThoughtInnerModalContent: {
        flexDirection: "column",
        alignItems: "flex-end",
    },
    reportThoughtModalOptionContent: {
        left: Platform.OS === "ios" ? 18 : 30,
        flexDirection: "column",
    },
    reportThoughtModalOptionContainer: {
        top: 30,
        marginBottom: 25,
        flexDirection: "row",
    },
    reportThoughtModalOptionIconContainer: {
        width: "15%",
        justifyContent: "center",
        alignItems: "center",
    },
    reportThoughtModalOptionIconItem: {
        height: 25,
        width: 25,
    },
    reportThoughtModalOptionTextContainer: {
        left: Platform.OS === "ios" ? 20 : 20,
        width: "65%",
        flexDirection: "column",
    },
    reportThoughtModalOptionHeaderText: {
        color: COLORS.white,
        fontSize: 14,
        fontFamily: "PoppinsBold",
    },
    reportThoughtModalOptionInfoText: {
        marginTop: 3,
        opacity: 0.8,
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsLight",
    },
});

export default ThoughtMoreUserInfoScreen

