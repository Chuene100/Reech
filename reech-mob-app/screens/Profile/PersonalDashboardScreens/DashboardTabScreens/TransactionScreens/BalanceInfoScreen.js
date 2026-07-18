import React, { useState } from "react";
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import moment from "moment";

//customs
import { COLORS } from "../../../../../constants";
import { BankFilterOptions, EmptyFlatlistComponent } from "../../../../../components";
import NavHeader from "@/components/Headers/NavHeader";

const BalanceInfoScreen = ({ route }) => {
  const navigation = useNavigation();

  const { walletTransactions } = route.params;

  //state handlers
  const [bankStatementRecord, setBankStatementRecord] = useState(walletTransactions);
  const [isFetching, setIsFetching] = useState(false);

  // Ensure the amount is a number
  function formatAmount(amount) {
    if (typeof amount !== "number") {
      return "Invalid Amount";
    }

    // Format with 2 decimal places and add a comma every 1000
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  //a method used to filter data according to the username
  const searchTransaction = (text) => {
    const searchText = text.toLowerCase();
    const filteredData = walletTransactions.filter((transaction) => {
      const match =
        transaction.paymentMaker.toLowerCase().includes(searchText) ||
        transaction.paymentRef.toLowerCase().includes(searchText) ||
        transaction.transactionDate.toLowerCase().includes(searchText);
      return match;
    });
    setBankStatementRecord(filteredData);
  };

  const fetchData = () => {
    setBankStatementRecord(walletTransactions);
    setIsFetching(false);
  };
  const onRefresh = () => {
    setIsFetching(true);
    fetchData(bankStatementRecord);
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  //search with button options
  function renderSearchWithButtons() {
    return (
      <View style={styles.customSearchContainer}>
        <View style={styles.innerSearchContainer}>
          <View style={styles.textInputContainer}>
            <TextInput
              onChangeText={(text) => searchTransaction(text)}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Search"
              placeholderTextColor={COLORS.white}
              style={styles.inputBalance}
              enablesReturnKeyAutomatically
              textAlign="center"
            />
          </View>
          <FontAwesome name="search" size={16} color={COLORS.purpleDark} style={{ top: Platform.OS === "ios" ? 0 : 5 }} />
        </View>
      </View>
    );
  }

  //statement filter options
  function renderStatementFilterOptions() {
    return (
      <View style={styles.filterOptionsContainer}>
        <BankFilterOptions />
      </View>
    );
  }

  //bank statement records
  function renderBankStatementSection() {
    return (
      <View style={styles.statementContentContainer}>
        <FlatList
          data={bankStatementRecord}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={onRefresh}
          refreshing={isFetching}
          renderItem={({ item }) => {
            return (
              <View style={styles.bankStatementItemContainer}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("TransactionalFullView", {
                      paymentCode: item.paymentCode,
                      invoiceStatus: item.invoiceStatus,
                      name: item.name,
                      walletTypeId: item.walletTypeId,
                      userImage: item.userImage,
                      transactionDate: item.transactionDate,
                      paymentType: item.paymentType,
                      paymentAmount: item.paymentAmount,
                      paymentMaker: item.paymentMaker,
                      paymentRef: item.paymentRef,
                    })
                  }
                  style={styles.bankStatementContentItems}
                >
                  <View style={styles.bankStatementItemList}>
                    <Text style={styles.dateItem}>
                      {moment(item.transactionDate).format("DD MMM YYYY")}
                    </Text>

                    <Text
                      style={[
                        item.paymentType == "Payment to"
                          ? { color: COLORS.teal }
                          : { color: COLORS.purpleDark },
                        styles.paymentAmountInfo,
                      ]}
                    >
                      {item.paymentType}: {item.paymentMaker}
                    </Text>
                    <Text numberOfLines={3} style={styles.paymentRefInfo}>
                      Ref: {item.paymentRef}
                    </Text>
                  </View>

                  <View style={styles.bankStatementAmountContainer}>
                    <Text
                      style={[
                        item.paymentType == "Payment to"
                          ? { color: COLORS.teal }
                          : { color: COLORS.purpleDark },
                        styles.bankStatementAmountItem,
                      ]}
                    >
                      {item.paymentType == "Payment to" ? "- R" : "+ R"}
                      {formatAmount(item.paymentAmount / 100)}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )
          }}
          ListEmptyComponent={
            <View style={styles.emptyListComponentContainer}>
              <EmptyFlatlistComponent
                msg={
                  Platform.OS === "ios"
                    ? "There are no transactions to show. \nPlease try again later."
                    : "There are no transactions. \nPlease try again later."
                }
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
      {renderSearchWithButtons()}
      {renderStatementFilterOptions()}
      {renderBankStatementSection()}
    </View>
  );
};

export default BalanceInfoScreen;

const styles = StyleSheet.create({
  //header section
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerContainer: {
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  //search section
  customSearchContainer: {
    marginTop: 20,
    flexDirection: "column",
    paddingHorizontal: 15,
  },
  innerSearchContainer: {
    flexDirection: "row",
    paddingVertical: Platform.OS === "ios" ? 10 : 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: COLORS.reechGray,
  },
  textInputContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "93%",
  },
  inputBalance: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 14,
    width: "100%",
    alignItems: "center",
  },

  //filter options
  filterOptionsContainer: {
    flexDirection: "column",
  },

  //statement section
  statementContentContainer: {
    marginTop: 20,
    flexDirection: "column",
  },
  statementContent: {
    marginHorizontal: 10,
  },
  bankStatementItemContainer: {
    bottom: 15,
    flexDirection: "column",
    paddingHorizontal: 15,
  },
  bankStatementContentItems: {
    width: "100%",
    flexDirection: "row",
    marginVertical: 15,
  },
  bankStatementItemList: {
    width: "80%",
  },
  dateItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  paymentAmountInfo: {
    fontSize: 16,
    fontFamily: "PoppinsLight",
    marginVertical: 5,
  },
  paymentRefInfo: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    opacity: 0.8,
  },
  bankStatementAmountContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
    width: "20%",
  },
  bankStatementAmountItem: {
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },
  bankStatementItemSeparator: {
    width: "100%",
    borderBottomWidth: StyleSheet.hairlineWidth * 4,
    borderBottomColor: COLORS.reechGray,
  },
  emptyListComponentContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
