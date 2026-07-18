import React, { useState } from "react";
import { FlatList, Image, ImageBackground, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons, Octicons, Fontisto } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";

//custom
import { customerWalletItems } from "../../../../../assets/data/dashboardData/paymentTransactionData";
import { COLORS, images } from "../../../../../constants";
import { EmptyFlatlistComponent } from "../../../../../components";
import NavHeader from "@/components/Headers/NavHeader";

const CardListScreen = () => {
  const navigation = useNavigation();

  //state handlers
  const [walletData, setWalletData] = useState(customerWalletItems);
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = () => {
    setWalletData(customerWalletItems);
    setIsFetching(false);
  };

  const onRefresh = () => {
    setIsFetching(true);
    fetchData(walletData);
  };

  //delete wallet function
  const deleteWallet = (index) => {
    const updatedWalletData = [...walletData];
    updatedWalletData.splice(index, 1);

    setWalletData(updatedWalletData);
    setIsFetching(true);

    setTimeout(() => {
      setIsFetching(false);
    }, 3000);
  };

  //deactivate wallet
  const deactivateButtonPressed = (item) => {
    item.status === 0 ? (item.status = 1) : (item.status = 0);
    setIsFetching(true);

    setTimeout(() => {
      setIsFetching(false);
    }, 3000);
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader message="What would you like to do?" />

        {/*Screen Heading*/}
        <View style={styles.headerWalletHeaderContainer}>
          <Text style={styles.headerWalletTextItem}>Your wallets</Text>
          <Ionicons
            onPress={() => navigation.navigate("AddCardInfoScreen")}
            name="add-circle-sharp"
            size={22}
            color={COLORS.white}
          />
        </View>

        <Text style={styles.headerWalletInfoTextItem}>
          Manage all your previously created wallets on this screen.
          Choose to disable and active some of your wallets.
        </Text>
      </View>
    );
  }

  function renderYourWalletCollectionSection() {
    return (
      <View style={styles.yourWalletContainer}>
        <FlatList
          data={walletData}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={onRefresh}
          refreshing={isFetching}
          renderItem={({ item, index }) => {
            return (
              <View key={index} style={styles.yourWalletContentContainer}>
                {/*wallet image section*/}
                <View style={styles.yourWalletContentsContainer}>
                  <ImageBackground source={images.cf} style={styles.yourWalletImageContainer}>
                    {/*wallet name section*/}
                    <View style={styles.yourWalletNameContainer}>
                      <Text style={styles.yourWalletNameTextItem}>{item.name}</Text>
                    </View>

                    {/*wallet chip section*/}
                    <View style={styles.yourWalletChipContainer}>
                      <Image
                        source={{
                          uri: "https://usa.visa.com/dam/VCOM/regional/na/us/pay-with-visa/images/card-chip-800x450.png",
                        }}
                        style={styles.yourWalletChipImageItem}
                      />
                    </View>

                    {/*wallet cvv and image section*/}
                    <View style={styles.yourWalletDetailsContainer}>
                      {/*wallet expiry section*/}
                      <View style={styles.yourWalletExpiryContainer}>
                        <Text style={styles.yourWalletExpiryTextItem}>
                          {moment(item.createdAt).format("MM")} / {moment(item.createdAt).format("YY")}
                        </Text>
                        <Text style={styles.yourWalletNumberTextItem}>**********{item.walletTypeId}</Text>
                      </View>

                      {/*reech logo section*/}
                      <View style={styles.yourWalletReechLogoContainer}>
                        <Image source={images.logoBlack} style={styles.yourWalletReechLogoImageItem} />
                      </View>
                    </View>
                  </ImageBackground>
                </View>

                {/*wallet description section*/}
                <View style={styles.yourWalletDescriptionContainer}>
                  <Text style={styles.yourWalletDescriptionTextItem}>
                    {item.description}
                  </Text>
                </View>

                {/*wallet status & manage button section*/}
                <View style={styles.yourWalletStatusContainer}>
                  <View style={styles.yourWalletStatusContentContainer}>
                    <Text style={styles.yourWalletStatusTextItem}>Wallet status {"  "}</Text>
                    <Octicons
                      name="dot-fill"
                      size={18}
                      color={item.status === 1 ? COLORS.green : COLORS.coralRed}
                    />
                  </View>

                  <View style={styles.yourWalletActionsContainer}>
                    {item.status === 1 && <View
                      style={styles.yourWalletActionsIconContainer}
                    >
                      <MaterialCommunityIcons
                        onPress={() => navigation.navigate("EditCardInfoScreen", { data: item })}
                        name="credit-card-edit-outline"
                        size={24}
                        color={COLORS.greenActive}
                      />
                    </View>}

                    <View style={styles.yourWalletActionsIconContainer}>
                      <Fontisto
                        onPress={() => deleteWallet(index)}
                        name="trash"
                        size={18}
                        color={COLORS.coralRed}
                      />
                    </View>
                  </View>
                </View>

                {/*activate button section*/}
                <View style={styles.activateButtonContentContainer}>
                  <Pressable
                    onPress={() => deactivateButtonPressed(item)}
                    style={styles.activateButtonContainer}
                    disabled={isFetching}
                  >
                    <LinearGradient
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
                      style={styles.activateButtonGradientContainer}
                    >
                      <Text style={styles.activateButtonTextItem}>
                        {item.status === 1 ? "Deactivate" : "Activate"}
                      </Text>
                    </LinearGradient>
                  </Pressable>
                </View>

                <View style={styles.walletLineSeparator} />
              </View>
            )
          }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={styles.flatListWalletFooter} />}
          ListEmptyComponent={
            <View style={styles.flatListEmptyWallet}>
              <EmptyFlatlistComponent
                msg={"You currently do not have any active wallets associated with your account. Please create one."}
              />
            </View>
          }
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeaderSection()}
      {renderYourWalletCollectionSection()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerContainer: {
    zIndex: 99,
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },
  headerWalletHeaderContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerWalletTextItem: {
    justifyContent: "center",
    alignItems: "center",
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  headerWalletInfoTextItem: {
    paddingHorizontal: 25,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    textAlign: "center",
    marginBottom: 10,
  },

  //your wallet content section
  yourWalletContainer: {
    width: "100%",
    paddingHorizontal: 20,
    flexDirection: "column",
  },
  yourWalletContentContainer: {
    flexDirection: "column",
  },
  flatListWalletFooter: {
    marginBottom: Platform.OS === "ios" ? "60%" : "35%",
  },
  flatListEmptyWallet: {
    marginTop: "30%",
    justifyContent: "center",
    alignItems: "center",
  },

  //wallet image section
  yourWalletContentsContainer: {
    marginTop: 5,
    flexDirection: "column",
    marginBottom: 10,
  },
  yourWalletImageContainer: {
    width: Platform.OS === "ios" ? 390 : 320,
    height: Platform.OS === "ios" ? 190 : 190,
    paddingVertical: 10,
    paddingHorizontal: 15,
    resizeMode: "cover",
    borderRadius: 25,
    overflow: "hidden",
  },
  yourWalletNameContainer: {
    width: "100%",
    flexDirection: "column",
  },
  yourWalletNameTextItem: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "PoppinsBold",
  },
  yourWalletChipContainer: {
    width: "100%",
    height: 40,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  yourWalletChipImageItem: {
    width: 50,
    height: 50,
    resizeMode: "cover",
  },
  yourWalletDetailsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  yourWalletExpiryContainer: {
    width: "45%",
    flexDirection: "column",
    justifyContent: "center",
  },
  yourWalletExpiryTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  yourWalletNumberTextItem: {
    marginTop: 5,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    marginBottom: 10,
  },
  yourWalletReechLogoContainer: {
    width: "45%",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  yourWalletReechLogoImageItem: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },

  //wallet status section
  yourWalletStatusContainer: {
    width: "100%",
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  yourWalletStatusContentContainer: {
    width: "70%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  yourWalletStatusTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  yourWalletActionsContainer: {
    width: "30%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  yourWalletActionsIconContainer: {
    width: "45%",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  yourWalletDescriptionContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  yourWalletDescriptionTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //activate button section
  activateButtonContentContainer: {
    width: "100%",
    marginTop: 10,
    flexDirection: "column",
  },
  activateButtonContainer: {
    paddingHorizontal: 20,
  },
  activateButtonGradientContainer: {
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  activateButtonTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  walletLineSeparator: {
    width: "95%",
    marginTop: 10,
    alignSelf: "center",
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: COLORS.darkGray,
    marginBottom: 15,
  },
});

export default CardListScreen;
