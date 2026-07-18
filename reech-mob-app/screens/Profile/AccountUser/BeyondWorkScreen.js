import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Modal,
  Pressable,
  FlatList,
  ScrollView,
  TextInput,
  ImageBackground,
  Platform,
} from "react-native";
import { SliderBox } from "react-native-image-slider-box";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setUsersImage } from "../../../redux/features/all-user-image-slice";
import { AntDesign, FontAwesome, Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

//customs
import { beyondWorkListData } from "../../../assets/data/beyondWorkListData";
import { COLORS, icons, images } from "../../../constants";
import { EmptyFlatlistComponent } from "../../../components";
import { useReadUserQuery } from "../../../redux/api/api-slice";
import NavHeader from "@/components/Headers/NavHeader";

const BeyondWorkScreen = ({ route }) => {
  const dispatch = useDispatch();

  const { userId } = route.params;

  const image = useSelector((state) => state.users_images.usersImages);

  const { data: user } = useReadUserQuery(userId ?? null);

  useEffect(() => { if (user) { !image[user?.profileImage] && _loadImage(user?.profileImage); } }, [user]);

  const _loadImage = async (url) => {
    try {
      if (url) {
        const response = await fetch(url);

        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          dispatch(setUsersImage({ url, data: reader.result }));
        };
      }
    } catch (error) {
      console.error(`Error loading image: ${error}`);
    }
  };

  //screen scroll animation
  let AnimatedHeaderValue = new Animated.Value(0);
  const Header_Min_Height = 40; // min height of the header
  const Header_Max_Height = 40; // max height of the header

  const animatedHeaderBackgroundColor = AnimatedHeaderValue.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [COLORS.transparent, COLORS.transparent],
    extrapolate: "clamp",
  });

  const animateHeaderHeight = AnimatedHeaderValue.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [Header_Max_Height, Header_Min_Height],
    extrapolate: "clamp",
  });

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

  //state handler
  
  const [beyondWorkImages, setBeyondWorkImages] = useState(beyondWorkListData);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [moreOptionModal, setMoreOptionModal] = useState(false);
  const [commentSectionModal, setCommentSectionModal] = useState(false);
  const [userComment, setUserComment] = useState("");

  //header section
  function renderHeaderSection() {
    return (
      <Animated.View
        style={[
          styles.headerContainer,
          {
            height: animateHeaderHeight,
            backgroundColor: animatedHeaderBackgroundColor,
          },
        ]}
      >
        <View style={styles.headerComponentContainer}>
          <NavHeader
            message="What would you like to do?"
          />
        </View>

        <View style={styles.headerTextContainer}>
          <View style={styles.headingTextContainer}>
            <Text style={styles.headingTextItem}>Beyond work</Text>
          </View>
        </View>
      </Animated.View>
    );
  }

  //profile slider section
  function renderPictureSliderSection() {
    const selectedImage = beyondWorkImages[selectedItemIndex];

    return (
      <View style={styles.sliderImageContainer}>
        <SliderBox
          images={selectedImage.imageSliderCollection}
          firstItem={0}
          autoplay={true}
          autoplayInterval={3000}
          paginationBoxVerticalPadding={10}
          dotColor={COLORS.purple}
          inactiveDotColor={COLORS.darkGray}
          dotStyle={styles.sliderDotStyle}
          ImageComponentStyle={styles.sliderImageItem}
          imageLoadingColor={COLORS.purple}
          circleLoop={true}
          onCurrentImagePressed={(index) => console.log(index + 1)}
        />

        {/*image details section*/}
        <View style={styles.imageDetailsContainer}>
          {/*image timestamp section*/}
          <View style={styles.imageDetailsDateContainer}>
            <MaterialCommunityIcons
              name="clock-time-four-outline"
              size={18}
              color={COLORS.white}
            />
            <Text style={styles.imageDetailsDateItem}>
              {selectedImage.beyondWorkCreatedAt}
            </Text>
          </View>

          {/*image location section*/}
          <View style={styles.imageDetailsDateContainer}>
            <MaterialIcons name="location-on" size={18} color={COLORS.white} />
            <Text style={styles.imageDetailsLocationItem}>
              {selectedImage.beyondWorkLocation}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  //action & description container
  function renderActionWithDescriptionSection() {
    const selectedImage = beyondWorkImages[selectedItemIndex];

    return (
      <View style={styles.actionAndDescriptionContainer}>
        {/*action items section*/}
        <View style={styles.actionItemsContainer}>
          {/*action share item*/}
          <TouchableOpacity
            onPress={() => console.log("share pressed")}
            style={styles.actionItemContainer}
          >
            <Text style={styles.actionItemTextItem}>
              {selectedImage.beyondWorkShares}
            </Text>
            <FontAwesome name="share-square-o" size={18} color={COLORS.white} />
          </TouchableOpacity>

          {/*action appreciate item*/}
          <TouchableOpacity
            onPress={() => console.log("appreciation pressed")}
            style={styles.actionItemContainer}
          >
            <Text style={styles.actionItemTextItem}>
              {selectedImage.beyondWorkLikes}
            </Text>
            <MaterialCommunityIcons
              name="hand-clap"
              size={18}
              color={COLORS.white}
            />
          </TouchableOpacity>

          {/*action more item*/}
          <TouchableOpacity
            onPress={() => setMoreOptionModal(true)}
            style={styles.actionItemContainer}
          >
            <MaterialIcons name="more-vert" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/*experience description section*/}
        <ScrollView style={styles.descriptionItemContainer}>
          <Text style={styles.descriptionTextItem}>
            {selectedImage.beyondWorkDescription}
          </Text>
        </ScrollView>
      </View>
    );
  }

  //report user
  function renderProfileMoreOptionModal() {
    return (
      <Modal
        visible={moreOptionModal}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        style={styles.moreModalContainer}
      >
        <ImageBackground
          source={icons.popupBg}
          style={styles.moreInnerModalContainer}
        >
          {/*modal close action section*/}
          <View style={styles.moreInnerModalContent}>
            <Pressable onPress={() => setMoreOptionModal(false)}>
              <Ionicons name="close" size={18} color={COLORS.white} />
            </Pressable>
          </View>

          {/*more modal option section */}
          <View style={styles.moreModalOptionContent}>
            {/*prior option*/}
            <Pressable
              onPress={() => onPrioritiesPressed()}
              style={styles.moreModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.moreModalOptionIconContainer}>
                <Image
                  source={icons.noHeart}
                  style={{ height: 25, width: 25 }}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.moreModalOptionTextContainer}>
                <Text style={styles.moreModalOptionHeaderText}>Prioritise</Text>
                <Text style={styles.moreModalOptionInfoText}>
                  See more from {user?.firstName} {user?.lastName}
                </Text>
              </View>
            </Pressable>

            {/*mute option*/}
            <Pressable
              onPress={() => onMutePressed()}
              style={styles.moreModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.moreModalOptionIconContainer}>
                <Image
                  source={icons.noSound}
                  style={{ height: 25, width: 25 }}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.moreModalOptionTextContainer}>
                <Text style={styles.moreModalOptionHeaderText}>Mute</Text>
                <Text style={styles.moreModalOptionInfoText}>
                  Take a break from {user?.firstName} {user?.lastName}
                </Text>
              </View>
            </Pressable>

            {/*remove option*/}
            <Pressable
              onPress={() => onRemovePressed()}
              style={styles.moreModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.moreModalOptionIconContainer}>
                <Image
                  source={icons.noUser}
                  style={{ height: 25, width: 25 }}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.moreModalOptionTextContainer}>
                <Text style={styles.moreModalOptionHeaderText}>Remove</Text>
                <Text style={styles.moreModalOptionInfoText}>
                  Remove {user?.firstName} {user?.lastName} from your bubble
                </Text>
              </View>
            </Pressable>

            {/*report option*/}
            <Pressable
              onPress={() => onReportPressed()}
              style={styles.moreModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.moreModalOptionIconContainer}>
                <Image
                  source={icons.noFlag}
                  style={{ height: 25, width: 25 }}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.moreModalOptionTextContainer}>
                <Text style={styles.moreModalOptionHeaderText}>Report</Text>
                <Text style={styles.moreModalOptionInfoText}>
                  {`Do you want to hide ${user?.firstName} ${user?.lastName}'s posts?`}
                </Text>
              </View>
            </Pressable>
          </View>
        </ImageBackground>
      </Modal>
    );
  }

  //comments section
  function renderCommentsSection() {
    const selectedImage = beyondWorkImages[selectedItemIndex];

    return (
      <View style={styles.commentsSectionContainer}>
        <Text
          onPress={() => setCommentSectionModal(true)}
          style={styles.commentsTextItem}
        >
          View {selectedImage.beyondWorkCommentItems.length} comment
          {selectedImage.beyondWorkCommentItems.length <= 1 || 0 ? "" : "s"}
        </Text>
      </View>
    );
  }

  function renderCommentSectionModal() {
    const selectedImage = beyondWorkImages[selectedItemIndex];

    return (
      <Modal
        visible={commentSectionModal}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        style={styles.commentModalContainer}
      >
        <View style={styles.commentInnerModalContainer}>
          {/*modal close action section*/}
          <View style={styles.commentInnerModalContent}>
            <Pressable onPress={() => setCommentSectionModal(false)}>
              <AntDesign name="closecircle" size={18} color={COLORS.white} />
            </Pressable>
          </View>

          <View style={styles.commentModalHeaderTextContainer}>
            <Text style={styles.commentModalHeaderTextItem}>
              {selectedImage.beyondWorkCommentItems.length} Comment
              {selectedImage.beyondWorkCommentItems.length <= 1 || 0 ? "" : "s"}
            </Text>
          </View>

          <View style={styles.commentOptionModalLiner} />

          {/*user comment section*/}
          <FlatList
            data={selectedImage.beyondWorkCommentItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <View style={styles.commentItemsContainer}>
                  <View style={styles.commentItemContent}>
                    {/*comment content*/}
                    <View style={styles.commentContentItemContainer}>
                      {/*comment image section*/}
                      <View style={styles.commentImageContainer}>
                        <ImageBackground
                          source={images.userFrame}
                          style={styles.commentGradientColorContainer}
                        >
                          <Image
                            source={item.commentImage}
                            style={styles.commentImageItem}
                          />
                        </ImageBackground>
                      </View>

                      {/*comment text section*/}
                      <View style={styles.commentTextContainer}>
                        <Text style={styles.commenterNameTextItem}>
                          {item.commenterName}
                        </Text>
                        <Text style={styles.commenterTextItem}>
                          {item.commenterText}
                        </Text>

                        <View style={styles.commenterTimeStampItemContainer}>
                          <Text style={styles.commenterTimeStampItem}>
                            {item.commenterTimestamp}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
          />

          {/*comment action section*/}
          <View style={styles.commentActionContainer}>
            <View style={styles.commentActionInputItemContainer}>
              <TextInput
                value={userComment}
                onChangeText={setUserComment}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType={"default"}
                placeholder={"Add a comment..."}
                placeholderTextColor={COLORS.white}
                style={styles.commentActionInputItem}
                enablesReturnKeyAutomatically
                multiline
              />
            </View>

            {/*add comment button*/}
            <Pressable
              onPress={() => console.log("comment button clicked")}
              style={styles.commentContainer}
            >
              <LinearGradient
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
                style={styles.commentGradientContainer}
              >
                <Text style={styles.commentTextItems}>
                  <FontAwesome name="send" size={16} color={COLORS.white} />
                  {"  "}
                  Add Comment
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  //image recommended section
  function renderBeyondWorkImageCollectionSection() {
    return (
      <>
        <FlatList
          horizontal
          data={beyondWorkImages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <View style={styles.beyondWorkImageItemsContainer}>
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedItemIndex(index)}
                  style={styles.beyondWorkImageItems}
                >
                  <Image
                    source={item.beyondWorkImageRecommended}
                    style={styles.beyondWorkImageItem}
                  />
                </TouchableOpacity>
              </View>
            );
          }}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={<EmptyFlatlistComponent />}
        />
      </>
    );
  }

  //screen content
  function renderScreenContent() {
    return (
      <>
        {renderHeaderSection()}
        <View
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: AnimatedHeaderValue } } }],
            { useNativeDriver: false }
          )}
          style={styles.screenViewContentContainer}
        >
          {renderPictureSliderSection()}
          {renderActionWithDescriptionSection()}
          {renderProfileMoreOptionModal()}
          {renderCommentsSection()}
          {renderCommentSectionModal()}
          {renderBeyondWorkImageCollectionSection()}
        </View>
      </>
    );
  }

  return <View style={styles.container}>{renderScreenContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //screen view section
  screenViewContentContainer: {
    top: -90,
  },

  //header section
  headerContainer: {
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
    zIndex: 99,
  },
  headerComponentContainer: {
    marginTop: Platform.OS === "ios" ? 3 : 0,
  },
  headerTextContainer: {
    flexDirection: "row",
    top: 10,
    paddingHorizontal: 15,
    zIndex: 99,
  },
  headerNavigationContainer: {
    width: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  headingTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 40,
    marginLeft: 10,
  },
  headingTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },

  //slider image section
  sliderImageContainer: {
    top: 0,
  },
  sliderDotStyle: {
    height: 5,
    width: Platform.OS === "ios" ? 59 : 46,
  },
  sliderImageItem: {
    height: Platform.OS === "ios" ? 480 : 410,
    width: "100%",
    resizeMode: "cover",
  },
  imageDetailsContainer: {
    top: -80,
    flexDirection: "column",
    marginHorizontal: 10,
  },
  imageDetailsDateContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  imageDetailsDateItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    left: 5,
  },
  imageDetailsLocationItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
    left: 5,
  },

  //action and description section
  actionAndDescriptionContainer: {
    flexDirection: "column",
    marginHorizontal: 0,
    marginTop: -45,
    padding: 5,
  },
  actionItemsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  actionItemContainer: {
    marginHorizontal: 8,
    left: 12,
    flexDirection: "row",
    justifyContent: "center",
  },
  actionItemTextItem: {
    color: COLORS.white,
    fontSize: Platform.OS === "ios" ? 14 : 12,
    fontFamily: "PoppinsLight",
    marginRight: 10,
    alignSelf: "center",
  },
  descriptionItemContainer: {
    marginTop: 10,
    paddingHorizontal: 5,
    paddingVertical: 10,
    minHeight: 80,
  },
  descriptionTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //more modal section
  moreModalContainer: {
    marginTop: 10,
  },
  moreInnerModalContainer: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? "134%" : "121%",
    padding: "4%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  moreInnerModalContent: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  moreModalOptionContent: {
    left: Platform.OS === "ios" ? 18 : 30,
    flexDirection: "column",
  },
  moreModalOptionContainer: {
    top: 20,
    marginBottom: 25,
    flexDirection: "row",
  },
  moreModalOptionIconContainer: {
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
  },
  moreModalOptionTextContainer: {
    left: Platform.OS === "ios" ? 20 : 20,
    width: "65%",
    flexDirection: "column",
  },
  moreModalOptionHeaderText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  moreModalOptionInfoText: {
    marginTop: 3,
    opacity: 0.8,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //comments section
  commentsSectionContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  commentsTextItem: {
    color: COLORS.white,
    fontSize: Platform.OS === "ios" ? 16 : 14,
    fontFamily: "PoppinsLight",
  },

  //comment modal section
  commentModalContainer: {
    marginTop: 10,
  },
  commentInnerModalContainer: {
    flex: 1,
    marginTop: "114%",
    padding: "4%",
    backgroundColor: COLORS.black,
  },
  commentInnerModalContent: {
    right: 5,
    flexDirection: "row",
    justifyContent: "flex-end",
    zIndex: 99,
  },
  commentModalHeaderTextContainer: {
    marginTop: -22,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  commentModalHeaderTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  commentOptionModalLiner: {
    width: "40%",
    marginTop: "2.5%",
    marginBottom: "4%",
    alignSelf: "center",
    borderRadius: 20,
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 3,
  },
  commentItemsContainer: {
    padding: 5,
  },
  commentItemContent: {
    flexDirection: "column",
    width: "100%",
  },
  commentContentItemContainer: {
    flexDirection: "row",
    width: "100%",
  },
  commentImageContainer: {
    width: "20%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  commentGradientColorContainer: {
    width: Platform.OS === "ios" ? 70 : 60,
    height: Platform.OS === "ios" ? 70 : 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 2,
    right: 5,
  },
  commentImageItem: {
    top: 2,
    left: 2,
    width: Platform.OS === "ios" ? 66 : 56,
    height: Platform.OS === "ios" ? 66 : 56,
    resizeMode: "cover",
    borderColor: COLORS.black,
    borderWidth: 2,
    borderRadius: 8,
  },
  commentTextContainer: {
    width: "78%",
    left: "2%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  commenterNameTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
    marginBottom: 5,
  },
  commenterTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    marginBottom: 10,
  },
  commenterTimeStampItemContainer: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    left: 0,
  },
  commenterTimeStampItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  commentActionContainer: {
    flexDirection: "column",
    width: "100%",
  },
  commentActionInputItemContainer: {
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  commentActionInputItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  commentContainer: {
    marginTop: 5,
    marginBottom: 10,
  },
  commentGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 45,
    width: "100%",
  },
  commentTextItems: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },

  //beyond work image section
  beyondWorkImageItemsContainer: {
    width: 200,
    flexDirection: "row",
    padding: 5,
  },
  beyondWorkImageItems: {
    width: 180,
  },
  beyondWorkImageItem: {
    width: 180,
    height: 180,
    resizeMode: "cover",
  },
});

export default BeyondWorkScreen;
