import React, { useState } from "react";
import { FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Entypo, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

//custom
import { COLORS } from "../../../../constants";
import NavHeader from "@/components/Headers/NavHeader";

const AdPrioritySettingScreen = ({ route }) => {
  const { itemId } = route.params;

  //state handlers
  
  const [categoryItemsCollection, setCategoryItemsCollection] = useState(itemId.categoryIndustry);
  const [selectAll, setSelectAll] = useState(false);
  const [selectIndustryItem, setSelectIndustryItem] = useState([]);

  // Function to handle individual item selection
  const toggleItemSelection = (itemId) => {
    setSelectIndustryItem((prevSelectedItems) => {
      if (prevSelectedItems.includes(itemId)) {
        if (selectAll) setSelectAll(false);
        return prevSelectedItems.filter((id) => id !== itemId);
      } else {
        return [...prevSelectedItems, itemId];
      }
    });
  };

  // Function to handle "Select All" functionality
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectIndustryItem([]);
    } else {
      let catArr = categoryItemsCollection.map((item) => item.id);
      setSelectIndustryItem(catArr);
    }
    setSelectAll(!selectAll);
  };

  //header component
  function renderHeaderComponent() {
    return (
      <View style={styles.headerComponentContainer}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headingTextItem}>Prioritise</Text>
        </View>
      </View>
    );
  }

  //top image section
  function renderCategoryImageSection() {
    return (
      <View style={styles.categoryImageContainer}>
        <Image
          style={styles.categoryImageItem}
          source={itemId.adCategoryImage}
        />

        {/*category name section*/}
        <View style={styles.categoryNameContainer}>
          <LinearGradient
            style={styles.categoryNameGradientContainer}
            colors={["transparent", COLORS.teal, "transparent"]}
            start={{ x: 0.99, y: 0.0 }}
            end={{ x: 0.01, y: 0.0 }}
          >
            <Text style={styles.categoryNameItem}>
              {itemId.adCategoryMainName}
            </Text>
          </LinearGradient>
        </View>
      </View>
    );
  }

  //category collection section
  function renderCategoryOptionSection() {
    //sort flatlist data alphabetically
    const sortedItemCollection = categoryItemsCollection.slice().sort((a, b) => {
      const nameA = a.industryName.toLowerCase();
      const nameB = b.industryName.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    return (
      <View style={styles.categoryItemsContainer}>
        <View style={styles.categoryItemsContent}>
          {/*select all option*/}
          <View style={styles.categorySelectAllContainer}>
            {/*select all text*/}
            <View style={styles.categorySelectTextContainer}>
              <Text style={styles.categorySelectTextItem}>Select all</Text>
            </View>

            {/*select all icon*/}
            <TouchableOpacity onPress={toggleSelectAll} style={styles.categorySelectIconContainer}>
              {selectAll ? (
                <Feather name="check-circle" size={24} color={COLORS.teal} />
              ) : (
                <Entypo name="circle" size={24} color={COLORS.darkGray} />
              )}
            </TouchableOpacity>
          </View>

          <FlatList
            data={sortedItemCollection}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              const isSelected = selectIndustryItem.includes(item.id);

              return (
                <View key={item.id} style={styles.categorySelectItemContainer}>
                  {/*select all text*/}
                  <View style={styles.categorySelectItemTextContainer}>
                    <Text style={styles.categorySelectItemTextItem}>
                      {item.industryName}
                    </Text>
                  </View>

                  {/*select all icon*/}
                  <TouchableOpacity onPress={() => toggleItemSelection(item.id)} style={styles.categorySelectItemIconContainer}>
                    {isSelected ? (
                      <Feather name="check-circle" size={24} color={COLORS.teal} />
                    ) : (
                      <Entypo name="circle" size={24} color={COLORS.darkGray} />
                    )}
                  </TouchableOpacity>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View style={{ marginBottom: Platform.OS === "ios" ? 130 : 70 }} />}
          />
        </View>
      </View >
    );
  }

  //screen content list
  function renderScreenContentList() {
    return (
      <>
        {renderHeaderComponent()}
        {renderHeaderSection()}
        {renderCategoryImageSection()}
        <View style={styles.categoryItemCollectionContainer}>
          {renderCategoryOptionSection()}
        </View>
      </>
    );
  }

  return <View style={styles.container}>{renderScreenContentList()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //category collection section
  categoryItemCollectionContainer: {
    padding: 5,
    height: "46%",
  },

  //header section
  headerContainer: {
    flexDirection: "column",
    zIndex: 99,
  },
  headerComponentContainer: {
    zIndex: 99,
    marginTop: Platform.OS === "ios" ? "11%" : "0%",
  },
  headerTextContainer: {
    top: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
  },
  headingTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },

  //category image section
  categoryImageContainer: {
    top: Platform.OS === "ios" ? -110 : -50,
    width: "100%",
  },
  categoryImageItem: {
    width: Platform.OS === "ios" ? 440 : 360,
    height: Platform.OS === "ios" ? 440 : 375,
    borderRadius: 0,
  },
  categoryNameContainer: {
    width: "100%",
    height: 50,
    bottom: 80,
    marginBottom: -90,
  },
  categoryNameGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 80,
  },
  categoryNameItem: {
    textAlign: "center",
    color: COLORS.white,
    fontSize: 20,
    fontFamily: "PoppinsBold",
    textTransform: "capitalize",
  },

  //category item collection section
  categoryItemsContainer: {
    marginTop: Platform.OS === "ios" ? -60 : -10,
    padding: 2,
  },
  categoryItemsContent: {
    flexDirection: "column",
    marginHorizontal: 5,
  },
  categorySelectAllContainer: {
    marginHorizontal: -5,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  categorySelectTextContainer: {
    width: "70%",
    justifyContent: "center",
  },
  categorySelectTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  categorySelectIconContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "20%",
    right: 6,
  },
  categorySelectItemContainer: {
    padding: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  categorySelectItemTextContainer: {
    width: "75%",
    justifyContent: "center",
  },
  categorySelectItemTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  categorySelectItemIconContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "15%",
  },
});

export default AdPrioritySettingScreen;
