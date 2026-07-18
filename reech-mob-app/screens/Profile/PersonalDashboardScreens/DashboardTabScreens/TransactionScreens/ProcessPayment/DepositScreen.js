import React, { useEffect, useState } from "react";
import { Image, FlatList, StyleSheet, Text, View, Pressable, TouchableOpacity, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";

//customs
import {
  depositApiData,
  depositPaymentApiTransactionHistoryData,
} from "../../../../../../assets/data/dashboardData/paymentTransactionData";
import { COLORS } from "../../../../../../constants";
import { CustomAmountInput, EmptyFlatlistComponent } from "../../../../../../components";
import NavHeader from "@/components/Headers/NavHeader";

const DepositScreen = ({ route }) => {
  const { cardData } = route.params;

  const navigation = useNavigation();

  const { control, handleSubmit } = useForm();

  //tip values
  const [selectedItem, setSelectedItem] = useState(null);
  const [onceValue, setOnceValue] = useState(true);
  const [weeklyValue, setWeeklyValue] = useState(false);
  const [monthlyValue, setMonthlyValue] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const now = moment();
    const formattedDateTime = now.format('D MMM YYYY - h:mm A');
    setCurrentDateTime(formattedDateTime);
  }, []);

  const once = () => {
    setOnceValue(!onceValue);
    setWeeklyValue(false);
    setMonthlyValue(false);
  };
  const weekly = () => {
    setOnceValue(false);
    setWeeklyValue(!weeklyValue);
    setMonthlyValue(false);
  };
  const monthly = () => {
    setOnceValue(false);
    setWeeklyValue(false);
    setMonthlyValue(!monthlyValue);
  };

  function formatBalance(balance) {
    return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const handleItemPress = (index) => {
    setSelectedItem(depositApiData[index]);
  };

  const handleDepositSubmit = (data) => {
    if (!selectedItem) return;

    const paymentAmountInCents = parseFloat(data.paymentAmount) * 100;

    const newRemainingBalance = cardData.remainingBalance + paymentAmountInCents;

    const newData = {
      paymentAmount: data.paymentAmount,
      paymentMethodData: selectedItem,
      paymentDate: currentDateTime,
      newRemainingBalance: newRemainingBalance,
    };

    navigation.navigate("TransactionSuccessScreen", { data: newData });
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader message="What would you like to do?" />

        <View style={styles.headerScreenBalanceHeaderContainers}>
          <Text style={styles.cardHeading}>Deposit</Text>
          <Text style={styles.cardSubHeading}>
            {`Available Balance: ${cardData.currencySymbol}${formatBalance(cardData.remainingBalance / 100)}`}
          </Text>
        </View>
      </View>
    );
  }

  //deposit form section
  function renderApiDepositOptions() {
    return (
      <FlatList
        horizontal
        data={depositApiData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.accountContainer,
                selectedItem === item && styles.selectedItemContainer,
              ]}
              onPress={() => handleItemPress(index)}
            >
              <View style={styles.accountImageContainer}>
                <Image
                  source={item.paymentApiImage}
                  style={styles.accountImage}
                />
              </View>
              <Text style={styles.cardInfoContainer}>{item.paymentApiName}</Text>
            </TouchableOpacity>
          );
        }}
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={<View style={{ marginBottom: 0 }} />}
      />
    )
  }

  //deposit form section
  function renderDepositFormSection() {
    return (
      <View style={styles.amountInputSection}>
        <View style={styles.amountContent}>
          <Text style={styles.amountCurrencySymbol}>+R{"  "}</Text>
          <View style={styles.amountInputText}>
            <CustomAmountInput
              name="paymentAmount"
              control={control}
              keyboardType="number-pad"
              rules={{
                required: "Please enter an amount.",
                pattern: {
                  value: /^[0-9\b]+$/,
                  message: "No special characters",
                },
              }}
            />
          </View>

          {/*deposit section*/}
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={handleSubmit(handleDepositSubmit)}
              style={styles.depositsContainers}
            >
              <LinearGradient
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
                style={styles.depositGradientContainer}
              >
                <Text style={styles.depositTextItem}>Deposit</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </View>
    )
  }

  //deposit info section
  function renderDepositInfoSection() {
    return (
      <View style={styles.textInfoContainer}>
        <Text style={styles.textInfoHeading}>
          You can have your account automatically filled up if it is less than
          R50.00 by selecting one of the options below.
        </Text>
      </View>
    )
  }

  //deposit options section
  function renderFormDepositOption() {
    return (
      <View style={styles.debitOptionContainer}>
        {/*once option*/}
        <Pressable
          control={control}
          onPress={() => once()}
          style={[
            {
              borderColor: onceValue ? COLORS.transparent : COLORS.purple,
              backgroundColor: onceValue
                ? COLORS.purpleDark
                : COLORS.transparent,
              opacity: onceValue ? 1 : 0.6,
            },
            styles.debitItemContainer,
          ]}
        >
          <Text style={styles.debitOptionItem}>Once</Text>
        </Pressable>

        {/*weekly option*/}
        <Pressable
          control={control}
          onPress={() => weekly()}
          style={[
            {
              borderColor: weeklyValue ? COLORS.transparent : COLORS.purple,
              backgroundColor: weeklyValue
                ? COLORS.purpleDark
                : COLORS.transparent,
              opacity: weeklyValue ? 1 : 0.6,
            },
            styles.debitItemContainer,
          ]}
        >
          <Text style={styles.debitOptionItem}>Weekly</Text>
        </Pressable>

        {/*monthly option*/}
        <Pressable
          control={control}
          onPress={() => monthly()}
          style={[
            {
              borderColor: monthlyValue
                ? COLORS.transparent
                : COLORS.purple,
              backgroundColor: monthlyValue
                ? COLORS.purpleDark
                : COLORS.transparent,
              opacity: monthlyValue ? 1 : 0.6,
            },
            styles.debitItemContainer,
          ]}
        >
          <Text style={styles.debitOptionItem}>Monthly</Text>
        </Pressable>
      </View>
    )
  }

  //deposit history section
  function renderDepositHistorySection() {
    return (
      <View style={styles.transactionContainer}>
        <View style={styles.transactionHeader}>
          <Text style={styles.cardHeading}>Deposit history</Text>
        </View>

        {/*deposit history section*/}
        <FlatList
          data={depositPaymentApiTransactionHistoryData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <>
                <View style={styles.depositContainer}>
                  {/*card image section*/}
                  <View style={styles.depositImageContainer}>
                    <Image
                      source={item.paymentApiImage}
                      style={styles.cardImage}
                    />
                  </View>

                  {/*card name section*/}
                  <View style={styles.cardName}>
                    <Text style={styles.depositCardInfoName}>{item.paymentApiName}</Text>
                    <Text style={styles.depositCardInfo}>
                      {moment(item.depositDate).format("D MMM YYYY - h:mm A")}
                    </Text>
                  </View>

                  {/*card number section*/}
                  <View style={styles.depositAmountContainer}>
                    <Text style={styles.depositCardInfo}>
                      +{item.currency}{formatBalance(item.depositAmount)}
                    </Text>
                    <Text
                      style={[
                        styles.depositCardInfoStatus,
                        {
                          color:
                            item.status == "Pending"
                              ? COLORS.purple
                              : COLORS.purpleDark,
                        },
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>
              </>
            );
          }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ marginBottom: 0 }} />}
          ListEmptyComponent={
            <EmptyFlatlistComponent
              msg={"You have no prior deposit history. You can make a deposit using the form above."}
            />}
        />
      </View>
    )
  }

  //screen content section
  function renderCreditCardInputSection() {
    return (
      <>
        {renderHeaderSection()}
        <View style={styles.cardHeadingContainer}>
          {renderApiDepositOptions()}
          {renderDepositFormSection()}
          {renderDepositInfoSection()}
          {renderFormDepositOption()}
          {renderDepositHistorySection()}
        </View>
      </>
    );
  }

  return (
    <View style={styles.container}>
      {renderCreditCardInputSection()}
    </View>
  );
};

