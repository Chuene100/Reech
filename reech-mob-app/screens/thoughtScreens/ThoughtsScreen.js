import React, { useEffect, useState } from "react";
import {
  FlatList,
  Dimensions,
  StyleSheet,
  View,
  Text,
  Platform,
  Image,
  Pressable,
  TextInput,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import moment from "moment";
import io from "socket.io-client";
import { useSelector } from "react-redux";

//customs

import { COLORS, icons, images } from "../../constants";
import { EmptyFlatlistComponent } from "../../components";
import { useThoughtFeedQuery } from "@/redux/api/thought";

//track database changes
const SOCKET_SERVER_URL = "https://reech-node-api-7o3szyfdpq-uc.a.run.app/";
//`${process.env.REACT_APP_API_URL}${process.env.MAIN_API_BASE_PATH}/`

const ThoughtsScreen = () => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const navigation = useNavigation();

  const [thoughtsData, setThoughtsData] = useState([]);
  const [searchThought, setSearchThought] = useState([]);

  const current_user = useSelector((state) => state.user.current_user);

  
  const { data, isLoading, refetch, isFetching } = useThoughtFeedQuery()
  useEffect(() => {
    setThoughtsData(data?.data ?? [])
    setSearchThought(data?.data ?? [])
  }, [data])

  useEffect(() => {
    const connectSocket = async () => {
      const socket = io(SOCKET_SERVER_URL, {
        transports: ["websocket"],
        extraHeaders: {
          "Svc-Tkn": `Bearer ${process.env.SvcTkn_Main_API}`,
        },
      });

      
      socket.on('thought-updated', (data) => {
        refetch();
      });
    };
    connectSocket();
  }, []);

  //a method used to filter data according to the username
  const searchChannel = (text) => {
    let filteredData = thoughtsData.filter(
      (x) =>
        String(x?.channelId?.channel?.toLowerCase()).includes(text.toLowerCase()) ||
        String(x?.description.toLowerCase()).includes(text.toLowerCase()) ||
        String(x?.profileId?.jobTitleId?.jobTitle?.toLowerCase()).includes(text.toLowerCase()) ||
        String(x?.address?.toLowerCase()).includes(text.toLowerCase()) ||
        String(x?.userId?.firstName?.toLowerCase()).includes(text.toLowerCase()) ||
        String(x?.userId?.lastName?.toLowerCase()).includes(text.toLowerCase()) ||
        String(x?.title?.toLowerCase()).includes(text.toLowerCase()) ||
        String(x?.thoughtType?.toLowerCase()).includes(text.toLowerCase())
    );
    setSearchThought(filteredData);
  };



  //search function section
  function renderSearchFunctionSection() {
    return (
      <View style={styles.searchThoughtMainContainer}>
        <View style={styles.innerSearchContainer}>
          <View style={styles.textInputContainer}>
            <TextInput
              onChangeText={(text) => searchChannel(text)}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Search"
              placeholderTextColor={COLORS.white}
              style={styles.inputSearch}
              enablesReturnKeyAutomatically
              textAlign="center"
            />
          </View>
          <FontAwesome name="search" size={16} color={COLORS.purpleDark} style={{ top: Platform.OS === "ios" ? 0 : 5 }} />
        </View>
      </View>
    );
  }

  //thought header section
  function renderThoughtHeaderItem({ item }) {
    return (
      <View style={styles.thoughtItemHeaderContainer}>
        {/*header image section*/}
        <Pressable
          onPress={() => {
            if (item?.userId._id === current_user?._id)
              navigation.navigate("LoggedInAccountUserScreen", {
                userId: current_user?._id,
              });
            else
              navigation.navigate("AccountFullViewScreen", {
                userId: item?.userId?._id,
              })
          }}
          style={styles.thoughItemHeaderImageContainer}
        >
          <ImageBackground
            source={images.userFrame}
            style={styles.thoughImageBackgroundContainer}
          >
            <Image
              source={{ uri: item?.userId?.profileImage }}
              style={styles.thoughImageItem}
            />
          </ImageBackground>
        </Pressable>

        {/*header text section*/}
        <View style={styles.thoughtItemUserDetailsSection}>
          {/*user name item*/}
          <View style={styles.thoughtItemUserTextContainer}>
            <Text numberOfLines={1} style={styles.thoughtItemUserNameText}>
              {item?.userId?.firstName} {item?.userId?.lastName}
            </Text>
          </View>

          {/*user blurb item*/}
          <View style={styles.thoughtItemUserTextContainer}>
            <Text numberOfLines={2} style={styles.thoughtItemBlurbText}>
              {item?.userId?.blurb}
            </Text>
          </View>

          {/*user created at, post type, location items*/}
          <View style={styles.thoughtItemUserPostTextContainer}>
            <Text numberOfLines={1} style={styles.thoughtItemBlurbText}>
              {moment(item.createdAt).fromNow()} ·{" "}
            </Text>
            <Text numberOfLines={1} style={styles.thoughtItemBlurbText}>
              {item.thoughtType} ·{" "}
            </Text>
            <Text numberOfLines={1} style={styles.thoughtItemBlurbText}>
              {item?.address}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  //thought post image section
  function renderThoughtImagePostSection({ item }) {
    return (
      <BlurView intensity={40} style={styles.thoughtItemBlurImageContainer}>
        <ImageBackground
          blurRadius={3}
          source={{ uri: item?.fileLink }}
          style={styles.thoughtItemPostImageItem}
        >
          {/*post description section*/}
          <View style={styles.thoughtItemPostDescriptionContainer}>
            <Text
              numberOfLines={3}
              style={styles.thoughtItemPostDescriptionTextItem}
            >
              {item?.description}
            </Text>
          </View>

          {/*post description section*/}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ThoughtInfoScreen", {
                userTitle: item?.userId?.firstName + " " + item?.userId?.lastName,
                blurb: item?.userId?.blurb,
                userAccountImage: item?.userId?.profileImage,
                postedImage: item?.fileLink,
                thoughtType: item?.thoughtType,
                location: item?.address,
                datePosted: item?.createdAt,
                fullDescription: item?.thought,
                fullDescriptionPoints: item?.fullDescriptionPoints,
              })
            }
            style={styles.thoughtItemReadMoreContainer}
          >
            <Text style={styles.thoughtItemReadMoreTextItem}>Read more...</Text>
          </TouchableOpacity>
        </ImageBackground>
      </BlurView>
    );
  }

  //thought latest comment section
  function renderThoughtLatestCommentSection({ item }) {
    return (
      <>
        {item?.userComments && <View style={styles.thoughtLatestCommentMainContainer}>
          {/*latest text section*/}
          <View style={styles.thoughtLatestHeaderTextContainer}>
            <Text style={styles.thoughtLatestHeaderTextItem}>Latest comment</Text>
          </View>

          {/*latest text section*/}
          <View style={styles.thoughtLatestCommentContentContainer}>
            {item?.userComments?.map((commentList, i) => (
              <>
                <View key={i}>
                  {i < 1 && (
                    <View style={styles.thoughtLatestCommenterContent}>
                      {/*latest commenter image*/}
                      <TouchableOpacity
                        onPress={() => {
                          console.log("take user to AccountFullViewScreen")
                          navigation.navigate("AccountFullViewScreen", {
                            userId: commentList?.userId?._id,
                          })
                        }}
                        style={styles.thoughtLatestCommenterImageContent}
                      >
                        <ImageBackground
                          source={images.userFrame}
                          style={styles.thoughtLatestCommenterBackgroundImage}
                        >
                          <Image
                            source={
                              commentList.userPic
                                ? commentList.userPic
                                : images.defaultRounded
                            }
                            style={styles.thoughtLatestCommenterImageItem}
                          />
                        </ImageBackground>
                      </TouchableOpacity>

                      {/*latest commenter text details*/}
                      <View style={styles.thoughtLatestCommentTextContent}>
                        {/*commenter name section*/}
                        <TouchableOpacity
                          onPress={() => {
                            console.log("take user to AccountFullViewScreen")
                            navigation.navigate("AccountFullViewScreen", {
                              userId: commentList?.userId?._id,
                            })
                          }}
                          style={styles.thoughtCommentNameContainer}
                        >
                          <Text
                            numberOfLines={1}
                            style={styles.thoughtCommentNameTextItem}
                          >
                            {commentList.userName}
                          </Text>
                        </TouchableOpacity>

                        {/*commenter blurb section*/}
                        <View style={styles.thoughtCommenterBlurbContainer}>
                          <Text
                            numberOfLines={1}
                            style={styles.thoughtCommenterBlurbTextItem}
                          >
                            {commentList.userBlurb}
                          </Text>
                        </View>

                        {/*commenter comment item*/}
                        <TouchableOpacity
                          onPress={() => navigation.navigate("ThoughtMoreUserInfoScreen", { item: item })}
                          style={styles.thoughtCommenterCommentContainer}
                        >
                          <Text
                            numberOfLines={Platform.OS === "ios" ? 4 : 4}
                            style={styles.thoughtCommenterCommentTextItem}
                          >
                            {commentList.userComment}

                            {/*show user mention name before or after main comment text*/}
                            {commentList.userCommentMention ? (
                              <Text
                                style={
                                  styles.thoughtCommenterCommentMentionTextItem
                                }
                              >
                                {commentList.userCommentMention}
                              </Text>
                            ) : null}

                            {/*show user extended comment after mention*/}
                            {commentList.userCommentExtended
                              ? commentList.userCommentExtended
                              : null}
                          </Text>
                        </TouchableOpacity>

                        {/*commenter timestamp section*/}
                        <View style={styles.thoughtCommenterTimestampContainer}>
                          <Text style={styles.thoughtCommenterTimestampTextItem}>
                            {commentList.commentTimeStamp}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </>
            ))}
          </View>
        </View>}
      </>
    );
  }

  //bottom thought action section
  function renderThoughtBottomActionSection({ item }) {
    return (
      <View style={styles.thoughtBottomActionContainer}>
        {/*thought channel section*/}
        <View style={styles.thoughtBottomChannelContainer}>
          {/*sub channel section*/}
          <View style={styles.thoughtBottomSubChannelContainer}>
            {/*channel icon*/}
            <View style={styles.thoughtBottomSubChannelContent}>
              <Image
                source={icons.arrowIcon}
                style={styles.thoughtBottomSubChannelIconItem}
              />
            </View>

            {/*channel text*/}
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ThoughtSingleChannelCategoryScreen", {
                  item: item,
                })
              }
              style={styles.thoughtBottomSubChannelTextContent}
            >
              <Text
                numberOfLines={2}
                style={styles.thoughtBottomSubChannelTextItem}
              >
                {item?.channelId?.channel} Channel
              </Text>
            </TouchableOpacity>
          </View>

          {/*channel trending section*/}
          <View style={styles.thoughtBottomChannelTrendingContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("HowToChannelTogglerScreen", {
                  idx: 1,
                })
              }
              style={styles.thoughtBottomChannelTrendingContent}
            >
              <Text style={styles.thoughtBottomChannelTrendingTextItem}>
                {`🔥 See what's trending`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View stye={styles.thoughtBottomLogoContentContainer}>
          {/*thought modal trigger section*/}
          <TouchableOpacity
            onPress={() => navigation.navigate("ThoughtMoreUserInfoScreen", { item: item })}
            stye={styles.thoughtBottomLogoContainer}
          >
            <Image
              source={require("../../assets/appIcon.png")}
              style={styles.thoughtBottomLogoItem}
            />
          </TouchableOpacity>

          {/*add new how-to video*/}
          <TouchableOpacity
            onPress={() => navigation.navigate("AddThoughtScreen")}
            style={styles.reechAddThoughtContainer}
          >
            <Image
              source={icons.addIcon}
              style={styles.reechAddThoughtImageItem}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  //thought items sections
  function renderThoughtsItems() {
    return (
      <View style={styles.thoughtsItemMainContainer}>
        <FlatList
          data={searchThought ?? []}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={refetch}
          refreshing={isFetching}
          renderItem={({ item, index }) => {
            return (
              <View key={index} style={styles.thoughtsContentItemContainer}>
                {renderThoughtHeaderItem({ item })}
                {renderThoughtImagePostSection({ item })}
                {renderThoughtLatestCommentSection({ item })}
                {renderThoughtBottomActionSection({ item })}
              </View>
            );
          }}
          ListFooterComponent={<View style={styles.flatlistBottom} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyFlatlistComponent}
        />
      </View>
    );
  }

  //screen content list
  function renderScreenContentList() {
    return (
      <>
        {renderSearchFunctionSection()}
        {renderThoughtsItems()}
      </>
    );
  }

  return (
    <View
      style={[
        styles.thoughtContainer,
        { height: windowHeight, width: windowWidth },
      ]}
    >
      {renderScreenContentList()}
    </View>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  thoughtContainer: {
    flexDirection: "column",
  },

  //search section
  searchThoughtMainContainer: {
    top: Platform.OS === "ios" ? 90 : 20,
    marginHorizontal: "8%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  innerSearchContainer: {
    flexDirection: "row",
    paddingVertical: Platform.OS === "ios" ? 10 : 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: COLORS.reechGray,
  },
  textInputContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "93%",
  },
  inputSearch: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 14,
    width: "100%",
    alignItems: "center",
  },

  //thought main section
  thoughtsItemMainContainer: {
    height: "100%",
    width: "100%",
    flexDirection: "column",
    marginTop: Platform.OS === "ios" ? 140 : 95,
  },
  thoughtsContentItemContainer: {
    flexDirection: "column",
    marginBottom: Platform.OS === "ios" ? -80 : 0,
  },
  flatlistBottom: {
    marginBottom: Platform.OS === "ios" ? "50%" : "33%",
  },

  //thought header section
  thoughtItemHeaderContainer: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 15,
  },
  thoughItemHeaderImageContainer: {
    width: Platform.OS === "ios" ? "25%" : "28%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  thoughImageBackgroundContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  thoughImageItem: {
    width: 70,
    height: 70,
    resizeMode: "cover",
    borderRadius: 8,
  },
  thoughtItemUserDetailsSection: {
    width: Platform.OS === "ios" ? "68%" : "71%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  thoughtItemUserTextContainer: {
    width: "100%",
    flexDirection: "column",
    marginBottom: 2,
  },
  thoughtItemUserNameText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  thoughtItemBlurbText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "normal",
  },
  thoughtItemUserPostTextContainer: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 2,
  },

  //thought main image section
  thoughtItemBlurImageContainer: {
    width: "100%",
    marginBottom: 10,
  },
  thoughtItemPostImageItem: {
    width: "100%",
    height: Platform.OS === "ios" ? 300 : 250,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  thoughtItemPostDescriptionContainer: {
    width: "100%",
    paddingHorizontal: 40,
    marginBottom: 10,
  },
  thoughtItemPostDescriptionTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
    textAlign: "center",
  },
  thoughtItemReadMoreContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  thoughtItemReadMoreTextItem: {
    color: COLORS.darkGray,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },

  //thought latest comment section
  thoughtLatestCommentMainContainer: {
    width: "100%",
    flexDirection: "column",
  },
  thoughtLatestHeaderTextContainer: {
    marginVertical: 13,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  thoughtLatestHeaderTextItem: {
    color: COLORS.darkGray,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  thoughtLatestCommentContentContainer: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 5,
    marginBottom: 15,
  },
  thoughtLatestCommenterContent: {
    width: "100%",
    flexDirection: "row",
  },
  thoughtLatestCommenterImageContent: {
    width: Platform.OS === "ios" ? 60 : "17%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  thoughtLatestCommenterBackgroundImage: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  thoughtLatestCommenterImageItem: {
    width: 42,
    height: 42,
    resizeMode: "cover",
    borderRadius: 4,
  },
  thoughtLatestCommentTextContent: {
    width: Platform.OS === "ios" ? "85%" : "83%",
    flexDirection: "column",
  },
  thoughtCommentNameContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  thoughtCommentNameTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  thoughtCommenterBlurbContainer: {
    width: "100%",
    marginBottom: 12,
  },
  thoughtCommenterBlurbTextItem: {
    color: COLORS.darkGray,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  thoughtCommenterCommentContainer: {
    width: "100%",
    marginBottom: 10,
  },
  thoughtCommenterCommentTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  thoughtCommenterCommentMentionTextItem: {
    color: COLORS.purple,
    fontSize: 12,
    fontFamily: "PoppinsBold",
    textDecorationLine: "underline",
  },
  thoughtCommenterTimestampContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  thoughtCommenterTimestampTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //bottom thought action section
  thoughtBottomActionContainer: {
    width: Platform.OS === "ios" ? "100%" : "97%",
    marginBottom: Platform.OS === "ios" ? 120 : 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  thoughtBottomChannelContainer: {
    width: "70%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  thoughtBottomSubChannelContainer: {
    width: "100%",
    flexDirection: "row",
  },
  thoughtBottomSubChannelContent: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  thoughtBottomSubChannelIconItem: {
    width: 30,
    height: 30,
    resizeMode: "cover",
  },
  thoughtBottomSubChannelTextContent: {
    width: "78%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  thoughtBottomSubChannelTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  thoughtBottomChannelTrendingContainer: {
    width: Platform.OS === "ios" ? "65%" : "70%",
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  thoughtBottomChannelTrendingContent: {
    width: "100%",
    height: 30,
    paddingHorizontal: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.reechGray,
  },
  thoughtBottomChannelTrendingTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  thoughtBottomLogoContentContainer: {
    flexDirection: "column",
  },
  thoughtBottomLogoContainer: {
    width: "45%",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  thoughtBottomLogoItem: {
    width: 45,
    height: 45,
    resizeMode: "cover",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.purple,
  },
  reechAddThoughtContainer: {
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  reechAddThoughtImageItem: {
    width: 50,
    height: 50,
    resizeMode: "cover",
    borderRadius: 50,
  },

  //reech thought modal pop-up section
  reechThoughtModalContainer: {
    height: "50%",
  },
  reechThoughtInnerModalContent: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: COLORS.black,
    paddingHorizontal: 15,
  },
  innerReechThoughtTopModalContainer: {
    width: "100%",
    marginTop: 50,
    flexDirection: "column",
  },
  topModalThoughtActionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default ThoughtsScreen;
