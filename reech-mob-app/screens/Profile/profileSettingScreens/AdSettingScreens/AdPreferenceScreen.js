import React, { useState, useEffect } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps';
import * as Location from "expo-location";

//customs
import { COLORS } from "../../../../constants";
import { CustomAgeSlider, CustomItemToggler, CustomRadiusSlider, CustomAdLocation } from "../../../../components";
import NavHeader from "@/components/Headers/NavHeader";

const AdPreferenceScreen = () => {
  const navigation = useNavigation();

  const { control, handleSubmit, watch, } = useForm();

  const [watchRadius, watchAddress, watchLocationToggle] = watch(["radius", "address", "currentLocationToggler"]);

  //state handlers
  const [femaleValue, setFemaleValue] = useState(false);
  const [maleValue, setMaleValue] = useState(false);
  const [anyValue, setAnyValue] = useState(false);

  //button select function
  const setFemale = () => {
    setFemaleValue(true);
    setMaleValue(false);
    setAnyValue(false);
  };
  const setMale = () => {
    setFemaleValue(false);
    setMaleValue(true);
    setAnyValue(false);
  };
  const setNonBinary = () => {
    setFemaleValue(false);
    setMaleValue(false);
    setAnyValue(true);
  };

  //map function
  const [mapRegion, setRegion] = useState({
    latitude: -26.107567,
    longitude: 28.056702,
    latitudeDelta: 0.25,
    longitudeDelta: 0.25,
    address: "",
  });

  const currentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") { console.log("Permission to access location was denied: ", status); }
    let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });

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
  };

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

  useEffect(() => { updateMapLocation(); }, [watchAddress]);

  useEffect(() => {
    // updateMapRadius();
  }, [watchRadius]);

  //handle submit
  const handlePreferenceSettings = (data) => {
    navigation.navigate("AdSettingScreen");
    console.log("my results: ", data);
  };

  //header component
  function renderHeaderComponent() {
    return (
      <View style={styles.headerComponentContainer}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        {/*navigation section*/}
        <View style={styles.headerTextContainer}>
          <Text style={styles.headingTextItem}>Define my preferences</Text>
        </View>
      </View>
    );
  }

  //demographic section
  function renderDemographicHeadingSection() {
    return (
      <View style={styles.demographicContainer}>
        {/*demographic heading section*/}
        <View style={styles.demoHeadingContainer}>
          <Text style={styles.demoHeadingTextItem}>Demographic data</Text>
        </View>
      </View>
    );
  }

  //gender option section
  function renderGenderSection() {
    return (
      <>
        {/*demographic gender section*/}
        <View style={styles.demoGenderContainer}>
          <Text style={styles.demoGenderTextItem}>Gender: </Text>
        </View>

        <View style={styles.genderItemsContainer}>
          {/*female button item*/}
          <Pressable
            onPress={() => setFemale()}
            style={[
              styles.genderButtonContainer,
              {
                borderColor: femaleValue ? COLORS.tealDark : COLORS.transparent,
              },
            ]}
          >
            <LinearGradient
              start={{ x: 0.99, y: 0.0 }}
              end={{ x: 0.01, y: 0.0 }}
              colors={
                femaleValue
                  ? [COLORS.black, COLORS.tealDark, COLORS.black]
                  : [COLORS.reechGray, COLORS.reechGray, COLORS.reechGray]
              }
              style={styles.genderGradientContainer}
            >
              <Text style={styles.genderTextItem}>Female</Text>
            </LinearGradient>
          </Pressable>

          {/*male button item*/}
          <Pressable
            onPress={() => setMale()}
            style={[
              styles.genderButtonContainer,
              {
                borderColor: maleValue ? COLORS.tealDark : COLORS.transparent,
              },
            ]}
          >
            <LinearGradient
              start={{ x: 0.99, y: 0.0 }}
              end={{ x: 0.01, y: 0.0 }}
              colors={
                maleValue
                  ? [COLORS.black, COLORS.tealDark, COLORS.black]
                  : [COLORS.reechGray, COLORS.reechGray, COLORS.reechGray]
              }
              style={styles.genderGradientContainer}
            >
              <Text style={styles.genderTextItem}>Male</Text>
            </LinearGradient>
          </Pressable>

          {/*non-binary button item*/}
          <Pressable
            onPress={() => setNonBinary()}
            style={[
              styles.genderButtonContainer,
              {
                borderColor: anyValue
                  ? COLORS.tealDark
                  : COLORS.transparent,
              },
            ]}
          >
            <LinearGradient
              start={{ x: 0.99, y: 0.0 }}
              end={{ x: 0.01, y: 0.0 }}
              colors={
                anyValue
                  ? [COLORS.black, COLORS.tealDark, COLORS.black]
                  : [COLORS.reechGray, COLORS.reechGray, COLORS.reechGray]
              }
              style={styles.genderGradientContainer}
            >
              <Text style={styles.genderTextItem}>Any</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </>
    );
  }

  //age section
  function renderAgeSection() {
    return (
      <View style={styles.ageContainer}>
        {/*age text section*/}
        <View style={styles.ageTextContainer}>
          <Text style={styles.ageTextItem}>Age: </Text>
        </View>

        {/*age slider section*/}
        <View style={styles.ageSliderContainer}>
          <CustomAgeSlider name="ageOption" control={control} />
        </View>
      </View>
    );
  }

  //location section
  function renderLocationSection() {
    return (
      <View style={styles.locationContainer}>
        {/*location toggler component*/}
        <View style={styles.locationUserLocationContainer}>
          <View style={styles.locationTogglerContainer}>
            <CustomItemToggler
              control={control}
              name={"currentLocationToggler"}
              invalue={"useMyPreferenceLocation"}
              notify={({ value }) => {
                value === true && currentLocation();
              }}
            />
          </View>

          <View style={styles.locationTextContainer}>
            <Text style={styles.locationTextItemDescription}>
              Would you like to use your current location?
            </Text>
          </View>
        </View>

        {/*search component*/}
        <View style={styles.locationComponentContainer}>
          {watchLocationToggle === true ? null : (
            <CustomAdLocation
              rules={{ required: "Please enter a location" }}
              name="address"
              control={control}
              placeholder="Location"
            />
          )}
        </View>

        {/*location map component*/}
        {<MapView
          region={mapRegion}
          provider={PROVIDER_GOOGLE}
          style={styles.mapView}
          userInterfaceStyle="dark"
        >
          <Marker coordinate={mapRegion} title="Your location" />
          {watchRadius > 0 && (
            <Circle
              center={mapRegion}
              radius={watchRadius * 1000}
              strokeWidth={1}
              strokeColor={`rgba(${COLORS.tealRGB}, 0.5)`}
              fillColor={`rgba(${COLORS.tealRGB}, 0.4)`}
            />
          )}
        </MapView>}

        {/*map radius section item*/}
        <View style={styles.searchRadiusSlider}>
          <CustomRadiusSlider name="radius" control={control} />
        </View>
      </View>
    );
  }

  //submit section
  function renderSubmitButtonSection() {
    return (
      <Pressable
        onPress={handleSubmit(handlePreferenceSettings)}
        style={styles.submitButtonContainer}
      >
        <LinearGradient
          start={{ x: 0.99, y: 0.0 }}
          end={{ x: 0.01, y: 0.0 }}
          colors={[COLORS.teal, COLORS.tealDark, COLORS.tealDarker]}
          style={styles.submitGradientContainer}
        >
          <Text style={styles.submitTextItem}>Set my preference</Text>
        </LinearGradient>
      </Pressable>
    );
  }

  //screen content list
  function renderScreenContentList() {
    return (
      <>
        {renderHeaderComponent()}
        {renderHeaderSection()}
        <View style={styles.screenContentListContainer}>
          {renderDemographicHeadingSection()}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollViewContainer}
          >
            {renderGenderSection()}
            {renderAgeSection()}
            {renderLocationSection()}
            {renderSubmitButtonSection()}
          </ScrollView>
        </View>
      </>
    );
  }

  return <View style={styles.container}>{renderScreenContentList()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //screen content list section
  screenContentListContainer: {
    top: 110,
    marginHorizontal: 10,
  },
  scrollViewContainer: {
    marginBottom: Platform.OS === "ios" ? "55%" : "33%",
  },

  //header section
  headerContainer: {
    marginTop: "0%",
    zIndex: 99,
  },
  headerComponentContainer: {
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },
  headerTextContainer: {
    top: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
  },
  headingTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },

  //demographic section
  demographicContainer: {
    marginTop: Platform.OS === "ios" ? -70 : -75,
    marginHorizontal: 8,
    padding: 2,
    flexDirection: "column",
  },
  demoHeadingContainer: {
    flexDirection: "column",
  },
  demoHeadingTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //gender section
  demoGenderContainer: {
    flexDirection: "column",
    marginTop: 20,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  demoGenderTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
    marginBottom: 10,
  },
  genderItemsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  genderButtonContainer: {
    marginHorizontal: 0,
    borderWidth: 2,
    borderRadius: 25,
    width: "30%",
  },
  genderGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    height: 45,
    width: "100%",
  },
  genderTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //age section
  ageContainer: {
    marginTop: 30,
    flexDirection: "column",
  },
  ageTextContainer: {
    flexDirection: "column",
    marginHorizontal: 10,
    marginBottom: 5,
  },
  ageTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
    marginBottom: 15,
  },
  ageSliderContainer: {
    marginTop: 10,
    marginHorizontal: 10,
  },

  //location section
  locationContainer: {
    padding: 2,
    flexDirection: "column",
  },
  locationUserLocationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  locationTogglerContainer: {
    width: "20%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  locationTextContainer: {
    width: "80%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  locationTextItemDescription: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  locationComponentContainer: {
    zIndex: 99,
  },
  mapView: {
    width: "100%",
    height: 270,
    marginTop: 30,
    marginBottom: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  searchRadiusSlider: {
    paddingHorizontal: 5,
    marginBottom: 15,
  },

  //submit section
  submitButtonContainer: {
    marginHorizontal: 0,
    borderColor: COLORS.tealDark,
    borderWidth: 2,
    borderRadius: 25,
    marginBottom: Platform.OS === "ios" ? 0 : 15,
  },
  submitGradientContainer: {
    height: 45,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  submitTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
});

export default AdPreferenceScreen;