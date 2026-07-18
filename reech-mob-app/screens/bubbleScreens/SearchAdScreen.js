import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ImageBackground,
  FlatList,
  Pressable,
  Platform,
} from "react-native";
import { useForm } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import Modal from "react-native-modal";
import { AntDesign, Ionicons, Feather, MaterialIcons, Entypo } from "@expo/vector-icons";

//import customs
import { searchAdData } from "../../assets/data/searchAdData";
import { COLORS, icons, images } from "../../constants";
import { EmptyFlatlistComponent } from "../../components";
import NavHeader from "@/components/Headers/NavHeader";

const SearchAdScreen = () => {
  const { value } = useForm();

  //state handlers
  const [adItems, setAdItems] = useState(searchAdData);
  const [filterModal, setFilterModal] = useState(false);
  const [sortByPrice, setSortByPrice] = useState(false);

  //search function
  const searchCompany = (text) => {
    let filteredData = searchAdData.filter(
      (x) =>
        String(x.companyName.toLowerCase()).includes(text.toLowerCase()) ||
        String(x.companyLocation.toLowerCase()).includes(text.toLowerCase()) ||
        String(x.companyAdProductName.toLowerCase()).includes(
          text.toLowerCase()
        ) ||
        String(x.companyAdPrice.toLowerCase()).includes(text.toLowerCase())
    );
    setAdItems(filteredData);
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  //screen title section
  function renderTitleSection() {
    return (
      <View style={styles.titleSectionContainer}>
        <View style={styles.titleSectionContent}>
          <View style={styles.titleImageContainer}>
            <Image
              source={icons.searchVideoIcon}
              style={styles.titleImageItem}
            />
          </View>

          <View style={styles.titleTextContainer}>
            <Text style={styles.titleTextItem}>Search Ad</Text>
          </View>
        </View>
      </View>
    );
  }

  //search section
  function renderSearchSection() {
    return (
      <View style={styles.innerSearchContainer}>
        <View style={styles.innerSearchContent}>
          <View style={styles.iconContainer}>
            <TextInput
              value={value}
              onChangeText={(text) => searchCompany(text)}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Search"
              placeholderTextColor={COLORS.white}
              style={styles.inputsAd}
              enablesReturnKeyAutomatically
              textAlign="center"
            />
          </View>
          <Ionicons name="ios-search" size={18} color={COLORS.purpleDark} style={{ top: Platform.OS === "ios" ? 0 : 5 }} />
        </View>
      </View>
    );
  }

  //filter section
  function renderFilterSection() {
    return (
      <View style={styles.filterSectionContainer}>
        <TouchableOpacity
          onPress={() => setFilterModal(true)}
          style={styles.filterSectionContent}
        >
          <Text style={styles.filterTextItem}>Filter</Text>
          <Feather name="chevron-down" size={24} color={COLORS.white} />
        </TouchableOpacity>

        <View style={styles.linearStyle} />
      </View>
    );
  }

  function renderFilterModalSection() {
    return (
      <Modal
        visible={filterModal}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        style={styles.adModalContainer}
      >
        <View style={styles.innerAdModalContainer}>
          {/*top action section*/}
          <View style={styles.innerAdModalHeader}>
            <Pressable onPress={() => setFilterModal(false)}>
              <AntDesign name="close" size={18} color={COLORS.white} />
            </Pressable>
          </View>

          {/*option to ad content*/}
          <View style={styles.adModalActionContainer}>
            {/*ad location filter*/}
            <Pressable
              onPress={() => [
                console.log("filter ads by location"),
                setFilterModal(false),
              ]}
              style={styles.adModalActionContent}
            >
              <Ionicons
                name="md-location-outline"
                size={24}
                color={COLORS.purple}
              />
              <View style={styles.adModalActionTextContainer}>
                <Text style={styles.adModalActionTextItem}>Location</Text>
                <Text style={styles.adModalActionSubTextItem}>
                  Filter ads by location
                </Text>
              </View>
            </Pressable>

            {/*ad price filter*/}
            <Pressable
              onPress={() => {
                setSortByPrice(!sortByPrice);
                setFilterModal(false);
              }}
              style={styles.adModalActionContent}
            >
              <Entypo name="price-tag" size={24} color={COLORS.purple} />
              <View style={styles.adModalActionTextContainer}>
                <Text style={styles.adModalActionTextItem}>Price</Text>
                <Text style={styles.adModalActionSubTextItem}>
                  {sortByPrice ? "Show as updated" : "Low to High"}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  //search results section
  function renderSearchResultListSection() {
    // Function to format the money with commas
    function formatMoney(value) {
      if (value >= 1000000) {
        // If value is greater than or equal to 1 million, format with "M"
        return `${(value / 1000000).toFixed(0)}m`;
      } else {
        // Otherwise, format with commas
        return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
      }
    }

    // Sort the data by price if sortByPrice is true
    const sortedAdItems = sortByPrice
      ? [...adItems].sort((a, b) => {
        const priceA = parseFloat(a.companyAdPrice);
        const priceB = parseFloat(b.companyAdPrice);
        return priceA - priceB;
      })
      : adItems;

    return (
      <View style={styles.searchResultContentContainer}>
        <FlatList
          data={sortedAdItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.searchResultContentItemContainer}>
                <View style={styles.searchResultContentItemContent}>
                  {/*top search company ad section*/}
                  <View style={styles.searchResultTopAdContainer}>
                    {/*company image section*/}
                    <View style={styles.searchResultTopAdImageContainer}>
                      <ImageBackground
                        source={images.businessFrame}
                        style={styles.searchResultTopAdImageItem}
                      >
                        <Image
                          source={item.companyLogoImage}
                          style={styles.searchResultTopAdCompanyImageItem}
                        />
                      </ImageBackground>
                    </View>

                    {/*company description section*/}
                    <View style={styles.searchResultTopAdTextContainer}>
                      {/*company name item*/}
                      <View style={styles.searchResultTopAdCompanyNameTextContainer}>
                        <Text numberOfLines={1} style={styles.searchResultTopAdCompanyNameTextItem}>
                          {item.companyName}
                        </Text>
                      </View>

                      {/*company location & timestamp item*/}
                      <View style={styles.searchResultTopAdCompanyLocAndTimeTextContainer}>
                        {/*company location item*/}
                        <View style={styles.searchResultTopAdCompanyLocTextContainer}>
                          <Ionicons
                            name="md-location-outline"
                            size={16}
                            color={COLORS.darkGray}
                          />
                          <Text style={styles.searchResultTopAdCompanyLocTextItem}>
                            {item.companyLocation}
                          </Text>
                        </View>

                        {/*company timestamp item*/}
                        <View style={styles.searchResultTopAdCompanyLocTextContainer}>
                          <Ionicons name="ios-time-outline" size={Platform.OS === "ios" ? 15 : 16} color={COLORS.darkGray} />
                          <Text style={styles.searchResultTopAdCompanyLocTextItem}>
                            {item.adCreatedAt}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/*bottom search company content section*/}
                  <View style={styles.searchResultCompanyBottomContentContainer}>
                    <ImageBackground
                      source={item.companyAdPicture}
                      style={styles.searchResultCompanyImageBackgroundContainer}
                    >
                      {/*top ad company image and price content*/}
                      <View style={styles.searchResultCompanyAdImageContentContainer}>
                        {/*top ad company image content*/}
                        <View style={styles.searchResultCompanyAdImageContent}>
                          <ImageBackground
                            source={images.businessFrame}
                            style={styles.searchResultCompanyAdImageBG}
                          >
                            <Image
                              source={item.companyLogoImage}
                              style={styles.searchResultCompanyAdImageItem}
                            />
                          </ImageBackground>
                        </View>

                        {/*top ad company text content*/}
                        <View style={styles.searchResultCompanyAdTextContent}>
                          <View style={styles.searchResultCompanyAdTextContentContainer}>
                            <Text style={styles.searchResultCompanyAdTextContentItem}>
                              {item.companyAdCurrency}{formatMoney(Number(item.companyAdPrice))}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/*bottom ad company details content*/}
                      <LinearGradient
                        style={styles.searchResultCompanyAdGradientContentContainer}
                        colors={[COLORS.teal, COLORS.transparent, COLORS.teal]}
                        start={{ x: 0.99, y: 0.0 }}
                        end={{ x: 0.01, y: 0.0 }}
                      >
                        <View style={styles.searchResultCompanyAdGradientContainerContent}>
                          {/*product name and more info section*/}
                          <View style={styles.searchResultCompanyAdGradientNameContainer}>
                            {/*product name section*/}
                            <View style={styles.searchResultCompanyAdNameContainer}>
                              <Text numberOfLines={1} style={styles.searchResultCompanyAdNameTextItem}>
                                {item.companyAdProductName}
                              </Text>
                            </View>

                            {/*product info section*/}
                            <TouchableOpacity
                              onPress={() => console.log("show more info about ad")}
                              style={styles.searchResultCompanyAdIconContainer}
                            >
                              <MaterialIcons
                                name="info"
                                size={24}
                                color={COLORS.white}
                              />
                            </TouchableOpacity>
                          </View>

                          {/*product price section*/}
                          <View style={styles.searchResultCompanyAdOtherContainer}>
                            <Text style={styles.searchResultCompanyAdOtherTextItem}>
                              {item.companyAdCurrency}{formatMoney(Number(item.companyAdPrice))}
                            </Text>
                          </View>

                          {/*product location section*/}
                          <View style={styles.searchResultCompanyAdOtherContainer}>
                            <Text style={styles.searchResultCompanyAdOtherTextItem}>
                              {item.companyLocation}
                            </Text>
                          </View>
                        </View>
                      </LinearGradient>
                    </ImageBackground>
                  </View>
                </View>
              </View>
            )
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyListComponentContainer}>
              <EmptyFlatlistComponent />
            </View>
          }
        />
      </View>
    );
  }

  //screen list items
  function renderScreenListItems() {
    return (
      <>
        {renderHeaderSection()}
        {renderTitleSection()}
        {renderSearchSection()}
        {renderFilterSection()}
        {renderFilterModalSection()}
        {renderSearchResultListSection()}
      </>
    );
  }

  //render screen content
  return <View style={styles.container}>{renderScreenListItems()}</View>;
};

