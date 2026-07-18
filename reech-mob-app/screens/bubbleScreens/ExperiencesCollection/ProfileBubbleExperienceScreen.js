import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text, Platform } from "react-native";

//import customs
import { COLORS, images } from "../../../constants";
import { ExperienceNavigation } from "../../../Navigations";
import { useListMyBubblesQuery } from "../../../redux/api/bubble";
import NavHeader from "@/components/Headers/NavHeader";
import { Ionicons } from "@expo/vector-icons";

const ProfileBubbleExperienceScreen = ({ route }) => {
  const { profileId } = route.params;

  const { data: myBubblesFeed } = useListMyBubblesQuery(profileId);

  /*
    image changes from:  MIDNIGHT, DAWN, MORNING, MIDDAY, AFTERNOON, DUSK, EVENING 
    images have been sorted based on the text above, below (url's).
  */

  const imgArray = [
    "https://images.unsplash.com/photo-1603453888562-5a95c3e75da0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
    "https://images.unsplash.com/photo-1524410772295-a22611c91129?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=681&q=80",
    "https://images.unsplash.com/photo-1567304441104-d7a7d3e4bc1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=869&q=80",
    "https://images.unsplash.com/photo-1633458942455-a52fabc1b5fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1031&q=80",
    "https://images.unsplash.com/photo-1514519334989-3d5c8b1a9f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    "https://images.unsplash.com/photo-1503602164195-4c69be2bf9b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    "https://images.unsplash.com/photo-1571059315710-3d2b5573f095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  ];

  const date = new Date();
  const time = date.getHours();
  const [counter, setCounter] = useState(0);

  const dayTime = time;
  dayTime.toLocaleString();

  useEffect(() => {
    if (dayTime == 0) {
      setCounter(0);
    } else if (dayTime == 4 || dayTime <= 6) {
      setCounter(1);
    } else if (dayTime == 7 || dayTime <= 9) {
      setCounter(2);
    } else if (dayTime == 10 || dayTime <= 13) {
      setCounter(3);
    } else if (dayTime == 14 || dayTime <= 17) {
      setCounter(4);
    } else if (dayTime == 18 || dayTime <= 21) {
      setCounter(5);
    } else if (dayTime >= 22 || dayTime == 23) {
      setCounter(6);
    }
  }, [dayTime]);

  // `image` is derived state from the image array
  const image = imgArray[counter];

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader
          icon={<Ionicons name="add-circle" size={24} color={COLORS.white} />}
          bubbleModal={true}
        />
      </View>
    );
  }

  function renderCoverImageSection() {
    return (
      <View style={styles.coverImageContainer}>
        <View style={styles.coverImageContent}>
          {/*Cover Image content*/}
          <Image source={images.bg4} style={styles.coverImage} />
          <View style={styles.coverContentItems}>
            <Text
              style={[
                styles.coverImageText,
                {
                  // color:
                  //   counter == 3 || counter == 4 ? COLORS.black : COLORS.white,
                  color: COLORS.white,
                },
              ]}
            >
              Work experiences
            </Text>
          </View>
        </View>
      </View>
    );
  }

  function renderNavigation() {
    return (
      <View style={styles.profileCentents}>
        <View style={styles.profileContent}>
          <View style={styles.navigationContainer}>
            <ExperienceNavigation Feed={myBubblesFeed?.data} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeaderSection()}
      {renderCoverImageSection()}
      {renderNavigation()}
    </View>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerContainer: {
    marginTop: Platform.OS === "ios" ? "9%" : "0%",
    paddingVertical: 5,
  },
  coverImageContainer: {
    flex: 1,
  },
  coverImageContent: {
    flexDirection: "column",
    marginTop: "5%",
    marginHorizontal: "5%",
  },
  coverImage: {
    width: Platform.OS === "ios" ? "111%" : "108%",
    height: 150,
    right: Platform.OS === "ios" ? 20 : 10,
    resizeMode: "cover",
    borderRadius: 10,
  },
  coverContentItems: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  coverImageText: {
    marginLeft: Platform.OS === "ios" ? "25%" : "24%",
    marginTop: Platform.OS === "ios" ? "-23%" : "-30%",
    color: COLORS.white,
    fontSize: 26,
    fontFamily: "PoppinsLight",
  },

  // {profile accounts}

  profileCentents: {
    top: Platform.OS === "ios" ? 0 : "28%",
    flexDirection: "column",
  },
  profileContent: {
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: COLORS.transparent,
  },
  pics: {
    top: "110%",
    height: 0,
    width: 80,
    marginHorizontal: Platform.OS === "ios" ? 25 : 20,
  },
  picItem: {
    width: 75,
    height: 75,
    borderRadius: 50,
  },
  active: {
    width: 75,
    height: 75,
    borderRadius: 50,
    borderColor: COLORS.purple,
    borderWidth: 3,
  },
  profilePic: {
    height: 100,
  },
  jobTitle: {
    alignSelf: "center",
    right: 5,
    marginVertical: "-28%",
    fontFamily: "PoppinsLight",
    fontSize: 12,
    color: COLORS.white,
  },

  //navigation
  navigationContainer: {
    flex: 2.1,
    marginHorizontal: -55,
  },
});

export default ProfileBubbleExperienceScreen;
