import React, { useState } from "react";
import {
  TextInput,
  Image,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Platform,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";

//customs
import { expressivePlacesData } from "../../../../../assets/data/personalityData/socialData";
import { COLORS, images } from "../../../../../constants";
import { EmptyFlatlistComponent } from "../../../../../components";

const EnergeticPlacesScreen = () => {
  //state handlers
  const [itemCollection, setItemCollection] = useState(expressivePlacesData);
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = () => {
    setItemCollection(itemCollection);
    setIsFetching(false);
  };
  const onRefresh = () => {
    setIsFetching(true);
    fetchData(itemCollection);
  };

  //a method used to filter data according to the place name
  const searchPlaces = (text) => {
    let filteredData = expressivePlacesData.filter(
      (x) =>
        String(x.placeName.toLowerCase()).includes(text.toLowerCase()) ||
        String(x.placeBlurb.toLowerCase()).includes(text.toLowerCase())
    );
    setItemCollection(filteredData);
  };

  return (
    <View style={styles.placesContainer}>
      {/*custom search component*/}
      <View style={styles.innerSearchContainer}>
        <View style={styles.textInputContainer}>
          <View style={styles.inputIconContainer}>
            <TextInput
              onChangeText={(text) => searchPlaces(text)}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Search"
              placeholderTextColor={COLORS.white}
              style={styles.inputEnergy}
              enablesReturnKeyAutomatically
              textAlign="center"
            />
          </View>
          <FontAwesome name="search" size={16} color={COLORS.purple} style={{ top: Platform.OS === "ios" ? 0 : 5 }} />
        </View>
      </View>

      <View style={styles.placesContentContainer}>
        <FlatList
          data={itemCollection}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={onRefresh}
          refreshing={isFetching}
          renderItem={({ item }) => {
            return (
              <>
                <View style={styles.placesContent}>
                  {/*places image item*/}
                  <View style={styles.placeImageContainer}>
                    <ImageBackground
                      source={images.businessFrame}
                      style={styles.gradientColorContainerEnergy}
                    >
                      <Image
                        source={item.placeImage}
                        style={styles.placeImageItem}
                      />
                    </ImageBackground>
                  </View>

                  {/*places text information item*/}
                  <View style={styles.placeTextInfoContainer}>
                    <Text style={styles.placeCompanyNameText}>
                      {item.placeName}
                    </Text>
                    <Text style={styles.placeCompanyInfoText} numberOfLines={3}>
                      {item.placeBlurb}
                    </Text>

                    {/*bubble action section*/}
                    <View style={styles.placesHashTagContainer}>
                      <View style={styles.placesHashTagContainerContent}>
                        {item.placeHashTag.map((hashTagItem, i) => (
                          <View
                            key={i}
                            style={styles.placeHashTagTextItemContainer}
                          >
                            <Text style={styles.placeHashTagTextItem}>
                              {hashTagItem.hashTagText}
                            </Text>
                          </View>
                        ))}
                      </View>

                      <View style={styles.placeAddWishListItemContainer}>
                        <Text
                          onPress={() => console.log("wishlist pressed")}
                          style={[
                            styles.placeAddWishListItem,
                            {
                              color:
                                item.isAddedToWishlist === true
                                  ? COLORS.darkGray
                                  : COLORS.purple,
                            },
                          ]}
                        >
                          {item.isAddedToWishlist === true
                            ? "See wishlist"
                            : "Add to wishlist"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.diverLiner} />
              </>
            );
          }}
          ListFooterComponent={
            <View
              style={{ marginBottom: Platform.OS === "ios" ? "35%" : "42%" }}
            />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ bottom: "10%" }}>
              <EmptyFlatlistComponent />
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  placesContainer: {
    flexDirection: "column",
    minHeight: "64%",
    backgroundColor: COLORS.transparent,
  },

  //search section
  innerSearchContainer: {
    marginTop: 10,
    flexDirection: "column",
    paddingHorizontal: 15,
    backgroundColor: COLORS.transparent,
  },
  textInputContainer: {
    flexDirection: "row",
    paddingVertical: Platform.OS === "ios" ? 10 : 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: COLORS.reechGray,
    marginBottom: 10,
  },
  inputIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "93%",
  },
  inputEnergy: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 14,
    width: "100%",
    alignItems: "center",
  },

  //item collection section
  placesContentContainer: {
    marginBottom: "85%",
  },
  placesContent: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  placeImageContainer: {
    width: "18%",
  },
  gradientColorContainerEnergy: {
    width: Platform.OS === "ios" ? 75 : 60,
    height: Platform.OS === "ios" ? 75 : 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 2,
  },
  placeImageItem: {
    top: 2,
    left: 2,
    width: Platform.OS === "ios" ? 70 : 57,
    height: Platform.OS === "ios" ? 70 : 57,
    resizeMode: "cover",
    borderRadius: 8,
    borderColor: COLORS.black,
    borderWidth: 2,
    backgroundColor: COLORS.black,
  },

  //place text section
  placeTextInfoContainer: {
    width: "82%",
    paddingLeft: 10,
    paddingRight: 15,
  },
  placeCompanyNameText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
    marginBottom: 0,
  },
  placeCompanyInfoText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    marginVertical: 5,
  },
  placesHashTagContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  placesHashTagContainerContent: {
    maxWidth: "65%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  placeHashTagTextItemContainer: {
    marginRight: 10,
  },
  placeHashTagTextItem: {
    opacity: 0.6,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  placeAddWishListItemContainer: {
    width: "35%",
    flexDirection: "column",
  },
  placeAddWishListItem: {
    fontSize: 14,
    fontFamily: "PoppinsBold",
    alignSelf: "flex-end",
  },
  diverLiner: {
    width: "95%",
    alignSelf: "center",
    marginVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.darkGray,
  },
});

export default EnergeticPlacesScreen;
