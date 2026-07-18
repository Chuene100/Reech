import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";

//customs
import { COLORS } from "../../constants";

const TransactionHeader = ({ text }) => {
  const navigation = useNavigation();

  return (
    <>
      <View style={styles.headingTextContainer}>
        <Text style={styles.headingTextItem}>{text}</Text>
        <View style={styles.moreOptionLiner} />
      </View>

      {/*scan section*/}
      <TouchableOpacity
        onPress={() => navigation.navigate("ScanAccountQrCode")}
        style={styles.scanContainer}
      >
        <MaterialCommunityIcons
          name="qrcode-scan"
          size={22}
          color={COLORS.white}
        />
        <Text style={styles.scanText}>Scan QR code to pay with Reech</Text>
        <Entypo name="chevron-right" size={22} color={COLORS.white} />
      </TouchableOpacity>
    </>
  );
};

export default TransactionHeader;

const styles = StyleSheet.create({
  //header search section
  headingTextContainer: {
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  headingTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  moreOptionLiner: {
    marginTop: 10,
    opacity: 0.6,
    alignSelf: "center",
    width: "65%",
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 3,
  },

  //scan section
  scanContainer: {
    marginVertical: 15,
    paddingHorizontal: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scanText: {
    alignSelf: "center",
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
});
