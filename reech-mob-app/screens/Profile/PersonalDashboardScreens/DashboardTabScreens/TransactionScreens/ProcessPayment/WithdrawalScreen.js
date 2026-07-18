import React, { useEffect, useState } from "react";
import { Image, FlatList, StyleSheet, Text, View, Pressable, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import moment from 'moment';

//customs
import {
  withdrawalApiData,
  withdrawalPaymentApiTransactionHistoryData,
} from "../../../../../../assets/data/dashboardData/paymentTransactionData";
import { COLORS } from "../../../../../../constants";
import { CustomAmountInput, EmptyFlatlistComponent } from "../../../../../../components";
import NavHeader from "@/components/Headers/NavHeader";

const WithdrawalScreen = ({ route }) => {
  const { cardData } = route.params;

  const navigation = useNavigation();

  const { control, handleSubmit } = useForm();

  //state handlers
  const [selectedItem, setSelectedItem] = useState(null);
  const [onceValue, setOnceValue] = useState(true);
  const [weeklyValue, setWeeklyValue] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const now = moment();
    const formattedDateTime = now.format('D MMM YYYY - h:mm A');
    setCurrentDateTime(formattedDateTime);
  }, []);

  const once = () => {
    setOnceValue(!onceValue);
    setWeeklyValue(false);
  };
  const weekly = () => {
    setOnceValue(false);
    setWeeklyValue(!weeklyValue);
  };

  function formatBalance(balance) {
    return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const handleItemPress = (index) => {
    setSelectedItem(withdrawalApiData[index]);
  };

  const handleDepositSubmit = (data) => {
    if (!selectedItem) return;

    const paymentAmountInCents = parseFloat(data.paymentAmount) * 100;

    const newRemainingBalance = cardData.remainingBalance - paymentAmountInCents;

    const newData = {
      paymentAmount: data.paymentAmount,
      paymentMethodData: selectedItem,
      paymentDate: currentDateTime,
      newRemainingBalance: newRemainingBalance,
    };

    if (paymentAmountInCents > cardData.remainingBalance) {
      navigation.navigate("TransactionErrorScreen");
    } else {
      navigation.navigate("TransactionSuccessScreen", { data: newData });
    }
  };


  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader message="What would you like to do?" />

        <View style={styles.headerScreenBalanceHeaderContainer}>
          <Text style={styles.cardHeading}>Withdraw</Text>
          <Text style={styles.cardSubHeading}>
            {`Available Balance: ${cardData.currencySymbol}${formatBalance(cardData.remainingBalance / 100)}`}
          </Text>
        </View>
      </View>
    );
  }

  //withdrawal options
  function renderTopWithdrawalOptionSection() {
    return (
      <FlatList
        horizontal
        data={withdrawalApiData}
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

  //cash withdrawal form
  function renderFormWithdrawalFormSection() {
    return (
      <View style={styles.amountInputSection}>
        <View style={styles.amountContent}>
          <Text style={styles.amountCurrencySymbol}>-R{"  "}</Text>
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

          <View style={styles.buttonContainer}>
            <Pressable
              onPress={handleSubmit(handleDepositSubmit)}
              style={styles.withdrawalContainer}
            >
              <LinearGradient
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
                style={styles.withdrawalGradientContainer}
              >
                <Text style={styles.withdrawalTextItem}>Withdraw</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </View>
    )
  }

  function renderFormInformationSection() {
    return (
      <View style={styles.textInfoContainer}>
        <Text style={styles.textInfoHeading}>
          Withdrawals may take up to 3-5 business days to process.
          During this time, your payment will appear as a pending
          transaction.
        </Text>
      </View>
    )
  }

  //withdrawal recursion section
  function renderWithdrawalRecursionSection() {
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
      </View>
    )
  }

  //withdrawal history section
  function renderWalletWithdrawalHistorySection() {
    return (
      <View style={styles.transactionContainer}>
        <View style={styles.transactionHeader}>
          <Text style={styles.cardHeading}>Withdrawal history</Text>
        </View>

        {/*withdrawal history section*/}
        <FlatList
          data={withdrawalPaymentApiTransactionHistoryData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <>
                <View style={styles.depositButtonContainer}>
                  {/*card image section*/}
                  <View style={styles.depositImageContainer}>
                    <Image
                      source={item.paymentApiImage}
                      style={styles.cardImage}
                    />
                  </View>

                  {/*card name section*/}
                  <View style={styles.cardName}>
                    <Text style={styles.depositCardInfoName}>{item.paymentMethod}</Text>
                    <Text style={styles.depositCardInfo}>
                      {moment(item.depositDate).format("D MMM YYYY - h:mm A")}
                    </Text>
                  </View>

                  {/*card number section*/}
                  <View style={styles.depositAmountContainer}>
                    <Text style={styles.depositCardInfo}>
                      -{item.currency}{formatBalance(item.depositAmount)}
                    </Text>
                    <Text
                      style={[
                        styles.depositCardInfoStatus,
                        {
                          color:
                            item.status == "Pending"
                              ? COLORS.purple
                              : COLORS.teal,
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
              msg={"You have no prior withdrawal history. You can request a withdrawal using the form above."}
            />
          }
        />
      </View>
    )
  }

  //credit card input
  function renderScreenContentListSection() {
    return (
      <>
        {renderHeaderSection()}
        <View style={styles.cardHeadingContainer}>
          {renderTopWithdrawalOptionSection()}
          {renderFormWithdrawalFormSection()}
          {renderFormInformationSection()}
          {renderWithdrawalRecursionSection()}
          {renderWalletWithdrawalHistorySection()}
        </View>
      </>
    );
  }

  return (
    <View style={styles.container}>
      {renderScreenContentListSection()}
    </View>
  );
};

export default WithdrawalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerContainer: {
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },
  headerScreenBalanceHeaderContainer: {
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
    width: Platform.OS === "ios" ? 80 : 80,
    height: Platform.OS === "ios" ? 50 : 50,
    alignSelf: "center",
    marginBottom: 10,
  },
  cardInfoContainer: {
    paddingHorizontal: 5,
    alignSelf: "center",
    opacity: 0.6,
    color: COLORS.white,
    fontSize: 10,
    fontFamily: "PoppinsBold",
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
  withdrawalContainer: {
    width: "100%",
    marginHorizontal: 20,
    zIndex: 1,
  },
  withdrawalGradientContainer: {
    width: "100%",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  withdrawalTextItem: {
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
  depositButtonContainer: {
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
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "50%",
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
