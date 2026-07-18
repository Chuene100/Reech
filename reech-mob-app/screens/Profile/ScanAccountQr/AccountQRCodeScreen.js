import React from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

//customs
import { COLORS, images } from "../../../constants";
import { CustomShare } from "../../../components";
import NavHeader from "@/components/Headers/NavHeader";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const AccountQRCodeScreen = ({ route }) => {
  const user = route.params.user;

  const image = useSelector((state) => state.profile_images.profileImages);

  function renderQRcodeSection() {
    return (
      <View style={styles.qrCodeContainer}>
        <View style={styles.qrCodeContent}>
          {/*account image*/}
          <Image
            source={
              user?.profileImage
                ? { uri: image[user?.profileImage] ?? user?.profileImage }
                : images.defaultRounded
            }
            style={styles.userImage}
          />

          {/*username*/}
          <Text style={styles.userNameText}>
            {user?.firstName} {user?.lastName}
          </Text>

          {/*account qrCode*/}
          <Image source={images.qrcode} style={styles.qrCodeImage} />

          {/* card info*/}
          <Text style={styles.qrCodeInfo}>
            Share your QR code so others can be your bubble mates
          </Text>
        </View>
      </View>
    );
  }

  function renderShareQRcodeSection() {
    return (
      <View style={styles.shareContainer}>
        <CustomShare />
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeaderContainer}>
        <NavHeader
          to="ScanAccountQrCode"
          message="What would you like to do?"
          icon={<MaterialCommunityIcons name="qrcode-scan" size={24} color={COLORS.white} />}
        />
        {renderQRcodeSection()}
        {renderShareQRcodeSection()}
      </View>
    </View>
  );
};

export default AccountQRCodeScreen;

const styles = StyleSheet.create({
  //header section
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  screenHeaderContainer: {
    paddingTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  //qrCode section
  qrCodeContainer: {
    top: Platform.OS === "ios" ? 40 : 60,
    flexDirection: "column",
  },
  qrCodeContent: {
    top: "15%",
    padding: "5%",
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.purple,
    borderRadius: 15,
    borderEndColor: COLORS.white,
    borderEndWidth: 3,
    borderLeftColor: COLORS.white,
    borderLeftWidth: 3,
  },
  userImage: {
    width: Platform.OS === "ios" ? 130 : 90,
    height: Platform.OS === "ios" ? 130 : 90,
    resizeMode: "cover",
    borderRadius: 8,
    borderWidth: 3,
    borderColor: COLORS.purple,
    bottom: "15%",
  },
  userNameText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "PoppinsBold",
    bottom: "10%",
  },
  qrCodeImage: {
    width: Platform.OS === "ios" ? 250 : 180,
    height: Platform.OS === "ios" ? 250 : 180,
    bottom: "5%",
  },
  qrCodeInfo: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
    marginBottom: 10,
    textAlign: "center",
  },

  shareContainer: {
    top: Platform.OS === "ios" ? "20%" : "23%",
  },
});
