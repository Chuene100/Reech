import React, { useState, useRef } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { AntDesign, Feather } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";
import { LinearGradient } from "expo-linear-gradient";
import { FlatList } from "react-native-gesture-handler";
import MapViewDirections from "react-native-maps-directions";

//custom
import { COLORS, icons } from "../../../constants";
import {

  CustomDriverLocation,
  CustomLocationDriver,
  CustomReechingInput,
} from "../../../components";
import NavHeader from "@/components/Headers/NavHeader";
import { rate } from "@/assets/data/dropDownData";
import DropDown from "@/components/UI/DropDown";

const DriverAddOpportunityLocationScreen = ({ route }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm();

  const navigation = useNavigation();

  const prevData = route.params.data;

  const map_api_key = process.env.GOOGLE_PLACES_API_KEY;

  //state handlers
  const [addStopLocation, setAddStopLocation] = useState(false);
  const [firstStopRemover, setFirstStopRemover] = useState(false);
  const [secondStopRemover, setSecondStopRemover] = useState(false);
  const [favouritePlaces, setFavouritePlaces] = useState(false);
  const [tripDistance, setTripDistance] = useState(false);
  const [tripDuration, setTripDuration] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  const [addPlacesModal, setAddPlacesModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //favourite places - max is five (5)
  const favouritePlacesData = [
    {
      id: 1,
      placeName: "23 Malibongwe Drive",
    },
    {
      id: 2,
      placeName: "Sun City Resort",
    },
    {
      id: 3,
      placeName: "Cradle of Humankind",
    },
    {
      id: 4,
      placeName: "20174 Mhlongo Street",
    },
    {
      id: 5,
      placeName: "Blyde River Canyon",
    },
  ];

  const [
    watchPickUpLocation,
    watchFirstStopLocation,
    watchSecondStopLocation,
    watchDropOffLocation,
    watchAddPlacesOptions,
    watchRateCurrency,
  ] = watch([
    "pickupLocation",
    "firstStopLocation",
    "secondStopLocation",
    "dropOffLocation",
    "addPlacesOptions",
    "rateCurrency",
  ]);

  //map config
  //current user location
  const [mapRegion, setRegion] = useState({
    latitude: -26.107567,
    longitude: 28.056702,
    latitudeDelta: 0.06,
    longitudeDelta: 0.06,
    address: "",
  });

  const [pickUpPoint, setPickUpPoint] = useState()
  const [dropOffPoint, setDropOffPoint] = useState()

  const [stopPoints, setStops] = useState([])

  //declare marker route
  let tripLocations = [
    pickUpPoint,
    ...stopPoints,
    dropOffPoint,
  ];
  tripLocations = tripLocations.filter(obj => obj !== undefined)


  //show markers on map of trip
  const showLocationPoints = () => {
    return tripLocations?.map((item, index) => {
      return (
        <Marker
          key={index}
          coordinate={item.location}
          title={item.title}
          description={item.description}
          pinColor={COLORS.purple}
        />
      );
    });
  };

  //map view snapshot and share
  const mapRef = useRef();
  const takeSnapshotAndShare = async () => {
    //snapshot dimensions and type
    const snapshot = await mapRef.current.takeSnapshot({
      width: 300,
      height: 300,
      result: "base64",
    });

    //create file - png format
    const snapshotUri =
      FileSystem.documentDirectory + "reech-trip-snapshot.png";
    await FileSystem.writeAsStringAsync(snapshotUri, snapshot, {
      encoding: FileSystem.EncodingType.Base64,
    });
    await shareAsync(snapshotUri);
  };

  const currentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied: ", status);
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
  };

  const updateMapLocation = () => {
    const loc = watchPickUpLocation?.split("|");
    loc &&
      setRegion({
        ...mapRegion,
        latitude: loc[1],
        longitude: loc[2],
        latitudeDelta: mapRegion?.latitudeDelta,
        longitudeDelta: mapRegion?.longitudeDelta,
      });
  };

  //submit data
  const submitDriverData = (data) => {
    if (!data.firstStopLocation) delete data.firstStopLocation
    if (!data.secondStopLocation) delete data.secondStopLocation

    const payload = {
      ...data,
      ...prevData,
      NumberOfPassengers: passengerCount,
      tripDistance: tripDistance,
      tripDuration: tripDuration,
    };

    if (data === null)
      alert("Please complete the form to proceed further");
    else
      navigation.navigate("DriverAddOpportunityPreferencesScreen", {
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
        <Text style={styles.headingTextItem}>Location</Text>
      </View>
    );
  }


  //location input section
  function renderPickupLocationInputSection() {
    return (
      <View style={styles.pickupLocationContainer}>
        {/*pick up components*/}
        <View style={styles.pickupLocationComponentContainer}>
          {/*pickup location*/}
          <View
            style={[
              styles.pickupLocationComponentItemContainer,
              {
                zIndex: watchPickUpLocation
                  ? 99
                  : !watchFirstStopLocation || !watchDropOffLocation
                    ? 99
                    : 9,
              },
            ]}
          >
            <CustomDriverLocation
              name="pickupLocation"
              control={control}
              placeholder="Pick-up"
              description="Pick-up"
              locationConfirmed={({ value }) => {
                setPickUpPoint(value)
              }}
            />
          </View>

          {/*stop location*/}
          {addStopLocation ? (
            <>
              {/*first stop*/}
              <View
                style={[
                  styles.stopLocationComponentItemContainer,
                  {
                    zIndex: watchFirstStopLocation
                      ? -99
                      : !watchSecondStopLocation || !watchDropOffLocation
                        ? 9
                        : -9,
                  },
                ]}
              >
                {/*stop canceller*/}
                {!firstStopRemover ? (
                  <View style={styles.addStopActionTextContainer}>
                    <View style={styles.addFirstStopActionTextContent}>
                      <Text style={styles.addStopActionText}>Add a stop</Text>

                      <TouchableOpacity
                        onPress={() => {
                          setValue("firstStopLocation", "")
                          setFirstStopRemover(true)
                        }
                        }
                        style={styles.stopCancelIconContainer}
                      >
                        <AntDesign name="plus" size={18} color={COLORS.white} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <>
                    <CustomDriverLocation
                      name="firstStopLocation"
                      control={control}
                      placeholder="Add a stop"
                      description="First-stop"
                      locationConfirmed={({ value }) => {
                        setStops([value])
                        setValue("secondStopLocation", "")
                        setSecondStopRemover(false)
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        setValue("firstStopLocation", "")
                        setFirstStopRemover(false)
                        setStops(stopPoints.filter(stop => stop.description !== "First-stop"))
                      }}
                      style={styles.stopCancelIconContainer}
                    >
                      <AntDesign name="close" size={18} color={COLORS.white} />
                    </TouchableOpacity>
                  </>
                )}
              </View>

              {/*second stop*/}
              <View
                style={[
                  styles.stopLocationComponentItemContainer,
                  {
                    zIndex: watchSecondStopLocation
                      ? -99
                      : !watchDropOffLocation
                        ? -9
                        : -9,
                  },
                ]}
              >
                {/*stop canceller*/}
                {!secondStopRemover &&
                  (firstStopRemover === false || watchFirstStopLocation === "") ? null : !secondStopRemover ? (
                    <View style={styles.addStopActionTextContainer}>
                      <View style={styles.addStopActionTextContent}>
                        <Text style={styles.addStopActionText}>
                          Add a 2nd stop
                        </Text>

                        <TouchableOpacity
                          onPress={() => {
                            setValue("secondStopLocation", "")
                            setSecondStopRemover(true)
                          }}
                          style={styles.stopCancelIconContainer}
                        >
                          <AntDesign name="plus" size={18} color={COLORS.white} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                  <>
                    <CustomDriverLocation
                      name="secondStopLocation"
                      control={control}
                      placeholder="Add a 2nd stop"
                      description="Second-stop"
                      locationConfirmed={({ value }) => {
                        setStops([...stopPoints, value])
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        setValue("secondStopLocation", "")
                        setSecondStopRemover(false)
                        setStops(stopPoints.filter(stop => stop.description !== "Second-stop"))
                      }}
                      style={styles.stopCancelIconContainer}
                    >
                      <AntDesign name="close" size={18} color={COLORS.white} />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </>
          ) : null}

          {/*drop off location*/}
          <View
            style={[
              styles.pickupLocationComponentItemContainer,
              {
                zIndex: watchDropOffLocation ? -99 : -99,
              },
            ]}
          >
            <CustomDriverLocation
              name="dropOffLocation"
              control={control}
              placeholder="Drop-off"
              description="Pick-up"
              locationConfirmed={({ value }) => {
                setDropOffPoint(value)
              }}
            />
          </View>
        </View>

        {/*add stop section*/}
        <View style={styles.pickupLocationStopContainer}>
          <TouchableOpacity
            onPress={() => {
              setAddStopLocation(!addStopLocation)
              if (addStopLocation) {
                setValue("firstStopLocation", "")
                setValue("secondStopLocation", "")
                setFirstStopRemover(false)
                setSecondStopRemover(false)
                setStops(stopPoints.filter(stop => stop.description !== "First-stop" && stop.description !== "Second-stop"))
              }
            }}
            style={styles.pickLocationButtonContainer}
          >
            <AntDesign
              name={addStopLocation ? "minus" : "plus"}
              size={18}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  //places information section
  function renderPlacesInformationSection() {
    return (
      <View style={styles.placesInfoContainer}>
        <TouchableOpacity
          onPress={() => setFavouritePlaces(true)}
          style={styles.placesFavouriteItemContainer}
        >
          <AntDesign name="hearto" size={20} color={COLORS.purple} />
          <Text style={styles.placesFavouriteItem}>{"  "}Favourite places</Text>
        </TouchableOpacity>
      </View>
    );
  }

  //favourite places section
  function renderFavouritePlacesModal() {
    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={favouritePlaces}
        statusBarTranslucent={true}
        style={styles.innerFavouritePopupModalContainer}
      >
        {/*more option modal content*/}
        <ImageBackground
          source={icons.popupBg}
          style={styles.innerFavouriteModalContainer}
        >
          {/*modal close action section*/}
          <View style={styles.innerFavouriteModalContent}>
            <Pressable onPress={() => setFavouritePlaces(false)}>
              <AntDesign name="close" size={20} color={COLORS.white} />
            </Pressable>
          </View>

          {/*modal header section*/}
          <View style={styles.modalHeaderContainer}>
            <Text style={styles.modalHeaderTextItem}>
              Your favourite places
            </Text>
          </View>

          {/*modal data list: Max of five (5) places*/}
          <View style={styles.favouritePlacesNameContainer}>
            <FlatList
              data={favouritePlacesData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                return (
                  <View style={styles.favouritePlacesNameContent}>
                    <TouchableOpacity
                      key={item.id}
                      onPress={() =>
                        console.log(
                          "set place as drop off, change map reading to match id: ",
                          item.id
                        )
                      }
                      style={styles.favouritePlacesNameTextContainer}
                    >
                      <AntDesign
                        name="hearto"
                        size={20}
                        color={COLORS.purple}
                        style={styles.favouritePlacesHeartIcon}
                      />
                      <Text style={styles.favouritePlacesNameTextItem}>
                        {item.placeName}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
        </ImageBackground>
      </Modal>
    );
  }

  //add places
  function renderPlacesAddSection() {
    return (
      <View style={styles.placesAddInfoContainer}>
        {/*add a place*/}
        <TouchableOpacity
          onPress={() => setAddPlacesModal(true)}
          style={styles.placesAddPopupItemContainer}
        >
          <View style={styles.placesAddButtonContainer}>
            <AntDesign name="plus" size={20} color={COLORS.white} />
          </View>
          <Text style={styles.placesAddTextItem}>{"  "}Add place</Text>
        </TouchableOpacity>
      </View>
    );
  }

  //add favourite place modal section
  function renderAddPlacesModal() {
    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={addPlacesModal}
        statusBarTranslucent={true}
        style={styles.innerAddPopupModalContainer}
      >
        {/*more option modal content*/}
        <ImageBackground
          source={icons.popupBg}
          style={styles.innerAddModalContainer}
        >
          {/*modal close action section*/}
          <View style={styles.innerAddModalContent}>
            <Pressable onPress={() => setAddPlacesModal(false)}>
              <AntDesign name="close" size={20} color={COLORS.white} />
            </Pressable>
          </View>

          {/*modal header section*/}
          <View style={styles.modalAddHeaderContainer}>
            <Text style={styles.modalAddHeaderTextItem}>
              Add a new favourite place
            </Text>
          </View>

          {/*modal data list: Max of five (5) places*/}
          <View style={styles.addPlacesNameContainer}>
            <CustomLocationDriver control={control} name="addPlacesOptions" />
          </View>

          {/*location results*/}
          {watchAddPlacesOptions ? (
            <View style={styles.addFavouriteResultTextItemContainer}>
              <AntDesign
                name="hearto"
                size={20}
                color={COLORS.purple}
                style={styles.favouriteModalIconItem}
              />

              <Text style={styles.addFavouriteResultTextItem}>
                {watchAddPlacesOptions.split("|")[0]}
              </Text>
            </View>
          ) : null}

          {/*add button section*/}
          <Pressable
            onPress={() => {
              console.log("add favourite place to favourites list"),
                setAddPlacesModal(false);
            }}
            style={styles.addFavContainer}
          >
            <View style={styles.addFavGradientContainer}>
              <Text style={styles.addFavTextItem}>
                {isLoading ? (
                  <ActivityIndicator size={30} color={COLORS.white} />
                ) : (
                  "Add place"
                )}
              </Text>
            </View>
          </Pressable>
        </ImageBackground>
      </Modal>
    );
  }

  //location map section
  function renderLocationMapViewSection() {
    const polylineCoordinates = tripLocations?.map((item) => item.location);

    return (
      <View style={styles.mapViewContainer}>
        <MapView
          ref={mapRef}
          initialRegion={mapRegion}
          style={styles.mapViewItem}
          userInterfaceStyle="dark"
        >
          {showLocationPoints()}

          <MapViewDirections
            origin={polylineCoordinates[0]}
            waypoints={
              polylineCoordinates.length > 1 ?
                (
                  polylineCoordinates.length > 1
                    ? polylineCoordinates.slice(1, -1)
                    : polylineCoordinates[polylineCoordinates?.length - 1]
                ) : []
            }
            optimizeWaypoints={true}
            destination={polylineCoordinates[polylineCoordinates?.length - 1]}
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

  //map snapshot section
  function renderSnapshotMapSection() {
    return (
      <TouchableOpacity
        onPress={takeSnapshotAndShare}
        style={styles.mapSnapshotContainer}
      >
        <Text style={styles.mapSnapshotTextItem}>
          <AntDesign name="camera" size={16} color={COLORS.white} />
          {"  "}Take map snapshot and share
        </Text>
      </TouchableOpacity>
    );
  }

  //eta section
  function renderETASection() {
    //round off time
    let time = Math.trunc(tripDuration);
    const hours = Math.floor(time / 60);
    const minutes = time % 60;

    //round off distance
    const roundedTripDistance = Number(tripDistance).toFixed(1);

    return (
      <View style={styles.etaContainer}>
        <Text style={styles.etaTextItem}>
          ETA: {hours > 9 ? "" : "0"}
          {hours}h{minutes}
        </Text>
        <Text style={styles.etaTextItem}>
          Distance: {roundedTripDistance} km
        </Text>
      </View>
    );
  }

  //number of passengers section
  function renderNumberOfPassengerSection() {
    return (
      <View style={styles.noOfPassengersContainer}>
        <View style={styles.noOfPassengerIconContainer}>
          <Feather name="user" size={30} color={COLORS.white} />
        </View>

        {/*value selector item*/}
        <View
          style={[
            styles.passengerItemContainer,
            { left: prevData.carName === "Truck" ? 2 : 10 },
          ]}
        >
          <AntDesign
            onPress={() => setPassengerCount(Math.max(1, passengerCount - 1))}
            name="minus"
            size={18}
            color={COLORS.white}
          />
          <Text style={styles.passengerTextItem}>
            {prevData.carName === "Truck" ? 0 : passengerCount}
          </Text>
          <AntDesign
            onPress={() => {
              if (prevData.carName === "Sedan" && passengerCount < 3) {
                setPassengerCount(passengerCount + 1);
              } else if (prevData.carName === "SUV" && passengerCount < 3) {
                setPassengerCount(passengerCount + 1);
              } else if (prevData.carName === "Coupe" && passengerCount < 1) {
                setPassengerCount(passengerCount + 1);
              } else if (
                prevData.carName === "Convertible" &&
                passengerCount < 1
              ) {
                setPassengerCount(passengerCount);
              } else if (prevData.carName === "Van" && passengerCount < 1) {
                setPassengerCount(passengerCount);
              } else if (prevData.carName === "Minibus" && passengerCount < 9) {
                setPassengerCount(passengerCount + 1);
              } else if (
                prevData.carName === "Sportscar" &&
                passengerCount < 3
              ) {
                setPassengerCount(passengerCount + 1);
              } else if (
                prevData.carName === "Electric Vehicle" &&
                passengerCount < 3
              ) {
                setPassengerCount(passengerCount + 1);
              } else if (passengerCount < 1) {
                setPassengerCount(passengerCount + 1);
              }
            }}
            name="plus"
            size={18}
            color={COLORS.white}
          />
        </View>

        {/*truck message notifier*/}
        {prevData.carName === "Truck" && (
          <View style={styles.truckParcelsMessageContainer}>
            <Text style={styles.truckParcelsTextItem}>
              Parcels only. Please provide more detail before finalizing.
            </Text>
          </View>
        )}
      </View>
    );
  }

  //rate section
  function renderRateSection() {
    return (
      <View style={styles.rateContainer}>
        <Text style={styles.rateHeaderTextItem}>Set your rate</Text>

        {/*rate component section*/}
        <View style={styles.rateComponentContainer}>
          {/*currency dropdown*/}
          <View style={styles.currencyComponentContainer}>
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
                  rules={{ required: "Required" }}
                  textAlign={'center'}
                  iconColor={'purple'}
                />
              </View>
            </View>
          </View>

          {/*rate input*/}
          <View style={styles.rateInputComponentContainer}>
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
          </View>
        </View>
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
                {isLoading ? (
                  <ActivityIndicator size={30} color={COLORS.white} />
                ) : (
                  "Confirm"
                )}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    );
  }

  //screen list section
  function renderScreenContentList() {
    return (
      <>
        {renderHeaderSection()}
        <View style={styles.screenContentContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            style={styles.scrollingSectionContainer}
          >
            {renderHeadingTopSection()}
            {renderPickupLocationInputSection()}
            {renderPlacesInformationSection()}
            {renderFavouritePlacesModal()}
            {renderPlacesAddSection()}
            {renderAddPlacesModal()}
            {renderLocationMapViewSection()}
            {renderSnapshotMapSection()}
            {renderETASection()}
            {renderNumberOfPassengerSection()}
            {renderRateSection()}
            {renderConfirmButtonSection()}
          </ScrollView>
        </View>
      </>
    );
  }

  //screen content list
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

  //pick up location section
  pickupLocationContainer: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  pickupLocationComponentContainer: {
    width: "89%",
    flexDirection: "column",
  },
  pickupLocationComponentItemContainer: {
    width: "100%",
  },
  stopLocationComponentItemContainer: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
  },
  stopCancelIconContainer: {
    left: 15,
    height: 25,
    width: 25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: COLORS.reechGray,
  },
  addStopActionTextContainer: {
    height: 45,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    zIndex: -99,
  },
  addFirstStopActionTextContent: {
    width: Platform.OS === "ios" ? "81%" : "83%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addStopActionTextContent: {
    width: Platform.OS === "ios" ? "84.3%" : "86%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: -99,
  },
  addStopActionText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  pickupLocationStopContainer: {
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  pickLocationButtonContainer: {
    height: 25,
    width: 25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: COLORS.reechGray,
  },

  //places info
  placesInfoContainer: {
    width: "100%",
    marginTop: 15,
    justifyContent: "space-between",
    flexDirection: "column",
    zIndex: -999,
  },
  placesFavouriteItemContainer: {
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  placesFavouriteItem: {
    color: COLORS.purple,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },

  //favourite modal section
  innerFavouritePopupModalContainer: {
    marginTop: 10,
  },
  innerFavouriteModalContainer: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? "140%" : "125%",
    padding: "4%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    backgroundColor: COLORS.black,
  },
  innerFavouriteModalContent: {
    left: Platform.OS === "ios" ? "120%" : "110%",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  modalHeaderContainer: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalHeaderTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  favouritePlacesNameContainer: {
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  favouritePlacesNameContent: {
    flexDirection: "column",
    marginBottom: 20,
  },
  favouritePlacesNameTextContainer: {
    flexDirection: "row",
  },
  favouritePlacesHeartIcon: {
    width: "10%",
  },
  favouritePlacesNameTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    width: "90%",
  },

  //add places
  placesAddInfoContainer: {
    width: "100%",
    marginTop: 15,
    justifyContent: "space-between",
    flexDirection: "column",
    zIndex: -999,
  },
  placesAddPopupItemContainer: {
    width: "34%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  placesAddButtonContainer: {
    height: 25,
    width: 25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: COLORS.reechGray,
  },
  placesAddTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },

  //favourite modal section
  innerAddPopupModalContainer: {
    marginTop: 10,
  },
  innerAddModalContainer: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? "20%" : "25%",
    padding: "4%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    backgroundColor: COLORS.black,
  },
  innerAddModalContent: {
    left: Platform.OS === "ios" ? "45%" : "47.5%",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  modalAddHeaderContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalAddHeaderTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  addPlacesNameContainer: {
    zIndex: 9,
    paddingHorizontal: 0,
    paddingVertical: 20,
  },
  addFavouriteResultTextItemContainer: {
    marginTop: 30,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  favouriteModalIconItem: {
    width: "10%",
  },
  addFavouriteResultTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    width: "90%",
  },
  addFavContainer: {
    marginLeft: "60%",
    marginTop: 40,
  },
  addFavGradientContainer: {
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
  addFavTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },

  //map view container
  mapViewContainer: {
    height: Platform.OS === "ios" ? 350 : 300,
    marginTop: 15,
    overflow: "hidden",
    zIndex: -999,
  },
  mapViewItem: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  mapSnapshotContainer: {
    marginTop: 5,
  },
  mapSnapshotTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //eta section
  etaContainer: {
    marginTop: 20,
    flexDirection: "column",
    width: "100%",
  },
  etaTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    marginBottom: 5,
  },

  //number of passengers section
  noOfPassengersContainer: {
    marginTop: 20,
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  noOfPassengerIconContainer: {
    width: "10%",
    height: 50,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  passengerItemContainer: {
    width: "25%",
    height: Platform.OS === "ios" ? 50 : 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    borderColor: COLORS.darkGray,
    borderWidth: 0.2,
    backgroundColor: COLORS.reechGray,
  },
  passengerTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
    paddingHorizontal: Platform.OS === "ios" ? 15 : 10,
  },
  truckParcelsMessageContainer: {
    width: "60%",
    height: Platform.OS === "ios" ? 50 : 45,
    justifyContent: "center",
    alignItems: "flex-start",
    left: 10,
  },
  truckParcelsTextItem: {
    color: COLORS.darkGray,
    fontSize: 10,
    fontFamily: "PoppinsLight",
  },

  //rate section
  rateContainer: {
    width: "100%",
    flexDirection: "column",
    marginTop: 10,
  },
  rateHeaderTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  rateComponentContainer: {
    marginTop: 15,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  currencyComponentContainer: {
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
  rateCurrencyComponentContainer: {
    width: "75%",
    right: 10,
  },
  rateCurrencyFlagImageItem: {
    width: 30,
    height: 30,
    resizeMode: "cover",
    borderRadius: 30,
    left: 15,
  },
  rateInputComponentContainer: {
    width: "47%",
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

export default DriverAddOpportunityLocationScreen;
