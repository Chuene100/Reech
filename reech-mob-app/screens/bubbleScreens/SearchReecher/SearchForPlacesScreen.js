import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { TextInput } from "react-native";

//import customs
import { placeResultData } from "../../../assets/data/SearchFor/SearchForData";
import { COLORS, images } from "../../../constants";
import { CustomButton, EmptyFlatlistComponent } from "../../../components";
import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground } from "react-native";

const SearchForPlacesScreen = () => {
  const navigation = useNavigation();

  //state handlers
  const [placesData, setPlacesData] = useState(placeResultData);
  const [isFetching, setIsFetching] = useState(false);

  //a method used to filter data according to the username
  const searchBusiness = (text) => {
    let filteredData = placeResultData.filter(
      (x) =>
        String(x.accountName.toLowerCase()).includes(text.toLowerCase()) ||
        String(x.accountBlurb.toLowerCase()).includes(text.toLowerCase()) ||
        String(x.location.toLowerCase()).includes(text.toLowerCase())
    );
    setPlacesData(filteredData);
  };

  //screen reloader
  const fetchData = () => {
    setPlacesData(placeResultData);
    setIsFetching(false);
  };
  const onRefresh = () => {
    setIsFetching(true);
    fetchData(placesData);
  };

  //search component
  function renderSearchSection() {
    return (
      <View style={styles.searchTextItem}>
        <View style={styles.innerSearchContainer}>
          <View style={styles.textInputContainer}>
            <TextInput
              onChangeText={(text) => searchBusiness(text)}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Search"
              placeholderTextColor={COLORS.white}
              style={styles.inputsSearchPeopleForPlaces}
              enablesReturnKeyAutomatically
              textAlign="center"
            />
          </View>
          <FontAwesome
            name="search"
            size={16}
            color={COLORS.purpleDark}
          />
        </View>
      </View>
    );
  }

  //filter section
  function renderFilterSection() {
    return (
      <>
        <View style={styles.filterSectionContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("SearchPlacesFilterScreen")}
            style={styles.filterTextSectionContainer}
          >
            <Text style={styles.filterTextItem}>Filter</Text>
            <FontAwesome name={"chevron-down"} size={14} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.filterLineDivider} />
      </>
    );
  }

  //people search results
  function renderPeopleResultSection() {
    return (
      <>
        <View style={styles.userVouchListContainer}>
          <View style={styles.userVouchContent}>
            <FlatList
              data={placesData}
              keyExtractor={(item, index) => index.toString()}
              onRefresh={onRefresh}
              refreshing={isFetching}
              renderItem={({ item }) => {
                return (
                  <View style={styles.flatListContainer}>
                    <View style={styles.flatListContent}>
                      <View style={styles.imageItemContainer}>
                        <TouchableOpacity
                          onPress={() =>
                            // navigation.navigate("AccountFullViewScreen")
                            console.log("view business account")
                          }
                        >
                          <ImageBackground
                            source={images.businessFrame}
                            style={styles.gradientColorContainerSearchFor}
                          >
                            <Image
                              source={item.accountProfilePicture}
                              style={styles.imageItem}
                            />
                          </ImageBackground>
                        </TouchableOpacity>

                        {/*vouch user info section*/}
                        <View style={styles.imageTextContainer}>
                          <TouchableOpacity
                            onPress={() =>
                              // navigation.navigate("AccountFullViewScreen")
                              console.log("view business account")
                            }
                          >
                            <Text style={styles.imageTextName}>
                              {item.accountName}
                            </Text>
                          </TouchableOpacity>

                          <Text style={styles.imageLocation}>
                            {item.location}
                          </Text>

                          <Text numberOfLines={2} style={styles.imageTextBlurb}>
                            {item.accountBlurb}
                          </Text>

                          <View style={styles.imageTextButtonContainer}>
                            <Text style={styles.imageText}> </Text>
                            <View style={styles.imageButtonContainer}>
                              <CustomButton
                                text={
                                  item.bubbleMate
                                    ? "Add to wishlist"
                                    : "Added to wishlist"
                                }
                                type={item.bubbleMate ? "BUBBLE" : "MATE"}
                                onPress={() =>
                                  console.log("add bubble mate: " + item.id)
                                }
                              />
                            </View>
                          </View>
                        </View>
                      </View>

                      {/*bubble mate section*/}
                      <View style={styles.userBubbleMatesContainer}>
                        <View style={styles.useBubbleImageContainer}>
                          {item.bubbleMates.map((mateList, i) => (
                            <View key={i} style={styles.imageContainer}>
                              {i < 2 && (
                                <>
                                  {mateList.bubbleMateImage && (
                                    <Image
                                      source={mateList.bubbleMateImage}
                                      style={styles.userBubbleMateImage}
                                    />
                                  )}
                                </>
                              )}
                            </View>
                          ))}

                          {/*plus gradient circle indicator*/}
                          {item.bubbleMates.length >= 3 ? (
                            <View style={styles.plusIconContainer}>
                              <LinearGradient
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                colors={[
                                  COLORS.tealDarker,
                                  COLORS.tealDark,
                                  COLORS.teal,
                                ]}
                                style={styles.gradientContainer}
                              >
                                {/*show appropriate value count*/}
                                {item.bubbleMates.length >= 999 ? (
                                  <Text style={styles.gradientTextItem}>
                                    +999
                                  </Text>
                                ) : (
                                  <Text style={styles.gradientTextItem}>
                                    +{item.bubbleMates.length - 2}
                                  </Text>
                                )}
                              </LinearGradient>
                            </View>
                          ) : null}
                        </View>

                        {item.bubbleMates && (
                          <View style={styles.useBubbleTextContainer}>
                            <Text style={styles.userBubbleCountText}>
                              {item.bubbleMates.length} shared bubble mates
                            </Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.horizontalLine}></View>
                    </View>

                    <View style={styles.flatListBottom}></View>
                  </View>
                );
              }}
              ListFooterComponent={
                <View
                  style={{
                    marginBottom: Platform.OS === "ios" ? "8%" : "20%",
                  }}
                ></View>
              }
              ListEmptyComponent={<EmptyFlatlistComponent />}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderSearchSection()}
      {renderFilterSection()}
      {renderPeopleResultSection()}
    </SafeAreaView>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 0,
    marginBottom: "0%",
    backgroundColor: COLORS.transparent,
  },

  //search section
  searchTextItem: {
    marginTop: 10,
    flexDirection: "column",
    backgroundColor: COLORS.transparent,
  },
  innerSearchContainer: {
    flexDirection: "row",
    paddingVertical: Platform.OS === "ios" ? 10 : 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: COLORS.reechGray,
    marginBottom: 35,
  },
  textInputContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "93%",
  },
  inputsSearchPeopleForPlaces: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 14,
    width: "100%",
    alignItems: "center",
  },

  //filter container
  filterSectionContainer: {
    marginTop: -35,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  filterTextSectionContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  filterTextItem: {
    marginRight: 35,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  filterLineDivider: {
    marginVertical: 10,
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
  },

  //user vouch list section
  userVouchListContainer: {
    maxHeight: 530,
    marginTop: 10,
  },
  userVouchContent: {
    width: "100%",
    flexDirection: "column",
  },

  //flatlist section
  flatListContainer: {
    flex: 1,
  },
  flatListContent: {
    marginTop: 0,
    flexDirection: "column",
  },
  imageItemContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: "2%",
  },
  gradientColorContainerSearchFor: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  imageItem: {
    width: 72,
    height: 72,
    resizeMode: "cover",
    borderRadius: 6,
  },
  imageTextContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    marginLeft: "2%",
    width: "100%",
  },
  imageTextName: {
    width: "75%",
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  imageLocation: {
    width: "80%",
    marginVertical: 4,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  imageTextBlurb: {
    width: Platform.OS === "ios" ? "80%" : "75%",
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    marginBottom: "1%",
  },
  imageTextButtonContainer: {
    backgroundColor: COLORS.transparent,
    flexDirection: "row",
    alignItems: "center",
    height: 25,
    justifyContent: "space-between",
    width: "100%",
  },
  imageText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  imageButtonContainer: {
    width: "50%",
    right: 53,
  },

  //bubble mate section
  userBubbleMatesContainer: {
    bottom: 0,
    flexDirection: "row",
    height: "20%",
  },
  useBubbleImageContainer: {
    width: "35%",
    left: 0,
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: COLORS.transparent,
  },
  imageContainer: {
    maxWidth: 22,
  },
  userBubbleMateImage: {
    width: 30,
    height: 30,
    resizeMode: "cover",
    borderRadius: 50,
  },
  plusIconContainer: {
    top: 0,
  },
  gradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 30,
    width: 30,
  },
  gradientTextItem: {
    color: COLORS.white,
    fontSize: 11,
    fontFamily: "PoppinsLight",
  },
  useBubbleTextContainer: {
    width: "65%",
    right: Platform.OS === "ios" ? 40 : 20,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: COLORS.transparent,
  },
  userBubbleCountText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },

  //bottom liner section
  horizontalLine: {
    marginTop: 5,
    marginVertical: "4%",
    borderBottomColor: COLORS.gray,
    borderBottomWidth: StyleSheet.hairlineWidth * 1,
  },
  flatListBottom: {
    marginBottom: "2.5%",
  },
});

export default SearchForPlacesScreen;
