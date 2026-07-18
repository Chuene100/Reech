import React, { useEffect } from "react";
import { Image, ImageBackground, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm, useWatch } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";

import { COLORS, images } from "../../../../../constants";
import { CustomInput } from "../../../../../components";
import NavHeader from "@/components/Headers/NavHeader";

const EditCardInfoScreen = ({ route }) => {
  const item = route.params.data;

  const navigation = useNavigation();

  const { control, setValue, handleSubmit } = useForm();

  const name = useWatch({ control, name: 'name' });

  useEffect(() => {
    setValue("name", item.name);
    setValue("description", item.description);
  }, [item])

  const storeWalletInformation = (data) => {
    console.log(data);
    navigation.navigate("ActivityDashboardScreen");
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader message="What would you like to do?" />

        <View style={styles.headerTitlesContainer}>
          <Text numberOfLines={2} style={styles.headerTitlesTextItem}>
            Editing {item.name} wallet
          </Text>
          <Text style={styles.headerTitlesSubTextItem}>
            Please modify your wallet details with the form inputs below.
          </Text>
        </View>
      </View>
    );
  }

  //wallet demo section
  function renderWalletIllustrationSection() {
    return (
      <View style={styles.walletsContentContainer}>
        <ImageBackground source={images.cf} style={styles.walletsImageContainer}>
          {/*wallet name section*/}
          <View style={styles.walletsNameContainer}>
            <Text style={styles.walletsNameTextItem}>{name ? name : item.name}</Text>
          </View>

          {/*wallet chip section*/}
          <View style={styles.walletsChipContainer}>
            <Image
              source={{
                uri: "https://usa.visa.com/dam/VCOM/regional/na/us/pay-with-visa/images/card-chip-800x450.png",
              }}
              style={styles.walletsChipImageItem}
            />
          </View>

          {/*wallet cvv and image section*/}
          <View style={styles.walletsDetailsContainer}>
            {/*wallet expiry section*/}
            <View style={styles.walletsExpiryContainer}>
              <Text style={styles.walletsExpiryTextItem}>
                {moment(item.createdAt).format("MM")} / {moment(item.createdAt).format("YY")}
              </Text>
              <Text style={styles.walletsNumberTextItem}>**********{item.walletTypeId}</Text>
            </View>

            {/*reech logo section*/}
            <View style={styles.walletReechLogoContainer}>
              <Image source={images.logoBlack} style={styles.walletsReechLogoImageItem} />
            </View>
          </View>
        </ImageBackground>
      </View>
    )
  }

  //edit wallet form section
  function renderWalletEditFormSection() {
    return (
      <View style={styles.editWalletFormContainer}>
        {/*edit wallet name item*/}
        <View style={styles.editWalletFormContentContainer}>
          <Text style={styles.editWalletFormHeaderTextItem}>Edit wallet name</Text>
          <CustomInput
            control={control}
            name={"name"}
            defaultValue={item.name}
            rules={{
              required: "Wallet name is required",
              pattern: {
                value: /^[aA-zZ\s]+$/,
                message:
                  "Your entry cannot contain numbers or special characters",
              },
              maxLength: {
                value: 25,
                message: "Wallet name must be at least 25 characters long",
              },
            }}
          />
        </View>

        {/*edit wallet description item*/}
        <View style={styles.editWalletFormContentContainer}>
          <Text style={styles.editWalletFormHeaderTextItem}>Edit wallet description</Text>
          <CustomInput
            control={control}
            name={"description"}
            defaultValue={item.description}
            rules={{
              required: "Wallet description is required",
              pattern: {
                value: /^[aA-zZ\s]+$/,
                message:
                  "Your entry cannot contain numbers or special characters",
              },
              maxLength: {
                value: 100,
                message: "Wallet name must be at least 100 characters long",
              },
            }}
          />
        </View>
      </View>
    )
  }

  //edit wallet button section
  function renderEditWalletButtonSection() {
    return (
      <View style={styles.editWalletButtonContainer}>
        <Pressable
          onPress={handleSubmit(storeWalletInformation)}
          style={styles.editWalletCardButtonContainer}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
            style={styles.editWalletCardButtonGradientContainer}
          >
            <Text style={styles.editWalletCardButtonTextItem}>Edit wallet</Text>
          </LinearGradient>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {renderHeaderSection()}
      {renderWalletIllustrationSection()}
      {renderWalletEditFormSection()}
      {renderEditWalletButtonSection()}
    </View>
  );
};

export default EditCardInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerContainer: {
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },
  headerTitlesContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitlesTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  headerTitlesSubTextItem: {
    marginTop: 10,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    textAlign: "center",
  },

  //wallet demo section
  walletsContentContainer: {
    width: "100%",
    marginTop: 19,
    paddingHorizontal: 20,
  },
  walletsImageContainer: {
    width: Platform.OS === "ios" ? 390 : 330,
    height: Platform.OS === "ios" ? 200 : 190,
    paddingVertical: 10,
    paddingHorizontal: 15,
    resizeMode: "cover",
    borderRadius: 25,
    overflow: "hidden",
  },
  walletsNameContainer: {
    width: "100%",
    flexDirection: "column",
  },
  walletsNameTextItem: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "PoppinsBold",
  },
  walletsChipContainer: {
    width: "100%",
    height: 50,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  walletsChipImageItem: {
    width: 50,
    height: 50,
    resizeMode: "cover",
  },
  walletsDetailsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  walletsExpiryContainer: {
    width: "45%",
    flexDirection: "column",
    justifyContent: "center",
  },
  walletsExpiryTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  walletsNumberTextItem: {
    marginTop: 5,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    marginBottom: 10,
  },
  walletsReechLogoContainer: {
    width: "45%",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  walletsReechLogoImageItem: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },

  //edit wallet form section
  editWalletFormContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  editWalletFormContentContainer: {
    flexDirection: "column",
    marginBottom: 20,
  },
  editWalletFormHeaderTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },

  //edit button section
  editWalletButtonContainer: {
    width: "100%",
    marginTop: 20,
  },
  editWalletCardButtonContainer: {
    paddingHorizontal: 10,
  },
  editWalletCardButtonGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 45,
  },
  editWalletCardButtonTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
});
