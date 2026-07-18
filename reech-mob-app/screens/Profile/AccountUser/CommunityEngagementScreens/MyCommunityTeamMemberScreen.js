import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import { useSocket } from "@/utils/socket";
import { useCreateChatRoomMutation } from "@/redux/api/chat";
import Toast from "react-native-toast-message";

//customs
import { COLORS, images } from "../../../../constants";
import { EmptyFlatlistComponent } from "../../../../components";
import NavHeader from "@/components/Headers/NavHeader";
import moment from "moment";

const MyCommunityTeamMemberScreen = ({ route }) => {
  const navigation = useNavigation();
  const { value } = useForm();
  const socket = useSocket();
  const { item } = route.params;

  const [teamMembers, setTeamMembers] = useState(item?.team);
  const current_user = useSelector((state) => state.user.current_user);
  const [createChatRoomFn] = useCreateChatRoomMutation();

  const showError = (res) =>
    Toast.show({
      type: "error",
      text1: "Error",
      text2: res.error.data?.error ?? "Something went wrong. Please try again",
    });

  // navigate to inbox
  const navigateToChat = (item) => {
    navigation.navigate("MainMessageFullViewScreen", {
      id: item?._id,
      name: item?.name,
      avatar: item?.avatar
    });
  }

  const handleChat = (chatter, chattee) => {
    const payload = {
      userIds: [chattee._id],
      name: `${chattee.firstName} ${chattee.lastName}`,
      initiatorsName: `${chatter.firstName} ${chatter.lastName}`,
      chatInitiator: chatter._id,
      avatar: chattee.profileImage,
      initiatorsAvatar: chatter.profileImage,
    };

    createChatRoomFn(payload)
      .then((res) => {
        if (res.error) {
          showError(res);
          return;
        }
        navigateToChat(res?.data?.data);
      })
      .catch((err) => {
        console.error(err);
      })
    socket.emit("create-room", payload)
  }

  const isAdmin = (memberId) => {
    const memeber = item?.admins?.findIndex((obj) => obj._id === memberId);
    if (memeber >= 0) return true;

    return false;
  };

  const searchUsername = (text) => {
    let filteredData = item?.team.filter(
      (x) =>
        String(x.firstName.toLowerCase()).includes(text.toLowerCase()) ||
        String(x.lastName.toLowerCase()).includes(text.toLowerCase())
    );
    setTeamMembers(filteredData);
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerComponentContainer}>
          <NavHeader message="What would you like to do?" />

          {/*navigation text section*/}
          <View style={styles.headerTextContainer}>
            <View style={styles.headingTextContainer}>
              <Text numberOfLines={4} style={styles.headingTextItem}>
                {item.title} - Team
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  //search section
  function renderSearchFunctionSection() {
    return (
      <View style={styles.searchFunctionContainer}>
        <View style={styles.textInputContainer}>
          <View style={styles.innersTextSearchContainer}>
            <TextInput
              value={value}
              onChangeText={(text) => searchUsername(text)}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Search"
              placeholderTextColor={COLORS.white}
              style={styles.inputEmember}
              enablesReturnKeyAutomatically
              textAlign="center"
            />
          </View>
          <FontAwesome name="search" size={16} color={COLORS.purpleDark} style={{ top: Platform.OS === "ios" ? 0 : 5 }} />
        </View>
      </View>
    );
  }

  //content screen section
  function renderTeamMemberCollectionSection() {
    return (
      <View style={styles.flatContainer}>
        <FlatList
          data={teamMembers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.teamMemberContainer}>
                <View style={styles.teamMemberContent}>
                  {/*team member image section*/}
                  <TouchableOpacity onPress={() => {
                    if (item?._id === current_user?._id)
                      navigation.navigate("LoggedInAccountUserScreen");
                    else
                      navigation.navigate("AccountFullViewScreen", {
                        userId: item?._id,
                      });
                  }}
                    style={styles.teamMemberImageContainer}>
                    <ImageBackground
                      source={images.userFrame}
                      style={styles.teamMemberGradientContainer}
                    >
                      <Image
                        source={item?.profileImage ? { uri: item?.profileImage } : images.defaultRounded}
                        style={styles.teamMemberImageItem}
                      />
                    </ImageBackground>
                  </TouchableOpacity>

                  {/*team member name section*/}
                  <View style={styles.teamMemberNameContainer}>
                    <TouchableOpacity onPress={() => {
                      if (item?._id === current_user?._id)
                        navigation.navigate("LoggedInAccountUserScreen");
                      else
                        navigation.navigate("AccountFullViewScreen", {
                          userId: item?._id,
                        });
                    }}
                      style={styles.teamMemberNameContent}>
                      <Text numberOfLines={1} style={styles.teamMemberNameItem}>
                        {item?.firstName} {item?.lastName}
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.teamMemberDateContent}>
                      <Text style={styles.teamMemberDateItem}>
                        Active since {moment(Date.now()).format("MMMM YYYY")}
                      </Text>
                    </View>
                  </View>

                  {/*team member authority image section*/}
                  <View style={styles.teamMemberAuthContainer}>
                    <Text style={styles.teamMemberAuthRepItem}>
                      {isAdmin(item?._id) ? "Admin" : null}
                    </Text>
                    {isAdmin(item?._id) && (current_user?._id !== item?._id) ? (
                      <Text
                        onPress={() => handleChat(current_user, item)}
                        style={styles.teamMemberAuthItem}
                      >
                        Message
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>
            );
          }}
          ListFooterComponent={<View style={{ marginBottom: Platform.OS === "ios" ? 40 : 0, }} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyFlatlistComponent />}
        />
      </View>
    );
  }

  //screen content list
  function renderScreenContentList() {
    return (
      <View>
        {renderHeaderSection()}
        {renderSearchFunctionSection()}
        <View style={styles.screenListContentContainer}>
          {renderTeamMemberCollectionSection()}
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {renderScreenContentList()}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  screenListContentContainer: {
    marginTop: 5,
    height: "73%",
  },

  //header section
  headerContainer: {
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },
  headerComponentContainer: {
    marginTop: 0,
  },
  headerTextContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
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

  //search section
  searchFunctionContainer: {
    flexDirection: "column",
    paddingHorizontal: 15,
    backgroundColor: COLORS.transparent,
  },
  textInputContainer: {
    flexDirection: "row",
    paddingVertical: Platform.OS === "ios" ? 10 : 5,
    paddingHorizontal: 25,
    borderRadius: 20,
    backgroundColor: COLORS.reechGray,
    marginBottom: 10,
  },
  innersTextSearchContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "93%",
  },
  inputEmember: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 14,
    width: "100%",
    alignItems: "center",
  },

  //team member section
  flatContainer: {
    height: "115%",
  },
  teamMemberContainer: {
    flexDirection: "column",
    zIndex: 1,
  },
  teamMemberContent: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 20,
  },
  teamMemberImageContainer: {
    width: "20%",
  },
  teamMemberGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 2,
    height: 60,
    width: 60,
  },
  teamMemberImageItem: {
    top: 2,
    left: 2,
    width: 54,
    height: 54,
    borderRadius: 6,
    resizeMode: "cover",
    borderColor: COLORS.black,
    borderWidth: 1,
  },
  teamMemberNameContainer: {
    flexDirection: "column",
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: Platform.OS === "ios" ? 0 : 5,
  },
  teamMemberNameContent: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 5,
  },
  teamMemberNameItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  teamMemberDateContent: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
  },
  teamMemberDateItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  teamMemberAuthContainer: {
    padding: 5,
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 30,
  },
  teamMemberAuthRepItem: {
    color: COLORS.darkGray,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    marginTop: 5,
    marginBottom: 8,
  },
  teamMemberAuthItem: {
    color: COLORS.purple,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
});

export default MyCommunityTeamMemberScreen;
