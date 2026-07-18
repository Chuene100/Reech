import React, { useEffect, useState } from "react";
import { Image, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { FlatList } from "react-native-gesture-handler";

//customs
import { myWebLinksData } from "../../../../assets/data/myLinksData";
import { COLORS, images } from "../../../../constants";
import { EmptyFlatlistComponent } from "../../../../components";
import NavHeader from "@/components/Headers/NavHeader";
import { setUsersImage } from "../../../../redux/features/all-user-image-slice";
import { useReadUserQuery } from "../../../../redux/api/api-slice";

const MyWebLinkScreen = ({ route }) => {
  const dispatch = useDispatch();

  const { userId } = route.params;

  const image = useSelector((state) => state.users_images.usersImages);

  const { data: user } = useReadUserQuery(userId ?? null);

  useEffect(() => { if (user) { !image[user?.profileImage] && _loadImage(user?.profileImage); } }, [user]);

  const _loadImage = async (url) => {
    try {
      if (url) {
        const response = await fetch(url);

        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          dispatch(setUsersImage({ url, data: reader.result }));
        };
      }
    } catch (error) {
      console.error(`Error loading image: ${error}`);
    }
  };

  //state handler
  const [webLinksCollection, setWebLinksCollection] = useState(myWebLinksData);
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = () => {
    setWebLinksCollection(myWebLinksData);
    setIsFetching(false);
  };
  const onRefresh = () => {
    setIsFetching(true);
    fetchData(webLinksCollection);
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.contentContainerWeb}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  //screen header top section
  function renderHeadingTopSection() {
    return (
      <View style={styles.headingContentContainer}>
        <View style={styles.headingTopLinearItem} />

        {/*user image section*/}
        <View style={styles.headingImageItemContainer}>
          <ImageBackground
            source={images.userFrame}
            style={styles.headingImageGradientContainer}
          >
            <Image
              source={
                user?.profileImage
                  ? { uri: image[user?.profileImage] ?? user?.profileImage }
                  : images.defaultRounded
              }
              style={styles.headingImageItem}
            />
          </ImageBackground>
        </View>

        {/*heading section*/}
        <View style={styles.headingTextItemContainer}>
          <Text style={styles.headingTextItem}>My Web Links</Text>
        </View>
      </View>
    );
  }

  //sort and filter section
  function renderSortAndFilterSection() {
    return (
      <View style={styles.sortAndFilterContainer}>
        {/*sort section*/}
        <TouchableOpacity
          onPress={() => console.log("sort option clicked")}
          style={styles.sortContainer}
        >
          <Text style={styles.sortTextItem}>Sort{"     "}</Text>
          <Entypo name="chevron-down" size={24} color={COLORS.white} />
        </TouchableOpacity>

        {/*filter section*/}
        <TouchableOpacity
          onPress={() => console.log("filter option clicked")}
          style={styles.filterContainer}
        >
          <Text style={styles.filterTextItem}>Filter{"     "}</Text>
          <Entypo name="chevron-down" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    );
  }

  //screen web list section
  function renderWebListSection() {
    return (
      <>
        {/*user written heading*/}
        <View style={styles.flatListHeadingTextContainer}>
          <Text style={styles.flatListHeadingTextItem}>{`What I've Written`}</Text>
          <Text
            onPress={() => console.log("see all written pressed")}
            style={styles.flatListSubheadingTextItem}
          >
            See all
          </Text>
        </View>

        {/*user written item list*/}
        <FlatList
          data={webLinksCollection}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={onRefresh}
          refreshing={isFetching}
          renderItem={({ item }) => {
            return (
              <>
                {item.userWritten && (
                  <View style={styles.webCardContainer}>
                    {/*web image section*/}
                    <TouchableOpacity
                      onPress={() => console.log("show web file")}
                      style={styles.webCardImageContainer}
                    >
                      <Image
                        source={
                          item.webLinkImage
                            ? item.webLinkImage
                            : {
                              uri: "https://png.pngitem.com/pimgs/s/288-2881862_banner-of-peace-png-download-visit-our-website.png",
                            }
                        }
                        style={styles.webCardImageItem}
                      />

                      {/*web icon*/}
                      {item.webLinkImage ? (
                        <Image
                          source={images.web}
                          style={styles.webCardIconItem}
                        />
                      ) : null}
                    </TouchableOpacity>

                    {/*web info section*/}
                    <View style={styles.webInfoSectionContainer}>
                      {/*web header section*/}
                      <View style={styles.webHeaderInfoContainer}>
                        <Text
                          numberOfLines={2}
                          style={styles.webHeaderTextItem}
                        >
                          {item.webLinkTitle}
                        </Text>
                      </View>

                      {/*web description section*/}
                      <View style={styles.webDescriptionInfoContainer}>
                        <Text
                          numberOfLines={3}
                          style={styles.webDescriptionTextItem}
                        >
                          {item.webLinkDescription}
                        </Text>
                      </View>

                      {/*relevant profile section*/}
                      <View style={styles.webLinkContainer}>
                        <View style={styles.webLinkHeadingContainer}>
                          <Text
                            numberOfLines={1}
                            style={styles.webLinkHeadingTextItem}
                          >
                            {item.webLinkItem}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </>
            );
          }}
          ListFooterComponent={<View style={{ marginBottom: "0%" }}></View>}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={<EmptyFlatlistComponent />}
        />

        {/*user featured item list*/}
        <View style={styles.flatListHeadingContainer}>
          <Text style={styles.flatListHeadingItem}>Where I am featured</Text>
          <Text
            onPress={() => console.log("see all featured pressed")}
            style={styles.flatListSubheadingItem}
          >
            See all
          </Text>
        </View>

        <FlatList
          data={webLinksCollection}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={onRefresh}
          refreshing={isFetching}
          style={styles.falseUserWrittenContainer}
          renderItem={({ item }) => {
            return (
              <>
                {!item.userWritten && (
                  <View style={styles.webCardContainer}>
                    {/*web image section*/}
                    <TouchableOpacity
                      onPress={() => console.log("show web file")}
                      style={styles.webCardImageContainer}
                    >
                      <Image
                        source={
                          item.webLinkImage
                            ? item.webLinkImage
                            : {
                              uri: "https://png.pngitem.com/pimgs/s/288-2881862_banner-of-peace-png-download-visit-our-website.png",
                            }
                        }
                        style={styles.webCardImageItem}
                      />

                      {/*web icon*/}
                      {item.webLinkImage ? (
                        <Image
                          source={images.web}
                          style={styles.webCardIconItem}
                        />
                      ) : null}
                    </TouchableOpacity>

                    {/*web info section*/}
                    <View style={styles.webInfoSectionContainer}>
                      {/*web header section*/}
                      <View style={styles.webHeaderInfoContainer}>
                        <Text
                          numberOfLines={2}
                          style={styles.webHeaderTextItem}
                        >
                          {item.webLinkTitle}
                        </Text>
                      </View>

                      {/*web description section*/}
                      <View style={styles.webDescriptionInfoContainer}>
                        <Text
                          numberOfLines={3}
                          style={styles.webDescriptionTextItem}
                        >
                          {item.webLinkDescription}
                        </Text>
                      </View>

                      {/*relevant profile section*/}
                      <View style={styles.webLinkContainer}>
                        <View style={styles.webLinkHeadingContainer}>
                          <Text
                            numberOfLines={1}
                            style={styles.webLinkHeadingTextItem}
                          >
                            {item.webLinkItem}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </>
            );
          }}
          ListFooterComponent={<View style={{ marginBottom: "0%" }}></View>}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={<EmptyFlatlistComponent />}
        />
      </>
    );
  }

  //screen content sorting list
  function renderScreenContentList() {
    return (
      <>
        {renderHeaderSection()}
        <View style={styles.screenContentListContainer}>
          {renderHeadingTopSection()}
          {renderSortAndFilterSection()}
          <View style={styles.webItemListContainer}>
            {renderWebListSection()}
          </View>
        </View>
      </>
    );
  }

  return (
    <View style={styles.screenContentContainer}>
      {renderScreenContentList()}
    </View>
  );
};

const styles = StyleSheet.create({
  screenContentContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  contentContainerWeb: {
    marginTop: Platform.OS === "android" ? "0%" : "10%",
  },

  //screen content list
  screenContentListContainer: {
    marginTop: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: "#141414",
  },
  webItemListContainer: {
    height: Platform.OS === "ios" ? "63%" : "61%",
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
    marginBottom: 10,
    borderBottomColor: COLORS.white,
    borderBottomWidth: StyleSheet.hairlineWidth * 3,
  },
  headingImageItemContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "3%",
  },
  headingImageGradientContainer: {
    width: Platform.OS === "ios" ? 110 : 100,
    height: Platform.OS === "ios" ? 110 : 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  headingImageItem: {
    width: Platform.OS === "ios" ? 100 : 90,
    height: Platform.OS === "ios" ? 100 : 90,
    resizeMode: "cover",
    borderRadius: 8,
  },
  headingTextItemContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "6%",
  },
  headingTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //sort and filter section
  sortAndFilterContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 30,
    marginBottom: 15,
    width: "100%",
  },
  sortContainer: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  sortTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  filterContainer: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  filterTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },

  //flatlist heading section
  flatListHeadingTextContainer: {
    marginBottom: 10,
    marginHorizontal: 20,
    justifyContents: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  flatListHeadingTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
    width: "90%",
  },
  flatListSubheadingTextItem: {
    color: COLORS.purple,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  flatListHeadingContainer: {
    marginTop: Platform.OS === "ios" ? 20 : 10,
    marginBottom: Platform.OS === "ios" ? 20 : 10,
    marginHorizontal: 20,
    justifyContents: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  flatListHeadingItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
    width: "90%",
  },
  flatListSubheadingItem: {
    color: COLORS.purple,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  falseUserWrittenContainer: {
    height: 440,
  },

  //web list section
  webCardContainer: {
    width: "95%",
    height: 163,
    marginHorizontal: 12,
    marginBottom: 20,
    borderRadius: 15,
    flexDirection: "row",
    backgroundColor: "#0d0d0d",
  },
  webCardImageContainer: {
    width: "36%",
  },
  webCardImageItem: {
    overflow: "hidden",
    width: "100%",
    height: 160,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
  },
  webCardIconItem: {
    top: -150,
    left: 10,
    width: 30,
    height: 30,
    borderRadius: 30,
  },

  //web info section
  webInfoSectionContainer: {
    width: "64%",
    flexDirection: "column",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  webHeaderInfoContainer: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  webHeaderTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  webDescriptionInfoContainer: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginVertical: 14,
  },
  webDescriptionTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    opacity: 0.5,
  },
  webLinkContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 5,
  },
  webLinkHeadingContainer: {
    width: "90%",
  },
  webLinkHeadingTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
    opacity: 0.2,
  },
});

export default MyWebLinkScreen;
