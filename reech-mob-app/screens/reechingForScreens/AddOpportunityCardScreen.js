/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  PixelRatio,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import {
  Entypo,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import moment from "moment";
// import MapView, { Marker, Circle } from "@mapbox/react-native-mapbox-gl";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";

//import customs
import { COLORS, icons, images } from "../../constants";
import {

  CustomAccountToggler,
  CustomReechForLocation,
  CustomReechingInput,
  CustomImageOppPicker,
  CustomOpportunityInput,
  CustomOpportunityDescriptionInput,
  CustomReechForSlider,
  CustomReechForExpSlider,
  CustomCalendarRangerPicker,
} from "../../components";
import NavHeader from "@/components/Headers/NavHeader";
import { usePostOpportunityMutation } from "../../redux/api/opportunity";
import { useUploadSingleFileMutation } from "../../redux/api/api-slice";
import { useInit_doc_embeddings_oppMutation } from "../../redux/ml-api/recommendation";
import { useSelector } from "react-redux";
import DropDown from "@/components/UI/DropDown";
import { opportunityType, qualification, rate, rateFrequency } from "@/assets/data/dropDownData";

/**
 * Constants for rate evaluation.
 * NOTE: This will need to be determined dynamically based market rates for:
 * - The type of job being created
 * - The skills required from the ideal candidate (education & experience)
 * - And maybe other things the period of time that the job runs over, scarcity, location...
 * The following values are monthly rates for only for demo purposes, actual data will likely be determined in BE
 */

const EDUCATION_BASELINES = {
  Student: 8000,
  Certificate: 12000,
  Diploma: 15000,
  Degree: 17000,
  Honours: 20000,
  Masters: 22000,
  Doctoral: 25000,
};

const EXPERIENCE_FACTOR = {
  0: 1,
  1: 1.2,
  2: 1.68,
  3: 2.0,
  4: 2.52,
  5: 3.4,
  6: 3.98,
  7: 4.35,
  8: 4.89,
  9: 6.58,
  10: 8,
};

const RECURRENCE_FACTOR = {
  "Once-off": 4.348, // avg weeks in a month
  "Per hour": 4.348 * 40, // avg work hours a month
  "Per day": 4.348 * 5, // avg work days a month
  "Per week": 4.348,
  "Per month": 1,
  Volunteer: 0,
};

function calculateRateFairness(
  rate,
  experience = "none",
  education = "Student",
  recurrence
) {
  if (!recurrence || recurrence === "Volunteer") {
    return 0.51;
  }

  const monthlyIdealRate =
    EDUCATION_BASELINES[education] * EXPERIENCE_FACTOR[experience];

  // const rate = monthlyRate / RECURRENCE_FACTOR[recurrence];
  const idealRate = monthlyIdealRate / RECURRENCE_FACTOR[recurrence];

  // The output of the function will be 0.75 if r = ir, 0.5 if r = 3/4 * ir, 1 if r = 1.5 * ir, 1/5 if r = ir / 2, and 0 if r < ir / 6.
  // f(r, ir) = min(1, max(0, (r / ir - 1/6) / (1.5 - 1/6) * (1 - 0) + 0)) if r >= ir / 6
  // = 0 otherwise

  if (rate < idealRate / 6) {
    return 0;
  }

  return Math.min(
    1,
    Math.max(0.0, ((rate / idealRate - 1 / 6) / (1.5 - 1 / 6)) * (1 - 0) + 0)
  );
}

const AddOpportunityCardScreen = ({ route }) => {
  const navigation = useNavigation();
  const { jobTitleId, reechImg } = route.params;

  const [uploadFn, { isLoading: isUploadingImage }] = useUploadSingleFileMutation();
  const [createFn, { isLoading }] = usePostOpportunityMutation();
  const [initDocOppFn, { isLoading: isLoadingInitDoc }] = useInit_doc_embeddings_oppMutation();

  const user = useSelector((state) => state.user.current_user);

  const [indicatorBarSize, setIndicatorBarSize] = React.useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const slideAnimation = React.useRef(new Animated.Value(90)).current;
  //rate indicator control
  const [rateIndicatorPercentValue, setRateIndicatorPercentValue] =
    React.useState(40);

  ////________________________Get current location maps__________
  const [mapRegion, setRegion] = useState({
    latitude: -26.107567,
    longitude: 28.056702,
    latitudeDelta: 0.06,
    longitudeDelta: 0.06,
    address: "",
  });

  const currentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permision to access location was denied: ", status);
    }
    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });

    const address_name = await fetchPlaceName(location.coords);
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: mapRegion?.latitudeDelta,
      longitudeDelta: mapRegion?.longitudeDelta,
      address: address_name,
    });
  };

  const fetchPlaceName = async (currentLocation) => {
    try {
      const map_api_key = process.env.GOOGLE_PLACES_API_KEY;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLocation.latitude},${currentLocation.longitude}&key=${map_api_key}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch place name");
      }

      const data = await response.json();

      const addressComponents = data.results[0].address_components;
      let city = "";
      let country = "";

      for (let i = 0; i < addressComponents.length; i++) {
        const component = addressComponents[i];
        if (component.types.includes("locality")) {
          city = component.long_name;
        }
        if (component.types.includes("country")) {
          country = component.long_name;
        }
      }

      const formattedPlaceName = `${city}, ${country}`;

      console.log("Place name: ", formattedPlaceName);

      return formattedPlaceName;
    } catch (error) {
      console.log(error.message);
    }
  }

  const updateMapLocation = () => {
    const loc = watchAddress?.split("|");
    loc &&
      setRegion({
        ...mapRegion,
        latitude: loc[1],
        longitude: loc[2],
        latitudeDelta: mapRegion?.latitudeDelta,
        longitudeDelta: mapRegion?.longitudeDelta,
      });
  };


  const updateMapRadius = () => {
    watchRadius > 0 &&
      setRegion({
        ...mapRegion,
        latitude: mapRegion?.latitude,
        longitude: mapRegion?.longitude,
        latitudeDelta: (mapRegion?.latitudeDelta * Math.sqrt(watchRadius)) / 2,
        longitudeDelta:
          (mapRegion?.longitudeDelta * Math.sqrt(watchRadius)) / 2,
      });
  };
  ///________________________________ENDS HERE__________

  React.useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: Math.round(
        (rateIndicatorPercentValue / 100) * indicatorBarSize.width -
        indicatorBarSize.width / 2
      ),
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [slideAnimation, rateIndicatorPercentValue, indicatorBarSize]);

  //image library option switcher
  const [libraryUserPicker, setLibraryUserPicker] = useState(false);

  const [reechLibraryPicker, setReechLibraryPicker] = useState(false);

  const libraryUserPickerFunction = () => {
    setLibraryUserPicker(true);
    setValue("oppImage");
  };

  //form control: validate
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      duration: new Date(),
      oppImage: reechImg,
      visibilityEndDate: new Date(),
    },
  });

  const [
    watchExperience,
    watchEducation,
    watchEducationNecessity,
    watchRateFrequency,
    watchRate,
    watchOppImage,
    watchRadius,
    watchAddress,
    watchLocationToggle,
    watchRateCurrency,
    watchApplicants,
  ] = watch([
    "experience",
    "educationLevel",
    "educationNecessity",
    "rateFrequency",
    "rate",
    "oppImage",
    "radius",
    "address",
    "currentLocationToggler",
    "rateCurrency",
    "unlimitedApplicants",
    "duration",
  ]);

  React.useEffect(() => {
    try {
      const rateFairness = calculateRateFairness(
        watchRate,
        watchExperience,
        watchEducation?.split("|")[0],
        watchRateFrequency
      );
      if (isNaN(rateFairness)) {
        return;
      }
      setRateIndicatorPercentValue(rateFairness * 100);
    } catch (error) {
      console.error(error);
    }
  }, [watchEducation, watchExperience, watchRate, watchRateFrequency]);

  React.useEffect(() => {
    const firstError = Object.values(errors)?.[0];

    if (firstError) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: firstError.message,
      });
    }
  }, [Object.keys(errors)?.length]);

  React.useEffect(() => {
    updateMapLocation();
  }, [watchAddress]);

  React.useEffect(() => {
    setValue("jobTitle", jobTitleId?.jobTitle);
  }, [jobTitleId]);


  const showError = (res) =>
    Toast.show({
      type: "error",
      text1: "Error",
      text2: res.error.data?.error ?? "Something went wrong. Please try again",
    });

  const showToast = (message) =>
    Toast.show({
      type: "success",
      text1: "Success",
      text2: message,
    });

  const rateConveter = (rate, rateFrequency) => {
    if (rateFrequency === "Per hour") {
      return Number(rate);
    } else if (rateFrequency === "Once-off") {
      return Number(rate) / 40 / 4;
    } else if (rateFrequency === "Per day") {
      return Number(rate) / 8;
    } else if (rateFrequency === "Per week") {
      return Number(rate) / 40;
    } else if (rateFrequency === "Per month") {
      return Number(rate) / 40 / 4;
    }
    return 0;
  };

  //selector states
  const [bubbleActivate, setBubbleActive] = useState(false);
  const [businessesActivate, setBusinessesActive] = useState(false);
  const [incognitoActivate, setIncognitoActive] = useState(false);
  const [personalActivate, setPersonalActive] = useState(false);

  //date selector
  const currDate = new Date();
  const currMonth = moment(currDate).month() + 1;
  const currDay = Number(moment(currDate).format("D"));
  const currYear = new Date().getFullYear();

  const [daySelector, setDaySelector] = useState(currDay);
  const [monthSelector, setMonthSelector] = useState(currMonth);
  const [yearSelector, setYearSelector] = useState(currYear);

  //applicant selector
  const [applicantSelector, setApplicantSelector] = useState(10);

  //create opportunity
  const onCreatePressed = React.useCallback(
    async (_data) => {
      const ratePerHour = rateConveter(_data.rate, _data.rateFrequency);
      const loc =
        _data.currentLocationToggler === true
          ? [mapRegion?.address, mapRegion?.latitude, mapRegion?.longitude]
          : _data?.address?.split("|");

      const _startDate = `${daySelector} ${monthSelector} ${yearSelector}`;
      const formattedDate = moment(_startDate, "D MM YYYY").format(
        "YYYY-MM-DD"
      );

      const payload = {
        skillIds: [
          "6454a45d31d8db9c0560704d",
          "6454a45d31d8db9c05607058",
          "6454a45d31d8db9c05607060",
        ],
        userId: user?._id,
        userImage: user?.profileImage,
        bubbleMatesOnly: bubbleActivate,
        businessOnly: businessesActivate,
        postIncognito: incognitoActivate,
        postPersonal: personalActivate,
        jobTitle: _data.jobTitle,
        jobTitleId: jobTitleId?._id,
        jobCategoryId: jobTitleId?.jobCategoryId,
        address: loc[0],
        location: {
          type: "Point",
          coordinates: [Number(loc[2]), Number(loc[1])], //[longitude, latitude]
        },
        radius: _data.radius * 1000,
        experience: Number(_data?.experience ?? 0),
        NQFLevel:
          _data.educationNecessity === true
            ? 3
            : Number(_data.educationLevel.split("|")[1]),
        educationLevel:
          _data.educationNecessity === true
            ? "Not applicable"
            : _data.educationLevel.split("|")[0],
        startDate: formattedDate,
        opportunityType: _data.opportunityType,
        description: {
          whoIam: _data.whoIam,
          whereFitIn: _data.whereFitIn,
          helpYouSucceed: _data.helpYouSucceed,
        },
        jobDescription: _data.whoIam + ", " + _data.whereFitIn + ", " + _data.helpYouSucceed,
        rateFrequency: _data.rateFrequency,
        rate: _data?.rate && Number(_data?.rate),
        rateCurrency: _data.rateCurrency,
        ratePerHour: ratePerHour,
        maxApplicants:
          _data.unlimitedApplicants === true ? 1000 : applicantSelector,
        duration: _data.duration,
        oppImage: _data.oppImage,
      };

      const fileName = payload.oppImage.split("/").pop();
      const file = {
        name: "_opportunity-" + fileName,
        uri: payload.oppImage,
        type: "image/jpg",
      };

      const formData = new FormData();
      formData.append("file", file);
      if (libraryUserPicker) {
        try {
          const { data } = await uploadFn(formData);
          const url = data.data;
          payload.oppImage = url;
        } catch (error) {
          console.error(error);
          return;
        }
      }

      createFn(payload)
        .then(async (res) => {
          if (res.error) {
            showError(res);
            return;
          }

          initDocOppFn({ _id: res.data.data?._id }).then((res) => {
            if (res.error) {
              console.log("error: ", res.error);
              return;
            }
            showToast("Your opportunity has been created!");
            navigation.navigate("WelcomeScreen");
          });
        })
        .catch((err) => {
          var error = err.response.data
            ? err.response.data.error
            : "Network error, please try again later";
          Toast.show({
            type: "error",
            text1: "Error",
            text2: error,
          });
        });
    },
    [libraryUserPicker]
  );

  //map padding
  const padding = PixelRatio.getPixelSizeForLayoutSize(100);

  //money separator function
  function formatMoney(n) {
    return (Math.round(n * 100) / 100)
      .toLocaleString("en-US")
      .replace(",", " ");
  }

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.contentContainerAddOpp}>
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
      </View>
    );
  }

  //top option selector section
  function renderTopOptionSection() {
    return (
      <View style={styles.topSelectorOptionContainer}>
        {/*incognito item*/}
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
                <Text style={styles.selectorTextItem}>Incognito</Text>
              </View>

              {/*selector icon section*/}
              <TouchableOpacity
                onPress={() => setIncognitoActive(!incognitoActivate)}
                style={[
                  styles.selectorIconContainer,
                  {
                    backgroundColor: incognitoActivate ? COLORS.purple : null,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="incognito"
                  size={18}
                  color={incognitoActivate ? COLORS.white : COLORS.purple}
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/*selector blurb text*/}
          <View style={styles.selectorBlurbTextItemContainer}>
            <Text style={styles.selectorBlurbTextItem}>
              Your identity will not be visible to anyone
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

        {/*personal item*/}
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
                <Text style={styles.selectorTextItem}>Make this personal</Text>
              </View>

              {/*selector icon section*/}
              <TouchableOpacity
                onPress={() => setPersonalActive(!personalActivate)}
                style={[
                  styles.selectorIconContainer,
                  {
                    backgroundColor: personalActivate ? COLORS.purple : null,
                  },
                ]}
              >
                <Entypo
                  name="user"
                  size={18}
                  color={personalActivate ? COLORS.white : COLORS.purple}
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/*selector blurb text*/}
          <View style={styles.selectorBlurbTextItemContainer}>
            <Text style={styles.selectorBlurbTextItem}>
              Your identity will only be visible to individuals and businesses
              with the relevant profile
            </Text>
          </View>
        </View>
      </View>
    );
  }

  //opportunity title section
  function renderOpportunityTitleSection() {
    return (
      <View style={styles.opportunityTitleContainer}>
        <Text style={styles.opportunityTitleTextItem}>Title</Text>
        <View style={styles.opportunityTitleComponentContainer}>
          <CustomOpportunityInput
            name="jobTitle"
            control={control}
            rules={{ required: "Please provide a job title" }}
          />
        </View>
      </View>
    );
  }

  //opportunity location section
  function renderOpportunityLocationSection() {
    return (
      <View style={styles.opportunityLocationContainer}>
        <Text style={styles.opportunityLocationTextItem}>Location</Text>
        {/*toggle section item*/}
        <View style={styles.opportunityLocationToggleContainer}>
          <View style={styles.opportunityLocationTogglerContainer}>
            <CustomAccountToggler
              control={control}
              name={"currentLocationToggler"}
              invalue={"opp"}
              notify={({ value }) => {
                value === true && currentLocation();
              }}
            />
          </View>

          <View style={styles.opportunityLocationTextContainer}>
            <Text style={styles.opportunityLocationTextItemDescription}>
              Would you like to use your current location?
            </Text>
          </View>
        </View>

        {/*map section item*/}
        <View style={styles.searchComponentContainer}>
          {/*search section item*/}
          {watchLocationToggle === true ? null : (
            <CustomReechForLocation
              rules={{ required: "Please enter a location" }}
              name="address"
              control={control}
              placeholder="State, Country"
            />
          )}

          <MapView
            region={mapRegion}
            style={styles.mapView}
            userInterfaceStyle="dark"
            mapPadding={{ top: padding, right: 0, bottom: 0, left: 0 }}
          >
            <Marker coordinate={mapRegion} title="Your location" />
            {watchRadius > 0 && (
              <Circle
                center={mapRegion}
                radius={watchRadius * 1000}
                strokeWidth={1}
                strokeColor={`rgba(${COLORS.purpleRGB}, 0.5)`}
                fillColor={`rgba(${COLORS.purpleRGB}, 0.4)`}
              />
            )}
          </MapView>

          {/*map radius section item*/}
          <View style={styles.searchRadiusSlider}>
            <CustomReechForSlider name="radius" control={control} />
          </View>
        </View>
      </View>
    );
  }

  //opportunity experience section
  function renderOpportunityExperienceSection() {
    return (
      <View style={styles.opportunityExperienceSection}>
        <Text style={styles.opportunityExperienceTextItem}>Experience</Text>
        <View style={styles.opportunityExperienceSlider}>
          <CustomReechForExpSlider name="experience" control={control} />
        </View>
      </View>
    );
  }

  //opportunity education section
  function renderOpportunityEducationSection() {
    return (
      <View style={styles.opportunityEducationContainer}>
        <Text style={styles.opportunityEducationTextItem}>Education</Text>
        {/*toggle section item*/}
        <View style={styles.opportunityLocationToggleContainer}>
          <View style={styles.opportunityLocationTogglerContainer}>
            <CustomAccountToggler
              control={control}
              name={"educationNecessity"}
            />
          </View>

          {/*toggle text item*/}
          <View style={styles.opportunityEducationTextContainer}>
            <Text style={styles.opportunityEducationTextItemDescription}>
              Not applicable
            </Text>
          </View>
        </View>

        {/*education dropdown item*/}
        <View style={styles.opportunityEducationDropDownContainer}>
          {watchEducationNecessity === true ? null : (
            <DropDown
              rules={{ required: "Please select the required qualification" }}
              name="educationLevel"
              control={control}
              data={qualification}
              textAlign={'center'}
              iconColor={'purple'}
            />
          )}
        </View>
      </View>
    );
  }

  //opportunity date section
  function renderOpportunityDateSection() {
    return (
      <View style={styles.opportunityDateContainer}>
        <Text style={styles.opportunityDateTextItem}>Start date</Text>
        <Text style={styles.opportunityDateExcerptTextItem}>
          When will this opportunity start?
        </Text>

        {/*date component items*/}
        <View style={styles.OpportunityDateComponentContainer}>
          {/*day selector item*/}
          <View style={styles.opportunityDayItemContainer}>
            <TouchableOpacity onPress={() => setDaySelector(Math.max(1, daySelector - 1))}>
              <Entypo
                name="chevron-up"
                size={24}
                color={COLORS.purple}
              />
            </TouchableOpacity>

            <Text style={styles.opportunityDayTextItem}>{daySelector}</Text>

            <TouchableOpacity onPress={() =>
              setDaySelector(
                monthSelector === 1
                  ? Math.min(31, daySelector + 1)
                  : monthSelector === 2
                    ? Math.min(28, daySelector + 1)
                    : monthSelector === 3
                      ? Math.min(31, daySelector + 1)
                      : monthSelector === 4
                        ? Math.min(30, daySelector + 1)
                        : monthSelector === 5
                          ? Math.min(31, daySelector + 1)
                          : monthSelector === 6
                            ? Math.min(30, daySelector + 1)
                            : monthSelector === 7
                              ? Math.min(31, daySelector + 1)
                              : monthSelector === 8
                                ? Math.min(31, daySelector + 1)
                                : monthSelector === 9
                                  ? Math.min(30, daySelector + 1)
                                  : monthSelector === 10
                                    ? Math.min(31, daySelector + 1)
                                    : monthSelector === 11
                                      ? Math.min(30, daySelector + 1)
                                      : monthSelector === 12
                                        ? Math.min(31, daySelector + 1)
                                        : Math.min(31, daySelector + 1)
              )
            }>
              <Entypo
                name="chevron-down"
                size={24}
                color={COLORS.purple}
              />
            </TouchableOpacity>
          </View>

          {/*month selector item*/}
          <View style={styles.opportunityMonthItemContainer}>
            <TouchableOpacity onPress={() => setMonthSelector(Math.max(1, monthSelector - 1))}>
              <Entypo
                name="chevron-up"
                size={24}
                color={COLORS.purple}
              />
            </TouchableOpacity>

            <Text style={styles.opportunityMonthTextItem}>
              {monthSelector === 1
                ? "January"
                : monthSelector === 2
                  ? "February"
                  : monthSelector === 3
                    ? "March"
                    : monthSelector === 4
                      ? "April"
                      : monthSelector === 5
                        ? "May"
                        : monthSelector === 6
                          ? "June"
                          : monthSelector === 7
                            ? "July"
                            : monthSelector === 8
                              ? "August"
                              : monthSelector === 9
                                ? "September"
                                : monthSelector === 10
                                  ? "October"
                                  : monthSelector === 11
                                    ? "November"
                                    : monthSelector === 12
                                      ? "December"
                                      : null}
            </Text>

            <TouchableOpacity onPress={() => setMonthSelector(Math.min(12, monthSelector + 1))}>
              <Entypo
                name="chevron-down"
                size={24}
                color={COLORS.purple}
              />
            </TouchableOpacity>
          </View>

          {/*year selector item*/}
          <View style={styles.opportunityYearItemContainer}>
            <TouchableOpacity onPress={() => { yearSelector > currYear ? setYearSelector(yearSelector - 1) : null }}>
              <Entypo
                name={yearSelector > currYear ? "chevron-up" : ""}
                size={24}
                color={COLORS.purple}
              />
            </TouchableOpacity>

            <Text style={styles.opportunityYearTextItem}>{yearSelector}</Text>

            <TouchableOpacity>
              <Entypo
                onPress={() => setYearSelector(Math.min(currYear + 5, yearSelector + 1))}
                name={yearSelector < currYear + 5 ? "chevron-down" : ""}
                size={24}
                color={COLORS.purple}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  //opportunity type section
  function renderOpportunityTypeSection() {
    return (
      <View style={styles.opportunityTypeContainer}>
        <Text style={styles.opportunityTypeTextItem}>Opportunity type</Text>

        {/*opportunity type dropdown item*/}
        <View style={styles.opportunityTypeDropDownContainer}>
          <DropDown
            rules={{ required: "Please select the required opportunity type" }}
            name="opportunityType"
            data={opportunityType}
            control={control}
            textAlign={'center'}
            iconColor={'purple'}
          />
        </View>
      </View>
    );
  }

  //opportunity description section
  function renderOpportunityDescriptionSection() {
    return (
      <View style={styles.opportunityDescriptionContainer}>
        <Text style={styles.opportunityDescriptionTextItem}>Description</Text>

        {/*description container*/}
        <View style={styles.opportunityDescriptionContentContainer}>
          {/*who am I section*/}
          <View style={styles.opportunityDescriptionItemContainer}>
            <Text style={styles.opportunityDescriptionHeadingTextItem}>
              Who am I?
            </Text>
            <CustomOpportunityDescriptionInput
              name="whoIam"
              control={control}
              rules={{
                required: "Please provide a description",
                maxLength: {
                  value: 500,
                  message:
                    "Description cannot contain more than 500 characters",
                },
              }}
              placeholder={"A venture-backed founder building in the B2B space"}
            />
          </View>

          {/*where do i fit section*/}
          <View style={styles.opportunityDescriptionItemContainer}>
            <Text style={styles.opportunityDescriptionHeadingTextItem}>
              {`Where you fit in (what you'll do)`}?
            </Text>
            <CustomOpportunityDescriptionInput
              name="whereFitIn"
              control={control}
              rules={{
                required: "Please provide skills for this opportunity",
                maxLength: {
                  value: 100,
                  message: "Skills cannot contain more than 100 characters",
                },
              }}
              placeholder={"E.g."}
            />
          </View>

          {/*requirement section*/}
          <View style={styles.opportunityDescriptionItemContainer}>
            <Text style={styles.opportunityDescriptionHeadingTextItem}>
              What will help you succeed (requirements)?
            </Text>
            <CustomOpportunityDescriptionInput
              name="helpYouSucceed"
              control={control}
              rules={{
                required: "Please provide requirements for this opportunity",
                maxLength: {
                  value: 500,
                  message:
                    "Description cannot contain more than 500 characters",
                },
              }}
              placeholder={"E.g."}
            />
          </View>
        </View>
      </View>
    );
  }

  //opportunity rate section
  function renderOpportunityRateSection() {
    return (
      <View style={styles.opportunityRateContainer}>
        <Text style={styles.opportunityRateTextItem}>Rate</Text>

        {/*rate currency selector option*/}
        <View style={styles.rateCurrencySelectorContainer}>
          {/*rate currency section*/}
          {!["Collaborator", "Mentor", "Volunteer", undefined].includes(
            watchRateFrequency
          ) && (
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
                  style={styles.rateCurrencyFlagImageItem}
                />
                <View style={styles.rateCurrencyComponentContainer}>
                  <DropDown
                    control={control}
                    data={rate}
                    name="rateCurrency"
                    textAlign={'center'}
                    iconColor={'purple'}
                    noBgColor={true}
                    minimal={true}
                    rules={{ required: "Rate currency is required" }}
                  />
                </View>
              </View>
            )}

          {/*rate input section*/}
          <View style={styles.rateValueContainer}>
            {!["Collaborator", "Mentor", "Volunteer", undefined].includes(
              watchRateFrequency
            ) && (
                <LinearGradient
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
                  style={styles.rateGradientContainer}
                >
                  <View style={styles.rateTextContainerItems}>
                    <Text style={styles.rateCurrencyTextItem}>
                      {watchRateCurrency?.split("|")[1] ?? null}
                    </Text>

                    <View style={styles.rateValueComponentContainer}>
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
              )}
          </View>
        </View>
      </View>
    );
  }

  //opportunity rate frequency section
  function renderOpportunityRateFrequencySection() {
    return (
      <View style={styles.opportunityRateFrequencyContainer}>
        <Text style={styles.opportunityRateFrequencyTextItem}>
          Rate frequency
        </Text>
        <DropDown
          control={control}
          data={rateFrequency}
          name="rateFrequency"
          textAlign={'center'}
          iconColor={'purple'}
          rules={{ required: "Rate frequency is required" }}
        />
      </View>
    );
  }

  //rate evaluator section
  function renderOpportunityRateEvaluatorSection() {
    return (
      <View style={styles.opportunityRateEvaluatorContainer}>
        {!["Collaborator", "Mentor", "Volunteer", undefined].includes(
          watchRateFrequency
        ) && (
            <View style={styles.rateIndicatorContainer}>
              <View style={styles.rateIndicatorSliderWrapper}>
                <LinearGradient
                  colors={[COLORS.purple, COLORS.purpleDark, COLORS.purpleDarker]}
                  style={styles.rateIndicatorSlider}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  onLayout={(event) => {
                    const { x, y, width, height } = event.nativeEvent.layout;
                    setIndicatorBarSize({ width, height, x, y });
                  }}
                />
                <Animated.View
                  style={[
                    styles.rateIndicatorPointer,
                    {
                      transform: [
                        {
                          translateX: slideAnimation,
                        },
                      ],
                    },
                  ]}
                >
                  {/* TODO: replace this with icon */}
                  <View style={styles.tempTriangle} />
                </Animated.View>
                <Text style={styles.rateIndicatorText}>
                  {/* TODO: make variable */}
                  {rateIndicatorPercentValue > 85
                    ? "This is a great offer!"
                    : rateIndicatorPercentValue > 60
                      ? "This is a good offer"
                      : rateIndicatorPercentValue > 50
                        ? "This is a fair offer"
                        : rateIndicatorPercentValue < 15
                          ? "This is a poor offer!"
                          : rateIndicatorPercentValue < 33.3
                            ? "This is a bad offer"
                            : "This is an average offer"}
                </Text>
              </View>
            </View>
          )}
      </View>
    );
  }

  //max applicants
  function renderMaxNumberOfApplicantsSection() {
    return (
      <View style={styles.applicantsSectionContainer}>
        <View style={styles.applicantTextContainer}>
          <Text style={styles.applicantTextItem}>Max no. of applicants</Text>
          <View style={styles.applicationMaxDeciderContainer}>
            {/*max toggler*/}
            <View style={styles.applicationMaxTogglerContainer}>
              <CustomAccountToggler
                control={control}
                name={"unlimitedApplicants"}
              />
            </View>

            {/*max toggler text*/}
            <View style={styles.applicationUnlimitedTextContainer}>
              <Text style={styles.applicationUnlimitedTextItem}>
                Set unlimited
              </Text>
            </View>
          </View>
        </View>

        {/*applicant counter section*/}
        <View style={styles.applicantCounterItemContainer}>
          <TouchableOpacity onPress={() =>
            setApplicantSelector(Math.max(1, applicantSelector - 1))
          }>
            <Entypo
              name="chevron-up"
              size={24}
              color={COLORS.purple}
            />
          </TouchableOpacity>

          <Text style={styles.applicantCounterTextItem}>
            {watchApplicants ? "Unlimited" : applicantSelector}
          </Text>

          <TouchableOpacity onPress={() =>
            setApplicantSelector(Math.min(100, applicantSelector + 1))
          }>
            <Entypo
              name="chevron-down"
              size={24}
              color={COLORS.purple}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  //opportunity duration visibility calendar picker
  function renderOpportunityVisibilitySection() {
    return (
      <View style={styles.opportunityVisibilitySectionContainer}>
        <Text style={styles.opportunityVisibilityTextItem}>
          How long do you want this opportunity to be visible on Reech?
        </Text>

        {/*calendar component section*/}
        <View style={styles.opportunityCalendarComponentContainer}>
          <CustomCalendarRangerPicker
            control={control}
            name={"duration"}
            rules={{
              require: "Please add a duration for this opportunity",
            }}
          />
        </View>
      </View>
    );
  }

  //opportunity image section
  function renderOpportunityImageSection() {
    return (
      <View style={styles.opportunityImageSectionContainer}>
        <Text style={styles.opportunityImageTextItem}>
          Choose a poster for your opportunity card
        </Text>

        {/*image option items*/}
        <View style={styles.imageItemContainer}>
          {/*user upload section*/}
          <TouchableOpacity
            onPress={() => libraryUserPickerFunction()}
            style={styles.uploaderComponentContainer}
          >
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={
                libraryUserPicker
                  ? [COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]
                  : [COLORS.white, COLORS.white, COLORS.white]
              }
              style={styles.uploaderGradientContainer}
            >
              {/*selector inner items*/}
              <View style={styles.uploaderTextContainerItems}>
                {/*selector text section*/}
                <View style={styles.uploaderTextContainer}>
                  <Text style={styles.uploaderTextItem}>Upload file</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/*reech library upload section*/}
          <TouchableOpacity
            onPress={() => navigation.navigate("ReechRileyLibraryImageSelectorScreen")}
            style={styles.uploaderComponentContainer}
          >
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={
                reechLibraryPicker
                  ? [COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]
                  : [COLORS.white, COLORS.white, COLORS.white]
              }
              style={styles.uploaderGradientContainer}
            >
              {/*selector inner items*/}
              <View style={styles.uploaderTextContainerItems}>
                {/*selector text section*/}
                <View style={styles.uploaderTextContainer}>
                  <Text style={styles.uploaderTextItem}>Use Reech Library</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/*user upload: image picker component section*/}
        {libraryUserPicker && (
          <View style={styles.imagePickerComponentContainer}>
            <CustomImageOppPicker
              name="oppImage"
              control={control}
            />
          </View>
        )}
      </View>
    );
  }

  //opportunity presentation section
  function renderOpportunityCardPresentationSection() {
    return (
      <View style={styles.opportunityImageLookSectionContainer}>
        <Text style={styles.opportunityImageLookTextItem}>
          How your opportunity card will look...
        </Text>

        {/*opportunity card section*/}
        <View style={styles.careersOpportunitysContainer}>
          <ImageBackground
            source={
              typeof watchOppImage === "string" && libraryUserPicker
                ? { uri: watchOppImage }
                : { uri: watchOppImage }
            }
            style={styles.opportunitysBackgroundsImageItem}
          >
            {/*account image or icon section*/}
            <ImageBackground
              source={images.userFrame}
              style={styles.opportunitysIconsUserImageContainer}
            >
              <View>
                <Image
                  source={
                    user?.profileImage
                      ? { uri: user?.profileImage }
                      : images.defaultRounded
                  }
                  style={styles.opportunitysUsersImageItem}
                />
              </View>
            </ImageBackground>

            {/*gradient opportunity section*/}
            <View style={styles.opportunitysGradientsContainer}>
              <LinearGradient
                colors={[COLORS.purple, COLORS.transparent, COLORS.purple]}
                start={{ x: 0.99, y: 0.0 }}
                end={{ x: 0.01, y: 0.0 }}
                style={styles.linearsGradientsContentContainer}
              >
                {/*name and info section*/}
                <View style={styles.opportunitysNamesContainer}>
                  {/*opportunity name*/}
                  <View style={styles.opportunitysNamesContent}>
                    <Text
                      numberOfLines={1}
                      style={styles.opportunitysNamesTextItem}
                    >
                      {watch("jobTitle")}
                    </Text>
                  </View>

                  {/*opportunity info trigger*/}
                  <View style={styles.opportunitysInfosContent}>
                    <MaterialIcons
                      name="info"
                      size={25}
                      color={COLORS.white}
                    />
                  </View>
                </View>

                {/*location section*/}
                <View style={styles.opportunitysLocationsContainer}>
                  <Text
                    numberOfLines={1}
                    style={styles.opportunitysLocationsTextItem}
                  >
                    {watch("address")?.split("|")[0] ?? mapRegion?.address}
                  </Text>
                </View>

                {/*rate section section*/}
                <View style={styles.opportunitysRatesContainer}>
                  <Text style={styles.opportunitysRatesTextItem}>
                    {/*currency symbol*/}
                    {["Collaborator", "Mentor", "Mentor", undefined].includes(
                      watch("rateFrequency")
                    )
                      ? null
                      : watch("rateCurrency")?.split("|")[1]}
                    {/*amount*/}
                    {["Collaborator", "Mentor", "Mentor", undefined].includes(
                      watch("rateFrequency")
                    )
                      ? null
                      : formatMoney(watch("rate"))}{" "}
                    {/*rate payment cycle*/}
                    {watch("rateFrequency")?.toLowerCase()}
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </ImageBackground>
        </View>
      </View>
    );
  }

  function renderSubmitOpportunityActionSection() {
    return (
      <View style={styles.reechButtonContainer}>
        <TouchableOpacity onPress={handleSubmit(onCreatePressed)}>
          {isLoading || isUploadingImage || isLoadingInitDoc ? (
            <ActivityIndicator size={"large"} color="white" />
          ) : (
            <Image
              source={icons.reechButton}
              style={{ height: 50, width: 250 }}
            />
          )}
        </TouchableOpacity>
        <Text style={styles.reechTextItem}>Press button to publish card</Text>
      </View>
    );
  }

  //render screen content list
  function renderScreenContentListSection() {
    return (
      <>
        {renderHeaderSection()}
        <View style={styles.screenContentContainer}>
          {renderHeadingTopSection()}
          <ScrollView
            showsVerticalScrollIndicator={false}
            listViewDisplayed={false}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"

            style={styles.scrollingSectionContainer}
          >
            {renderTopOptionSection()}
            {renderOpportunityTitleSection()}
            {renderOpportunityLocationSection()}
            {renderOpportunityExperienceSection()}
            {renderOpportunityEducationSection()}
            {renderOpportunityDateSection()}
            {renderOpportunityTypeSection()}
            {renderOpportunityDescriptionSection()}
            {renderOpportunityRateFrequencySection()}
            {renderOpportunityRateSection()}
            {renderOpportunityRateEvaluatorSection()}
            {renderMaxNumberOfApplicantsSection()}
            {renderOpportunityVisibilitySection()}
            {renderOpportunityImageSection()}
            {renderOpportunityCardPresentationSection()}
            {renderSubmitOpportunityActionSection()}
          </ScrollView>
        </View>
      </>
    );
  }

  //screen content items
  return (
    <View style={styles.container}>{renderScreenContentListSection()}</View>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  //header section
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  contentContainerAddOpp: {
    marginTop: Platform.OS === "android" ? "0%" : "10%",
  },

  //screen content container
  screenContentContainer: {
    marginTop: 35,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: "#141414",
  },
  scrollingSectionContainer: {
    height: Platform.OS === "ios" ? 700 : 620,
    marginVertical: 20,
    paddingHorizontal: 20,
  },

  //heading top section
  headingContentContainer: {
    marginTop: 25,
    marginBottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  headingTopLinearItem: {
    width: "15%",
    marginBottom: 15,
    borderBottomColor: COLORS.white,
    borderBottomWidth: StyleSheet.hairlineWidth * 3,
  },
  headingTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //top selector section
  topSelectorOptionContainer: {
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
    fontSize: 12,
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

  //opportunity title section item
  opportunityTitleContainer: {
    flexDirection: "column",
    marginTop: 15,
  },
  opportunityTitleTextItem: {
    left: 5,
    marginBottom: 15,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  opportunityTitleComponentContainer: {
    marginBottom: 15,
  },

  //opportunity location section item
  opportunityLocationContainer: {
    flexDirection: "column",
  },
  opportunityLocationTextItem: {
    left: 5,
    marginBottom: 20,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  opportunityLocationToggleContainer: {
    flexDirection: "row",
    width: "100%",
  },
  opportunityLocationTogglerContainer: {
    width: "20%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  opportunityLocationTextContainer: {
    width: "80%",
    justifyContent: "center",
  },
  opportunityLocationTextItemDescription: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //opportunity search section
  searchComponentContainer: {
    flexDirection: "column",
    marginTop: 15,
    minHeight: 50,
    backgroundColor: COLORS.transparent,
  },
  searchMapResultContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  searchMapItem: {
    resizeMode: "contain",
    marginBottom: "10%",
  },
  searchRadiusSlider: {
    paddingHorizontal: 5,
    marginBottom: 15,
  },
  mapView: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 270,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 15,
    zIndex: 10
  },

  //opportunity experience section
  opportunityExperienceSection: {
    flexDirection: "column",
    marginBottom: 15,
  },
  opportunityExperienceTextItem: {
    left: 5,
    marginBottom: 25,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  opportunityExperienceSlider: {
    marginTop: 5,
    paddingHorizontal: 5,
  },

  //opportunity education section
  opportunityEducationContainer: {
    flexDirection: "column",
    marginBottom: 15,
  },
  opportunityEducationTextItem: {
    left: 5,
    marginBottom: 25,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  opportunityEducationTextContainer: {
    width: "80%",
    justifyContent: "center",
  },
  opportunityEducationTextItemDescription: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  opportunityEducationDropDownContainer: {
    marginTop: 15,
    marginBottom: 10,
    width: "100%",
  },

  //opportunity date section
  opportunityDateContainer: {
    flexDirection: "column",
    marginBottom: 15,
  },
  opportunityDateTextItem: {
    left: 5,
    marginBottom: 25,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  opportunityDateExcerptTextItem: {
    color: COLORS.white,
    fontSize: 10,
    opacity: 0.5,
    bottom: 20,
    left: 6,
  },
  OpportunityDateComponentContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 10,
  },
  opportunityDayItemContainer: {
    width: "20%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: COLORS.reechGray,
  },
  opportunityDayTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    marginVertical: 5,
  },
  opportunityMonthItemContainer: {
    width: "50%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: COLORS.reechGray,
  },
  opportunityMonthTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    marginVertical: 5,
  },
  opportunityYearItemContainer: {
    width: "20%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: COLORS.reechGray,
  },
  opportunityYearTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    marginVertical: 5,
  },

  //opportunity type section
  opportunityTypeContainer: {
    flexDirection: "column",
    marginBottom: 15,
  },
  opportunityTypeTextItem: {
    left: 5,
    marginBottom: 20,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  opportunityTypeDropDownContainer: {
    marginTop: 0,
    marginBottom: 10,
    width: "100%",
  },

  //opportunity description section
  opportunityDescriptionContainer: {
    flexDirection: "column",
    marginBottom: 15,
  },
  opportunityDescriptionTextItem: {
    left: 5,
    marginBottom: 20,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  opportunityDescriptionContentContainer: {
    width: "100%",
    flexDirection: "column",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: COLORS.reechGray,
    marginBottom: 20,
  },
  opportunityDescriptionItemContainer: {
    flexDirection: "column",
    marginBottom: 10,
  },
  opportunityDescriptionHeadingTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    opacity: 0.5,
  },

  //opportunity rate section
  opportunityRateContainer: {
    flexDirection: "column",
    marginBottom: 25,
  },
  opportunityRateTextItem: {
    left: 5,
    marginBottom: 20,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  rateCurrencySelectorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  rateCurrencySelectorContent: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "48%",
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.reechGray,
  },
  rateCurrencyComponentContainer: {
    width: "80%",
    right: 10,
  },
  rateCurrencyFlagImageItem: {
    width: 30,
    height: 30,
    resizeMode: "cover",
    borderRadius: 30,
    left: 15,
  },
  rateValueContainer: {
    width: "45%",
  },
  rateGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 51,
    width: "100%",
  },
  rateTextContainerItems: {
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
  rateCurrencyTextItem: {
    width: "20%",
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  rateValueComponentContainer: {
    width: "80%",
    top: 2,
  },

  //opportunity rate frequency section
  opportunityRateFrequencyContainer: {
    flexDirection: "column",
    marginBottom: 15,
  },
  opportunityRateFrequencyTextItem: {
    left: 5,
    marginBottom: 20,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //rate evaluator
  opportunityRateEvaluatorContainer: {
    flexDirection: "column",
    marginBottom: 25,
    paddingHorizontal: 18,
  },
  rateIndicatorContainer: {
    marginTop: 12.5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 0,
  },
  rateIndicatorText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    marginVertical: 20,
    alignSelf: "center",
  },
  rateIndicatorSliderWrapper: {
    position: "relative",
    width: "100%",
  },
  rateIndicatorSlider: {
    height: 3,
  },
  rateIndicatorPointer: {
    position: "absolute",
    left: "50%", // default
  },
  tempTriangle: {
    width: 0,
    height: 0,
    bottom: 6,
    borderRadius: 20,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 16,
    marginLeft: -16, // shift to center (-half of bottomWidth)
    borderLeftColor: COLORS.purpleDark,
    borderRightColor: COLORS.purpleDark,
    borderBottomColor: COLORS.purpleDark,
  },

  //applicants section
  applicantsSectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 15,
    marginBottom: 35,
  },
  applicantTextContainer: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  applicantTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  applicationMaxDeciderContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  applicationMaxTogglerContainer: {
    width: "40%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  applicationUnlimitedTextContainer: {
    width: "60%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  applicationUnlimitedTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  applicantCounterItemContainer: {
    width: "45%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: COLORS.reechGray,
  },
  applicantCounterTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    marginVertical: 5,
  },

  //opportunity visibility
  opportunityVisibilitySectionContainer: {
    flexDirection: "column",
    marginBottom: 25,
  },
  opportunityVisibilityTextItem: {
    left: 5,
    marginBottom: 20,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  opportunityCalendarComponentContainer: {
    width: "100%",
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.reechGray,
  },

  //opportunity poster image
  opportunityImageSectionContainer: {
    flexDirection: "column",
    marginBottom: 25,
  },
  opportunityImageTextItem: {
    left: 5,
    marginBottom: 20,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  imageItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  uploaderComponentContainer: {
    width: "48%",
  },
  uploaderGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 45,
    width: "100%",
  },
  uploaderTextContainerItems: {
    flexDirection: "column",
    paddingVertical: 8,
    height: 42,
    borderRadius: 30,
    backgroundColor: "#141414",
    width: "98%",
  },
  uploaderTextContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  uploaderTextItem: {
    top: 5,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  imagePickerComponentContainer: {
    width: "100%",
    marginVertical: 10,
  },

  //opportunity presentation image
  opportunityImageLookSectionContainer: {
    flexDirection: "column",
    marginBottom: 35,
  },
  opportunityImageLookTextItem: {
    left: 5,
    marginBottom: 10,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //card content section
  careersOpportunitysContainer: {
    height: Platform.OS === "ios" ? 350 : 340,
  },
  flatListsCardsContainer: {
    height: 395,
  },
  flatListsCardsContent: {
    width: "100%",
    flexDirection: "column",
  },

  //opportunity card info section
  opportunitysBackgroundsImageItem: {
    width: "100%",
    height: 350,
    resizeMode: "cover",
    borderRadius: 20,
    overflow: "hidden",
  },
  opportunitysIconsUserImageContainer: {
    width: 80,
    height: 80,
    marginTop: 20,
    marginLeft: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  opportunitysUsersImageItem: {
    width: 73,
    height: 73,
    resizeMode: "cover",
    borderRadius: 8,
  },

  //gradient section
  opportunitysGradientsContainer: {
    marginTop: 170,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  linearsGradientsContentContainer: {
    height: 80,
    paddingHorizontal: 10,
    justifyContent: "center",
    flexDirection: "column",
  },
  opportunitysNamesContainer: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  opportunitysNamesContent: {
    width: "85%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  opportunitysNamesTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  opportunitysInfosContent: {
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  opportunitysLocationsContainer: {
    width: "100%",
    justifyContent: "center",
    flexDirection: "column",
    marginBottom: 2.5,
  },
  opportunitysLocationsTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  opportunitysRatesContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  opportunitysRatesTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //submit button section
  reechButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Platform.OS === "ios" ? 20 : 60,
  },
  reechTextItem: {
    marginTop: 8,
    color: COLORS.darkGray,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  buttonContainer: {
    width: "100%",
    marginHorizontal: 5,
    marginVertical: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonTextContainer: {
    left: 15,
    width: "60%",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  buttonItemContainer: {
    width: "40%",
    marginHorizontal: 20,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    right: 38,
    bottom: 25,
  },
  buttonImage: {
    width: 90,
    height: 50,
    resizeMode: "contain",
  },
});

export default AddOpportunityCardScreen;
