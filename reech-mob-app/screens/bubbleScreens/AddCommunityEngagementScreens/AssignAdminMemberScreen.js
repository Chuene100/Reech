import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  ImageBackground,
  Pressable,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { FontAwesome } from "@expo/vector-icons";

//customs
import { communityMemberListItems } from "../../../assets/data/communityEngagementData";
import { COLORS, images } from "../../../constants";
import NavHeader from "@/components/Headers/NavHeader";
import { EmptyFlatlistComponent } from "../../../components";

const AssignAdminMemberScreen = ({ route }) => {
  const navigation = useNavigation();

  // Retrieve the selectedAdminTeamMembers from the route params if available
  const selectedAdminTeamMembersFromParams = route.params?.selectedAdminTeamMembers || [];
  const members = route.params?.members || []

  const {
    handleSubmit,
    value,
  } = useForm();

  const [teamMembers, setTeamMembers] = useState(members);
  const [selectedAdminMembers, setSelectedAdminMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Set initial selected members from route params
  useEffect(() => {
    setSelectedAdminMembers(selectedAdminTeamMembersFromParams);
  }, [selectedAdminTeamMembersFromParams]);

  const toggleSelectedAdminMember = (memberId) => {
    const isSelected = isSelectedItem(memberId);
    if (isSelected) {
      setSelectedAdminMembers(selectedAdminMembers.filter((obj) => obj._id !== memberId._id));
    } else {
      setSelectedAdminMembers([...selectedAdminMembers, memberId]);
    }
  };

  const isSelectedItem = (item) => {
    return selectedAdminMembers.findIndex((obj) => obj._id === item._id) > -1
  }

  const searchUsername = (text) => {
    let filteredData = communityMemberListItems.filter(
      (x) =>
        String(x.teamMemberName.toLowerCase()).includes(text.toLowerCase()) ||
        String(x.teamMemberLocation.toLowerCase()).includes(text.toLowerCase())
    );
    setTeamMembers(filteredData);
  };

  const submitTeamMembers = () => {
    if (selectedAdminMembers.length === 0) {
      alert("Please add at least one admin member");
    } else {
      // Send the selected admin members back to the previous screen
      navigation.navigate("AddCommunityEngagementScreen", {
        selectAdminTeamMembers: selectedAdminMembers,
      });
    }
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <NavHeader
            message="What would you like to do?"
          />
        </View>

        {/*header title section*/}
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitleItem}>Assign admin</Text>
        </View>
      </View>
    );
  }

  //search section
  function renderSearchFunctionSection() {
    return (
      <View style={styles.searchTextItem}>
        <View style={styles.innerSearchContainer}>
          <View style={styles.textInputContainer}>
            <TextInput
              value={value}
              onChangeText={(text) => searchUsername(text)}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Search"
              placeholderTextColor={COLORS.white}
              style={styles.inputsMember}
              enablesReturnKeyAutomatically
              textAlign="center"
            />
          </View>
          <FontAwesome name="search" size={16} color={COLORS.purple} style={{ top: Platform.OS === "ios" ? 0 : 5 }} />
        </View>
      </View>
    );
  }

  //content screen section
  function renderTeamMemberCollectionSection() {
    return (
      <>
        <FlatList
          data={teamMembers}
          keyExtractor={(index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <View key={index} style={styles.teamMemberContainer}>
                <View style={styles.teamMemberContent}>
                  <View style={styles.teamMemberImageContainer}>
                    <ImageBackground
                      source={images.userFrame}
                      style={styles.teamMemberGradientContainer}
                    >
                      <Image
                        source={item?.profileImage ? { uri: item?.profileImage } : images.defaultRounded}
                        style={styles.teamMemberImageItem}
                      />
                    </ImageBackground>
                  </View>

                  <View style={styles.teamMemberNameContainer}>
                    <View style={styles.teamMemberNameContent}>
                      <Text style={styles.teamMemberNameItem}>
                        {item?.firstName} {item?.lastName}
                      </Text>
                    </View>

                    <View style={styles.teamMemberDateContent}>
                      <Text style={styles.teamMemberDateItem}>
                        {item?.address}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.teamMemberAuthContainer}>
                    <Text
                      onPress={() => toggleSelectedAdminMember(item)}
                      style={[
                        styles.teamMemberAuthRepItem,
                        {
                          color: isSelectedItem(item)
                            ? COLORS.darkGray
                            : COLORS.purple,
                        },
                      ]}
                    >
                      {isSelectedItem(item)
                        ? "Remove"
                        : "Make admin"}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyFlatlistComponent />}
        />
      </>
    );
  }

  //done button section
  function renderDoneButtonSection() {
    return (
      <View style={styles.buttonContainer}>
        <View style={styles.buttonContent}>
          <Pressable
            onPress={handleSubmit(submitTeamMembers)}
            style={styles.doneContainer}
          >
            <View style={styles.doneGradientContainer}>
              <Text style={styles.doneTextItem}>
                Done
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    );
  }

  //screen content list
  function renderScreenContentList() {
    return (
      <>
        {renderHeaderSection()}
        {renderSearchFunctionSection()}
        <View style={styles.screenListContentContainer}>
          {renderTeamMemberCollectionSection()}
        </View>
        {renderDoneButtonSection()}
      </>
    );
  }

  return <View style={styles.container}>{renderScreenContentList()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  screenListContentContainer: {
    marginTop: 5,
    height: Platform.OS === "ios" ? "68%" : "70%",
  },

  //header section
  headerContainer: {
    marginTop: "0%",
  },
  headerTextContainer: {
    flexDirection: "row",
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
    marginBottom: 20,
    zIndex: 99,
  },
  headerTitleContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginRight: 40,
    marginLeft: 10,
    marginBottom: 20,
  },
  headerTitleItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },

  //search section
  searchTextItem: {
    flexDirection: "column",
    backgroundColor: COLORS.transparent,
  },
  innerSearchContainer: {
    flexDirection: "row",
    paddingVertical: Platform.OS === "ios" ? 10 : 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: COLORS.reechGray,
    marginBottom: 10,
  },
  textInputContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "93%",
  },
  inputsMember: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 14,
    width: "100%",
    alignItems: "center",
  },

  //team member section
  teamMemberContainer: {
    flexDirection: "column",
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
    borderRadius: 8,
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
    marginBottom: 10,
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
    width: "25%",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  teamMemberAuthRepItem: {
    fontSize: 14,
    fontFamily: "PoppinsLight",
    marginTop: 5,
    marginBottom: 8,
  },

  //button section
  buttonContainer: {
    position: "absolute",
    width: "30%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    right: 15,
    bottom: Platform.OS === "ios" ? 30 : 0,
  },
  buttonContent: {
    width: "100%",
  },
  doneContainer: {
    zIndex: 10,
  },
  doneGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    borderColor: COLORS.purple,
    borderWidth: 2,
    height: 45,
    width: "100%",
  },
  doneTextItem: {
    color: COLORS.purple,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
});

export default AssignAdminMemberScreen;
