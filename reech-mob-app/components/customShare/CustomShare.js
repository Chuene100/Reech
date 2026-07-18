import React from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

//custom
import { COLORS, SIZES, images, icons } from "../../constants";

const CustomShare = () => {
  return (
    <View style={styles.bottomShareMethodsContainer}>
      <Text style={styles.bottomHeader}>Share to</Text>

      <View style={styles.bottomOptionsContainer}>
        {/* download qr code */}
        <TouchableOpacity
          style={styles.bottomOptionItem}
          onPress={() => console.log("download")}
        >
          <View style={styles.iconContainer}>
            <AntDesign
              name="download"
              size={24}
              color={COLORS.white}
              style={styles.iconItem}
            />
          </View>
          <Text style={styles.iconText}>Download</Text>
        </TouchableOpacity>

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

      <View style={styles.bottomOptionsContainer}>
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
    </View>
  );
};

export default CustomShare;

const styles = StyleSheet.create({
  //bottom section
  bottomShareMethodsContainer: {
    position: "relative",
    height: Platform.OS === "ios" ? 220 : 180,
    padding: SIZES.padding * 3,
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
    backgroundColor: COLORS.black,
  },
  bottomHeader: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    alignSelf: "center",
  },
  bottomOptionsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 15,
  },
  bottomOptionItem: {
    width: "35%",
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  iconItem: {
    height: 25,
    width: 25,
  },
  iconText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    alignSelf: "center",
  },
  qrCodeIcon: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 0,
  },
});
