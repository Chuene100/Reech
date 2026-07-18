import React from "react";
import { StyleSheet, View, Text, Platform, ImageBackground, ScrollView, Image, Dimensions, TouchableOpacity } from "react-native";
import { Entypo } from '@expo/vector-icons';

//import dependencies
import { pricingListData } from "@/assets/data/pricingListData";
import { COLORS } from "../../constants";
import { HeaderApp } from "../../components";
import { LinearGradient } from "expo-linear-gradient";

const ProfileBenefitsScreen = () => {
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth;

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerComponentContainer}>
        <HeaderApp words={"Profile Benefits"} />
      </View>
    );
  }

  //screen scroller section
  function renderScreenCardScrollerSection() {
    return (
      <View style={styles.scrollContentContainer}>
        {/*screen subheader section*/}
        <View style={styles.scrollTextHeaderContainer}>
          <Text style={styles.scrollTextHeaderItem}>Unlock your experience</Text>
          <Text style={styles.scrollTextItem}>swipe to see more</Text>
        </View>

        {/*scrolling cards*/}
        <ScrollView
          horizontal
          scrollEnabled
          pagingEnabled
          snapToAlignment="center"
          decelerationRate="fast"
          contentOffset={{ x: cardWidth * -2.5, y: 0 }}
          snapToOffsets={pricingListData.map((item, index) => cardWidth * index)}
          showsHorizontalScrollIndicator={false}
          style={styles.scrollingCardContainer}>
          {/*package items*/}
          {pricingListData.map((item, index) => (
            <View key={index} style={[
              styles.packageItemContainer,
              {
                marginLeft: index === 0 ? 10 : 10,
                marginRight: index === pricingListData.length - 1 ? 10 : 10,
              },
            ]}>
              {/*is hot section*/}
              <View style={styles.packageTitleContainer}>
                {item.isHotPackage && (
                  <View style={styles.packageHotContainer}>
                    <View style={styles.packageHotContent}>
                      <Text style={styles.packageHotTextItem}>Most Popular 🔥</Text>
                    </View>
                  </View>)}
              </View>

              {/*package name item section*/}
              <View style={styles.packageNameContainer}>
                <Text style={styles.packageNameTextItem}>{item.name}</Text>

                <Text style={styles.packagePriceTextItem}>
                  {item.currency === "USD" ? "$" : item.currency}
                  {item.price}.00/{item.recursionPeriod}</Text>
              </View>

              {/*people who use this package section*/}
              <View style={styles.packageTotalUsersContainer}>
                {/*bubble mate images section*/}
                <View style={styles.packageUserImageContent}>
                  {item.bubbleMatesUsingThisPackage.map((userImage, index) => (
                    <Image
                      key={index}
                      source={{ uri: userImage.bubbleMateImage }}
                      style={[
                        styles.packUserImageItem,
                        index === Math.floor(item.bubbleMatesUsingThisPackage.length / 2)
                          ? styles.packageUserMiddleImage
                          : null,
                      ]}
                    />
                  ))}
                </View>

                {/*bubble mate tally text name*/}
                {item.bubbleMatesUsingThisPackage.map((userName, index) => (
                  <View key={index} style={styles.bubbleMateNameItemContainer}>
                    <Text style={styles.bubbleMateNameTextItem}>
                      {index === 2 ? `Join ${userName.bubbleMateName} and ${item.numberOfPeopleInUse} others who use this package` : ''}
                    </Text>
                  </View>
                ))}
              </View>

              {/*package benefits section*/}
              <View style={styles.packageBenefitsContainer}>
                {item.packageBenefits.map((benefits, index) => (
                  <View key={index} style={styles.packageBenefitContent}>
                    {/*icon item*/}
                    <View style={styles.benefitIconContainer}>
                      <Entypo name="trophy" size={18} color={COLORS.white} />
                    </View>

                    {/*text item*/}
                    <View style={styles.benefitTextItemContainer}>
                      <Text style={styles.benefitTextItem}>{benefits.packageInclude}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/*about me button item*/}
              <TouchableOpacity
                onPress={() => console.log("process user subscription")}
                style={styles.orderTodayContainer}
              >
                <LinearGradient
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
                  style={styles.orderTodayGradientContainer}
                >
                  <Text style={styles.orderTodayTextItem}>Join Now</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    )
  }

  //description section
  function renderDescriptionSection() {
    return (
      <View style={styles.descriptionPackageContainer}>
        <Text style={styles.descriptionPackageTextItem}>
          Subscriptions automatically renews unless canceled in the settings at least 24 hours before current period ends. You will be charged to your Reech account. Unused portion of free trial is forfeited after purchase.
        </Text>
      </View>
    )
  }

  function renderScreenContentListSection() {
    return (
      <>
        {renderHeaderSection()}
        {renderScreenCardScrollerSection()}
        {renderDescriptionSection()}
      </>
    )
  }

  //screen content list
  return (
    <ImageBackground
      blurRadius={1}
      source={{ uri: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=1170&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}
      style={styles.container}
    >
      {renderScreenContentListSection()}
    </ImageBackground>
  );
};

//custom style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //header section
  headerComponentContainer: {
    zIndex: 99,
    marginTop: Platform.OS === "ios" ? "5%" : "-7%",
  },

  //scrolling section
  scrollContentContainer: {
    marginTop: 10,
    maxHeight: Platform.OS === "ios" ? "75%" : "78%",
    width: "100%",
  },
  scrollTextHeaderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  scrollTextHeaderItem: {
    color: COLORS.white,
    fontSize: 26,
    fontFamily: "PoppinsBold",
  },
  scrollTextItem: {
    marginTop: 5,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    fontStyle: "italic"
  },
  scrollingCardContainer: {
    marginVertical: 20,
    height: "100%",
    width: "100%",
    flexDirection: "row",
  },

  //package item section
  packageItemContainer: {
    width: Platform.OS === "ios" ? 410 : 340,
    borderRadius: 15,
    flexDirection: "column",
    backgroundColor: COLORS.reechGray,
  },
  packageTitleContainer: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  packageHotContainer: {
    width: 110,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: COLORS.purple,
  },
  packageHotContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  packageHotTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },
  packageNameContainer: {
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  packageNameTextItem: {
    color: COLORS.white,
    fontSize: 28,
    fontFamily: "PoppinsLight"
  },
  packagePriceTextItem: {
    marginVertical: 5,
    color: COLORS.white,
    fontSize: 28,
    fontFamily: "PoppinsBold"
  },
  packageTotalUsersContainer: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  packageUserImageContent: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  packUserImageItem: {
    width: 40,
    height: 40,
    resizeMode: "cover",
    borderRadius: 40,
    marginHorizontal: -5,
  },
  packageUserMiddleImage: {
    width: 75,
    height: 75,
    marginTop: Platform.OS === "ios" ? 0 : -10,
    marginBottom: 10,
    zIndex: 1,
  },
  bubbleMateNameItemContainer: {
    marginTop: -5,
    marginBottom: -2.5,
    justifyContent: "center",
    alignItems: "center",
  },
  bubbleMateNameTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight"
  },

  //package benefits section
  packageBenefitsContainer: {
    width: "90%",
    padding: 10,
  },
  packageBenefitContent: {
    width: "80%",
    flexDirection: "row",
  },
  benefitIconContainer: {
    width: "20%",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 5,
  },
  benefitTextItemContainer: {
    width: "90%",
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: Platform.OS === "ios" ? 20 : 5,
  },
  benefitTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
    textTransform: "capitalize"
  },

  //order today button section
  orderTodayContainer: {
    marginHorizontal: 20,
    zIndex: 1,
  },
  orderTodayGradientContainer: {
    width: "100%",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  orderTodayTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },

  //description section
  descriptionPackageContainer: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  descriptionPackageTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    textAlign: "center"
  }
});

export default ProfileBenefitsScreen;
