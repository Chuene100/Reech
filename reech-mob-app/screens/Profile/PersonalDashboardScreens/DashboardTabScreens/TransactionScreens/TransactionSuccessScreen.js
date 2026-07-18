import React from "react";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";

//customs
import { COLORS } from "../../../../../constants";
import NavHeader from "@/components/Headers/NavHeader";

const TransactionSuccessScreen = ({ route }) => {
  const data = route.params.data;

  const navigation = useNavigation();

  function formatBalance(balance) {
    return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  const randomString = generateRandomString(6);

  //generate transaction pdf file
  const generatePdfBoilerPlate = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>
        A Simple Invoice Template Responsive and clean with HTML CSS SCSS
      </title>
      <style>
        * {
          margin: 0 auto;
          padding: 0 auto;
          user-select: none;
        }

        body {
          padding: 20px;
          font-family: "PoppinsLight", "PoppinsBold", sans-serif;
          -webkit-font-smoothing: antialiased;
          background-color: #dcdcdc;
        }

        .wrapper-invoice {
          display: flex;
          justify-content: center;
        }
        .wrapper-invoice .invoice {
          height: auto;
          background: ${COLORS.white};
          padding: 5vh;
          margin-top: 5vh;
          max-width: 110vh;
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #dcdcdc;
        }
        .wrapper-invoice .invoice .invoice-information {
          float: right;
          text-align: right;
        }
        .wrapper-invoice .invoice .invoice-information b {
          color:${COLORS.black};
        }
        .wrapper-invoice .invoice .invoice-information p {
          font-size: 2vh;
          color: ${COLORS.black};
        }
        .wrapper-invoice .invoice .invoice-logo-brand h2 {
          text-transform: uppercase;
          font-family: "PoppinsLight", "PoppinsBold", sans-serif;
          font-size: 2.9vh;
          color:${COLORS.black};
        }
        .wrapper-invoice .invoice .invoice-logo-brand img {
          max-width: 100px;
          width: 100%;
          object-fit: fill;
        }
        .wrapper-invoice .invoice .invoice-head {
          display: flex;
          margin-top: 8vh;
        }
        .wrapper-invoice .invoice .invoice-head .head {
          width: 100%;
          box-sizing: border-box;
        }
        .wrapper-invoice .invoice .invoice-head .client-info {
          text-align: left;
        }
        .wrapper-invoice .invoice .invoice-head .client-info h2 {
          font-weight: 500;
          letter-spacing: 0.3px;
          font-size: 2vh;
          color: "#0F172A";
        }
        .wrapper-invoice .invoice .invoice-head .client-info p {
          font-size: 2vh;
          color: ${COLORS.black};
        }
        .wrapper-invoice .invoice .invoice-head .client-data {
          text-align: right;
        }
        .wrapper-invoice .invoice .invoice-head .client-data h2 {
          font-weight: 500;
          letter-spacing: 0.3px;
          font-size: 2vh;
          color: ${COLORS.black};
        }
        .wrapper-invoice .invoice .invoice-head .client-data p {
          font-size: 2vh;
          color: ${COLORS.black};
        }
        .wrapper-invoice .invoice .invoice-body {
          margin-top: 8vh;
        }
        .wrapper-invoice .invoice .invoice-body .table {
          border-collapse: collapse;
          width: 100%;
        }
        .wrapper-invoice .invoice .invoice-body .table thead tr th {
          font-size: 2vh;
          border: 1px solid #dcdcdc;
          text-align: left;
          padding: 1vh;
          background-color: #eeeeee;
        }
        .wrapper-invoice .invoice .invoice-body .table tbody tr td {
          font-size: 2vh;
          border: 1px solid #dcdcdc;
          text-align: left;
          padding: 1vh;
          background-color:${COLORS.white};
        }
        .wrapper-invoice .invoice .invoice-body .table tbody tr td:nth-child(2) {
          text-align: right;
        }
        .wrapper-invoice .invoice .invoice-body .flex-table {
          display: flex;
        }
        .wrapper-invoice .invoice .invoice-body .flex-table .flex-column {
          width: 100%;
          box-sizing: border-box;
        }
        .wrapper-invoice .invoice .invoice-body .flex-table .flex-column .table-subtotal {
          border-collapse: collapse;
          box-sizing: border-box;
          width: 100%;
          margin-top: 2vh;
        }
        .wrapper-invoice .invoice .invoice-body .flex-table .flex-column .table-subtotal tbody tr td {
          font-size: 2vh;
          border-bottom: 1px solid #dcdcdc;
          text-align: left;
          padding: 1vh;
          background-color: ${COLORS.white};
        }
        .wrapper-invoice .invoice .invoice-body .flex-table .flex-column .table-subtotal tbody tr td:nth-child(2) {
          text-align: right;
        }
        .wrapper-invoice .invoice .invoice-body .invoice-total-amount {
          margin-top: 1rem;
        }
        .wrapper-invoice .invoice .invoice-body .invoice-total-amount p {
          font-weight: bold;
          color: ${COLORS.black};
          text-align: right;
          font-size: 2vh;
        }
        .wrapper-invoice .invoice .invoice-footer {
          margin-top: 4vh;
        }
        .wrapper-invoice .invoice .invoice-footer p {
          font-size: 1.7vh;
          color: ${COLORS.black};
        }

        .copyright {
          margin-top: 2rem;
          text-align: center;
        }
        .copyright p {
          color: ${COLORS.black};
          font-size: 1.8vh;
        }

        @media print {
          .table thead tr th {
            -webkit-print-color-adjust: exact;
            background-color: #eeeeee !important;
          }

          .copyright {
            display: none;
          }
        }
        .rtl {
          direction: rtl;
          font-family: "PoppinsLight", "PoppinsBold", sans-serif;
        .rtl .invoice-information {
          float: left !important;
          text-align: left !important;
        }
        .rtl .invoice-head .client-info {
          text-align: right !important;
        }
        .rtl .invoice-head .client-data {
          text-align: left !important;
        }
        .rtl .invoice-body .table thead tr th {
          text-align: right !important;
        }
        .rtl .invoice-body .table tbody tr td {
          text-align: right !important;
        }
        .rtl .invoice-body .table tbody tr td:nth-child(2) {
          text-align: left !important;
        }
        .rtl .invoice-body .flex-table .flex-column .table-subtotal tbody tr td {
          text-align: right !important;
        }
        .rtl .invoice-body .flex-table .flex-column .table-subtotal tbody tr td:nth-child(2) {
          text-align: left !important;
        }
        .rtl .invoice-body .invoice-total-amount p {
          text-align: left !important;
        }
      </style>
    </head>

    <body>
      <section class="wrapper-invoice">
        <!-- switch mode rtl by adding class rtl on invoice class -->
        <div class="invoice">
          <div class="invoice-information">
            <p><b>Invoice #: </b>R-${randomString}</p>
            <p><b>Created Date: </b>${data.paymentDate}</p>
          </div>

          <!-- logo brand invoice -->
          <div class="invoice-logo-brand">
            <h2></h2>
            <img src="data:image/png;base64, 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">
          </div>

          <!-- invoice head -->
          <div class="invoice-head">
            <div class="head client-info">
              <p>Reecheble (Pty) Ltd.</p>
              <p>Email: sales@reecheble.com</p>
              <p>Call: (+27)64-694-3459</p>
              <p>Midrand, Johannesburg, South Africa, 1682</p>
            </div>
            <div class="head client-data">
              <p>Sam Romero</p>
              <p>s.romero@gmail.com</p>
              <p>San Francisco, California, USA</p>
              <p></p>
            </div>
          </div>

          <!-- invoice body-->
          <div class="invoice-body">
            <table class="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Transaction using ${data.paymentMethodData.paymentApiName}</td>
                  <td>R${formatBalance(data.paymentAmount)}</td>
                </tr>
              </tbody>
            </table>
            <div class="flex-table">
              <div class="flex-column"></div>
              <div class="flex-column">
                <table class="table-subtotal">
                  <tbody>
                    <tr>
                      <td>Avail. Balance</td>
                      <td>R${formatBalance(data.newRemainingBalance / 100)}</td>
                    </tr>
                    <tr>
                      <td>Subtotal</td>
                      <td>R${formatBalance(data.paymentAmount)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- invoice total  -->
            <div class="invoice-total-amount">
              <p>Total : R${formatBalance(data.paymentAmount)}</p>
            </div>
          </div>

          <!-- invoice footer -->
          <div class="invoice-footer">
            <p>
              It may take up to 3-5 business days to complete withdrawals. All information supplied during this transaction will be kept strictly secret. We have the right, at any moment, to change these terms and conditions. Any modifications will be communicated to clients.
            </p>
          </div>
        </div>
      </section>
      <div class="copyright">
        <p>Created by ❤ Reecheble (Pty) Ltd.</p>
      </div>
    </body>
  </html>
  `;

  let exportProofToPdf = async () => {
    const fileGenerated = await printToFileAsync({
      html: generatePdfBoilerPlate,
      base64: false,
    });

    await shareAsync(fileGenerated.uri);
  }

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  //screen content section
  function renderScreenContent() {
    return (
      <View style={styles.screenContentContainer}>
        <View style={styles.screenImageContent}>
          {/*top image section*/}
          <Image
            source={{
              uri: "https://cdn3d.iconscout.com/3d/premium/thumb/payment-success-6476727-5373654.png",
            }}
            style={styles.screenImageItem}
          />

          {/*top heading & subheading section*/}
          <Text style={styles.screenHeading}>Payment Sent Successfully!</Text>
          <Text style={styles.screenText}>We have just sent your money to</Text>

          {/*info section*/}
          <View style={styles.screenInfoContainer}>
            {/*info image section*/}
            <View style={styles.screenImageContainer}>
              <Image
                source={data.paymentMethodData.paymentApiImage}
                style={styles.infoImage}
              />
            </View>

            {/*info text section*/}
            <View style={styles.infoContainer}>
              <Text style={styles.infoName}>{data.paymentMethodData.paymentApiName}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  function renderTransactionDetailsSection() {

    return (
      <View style={styles.transactionInfoContainer}>
        {/*transaction info section*/}
        <Text style={styles.transactionHeading}>Transfer details</Text>

        {/*transaction date*/}
        <View style={styles.transactionDetailsContainer}>
          <Text style={styles.transactionDetailsTextHeading}>
            Transaction date
          </Text>
          <Text style={styles.transactionDetailsTextItem}>
            {data.paymentDate}
          </Text>
        </View>

        {/*transaction amount*/}
        <View style={styles.transactionDetailsContainer}>
          <Text style={styles.transactionDetailsTextHeading}>
            Transfer amount
          </Text>
          <Text style={styles.transactionDetailsTextItem}>
            R{formatBalance(data.paymentAmount)}
          </Text>
        </View>

        {/*transaction amount*/}
        <View style={styles.transactionDetailsContainer}>
          <Text style={styles.transactionDetailsTextHeading}>
            Available Balance
          </Text>
          <Text style={styles.transactionDetailsTextItem}>
            R{formatBalance(data.newRemainingBalance / 100)}
          </Text>
        </View>

        {/*transaction fee*/}
        <View style={styles.transactionDetailsContainer}>
          <Text style={styles.transactionDetailsTextHeading}>
            Transaction fee{"   "}
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={COLORS.white}
            />
          </Text>
          <Text style={styles.transactionDetailsTextItem}>Free</Text>
        </View>

        {/*transaction total*/}
        <View style={styles.transactionDetailsContainer}>
          <Text style={styles.transactionDetailsTextTotal}>Total</Text>
          <Text style={styles.transactionDetailsTextTotal}>
            R{formatBalance(data.paymentAmount)}
          </Text>
        </View>
      </View>
    );
  }

  //download buttons
  function renderActionButtonsSection() {
    return (
      <View style={styles.buttonContainer}>
        <View style={styles.buttonContent}>
          <Pressable
            onPress={exportProofToPdf}
            style={styles.buttonPress}
          >
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
              style={styles.buttonGradientContainer}
            >
              <Text style={styles.buttonTextItem}>Export to PDF</Text>
            </LinearGradient>
          </Pressable>
        </View>

        <View style={styles.buttonContent}>
          <Pressable
            onPress={() => navigation.navigate("ActivityDashboardScreen")}
            style={styles.buttonPress}
          >
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
              style={styles.buttonGradientContainer}
            >
              <Text style={styles.buttonTextItem}>Dismiss</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeaderSection()}
      {renderScreenContent()}
      {renderTransactionDetailsSection()}
      {renderActionButtonsSection()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerContainer: {
    marginTop: Platform.OS === "android" ? "0%" : "10%",
  },
  buttonContainer: {
    top: Platform.OS === "ios" ? 100 : 50,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: "2.5%",
  },
  buttonContent: {
    width: "50%",
  },
  buttonPress: {
    top: Platform.OS === "ios" ? "59%" : "63%",
    marginHorizontal: 20,
  },
  buttonGradientContainer: {
    height: 45,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  buttonTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //screen content section
  screenContentContainer: {
    flexDirection: "column",
    paddingHorizontal: 15,
  },
  screenImageContent: {
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  screenImageItem: {
    width: 150,
    height: 150,
    resizeMode: "cover",
  },
  screenHeading: {
    color: COLORS.white,
    fontFamily: "PoppinsBold",
    fontSize: 16,
  },
  screenText: {
    top: 20,
    color: COLORS.white,
    fontFamily: "PoppinsLight",
    fontSize: 16,
  },
  screenInfoContainer: {
    top: 50,
    width: "100%",
    padding: 15,
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: COLORS.transparent,
  },
  screenImageContainer: {
    width: "40%",
  },
  infoImage: {
    width: 100,
    height: 60,
    resizeMode: "cover",
  },
  infoContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "60%",
  },
  infoName: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: "PoppinsBold",
  },

  //transaction info section
  transactionInfoContainer: {
    top: Platform.OS === "ios" ? 80 : 70,
    padding: 15,
    flexDirection: "column",
  },
  transactionHeading: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  transactionDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  transactionDetailsTextHeading: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
    marginTop: 15,
  },
  transactionDetailsTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    marginTop: 15,
  },
  transactionDetailsTextTotal: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
    marginTop: 15,
  },
});

export default TransactionSuccessScreen;
