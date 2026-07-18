import images from "@/constants/images";
import { COLORS } from "@/constants/theme";
import React from "react";
import { Image, ImageBackground, Platform, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

const BoxAvatar = ({user}) => {
    const image = useSelector((state) => state.profile_images.profileImages);
    
    return (
        <>
        {user.verified && (
        <ImageBackground
            source={images.businessFrame}
            style={styles.imageItem}
        >
            <Image
            source={user.avatar ?
                { uri: image[user.avatar] ?? user.avatar } :
                user.profileImage ? 
                { uri: image[user.profileImage] ?? user.profileImage } :
                images.defaultRounded
            }
            resizeMode="cover"
            style={styles.userPicVerified}
            />
        </ImageBackground>
        )}

        {!user?.verified && (
        <ImageBackground
            source={images.userFrame}
            style={styles.imageItem}
        >
            <Image
            source={user.avatar ?
                { uri: image[user.avatar] ?? user.avatar } :
                user.profileImage ? 
                { uri: image[user.profileImage] ?? user.profileImage } :
                images.u1
            }
            resizeMode="cover"
            style={styles.userPic}
            />
        </ImageBackground>
        )}
        </>
    );
}

const styles = StyleSheet.create({
    messageContainer: {
        flex: 1,
        top: Platform.OS === "ios" ? 420 : 380,
        marginBottom: Platform.OS === "android" ? "-70%" : "-70%",
        marginTop: "-100%",
      },
      messageContent: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: "column",
      },
      messageItems: {
        flexDirection: "row",
        justifyContent: "space-between",
      },
      imageItem: {
        width: Platform.OS === "ios" ? 80 : 68,
        height: Platform.OS === "ios" ? 80 : 68,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
      },
      userPic: {
        width: Platform.OS === "ios" ? 72 : 60,
        height: Platform.OS === "ios" ? 72 : 60,
        borderRadius: 8,
        borderColor: COLORS.black,
      },
      userPicVerified: {
        width: Platform.OS === "ios" ? 72 : 60,
        height: Platform.OS === "ios" ? 72 : 60,
        borderRadius: 8,
        borderColor: COLORS.black,
      },
      textContainer: {
        width: "65%",
        flexDirection: "column",
        marginTop: "5%",
        marginLeft: "3%",
      },
      username: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "600",
      },
      userMessage: {
        marginTop: "2%",
        color: COLORS.white,
        fontSize: 12,
        fontWeight: "400",
      },
      dateContainer: {
        width: "20%",
        flexDirection: "column",
        marginTop: Platform.OS === "ios" ? "11%" : "12%",
        marginLeft: "4%",
      },
      timeFrame: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: "400",
      },
    
      //icon section
      iconContainer: {
        flexDirection: "row",
      },
      iconContent: {
        width: 50,
        height: 40,
        bottom: Platform.OS === "ios" ? 42 : "10%",
        left: 10,
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        borderWidth: 3,
        borderColor: COLORS.purpleDark,
        backgroundColor: COLORS.transparent,
      },
});
    

export default BoxAvatar;