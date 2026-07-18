import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

//custom
import { COLORS, SIZES, FONTS, images, icons } from "../../constants";

const AccountQRShare = () => {
  return (
    <View style={styles.bottomShareMethodsContainer}>
      <Text style={styles.bottomHeader}>Connect with me here too</Text>

      <View style={styles.bottomOptionsContainer}>
        {/* share on instagram */}
        <TouchableOpacity
          style={styles.bottomOptionItem}
          onPress={() => console.log("instagram")}
        >
          <View style={styles.iconContainer}>
            <Image
              source={images.In}
              resizeMode="cover"
              style={[styles.iconItem, { borderRadius: 50 }]}
            />
          </View>
          <Text style={styles.iconText}>Instagram</Text>
        </TouchableOpacity>

        {/* share on whatsapp */}
        <TouchableOpacity
          style={styles.bottomOptionItem}
          onPress={() => console.log("whatsapp")}
        >
          <View style={styles.iconContainer}>
            <Image
              source={images.wa}
              resizeMode="cover"
              style={styles.iconItem}
            />
          </View>
          <Text style={styles.iconText}>WhatsApp</Text>
        </TouchableOpacity>

        {/* share on facebook */}
        <TouchableOpacity
          style={styles.bottomOptionItem}
          onPress={() => console.log("facebook")}
        >
          <View style={styles.iconContainer}>
            <Image
              source={images.fb}
              resizeMode="cover"
              style={[styles.iconItem, { borderRadius: 50 }]}
            />
          </View>
          <Text style={styles.iconText}>Facebook</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomOptionsContainer}>
        {/* share via sms */}
        <TouchableOpacity
          style={styles.bottomOptionItem}
          onPress={() => console.log("sms")}
        >
          <View style={styles.iconContainer}>
            <Image
              source={icons.phone}
              resizeMode="cover"
              style={[styles.iconItem, { tintColor: COLORS.white }]}
            />
          </View>
          <Text style={styles.iconText}>SMS</Text>
        </TouchableOpacity>

        {/* share on messenger */}
        <TouchableOpacity
          style={styles.bottomOptionItem}
          onPress={() => console.log("sms")}
        >
          <View style={styles.iconContainer}>
            <Image
              source={images.ms}
              resizeMode="cover"
              style={styles.iconItem}
            />
          </View>
          <Text style={styles.iconText}>Messenger</Text>
        </TouchableOpacity>

        {/* share on email */}
        <TouchableOpacity
          style={styles.qrCodeIcon}
          onPress={() => console.log("QR code")}
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name="attach-email" size={24} color="white" />
          </View>
          <Text style={styles.iconText}>Email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  //bottom section
  bottomShareMethodsContainer: {
    position: "relative",
    top: "0%",
    left: 0,
    right: 0,
    height: 220,
    padding: SIZES.padding * 3,
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
    backgroundColor: COLORS.black,
  },
  bottomHeader: {
    ...FONTS.h4,
    color: COLORS.white,
    alignSelf: "center",
  },
  bottomOptionsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: SIZES.padding * 2,
  },
  bottomOptionItem: {
    width: "35%",
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.transparent,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  iconItem: {
    height: 25,
    width: 25,
  },
  iconText: {
    paddingHorizontal: 10,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },
  qrCodeIcon: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 0,
  },
});

export default AccountQRShare;
