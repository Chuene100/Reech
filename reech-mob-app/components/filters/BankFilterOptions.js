import React, { useState } from "react";
import { ImageBackground, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

//customs
import { COLORS, icons } from "../../constants";

const BankFilterOptions = () => {
  //modal states
  const [transactionOptionClicked, setTransactionOptionClicked] = useState(false);
  const [dateRangeOptionClicked, setDateRangeOptionClicked] = useState(false);

  //options: transaction
  const [allOption, setAllOption] = useState(true);
  const [madeOption, setMadeOption] = useState(false);
  const [receivedOption, setReceivedOption] = useState(false);
  const [tipsOption, setTipsOption] = useState(false);

  const allOptionItem = () => {
    setAllOption(true);
    setMadeOption(false);
    setReceivedOption(false);
    setTipsOption(false);
  };
  const madeOptionItem = () => {
    setAllOption(false);
    setMadeOption(true);
    setReceivedOption(false);
    setTipsOption(false);
  };
  const receiveOptionItem = () => {
    setAllOption(false);
    setMadeOption(false);
    setReceivedOption(true);
    setTipsOption(false);
  };
  const tipsOptionItem = () => {
    setAllOption(false);
    setMadeOption(false);
    setReceivedOption(false);
    setTipsOption(true);
  };

  //options: date range
  const [oneMonthOption, setOneMonthOption] = useState(false);
  const [twoMonthsOption, setTwoMonthsOption] = useState(false);
  const [threeMonthsOption, setThreeMonthsOption] = useState(false);

  const oneMonth = () => {
    setOneMonthOption(true);
    setTwoMonthsOption(false);
    setThreeMonthsOption(false);
  };
  const twoMonths = () => {
    setOneMonthOption(false);
    setTwoMonthsOption(true);
    setThreeMonthsOption(false);
  };
  const threeMonths = () => {
    setOneMonthOption(false);
    setTwoMonthsOption(false);
    setThreeMonthsOption(true);
  };

  return (
    <View style={styles.buttonContainer}>
      {/*button section: transaction type*/}
      <View style={styles.buttonContentItem}>
        <TouchableOpacity
          onPress={() => setTransactionOptionClicked(true)}
          style={styles.buttonContent}
        >
          {transactionOptionClicked ? (
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
              style={styles.buttonGradientContent}
            >
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonTextItem}>Transaction Type</Text>
              </View>
            </LinearGradient>
          ) : (
            <View style={styles.buttonGradientInactiveContent}>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonTextItem}>Transaction Type</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/*button section: date range*/}
      <View style={styles.buttonContentItem}>
        <TouchableOpacity
          onPress={() => setDateRangeOptionClicked(true)}
          style={styles.buttonContent}
        >
          {dateRangeOptionClicked ? (
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
              style={styles.buttonGradientContent}
            >
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonTextItem}>Date range</Text>
              </View>
            </LinearGradient>
          ) : (
            <View style={styles.buttonGradientInactiveContent}>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonTextItem}>Date range</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/*transaction modal*/}
      <Modal
        visible={transactionOptionClicked}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        style={styles.modalSortContainer}
      >
        <ImageBackground
          source={icons.popupBg}
          style={styles.innerSortModalContainer}
        >
          <View style={styles.innerSortModalHeader}>
            <Pressable onPress={() => setTransactionOptionClicked(false)}>
              <AntDesign name="close" size={18} color={COLORS.white} />
            </Pressable>
          </View>

          {/*options section*/}
          <>
            <View style={[styles.moreOptionContent, { marginBottom: 20 }]}>
              <View style={styles.modalOptionCOntainer}>
                {/*all option*/}
                <Pressable
                  onPress={() => allOptionItem()}
                  style={styles.modalOptionItem}
                >
                  <MaterialIcons
                    name={
                      allOption
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                    }
                    size={24}
                    color={allOption ? COLORS.purple : COLORS.white}
                  />
                  <Text style={styles.modalOptionName}>All</Text>
                </Pressable>

                <View style={styles.modalItemLiner} />

                {/*payment made option*/}
                <Pressable
                  onPress={() => madeOptionItem()}
                  style={styles.modalOptionItem}
                >
                  <MaterialIcons
                    name={
                      madeOption
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                    }
                    size={24}
                    color={madeOption ? COLORS.purple : COLORS.white}
                  />
                  <Text style={styles.modalOptionName}>Payments made</Text>
                </Pressable>

                <View style={styles.modalItemLiner} />

                {/*payment made option*/}
                <Pressable
                  onPress={() => receiveOptionItem()}
                  style={styles.modalOptionItem}
                >
                  <MaterialIcons
                    name={
                      receivedOption
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                    }
                    size={24}
                    color={receivedOption ? COLORS.purple : COLORS.white}
                  />
                  <Text style={styles.modalOptionName}>Payments received</Text>
                </Pressable>

                <View style={styles.modalItemLiner} />

                {/*tips option*/}
                <Pressable
                  onPress={() => tipsOptionItem()}
                  style={styles.modalOptionItem}
                >
                  <MaterialIcons
                    name={
                      tipsOption
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                    }
                    size={24}
                    color={tipsOption ? COLORS.purple : COLORS.white}
                  />
                  <Text style={styles.modalOptionName}>Tips</Text>
                </Pressable>
              </View>
            </View>
          </>
        </ImageBackground>
      </Modal>

      {/*date range modal*/}
      <Modal
        visible={dateRangeOptionClicked}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        style={styles.modalSortContainer}
      >
        <ImageBackground
          source={icons.popupBg}
          style={styles.innerSortDateModalContainer}
        >
          <View style={styles.innerSortModalHeader}>
            <Pressable onPress={() => setDateRangeOptionClicked(false)}>
              <AntDesign name="close" size={20} color={COLORS.white} />
            </Pressable>
          </View>

          {/*options section*/}
          <>
            <View style={[styles.moreOptionContent, { marginBottom: 20 }]}>
              <View style={styles.modalOptionCOntainer}>
                {/*30 days option*/}
                <Pressable
                  onPress={() => oneMonth()}
                  style={styles.modalOptionItem}
                >
                  <MaterialIcons
                    name={
                      oneMonthOption
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                    }
                    size={24}
                    color={oneMonthOption ? COLORS.purple : COLORS.white}
                  />
                  <Text style={styles.modalOptionName}>Show last 30 days</Text>
                </Pressable>

                <View style={styles.modalItemLiner} />

                {/*60 days option*/}
                <Pressable
                  onPress={() => twoMonths()}
                  style={styles.modalOptionItem}
                >
                  <MaterialIcons
                    name={
                      twoMonthsOption
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                    }
                    size={24}
                    color={twoMonthsOption ? COLORS.purple : COLORS.white}
                  />
                  <Text style={styles.modalOptionName}>Show last 60 days</Text>
                </Pressable>

                <View style={styles.modalItemLiner} />

                {/*90 days option*/}
                <Pressable
                  onPress={() => threeMonths()}
                  style={styles.modalOptionItem}
                >
                  <MaterialIcons
                    name={
                      threeMonthsOption
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                    }
                    size={24}
                    color={threeMonthsOption ? COLORS.purple : COLORS.white}
                  />
                  <Text style={styles.modalOptionName}>Show last 90 days</Text>
                </Pressable>
              </View>
            </View>
          </>
        </ImageBackground>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  //statement section
  buttonContainer: {
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  buttonContentItem: {
    width: "45%",
  },
  buttonContent: {
    width: "100%",
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonGradientContent: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  buttonGradientInactiveContent: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: COLORS.reechGray,
  },
  buttonTextContainer: {
    width: "98%",
    height: "90%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  buttonTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //modal section
  modalSortContainer: {
    marginTop: 10,
  },
  innerSortModalContainer: {
    height: 260,
    marginTop: "75%",
    padding: "4%",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: COLORS.reechGray,
  },
  innerSortDateModalContainer: {
    height: 210,
    marginTop: "75%",
    padding: "4%",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: COLORS.reechGray,
  },
  innerSortModalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalItemLiner: {
    alignSelf: "center",
    width: "100%",
    borderRadius: 20,
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 3,
  },
  modalTextHeading: {
    alignSelf: "center",
    color: COLORS.darkGray,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  modalOptionCOntainer: {
    flexDirection: "column",
  },
  modalOptionItem: {
    paddingHorizontal: 15,
    alignItems: "center",
    marginVertical: 15,
    flexDirection: "row",
  },
  modalOptionName: {
    left: 20,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
});

export default BankFilterOptions;
