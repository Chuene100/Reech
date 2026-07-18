import React, { useEffect, useState } from "react";
import { Modal, Image, ImageBackground, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { TextInput } from "react-native";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";

//import customs
import { requestedPaymentData } from "../../../../../assets/data/dashboardData/paymentTransactionData";
import { COLORS, images } from "../../../../../constants";
import { CustomInputRef, CustomInputTextAreaRef, EmptyFlatlistComponent, TransactionHeader } from "../../../../../components";
import NavHeader from "@/components/Headers/NavHeader";

const RequestPaymentScreen = () => {
  const { control, handleSubmit, reset } = useForm();

  //state handler
  const [pendingPayments, setPendingPayments] = useState(requestedPaymentData);
  const [isFetching, setIsFetching] = useState(false);
  const [sendPaymentModal, setSendPaymentModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [paymentSuccessModal, setPaymentSuccessModal] = useState(false);
  const [networkIssueModal, setNetworkIssueModal] = useState(false);

  //a method used to filter data according to the username
  const searchTransaction = (text) => {
    let filteredData = requestedPaymentData.filter(
      (x) =>
        String(x.requestedUsername.toLowerCase()).includes(text.toLowerCase()) ||
        String(x.requestedDate.toLowerCase()).includes(text.toLowerCase()) ||
        String(x.requestedRef.toLowerCase()).includes(text.toLowerCase())
    );
    setPendingPayments(filteredData);
  };

  const fetchData = () => {
    setPendingPayments(requestedPaymentData);
    setIsFetching(false);
  };
  const onRefresh = () => {
    setIsFetching(true);
    fetchData(pendingPayments);
  };

  const processUserPayment = (data) => {
    console.log("data sent", data);
    reset();
    setSendPaymentModal(false);

    setPaymentSuccessModal(true);
    setNetworkIssueModal(false);
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader message="What would you like to do?" />

        <TransactionHeader text={"Request payment"} />

        {/*custom search component*/}
        <View style={styles.searchTextItem}>
          <View style={styles.innerSearchContainer}>
            <View style={styles.textInputContainer}>
              <TextInput
                onChangeText={(text) => searchTransaction(text)}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Search"
                placeholderTextColor={COLORS.white}
                style={styles.inputRequests}
                enablesReturnKeyAutomatically
                textAlign="center"
              />
            </View>
            <FontAwesome name="search" size={16} color={COLORS.purpleDark} style={{ top: Platform.OS === "ios" ? 0 : 5 }} />
          </View>
        </View>
      </View>
    );
  }

  function renderPendingRequestsSection() {
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
          <Text style={styles.pendingHeadingItem}>Payment requests</Text>
        </View>

        <FlatList
          data={pendingPayments}
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
                      source={images.userFrame}
                      style={styles.gradientColorContainerRequest}
                    >
                      <Image
                        source={item.requestedUserImage}
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
                      {item.requestedUsername}
                    </Text>
                    <Text style={styles.pendingUserRef}>
                      Amount: R{formatMoney(item.requestedAmount)}
                    </Text>
                    <Text numberOfLines={1} style={styles.pendingUserRef}>
                      Ref: {item.requestedRef}
                    </Text>
                    <Text style={styles.pendingUserRef}>
                      Date: {item.requestedDate}
                    </Text>
                  </Pressable>

                  {/*button section*/}
                  <View style={styles.pendingReqButtonContainer}>
                    <View style={styles.buttonItemContainer}>
                      {/*add bubble mate button*/}
                      <TouchableOpacity
                        onPress={() => console.log("add bubble nate pressed")}
                        style={styles.buttonContentContainer}>
                        <Text
                          style={
                            [styles.buttonContentTextItem,
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

                      {/*send reminder button*/}
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedItem(item);
                          setSendPaymentModal(true);
                        }}
                        style={styles.buttonContentContainer}>
                        <Text style={[styles.buttonContentTextItem, { color: COLORS.purple }]}>
                          Send reminder
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={styles.flatListsItemsBottom} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <EmptyFlatlistComponent msg={
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

  //process send payment section
  function renderPaymentModal() {
    return (
      <Modal
        visible={sendPaymentModal}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        style={styles.requestModalContainer}
      >
        <View style={styles.requestInnerModalContainer}>
          {/*modal close action section*/}
          <View style={styles.requestInnerModalContent}>
            <Pressable onPress={() => setSendPaymentModal(false)}>
              <Ionicons name="close" size={18} color={COLORS.white} />
            </Pressable>
          </View>

          {/*content section*/}
          <View style={styles.requestModalContentContainer}>
            {/*image section*/}
            <View style={styles.requestModalImageContainer}>
              <ImageBackground
                source={selectedItem?.business ? images.businessFrame : images.userFrame}
                style={styles.requestModalImageBackground}
              >
                <Image
                  source={selectedItem?.requestedUserImage}
                  style={styles.requestModalImageItem}
                />
              </ImageBackground>
            </View>

            {/*text and form section*/}
            <View style={styles.requestModalTextContainer}>
              {/*username section*/}
              <View style={styles.requestModalUserTextContainer}>
                <Text style={styles.requestModalUserTextItem}>{selectedItem?.requestedUsername}</Text>
              </View>

              {/*form text input section*/}
              <View style={styles.requestModalForItemContainer}>
                {/*amount section*/}
                <View style={styles.requestModalHeaderItemContainer}>
                  <Text style={styles.requestModalHeaderTextItem}>Amount:</Text>
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
                <View style={styles.requestModalHeaderItemContainer}>
                  <Text style={styles.requestModalHeaderTextItem}>My reference:</Text>
                  <CustomInputRef
                    control={control}
                    name={"myReference"}
                    rules={{ required: "Please provide your reference." }}
                    money={false}
                  />
                </View>

                {/*their reference section*/}
                <View style={styles.requestModalHeaderItemContainer}>
                  <Text style={styles.requestModalHeaderTextItem}>Their reference:</Text>
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
                style={styles.requestButtonContainer}
              >
                <LinearGradient
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
                  style={styles.requestButtonGradientContainer}
                >
                  <Text style={styles.requestButtonTextItem}>Request</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  //request payment successful modal
  function renderRequestPaymentSuccessfulModal() {
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
        style={styles.requestModalContainer}
      >
        <View style={styles.requestPaymentInnerModalContainer}>
          {/*modal close action section*/}
          <View style={styles.requestInnerModalContent}>
            <Pressable onPress={closePaymentSuccessModal}>
              <Ionicons name="close" size={18} color={COLORS.white} />
            </Pressable>
          </View>

          {/*content section*/}
          <View style={styles.requestPaymentSuccessModalContentContainer}>
            {/*header text section*/}
            <View style={styles.requestPaymentSuccessHeaderTextContainer}>
              <Text style={styles.requestPaymentSuccessHeaderTextItem}>
                Request sent.
              </Text>
            </View>

            {/*image icon section*/}
            <View style={styles.requestPaymentSuccessIconContainer}>
              <Feather name="check" size={50} color={COLORS.white} />
            </View>
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
        style={styles.requestModalContainer}
      >
        <View style={styles.requestPaymentInnerModalContainer}>
          {/*modal close action section*/}
          <View style={styles.requestInnerModalContent}>
            <Pressable onPress={() => setNetworkIssueModal(false)}>
              <Ionicons name="close" size={18} color={COLORS.white} />
            </Pressable>
          </View>

          {/*content section*/}
          <View style={styles.requestPaymentSuccessModalContentContainer}>
            {/*header text section*/}
            <View style={styles.requestPaymentSuccessHeaderTextContainer}>
              <Text style={styles.requestPaymentSuccessHeaderTextItem}>
                Problem with the network connection.
              </Text>
            </View>

            {/*image section*/}
            <View style={styles.requestPaymentNetworkImageContainer}>
              <Image
                source={images.reechieGeneral}
                style={styles.requestPaymentNetworkImageItem}
              />
            </View>

            {/*network issue message section*/}
            <View style={styles.requestPaymentNetworkIssueHeaderTextContainer}>
              <Text style={styles.requestPaymentNetworkIssueHeaderTextItem}>
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
      {renderPendingRequestsSection()}
      {renderPaymentModal()}
      {renderRequestPaymentSuccessfulModal()}
      {renderNetworkIssueModal()}
    </View>
  );
};

export default RequestPaymentScreen;

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
  flatListsItemsBottom: {
    marginBottom: Platform.OS === "ios" ? 30 : 0
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  //search section
  searchTextItem: {
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
  inputRequests: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 14,
    width: "100%",
    alignItems: "center",
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
  },
  pendingReqContent: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 20,
  },
  pendingReqImageContainer: {
    width: Platform.OS === "ios" ? "20%" : "22%",
  },
  gradientColorContainerRequest: {
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
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
    bottom: Platform.OS === "ios" ? 8 : 9,
  },
  buttonItemContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
  },
  buttonContentContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Platform.OS === "ios" ? 13 : 8,
  },
  buttonContentTextItem: {
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },

  //request payment modal
  requestModalContainer: {
    flexDirection: "column",
  },
  requestInnerModalContainer: {
    flex: 1,
    top: 10,
    marginTop: "30%",
    padding: "4%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    backgroundColor: COLORS.black,
  },
  requestInnerModalContent: {
    right: 5,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  requestModalContentContainer: {
    width: "100%",
    marginTop: 10,
    flexDirection: "row",
  },
  requestModalImageContainer: {
    width: "30%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  requestModalImageBackground: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  requestModalImageItem: {
    width: 72,
    height: 72,
    resizeMode: "cover",
    borderRadius: 8,
  },
  requestModalTextContainer: {
    width: "68%",
    marginRight: 10,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  requestModalUserTextContainer: {
    width: "100%",
    flexDirection: "row",
  },
  requestModalUserTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  requestModalForItemContainer: {
    width: "100%",
    marginTop: 10,
    flexDirection: "column",
  },
  requestModalHeaderItemContainer: {
    flexDirection: "column",
    width: "100%",
    marginBottom: 5,
  },
  requestModalHeaderTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  requestButtonContainer: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  requestButtonGradientContainer: {
    width: "50%",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  requestButtonTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //request payment success modal section
  requestPaymentInnerModalContainer: {
    flex: 1,
    top: 10,
    marginTop: Platform.OS === "ios" ? "50%" : "58%",
    padding: "4%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    backgroundColor: COLORS.black,
  },
  requestPaymentSuccessModalContentContainer: {
    flex: 0.9,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  requestPaymentSuccessHeaderTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  requestPaymentSuccessHeaderTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
    textAlign: "center",
  },
  requestPaymentSuccessIconContainer: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    backgroundColor: COLORS.greenActive,
    marginVertical: 80,
  },

  //payment issue section
  requestPaymentNetworkImageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  requestPaymentNetworkImageItem: {
    width: 200,
    height: 200,
    resizeMode: "cover",
  },
  requestPaymentNetworkIssueHeaderTextContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  requestPaymentNetworkIssueHeaderTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    textAlign: "center"
  },
});
