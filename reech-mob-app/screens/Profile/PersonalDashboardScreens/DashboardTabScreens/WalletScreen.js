import React, { useState } from "react";
import { Dimensions, ImageBackground, Image, Platform, Text, TouchableOpacity, ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";

//import customs
import { walletInAppTransactionOverview } from "@/assets/data/dashboardData/paymentTransactionData";
import { COLORS, images } from "../../../../constants";
import { CustomPersonalDBHeader } from "../../../../components";
import NavHeader from "@/components/Headers/NavHeader";

const WalletScreen = () => {
  const navigation = useNavigation();

  const { width } = Dimensions.get("window");
  const height = width * 0.6;

  //state handlers
  const [activeCardShown, setActiveCardShown] = useState(0);

  // change card index
  const changeCardIndex = ({ nativeEvent }) => {
    const slideCardsList = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width
    );

    if (slideCardsList !== activeCardShown) {
      setActiveCardShown(slideCardsList);
    }
  };

  function formatBalance(balance) {
    return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function formatAmount(amount) {
    if (typeof amount !== "number") {
      return "Invalid Amount";
    }
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  //render middle section
  function renderMiddleSection() {
    return (
      <View style={styles.middleSectionContainer}>
        {/*user info section*/}
        <View style={styles.customHeaderContainer}>
          <CustomPersonalDBHeader />
        </View>

        <View style={styles.screenItemSeparator} />

        {/*actions buttons section*/}
        <View style={styles.middleActionButtonContainer}>
          {/*deposit button item*/}
          <View style={styles.actionButtonContent}>
            <Text
              onPress={() => navigation.navigate("DepositScreen", {
                cardData: walletInAppTransactionOverview[activeCardShown]
              })}
              style={styles.actionButtonTextItem}
            >
              Deposit funds
            </Text>
          </View>

          {/*withdraw button item*/}
          <View style={styles.actionButtonContent}>
            <Text
              onPress={() => navigation.navigate("WithdrawalScreen", {
                cardData: walletInAppTransactionOverview[activeCardShown]
              })}
              style={styles.actionButtonTextItem}
            >
              Withdraw funds
            </Text>
          </View>
        </View>
      </View>
    );
  }

  //card swiper section
  function renderCardSwiperSection() {
    return (
      <View
        style={[
          styles.cardSwiperContainer,
          {
            width,
            height: Platform.OS === "ios" ? height - 35 : height - 20,
          },
        ]}
      >
        {/*reech card section*/}
        <ScrollView
          horizontal
          pagingEnabled
          onScroll={changeCardIndex}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          style={{ width, marginHorizontal: 29 }}
        >
          {walletInAppTransactionOverview.map((item, index) => (
            <View key={index} style={styles.cardSwiperImageContainer}>
              {/*card image item*/}
              <ImageBackground
                source={item.walletImage}
                style={styles.cardSwiperImageItem}
              >
                {/*card type items*/}
                <View style={styles.cardTypeContainer}>
                  {/*card type items*/}
                  <View style={styles.cardTypeContentItems}>
                    <Text style={styles.cardTypeContentTextItem}>
                      {item.name}
                    </Text>
                  </View>
                </View>

                {/*card scanner*/}
                <View style={styles.cardScannerContainerItem}>
                  <Image
                    source={{
                      uri: "https://usa.visa.com/dam/VCOM/regional/na/us/pay-with-visa/images/card-chip-800x450.png",
                    }}
                    style={styles.cardScannerItem}
                  />
                </View>

                {/*card number item*/}
                <View style={styles.cardNumberItemContainer}>
                  <Text style={styles.reechCardInfoNumberTextItem}>
                    {moment(item.createdAt).format("MM")} / {moment(item.createdAt).format("YY")}
                  </Text>

                  <Text style={styles.reechCardInfoTextItem}>
                    ***********{item.walletTypeId}
                  </Text>
                </View>

                {/*reech logo*/}
                <Image source={images.logoBlack} style={styles.cardLogoItem} />
              </ImageBackground>

              {/*card name item*/}
              <View style={styles.reechCardInfoTextContainer}>
                <Text style={styles.reechCardInfosTextItem}>
                  {item.name}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  //reech info section
  function renderCardInfoSection() {
    return (
      <View style={styles.cardBottomCountContainer}>
        {/*add new card*/}
        <TouchableOpacity
          onPress={() => navigation.navigate("AddCardInfoScreen")}
          style={styles.cardBottomEmptyContainer}
        >
          <Text style={styles.cardBottomTextItem}>+ Add wallet</Text>
        </TouchableOpacity>

        {/*card counter*/}
        <View style={styles.cardBottomCountContent}>
          {walletInAppTransactionOverview.map((i, k) => (
            <Octicons
              key={k}
              name="dot-fill"
              size={14}
              color={k == activeCardShown ? COLORS.purple : COLORS.darkGray}
              style={styles.cardBottomIconItem}
            />
          ))}
        </View>

        {/*see wallet card*/}
        <TouchableOpacity
          onPress={() => navigation.navigate("CardListScreen")}
          style={styles.cardBottomEmptyContainer}
        >
          <Text style={styles.cardBottomTextItem}>See wallets</Text>
        </TouchableOpacity>
      </View>
    );
  }

  //available balance section
  function renderAvailableBalanceSection() {
    const activeCard = walletInAppTransactionOverview[activeCardShown];

    const formattedBalance = `${activeCard?.currencySymbol ? activeCard.currencySymbol : ""
      } ${formatBalance(activeCard?.remainingBalance / 100)}`;

    return (
      <View style={styles.availableBalanceSectionContainer}>
        <Text style={styles.availableBalanceHeaderText}>Available balance</Text>

        {/*balance section*/}
        <View style={styles.availableCardBalanceContainer}>
          <View style={styles.availableCardBalanceIconContainer} />

          <View style={styles.availableCardBalanceTextContainer}>
            <Text style={styles.availableCardBalanceTextItem}>
              {formattedBalance}
              {"    "}
            </Text>
          </View>

          <View style={styles.availableCardBalanceIconContainer}>
            <Ionicons
              name="md-information-circle"
              size={24}
              color={COLORS.white}
              onPress={() =>
                navigation.navigate("CardTransactionGraphScreen", {
                  cardData: activeCard,
                })
              }
            />
          </View>
        </View>
      </View>
    );
  }

  //payment button section
  function renderPaymentButtonSection() {
    return (
      <View style={styles.paymentButtonContainer}>
        {/*request payment button*/}
        <TouchableOpacity
          onPress={() => navigation.navigate("RequestPaymentScreen")}
          style={styles.paymentButtonContent}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
            style={styles.paymentButtonGradientContent}
          >
            <View style={styles.paymentButtonTextContainer}>
              <Text style={styles.paymentButtonTextItem}>Request</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/*send payment button*/}
        <TouchableOpacity
          onPress={() => navigation.navigate("SendPaymentScreen")}
          style={styles.paymentButtonContent}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
            style={styles.paymentButtonGradientContent}
          >
            <View style={styles.paymentButtonTextContainer}>
              <Text style={styles.paymentButtonTextItem}>Send</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  //recent transactions section
  function renderRecentTransactionSection() {
    const activeCard = walletInAppTransactionOverview[activeCardShown];

    // Get the first two transactions from the recent transactions array: ios vs android layout
    const recentTransactions = activeCard?.walletTransactions.slice(
      0,
      Platform.OS === "ios" ? 3 : 2
    );

    return (
      <View style={styles.recentTransactionContainer}>
        {/*header section*/}
        <View style={styles.recentTransactionHeaderContainer}>
          <View style={styles.recentTransactionHeaderContent}>
            <Text style={styles.recentTransactionHeaderTextItem}>
              Recent transactions
            </Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("BalanceInfoScreen", {
                walletTransactions: activeCard?.walletTransactions,
              })
            }
            style={styles.recentTransactionSubHeaderContent}
          >
            <Text style={styles.recentTransactionSubHeaderTextItem}>
              See all...
            </Text>
          </TouchableOpacity>
        </View>

        {/*transaction section*/}
        {recentTransactions?.map((transaction, k) => (
          <View key={k} style={styles.recentTransactionContentContainer}>
            <View style={styles.recentTransactionDateContentItem}>
              <Text style={styles.recentTransactionDateContentTextItem}>
                {moment(transaction.transactionDate).format("DD MMM YYYY")}
              </Text>
            </View>

            <View style={styles.recentTransactionContentItem}>
              <Text
                numberOfLines={1}
                style={styles.recentTransactionContentTextItem}
              >
                {transaction.transactionRecipient}
              </Text>

              <View style={styles.recentTransactionSubHeaderTextContent}>
                <Text style={styles.recentTransactionSubHeaderContentTextItem}>
                  {`${transaction.transactionType === "Send" ? "-" : "+"}`}{" "}
                  {`${transaction.transactionCurrencySymbol} ${formatAmount(
                    transaction.paymentAmount / 100
                  )}`}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeaderSection()}
      {renderMiddleSection()}
      {renderCardSwiperSection()}
      {renderCardInfoSection()}
      {renderAvailableBalanceSection()}
      {renderPaymentButtonSection()}
      {renderRecentTransactionSection()}
    </View>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerContainer: {
    zIndex: 99,
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  //middle screen section
  middleSectionContainer: {
    width: "100%",
    paddingHorizontal: 25,
    flexDirection: "column",
  },
  customHeaderContainer: {
    flexDirection: "column",
  },
  screenItemSeparator: {
    width: "100%",
    alignSelf: "center",
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 3,
    opacity: 0.4,
  },
  middleActionButtonContainer: {
    width: "100%",
    marginVertical: Platform.OS === "ios" ? 5 : 8,
    paddingHorizontal: 40,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  actionButtonContent: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //card swiper section
  cardSwiperContainer: {
    marginTop: Platform.OS === "ios" ? 10 : 5,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  cardSwiperImageContainer: {
    flexDirection: "column",
  },
  cardSwiperImageItem: {
    width: Platform.OS === "ios" ? 380 : 310,
    height: Platform.OS === "ios" ? 200 : 170,
    borderRadius: 20,
    overflow: "hidden",
    resizeMode: "cover",
    justifyContent: "flex-end",
    marginHorizontal: 25,
  },
  cardTypeContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "row",
  },
  cardTypeContentItems: {
    width: "100%",
    left: 20,
    top: Platform.OS === "ios" ? 5 : 30,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    zIndex: 99,
  },
  cardTypeContentImageItem: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  cardTypeContentTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  cardScannerContainerItem: {
    top: Platform.OS === "ios" ? 20 : 45,
    right: 5,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  cardScannerItem: {
    top: Platform.OS === "ios" ? 20 : 15,
    width: 50,
    height: 50,
    resizeMode: "cover",
  },
  cardLogoItem: {
    top: 10,
    width: 80,
    height: 80,
    right: 15,
    resizeMode: "contain",
    alignSelf: "flex-end",
  },
  reechCardInfoTextContainer: {
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  reechCardInfoNumberTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    marginBottom: 2.5,
  },
  reechCardInfoTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  reechCardInfosTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  cardNumberItemContainer: {
    top: 65,
    left: 25,
    alignItems: "flex-start",
    zIndex: 999,
  },

  //card buttons sections
  cardBottomCountContainer: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 15,
    zIndex: 1,
  },
  cardBottomEmptyContainer: {
    width: "20%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  cardBottomCountContent: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  cardBottomIconItem: {
    marginHorizontal: 8,
  },
  cardBottomTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },

  //available balance section
  availableBalanceSectionContainer: {
    width: "100%",
    marginTop: Platform.OS === "ios" ? 10 : 2,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  availableBalanceHeaderText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  availableCardBalanceContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  availableCardBalanceTextContainer: {
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  availableCardBalanceTextItem: {
    color: COLORS.purple,
    fontSize: 24,
    fontFamily: "PoppinsBold",
  },
  availableCardBalanceIconContainer: {
    width: "20%",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  //payment button section
  paymentButtonContainer: {
    width: "100%",
    marginTop: Platform.OS === "ios" ? 15 : 2,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  paymentButtonContent: {
    width: "46%",
    justifyContent: "center",
    alignItems: "center",
  },
  paymentButtonGradientContent: {
    width: "100%",
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  paymentButtonTextContainer: {
    width: "98%",
    height: "90%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: COLORS.black,
  },
  paymentButtonTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },

  //recent transactions section
  recentTransactionContainer: {
    width: "100%",
    marginTop: Platform.OS === "ios" ? 25 : 10,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 15 : 8,
    flexDirection: "column",
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: COLORS.darkGray,
    backgroundColor: COLORS.reechGray,
  },
  recentTransactionHeaderContainer: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: Platform.OS === "ios" ? 5 : 2,
  },
  recentTransactionHeaderContent: {
    width: "70%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  recentTransactionHeaderTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  recentTransactionSubHeaderContent: {
    width: "28%",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  recentTransactionSubHeaderTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },
  recentTransactionContentContainer: {
    width: "100%",
    marginVertical: Platform.OS === "ios" ? 5 : 1.5,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
  },
  recentTransactionDateContentItem: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: Platform.OS === "ios" ? 0.5 : 0,
  },
  recentTransactionDateContentTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    opacity: 0.5,
  },
  recentTransactionContentItem: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  recentTransactionContentTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
    width: "70%",
  },
  recentTransactionSubHeaderTextContent: {
    width: "28%",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  recentTransactionSubHeaderContentTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },
});

export default WalletScreen;
