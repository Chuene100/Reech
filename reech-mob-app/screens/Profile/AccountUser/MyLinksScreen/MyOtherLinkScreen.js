import React, { useEffect, useState } from "react";
import { FlatList, Image, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

//customs
import { myOtherLinksData } from "../../../../assets/data/myLinksData";
import { COLORS, images } from "../../../../constants";
import NavHeader from "@/components/Headers/NavHeader";
import { setUsersImage } from "../../../../redux/features/all-user-image-slice";
import { useReadUserQuery } from "../../../../redux/api/api-slice";

const MyOtherLinkScreen = ({ route }) => {
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
  const [otherLinksCollection, setOtherLinksCollection] = useState(myOtherLinksData);
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = () => {
    setOtherLinksCollection(myOtherLinksData);
    setIsFetching(false);
  };
  const onRefresh = () => {
    setIsFetching(true);
    fetchData(otherLinksCollection);
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.contentContainerLinks}>
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
          <Text style={styles.headingTextItem}>My Other Links</Text>
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

  //screen other links list section
  function renderOtherLinksListSection() {
    return (
      <View style={styles.linksItemContainer}>
        <FlatList
          data={otherLinksCollection}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={onRefresh}
          refreshing={isFetching}
          numColumns={3}
          columnWrapperStyle={styles.flatListColumnWrapperContainer}
          contentContainerStyle={styles.flatListContentContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <View style={styles.flatListItemContainer}>
                <TouchableOpacity
                  onPress={() =>
                    console.log(`${item.otherLinkTitle}`, "pressed")
                  }
                  style={styles.linkImageItemContentContainer}
                >
                  <View style={styles.linkImageItemContainer}>
                    <Image
                      source={item.otherLinkImage}
                      style={styles.linkImageItem}
                    />
                  </View>

                  <View style={styles.linkTextContainer}>
                    <Text style={styles.linkTextItem}>
                      {item.otherLinkTitle}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
    );
  }

  function renderScreenContentList() {
    return (
      <>
        {renderHeaderSection()}
        <View style={styles.screenContentListContainer}>
          {renderHeadingTopSection()}
          {renderSortAndFilterSection()}
          <View style={styles.otherItemListContainer}>
            {renderOtherLinksListSection()}
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
  contentContainerLinks: {
    marginTop: Platform.OS === "android" ? "0%" : "10%",
  },

  //screen content list
  screenContentListContainer: {
    marginTop: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: "#141414",
  },
  otherItemListContainer: {
    height: Platform.OS === "ios" ? "64%" : "61%",
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
  headingImageItemContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
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
    marginBottom: 20,
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
    marginBottom: 10,
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

  //flat list content section
  linksItemContainer: {
    marginHorizontal: 15,
  },
  flatListColumnWrapperContainer: {
    width: "98%",
  },
  flatListContentContainer: {
    flexDirection: "column",
  },
  flatListItemContainer: {
    width: "35%",
    height: 150,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  linkImageItemContentContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  linkImageItemContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  linkImageItem: {
    width: 90,
    height: 90,
    resizeMode: "cover",
  },
  linkTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  linkTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
});

export default MyOtherLinkScreen;
