import React, { useEffect, useState } from "react";
import { Image, ImageBackground, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm, useWatch } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";

import { COLORS, images } from "../../../../../constants";
import { CustomInput } from "../../../../../components";
import NavHeader from "@/components/Headers/NavHeader";

const AddCardInfoScreen = () => {
  const navigation = useNavigation();

  const { control, handleSubmit, reset } = useForm();

  const name = useWatch({ control, name: "name" });

  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState('');

  useEffect(() => {
    const now = moment();
    const formattedMonth = now.format('MM');
    const formattedYear = now.add("years", 4).format('YY');
    setCurrentMonth(formattedMonth);
    setCurrentYear(formattedYear);
  }, []);

  const storeWalletInformation = (data) => {
    console.log(data);
    navigation.navigate("CardListScreen");
    reset();
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader message="What would you like to do?" />

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitleTextItem}>Add a new wallet</Text>
          <Text style={styles.headerTitleSubTextItem}>
            Use this wallet for transactions, such as settling payments with
            your bubble mates, upgrading your subscriptions, and conducting other
            transactions within the Reech app. Rest assured, your card information
            will not be disclosed to any third parties.
          </Text>
        </View>
      </View>
    );
  }

  //wallet demo section
  function renderWalletIllustrationSection() {
    return (
      <View style={styles.walletContentContainer}>
        <ImageBackground source={images.cf} style={styles.walletImageContainer}>
          {/*wallet name section*/}
          <View style={styles.walletNameContainer}>
            <Text style={styles.walletNameTextItem}>{name}</Text>
          </View>

          {/*wallet chip section*/}
          <View style={styles.walletChipContainer}>
            <Image
              source={{
                uri: "https://usa.visa.com/dam/VCOM/regional/na/us/pay-with-visa/images/card-chip-800x450.png",
              }}
              style={styles.walletChipImageItem}
            />
          </View>

          {/*wallet cvv and image section*/}
          <View style={styles.walletDetailsContainer}>
            {/*wallet expiry section*/}
            <View style={styles.walletExpiryContainer}>
              <Text style={styles.walletExpiryTextItem}>{currentMonth} / {currentYear}</Text>
              <Text style={styles.walletNumberTextItem}>**********2826</Text>
            </View>

            {/*reech logo section*/}
            <View style={styles.walletReechLogoContainer}>
              <Image source={images.logoBlack} style={styles.walletReechLogoImageItem} />
            </View>
          </View>
        </ImageBackground>
      </View>
    )
  }

  //wallet form section
  function renderWalletCreationFormSection() {
    return (
      <View style={styles.walletFormContainer}>
        {/*wallet name item*/}
        <View style={styles.walletFormContentContainer}>
          <Text style={styles.walletFormHeaderTextItem}>Wallet name</Text>
          <CustomInput
            control={control}
            name={"name"}
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

        {/*wallet description item*/}
        <View style={styles.walletFormContentContainer}>
          <Text style={styles.walletFormHeaderTextItem}>Wallet description</Text>
          <CustomInput
            control={control}
            name={"description"}
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

  //create wallet button section
  function renderCreateWalletButtonSection() {
    return (
      <View style={styles.walletButtonContainer}>
        <Pressable
          onPress={handleSubmit(storeWalletInformation)}
          style={styles.walletCardButtonContainer}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
            style={styles.walletCardButtonGradientContainer}
          >
            <Text style={styles.walletCardButtonTextItem}>Add wallet</Text>
          </LinearGradient>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {renderHeaderSection()}
      {renderWalletIllustrationSection()}
      {renderWalletCreationFormSection()}
      {renderCreateWalletButtonSection()}
    </View>
  );
};

export default AddCardInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerContainer: {
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },
  headerTitleContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  headerTitleSubTextItem: {
    marginTop: 10,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    textAlign: "center",
  },

  //wallet demo section
  walletContentContainer: {
    width: "100%",
    marginTop: 19,
    paddingHorizontal: 20,
  },
  walletImageContainer: {
    width: Platform.OS === "ios" ? 390 : 330,
    height: Platform.OS === "ios" ? 200 : 190,
    paddingVertical: 10,
    paddingHorizontal: 15,
    resizeMode: "cover",
    borderRadius: 25,
    overflow: "hidden",
  },
  walletNameContainer: {
    width: "100%",
    flexDirection: "column",
  },
  walletNameTextItem: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "PoppinsBold",
  },
  walletChipContainer: {
    width: "100%",
    height: 50,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  walletChipImageItem: {
    width: 50,
    height: 50,
    resizeMode: "cover",
  },
  walletDetailsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  walletExpiryContainer: {
    width: "45%",
    flexDirection: "column",
    justifyContent: "center",
  },
  walletExpiryTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  walletNumberTextItem: {
    marginTop: 5,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    marginBottom: 10,
  },
  walletReechLogoContainer: {
    width: "45%",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  walletReechLogoImageItem: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },

  //wallet form section
  walletFormContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  walletFormContentContainer: {
    flexDirection: "column",
    marginBottom: 20,
  },
  walletFormHeaderTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },

  //button section
  walletButtonContainer: {
    width: "100%",
    marginTop: 20,
  },
  walletCardButtonContainer: {
    paddingHorizontal: 10,
  },
  walletCardButtonGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 45,
  },
  walletCardButtonTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
});
