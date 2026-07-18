/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Image, ImageBackground, Modal, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { TextInput } from "react-native";
import { AntDesign, Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";

//import customs
import { sendPaymentData, myRecipientListData } from "../../../../../assets/data/dashboardData/paymentTransactionData";
import { COLORS, images } from "../../../../../constants";
import { CustomInputRef, CustomInputTextAreaRef, EmptyFlatlistComponent, TransactionHeader } from "../../../../../components";
import NavHeader from "@/components/Headers/NavHeader";

const SendPaymentScreen = () => {
  const { control, handleSubmit, reset } = useForm();

  //state handlers
  const [sendPayments, setSendPayments] = useState(sendPaymentData);
  const [isFetching, setIsFetching] = useState(false);
  const [sendPaymentModal, setSendPaymentModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [paymentSuccessModal, setPaymentSuccessModal] = useState(false);
  const [paymentInsufficientModal, setPaymentInsufficientModal] = useState(false);
  const [networkIssueModal, setNetworkIssueModal] = useState(false);
  const [recipientData, setRecipientData] = useState(myRecipientListData)
  const [recipientModal, setRecipientModal] = useState(false);

  //a method used to filter data according to the username
  const searchTransaction = (text) => {
    let filteredData = sendPaymentData.filter(
      (x) =>
        String(x.sendUsername.toLowerCase()).includes(text.toLowerCase()) ||
        String(x.sentDate.toLowerCase()).includes(text.toLowerCase()) ||
        String(x.sentRef.toLowerCase()).includes(text.toLowerCase())
    );
    setSendPayments(filteredData);
  };

  const searchRecipients = (text) => {
    let filteredData = myRecipientListData.filter(
      (x) =>
        String(x.userName.toLowerCase()).includes(text.toLowerCase()) ||
        String(x.blurb.toLowerCase()).includes(text.toLowerCase())
    );
    setRecipientData(filteredData);
  };

  const fetchData = () => {
    setSendPayments(sendPaymentData);
    setIsFetching(false);
  };
  const onRefresh = () => {
    setIsFetching(true);
    fetchData(sendPayments);
  };

  const processUserPayment = (data) => {
    console.log("data sent", data);
    setSendPaymentModal(false);

    setPaymentSuccessModal(true);
    setPaymentInsufficientModal(false);
    setNetworkIssueModal(false);
    reset();
  }

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader message="What would you like to do?" />

        <TransactionHeader text={"Send payment"} />

        {/*custom search component*/}
        <View style={styles.searchTextItem}>
          {/*search component*/}
          <View style={styles.innerSearchContainer}>
            <View style={styles.textInputContainer}>
              <TextInput
                onChangeText={(text) => searchTransaction(text)}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Search"
                placeholderTextColor={COLORS.white}
                style={styles.inputSends}
                enablesReturnKeyAutomatically={false}
                textAlign="center"
              />
            </View>
            <FontAwesome name="search" size={16} color={COLORS.purpleDark} style={{ top: Platform.OS === "ios" ? 0 : 5 }} />
          </View>

          {/*recipient section*/}
          <View style={styles.recipientContentContainer}>
            <TouchableOpacity onPress={() => setRecipientModal(true)} style={styles.recipientContainer}>
              <Text style={styles.recipientTextItem}>My Recipients</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  //send payment history section
  function renderSendSection() {
    function formatMoney(value) {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(0)}m`;
      } else {
        return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
      }
    }

    return (
      <View style={styles.pendingRequestContainer}>
        {/*pending header*/}
        <View style={styles.pendingHeadingContent}>
          <Text style={styles.pendingHeadingItem}>Requested payments</Text>
        </View>

        <FlatList
          data={sendPayments}
          onRefresh={onRefresh}
          refreshing={isFetching}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, i }) => {
            return (
              <View key={i} style={styles.pendingReqContainer}>
                <View style={styles.pendingReqContent}>
                  {/*image section*/}
                  <View style={styles.pendingReqImageContainer}>
                    <ImageBackground
                      source={
                        item.business ? images.businessFrame : images.userFrame
                      }
                      style={styles.gradientColorContainerSend}
                    >
                      <Image
                        source={item.sendUserImage}
                        style={styles.pendingUserImage}
                      />
                    </ImageBackground>
                  </View>

                  {/*text section*/}
                  <Pressable
                    onPress={() => {
                      setSelectedItem(item);
                      setSendPaymentModal(true);
                    }}
                    style={styles.pendingReqTextContainer}
                  >
                    <Text style={styles.pendingUserName}>
                      {item.sendUsername}
                    </Text>
                    <Text style={styles.pendingUserRef}>
                      Amount: R{formatMoney(item.sentAmount)}
                    </Text>
                    <Text numberOfLines={1} style={styles.pendingUserRef}>
                      Ref: {item.sentRef}
                    </Text>
                    <Text style={styles.pendingUserRef}>
                      Date: {item.sentDate}
                    </Text>
                  </Pressable>

                  {/*button section*/}
                  <View style={styles.pendingReqButtonContainer}>
                    <View style={styles.buttonContainer}>
                      {item.business ? (
                        <TouchableOpacity
                          onPress={() => console.log("add to wishlist pressed")}
                          style={styles.buttonContent}>
                          <Text
                            style={
                              [styles.buttonTextItem,
                              { color: item.bubbleMateStatus ? COLORS.orange : COLORS.purple }
                              ]
                            }
                          >
                            {item.bubbleMateStatus ? "See wishlist" : "Add to wishlist"}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => console.log("add bubble nate pressed")}
                          style={styles.buttonContent}>
                          <Text
                            style={
                              [styles.buttonTextItem,
                              {
                                color: item.bubbleMateStatus ? COLORS.orange :
                                  item.isBubbleMate ? COLORS.darkGray : COLORS.purple
                              }
                              ]
                            }
                          >
                            {item.bubbleMateStatus ? "Requested" : item.isBubbleMate ? "Bubble mate" : "Add to bubble"}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={styles.flatListItemsBottom} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
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

  //my recipient modal
  function renderMyRecipientModal() {
    return (
      <Modal
        visible={recipientModal}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        style={styles.sendModalContainer}
      >

        <View style={styles.sendInnerModalContainer}>
          {/*modal close action section*/}
          <View style={styles.sendInnerModalContent}>
            <Pressable onPress={() => setRecipientModal(false)}>
              <Ionicons name="close" size={18} color={COLORS.white} />
            </Pressable>
          </View>

          {/*search recipients*/}
          <View style={styles.searchTextItem}>
            <View style={styles.innerSearchContainer}>
              <View style={styles.textInputContainer}>
                <TextInput
                  onChangeText={(text) => searchRecipients(text)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Search recipients"
                  placeholderTextColor={COLORS.white}
                  style={styles.inputSends}
                  enablesReturnKeyAutomatically={false}
                  textAlign="center"
                />
              </View>
              <FontAwesome name="search" size={16} color={COLORS.purpleDark} style={{ top: Platform.OS === "ios" ? 0 : 5 }} />
            </View>

            <View style={styles.recipientContentContainer}>
              <TouchableOpacity onPress={() => console.log("add recipient")} style={styles.recipientContainer}>
                <Text style={styles.recipientTextItem}>Add Recipient</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/*recipient data list*/}
          <FlatList
            data={recipientData}
            onRefresh={onRefresh}
            refreshing={isFetching}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, i }) => {
              return (
                <View key={i} style={styles.recipientListContainer}>
                  <View style={styles.recipientListContent}>
                    {/*image item*/}
                    <View></View>

                    {/*text item*/}

                    {/*bubble action item*/}
                  </View>
                </View>
              )
            }}
          />
        </View>
      </Modal>
    )
  }

  //process send payment section
  function renderPaymentModal() {
    return (
      <Modal
        visible={sendPaymentModal}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        style={styles.sendModalContainer}
      >
        <View style={styles.sendInnerModalContainer}>
          {/*modal close action section*/}
          <View style={styles.sendInnerModalContent}>
            <Pressable onPress={() => setSendPaymentModal(false)}>
              <Ionicons name="close" size={18} color={COLORS.white} />
            </Pressable>
          </View>

          {/*content section*/}
          <View style={styles.sendModalContentContainer}>
            {/*image section*/}
            <View style={styles.sendModalImageContainer}>
              <ImageBackground
                source={selectedItem?.business ? images.businessFrame : images.userFrame}
                style={styles.sendModalImageBackground}
              >
                <Image
                  source={selectedItem?.sendUserImage}
                  style={styles.sendModalImageItem}
                />
              </ImageBackground>
            </View>

            {/*text and form section*/}
            <View style={styles.sendModalTextContainer}>
              {/*username section*/}
              <View style={styles.sendModalUserTextContainer}>
                <Text style={styles.sendModalUserTextItem}>{selectedItem?.sendUsername}</Text>
              </View>

              {/*form text input section*/}
              <View style={styles.sendModalForItemContainer}>
                {/*amount section*/}
                <View style={styles.sendModalHeaderItemContainer}>
                  <Text style={styles.sendModalHeaderTextItem}>Amount:</Text>
                  <CustomInputRef
                    control={control}
                    name={"requestedAmount"}
                    rules={{
                      required: "Please provide an amount",
                      pattern: {
                        value: /^[0-9\b]+$/,
                        message:
                          "Your entry cannot contain strings or special characters",
                      },
                      maxLength: {
                        value: 100,
                        message: "Amount must not be more than 100 digits long",
                      },
                    }}
                    placeholder={"R0.00"}
                    money={true}
                  />
                </View>

                {/*my reference section*/}
                <View style={styles.sendModalHeaderItemContainer}>
                  <Text style={styles.sendModalHeaderTextItem}>My reference:</Text>
                  <CustomInputRef
                    control={control}
                    name={"myReference"}
                    rules={{ required: "Please provide your reference." }}
                    money={false}
                  />
                </View>

                {/*their reference section*/}
                <View style={styles.sendModalHeaderItemContainer}>
                  <Text style={styles.sendModalHeaderTextItem}>Their reference:</Text>
                  <CustomInputTextAreaRef
                    control={control}
                    name={"theirReference"}
                    rules={{ required: "Please provide their reference." }}
                  />
                </View>
              </View>

              {/*form button section*/}
              <Pressable
                onPress={handleSubmit(processUserPayment)}
                style={styles.sendButtonContainer}
              >
                <LinearGradient
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
                  style={styles.sendButtonGradientContainer}
                >
                  <Text style={styles.sendButtonTextItem}>Pay</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  //payment successful modal
  function renderPaymentSuccessfulModal() {
    const closePaymentSuccessModal = () => {
      setPaymentSuccessModal(false);
    }

    useEffect(() => {
      const timer = setTimeout(closePaymentSuccessModal, 5000);
      return () => clearTimeout(timer);
    }, [paymentSuccessModal]);

    return (
      <Modal
        visible={paymentSuccessModal}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        style={styles.sendModalContainer}
      >
        <View style={styles.paymentInnerModalContainer}>
          {/*modal close action section*/}
          <View style={styles.sendInnerModalContent}>
            <Pressable onPress={closePaymentSuccessModal}>
              <Ionicons name="close" size={18} color={COLORS.white} />
            </Pressable>
          </View>

          {/*content section*/}
          <View style={styles.paymentSuccessModalContentContainer}>
            {/*header text section*/}
            <View style={styles.paymentSuccessHeaderTextContainer}>
              <Text style={styles.paymentSuccessHeaderTextItem}>
                Payment successful.
              </Text>
            </View>

            {/*image icon section*/}
            <View style={styles.paymentSuccessIconContainer}>
              <Feather name="check" size={50} color={COLORS.white} />
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  //payment insufficient modal
  function renderPaymentInsufficientModal() {
    return (
      <Modal
        visible={paymentInsufficientModal}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        style={styles.sendModalContainer}
      >
        <View style={styles.paymentInnerModalContainer}>
          {/*modal close action section*/}
          <View style={styles.sendInnerModalContent}>
            <Pressable onPress={() => setPaymentInsufficientModal(false)}>
              <Ionicons name="close" size={18} color={COLORS.white} />
            </Pressable>
          </View>

          {/*content section*/}
          <View style={styles.paymentSuccessModalContentContainer}>
            {/*header text section*/}
            <View style={styles.paymentSuccessHeaderTextContainer}>
              <Text style={styles.paymentSuccessHeaderTextItem}>
                Payment unsuccessful.
              </Text>
            </View>

            {/*image icon section*/}
            <View style={styles.paymentUnsuccessIconContainer}>
              <AntDesign name="close" size={50} color={COLORS.white} />
            </View>

            <Pressable
              onPress={() => console.log("send user to wallet screen for account top-up")}
              style={styles.topUpButtonContainer}
            >
              <LinearGradient
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
                style={styles.topUpButtonGradientContainer}
              >
                <Text style={styles.topUpButtonTextItem}>Please top up</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </Modal>
    )
  }

  //network issue modal
  function renderNetworkIssueModal() {
    return (
      <Modal
        visible={networkIssueModal}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        style={styles.sendModalContainer}
      >
        <View style={styles.paymentInnerModalContainer}>
          {/*modal close action section*/}
          <View style={styles.sendInnerModalContent}>
            <Pressable onPress={() => setNetworkIssueModal(false)}>
              <Ionicons name="close" size={18} color={COLORS.white} />
            </Pressable>
          </View>

          {/*content section*/}
          <View style={styles.paymentSuccessModalContentContainer}>
            {/*header text section*/}
            <View style={styles.paymentSuccessHeaderTextContainer}>
              <Text style={styles.paymentSuccessHeaderTextItem}>
                Problem with the network connection.
              </Text>
            </View>

            {/*image section*/}
            <View style={styles.paymentNetworkImageContainer}>
              <Image
                source={images.reechieGeneral}
                style={styles.paymentNetworkImageItem}
              />
            </View>

            {/*network issue message section*/}
            <View style={styles.paymentNetworkIssueHeaderTextContainer}>
              <Text style={styles.paymentNetworkIssueHeaderTextItem}>
                We were unable to connect to your internet. Please check your network settings on your device and try again later.
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <View style={styles.container}>
      {renderHeaderSection()}
      {renderSendSection()}
      {renderMyRecipientModal()}
      {renderPaymentModal()}
      {renderPaymentSuccessfulModal()}
      {renderPaymentInsufficientModal()}
      {renderNetworkIssueModal()}
    </View>
  );
};

export default SendPaymentScreen;

const styles = StyleSheet.create({
  //top level
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerContainer: {
    marginHorizontal: 10,
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },
  flatListItemsBottom: {
    marginBottom: Platform.OS === "ios" ? 30 : 10
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  //search section
  searchTextItem: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 5,
  },
  innerSearchContainer: {
    width: "70%",
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
  inputSends: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 14,
    width: "100%",
    alignItems: "center",
  },
  recipientContentContainer: {
    width: "30%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  recipientContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  recipientTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight"
  },

  //pending section
  pendingRequestContainer: {
    flex: 1,
    flexDirection: "column",
  },
  pendingHeadingContent: {
    paddingTop: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  pendingHeadingItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  pendingReqContainer: {
    paddingHorizontal: Platform.OS === "ios" ? 10 : 12,
    flexDirection: "column",
    zIndex: 99,
  },
  pendingReqContent: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 20,
  },
  pendingReqImageContainer: {
    width: Platform.OS === "ios" ? "20%" : "22%",
  },
  gradientColorContainerSend: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  pendingUserImage: {
    width: 62,
    height: 62,
    resizeMode: "cover",
    borderRadius: 6,
  },
  pendingReqTextContainer: {
    width: "49%",
    marginHorizontal: 5,
  },
  pendingUserName: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  pendingUserRef: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //bottom button
  pendingReqButtonContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    width: "30%",
  },
  buttonContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "column",
  },
  buttonContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTextItem: {
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },

  //recipient modal
  recipientListContainer: {
    flexDirection: "column",
  },
  recipientListContent: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  //send payment modal
  sendModalContainer: {
    flexDirection: "column",
  },
  sendInnerModalContainer: {
    flex: 1,
    top: 10,
    marginTop: "30%",
    padding: "4%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    backgroundColor: COLORS.black,
  },
  sendInnerModalContent: {
    right: 5,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  sendModalContentContainer: {
    width: "100%",
    marginTop: 10,
    flexDirection: "row",
  },
  sendModalImageContainer: {
    width: "30%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  sendModalImageBackground: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  sendModalImageItem: {
    width: 72,
    height: 72,
    resizeMode: "cover",
    borderRadius: 8,
  },
  sendModalTextContainer: {
    width: "68%",
    marginRight: 10,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  sendModalUserTextContainer: {
    width: "100%",
    flexDirection: "row",
  },
  sendModalUserTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  sendModalForItemContainer: {
    width: "100%",
    marginTop: 10,
    flexDirection: "column",
  },
  sendModalHeaderItemContainer: {
    flexDirection: "column",
    width: "100%",
    marginBottom: 5,
  },
  sendModalHeaderTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  sendButtonContainer: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  sendButtonGradientContainer: {
    width: "50%",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  sendButtonTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //payment success modal section
  paymentInnerModalContainer: {
    flex: 1,
    top: 10,
    marginTop: Platform.OS === "ios" ? "50%" : "58%",
    padding: "4%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    backgroundColor: COLORS.black,
  },
  paymentSuccessModalContentContainer: {
    flex: 0.9,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  paymentSuccessHeaderTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  paymentSuccessHeaderTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
    textAlign: "center",
  },
  paymentSuccessIconContainer: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    backgroundColor: COLORS.greenActive,
    marginVertical: 80,
  },

  //insufficient funds modal
  paymentUnsuccessIconContainer: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    backgroundColor: COLORS.coralRed,
    marginVertical: 80,
  },
  topUpButtonContainer: {
    width: "100%",
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  topUpButtonGradientContainer: {
    width: "65%",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  topUpButtonTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //payment issue section
  paymentNetworkImageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  paymentNetworkImageItem: {
    width: 200,
    height: 200,
    resizeMode: "cover",
  },
  paymentNetworkIssueHeaderTextContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  paymentNetworkIssueHeaderTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    textAlign: "center"
  },
});