//custom styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //header section
  headerContainer: {
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  //title section
  titleSectionContainer: {
    marginTop: 10,
    height: 60,
  },
  titleSectionContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  titleImageContainer: {
    marginHorizontal: 5,
  },
  titleImageItem: {
    width: 60,
    height: 60,
    resizeMode: "cover",
  },
  titleTextContainer: {
    top: 5,
    marginHorizontal: 5,
  },
  titleTextItem: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "PoppinsLight",
  },

  //search section
  innerSearchContainer: {
    marginTop: 15,
    flexDirection: "column",
    backgroundColor: COLORS.transparent,
  },
  innerSearchContent: {
    flexDirection: "row",
    paddingVertical: Platform.OS === "ios" ? 8 : 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: COLORS.reechGray,
    marginBottom: 10,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "93%",
  },
  inputsAd: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 14,
    width: "100%",
    alignItems: "center",
  },

  //filter section
  filterSectionContainer: {
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  filterSectionContent: {
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
  filterTextItem: {
    marginRight: 20,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  linearStyle: {
    width: "100%",
    marginTop: 10,
    alignSelf: "center",
    borderBottomColor: COLORS.reechGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 5,
  },

  //ad filter modal
  adModalContainer: {
    width: "100%",
    right: "5%",
  },
  innerAdModalContainer: {
    marginTop: "177%",
    padding: 15,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    backgroundColor: COLORS.black,
  },
  innerAdModalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  adModalActionContainer: {
    flexDirection: "column",
  },
  adModalActionContent: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 20,
  },
  adModalActionTextContainer: {
    flexDirection: "column",
    marginLeft: 14,
  },
  adModalActionTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  adModalActionSubTextItem: {
    color: COLORS.darkGray,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //search result list section
  searchResultContentContainer: {
    height: Platform.OS === "ios" ? "68%" : "70%",
    flexDirection: "column",
  },
  searchResultContentItemContainer: {
    flexDirection: "column",
    marginBottom: 30,
  },
  searchResultContentItemContent: {
    paddingVertical: 2,
    flexDirection: "column",
    marginBottom: 20,
  },
  searchResultTopAdContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchResultTopAdImageContainer: {
    width: Platform.OS === "ios" ? "20%" : "22%",
  },
  searchResultTopAdImageItem: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  searchResultTopAdCompanyImageItem: {
    width: 72,
    height: 72,
    resizeMode: "cover",
    borderRadius: 6,
  },

  //search ad content section
  searchResultTopAdTextContainer: {
    width: Platform.OS === "ios" ? "80%" : "78%",
    paddingHorizontal: 15,
    flexDirection: "column",
    justifyContent: "center",
  },
  searchResultTopAdCompanyNameTextContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  searchResultTopAdCompanyNameTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  searchResultTopAdCompanyLocAndTimeTextContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  searchResultTopAdCompanyLocTextContainer: {
    left: -5,
    marginVertical: 3,
    flexDirection: "row",
  },
  searchResultTopAdIconItem: {
    width: 16,
    height: 16,
  },
  searchResultTopAdCompanyLocTextItem: {
    marginLeft: 5,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //search bottom result content section
  searchResultCompanyBottomContentContainer: {
    marginTop: 25,
    flexDirection: "column",
  },
  searchResultCompanyImageBackgroundContainer: {
    width: "100%",
    minHeight: 350,
    resizeMode: "cover",
    borderRadius: 20,
    overflow: "hidden",
  },
  searchResultCompanyAdImageContentContainer: {
    width: "100%",
    marginTop: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchResultCompanyAdImageContent: {
    width: "50%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  searchResultCompanyAdImageBG: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  searchResultCompanyAdImageItem: {
    width: 62,
    height: 62,
    resizeMode: "cover",
    borderRadius: 6,
  },
  searchResultCompanyAdTextContent: {
    width: "50%",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  searchResultCompanyAdTextContentContainer: {
    width: 90,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: COLORS.teal,
  },
  searchResultCompanyAdTextContentItem: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "PoppinsBold",
  },

  //ad gradient section
  searchResultCompanyAdGradientContentContainer: {
    marginTop: 160,
    minHeight: 85,
    flexDirection: "column",
  },
  searchResultCompanyAdGradientContainerContent: {
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  searchResultCompanyAdGradientNameContainer: {
    flexDirection: "row",
  },
  searchResultCompanyAdNameContainer: {
    width: "80%",
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  searchResultCompanyAdNameTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  searchResultCompanyAdIconContainer: {
    width: "20%",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  searchResultCompanyAdOtherContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  searchResultCompanyAdOtherTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //empty search - can't happen section
  emptyListComponentContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SearchAdScreen;
