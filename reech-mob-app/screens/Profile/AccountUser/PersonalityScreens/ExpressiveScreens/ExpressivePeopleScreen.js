import React, { useState } from "react";
import {
  TextInput,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";

//customs
import { expressivePeopleData } from "../../../../../assets/data/personalityData/socialData";
import { COLORS, images } from "../../../../../constants";
import { EmptyFlatlistComponent } from "../../../../../components";

const ExpressivePeopleScreen = () => {
  //reloader
  const [itemCollection, setItemCollection] = useState(expressivePeopleData);
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = () => {
    setItemCollection(itemCollection);
    setIsFetching(false);
  };
  const onRefresh = () => {
    setIsFetching(true);
    fetchData(itemCollection);
  };

  //a method used to filter data according to the username
  const searchUser = (text) => {
    let filteredData = expressivePeopleData.filter((x) =>
      String(x.username.toLowerCase()).includes(
        text.toLowerCase() ||
        String(x.userBlurb.toLowerCase()).includes(text.toLowerCase())
      )
    );
    setItemCollection(filteredData);
  };

  return (
    <View style={styles.peopleContainer}>
      {/*custom search component*/}
      <View style={styles.innerSearchContainer}>
        <View style={styles.textInputContainer}>
          <View style={styles.inputIconContainer}>
            <TextInput
              onChangeText={(text) => searchUser(text)}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Search"
              placeholderTextColor={COLORS.white}
              style={styles.inputEx}
              enablesReturnKeyAutomatically
              textAlign="center"
            />
          </View>
          <FontAwesome name="search" size={16} color={COLORS.purple} style={{ top: Platform.OS === "ios" ? 0 : 5 }} />
        </View>
      </View>

      <View style={styles.peopleContentContainer}>
        <FlatList
          data={itemCollection}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={onRefresh}
          refreshing={isFetching}
          renderItem={({ item }) => {
            return (
              <View>
                <View style={styles.peopleContent}>
                  {/*people image item*/}
                  <View style={styles.personImageContainer}>
                    <ImageBackground
                      source={images.userFrame}
                      style={styles.personImageItemContainer}
                    >
                      <Image
                        source={item.userImage}
                        style={styles.personImageItem}
                      />
                    </ImageBackground>
                  </View>

                  {/*people text information item*/}
                  <View style={styles.personTextInfoContainer}>
                    <Text style={styles.personCompanyNameText}>
                      {item.username}
                    </Text>
                    <Text
                      style={styles.personCompanyInfoText}
                      numberOfLines={3}
                    >
                      {item.userBlurb}
                    </Text>

                    {/*bubble action section*/}
                    <View style={styles.peopleHashTagContainer}>
                      <View style={styles.personHashTagTextContainers}>
                        {item.userHashTag.map((hashTagItem, i) => (
                          <View
                            key={i}
                            style={styles.personHashTagTextItemContainer}
                          >
                            <Text style={styles.personHashTagTextItem}>
                              {hashTagItem.hashTagText}
                            </Text>
                          </View>
                        ))}
                      </View>

                      {/*bubble action section*/}
                      <View style={styles.personAddWishListItemContainer}>
                        <Text
                          onPress={() => console.log("bubble mate pressed")}
                          style={[
                            styles.personAddWishListItem,
                            {
                              color:
                                item.isBubbleMate === true
                                  ? COLORS.darkGray
                                  : COLORS.purple,
                            },
                          ]}
                        >
                          {item.isBubbleMate === true
                            ? "Bubble mate"
                            : "Add to bubble"}
                        </Text>
                      </View>
                    </View>

                    {/* shared bubble mate section*/}
                    <View style={styles.sharedBubbleMateContainer}>
                      {/* shared bubble image section*/}
                      {item.sharedBubbleMates && (
                        <View style={styles.sharedBubbleMateImageContainer}>
                          {item.sharedBubbleMates.map((bubbleMates, i) => (
                            <View
                              key={i}
                              style={styles.sharedBubbleMateImageContent}
                            >
                              {i < 3 && (
                                <Image
                                  source={bubbleMates.bubbleMateImage}
                                  style={styles.sharedBubbleImageItem}
                                />
                              )}
                            </View>
                          ))}
                        </View>
                      )}

                      {/* shared bubble text section*/}
                      <View style={styles.sharedBubbleMateTextContainer}>
                        <Text style={styles.sharedBubbleMateTextItem}>
                          {item.sharedBubbleMates.length} shared bubble mates
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.diverLiner} />
              </View>
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
  peopleContainer: {
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
  inputEx: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 14,
    width: "100%",
    alignItems: "center",
  },

  //item collection section
  peopleContentContainer: {
    marginBottom: "85%",
  },
  peopleContent: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  personImageContainer: {
    width: "18%",
  },
  personImageItemContainer: {
    width: Platform.OS === "ios" ? 80 : 66,
    height: Platform.OS === "ios" ? 80 : 66,
    resizeMode: "cover",
    borderRadius: 8,
    borderColor: COLORS.black,
    borderWidth: 2,
  },
  personImageItem: {
    top: 2.5,
    left: 2.5,
    width: Platform.OS === "ios" ? 75 : 61,
    height: Platform.OS === "ios" ? 75 : 61,
    resizeMode: "cover",
    borderRadius: 8,
    borderColor: COLORS.black,
    borderWidth: 2,
  },

  //person text section
  personTextInfoContainer: {
    width: "80%",
    paddingLeft: 12,
    paddingRight: 15,
  },
  personCompanyNameText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
    marginBottom: 0,
  },
  personCompanyInfoText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    marginVertical: 5,
  },
  peopleHashTagContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  personHashTagTextContainers: {
    maxWidth: "65%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  personHashTagTextItemContainer: {
    marginRight: 10,
  },
  personHashTagTextItem: {
    opacity: 0.6,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  personAddWishListItemContainer: {
    width: "35%",
    flexDirection: "column",
  },
  personAddWishListItem: {
    fontSize: 14,
    fontFamily: "PoppinsBold",
    alignSelf: "flex-end",
  },

  //share bubble mates
  sharedBubbleMateContainer: {
    width: "100%",
    padding: 0,
    marginTop: 15,
    flexDirection: "row",
    backgroundColor: COLORS.transparent,
  },
  sharedBubbleMateImageContainer: {
    width: "26%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: COLORS.transparent,
  },
  sharedBubbleMateImageContent: {
    width: 22,
    flexDirection: "row",
  },
  sharedBubbleImageItem: {
    width: 30,
    height: 30,
    resizeMode: "cover",
    borderRadius: 30,
  },
  sharedBubbleMateTextContainer: {
    left: Platform.OS === "ios" ? 10 : 15,
    width: "72%",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: COLORS.transparent,
  },
  sharedBubbleMateTextItem: {
    color: COLORS.white,
    fontSize: 13,
    fontFamily: "PoppinsLight",
  },

  //screen divider
  diverLiner: {
    width: "95%",
    alignSelf: "center",
    marginBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.darkGray,
  },
});

export default ExpressivePeopleScreen;
