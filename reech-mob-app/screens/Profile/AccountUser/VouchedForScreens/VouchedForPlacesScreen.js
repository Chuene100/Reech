import React, { useState } from "react";
import { Image, TouchableOpacity, StyleSheet, View, Text, Platform, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { TextInput } from "react-native";
import { FlatList } from "react-native-gesture-handler";

//import customs
import { vouchUserPlacesData } from "../../../../assets/data/VouchForData";
import { COLORS, images } from "../../../../constants";
import { CustomButton, EmptyFlatlistComponent } from "../../../../components";

const VouchedForPlacesScreen = () => {
  const navigation = useNavigation();

  //state handler
  const [vouchData, setVouchData] = useState(vouchUserPlacesData);
  const [isFetching, setIsFetching] = useState(false);

  //a method used to filter data according to the username
  const searchBusiness = (text) => {
    let filteredData = vouchUserPlacesData.filter(
      (x) =>
        String(x.accountName.toLowerCase()).includes(text.toLowerCase()) ||
        String(x.accountBlurb.toLowerCase()).includes(text.toLowerCase()) ||
        String(x.vouchMessage.toLowerCase()).includes(text.toLowerCase()) ||
        String(x.action.toLowerCase()).includes(text.toLowerCase())
    );
    setVouchData(filteredData);
  };

  const fetchData = () => {
    setVouchData(vouchUserPlacesData);
    setIsFetching(false);
  };
  const onRefresh = () => {
    setIsFetching(true);
    fetchData(vouchData);
  };

  function renderSearchAndFilterSection() {
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
              style={styles.inputFilterVouchedPlaces}
              enablesReturnKeyAutomatically
              textAlign="center"
            />
          </View>
          <FontAwesome name="search" size={16} color={COLORS.purple} style={{ top: Platform.OS === "ios" ? 0 : 5 }} />
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
            onPress={() => navigation.navigate("VouchedForFIlterScreen")}
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

  function renderUserVouchListSection() {
    return (
      <>
        <View style={styles.userVouchListContainer}>
          <View style={styles.userVouchContent}>
            <FlatList
              data={vouchData}
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
                            console.log(
                              "view business account screen: " + item.id
                            )
                          }
                        >
                          <ImageBackground
                            source={images.businessFrame}
                            style={styles.gradientColorContainerPlacesVouched}
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
                              console.log(
                                "view business account screen: " + item.id
                              )
                            }
                          >
                            <Text style={styles.imageTextName}>
                              {item.accountName}
                            </Text>
                          </TouchableOpacity>

                          <Text numberOfLines={2} style={styles.imageTextBlurb}>
                            {item.accountBlurb}
                          </Text>

                          <View style={styles.imageTextButtonContainer}>
                            <Text style={styles.imageText}>
                              {item.vouchDate}
                            </Text>
                            <View style={styles.imageButtonContainer}>
                              <CustomButton
                                text="Add to wishlist"
                                type="BUBBLE"
                                onPress={() =>
                                  console.log("add to wishlist: " + item.id)
                                }
                              />
                            </View>
                          </View>
                        </View>
                      </View>

                      {/*vouch message section*/}
                      <View style={styles.vouchMessageContainer}>
                        <Text style={styles.vouchMessage}>
                          {item.vouchMessage}
                        </Text>
                      </View>

                      {/*vouch image section*/}
                      {item.vouchImage && (
                        <View style={styles.vouchImageContainer}>
                          <Image
                            source={item.vouchImage}
                            style={styles.vouchImageAttachmentItem}
                          />
                        </View>
                      )}
                      <View style={styles.horizontalLine} />
                    </View>

                    <View style={styles.flatListBottom} />
                  </View>
                );
              }}
              ListFooterComponent={
                <View style={{ marginBottom: Platform.OS === "ios" ? "0%" : "35%" }} />
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
    <View style={styles.contentContainerScreen}>
      {renderSearchAndFilterSection()}
      {renderFilterSection()}
      {renderUserVouchListSection()}
    </View>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  contentContainerScreen: {
    flex: 1,
    flexDirection: "column",
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
    marginBottom: 10,
  },
  textInputContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "93%",
  },
  inputFilterVouchedPlaces: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 14,
    width: "100%",
    alignItems: "center",
  },

  //filter container
  filterSectionContainer: {
    height: 40,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  filterTextSectionContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  filterTextItem: {
    marginRight: 30,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  filterLineDivider: {
    width: "95%",
    alignSelf: "center",
    marginVertical: 5,
    marginBottom: 15,
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
  },

  //user vouch list section
  userVouchListContainer: {
    maxHeight: 590,
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
    flexDirection: "column",
  },
  imageItemContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: "2%",
  },
  gradientColorContainerPlacesVouched: {
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
    marginLeft: "3%",
    width: "100%",
  },
  imageTextName: {
    width: "80%",
    marginBottom: "1%",
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  imageTextBlurb: {
    width: Platform.OS === "ios" ? "80%" : "75%",
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    marginBottom: 2,
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
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  imageButtonContainer: {
    width: "50%",
    right: 50,
  },
  vouchMessageContainer: {
    marginTop: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  vouchMessage: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  vouchImageContainer: {
    width: "100%",
    marginTop: "3%",
  },
  vouchImageAttachmentItem: {
    width: "100%",
    height: 360,
    resizeMode: "cover",
    borderRadius: 10,
  },

  horizontalLine: {
    marginVertical: "5%",
    borderBottomColor: COLORS.gray,
    borderBottomWidth: StyleSheet.hairlineWidth * 1,
  },
  flatListBottom: {
    marginBottom: "2.5%",
  },
});

export default VouchedForPlacesScreen;
