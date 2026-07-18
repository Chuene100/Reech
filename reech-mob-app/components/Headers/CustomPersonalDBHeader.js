import React from "react";
import {
  ImageBackground,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { FontAwesome, SimpleLineIcons } from "@expo/vector-icons";

//customs
import { COLORS, icons, images } from "../../constants";

const CustomPersonalDBHeader = () => {
  const user = useSelector((state) => state.user.current_user);

  return (
    <View style={styles.profilePersonalContainers}>
      {/*user image section*/}
      <ImageBackground source={images.userFrame} style={styles.imageContainer}>
        <Image
          source={
            user.profileImage
              ? { uri: user.profileImage }
              : images.defaultTransGradient
          }
          style={styles.profileImageItem}
        />
      </ImageBackground>

      {/*user name section*/}
      <View style={styles.profileTextContainer}>
        <Text style={styles.profileTextName}>{`${user?.firstName}'s`}</Text>
        <Text style={styles.profileTextItem}>Personal Dashboard</Text>

        {/*icon section*/}
        <View style={styles.profileIconContainer}>
          {/*pencil icon*/}
          <TouchableOpacity
            onPress={() => console.log("pencil icon pressed")}
            style={styles.profileIconContainer}
          >
            <SimpleLineIcons name="pencil" size={22} color={COLORS.white} />
          </TouchableOpacity>

          {/*faq icon*/}
          <TouchableOpacity
            onPress={() => console.log("faq icon pressed")}
            style={styles.profileIconContainer}
          >
            <FontAwesome
              name="question-circle-o"
              size={25}
              color={COLORS.white}
            />
          </TouchableOpacity>

          {/*pencil icon*/}
          <TouchableOpacity
            onPress={() => console.log("chat icon pressed")}
            style={styles.profileIconContainer}
          >
            <Image source={icons.chatIcon} style={styles.profileIconItem} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CustomPersonalDBHeader;

const styles = StyleSheet.create({
  //profile section
  profilePersonalContainers: {
    marginTop: 20,
    flexDirection: "row",
    marginBottom: 20,
  },
  imageContainer: {
    width: Platform.OS === "ios" ? 90 : 80,
    height: Platform.OS === "ios" ? 90 : 80,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageItem: {
    width: Platform.OS === "ios" ? 82 : 72,
    height: Platform.OS === "ios" ? 82 : 72,
    resizeMode: "cover",
    borderRadius: 8,
  },
  profileTextContainer: {
    width: "62%",
    left: 25,
    flexDirection: "column",
    justifyContent: "center",
  },
  profileTextName: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: "PoppinsBold",
  },
  profileTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight"
  },

  //profile icon section
  profileIconContainer: {
    width: "50%",
    marginTop: 5,
    left: Platform.OS === "ios" ? 20 : 15,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  profileIconContent: {
    width: "100%",
  },
  profileIconItem: {
    width: 25,
    height: 25,
    resizeMode: "cover",
  },
});
