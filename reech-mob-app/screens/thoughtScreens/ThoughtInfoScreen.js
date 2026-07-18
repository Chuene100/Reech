import React from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  ImageBackground,
  Platform,
} from "react-native";

//customs
import { COLORS, images } from "../../constants";
import NavHeader from "@/components/Headers/NavHeader";
import moment from "moment";

const ThoughtInfoScreen = ({ route }) => {
  const userTitle = route.params.userTitle;
  const blurb = route.params.blurb;
  const userAccountImage = route.params.userAccountImage;
  const postedImage = route.params.postedImage;
  const thoughtType = route.params.thoughtType;
  const datePosted = route.params.datePosted;
  const location = route.params.location;
  const fullDescription = route.params.fullDescription;
  const fullDescriptionPoints = route.params.fullDescriptionPoints;

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.thoughInfoTopContainer}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  //content section
  function renderContentSection() {
    return (
      <View style={styles.contentItemContainer}>
        {/*user post image*/}
        <View style={styles.userPostImageContainer}>
          {/*user description section*/}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.userPostDescriptionContainer}
          >
            {/*image section*/}
            <View style={styles.userInfoSection}>
              <ImageBackground
                source={images.userFrame}
                style={styles.userImageContainer}
              >
                <Image source={{ uri: userAccountImage }} style={styles.userImageItem} />
              </ImageBackground>

              {/*userName container*/}
              <View style={styles.userNameItemContainer}>
                <Text style={styles.userNameItem}>{userTitle}</Text>
                <Text numberOfLines={2} style={styles.userBlurbItem}>
                  {blurb}
                </Text>
                <Text style={styles.userDateItem}>
                  {moment(datePosted).fromNow() + " • " + thoughtType + " • " + location}
                </Text>
              </View>
            </View>

            {/*thought image item*/}
            <Image source={{ uri: postedImage }} style={styles.userPostImageItem} />

            {/*thought description item*/}
            <Text style={styles.userPostDescriptionItem}>
              {fullDescription}
            </Text>

            <FlatList
              data={fullDescriptionPoints}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                return (
                  <View style={styles.userDescriptionPointsContainer}>
                    <Text style={styles.userDescriptionHeadingItem}>
                      {item.id + ")"} {item.fullDescriptionPointHeading} {"\n"}
                    </Text>
                    <Text style={styles.userPostDescriptionItem}>
                      {item.fullDescriptionPointContent}
                    </Text>
                  </View>
                );
              }}
              contentContainerStyle={styles.contentContainer}
              showsHorizontalScrollIndicator={false}
              ListFooterComponent={<View style={styles.listFooterStyle}></View>}
            />
          </ScrollView>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      {renderHeaderSection()}
      {renderContentSection()}
    </View>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  contentContainer: {
    paddingHorizontal: 0,
    flexDirection: "column",
  },
  listFooterStyle: {
    marginBottom: Platform.OS === "ios" ? "40%" : "30%",
  },

  thoughInfoTopContainer: {
    zIndex: 99,
    marginTop: Platform.OS === "ios" ? "11%" : "0%",
    height: Platform.OS === "ios" ? "2%" : "4%",
    backgroundColor: COLORS.black,
  },

  //content section
  contentItemContainer: {
    top: Platform.OS === "ios" ? -20 : -30,
    flexDirection: "column",
  },
  userInfoSection: {
    flexDirection: "row",
  },
  userImageContainer: {
    marginHorizontal: 10,
    width: Platform.OS === "ios" ? 90 : 80,
    height: Platform.OS === "ios" ? 90 : 80,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  userImageItem: {
    left: 0,
    top: 0,
    width: Platform.OS === "ios" ? 83 : 73,
    height: Platform.OS === "ios" ? 83 : 74,
    borderRadius: 8,
  },
  userNameItemContainer: {
    width: "70%",
    justifyContent: "center",
    flexDirection: "column",
  },
  userNameItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  userBlurbItem: {
    marginVertical: 2,
    color: COLORS.darkGray,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  userDateItem: {
    color: COLORS.darkGray,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //user post image section
  userPostImageContainer: {
    top: 50,
    flexDirection: "column",
  },
  userPostImageItem: {
    marginTop: 15,
    marginBottom: 10,
    width: "105%",
    height: 280,
  },
  userPostDescriptionContainer: {
    maxHeight: "100%",
    marginHorizontal: 0,
  },
  userPostDescriptionItem: {
    paddingHorizontal: 5,
    color: COLORS.white,
    fontFamily: "PoppinsLight",
    fontSize: 14,
  },

  //description points section
  userDescriptionPointsContainer: {
    marginHorizontal: 5,
    width: 350,
    marginTop: 35,
  },
  userDescriptionHeadingItem: {
    color: COLORS.white,
    fontFamily: "PoppinsBold",
    fontSize: 14,
  },
});

export default ThoughtInfoScreen;
