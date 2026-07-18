import React, { useRef, useState } from 'react'
import { Image, ImageBackground, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useForm } from "react-hook-form";
import { FontAwesome } from "@expo/vector-icons";
import StarRating from 'react-native-star-rating-widget';
import { LinearGradient } from 'expo-linear-gradient';

//customs
import { COLORS, images, videos } from "../../constants";
import NavHeader from "@/components/Headers/NavHeader";
import { CustomInput } from '@/components/index';

const TutorialFullViewScreen = ({ route }) => {
    const item = route.params.item;

    const { control, handleSubmit } = useForm();

    //state handlers
    const video = useRef(null);
    
    const [status, setStatus] = useState({});
    
    const [rating, setRating] = useState(0);
    const [selectedItem, setSelectedItem] = useState(null);

    const submitReview = (data) => {
        console.log("add user review to below list", data);
    }

    //header section
    function renderHeaderSection() {
        return (
            <View style={styles.headerTutorialComponentContainer}>
                <NavHeader message="What would you like to do?" />
            </View>
        )
    }

    //video player
    function renderVideoPlayerSection() {
        return (
            <View style={styles.videoPlayerContainer}>
                <Video
                    ref={video}
                    isLooping={true}
                    useNativeControls
                    style={styles.videoPlayerItem}
                    source={{ uri: videos.v2 }}
                    resizeMode={ResizeMode.STRETCH}
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
            </View>
        )
    }

    //video description 
    function renderVideoDescriptionSection() {
        return (
            <View style={styles.videoTitleContainer}>
                {/*video title item section*/}
                <View style={styles.videoTitleContentContainer}>
                    {/*video title section*/}
                    <View style={styles.videoTitleTextContainer}>
                        <StarRating
                            rating={item.videoRate}
                            onChange={setRating}
                            maxStars={5}
                            starSize={12}
                            color={COLORS.purple}
                            delay={100}
                            style={{ left: -6 }}
                            starStyle={{ paddingHorizontal: 1 }}
                        />
                        <Text style={styles.videoTitleTextItem}>{item.videoTitle}</Text>
                    </View>

                    {/*video rating section*/}
                    <View style={styles.videoIconRatingContainer}>
                        {/*like icon item*/}
                        <TouchableOpacity onPress={() => console.log("like pressed")} style={styles.videoIconLikeRatingContent}>
                            <Text style={styles.videoIconLikeRatingTextItem}>{item.videoLikes}</Text>
                            <FontAwesome name="thumbs-o-up" size={14} color={COLORS.white} />
                        </TouchableOpacity>

                        {/*dislike icon item*/}
                        <TouchableOpacity onPress={() => console.log("dislike pressed")} style={styles.videoIconDislikeRatingContent}>
                            <Text style={styles.videoIconLikeRatingTextItem}>{item.videoDislikes}</Text>
                            <FontAwesome name="thumbs-o-down" size={14} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/*video description item section*/}
                <View style={styles.videoDescriptionContainer}>
                    <Text style={styles.videoDescriptionTextItem}>{item.videoDescription}</Text>
                </View>
            </View>
        )
    }

    //add review section
    function renderAddReviewSection() {
        return (
            <View style={styles.addReviewContainer}>
                {/*add review text*/}
                <View style={styles.addReviewTextTypingContainer}>
                    <CustomInput
                        name="reviewMessage"
                        control={control}
                        placeholder="Write a review..."
                        rules={{ required: "Please add a review" }}
                    />
                </View>

                {/*add review button*/}
                <TouchableOpacity
                    onPress={handleSubmit(submitReview)}
                    style={styles.addReviewButtonContainer}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
                        style={styles.addReviewButtonGradientContainer}
                    >
                        <Text style={styles.addReviewButtonTextItem}>Add review</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        )
    }

    //video instructor
    function renderVideoInstructorSection() {
        return (
            <>
                {item.videoInstructor.map((video, i) => (
                    <View key={i} style={styles.videoInstructorContainer}>
                        {/*instructor image*/}
                        <View style={styles.videoInstructorImageContainer}>
                            <ImageBackground source={images.userFrame} style={styles.videoInstructorImageBackgroundContainer}>
                                <Image source={{ uri: video.instructorImage }} style={styles.videoInstructorImageItem} />
                            </ImageBackground>
                        </View>

                        {/*instructor video info*/}
                        <View style={styles.videoInstructorInfoContainer}>
                            <Text style={styles.videoInstructorInfoRatingText}>Video rating: {item.videoRate}</Text>
                            <Text style={styles.videoInstructorInfoNameText}>{video.instructorName}</Text>
                            <Text style={styles.videoInstructorInfoRatingText}>{video.instructorPosition}</Text>
                        </View>
                    </View>
                ))}
            </>
        )
    }

    //video review section
    function renderVideoReviewSection() {
        return (
            <View style={styles.videoReviewContainer}>
                {/*review title section*/}
                <View style={styles.videoReviewTitleContainer}>
                    <Text style={styles.videoReviewTitleTextItem}>Reviews</Text>
                </View>

                {/*review people section*/}
                {item.videoReview && item.videoReview.length > 0 ? (<ScrollView showsVerticalScrollIndicator={false} style={styles.videoReviewPeopleContainer}>
                    {item.videoReview.map((review, i) => (
                        <View key={i} style={styles.videoReviewContentContainer}>
                            {/*review person picture*/}
                            <View style={styles.videoReviewPersonPictureContainer}>
                                <ImageBackground
                                    source={images.userFrame}
                                    style={styles.videoReviewPersonPictureContentContainer}>
                                    <Image
                                        source={{ uri: review.reviewUserPicture }}
                                        style={styles.videoReviewPersonPictureImageItem}
                                    />
                                </ImageBackground>
                            </View>

                            {/*review person details*/}
                            <View style={styles.videoReviewPersonDetailsContainer}>
                                {/*person name*/}
                                <View style={styles.videoReviewPersonNameContainer}>
                                    {/*person name and bubble mate add*/}
                                    <View style={styles.videoReviewPersonNameContentContainer}>
                                        {/*name item*/}
                                        <View style={styles.videoReviewPersonNameContentsContainer}>
                                            <Text
                                                numberOfLines={1}
                                                style={styles.videoReviewPersonNameTextItem}
                                            >
                                                {review.reviewUserName}
                                            </Text>
                                        </View>

                                        {/*bubble mate add item*/}
                                        <TouchableOpacity onPress={() => console.log("send user bubble request")} style={styles.videoReviewPersonBubbleContentsContainer}>
                                            <Text
                                                style={[styles.videoReviewPersonBubbleTextItem, { color: review.bubbleMate ? COLORS.darkGray : COLORS.purple }]}
                                            >
                                                {review.bubbleMate ? "Bubble mate" : "Add to bubble"}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/*person profile item*/}
                                    <Text
                                        style={styles.videoReviewPersonProfileTextItem}>
                                        {review.reviewUserProfileName}
                                    </Text>
                                </View>

                                {/*person review*/}
                                <TouchableOpacity
                                    onPress={() => setSelectedItem(i === selectedItem ? null : i)}
                                    style={styles.videoReviewPersonContentContainer}
                                >
                                    <Text numberOfLines={i === selectedItem ? undefined : 3} style={styles.videoReviewPersonContentTextItem}>
                                        {review.reviewMessage}
                                    </Text>
                                </TouchableOpacity>

                                {/*person timestamp*/}
                                <View style={styles.videoReviewPersonTimestampContainer}>
                                    <Text style={styles.videoReviewPersonTimestampTextItem}>{review.reviewTimestamp}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
                ) : (
                    <View style={styles.videoReviewPeopleEmptyContainer}>
                        <Text style={styles.videoReviewPeopleEmptyTextItem}>No Reviews Add</Text>
                        <Text style={styles.videoReviewPeopleEmptySmallTextItem}>Be the first to add a new review</Text>
                    </View>
                )}
            </View>
        )
    }

    //tutorial content section
    function renderScreenContentList() {
        return (
            <>
                {renderHeaderSection()}
                {renderVideoPlayerSection()}
                {renderVideoDescriptionSection()}
                {renderVideoInstructorSection()}
                {renderAddReviewSection()}
                {renderVideoReviewSection()}
            </>
        )
    }

    return (
        <View style={styles.tutorialFullContainer}>
            {renderScreenContentList()}
        </View>
    )
}

const styles = StyleSheet.create({
    tutorialFullContainer: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    headerTutorialComponentContainer: {
        marginTop: Platform.OS === "ios" ? "10%" : "0%",
        zIndex: 1,
    },

    //video player section
    videoPlayerContainer: {
        marginTop: Platform.OS === "ios" ? -80 : -30,
        aspectRatio: 1 / 0.5,
        backgroundColor: COLORS.black,
    },
    videoPlayerItem: {
        width: Platform.OS === "ios" ? "73%" : "85%",
        height: Platform.OS === "ios" ? 300 : 220,
        backgroundColor: COLORS.black
    },

    //video description
    videoTitleContainer: {
        marginTop: Platform.OS === "ios" ? 20 : 20,
        justifyContent: "center",
        alignItems: "flex-start",
        paddingHorizontal: 15,
    },
    videoTitleContentContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    videoTitleTextContainer: {
        width: "70%",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    videoTitleTextItem: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: "PoppinsBold",
    },
    videoIconRatingContainer: {
        width: "30%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    videoIconLikeRatingContent: {
        width: "45%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    videoIconLikeRatingTextItem: {
        marginTop: 5,
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsLight",
        right: 10,
    },
    videoIconDislikeRatingContent: {
        width: "45%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    videoDescriptionContainer: {
        marginTop: 10,
        marginBottom: 20,
    },
    videoDescriptionTextItem: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsLight",
    },

    //add review section
    addReviewContainer: {
        width: "100%",
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    addReviewTextTypingContainer: {
        width: "70%",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    addReviewButtonContainer: {
        top: 5,
        width: "25%",
        justifyContent: "center",
        alignItems: "flex-end",
    },
    addReviewButtonGradientContainer: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30,
        height: 40,
        width: "100%",
    },
    addReviewButtonTextItem: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsLight",
    },

    //video instructor section
    videoInstructorContainer: {
        width: "100%",
        flexDirection: "row",
        paddingHorizontal: 15,
    },
    videoInstructorImageContainer: {
        width: "20%",
        justifyContent: "center",
        alignItems: "flex-start",
        marginRight: Platform.OS === "ios" ? 0 : 10,
    },
    videoInstructorImageBackgroundContainer: {
        width: 68,
        height: 68,
        justifyContent: "center",
        alignItems: "center",
    },
    videoInstructorImageItem: {
        width: 60,
        height: 60,
        resizeMode: "cover",
        borderRadius: 6,
    },
    videoInstructorInfoContainer: {
        width: "65%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    videoInstructorInfoRatingText: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsLight"
    },
    videoInstructorInfoNameText: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsBold"
    },

    //video review section
    videoReviewContainer: {
        width: "100%",
        marginTop: 10,
        paddingHorizontal: 15,
        flexDirection: "column",
    },
    videoReviewTitleContainer: {
        flexDirection: "column",
        marginBottom: Platform.OS === "ios" ? 10 : 5,
    },
    videoReviewTitleTextItem: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: "PoppinsBold"
    },
    videoReviewPeopleContainer: {
        height: Platform.OS === "ios" ? 280 : 180,
        marginTop: 10,
        flexDirection: "column",
    },
    videoReviewPeopleEmptyContainer: {
        height: Platform.OS === "ios" ? 280 : 180,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    videoReviewPeopleEmptyTextItem: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: "PoppinsBold",
        marginBottom: 5,
    },
    videoReviewPeopleEmptySmallTextItem: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsLight"
    },
    videoReviewContentContainer: {
        width: "100%",
        flexDirection: "row",
        marginBottom: 10,
    },
    videoReviewPersonPictureContainer: {
        width: "15%",
        justifyContent: "flex-start",
        alignItems: "center",
        marginRight: Platform.OS === "ios" ? 10 : 15
    },
    videoReviewPersonPictureContentContainer: {
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    videoReviewPersonPictureImageItem: {
        width: 45,
        height: 45,
        borderRadius: 6,
        resizeMode: "cover",
    },
    videoReviewPersonDetailsContainer: {
        width: "80%",
        flexDirection: "column",
    },
    videoReviewPersonNameContainer: {
        flexDirection: "column",
    },
    videoReviewPersonNameTextItem: {
        color: COLORS.white,
        fontSize: 14,
        fontFamily: "PoppinsBold",
        marginBottom: Platform.OS === "ios" ? 0 : -3,
    },
    videoReviewPersonProfileTextItem: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsLight",
        opacity: 0.5
    },
    videoReviewPersonContentContainer: {
        marginVertical: 2.5,
        flexDirection: "column",
    },
    videoReviewPersonNameContentContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    videoReviewPersonNameContentsContainer: {
        width: "60%",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    videoReviewPersonBubbleContentsContainer: {
        width: "35%",
        justifyContent: "center",
        alignItems: "flex-end",
    },
    videoReviewPersonBubbleTextItem: {
        fontSize: 12,
        fontFamily: "PoppinsBold",
    },
    videoReviewPersonContentTextItem: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsLight",
    },
    videoReviewPersonTimestampContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-end",
    },
    videoReviewPersonTimestampTextItem: {
        color: COLORS.white,
        fontSize: 10,
        fontFamily: "PoppinsLight",
    },
})

export default TutorialFullViewScreen;