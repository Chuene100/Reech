import React, { useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Entypo, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";

//custom

import { COLORS, icons } from "../../../constants";
import {

  CustomCalendarRangerPicker,
} from "../../../components";
import NavHeader from "@/components/Headers/NavHeader";
import DropDown from "@/components/UI/DropDown";
import { carType } from "@/assets/data/dropDownData";
import { timeOptions } from "@/assets/data/timeOptions";

const DriverAddOpportunityHomeScreen = () => {
  const navigation = useNavigation();

  //form control: validate
  const {
    control,
    handleSubmit,
    // formState: { errors },
    watch,
  } = useForm({});

  const [bubbleActivate, setBubbleActive] = useState(false);
  const [businessesActivate, setBusinessesActive] = useState(false);

  const [watchCarName] = watch(["carName"]);

  //driver images
  const driverCarImage = [
    "https://www.freepnglogos.com/uploads/honda-car-png/honda-car-honda-accord-hybrid-gets-more-power-improved-2.png",
    "https://www.freepnglogos.com/uploads/honda-car-png/honda-car-honda-specs-trims-colors-carsm-26.png",
    "https://www.freepnglogos.com/uploads/bmw-png/blue-bmw-coupe-car-png-image-pngpix-5.png",
    "https://www.freepnglogos.com/uploads/mercedes-png/silver-mercedes-benz-class-cabriolet-car-png-image-pngpix-31.png",
    "https://i.pinimg.com/originals/1c/e1/4a/1ce14aea764285901bc237a28a615474.png",
    "https://hyundaipasig.com/wp-content/uploads/2016/10/h100-4-min-1.png",
    "https://comealiveshuttles.co.za/wp-content/uploads/2017/05/ToyotaQuantum.png",
    "https://www.freepnglogos.com/uploads/car-png/car-png-large-images-40.png",
    "https://imageio.forbes.com/blogs-images/davidkiley5/files/2018/04/CosyVehicleImage-copy.png?format=png&width=1200",
  ];

  //trip type options
  const [anyValue, setAnyValue] = useState(false);
  const [generaleValue, setGeneralValue] = useState(false);
  const [luxuryValue, setLuxuryValue] = useState(false);

  const setAny = () => {
    setAnyValue(true);
    setGeneralValue(false);
    setLuxuryValue(false);
  };
  const setGeneral = () => {
    setAnyValue(false);
    setGeneralValue(true);
    setLuxuryValue(false);
  };
  const setLuxury = () => {
    setAnyValue(false);
    setGeneralValue(false);
    setLuxuryValue(true);
  };

  //request identifier options
  const [selectRequestTimerNowItem, setSelectRequestTimerNowItem] = useState(false);
  const [selectRequestTimerLaterItem, setSelectRequestTimerLaterItem] = useState(false);

  const setNow = () => {
    setSelectRequestTimerNowItem(true);
    setSelectRequestTimerLaterItem(false);
  };
  const setLater = () => {
    setSelectRequestTimerNowItem(false);
    setSelectRequestTimerLaterItem(true);
  };

  //submit data
  const submitDriverData = (data) => {
    //user data
    const payload = {
      ...data,
      carImage:
        watchCarName === "Sedan"
          ? driverCarImage[0]
          : watchCarName === "SUV"
            ? driverCarImage[1]
            : watchCarName === "Coupe"
              ? driverCarImage[2]
              : watchCarName === "Convertible"
                ? driverCarImage[3]
                : watchCarName === "Van"
                  ? driverCarImage[4]
                  : watchCarName === "Truck"
                    ? driverCarImage[5]
                    : watchCarName === "Minibus"
                      ? driverCarImage[6]
                      : watchCarName === "Sportscar"
                        ? driverCarImage[7]
                        : watchCarName === "Electric Vehicle"
                          ? driverCarImage[8]
                          : null,
      bubbleMatesOnly: bubbleActivate,
      businessOnly: businessesActivate,
      tripType: anyValue ? "Any" : generaleValue ? "General" : luxuryValue ? "Luxury" : "Any",
      requestedWhen: selectRequestTimerNowItem ? "now" : selectRequestTimerLaterItem ? "later" : "",
    };

    if (data === null)
      alert("Please complete the form to proceed further");
    else
      navigation.navigate("DriverAddOpportunityLocationScreen", {
        data: payload,
      });
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerComponentContainer}>
        <NavHeader
          message="What would you like to do?"
        />
      </View>
    );
  }

  //top heading section
  function renderHeadingTopSection() {
    return (
      <View style={styles.headingContentContainer}>
        <View style={styles.headingTopLinearItem} />
        <Text style={styles.headingTextItem}>Create an opportunity card</Text>

        {/*car picker dropdown*/}
        <DropDown
          control={control}
          data={carType}
          name="carName"
        />

        {/*change image based on dropdown item picked*/}
        {watchCarName ? (
          <View style={styles.headerCarImageContainer}>
            <Image
              source={
                watchCarName === "Sedan"
                  ? { uri: driverCarImage[0] }
                  : watchCarName === "SUV"
                    ? { uri: driverCarImage[1] }
                    : watchCarName === "Coupe"
                      ? { uri: driverCarImage[2] }
                      : watchCarName === "Convertible"
                        ? { uri: driverCarImage[3] }
                        : watchCarName === "Van"
                          ? { uri: driverCarImage[4] }
                          : watchCarName === "Truck"
                            ? { uri: driverCarImage[5] }
                            : watchCarName === "Minibus"
                              ? { uri: driverCarImage[6] }
                              : watchCarName === "Sportscar"
                                ? { uri: driverCarImage[7] }
                                : watchCarName === "Electric Vehicle"
                                  ? { uri: driverCarImage[8] }
                                  : null
              }
              style={styles.headerCarImageItem}
            />
          </View>
        ) : null}
      </View>
    );
  }

  //privacy section
  function renderPrivacyOptionSelectorSection() {
    return (
      <View style={styles.privacySelectorOptionContainer}>
        {/*bubble mate only item*/}
        <View style={styles.selectorContentContainer}>
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[COLORS.purpleDark, COLORS.purpleDark, COLORS.purple]}
            style={styles.selectorGradientContainer}
          >
            {/*selector inner items*/}
            <View style={styles.selectorTextContainerItems}>
              {/*selector text section*/}
              <View style={styles.selectorTextContainer}>
                <Text style={styles.selectorTextItem}>Bubble mates only</Text>
              </View>

              {/*selector icon section*/}
              <TouchableOpacity
                onPress={() => setBubbleActive(!bubbleActivate)}
                style={[
                  styles.selectorIconContainer,
                  {
                    backgroundColor: bubbleActivate ? COLORS.purple : null,
                  },
                ]}
              >
                <Image
                  source={
                    bubbleActivate ? icons.bubbleIcon : icons.bubbleActive
                  }
                  style={styles.selectorIconItem}
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/*selector blurb text*/}
          <View style={styles.selectorBlurbTextItemContainer}>
            <Text style={styles.selectorBlurbTextItem}>
              This opportunity card will only be visible to your bubble mates
            </Text>
          </View>
        </View>

        {/*businesses only item*/}
        <View style={styles.selectorContentContainer}>
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[COLORS.purpleDark, COLORS.purpleDark, COLORS.purple]}
            style={styles.selectorGradientContainer}
          >
            {/*selector inner items*/}
            <View style={styles.selectorTextContainerItems}>
              {/*selector text section*/}
              <View style={styles.selectorTextContainer}>
                <Text style={styles.selectorTextItem}>Businesses only</Text>
              </View>

              {/*selector icon section*/}
              <TouchableOpacity
                onPress={() => setBusinessesActive(!businessesActivate)}
                style={[
                  styles.selectorIconContainer,
                  {
                    backgroundColor: businessesActivate ? COLORS.purple : null,
                  },
                ]}
              >
                <Entypo
                  name="briefcase"
                  size={18}
                  color={businessesActivate ? COLORS.white : COLORS.purple}
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/*selector blurb text*/}
          <View style={styles.selectorBlurbTextItemContainer}>
            <Text style={styles.selectorBlurbTextItem}>
              The opportunity card will only be visible to businesses
            </Text>
          </View>
        </View>

        {/*warning text section*/}
        <View style={styles.selectorWarningTextContainer}>
          <Text style={styles.selectorWarningTextItem}>
            Please note for your safety, all driver requests will be posted
            incognito
          </Text>
        </View>
      </View>
    );
  }

  //trip type option section
  function renderTripTypeSection() {
    return (
      <View style={styles.tripTypeItemsContainer}>
        {/*any button item*/}
        <Pressable
          onPress={() => setAny()}
          style={[
            styles.tripTypeButtonContainer,
            {
              borderColor: anyValue ? COLORS.purple : COLORS.transparent,
            },
          ]}
        >
          <LinearGradient
            start={{ x: 0.99, y: 0.0 }}
            end={{ x: 0.01, y: 0.0 }}
            colors={
              anyValue
                ? [COLORS.black, COLORS.purple, COLORS.black]
                : [COLORS.reechGray, COLORS.reechGray, COLORS.reechGray]
            }
            style={styles.tripTypeGradientContainer}
          >
            <Text style={styles.tripTypeTextItem}>Any</Text>
          </LinearGradient>
        </Pressable>

        {/*general button item*/}
        <Pressable
          onPress={() => setGeneral()}
          style={[
            styles.tripTypeButtonContainer,
            {
              borderColor: generaleValue ? COLORS.purple : COLORS.transparent,
            },
          ]}
        >
          <LinearGradient
            start={{ x: 0.99, y: 0.0 }}
            end={{ x: 0.01, y: 0.0 }}
            colors={
              generaleValue
                ? [COLORS.black, COLORS.purple, COLORS.black]
                : [COLORS.reechGray, COLORS.reechGray, COLORS.reechGray]
            }
            style={styles.tripTypeGradientContainer}
          >
            <Text style={styles.tripTypeTextItem}>General</Text>
          </LinearGradient>
        </Pressable>

        {/*luxury button item*/}
        <Pressable
          onPress={() => setLuxury()}
          style={[
            styles.tripTypeButtonContainer,
            {
              borderColor: luxuryValue ? COLORS.purple : COLORS.transparent,
            },
          ]}
        >
          <LinearGradient
            start={{ x: 0.99, y: 0.0 }}
            end={{ x: 0.01, y: 0.0 }}
            colors={
              luxuryValue
                ? [COLORS.black, COLORS.purple, COLORS.black]
                : [COLORS.reechGray, COLORS.reechGray, COLORS.reechGray]
            }
            style={styles.tripTypeGradientContainer}
          >
            <Text style={styles.tripTypeTextItem}>Luxury</Text>
          </LinearGradient>
        </Pressable>
      </View>
    );
  }

  //driver request duration
  function renderDriverRequestDurationSection() {
    return (
      <View style={styles.requestDurationContainer}>
        {/*identifier text*/}
        <View style={styles.identifierContainer}>
          <Text style={styles.identifierTextItem}>When:</Text>
        </View>

        {/*now identifier*/}
        <View style={styles.nowIdentifierContainer}>
          {/*name identifier*/}
          <View style={styles.nowIdentifierTextContainer}>
            <Text style={styles.nowIdentifierTextItem}>Now</Text>
          </View>

          {/*checkbox identifier*/}
          <TouchableOpacity
            onPress={() => setNow()}
            style={styles.nowIdentifierCheckContainer}
          >
            {selectRequestTimerNowItem ? (
              <Feather name="check-circle" size={28} color={COLORS.purple} />
            ) : (
              <Entypo name="circle" size={28} color={COLORS.purple} />
            )}
          </TouchableOpacity>
        </View>

        {/*later identifier*/}
        <View style={styles.nowIdentifierContainer}>
          {/*name identifier*/}
          <View style={styles.nowIdentifierTextContainer}>
            <Text style={styles.nowIdentifierTextItem}>Later</Text>
          </View>

          {/*checkbox identifier*/}
          <TouchableOpacity
            onPress={() => setLater()}
            style={styles.nowIdentifierCheckContainer}
          >
            {selectRequestTimerLaterItem ? (
              <Feather name="check-circle" size={28} color={COLORS.purple} />
            ) : (
              <Entypo name="circle" size={28} color={COLORS.purple} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  //ride duration section
  function renderRideDurationSection() {
    return (
      <View
        style={[
          styles.rideDurationContainer,
          {
            height: selectRequestTimerLaterItem
              ? 400
              : Platform.OS === "ios"
                ? 120
                : 10,
          },
        ]}
      >
        {selectRequestTimerLaterItem ? (
          <>
            {/*calendar setter component*/}
            <View style={styles.riderDurationCalendarContainer}>
              <CustomCalendarRangerPicker
                control={control}
                name={"duration"}
                rules={{
                  require: "Please add a duration for this opportunity",
                }}
              />
            </View>

            {/*time setter component*/}
            <View style={styles.riderDurationTimeContainer}>
              <DropDown
                control={control}
                placeholder={'Time'}
                data={timeOptions}
                name="requestTime"
                rules={{
                  require: "Please provide a time to be picked up",
                }}
              />
            </View>
          </>
        ) : null}
      </View>
    );
  }

  //confirm button section
  function renderConfirmButtonSection() {
    return (
      <View style={styles.confirmButtonContainer}>
        <View style={styles.confirmButtonContent}>
          <Pressable
            onPress={handleSubmit(submitDriverData)}
            style={styles.confirmContainer}
          >
            <View style={styles.confirmGradientContainer}>
              <Text style={styles.confirmTextItem}>
                Confirm
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    );
  }

  //screen content list
  function renderScreenContentList() {
    return (
      <>
        {renderHeaderSection()}
        <View style={styles.screenContentContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={styles.scrollingSectionContainer}
          >
            {renderHeadingTopSection()}
            {renderPrivacyOptionSelectorSection()}
            {renderTripTypeSection()}
            {renderDriverRequestDurationSection()}
            {renderRideDurationSection()}
            {renderConfirmButtonSection()}
          </ScrollView>
        </View>
      </>
    );
  }

  //screen renderer
  return <View style={styles.container}>{renderScreenContentList()}</View>;
};

//custom
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //header section
  headerComponentContainer: {
    zIndex: 99,
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  //screen content container
  screenContentContainer: {
    marginTop: 60,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: "#141414",
  },
  scrollingSectionContainer: {
    height: Platform.OS === "ios" ? 790 : 620,
    marginVertical: 20,
    paddingHorizontal: 20,
  },

  //heading top section
  headingContentContainer: {
    marginBottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  headingTopLinearItem: {
    width: "15%",
    marginBottom: 15,
    borderBottomColor: COLORS.white,
    borderBottomWidth: StyleSheet.hairlineWidth * 7,
  },
  headingTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
    marginBottom: 10,
  },
  headerCarImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 120,
  },
  headerCarImageItem: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },

  //privacy selector section
  privacySelectorOptionContainer: {
    flexDirection: "column",
  },
  selectorContentContainer: {
    width: "100%",
    marginBottom: 20,
  },
  selectorGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 45,
    width: "100%",
  },
  selectorTextContainerItems: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 8,
    height: 42,
    borderRadius: 30,
    backgroundColor: "#141414",
    width: "98%",
  },
  selectorTextContainer: {
    width: "80%",
    justifyContent: "center",
  },
  selectorTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  selectorIconContainer: {
    width: "14%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  selectorIconItem: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  selectorBlurbTextItemContainer: {
    marginTop: 10,
    marginLeft: 15,
    marginBottom: -6,
  },
  selectorBlurbTextItem: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: "PoppinsLight",
    opacity: 0.5,
  },
  selectorWarningTextContainer: {
    marginHorizontal: 15,
  },
  selectorWarningTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    opacity: 0.4,
  },

  //trip type section
  tripTypeItemsContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  tripTypeButtonContainer: {
    marginHorizontal: 0,
    borderWidth: 1,
    borderRadius: 25,
    width: "30%",
  },
  tripTypeGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    height: 35,
    width: "100%",
  },
  tripTypeTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },

  //request duration section
  requestDurationContainer: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: Platform.OS === "ios" ? 35 : 20,
    marginBottom: Platform.OS === "ios" ? 15 : 5,
  },
  identifierContainer: {
    width: "20%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  identifierTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  nowIdentifierContainer: {
    width: "25%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  nowIdentifierTextContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: "50%",
  },
  nowIdentifierTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  nowIdentifierCheckContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    width: "50%",
  },

  //ride duration section
  rideDurationContainer: {
    marginTop: 15,
    flexDirection: "column",
  },
  riderDurationCalendarContainer: {
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: COLORS.reechGray,
  },
  riderDurationTimeContainer: {
    marginBottom: 10,
  },

  //confirm button section
  confirmButtonContainer: {
    marginLeft: "70%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginTop: 10,
    marginBottom: Platform.OS === "ios" ? 20 : 0,
  },
  confirmButtonContent: {
    width: "100%",
  },
  confirmContainer: {
    zIndex: 10,
  },
  confirmGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    borderColor: COLORS.purple,
    borderWidth: 2,
    borderTopWidth: 0,
    height: 45,
    width: "100%",
    backgroundColor: COLORS.purpleDarker,
  },
  confirmTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
});

export default DriverAddOpportunityHomeScreen;
