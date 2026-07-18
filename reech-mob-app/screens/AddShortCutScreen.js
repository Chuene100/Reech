import React, { useEffect, useState } from "react";
import {
  FlatList,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Ionicons,
  Fontisto,
  Foundation,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

//customs
import { shortcutScreeItemsListData } from "../assets/data/shortcutScreenListData";
import { COLORS, icons } from "../constants";
import NavHeader from "@/components/Headers/NavHeader";

const AddShortCutScreen = () => {
  const navigation = useNavigation();

  //state handler
  const [iconList, setIconList] = useState([]);

  useEffect(() => {
    const icons = async () => {
      const listOfIcons = JSON.parse(await AsyncStorage.getItem("shortcutScreenListData")) ?? []
      setIconList(listOfIcons)
    }
    icons();
  }, [])

  const showError = (message) =>
    Toast.show({
      type: "error",
      text1: "Maximum shortcuts reached",
      text2: message,
    });

  // Function to add items to shortcutScreenListData
  const addShortcutItem = async (newItem, existingData) => {
    if (existingData.length < 8) {
      let newData = [...existingData];

      // Add other items if needed
      newData.push(newItem);
      setIconList(newData)
      await AsyncStorage.setItem("shortcutScreenListData", JSON.stringify(newData));
    }
    else {
      showError("You can only add up to 8 shortcuts.")
    }
  };

  // Function to remove items from shortcutScreenListData
  const removeShortcutItem = async (itemToRemove, existingData) => {
    try {
      let newData = existingData.filter((item) => item.id !== itemToRemove.id);
      setIconList(newData)
      await AsyncStorage.setItem("shortcutScreenListData", JSON.stringify(newData));
    }
    catch (error) {
      console.error("Error saving data to AsyncStorage:", error);
    }
  };

  // Call the addShortcutItem function to add the item to WelcomeScreen
  const handleItemSelection = async (item) => {
    if (item.screenNameIdentifier === "Reech Ride") {
      return;
    }

    const shortcutArr = JSON.parse(await AsyncStorage.getItem("shortcutScreenListData")) ?? []
    var idx = shortcutArr.findIndex(obj => obj.id === item.id)

    if (idx === -1) addShortcutItem(item, shortcutArr)
    else removeShortcutItem(item, shortcutArr)
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerCompContainers}>
        <NavHeader />
      </View>
    );
  }

  //shortcut items section
  function renderShortCutItemsSection() {
    //sort data list
    const sortedShortcutDataList = [...shortcutScreeItemsListData];

    sortedShortcutDataList.sort((a, b) => {
      return a.screenNameIdentifier.localeCompare(b.screenNameIdentifier);
    });

    return (
      <View style={styles.shortCutItemsContentContainer}>
        <ImageBackground
          source={icons.popupBg}
          style={styles.shortCutItemsContainer}
        >
          {/*heading section*/}
          <View style={styles.shortInnerHeadingContainer}>
            <Text style={styles.shortInnerHeadingTextItem}>Shortcuts</Text>
          </View>

          {/*subheading section*/}
          <View style={styles.shortInnerSubheadingContainer}>
            <Text style={styles.shortInnerSubheadingTextItem}>
              Choose up to 8 shortcuts
            </Text>
          </View>

          {/*shortcut list items section*/}
          <View style={styles.shortcutFlatListContainer}>
            <FlatList
              data={sortedShortcutDataList}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
              columnWrapperStyle={styles.shortcutItemContainer}
              contentContainerStyle={styles.shortcutItemsWrapper}
              renderItem={({ item, index }) => {
                var idx = iconList?.findIndex(obj => obj.id === item.id)

                return (
                  <View style={styles.shortCutListContainer}>
                    {/*add or remove button*/}
                    {item.screenNameIdentifier === "Reech Ride" ? (
                      <TouchableOpacity
                        style={styles.iconContainer}
                      >
                        <View style={styles.iconItem}>
                          <Ionicons
                            name="close-outline"
                            size={19}
                            color={COLORS.white}
                          />
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleItemSelection(item)}
                        style={styles.iconContainer}
                      >
                        <View style={styles.iconItem}>
                          {idx === -1 ? (
                            <Ionicons
                              name="add-outline"
                              size={20}
                              color={COLORS.white}
                            />
                          ) : (
                            <Ionicons
                              name="close-outline"
                              size={19}
                              color={COLORS.white}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    )
                    }

                    <View style={styles.shortcutItemsContentContainer}>
                      {/*short cut icon representor*/}
                      <View style={styles.shortcutItemsIconContainer}>
                        {item.screenNameIdentifier === "Reech Ride" ? (
                          <FontAwesome5
                            name="car-side"
                            size={Platform.OS === "ios" ? 35 : 28}
                            strokeWidth={0}
                            color={COLORS.white}
                          />
                        ) : item.screenNameIdentifier === "My wallet" ? (
                          <Fontisto
                            name="wallet"
                            size={Platform.OS === "ios" ? 35 : 28}
                            strokeWidth={0}
                            color={COLORS.white}
                          />
                        ) : item.screenNameIdentifier === "Dog walker" ? (
                          <Foundation
                            name="guide-dog"
                            size={Platform.OS === "ios" ? 40 : 28}
                            strokeWidth={0}
                            color={COLORS.white}
                          />
                        ) : item.screenNameIdentifier === "My rewards" ? (
                          <SimpleLineIcons
                            name="present"
                            size={Platform.OS === "ios" ? 35 : 28}
                            strokeWidth={0}
                            color={COLORS.white}
                          />
                        ) : item.screenNameIdentifier === "My wishlist" ? (
                          <FontAwesome
                            name="star"
                            size={Platform.OS === "ios" ? 35 : 28}
                            strokeWidth={0}
                            color={COLORS.white}
                          />
                        ) : item.screenNameIdentifier === "My dashboard" ? (
                          <Fontisto
                            name="pie-chart-2"
                            size={Platform.OS === "ios" ? 35 : 28}
                            color={COLORS.white}
                          />
                        ) : item.screenNameIdentifier === "Yoga instructor" ? (
                          <MaterialCommunityIcons
                            name="yoga"
                            size={Platform.OS === "ios" ? 35 : 28}
                            strokeWidth={0}
                            color={COLORS.white}
                          />
                        ) : item.screenNameIdentifier === "Gardener" ? (
                          <MaterialCommunityIcons
                            name="spade"
                            size={Platform.OS === "ios" ? 35 : 28}
                            strokeWidth={0}
                            color={COLORS.white}
                          />
                        ) : item.screenNameIdentifier === "Cleaner" ? (
                          <MaterialCommunityIcons
                            name="silverware-clean"
                            size={Platform.OS === "ios" ? 35 : 28}
                            strokeWidth={0}
                            color={COLORS.white}
                          />
                        ) : item.screenNameIdentifier === "Tutor" ? (
                          <FontAwesome5
                            name="book-reader"
                            size={Platform.OS === "ios" ? 35 : 28}
                            strokeWidth={0}
                            color={COLORS.white}
                          />
                        ) : item.screenNameIdentifier === "My QR Code" ? (
                          <MaterialCommunityIcons
                            name="qrcode-scan"
                            size={Platform.OS === "ios" ? 35 : 28}
                            strokeWidth={0}
                            color={COLORS.white}
                          />
                        ) : item.screenNameIdentifier === "Car washer" ? (
                          <MaterialIcons
                            name="local-car-wash"
                            size={Platform.OS === "ios" ? 35 : 28}
                            strokeWidth={0}
                            color={COLORS.white}
                          />
                        ) : item.screenNameIdentifier === "Barber" ? (
                          <FontAwesome
                            name="scissors"
                            size={Platform.OS === "ios" ? 35 : 28}
                            strokeWidth={0}
                            color={COLORS.white}
                          />
                        ) : item.screenNameIdentifier === "Dentist" ? (
                          <FontAwesome5
                            name="tooth"
                            size={Platform.OS === "ios" ? 35 : 28}
                            strokeWidth={0}
                            color={COLORS.white}
                          />
                        ) : item.screenNameIdentifier === "Baker" ? (
                          <MaterialCommunityIcons
                            name="cupcake"
                            size={Platform.OS === "ios" ? 35 : 28}
                            strokeWidth={0}
                            color={COLORS.white}
                          />
                        ) : item.screenNameIdentifier === "Au pair" ? (
                          <MaterialIcons
                            name="child-friendly"
                            size={Platform.OS === "ios" ? 35 : 28}
                            strokeWidth={0}
                            color={COLORS.white}
                          />
                        ) : item.screenNameIdentifier === "Accountant" ? (
                          <MaterialCommunityIcons
                            name="account-cash-outline"
                            size={Platform.OS === "ios" ? 35 : 28}
                            strokeWidth={0}
                            color={COLORS.white}
                          />
                        ) : item.screenNameIdentifier === "Forklift driver" ? (
                          <MaterialCommunityIcons
                            name="forklift"
                            size={Platform.OS === "ios" ? 35 : 28}
                            strokeWidth={0}
                            color={COLORS.white}
                          />
                        ) : null}
                      </View>

                      {/*short cut name item*/}
                      <View style={styles.shortcutItemsTextContainer}>
                        <Text
                          numberOfLines={1}
                          style={styles.shortcutItemsTextItem}
                        >
                          {item.screenNameIdentifier}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={
                <View style={styles.flatListFooterContainer} />
              }
            />

            {/*done button section*/}
            <View style={styles.doneButtonContainer}>
              <View style={styles.doneButtonContent}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("WelcomeScreen")
                  }
                  style={styles.doneContainer}
                >
                  <View style={styles.doneGradientContainer}>
                    <Text style={styles.doneTextItem}>Done</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  //screen content list
  function renderScreenContentList() {
    return (
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1532135468830-e51699205b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=988&q=80",
        }}
        style={styles.backgroundImageContainer}
      >
        {renderHeaderSection()}
        {renderShortCutItemsSection()}
      </ImageBackground>
    );
  }

  return (
    <View style={styles.shortcutScreenContainer}>
      {renderScreenContentList()}
    </View>
  );
};

const styles = StyleSheet.create({
  shortcutScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //background image
  backgroundImageContainer: {
    width: "100%",
    height: "100%",
    resizeMode: "center",
  },

  //header section
  headerCompContainers: {
    zIndex: 99,
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  //short items section
  shortCutItemsContentContainer: {
    marginTop: Platform.OS === "ios" ? 20 : 10,
    marginHorizontal: 10,
    alignItems: "center",
    flexDirection: "column",
  },
  shortCutItemsContainer: {
    height: Platform.OS === "ios" ? 750 : 670,
    width: "100%",
    borderRadius: 30,
    overflow: "hidden",
  },
  shortInnerHeadingContainer: {
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  shortInnerHeadingTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  shortInnerSubheadingContainer: {
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  shortInnerSubheadingTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //short cut flatlist section
  shortcutFlatListContainer: {
    height: Platform.OS === "ios" ? 600 : 540,
    paddingHorizontal: 20,
  },
  shortcutItemContainer: {
    width: "100%",
    maxHeight: "28%",
    marginBottom: 20,
  },
  shortcutItemsWrapper: {
    flexDirection: "column",
  },
  shortCutListContainer: {
    height: Platform.OS === "ios" ? 60 : 45,
    width: "35%",
    right: 15,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  iconContainer: {
    width: 20,
    height: 20,
    top: 5,
    left: 30,
    zIndex: 9,
    backgroundColor: COLORS.reechGray,
    borderRadius: 20,
  },
  iconItem: {
    left: 1,
  },
  shortcutItemsContentContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  shortcutItemsIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    minHeight: Platform.OS === "ios" ? 45 : 30,
  },
  shortcutItemsTextContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  shortcutItemsTextItem: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: "PoppinsLight",
  },
  flatListFooterContainer: {
    marginBottom: "0%",
  },

  //done button section
  doneButtonContainer: {
    marginLeft: "70%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  doneButtonContent: {
    width: "100%",
  },
  doneContainer: {
    zIndex: 10,
  },
  doneGradientContainer: {
    height: 38,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: COLORS.purpleDarker,
  },
  doneTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
});

export default AddShortCutScreen;
