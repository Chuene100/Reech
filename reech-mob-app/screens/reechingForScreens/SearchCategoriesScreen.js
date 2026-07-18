import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { useForm } from "react-hook-form";

//import customs
import { COLORS } from "../../constants";
import NavHeader from "@/components/Headers/NavHeader";
import { useListJobDescriptorsQuery } from "../../redux/api/job-descriptor";

const SearchCategoriesScreen = () => {
  const descriptor_img = {
    Communicators:
      "https://images.unsplash.com/photo-1642911353098-42efaae7f6d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    Thinkers:
      "https://images.unsplash.com/photo-1664382951020-41874ae61a44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80",
    Doers:
      "https://images.unsplash.com/photo-1664382951020-41874ae61a44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80",
    "Life supporters":
      "https://images.unsplash.com/photo-1592947945242-69312358628b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
    Captains:
      "https://images.pexels.com/photos/3791130/pexels-photo-3791130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    Instructors:
      "https://images.unsplash.com/photo-1642911353098-42efaae7f6d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    "Sports people":
      "https://images.unsplash.com/photo-1592947945242-69312358628b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
    Creators:
      "https://images.unsplash.com/photo-1677801820836-6047a357549c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
    Entertainers:
      "https://images.unsplash.com/photo-1677801820836-6047a357549c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
    Drivers:
      "https://images.pexels.com/photos/3791130/pexels-photo-3791130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    other: "",
  };

  const { value } = useForm();

  const navigation = useNavigation();

  const [selected, setSelected] = useState({});
  const [filterSelected, setFilterSelected] = useState({});
  const [filterAll, setFilterAll] = useState([]);

  const { data: descriptors, refetch, isFetching } = useListJobDescriptorsQuery();

  useEffect(() => {
    setSelected(descriptors?.data?.[0]);
    setFilterSelected(descriptors?.data?.[0].jobTitleIds);

    const concatArr = descriptors?.data?.reduce((result, item) => {
      return result.concat(item.jobTitleIds);
    }, []);
    setFilterAll(concatArr??[])
  }, [descriptors]);

  //a method used to filter data according to the username
  const searchCategoryName = (text) => {
    let filteredData = filterAll?.filter((x) =>
      x.jobTitle.toLowerCase().includes(text.toLowerCase())
    );

    text? setFilterSelected(filteredData):setFilterSelected(selected?.jobTitleIds);
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.contentContainerSearchCategory}>
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
        <Text style={styles.headingTextItem}>
          Who do you want to Reech for?
        </Text>
      </View>
    );
  }

  //search section
  function renderSearchComponentSection() {
    return (
      <View style={styles.searchComponentContainer}>
        <View style={styles.searchComponentContents}>
          {/*search component*/}
          <View style={styles.innerSearchContainer}>
            <TextInput
              value={value}
              onChangeText={(text) => searchCategoryName(text)}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Search"
              placeholderTextColor={COLORS.white}
              style={styles.inputCategories}
              enablesReturnKeyAutomatically
              textAlign="center"
            />
          </View>
          <FontAwesome name="search" size={16} color={COLORS.purple} style={{ top: Platform.OS === "ios" ? 0 : 5 }} />
        </View>
      </View>
    );
  }

  //screen category item section
  function renderCategoryMainSection() {
    return (
      <View style={styles.categoryMainContainer}>
        <View style={styles.categoryMainContent}>
          <FlatList
            data={descriptors?.data ?? []}
            keyExtractor={(index) => index.toString()}
            onRefresh={refetch}
            refreshing={isFetching}
            renderItem={({ item }) => {
              return (
                <View>
                  {/*category job item*/}
                  <TouchableOpacity
                    onPress={() => {
                      setSelected(item);
                      setFilterSelected(item?.jobTitleIds);
                    }}
                    style={styles.categoryMainContentItem}
                  >
                    <Text style={styles.categoryMainTextItem}>
                      {item?.jobDescriptor}
                    </Text>
                    {selected?.jobDescriptor === item?.jobDescriptor && (
                      <View style={styles.activeCategoryItemSelector} />
                    )}
                  </TouchableOpacity>
                </View>
              );
            }}
            ListFooterComponent={<View style={{ marginBottom: "5%" }}></View>}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={<></>}
            decelerationRate="fast"
          />
        </View>
      </View>
    );
  }

  //screen category option list section
  function renderCategoryListItemsSection() {
    return (
      <View style={styles.categoryListItemContainer}>
        <FlatList
          data={filterSelected ?? []}
          keyExtractor={(index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("AddOpportunityCardScreen", {
                      jobTitleId: item,
                      reechImg: item?.img,
                    })
                  }
                  style={styles.categoryCardContainer}
                >
                  {/*category image section*/}
                  <View style={styles.categoryImageCard}>
                    <Image
                      source={{
                        uri:
                          item?.img ?? descriptor_img[selected?.jobDescriptor],
                      }}
                      style={styles.categoryImageItem}
                    />
                  </View>

                  {/*category info section*/}
                  <View style={styles.categoryJobInfoSectionContainer}>
                    {/*category name section*/}
                    <View style={styles.categoryJobNameContainer}>
                      <Text
                        numberOfLines={2}
                        style={styles.categoryJobNameItem}
                      >
                        {item?.jobTitle}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
          ListFooterComponent={<View style={{ marginBottom: "5%" }}></View>}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={<></>}
          decelerationRate="fast"
        />
      </View>
    );
  }

  //screen category halves
  function renderScreenCategoryHalves() {
    return (
      <View style={styles.categoryContainer}>
        {/*job titles section*/}
        {renderCategoryMainSection()}

        <View style={styles.screenDividerLine} />

        {/*job titles section*/}
        <View style={styles.categoryScrollContainer}>
          {renderCategoryListItemsSection()}
        </View>
      </View>
    );
  }

  //screen content list
  function renderScreenContentList() {
    return (
      <>
        {renderHeaderSection()}
        <View style={styles.screenContentContainer}>
          {renderHeadingTopSection()}
          {renderSearchComponentSection()}
          {renderScreenCategoryHalves()}
        </View>
      </>
    );
  }

  //screen content items
  return <View style={styles.container}>{renderScreenContentList()}</View>;
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  contentContainerSearchCategory: {
    marginTop: Platform.OS === "android" ? "0%" : "10%",
  },

  //screen content container
  screenContentContainer: {
    marginTop: 35,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: "#141414",
  },

  //heading top section
  headingContentContainer: {
    marginTop: 25,
    marginBottom: 30,
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
    fontFamily: "PoppinsBold",
  },

  //search section
  searchComponentContainer: {
    flexDirection: "column",
    paddingHorizontal: 15,
    backgroundColor: COLORS.transparent,
  },
  searchComponentContents: {
    flexDirection: "row",
    paddingVertical: Platform.OS === "ios" ? 10 : 5,
    paddingHorizontal: 25,
    borderRadius: 20,
    backgroundColor: COLORS.reechGray,
    marginBottom: 20,
  },
  innerSearchContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "93%",
  },
  inputCategories: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 14,
    width: "100%",
    alignItems: "center",
  },

  //category section
  categoryContainer: {
    width: "100%",
    height: "74%",
    flexDirection: "row",
  },
  screenDividerLine: {
    width: 1,
    backgroundColor: COLORS.darkGray,
  },
  categoryScrollContainer: {
    height: "100%",
    width: "61%",
  },

  //category main section
  categoryMainContainer: {
    width: "39%",
  },
  categoryMainContent: {
    flexDirection: "column",
  },
  categoryMainContentItem: {
    marginBottom: 30,
    paddingHorizontal: 20,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  categoryMainTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  activeCategoryItemSelector: {
    marginTop: 10,
    width: "100%",
    borderBottomColor: COLORS.purple,
    borderBottomWidth: StyleSheet.hairlineWidth * 7,
  },

  //category list section
  categoryListItemContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: COLORS.transparent,
  },

  //category job section
  categoryCardContainer: {
    width: "95%",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "#0d0d0d",
  },
  categoryImageCard: {
    width: "38%",
  },
  categoryImageItem: {
    width: "100%",
    height: 100,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
    overflow: "hidden",
  },
  categoryJobInfoSectionContainer: {
    width: "62%",
    flexDirection: "column",
    paddingHorizontal: Platform.OS === "ios" ? 15 : 10,
    paddingVertical: 20,
  },
  categoryJobNameContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    maxHeight: 50,
  },
  categoryJobNameItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    textAlign: "center",
  },
});

export default SearchCategoriesScreen;
