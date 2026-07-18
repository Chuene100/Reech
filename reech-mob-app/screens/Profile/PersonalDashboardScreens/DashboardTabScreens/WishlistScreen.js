import React, { useState } from "react";
import { FlatList, Image, TouchableOpacity, StyleSheet, View, Text, Platform, TextInput, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

//import customs
import { wishListData } from "../../../../assets/data/VouchForData";
import { COLORS, images } from "../../../../constants";
import { CustomButton, EmptyFlatlistComponent } from "../../../../components";
import NavHeader from "@/components/Headers/NavHeader";

const WishlistScreen = () => {
  const navigation = useNavigation();

  //state handlers
  const [vouchData, setVouchData] = useState(wishListData);
  const [isFetching, setIsFetching] = useState(false);

  //a method used to filter data according to the username
  const searchBusiness = (text) => {
    let filteredData = wishListData.filter(
      (x) =>
        String(x.accountName.toLowerCase()).includes(text.toLowerCase()) ||
        String(x.vouchDate.toLowerCase()).includes(text.toLowerCase()) ||
        String(x.accountBlurb.toLowerCase()).includes(text.toLowerCase())
    );
    setVouchData(filteredData);
  };

  const fetchData = () => {
    setVouchData(wishListData);
    setIsFetching(false);
  };
  const onRefresh = () => {
    setIsFetching(true);
    fetchData(vouchData);
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

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
              style={styles.inputScreenWish}
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
            onPress={() => navigation.navigate("WishlistFilterScreen")}
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

  function renderMiddleSection() {
    return (
      <View style={styles.middleSectionContainer}>
        <View style={styles.middleSectionContent}>
          <FlatList
            data={vouchData}
            keyExtractor={(item, index) => index.toString()}
            onRefresh={onRefresh}
            refreshing={isFetching}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <View style={styles.flatListContainer}>
                  <View style={styles.flatListContent}>
                    <View style={styles.imageItemContainer}>
                      {/*wishlist image item*/}
                      <TouchableOpacity
                        onPress={() =>
                          console.log(
                            "view business account screen: " + item.id
                          )
                        }
                        style={styles.imageItemContent}
                      >
                        <ImageBackground
                          source={images.businessFrame}
                          style={styles.gradientColorContainerWish}
                        >
                          <Image
                            source={item.accountProfilePicture}
                            style={styles.imageItem}
                          />
                        </ImageBackground>
                      </TouchableOpacity>

                      {/*wishlist content info section*/}
                      <View style={styles.imageTextContainer}>
                        <TouchableOpacity
                          onPress={() => console.log("view business account screen: " + item.id)}
                        >
                          <Text numberOfLines={1} style={styles.imageTextName}>
                            {item.accountName}
                          </Text>
                        </TouchableOpacity>

                        <Text numberOfLines={3} style={styles.imageTextBlurb}>
                          {item.accountBlurb}
                        </Text>

                        <View style={styles.imageTextButtonContainer}>
                          <Text style={styles.imageText}>{item.vouchDate}</Text>

                          <View style={styles.imageButtonContainer}>
                            <CustomButton
                              text="Remove"
                              type="BUBBLE"
                              onPress={() =>
                                console.log("remove wishlist item: " + item.id)
                              }
                            />
                          </View>
                        </View>
                      </View>
                    </View>

                    <View style={styles.horizontalLine}></View>
                  </View>

                  <View style={styles.flatListBottom}></View>
                </View>
              );
            }}
            ListEmptyComponent={<EmptyFlatlistComponent />}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeaderSection()}
      {renderSearchSection()}
      {renderFilterSection()}
      {renderMiddleSection()}
    </View>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerContainer: {
    zIndex: 99,
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  //search section
  searchTextItem: {
    marginTop: Platform.OS === "ios" ? 30 : 20,
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
  inputScreenWish: {
    width: "100%",
    alignItems: "center",
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //filter container
  filterSectionContainer: {
    height: 40,
    marginHorizontal: 30,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  filterTextSectionContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  filterTextItem: {
    marginRight: 25,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  filterLineDivider: {
    width: "95%",
    alignSelf: "center",
    marginVertical: 10,
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
  },

  //middle screen section
  middleSectionContainer: {
    flex: 1,
  },
  middleSectionContent: {
    marginHorizontal: 6,
    flexDirection: "column",
  },
  imageItemContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  imageItemContent: {
    width: "20%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  gradientColorContainerWish: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  imageItem: {
    width: 62,
    height: 62,
    resizeMode: "cover",
    borderRadius: 6,
  },
  imageTextContainer: {
    width: "75%",
    flexDirection: "column",
    justifyContent: "flex-start",
    marginLeft: Platform.OS === "ios" ? 0 : 10,
  },
  imageTextName: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  imageTextBlurb: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  imageTextButtonContainer: {
    height: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  imageButtonContainer: {
    width: "25%",
    alignItems: "flex-end",
  },

  horizontalLine: {
    marginVertical: "5%",
    borderBottomColor: COLORS.gray,
    borderBottomWidth: StyleSheet.hairlineWidth * 1,
  },
  flatListBottom: {
    marginBottom: Platform.OS === "ios" ? "2.5%" : "0%",
  },
});

export default WishlistScreen;
