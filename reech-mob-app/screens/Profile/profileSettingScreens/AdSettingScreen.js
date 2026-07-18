import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Pressable, Image, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import { FlatList } from "react-native-gesture-handler";

//import customs
import { adSettingDataList } from "../../../assets/data/adSettingUserData";
import { COLORS } from "../../../constants";
import { CustomItemToggler, } from "../../../components";
import NavHeader from "@/components/Headers/NavHeader";

const AdSettingScreen = () => {
  const navigation = useNavigation();

  const { control } = useForm();

  const [itemCollection, setItemCollection] = useState(adSettingDataList);
  const [categorySelector, setCategorySelector] = useState([]);

  //a method used to filter data according to the place name
  const searchCategories = (text) => {
    let filteredData = adSettingDataList.filter((x) =>
      String(x.adCategoryMainName.toLowerCase()).includes(text.toLowerCase())
    );
    setItemCollection(filteredData);
  };

  // Function to handle item selection
  const handleCategorySelection = (item) => {
    if (categorySelector.includes(item.id)) {
      setCategorySelector((prevSelectedItems) =>
        prevSelectedItems.filter((id) => id !== item.id)
      );
    }
    else { setCategorySelector([...categorySelector, item.id]) }
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        {/*logo section*/}
        <View style={styles.headerComponentContainer}>
          <NavHeader message="What would you like to do?" />
        </View>

        {/*navigation section*/}
        <View style={styles.headerTextContainer}>
          <Text style={styles.headingTextItem}>Ad settings</Text>
        </View>
      </View>
    );
  }

  //search function section
  function renderSearchFunctionSection() {
    return (
      <View style={styles.innerSearchContainer}>
        <View style={styles.textInputContainer}>
          <View style={styles.innerSearchTextContainer}>
            <TextInput
              onChangeText={(text) => searchCategories(text)}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Search"
              placeholderTextColor={COLORS.white}
              style={styles.inputAdSettings}
              enablesReturnKeyAutomatically
              textAlign="center"
            />
          </View>
          <FontAwesome name="search" size={16} color={COLORS.purple} style={{ top: Platform.OS === "ios" ? 0 : 5 }} />
        </View>
      </View>
    );
  }

  //toggle option section
  function renderToggleOptionSection() {
    return (
      <View style={styles.toggleItemsContainer}>
        {/*location section*/}
        <View style={styles.toggleLocationContainer}>
          <Text style={styles.toggleTextItem}>Use my location </Text>

          <CustomItemToggler
            name="useMyLocation"
            control={control}
            invalue={"useMyLocation"}
            notify={({ value }) => {
              value === true;
            }}
          />
        </View>

        {/*notification section*/}
        <View style={styles.toggleNotificationContainer}>
          <Text style={styles.toggleTextItem}>Notifications</Text>

          <CustomItemToggler
            name="notifications"
            control={control}
            invalue={"notifications"}
            notify={({ value }) => {
              value === true;
            }}
          />
        </View>
      </View>
    );
  }

  //preference section
  function renderPreferenceSection() {
    return (
      <View style={styles.preferenceContainer}>
        {/*preference button item*/}
        <Pressable
          onPress={() => navigation.navigate("AdPreferenceScreen")}
          style={styles.preferenceButtonContainer}
        >
          <LinearGradient
            start={{ x: 0.99, y: 0.0 }}
            end={{ x: 0.01, y: 0.0 }}
            colors={[COLORS.teal, COLORS.tealDark, COLORS.tealDarker]}
            style={styles.preferenceGradientContainer}
          >
            <Text style={styles.preferenceTextItem}>Define my preferences</Text>
          </LinearGradient>
        </Pressable>

        {/*description section*/}
        <View style={styles.preferenceDescriptionTextContainer}>
          <Text style={styles.preferenceDescriptionTextItem}>
            Show me specific products and services
          </Text>
        </View>
      </View>
    );
  }

  function renderCategoryListSection() {
    //sort flatlist data alphabetically
    const sortedItemCollection = itemCollection.slice().sort((a, b) => {
      const nameA = a.adCategoryMainName.toLowerCase();
      const nameB = b.adCategoryMainName.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    return (
      <View style={styles.categoryItemsContainer}>
        <FlatList
          data={sortedItemCollection}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            const isSelected = categorySelector.includes(item.id);

            return (
              <View style={styles.categoryItemsListContainer}>
                <View style={styles.categoryImageContainer}>
                  {/*category selector*/}
                  <View key={item.id} style={styles.categorySelectorContainer}>
                    {isSelected ? (
                      <Feather
                        onPress={() => handleCategorySelection(item)}
                        name="check-circle"
                        size={24}
                        color={COLORS.teal}
                      />
                    ) : (
                      <Entypo
                        onPress={() => handleCategorySelection(item)}
                        name="circle"
                        size={24}
                        color={COLORS.teal}
                      />
                    )}
                  </View>

                  {/*category image item*/}
                  <Image
                    source={item.adCategoryImage}
                    style={styles.categoryImageItem}
                  />

                  {/*category name section*/}
                  <Pressable
                    onPress={() =>
                      navigation.navigate("AdPrioritySettingScreen", {
                        itemId: item,
                      })
                    } style={styles.categoryNameContainer}>
                    <LinearGradient
                      style={styles.categoryNameGradientContainer}
                      colors={["transparent", COLORS.teal, "transparent"]}
                      start={{ x: 0.99, y: 0.0 }}
                      end={{ x: 0.01, y: 0.0 }}
                    >
                      <Text style={styles.categoryNameItem}>
                        {item.adCategoryMainName}
                      </Text>
                    </LinearGradient>
                  </Pressable>
                </View>
              </View>
            );
          }}
          numColumns={2}
          columnWrapperStyle={styles.flatListColumnWrapperContainer}
          contentContainerStyle={styles.flatListContentContainer}
          ListFooterComponent={<View style={styles.flatListBottomContainer} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  //screen content list
  function renderScreenContentList() {
    return (
      <>
        {renderHeaderSection()}
        <View style={styles.screenContentSectionContainer}>
          {renderSearchFunctionSection()}
          {renderToggleOptionSection()}
          {renderPreferenceSection()}
          {renderCategoryListSection()}
        </View>
      </>
    );
  }

  //screen contents
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

  //screen content section
  screenContentSectionContainer: {
    top: 40,
  },

  //header section
  headerContainer: {
    flexDirection: "column",
  },
  headerComponentContainer: {
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },
  headerTextContainer: {
    top: 20,
    paddingHorizontal: 15,
    flexDirection: "row",
  },
  headingTextItem: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "PoppinsLight",
  },

  //search section
  innerSearchContainer: {
    flexDirection: "column",
    paddingHorizontal: 15,
    backgroundColor: COLORS.transparent,
  },
  textInputContainer: {
    flexDirection: "row",
    paddingVertical: Platform.OS === "ios" ? 10 : 5,
    paddingHorizontal: 25,
    borderRadius: 20,
    backgroundColor: COLORS.reechGray,
    marginBottom: 20,
  },
  innerSearchTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "93%",
  },
  inputAdSettings: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 14,
    width: "100%",
    alignItems: "center",
  },

  //toggle section
  toggleItemsContainer: {
    padding: 0,
    marginHorizontal: 20,
    justifyContent: "center",
    flexDirection: "row",
  },
  toggleLocationContainer: {
    width: "48%",
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleTextItem: {
    color: COLORS.white,
    fontFamily: "PoppinsLight",
    fontSize: 14,
    zIndex: -1,
    width: "70%",
    bottom: 2,
  },
  toggleNotificationContainer: {
    left: 8,
    width: "48%",
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  //preference section
  preferenceContainer: {
    padding: 5,
    marginVertical: 10,
    marginHorizontal: 5,
    flexDirection: "column",
  },
  preferenceButtonContainer: {
    marginHorizontal: 0,
    borderRadius: 25,
  },
  preferenceGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    height: 45,
    width: "100%",
  },
  preferenceTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  preferenceDescriptionTextContainer: {
    marginHorizontal: 15,
    marginTop: 5,
  },
  preferenceDescriptionTextItem: {
    color: COLORS.darkGray,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //category section
  categoryItemsContainer: {
    padding: 5,
    height: Platform.OS === "ios" ? "68%" : "65%",
  },
  categoryItemsListContainer: {
    top: -20,
    left: Platform.OS === "ios" ? 0 : 10,
    marginHorizontal: Platform.OS === "ios" ? 10 : -5,
  },
  flatListColumnWrapperContainer: {
    width: "98%",
  },
  flatListContentContainer: {
    flexDirection: "column",
  },
  flatListBottomContainer: {
    flexDirection: "column",
    marginBottom: Platform.OS === "ios" ? 20 : 0
  },

  //category items section
  categoryImageContainer: {
    width: Platform.OS === "ios" ? "20%" : "13%",
  },
  categoryImageItem: {
    width: Platform.OS === "ios" ? 190 : 160,
    height: Platform.OS === "ios" ? 270 : 230,
    resizeMode: "cover",
  },
  categoryNameContainer: {
    width: 190,
    height: 50,
    bottom: 50,
    marginBottom: -50,
  },
  categoryNameGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: Platform.OS === "ios" ? 190 : 160,
    height: 50,
  },
  categoryNameItem: {
    textAlign: "center",
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
    textTransform: "capitalize",
  },
  categorySelectorContainer: {
    top: 30,
    zIndex: 99,
    left: Platform.OS === "ios" ? 150 : 125,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,

  },
});

export default AdSettingScreen;
