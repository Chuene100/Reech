import React from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

//customs
import { COLORS, images } from "../../../constants";
import { AccountQRShare } from "../../../components";
import NavHeader from "@/components/Headers/NavHeader";
import { useReadUserQuery } from "../../../redux/api/api-slice";

const AccountUserQRCodeScreen = ({ route }) => {
  const navigation = useNavigation();

  const { userId } = route.params;

  const image = useSelector((state) => state.users_images.usersImages);

  const {
    data: user,
    error: fetchError,
    isLoading,
  } = useReadUserQuery(userId ?? null);

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
        <AccountQRShare />
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeaderContainer}>
        <NavHeader
          message="What would you like to do?"
        />
        {renderQRcodeSection()}
        {renderShareQRcodeSection()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  //header section
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  screenHeaderContainer: {
    paddingTop: "12%",
  },

  //qrCode section
  qrCodeContainer: {
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
    borderRadius: 100,
    borderWidth: 3,
    borderColor: COLORS.purple,
    bottom: "15%",
  },
  userNameText: {
    color: COLORS.white,
    fontSize: 24,
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
  },

  shareContainer: {
    top: "20%",
  },
});

export default AccountUserQRCodeScreen;