export default DepositScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerContainer: {
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },
  headerScreenBalanceHeaderContainers: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  //card section
  cardHeadingContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cardHeading: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  cardSubHeading: {
    top: 10,
    marginBottom: Platform.OS === "ios" ? 30 : 25,
    opacity: 0.6,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  accountContainer: {
    minHeight: 10,
    marginRight: 10,
  },
  selectedItemContainer: {
    backgroundColor: COLORS.purpleDark,
  },
  accountImageContainer: {
    paddingHorizontal: 0,
  },
  accountImage: {
    width: Platform.OS === "ios" ? 80 : 50,
    height: Platform.OS === "ios" ? 50 : 30,
    alignSelf: "center",
    marginBottom: 10,
  },
  cardInfoContainer: {
    paddingHorizontal: 5,
    alignSelf: "center",
    opacity: 0.6,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //amount section
  amountInputSection: {
    height: 100,
    width: "100%",
    flexDirection: "row",
  },
  amountContent: {
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  amountCurrencySymbol: {
    color: COLORS.purpleDark,
    fontSize: 40,
    fontFamily: "PoppinsLight",
  },
  amountInputText: {
    width: "45%",
  },
  buttonContainer: {
    left: 10,
    width: "30%",
  },
  depositsContainers: {
    width: "100%",
    marginHorizontal: 20,
    zIndex: 1,
  },
  depositGradientContainer: {
    width: "100%",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  depositTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //debit section
  textInfoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  textInfoHeading: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    textAlign: "center",
    opacity: 0.6,
  },
  debitOptionContainer: {
    width: "100%",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  debitItemContainer: {
    width: "22%",
    height: 55,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    borderRadius: 15,
    borderWidth: 2,
  },
  debitOptionItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //transaction section
  transactionContainer: {
    width: "100%",
    height: Platform.OS === "ios" ? 420 : 300,
    padding: 15,
    flexDirection: "column",
    borderRadius: 10,
  },
  transactionHeader: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  depositContainer: {
    width: "100%",
    marginTop: Platform.OS === "ios" ? 10 : 5,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  depositImageContainer: {
    width: "18%",
    justifyContent: "center",
    alignItems: "center",
  },
  cardImage: {
    width: Platform.OS === "ios" ? 65 : 55,
    height: Platform.OS === "ios" ? 40 : 30,
    resizeMode: "cover"
  },
  cardName: {
    width: "50%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  depositCardInfoName: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  depositCardInfo: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  depositCardInfoStatus: {
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  depositAmountContainer: {
    width: "20%",
    alignItems: "flex-end",
  },
});
