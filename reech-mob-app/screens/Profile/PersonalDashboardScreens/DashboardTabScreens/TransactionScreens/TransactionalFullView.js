import React, { useState } from "react";
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SimpleLineIcons } from "@expo/vector-icons";

//custom
import { COLORS } from "../../../../../constants";
import NavHeader from "@/components/Headers/NavHeader";
import moment from "moment";


const TransactionalFullView = ({ route }) => {

  //data items
  const paymentCode = route.params.paymentCode;
  const invoiceStatus = route.params.invoiceStatus;
  const name = route.params.name;
  const walletTypeId = route.params.walletTypeId;
  const userImage = route.params.userImage;
  const transactionDate = route.params.transactionDate;
  const paymentType = route.params.paymentType;
  const paymentAmount = route.params.paymentAmount;
  const paymentMaker = route.params.paymentMaker;
  const paymentRef = route.params.paymentRef;

  //state handlers
  const [downloadRequest, setDownloadRequest] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  function formatAmount(amount) {
    if (typeof amount !== "number") {
      return "Invalid Amount";
    }
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function downloadingInvoice() {
    setShowMessage(true);
  }

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  //invoice
  function renderInvoiceSection() {
    return (
      <View style={styles.invoiceContainer}>
        <View style={styles.invoiceHeader}>
          <Text style={styles.invoiceHeaderText}>
            Payment: <Text style={styles.paymentCodeItem}>{paymentCode}</Text>
          </Text>
        </View>

        {/*invoice section*/}
        <View style={styles.invoiceContentContainer}>
          {/*image section*/}
          <View style={styles.invoiceImageSection}>
            {/*invoice user image section*/}
            <View style={styles.invoiceImageContainer}>
              <Image source={{ uri: userImage }} style={styles.userImageItem} />
            </View>

            {/*invoice user text section*/}
            <View style={styles.invoiceTextContainer}>
              <Text
                style={[
                  paymentType == "Payment to"
                    ? { color: COLORS.teal }
                    : { color: COLORS.purple },
                  styles.invoicePaymentTypeText,
                ]}
              >
                {paymentType == "Tip" ? "Tipped" : paymentType}
              </Text>
              <Text style={styles.invoiceTextUser}>{paymentMaker}</Text>
              <Text style={styles.invoiceTextDate}>{moment(transactionDate).format("DD MMM YYYY")}</Text>
            </View>
          </View>

          {/*invoice reference section*/}
          <View style={styles.invoiceReferenceContainer}>
            {/*transaction info section*/}
            <View style={styles.invoiceRefHeader}>
              <Text style={styles.invoiceRefHeading}>Transaction info</Text>
              <TouchableOpacity>
                <SimpleLineIcons
                  name="cloud-download"
                  size={17}
                  color={COLORS.white}
                  onPress={() => setDownloadRequest(!downloadRequest)}
                />
              </TouchableOpacity>
            </View>

            {/*amount section*/}
            <View style={styles.invoiceAmountSection}>
              <Text style={styles.invoiceAmountHeadingText}>
                Amount{" "}
                {paymentType == "Payment to"
                  ? "Paid"
                  : paymentType == "Payment from"
                    ? "Received"
                    : "Tipped"}
              </Text>

              <Text
                style={[
                  paymentType == "Payment to"
                    ? { color: COLORS.teal }
                    : { color: COLORS.purple },
                  styles.invoiceAmountText,
                ]}
              >
                {paymentType == "Payment to" ? "-R" : "+R"}
                {formatAmount(paymentAmount / 100)}
              </Text>

              <Text style={styles.invoiceAmountHeadingText}>
                {name}{" "}
              </Text>
              <Text style={styles.invoiceCardNumText}>
                **********{walletTypeId}
              </Text>
            </View>

            {/*reference text section*/}
            <Text style={styles.invoiceRefHeadingItem}>Payment reference</Text>
            <View style={styles.invoiceRefContainer}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.invoiceRefText}>{paymentRef}</Text>
              </ScrollView>
            </View>
          </View>

          <View style={styles.invoiceDetailsContainer}>
            {/*status & transaction date*/}
            <View style={styles.invoiceItems}>
              {/*invoice status*/}
              <View style={styles.invoiceDetailContent}>
                <Text style={styles.invoiceDetailHeading}>Status</Text>
                <Text style={styles.invoiceDetailItem}>{invoiceStatus}</Text>
              </View>

              {/*invoice date*/}
              <View style={styles.invoiceDetailContent}>
                <Text style={styles.invoiceDetailHeading}>Invoice date</Text>
                <Text style={styles.invoiceDetailItem}>{moment(transactionDate).format("DD MMM YYYY")}</Text>
              </View>
            </View>

            {/*payment code & payment date*/}
            <View style={styles.invoiceItems}>
              {/*invoice status*/}
              <View style={styles.invoiceDetailContent}>
                <Text style={styles.invoiceDetailHeading}>Invoice code</Text>
                <Text style={styles.invoiceDetailItemCode}>{paymentCode}</Text>
              </View>

              {/*invoice date*/}
              <View style={styles.invoiceDetailContent}>
                <Text style={styles.invoiceDetailHeading}>Date paid</Text>
                <Text style={styles.invoiceDetailItem}>{moment(transactionDate).format("DD MMM YYYY")}</Text>
              </View>
            </View>
          </View>

          {/*button section*/}
          {downloadRequest && (
            <View style={styles.downloadContainer}>
              <Pressable
                onPress={() => downloadingInvoice()}
                style={styles.downloadButtonContainer}
              >
                <LinearGradient
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  colors={[
                    COLORS.purpleDarker,
                    COLORS.purpleDark,
                    COLORS.purple,
                  ]}
                  style={styles.downloadButtonGradientContainer}
                >
                  <Text style={styles.downloadButtonTextItem}>
                    Download Invoice
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          )}

          {showMessage && downloadRequest ? (
            <View style={styles.downloadTextContainer}>
              <Text style={styles.downloadText}>
                Downloading invoice, please check your mail.
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeaderSection()}
      {renderInvoiceSection()}
    </View>
  );
};

const styles = StyleSheet.create({
  //header section
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerContainer: {
    zIndex: 99,
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  ///invoice
  invoiceContainer: {
    flexDirection: "column",
    paddingTop: Platform.OS === "ios" ? 20 : 10,
    paddingHorizontal: 15,
  },
  invoiceHeader: {
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  invoiceHeaderText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  paymentCodeItem: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: "PoppinsBold",
  },
  downloadTextContainer: {
    marginTop: Platform.OS === "ios" ? 30 : 12,
    justifyContent: "center",
    alignItems: "center",
  },
  downloadText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //invoice content
  invoiceContentContainer: {
    flexDirection: "column",
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "ios" ? 20 : 10,
  },
  invoiceImageSection: {
    flexDirection: "row",
    width: "100%",
  },
  invoiceImageContainer: {
    width: Platform.OS === "ios" ? "26%" : "30%",
  },
  userImageItem: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    borderRadius: 8,
  },
  invoiceTextContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    width: Platform.OS === "ios" ? "74%" : "70%",
  },
  invoicePaymentTypeText: {
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  invoiceTextUser: {
    marginVertical: 5,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  invoiceTextDate: {
    opacity: 0.6,
    marginVertical: 2,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  invoiceAmountSection: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  invoiceAmountHeadingText: {
    opacity: 0.6,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  invoiceAmountText: {
    marginVertical: 10,
    fontSize: 20,
    fontFamily: "PoppinsBold",
  },
  invoiceCardNumText: {
    marginTop: 5,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
    opacity: 0.6,
  },

  //reference sections
  invoiceReferenceContainer: {
    flexDirection: "column",
    padding: 15,
    marginVertical: Platform.OS === "ios" ? 20 : 10,
    borderColor: COLORS.white,
    borderWidth: 2,
    borderRadius: 10,
  },
  invoiceRefHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  invoiceRefHeading: {
    opacity: 0.6,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  invoiceRefHeadingItem: {
    marginVertical: Platform.OS === "ios" ? 10 : 5,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  invoiceRefContainer: {
    padding: 10,
    height: 100,
    borderRadius: 10,
    backgroundColor: COLORS.reechGray,
  },
  invoiceRefText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //invoice details section
  invoiceDetailsContainer: {
    flexDirection: "column",
    width: "100%",
  },
  invoiceItems: {
    flexDirection: "row",
  },
  invoiceDetailContent: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    padding: 10,
  },
  invoiceDetailHeading: {
    marginBottom: 5,
    opacity: 0.6,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  invoiceDetailItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
    textTransform: "capitalize",
  },
  invoiceDetailItemCode: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    textTransform: "uppercase",
  },

  //download section
  downloadContainer: {
    top: Platform.OS === "ios" ? 20 : 6,
  },
  downloadButtonContainer: {
    width: "100%",
    marginHorizontal: 0,
    zIndex: 10,
  },
  downloadButtonGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 45,
    width: "100%",
  },
  downloadButtonTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
});

export default TransactionalFullView;
