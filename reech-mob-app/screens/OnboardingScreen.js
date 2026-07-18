import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ConfettiCannon from "react-native-confetti-cannon";
import { Ionicons, Entypo } from "@expo/vector-icons";

//import customs
import { data } from "../assets/data/feedData/onboardingSlideData";
import { SIZES, COLORS } from "../constants";
import { EmptyFlatlistComponent } from "../components";

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const flatlistRef = useRef();

  const [shoot, setShoot] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [viewableItems, setViewableItems] = useState([]);

  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    setViewableItems(viewableItems);
  });

  useEffect(() => {
    if (!viewableItems[0] || currentPage === viewableItems[0].index) return;
    setCurrentPage(viewableItems[0].index);
  }, [viewableItems]);

  // //Time out to fire the cannon
  // useEffect(() => {
  //   setTimeout(() => {
  //     setShoot(true);
  //   }, 2000);
  // }, []);

  //To fire the cannon again. You can make your own logic here
  
  const handlePress = () => {
    setShoot(false);
    setTimeout(() => {
      setShoot(true);
    }, 500);
  };

  //navigate to opening screen
  function renderOpeningScreen() {
    navigation.navigate("SignUpScreen");
  }

  //handle next slide
  const handleNextSlide = () => {
    if (currentPage == data.length - 1) return;

    flatlistRef.current.scrollToIndex({
      animated: true,
      index: currentPage + 1,
    });
  };

  //handle back slide
  const handleBackSlide = () => {
    if (currentPage == 0) return;

    flatlistRef.current.scrollToIndex({
      animated: true,
      index: currentPage - 1,
    });
  };

  //handle skip
  const handleSkipToEnd = () => {
    flatlistRef.current.scrollToIndex({
      animate: true,
      index: data.length - 1,
    });
  };

  //render top section
  const renderTopSection = () => {
    return (
      <View>
        <View
          style={styles.topOnboardingContainer}
        >
          {/*back button - hide first screen*/}
          <TouchableOpacity
            onPress={handleBackSlide}
            style={styles.topOnboardingTouchContainer}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={COLORS.white}
              style={{ opacity: currentPage == 0 ? 0 : 1 }}
            />
          </TouchableOpacity>

          {/*skip button - hide skip last screen*/}
          <TouchableOpacity onPress={handleSkipToEnd}>
            <Text
              style={[
                styles.topOnboardingSkipTextItem,
                { opacity: currentPage == data.length - 1 ? 0 : 1 }
              ]}
            >
              Skip
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  //render bottom section
  const renderBottomSection = () => {
    return (
      <View style={styles.bottomDotsContainer}>
        {/*pagination section*/}
        <View style={styles.bottomDotPaginationContainer}>
          {
            //no. of dots
            [...Array(data.length)].map((_, index) => (
              <View
                key={index}
                style={[styles.bottomDotsItem, {
                  backgroundColor:
                    index == currentPage
                      ? COLORS.purpleDark
                      : COLORS.purple + "20",
                }]}
              />
            ))
          }
        </View>

        {/*next or get started section - hide next show get started*/}
        {currentPage != data.length - 1 ? (
          <TouchableOpacity
            onPress={handleNextSlide}
            style={styles.bottomNextButtonContainer}
            activeOpacity={0.8}
          >
            <Entypo
              name="chevron-right"
              size={18}
              color={COLORS.white}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={renderOpeningScreen}
            style={styles.bottomOpeningButtonContainer}
          >
            <Text style={styles.bottomOpeningTextItem}>Get Started</Text>

            <Entypo
              name="chevron-right"
              size={18}
              color={COLORS.white}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  //render flatlist section
  const renderFLatlistSection = ({ item }) => {
    return (
      <View
        style={[styles.flatlistItemContentContainer, { width: SIZES.width }]}
      >
        <View
          style={styles.flatlistItemContent}
        >
          <ImageBackground
            source={item.default ? item.img : { uri: item.img }}
            style={styles.flatlistLongImageMain}
          />
        </View>

        {/*onboarding image section*/}
        <Image
          source={require("../assets/reechLogo.png")}
          style={styles.reechLogoLongItem}
        />

        {/*onboarding text section*/}
        <View
          style={styles.onboardingTextContainer}
        >
          <Text
            style={styles.onboardingHeaderTextItem}
          >
            {item.title}
          </Text>

          <Text
            style={styles.onboardingDescriptionTextItem}
          >
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.onboardingScreenContainer}>
      {/*Top section navigation*/}
      {renderTopSection()}

      {/*Flatlist section with screens*/}
      <FlatList
        ref={flatlistRef}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderFLatlistSection}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged.current}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 100 }}
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        updateCellsBatchingPeriod={15}
        decelerationRate="fast"
        extraData={SIZES.width}
        ListEmptyComponent={<EmptyFlatlistComponent />}
      />

      {/*Bottom section with pagination & get started*/}
      {renderBottomSection()}

      {/*Cannon which will fire whenever shoot is true*/}
      {shoot ? <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} /> : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  onboardingScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //top skip section
  topOnboardingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.base * 2,
  },
  topOnboardingTouchContainer: {
    padding: SIZES.base
  },
  topOnboardingSkipTextItem: {
    fontSize: 16,
    color: COLORS.white,
    fontFamily: "PoppinsLight",
  },

  //bottom dots section
  bottomDotsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.base * 2,
    paddingVertical: SIZES.base * 2,
  },
  bottomDotPaginationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomDotsItem: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  bottomNextButtonContainer: {
    width: 60,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    backgroundColor: COLORS.purpleDark,
  },
  bottomOpeningButtonContainer: {
    height: 50,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: COLORS.purpleDark,
  },
  bottomOpeningTextItem: {
    marginRight: 5,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //flatlist item section
  flatlistItemContentContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  flatlistItemContent: {
    alignItems: "center",
    marginVertical: SIZES.base * 2,
  },
  flatlistLongImageMain: {
    top: Platform.OS === "ios" ? 35 : 45,
    width: Platform.OS === "ios" ? 420 : 400,
    height: Platform.OS === "ios" ? 460 : 460,
    resizeMode: "contain",
  },
  reechLogoLongItem: {
    width: 55,
    height: 55,
    right: 10,
    alignSelf: "flex-end",
    resizeMode: "contain",
    zIndex: 1,
    bottom: Platform.OS === "ios" ? 30 : 15,
  },
  onboardingTextContainer: {
    paddingHorizontal: SIZES.base * 4,
    marginVertical: SIZES.base * 4,
    bottom: 35,
  },
  onboardingHeaderTextItem: {
    color: COLORS.white,
    fontSize: 22,
    fontFamily: "PoppinsBold",
    textAlign: "center",
  },
  onboardingDescriptionTextItem: {
    marginTop: 20,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    lineHeight: 20,
    opacity: 0.4,
    textAlign: "center",
  }
});

export default OnboardingScreen;
