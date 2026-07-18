import React, { useEffect, useState } from "react";
import { FlatList, Image, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

//customs
import { myLinksPdfData } from "../../../../assets/data/myLinksData";
import { COLORS, images } from "../../../../constants";
import { EmptyFlatlistComponent } from "../../../../components";
import NavHeader from "@/components/Headers/NavHeader";
import { setUsersImage } from "../../../../redux/features/all-user-image-slice";
import { useReadUserQuery } from "../../../../redux/api/api-slice";

const MyPdfLinkScreen = ({ route }) => {
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

  //state handlers
  const [pdfFileCollection, setPdfFileCollection] = useState(myLinksPdfData);
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = () => {
    setPdfFileCollection(myLinksPdfData);
    setIsFetching(false);
  };
  const onRefresh = () => {
    setIsFetching(true);
    fetchData(pdfFileCollection);
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.contentContainerPdf}>
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
          <Text style={styles.headingTextItem}>My PDF Links</Text>
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

  //screen pdf list section
  function renderPDFListSection() {
    return (
      <>
        <FlatList
          data={pdfFileCollection}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={onRefresh}
          refreshing={isFetching}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => console.log("show pdf file")}
                style={styles.pdfCardContainer}
              >
                {/*pdf image section*/}
                <View style={styles.pdfCardImageContainer}>
                  <Image
                    source={
                      item.pdfImage
                        ? item.pdfImage
                        : {
                          uri: "https://cdn-icons-png.flaticon.com/512/4208/4208479.png",
                        }
                    }
                    style={styles.pdfCardImageItem}
                  />

                  {/*pdf icon*/}
                  {item.pdfImage ? (
                    <Image source={images.pdf} style={styles.pdfCardIconItem} />
                  ) : null}
                </View>

                {/*pdf info section*/}
                <View style={styles.pdfInfoSectionContainer}>
                  {/*pdf header section*/}
                  <View style={styles.pdfHeaderInfoContainer}>
                    <Text numberOfLines={2} style={styles.pdfHeaderTextItem}>
                      {item.pdfTitle}
                    </Text>
                  </View>

                  {/*pdf description section*/}
                  <View style={styles.pdfDescriptionInfoContainer}>
                    <Text
                      numberOfLines={2}
                      style={styles.pdfDescriptionTextItem}
                    >
                      {item.pdfDescription}
                    </Text>
                  </View>

                  {/*relevant profile section*/}
                  <View style={styles.relevantProfileContainer}>
                    <View style={styles.relevantProfileHeadingContainer}>
                      <Text style={styles.relevantProfileHeadingTextItem}>
                        Relevant profile:
                      </Text>
                    </View>

                    <LinearGradient
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      colors={[
                        COLORS.purpleDarker,
                        COLORS.purpleDark,
                        COLORS.purple,
                      ]}
                      style={styles.relevantProfileGradientContainer}
                    >
                      <Text
                        numberOfLines={1}
                        style={styles.relevantProfileGradientTextItem}
                      >
                        {item.pdfProfile}
                      </Text>
                    </LinearGradient>
                  </View>
                </View>
              </TouchableOpacity>
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
          <View style={styles.pdfItemListContainer}>
            {renderPDFListSection()}
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
  contentContainerPdf: {
    marginTop: Platform.OS === "android" ? "0%" : "10%",
  },

  //screen content list
  screenContentListContainer: {
    marginTop: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: "#141414",
  },
  pdfItemListContainer: {
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
    marginBottom: "5%",
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

  //pdf list section
  pdfCardContainer: {
    width: "95%",
    height: 163,
    marginHorizontal: 12,
    marginBottom: 20,
    borderRadius: 15,
    flexDirection: "row",
    backgroundColor: "#0d0d0d",
  },
  pdfCardImageContainer: {
    width: "36%",
  },
  pdfCardImageItem: {
    overflow: "hidden",
    width: "100%",
    height: 160,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
  },
  pdfCardIconItem: {
    top: -150,
    left: 10,
    width: 30,
    height: 30,
    borderRadius: 30,
  },

  //pdf info section
  pdfInfoSectionContainer: {
    width: "64%",
    flexDirection: "column",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  pdfHeaderInfoContainer: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  pdfHeaderTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  pdfDescriptionInfoContainer: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginVertical: 14,
  },
  pdfDescriptionTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    opacity: 0.5,
  },
  relevantProfileContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  relevantProfileHeadingContainer: {
    width: "45%",
  },
  relevantProfileHeadingTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },
  relevantProfileGradientContainer: {
    width: "53%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  relevantProfileGradientTextItem: {
    textAlign: "center",
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
    width: "95%",
  },
});

export default MyPdfLinkScreen;
