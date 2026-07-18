import React from "react";
import { StyleSheet, View, Text, Platform, TextInput, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { FontAwesome, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

//import customs
import { COLORS } from "../../../../constants";
import { CustomLocationBubble, CustomSlider } from "../../../../components";
import { LinearGradient } from "expo-linear-gradient";
import NavHeader from "@/components/Headers/NavHeader";

const WishlistFilterScreen = () => {
  const navigation = useNavigation();

  const { control, handleSubmit, value } = useForm();

  const onUpdateFilterPress = () => {
    navigation.navigate("WishlistScreen");
  };

  //filter data according to the username
  const searchBusinessCategories = (text) => {
    console.log(text);
  };

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

      <View style={styles.headingContainer}>
        <Text style={styles.headingText}>Filters</Text>
      </View>
    );
  }

  function renderFormCollection() {
    return (
      <View style={styles.formContainer}>
        <View style={styles.formContent}>
          {/*region section*/}
          <View style={styles.formRegionContainer}>
            <Text style={styles.regionText}>
              <FontAwesome5
                name="map-marked-alt"
                size={18}
                color={COLORS.white}
              />{" "}
              Region
            </Text>
            <View style={styles.regionSearchInput}>
              <CustomLocationBubble
                name="currentLocation"
                control={control}
                rules={{ required: "Please enter your location details" }}
                placeholder="Street, State, Country"
              />
            </View>
          </View>

          {/*distance section*/}
          <View style={styles.formDistanceContainer}>
            <Text style={styles.distanceText}>
              <MaterialCommunityIcons
                name="map-marker-distance"
                size={20}
                color={COLORS.white}
              />{" "}
              Distance
            </Text>

            <View style={styles.distanceSearchInput}>
              <CustomSlider name="distance" control={control} />
            </View>
          </View>

          {/*categories section*/}
          <View style={styles.formCategoriesContainer}>
            <Text style={styles.categoriesText}>
              <MaterialIcons name="category" size={20} color={COLORS.white} />{" "}
              Categories
            </Text>

            <View style={styles.categoriesSearchInput}>
              <View style={styles.innerSearchContainer}>
                <View style={styles.textInputContainer}>
                  <TextInput
                    value={value}
                    onChangeText={(text) => searchBusinessCategories(text)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Search"
                    placeholderTextColor={COLORS.white}
                    style={styles.inputWishFilter}
                    enablesReturnKeyAutomatically
                    textAlign="center"
                  />
                </View>
                <FontAwesome name="search" size={16} color={COLORS.purple} style={{ top: Platform.OS === "ios" ? 0 : 5 }} />
              </View>
            </View>
          </View>

          {/*submit section*/}
          <View style={styles.formButtonContainer}>
            <View style={styles.formButton}>
              <Pressable
                onPress={() => handleSubmit(onUpdateFilterPress())}
                style={styles.formButton}
              >
                <LinearGradient
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  colors={[
                    COLORS.purpleDarker,
                    COLORS.purpleDark,
                    COLORS.purple,
                  ]}
                  style={styles.formGradientContainer}
                >
                  <Text style={styles.formTextItem}>Update</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeaderComponent()}
      {renderHeaderSection()}
      <View style={styles.headingHorizontalLine}></View>
      {renderFormCollection()}
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
  headerComponentContainer: {
    marginTop: Platform.OS === "ios" ? "10%" : 0,
  },

  //screen content
  headingContainer: {
    marginTop: 15,
    alignItems: "flex-start",
    marginHorizontal: 22,
  },
  headingText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  headingHorizontalLine: {
    marginVertical: "2.5%",
    marginHorizontal: 22,
    borderBottomColor: COLORS.gray,
    borderBottomWidth: StyleSheet.hairlineWidth * 1,
  },

  //form section
  formContainer: {
    flex: 1,
  },
  formContent: {
    marginHorizontal: 22,
    flexDirection: "column",
  },

  //region section
  formRegionContainer: {
    marginTop: "2%",
    flexDirection: "column",
  },
  regionText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  regionSearchInput: {
    marginTop: "2%",
    marginBottom: 15,
    zIndex: 99,
  },

  //distance section
  formDistanceContainer: {
    flexDirection: "column",
    marginTop: "10%",
    zIndex: -1,
  },
  distanceText: {
    marginBottom: 10,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  distanceSearchInput: {
    flexDirection: "column",
    marginTop: 10,
  },

  //categories section
  formCategoriesContainer: {
    flexDirection: "column",
    marginTop: "6%",
    zIndex: -1,
  },
  categoriesText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  categoriesSearchInput: {
    marginTop: 20,
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
  inputWishFilter: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 14,
    width: "100%",
    alignItems: "center",
  },

  //button section
  formButtonContainer: {
    flexDirection: "column",
    marginTop: "70%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  formButton: {
    width: "65%",
    justifyContent: "center",
    alignItems: "center",
  },
  formGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 45,
    width: "100%",
  },
  formTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
});

export default WishlistFilterScreen;
