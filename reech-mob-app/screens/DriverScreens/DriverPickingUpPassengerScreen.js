import React, { useState, useRef } from "react";
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import MapViewDirections from "react-native-maps-directions";
import MapView, { Marker } from "react-native-maps";

//customs
import { COLORS, icons, images } from "../../constants";
import NavHeader from "@/components/Headers/NavHeader";

const DriverPickingUpPassengerScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigation = useNavigation();

  const map_api_key = process.env.GOOGLE_PLACES_API_KEY;

  //state handlers
  const [tripDistance, setTripDistance] = useState(false);
  const [tripDuration, setTripDuration] = useState(false);

  const mapRef = useRef();

  //map config
  const [mapRegion, setRegion] = useState({
    latitude: -26.107567,
    longitude: 28.056702,
    latitudeDelta: 0.06,
    longitudeDelta: 0.06,
    address: "",
  });

  //declare marker route
  let tripLocations = [
    {
      id: 1,
      title: "Sandton City Mall Entrance 3",
      location: {
        latitude: -26.10298,
        longitude: 28.05753,
      },
      description: "Pick-up",
    },
    // {
    //   id: 2,
    //   title: "The Residency Sandhurst",
    //   location: {
    //     latitude: -26.1042,
    //     longitude: 28.033,
    //   },
    //   description: "First stop",
    // },
    // {
    //   id: 3,
    //   title: "Hudsons - The Burger Joint (Parkhurts)",
    //   location: {
    //     latitude: -26.13777,
    //     longitude: 28.01788,
    //   },
    //   description: "Second stop",
    // },
    {
      id: 2,
      title: "Norwood Mall",
      location: {
        latitude: -26.14789255,
        longitude: 28.0798907365735,
      },
      description: "Drop-off",
    },
  ];

  //show markers on map of trip
  const showLocationPoints = () => {
    return tripLocations.map((item, index) => {
      return (
        <Marker
          key={index}
          coordinate={item.location}
          title={item.title}
          description={item.description}
          pinColor={COLORS.purple}
        >
          {/*driver and user custom markers*/}
          {item.description === "Pick-up" ? (
            <>
              {/*show driver movement towards user*/}
              <View style={styles.mapMarkerItemContainer}>
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1608507980689-3e5f3719d401?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                  }}
                  style={styles.passengerMapMakerImageItem}
                />
              </View>
            </>
          ) : item.description === "Drop-off" ? (
            <>
              {/*show user being picked up by driver*/}
              <ImageBackground
                source={images.userFrame}
                style={styles.passengerMapMakerImageItemContainer}
              >
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1632765854612-9b02b6ec2b15?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=686&q=80",
                  }}
                  style={styles.passengerMapMakerImageUserItem}
                />
              </ImageBackground>
            </>
          ) : (
            <>
              {/*show for stops added for trip*/}
              <Ionicons
                name="ios-location"
                size={23}
                color={Platform.OS === "ios" ? COLORS.white : COLORS.purple}
              />
            </>
          )}
        </Marker>
      );
    });
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerPassengerContainers}>
        <NavHeader
          message="What would you like to do?"
        />
        {/*replace top header with 
        <NavHeader 
          icon={<Feather name="more-vertical" size={24} color={COLORS.white} />}
          bubbleModal={true}
        />
        */}
      </View>
    );
  }

  //passenger account section
  function renderTopPassengerSection() {
    return (
      <View style={styles.topPassengerContainer}>
        {/*top text section*/}
        <View style={styles.topPassengerHeadingContainer}>
          <Text style={styles.topPassengerHeadingTextItem}>
            You're picking up:
          </Text>
        </View>

        {/*profile picture section*/}
        <ImageBackground
          source={images.userFrame}
          style={styles.passengerBackgroundImageContainer}
        >
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1632765854612-9b02b6ec2b15?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=686&q=80",
            }}
            style={styles.passengerBackgroundImageItem}
          />
        </ImageBackground>

        {/*username text section*/}
        <View style={styles.passengerUserNameTextContainer}>
          <Text style={styles.passengerUserNameTextItem}>Nthando</Text>
        </View>
      </View>
    );
  }

  //trip location info
  function renderTripLocationSection() {
    return (
      <View style={styles.passengerTripDestinationContainer}>
        {/*pick up location*/}
        <View style={styles.passengerTripPickupContainer}>
          <Text style={styles.passengerTripPickupTextItem}>
            Pick-up - {tripLocations[0].title}
          </Text>
        </View>

        {/*stop location*/}
        {tripLocations[2] ? (
          <View style={styles.passengerTripPickupContainer}>
            <Text style={styles.passengerTripPickupTextItem}>
              First stop - {tripLocations[2].title}
            </Text>
          </View>
        ) : null}

        {/*stop location*/}
        {tripLocations[3] ? (
          <View style={styles.passengerTripPickupContainer}>
            <Text style={styles.passengerTripPickupTextItem}>
              Second stop - {tripLocations[3].title}
            </Text>
          </View>
        ) : null}

        {/*destination location*/}
        <View style={styles.passengerTripPickupContainer}>
          <Text style={styles.passengerTripPickupTextItem}>
            Drop-off - {tripLocations[1].title}
          </Text>
        </View>
      </View>
    );
  }

  //map view section
  function renderMapTripViewSection() {
    const polylineCoordinates = tripLocations.map((item) => item.location);

    return (
      <View style={styles.passengerMapTripViewContainer}>
        <MapView
          ref={mapRef}
          initialRegion={mapRegion}
          style={styles.passengerMapTripViewItem}
          userInterfaceStyle="dark"
        >
          {showLocationPoints()}

          <MapViewDirections
            origin={polylineCoordinates[0]}
            waypoints={
              polylineCoordinates.length === 4
                ? polylineCoordinates.slice(1, -1)
                : polylineCoordinates.length === 3
                  ? polylineCoordinates.slice(1, -1)
                  : polylineCoordinates.length === 2
                    ? polylineCoordinates.slice(1, -1)
                    : polylineCoordinates[1]
            }
            optimizeWaypoints={true}
            destination={
              polylineCoordinates.length === 4
                ? polylineCoordinates[3]
                : polylineCoordinates.length === 3
                  ? polylineCoordinates[2]
                  : polylineCoordinates.length === 2
                    ? polylineCoordinates[1]
                    : polylineCoordinates[1]
            }
            apikey={map_api_key}
            strokeColor={COLORS.purple}
            strokeWidth={3}
            onReady={(result) => {
              setTripDistance(result.distance);
              setTripDuration(result.duration);
            }}
          />
        </MapView>
      </View>
    );
  }

  //show trip distance
  function renderTripDistanceSection() {
    //round off time
    let time = Math.trunc(tripDuration);
    const hours = Math.floor(time / 60);
    const minutes = time % 60;

    //round off distance
    const roundedTripDistance = Number(tripDistance).toFixed(1);

    return (
      <View style={styles.passengerTripDistanceContainer}>
        <View style={styles.passengerTripDistanceTextContainer}>
          <Text style={styles.passengerTripDistanceTextItem}>
            ETA: {hours > 1 ? hours + "h:" + minutes : minutes + " mins"}
          </Text>
        </View>

        <View style={styles.passengerTripDistanceTextContainer}>
          <Text style={styles.passengerTripDistanceTextItem}>
            Distance: {roundedTripDistance + " km away"}
          </Text>
        </View>
      </View>
    );
  }

  //message or call passenger
  function messageOrCallPassengerSection() {
    return (
      <View style={styles.tripPassengerActionContainer}>
        {/*call passenger section*/}
        <TouchableOpacity
          onPress={() => console.log("call passenger")}
          style={styles.callPassengerActionContainer}
        >
          <View style={styles.callPassengerIconContainer}>
            <Ionicons name="call-outline" size={20} color={COLORS.white} />
          </View>

          <View style={styles.callPassengerTextContainer}>
            <Text style={styles.callPassengerTextItem}>Call</Text>
          </View>
        </TouchableOpacity>

        {/*message passenger section*/}
        <TouchableOpacity
          onPress={() => console.log("message passenger")}
          style={styles.callPassengerActionContainer}
        >
          <View style={styles.callPassengerIconContainer}>
            <Image
              source={icons.chatIcon}
              style={styles.messagePassengerIconItem}
            />
          </View>

          <View style={styles.callPassengerTextContainer}>
            <Text style={styles.callPassengerTextItem}>Message</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  //screen content list
  function renderScreenContentList() {
    return (
      <>
        {renderHeaderSection()}
        {renderTopPassengerSection()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          style={styles.scrollPassengerInfoSectionContainer}
        >
          {renderTripLocationSection()}
          {renderMapTripViewSection()}
          {renderTripDistanceSection()}
          {messageOrCallPassengerSection()}
        </ScrollView>
      </>
    );
  }

  //screen content
  return (
    <View style={styles.passengerScreenContainer}>
      {renderScreenContentList()}
    </View>
  );
};

const styles = StyleSheet.create({
  passengerScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //header section
  headerPassengerContainers: {
    zIndex: 99,
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  //screen content
  scrollPassengerInfoSectionContainer: {
    flexDirection: "column",
    marginBottom: Platform.OS === "ios" ? 56 : 0,
  },

  //top passenger section
  topPassengerContainer: {
    marginTop: Platform.OS === "ios" ? 50 : 50,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  topPassengerHeadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  topPassengerHeadingTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  passengerBackgroundImageContainer: {
    width: Platform.OS === "ios" ? 130 : 100,
    height: Platform.OS === "ios" ? 130 : 100,
    justifyContent: "center",
    alignItems: "center",
  },
  passengerBackgroundImageItem: {
    width: Platform.OS === "ios" ? 120 : 90,
    height: Platform.OS === "ios" ? 120 : 90,
    resizeMode: "cover",
    borderRadius: 8,
  },
  passengerUserNameTextContainer: {
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  passengerUserNameTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //passenger trip destination section
  passengerTripDestinationContainer: {
    marginTop: 0,
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
  },
  passengerTripPickupContainer: {
    height: Platform.OS === "ios" ? 50 : 45,
    marginBottom: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "flex-start",
    borderRadius: 30,
    borderWidth: 0.2,
    borderColor: COLORS.darkGray,
    backgroundColor: COLORS.reechGray,
  },
  passengerTripPickupTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    opacity: 0.5,
  },

  //passenger map trip view container
  passengerMapTripViewContainer: {
    height: Platform.OS === "ios" ? 300 : 250,
    marginTop: Platform.OS === "ios" ? 5 : 0,
    overflow: "hidden",
    zIndex: -999,
  },
  passengerMapTripViewItem: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  passengerMapMarkerItemContainer: {
    height: 30,
    width: 30,
  },
  passengerMapMakerImageItemContainer: {
    height: 30,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  passengerMapMakerImageItem: {
    width: 27,
    height: 27,
    resizeMode: "cover",
    borderRadius: 27,
  },
  passengerMapMakerImageUserItem: {
    width: 27,
    height: 27,
    resizeMode: "cover",
    borderRadius: 3,
  },

  //passenger trip distance section
  passengerTripDistanceContainer: {
    marginTop: 10,
    paddingHorizontal: 15,
    flexDirection: "column",
  },
  passengerTripDistanceTextContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  passengerTripDistanceTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },

  //message or call passenger
  tripPassengerActionContainer: {
    marginTop: Platform.OS === "ios" ? 20 : 10,
    paddingHorizontal: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  callPassengerActionContainer: {
    width: "45%",
    height: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 30,
    borderWidth: 0.2,
    borderColor: COLORS.darkGray,
    backgroundColor: COLORS.reechGray,
  },
  callPassengerIconContainer: {
    width: "20%",
    justifyContent: "center",
  },
  callPassengerTextContainer: {
    left: 15,
    width: "80%",
    justifyContent: "center",
  },
  callPassengerTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  messagePassengerIconItem: {
    width: 20,
    height: 20,
  },
});

export default DriverPickingUpPassengerScreen;
