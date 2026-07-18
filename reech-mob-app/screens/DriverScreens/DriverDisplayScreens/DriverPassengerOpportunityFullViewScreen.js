import React, { useState, useRef } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import CountDownTimer from "react-native-countdown-timer-hooks";

//customs
import { COLORS, images } from "../../../constants";
import {

  CustomReechingInput,
} from "../../../components";
import NavHeader from "@/components/Headers/NavHeader";
import DropDown from "@/components/UI/DropDown";
import { rate } from "@/assets/data/dropDownData";

const DriverPassengerOpportunityFullViewScreen = ({ route }) => {
  const {
    control,
    // handleSubmit,
    // formState: { errors },
    watch,
    getValues,
  } = useForm();

  const navigation = useNavigation();
  const data = route.params.data;

  const current_user = useSelector(state => state.user.current_user)

  //state handlers
  const [counterOfferModal, setCounterOfferModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [acceptModal, setAcceptModal] = useState(false);
  const [timerEnd, setTimerEnd] = useState(false);
  const [youHaveBeenWaitListed, setYouHaveBeenWaitListed] = useState(false); //trigger this modal once driver has been waitlisted by passenger
  const [timerWaitListEnd, setTimerWaitListEnd] = useState(false);

  const [watchRateCurrency] = watch(["rateCurrency"]);

  //accept offer timer
  const refTimer = useRef();
  const timerCallbackFunc = (timerFlag) => {
    setTimerEnd(timerFlag);
    alert("Your offer was not accepted.");
    setAcceptModal(false);
  };

  //waitlist offer timer
  const refWaitListTimer = useRef();
  const timerWaitListCallbackFunc = (timerWaitListFlag) => {
    setTimerWaitListEnd(timerWaitListFlag);
    alert("You weren't selected for this Reech ride.");
  };

  //money separator function
  function formatMoney(n) {
    return (Math.round(n * 100) / 100)
      .toLocaleString("en-US")
      .replace(",", " ");
  }

  const isBubbleMate = (mateId) => {
    const bub = current_user?.bubbleMates?.findIndex((obj) => obj.userId === mateId);
    return bub >= 0;
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerPassengerOppContainer}>
        <NavHeader
          message="What would you like to do?"
        />
      </View>
    );
  }

  //top image section
  function renderTopImageInfoSection() {
    return (
      <ImageBackground
        style={styles.imageBackgroundContainer}
        source={{ uri: data?.carImage }}
      >
        {/*opp card data*/}
        <LinearGradient
          colors={[COLORS.purple, COLORS.transparent, COLORS.purple]}
          start={{ x: 0.99, y: 0.0 }}
          end={{ x: 0.01, y: 0.0 }}
          style={styles.passengerGradientInfoContainer}
        >
          <View style={styles.passengerInfoContainer}>
            {/*opp name section*/}
            <View style={styles.passengerNameContainer}>
              <Text style={styles.passengerNameItem}>{data?.carName}</Text>
            </View>

            {/*opp location section*/}
            <View style={styles.passengerNameContainer}>
              <Text
                numberOfLines={1}
                style={styles.passengerLocationAndPriceItem}
              >
                {data?.pickupLocation?.split("|")?.[0]}
              </Text>
            </View>

            {/*opp rate section*/}
            <View style={styles.passengerNameContainer}>
              <Text style={styles.passengerLocationAndPriceItem}>
                {data?.rateCurrency?.split("|")?.[1]}
                {`${formatMoney(data?.rate)}`}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    );
  }

  //drop off location section
  function renderPassengerDropOffLocationSection() {
    return (
      <View style={styles.passengerDropOffLocationContainer}>
        {/*pick-up location*/}
        <View style={styles.passengerLocationContentContainer}>
          <Text style={styles.passengerLocationContentTextHeadingItem}>
            Pick-up:{" "}
          </Text>
          <Text
            numberOfLines={2}
            style={styles.passengerLocationContentTextItem}
          >
            {data?.pickupLocation?.split("|")?.[0]}
          </Text>
        </View>

        {/*first stop locations*/}
        {data?.firstStopLocation ? (
          <View style={styles.passengerLocationContentContainer}>
            <Text style={styles.passengerLocationContentTextHeadingItem}>
              1st stop:{" "}
            </Text>
            <Text
              numberOfLines={2}
              style={styles.passengerLocationsContentTextItem}
            >
              {data?.firstStopLocation?.split("|")?.[0]}
            </Text>
          </View>
        ) : null}

        {/*second stop locations*/}
        {data?.secondStopLocation ? (
          <View style={styles.passengerLocationContentContainer}>
            <Text style={styles.passengerLocationContentTextHeadingItem}>
              2nd stop:{" "}
            </Text>
            <Text
              numberOfLines={2}
              style={styles.passengerLocationsContentTextItem}
            >
              {data?.secondStopLocation?.split("|")?.[0]}
            </Text>
          </View>
        ) : null}

        {/*drop-off location*/}
        <View style={styles.passengerLocationContentContainer}>
          <Text style={styles.passengerLocationContentTextHeadingItem}>
            Drop-off:{" "}
          </Text>
          <Text
            numberOfLines={2}
            style={styles.passengerLocationsContentTextItem}
          >
            {data?.dropOffLocation?.split("|")?.[0]}
          </Text>
        </View>
      </View>
    );
  }

  //passenger rating section
  function renderPassengerRatingSection() {
    return (
      <View style={styles.passengerSectionContainer}>
        {/*rating header section*/}
        <View style={styles.passengerRatingHeaderContainer}>
          <Text style={styles.passengerRatingHeaderTextItem}>
            {`You're picking up:`}
          </Text>
        </View>

        {/*rating content section*/}
        <View style={styles.passengerRatingInfoContainer}>
          {/*passenger image section: show and hide*/}
          <View style={styles.passengerPickedUpImageContainer}>
            {isBubbleMate(data?.userId?._id) ? (
              <View style={styles.showPassengerImageContainer}>
                {/*passenger image section*/}
                <ImageBackground
                  source={images.userFrame}
                  style={styles.passengerImageBgContainer}
                >
                  <Image
                    source={{ uri: data?.userId?.profileImage }}
                    style={styles.passengerImageBgItem}
                  />
                </ImageBackground>

                {/*passenger name section*/}
                <View style={styles.passengerUserNameContainer}>
                  <Text style={styles.passengerUserNameTextItem}>
                    {data?.userId?.firstName} {data?.userId?.lastName}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.showPassengerIncognitoContainer}>
                <View style={styles.showPassengerIncognitoContent}>
                  <MaterialCommunityIcons
                    name="incognito"
                    size={50}
                    color={COLORS.white}
                  />
                </View>
              </View>
            )}
          </View>

          {/*passenger rating section*/}
          <View style={styles.passengerRatingTextContentContainer}>
            {/*heading section*/}
            <View style={styles.passengerRatingHeadingContainer}>
              <Text style={styles.passengerRatingHeadingTextItem}>Rating</Text>
            </View>

            {/*overall rating section*/}
            <View style={styles.passengerRatingSubHeadingContainer}>
              <Text style={styles.passengerRatingSubHeadingTextItem}>
                Overall: {data?.userRating ?? 0}
              </Text>
            </View>

            {/*last trip section*/}
            <View style={styles.passengerRatingSubHeadingContainer}>
              <Text style={styles.passengerRatingSubHeadingTextItem}>
                Last {data?.userTotalTrips ?? 10} trip
                {data?.userId?.myRideIds?.length <= 1 ? "" : "s"}:{" "}
                {data?.userTotalTrips ?? 0}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  //passenger preference section
  function renderPreferenceSection() {
    return (
      <View style={styles.passengerPreferenceSectionContainer}>
        {/*preference heading section*/}
        <View style={styles.passengerPreferenceContent}>
          <Text style={styles.passengerPreferenceTextHeadingItem}>
            Preferences:
          </Text>
        </View>

        {/*preference items section*/}
        <View style={styles.preferenceItemsContainer}>
          {/*talkative section*/}
          <View style={styles.preferenceItemContainer}>
            <View style={styles.preferenceIconContainer}>
              <FontAwesome name="volume-up" size={18} color={COLORS.white} />
            </View>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceTextItem}>
                {data?.talkative}
              </Text>
            </View>
          </View>

          {/*temperature section*/}
          <View style={styles.preferenceItemContainer}>
            <View style={styles.preferenceIconContainer}>
              <FontAwesome5
                name="temperature-low"
                size={18}
                color={COLORS.white}
              />
            </View>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceTextItem}>
                {data?.temperature}
              </Text>
            </View>
          </View>

          {/*music section*/}
          <View style={styles.preferenceItemContainer}>
            <View style={styles.preferenceIconContainer}>
              <SimpleLineIcons
                name="music-tone-alt"
                size={18}
                color={COLORS.white}
              />
            </View>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceTextItem}>
                {data?.playMusic}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  //luggage section
  function renderPassengerLuggageSection() {
    return (
      <View style={styles.passengerLuggageSectionContainer}>
        {/*heading section*/}
        <View style={styles.luggageHeadingContainer}>
          <View style={styles.luggageIconContent}>
            <FontAwesome5 name="luggage-cart" size={18} color={COLORS.white} />
          </View>

          <View style={styles.luggageHeadingTextContainer}>
            <Text style={styles.luggageHeadingTextItem}>Luggage:</Text>
          </View>
        </View>

        {/*luggage description section*/}
        <View style={styles.luggageTextDescriptionContainer}>
          <Text style={styles.luggageTextDescriptionItem}>
            {data?.luggageOrParcels}
          </Text>
        </View>
      </View>
    );
  }

  //driver button trigger section
  function renderDriverButtonSection() {
    return (
      <View style={styles.driverButtonSectionContainer}>
        {/*counteroffer button section*/}
        <TouchableOpacity
          onPress={() => setCounterOfferModal(true)}
          style={styles.driverButtonContentContainer}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
            style={styles.driverGradientButtonContentContainer}
          >
            <Text style={styles.driverButtonTextItem}>Counteroffer</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/*reject button section*/}
        <TouchableOpacity
          onPress={() => setRejectModal(true)}
          style={styles.driverButtonContentContainer}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={["#A82781", "#BF479A", "#DE71B5"]}
            style={styles.driverGradientButtonContentContainer}
          >
            <Text style={styles.driverButtonTextItem}>Reject</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/*accept button section*/}
        <TouchableOpacity
          onPress={() => setAcceptModal(true)}
          style={styles.driverButtonContentContainer}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={["#00AB08", "#00C301", "#26D701"]}
            style={styles.driverGradientButtonContentContainer}
          >
            <Text style={styles.driverButtonTextItem}>Accept</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  //counter offer modal section
  function renderCounterOfferModalPopUp() {
    return (
      <Modal
        visible={counterOfferModal}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        style={styles.counterOfferModalContainer}
      >
        <View style={styles.counterOfferInnerModalContainer}>
          <View style={styles.counterOfferInnerModalContent}>
            {/*modal heading section*/}
            <View style={styles.modalHeadingSectionContainer}>
              <Text style={styles.modalHeadingTextItem}>
                Your counteroffer:
              </Text>
            </View>

            {/*modal counter offer options section*/}
            <View style={styles.modalComponentContainer}>
              {/*currency dropdown*/}
              <View style={styles.currencyModalComponentContainer}>
                <View style={styles.rateCurrencySelectorContent}>
                  <Image
                    source={
                      getValues("rateCurrency")?.split("|")[0] === "USD"
                        ? {
                          uri: "https://flagpedia.net/data/flags/w1600/us.png",
                        }
                        : getValues("rateCurrency")?.split("|")[0] === "EUR"
                          ? {
                            uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Flag_of_euro.svg/2560px-Flag_of_euro.svg.png",
                          }
                          : getValues("rateCurrency")?.split("|")[0] === "ZAR"
                            ? {
                              uri: "https://flagpedia.net/data/flags/w1600/za.png",
                            }
                            : getValues("rateCurrency")?.split("|")[0] === "CHF"
                              ? {
                                uri: "https://flagpedia.net/data/flags/w1600/ch.png",
                              }
                              : getValues("rateCurrency")?.split("|")[0] === "KYD"
                                ? {
                                  uri: "https://flagpedia.net/data/flags/w1600/ky.png",
                                }
                                : getValues("rateCurrency")?.split("|")[0] === "GIP"
                                  ? {
                                    uri: "https://flagpedia.net/data/flags/w1600/gi.png",
                                  }
                                  : getValues("rateCurrency")?.split("|")[0] === "GBP"
                                    ? {
                                      uri: "https://flagpedia.net/data/flags/w1600/gb.png",
                                    }
                                    : getValues("rateCurrency")?.split("|")[0] === "JOD"
                                      ? {
                                        uri: "https://flagpedia.net/data/flags/w1600/jo.png",
                                      }
                                      : getValues("rateCurrency")?.split("|")[0] === "OMR"
                                        ? {
                                          uri: "https://flagpedia.net/data/flags/w1600/om.png",
                                        }
                                        : getValues("rateCurrency")?.split("|")[0] === "BHD"
                                          ? {
                                            uri: "https://flagpedia.net/data/flags/w1600/bh.png",
                                          }
                                          : getValues("rateCurrency")?.split("|")[0] === "KWD"
                                            ? {
                                              uri: "https://flagpedia.net/data/flags/w1600/kw.png",
                                            }
                                            : getValues("rateCurrency")?.split("|")[0] === "CNY"
                                              ? {
                                                uri: "https://symbolhunt.com/wp-content/uploads/2020/12/china_flag_round_shape.png",
                                              }
                                              : getValues("rateCurrency")?.split("|")[0] === "TRY"
                                                ? {
                                                  uri: "https://flagpedia.net/data/flags/w1600/tr.png",
                                                }
                                                : getValues("rateCurrency")?.split("|")[0] === "SEK"
                                                  ? {
                                                    uri: "https://flagpedia.net/data/flags/w1600/se.png",
                                                  }
                                                  : getValues("rateCurrency")?.split("|")[0] === "AUD"
                                                    ? {
                                                      uri: "https://flagpedia.net/data/flags/w1600/au.png",
                                                    }
                                                    : getValues("rateCurrency")?.split("|")[0] === "CAD"
                                                      ? {
                                                        uri: "https://flagpedia.net/data/flags/w1600/ca.png",
                                                      }
                                                      : getValues("rateCurrency")?.split("|")[0] === "JPY"
                                                        ? {
                                                          uri: "https://flagpedia.net/data/flags/w1600/jp.png",
                                                        }
                                                        : getValues("rateCurrency")?.split("|")[0] === "SGD"
                                                          ? {
                                                            uri: "https://flagpedia.net/data/flags/w580/sg.png",
                                                          }
                                                          : getValues("rateCurrency")?.split("|")[0] === "NZD"
                                                            ? {
                                                              uri: "https://flagpedia.net/data/flags/w1600/nz.png",
                                                            }
                                                            : getValues("rateCurrency")?.split("|")[0] === "PKR"
                                                              ? {
                                                                uri: "https://flagpedia.net/data/flags/w1600/pk.png",
                                                              }
                                                              : getValues("rateCurrency")?.split("|")[0] === "HKD"
                                                                ? {
                                                                  uri: "https://flagpedia.net/data/flags/w1600/hk.png",
                                                                }
                                                                : getValues("rateCurrency")?.split("|")[0] === "KRW"
                                                                  ? {
                                                                    uri: "https://exc.hr/CURRENCY-FLAGS/KRW.png",
                                                                  }
                                                                  : getValues("rateCurrency")?.split("|")[0] === "MXN"
                                                                    ? {
                                                                      uri: "https://flagpedia.net/data/flags/w580/mx.png",
                                                                    }
                                                                    : getValues("rateCurrency")?.split("|")[0] === "NOK"
                                                                      ? {
                                                                        uri: "https://flagpedia.net/data/flags/w1600/no.png",
                                                                      }
                                                                      : getValues("rateCurrency")?.split("|")[0] === "CLP"
                                                                        ? {
                                                                          uri: "https://flagpedia.net/data/flags/w1600/cl.png",
                                                                        }
                                                                        : getValues("rateCurrency")?.split("|")[0] === "NGN"
                                                                          ? {
                                                                            uri: "https://flagpedia.net/data/flags/w1600/ng.png",
                                                                          }
                                                                          : getValues("rateCurrency")?.split("|")[0] === "BRL"
                                                                            ? {
                                                                              uri: "https://flagpedia.net/data/flags/w1600/br.png",
                                                                            }
                                                                            : getValues("rateCurrency")?.split("|")[0] === "RUB"
                                                                              ? {
                                                                                uri: "https://flagpedia.net/data/flags/w1600/ru.png",
                                                                              }
                                                                              : getValues("rateCurrency")?.split("|")[0] === "UAH"
                                                                                ? {
                                                                                  uri: "https://flagpedia.net/data/flags/w1600/ua.png",
                                                                                }
                                                                                : getValues("rateCurrency")?.split("|")[0] === "THB"
                                                                                  ? {
                                                                                    uri: "https://flagpedia.net/data/flags/w1600/kw.png",
                                                                                  }
                                                                                  : getValues("rateCurrency")?.split("|")[0] === "PLN"
                                                                                    ? {
                                                                                      uri: "https://flagpedia.net/data/flags/w1600/pl.png",
                                                                                    }
                                                                                    : getValues("rateCurrency")?.split("|")[0] === "INR"
                                                                                      ? {
                                                                                        uri: "https://flagpedia.net/data/flags/w1600/in.png",
                                                                                      }
                                                                                      : null
                    }
                    style={styles.rateModalCurrencyFlagImageItem}
                  />
                  <View style={styles.rateModalCurrencyComponentContainer}>
                    <DropDown
                      control={control}
                      data={rate}
                      name="rateCurrency"
                      rules={{ required: "Required" }}
                      textAlign={'center'}
                      iconColor={'purple'}
                    />
                  </View>
                </View>
              </View>

              {/*rate input*/}
              <View style={styles.rateModalInputComponentContainer}>
                <LinearGradient
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  colors={[
                    COLORS.purpleDarker,
                    COLORS.purpleDark,
                    COLORS.purple,
                  ]}
                  style={styles.rateGradientContainer}
                >
                  <View style={styles.rateModalTextContainerItems}>
                    <Text style={styles.rateModalCurrencyTextItem}>
                      {watchRateCurrency?.split("|")[1] ?? null}
                    </Text>

                    <View style={styles.rateModalValueComponentContainer}>
                      <CustomReechingInput
                        rules={{
                          required: "Required",
                          pattern: {
                            value: /^[0-9\b]+$/,
                            message: "Provide numbers only",
                          },
                        }}
                        control={control}
                        name="rate"
                        placeholder={"0.00"}
                      />
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </View>

            {/*modal button section*/}
            <View style={styles.modalButtonSectionContainer}>
              {/*cancel offer section*/}
              <TouchableOpacity
                onPress={() => setCounterOfferModal(false)}
                style={styles.modalButtonContainerText}
              >
                <Text style={styles.modalButtonTextItem}>Cancel</Text>
              </TouchableOpacity>

              {/*line section*/}
              <View style={styles.modalButtonLiner} />

              {/*send offer section*/}
              <TouchableOpacity
                onPress={() => { console.log("send offer to passenger"); setCounterOfferModal(false) }}
                style={styles.modalButtonContainerText}
              >
                <Text style={styles.modalButtonTextItem}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  //reject modal section
  function renderRejectModalPopUp() {
    return (
      <Modal
        visible={rejectModal}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        style={styles.counterOfferModalContainer}
      >
        <View style={styles.rejectInnerModalContainer}>
          <View style={styles.counterOfferInnerModalContent}>
            {/*modal heading section*/}
            <View style={styles.modalHeadingSectionContainer}>
              <Text style={styles.modalHeadingTextItem}>Reject this trip?</Text>
            </View>

            {/*modal button section*/}
            <View style={styles.modalButtonSectionContainer}>
              {/*cancel offer section*/}
              <TouchableOpacity
                onPress={() => setRejectModal(false)}
                style={styles.modalButtonContainerText}
              >
                <Text style={styles.modalButtonTextItem}>No, go back</Text>
              </TouchableOpacity>

              {/*line section*/}
              <View style={styles.modalButtonLiner} />

              {/*send offer section*/}
              <TouchableOpacity
                onPress={() => {
                  setRejectModal(false);
                  navigation.goBack();
                  console.log(
                    "remove this opportunity from this users profile - remove user from suggestion from created opportunity"
                  );
                }}
                style={styles.modalButtonContainerText}
              >
                <Text style={styles.modalButtonTextItem}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  //accept modal section
  function renderAcceptModalPopUp() {
    return (
      <Modal
        visible={acceptModal}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        style={styles.counterOfferModalContainer}
      >
        <View style={styles.acceptInnerModalContainer}>
          <View style={styles.counterOfferInnerModalContent}>
            {/*modal heading section*/}
            <View style={styles.modalHeadingSectionContainer}>
              <Text style={[styles.modalHeadingTextItem, { fontFamily: "PoppinsBold", }]}>
                Your offer will be accepted shortly.
              </Text>
            </View>

            {/*offer countdown*/}
            <View style={styles.modalHeadingSectionContainer}>
              {timerEnd ? (
                <Text style={styles.modalHeadingTextItem}>
                  Offer ended 00:00
                </Text>
              ) : (
                <Text style={styles.modalHeadingTextItem}>
                  Offer ends in{" "}
                  <CountDownTimer
                    ref={refTimer}
                    timestamp={60}
                    timerCallback={timerCallbackFunc}
                    containerStyle={styles.modalDriverTimerCountDownContainer}
                    textStyle={styles.modalDriverOfferCountTextItem}
                  />
                </Text>
              )}
            </View>

            {/*modal button section*/}
            <View style={styles.modalButtonSectionContainer}>
              {/*cancel offer section*/}
              <TouchableOpacity
                onPress={() => setAcceptModal(false)}
                style={styles.modalButtonContainerText}
              >
                <Text style={styles.modalButtonTextItem}>Close</Text>
              </TouchableOpacity>

              {/*line section*/}
              <View style={styles.modalButtonLiner} />

              {/*send offer section*/}
              <TouchableOpacity
                onPress={() => {
                  setTimerEnd(false);
                  timerEnd ? null : refTimer.current.resetTimer();
                }}
                style={styles.modalButtonContainerText}
              >
                <Text style={styles.modalButtonTextItem}>Resend</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  //waitlisted modal section
  function renderWaitListedPopUpModal() {
    return (
      <Modal
        visible={youHaveBeenWaitListed}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        style={styles.counterOfferModalContainer}
      >
        <View style={styles.waitlistInnerModalContainer}>
          <View style={styles.counterOfferInnerModalContent}>
            {/*modal heading section*/}
            <View style={styles.modalHeadingSectionContainer}>
              <Text style={styles.modalHeadingTextItem}>
                {`You've been added to the waitlist`} {"\n"}
              </Text>

              {timerWaitListEnd ? (
                <Text style={styles.modalHeadingTextItem}>
                  Offer ended 00:00
                </Text>
              ) : (
                <Text style={styles.modalHeadingTextItem}>
                  Offer ends in{" "}
                  <CountDownTimer
                    ref={refWaitListTimer}
                    timestamp={300}
                    timerCallback={timerWaitListCallbackFunc}
                    containerStyle={styles.modalDriverTimerCountDownContainer}
                    textStyle={styles.modalDriverOfferCountTextItem}
                  />
                </Text>
              )}
            </View>

            {/*modal button section*/}
            <View style={styles.modalButtonSectionContainer}>
              {/*cancel offer section*/}
              <TouchableOpacity
                onPress={() => {
                  setYouHaveBeenWaitListed(false);
                  navigation.goBack();
                }}
                style={styles.modalButtonContainerText}
              >
                <Text style={styles.modalButtonTextItem}>No, reject</Text>
              </TouchableOpacity>

              {/*line section*/}
              <View style={styles.modalButtonLiner} />

              {/*send offer section*/}
              <TouchableOpacity
                onPress={() => {
                  setYouHaveBeenWaitListed(false);
                  console.log(
                    "Allow the driver to wait for the timer to elapse and once the user accepts their offer, then take them to the DriverPickingUpPassengerScreen"
                  );
                }}
                style={styles.modalButtonContainerText}
              >
                <Text style={styles.modalButtonTextItem}>Yes, wait</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  //screen content list
  function renderScreenContentList() {
    return (
      <>
        {renderHeaderSection()}
        {renderTopImageInfoSection()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.screenContentListScrollContainer}
        >
          {renderPassengerDropOffLocationSection()}
          {renderPassengerRatingSection()}
          {renderPreferenceSection()}
          {renderPassengerLuggageSection()}
        </ScrollView>
        {renderDriverButtonSection()}
        {renderCounterOfferModalPopUp()}
        {renderRejectModalPopUp()}
        {renderAcceptModalPopUp()}
        {renderWaitListedPopUpModal()}
      </>
    );
  }

  return (
    <View style={styles.screenPassengerOppInfoContainer}>
      {renderScreenContentList()}
    </View>
  );
};

const styles = StyleSheet.create({
  screenPassengerOppInfoContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //scrolling section
  screenContentListScrollContainer: {
    maxHeight: "55%",
    flexDirection: "column",
    marginBottom: 20,
  },

  //header section
  headerPassengerOppContainer: {
    zIndex: 99,
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  //top image section
  imageBackgroundContainer: {
    marginTop: Platform.OS === "ios" ? "-18%" : -27,
    width: Platform.OS === "ios" ? "100%" : "100%",
    height: 250,
    resizeMode: Platform.OS === "ios" ? "cover" : "contain",
    backgroundColor: COLORS.darkGray,
    marginBottom: 20,
  },
  passengerGradientInfoContainer: {
    top: 180,
    height: 70,
    paddingHorizontal: 10,
    paddingBottom: 23,
  },
  passengerInfoContainer: {
    marginTop: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  passengerNameContainer: {
    marginBottom: 2,
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  passengerNameItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
    textTransform: "capitalize",
  },
  passengerLocationAndPriceItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //drop off location section
  passengerDropOffLocationContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column",
    paddingHorizontal: 20,
  },
  passengerLocationContentContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  passengerLocationContentTextHeadingItem: {
    color: COLORS.darkGray,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    width: "17%",
  },
  passengerLocationContentTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
    width: "83%",
  },
  passengerLocationsContentTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    width: "83%",
  },

  //passenger rating section
  passengerSectionContainer: {
    marginTop: 5,
    flexDirection: "column",
  },
  passengerRatingHeaderContainer: {
    width: "100%",
    paddingHorizontal: 20,
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: 10,
  },
  passengerRatingHeaderTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  passengerRatingInfoContainer: {
    flexDirection: "column",
    paddingTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 30,
    justifyContent: "center",
    borderRadius: 15,
    borderWidth: 0.8,
    borderColor: COLORS.darkGray,
    backgroundColor: COLORS.reechGray,
  },
  passengerPickedUpImageContainer: {
    width: "100%",
  },
  showPassengerImageContainer: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  passengerImageBgContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  passengerImageBgItem: {
    width: 53,
    height: 53,
    resizeMode: "cover",
    borderRadius: 5,
  },
  passengerUserNameContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: "75%",
  },
  passengerUserNameTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  showPassengerIncognitoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  showPassengerIncognitoContent: {
    borderWidth: 2,
    borderColor: COLORS.white,
    borderRadius: 50,
    padding: 10,
  },
  passengerRatingTextContentContainer: {
    width: "100%",
    marginTop: 10,
    flexDirection: "row",
  },
  passengerRatingHeadingContainer: {
    width: "16%",
    justifyContent: "center",
    alignItems: "center",
  },
  passengerRatingHeadingTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  passengerRatingSubHeadingContainer: {
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  passengerRatingSubHeadingTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //preference section
  passengerPreferenceSectionContainer: {
    marginTop: 20,
    flexDirection: "column",
  },
  passengerPreferenceContent: {
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  passengerPreferenceTextHeadingItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  preferenceItemsContainer: {
    width: "100%",
    marginTop: 15,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  preferenceItemContainer: {
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  preferenceIconContainer: {
    width: "30%",
  },
  preferenceTextContainer: {
    width: "65%",
  },
  preferenceTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //luggage passenger section
  passengerLuggageSectionContainer: {
    marginTop: 30,
    flexDirection: "column",
    justifyContent: "center",
  },
  luggageHeadingContainer: {
    width: "100%",
    paddingHorizontal: 5,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  luggageIconContent: {
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
  },
  luggageHeadingTextContainer: {
    width: "85%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  luggageHeadingTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  luggageTextDescriptionContainer: {
    width: "100%",
    minHeight: 70,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  luggageTextDescriptionItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //button section
  driverButtonSectionContainer: {
    width: "100%",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  driverButtonContentContainer: {
    width: "30%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.reechGray,
  },
  driverGradientButtonContentContainer: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.reechGray,
  },
  driverButtonTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //counter offer modal
  counterOfferModalContainer: {
    flexDirection: "column",
    backgroundColor: COLORS.black,
  },
  counterOfferInnerModalContainer: {
    height: Platform.OS === "ios" ? "22%" : "28%",
    marginTop: Platform.OS === "ios" ? "78.4%" : "65%",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: COLORS.black,
  },
  counterOfferInnerModalContent: {
    height: "100%",
    flexDirection: "column",
    backgroundColor: COLORS.reechGray,
  },
  modalHeadingSectionContainer: {
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  modalHeadingTextItem: {
    textAlign: "center",
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  modalComponentContainer: {
    marginTop: 25,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 15,
  },
  currencyModalComponentContainer: {
    width: "47%",
  },
  rateCurrencySelectorContent: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.reechGray,
  },
  rateModalCurrencyComponentContainer: {
    width: "75%",
    right: 10,
  },
  rateModalCurrencyFlagImageItem: {
    width: 30,
    height: 30,
    resizeMode: "cover",
    borderRadius: 30,
    left: 15,
  },
  rateModalInputComponentContainer: {
    width: "47%",
  },
  rateGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 51,
    width: "100%",
  },
  rateModalTextContainerItems: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    height: 48,
    borderRadius: 30,
    backgroundColor: "#141414",
    width: "98%",
  },
  rateModalCurrencyTextItem: {
    width: "20%",
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  rateModalValueComponentContainer: {
    width: "80%",
    top: 2,
  },
  modalButtonSectionContainer: {
    height: 50,
    marginTop: 30,
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: COLORS.reechGray,
  },
  modalButtonContainerText: {
    width: "48%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  modalButtonLiner: {
    width: Platform.OS === "ios" ? 0.4 : 1,
    backgroundColor: COLORS.darkGray,
  },

  //reject modal
  rejectInnerModalContainer: {
    height: Platform.OS === "ios" ? "14%" : "18%",
    marginTop: Platform.OS === "ios" ? "87.5%" : "65%",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: COLORS.black,
  },

  //accept modal
  acceptInnerModalContainer: {
    height: Platform.OS === "ios" ? "20%" : "25%",
    marginTop: Platform.OS === "ios" ? "87.5%" : "65%",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: COLORS.black,
  },
  modalDriverTimerCountDownContainer: {
    height: Platform.OS === "ios" ? 20 : 14,
    width: 50,
    marginTop: Platform.OS === "ios" ? -5 : 0,
    justifyContent: "center",
  },
  modalDriverOfferCountTextItem: {
    top: Platform.OS === "ios" ? -2.5 : 1,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //waitlist modal
  waitlistInnerModalContainer: {
    height: "18%",
    marginTop: Platform.OS === "ios" ? "87%" : "65%",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: COLORS.black,
  },
});

export default DriverPassengerOpportunityFullViewScreen;
