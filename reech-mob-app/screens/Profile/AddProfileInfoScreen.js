import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";

//import dependencies
import { COLORS } from "../../constants";
import {
  CustomInput,
  CustomLocation,
} from "../../components";
import NavHeader from "@/components/Headers/NavHeader";
import { availability, experience, qualification } from "@/assets/data/dropDownData";
import DropDown from "@/components/UI/DropDown";

const AddProfileInfoScreen = ({ route }) => {
  const {
    control,
    handleSubmit,
  } = useForm();

  const navigation = useNavigation();
  const prevData = route.params.data;

  const onNextPress = (data) => {
    data = { ...data, ...prevData };

    navigation.navigate("ProfilePersonaliserScreen", { data: data });
  };

  const onProfileBenefitPress = () => {
    navigation.navigate("ProfileBenefitsScreen");
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerComponentContainer}>
        <NavHeader
          message="What would you like to do?"
        />
      </View>
    );
  }

  //render heading
  function renderNavigationSection() {
    return (
      <>
        {/*top navigation section*/}
        <View style={styles.navigationContainer}>
          <View style={styles.textHeadingContainer}>
            <Text style={styles.textHeadingItem}>Add information profile</Text>
          </View>
        </View>

        {/*screen notification section*/}
        <View style={styles.subHeadingContainer}>
          <Text style={styles.headingSubText}>
            Note: all this information will not be visible to the public. It
            will be used to provide relevant recommendations
          </Text>
        </View>
      </>
    );
  }

  function renderFormSection() {
    return (
      <ScrollView
        style={styles.formSection}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        
        nestedScrollEnabled={true}
      >
        <DropDown
          name="commitmentLevel"
          data={availability}
          control={control}
          minimal={true}
          rules={{ required: " Please choose an commitment level" }}
        />

        <CustomInput
          name="earning"
          keyboardType="number-pad"
          control={control}
          rules={{
            required: " Earning field is required",
            pattern: {
              value: /^[0-9\b]+$/,
              message:
                " Your entry cannot contain strings or special characters",
            },
          }}
          placeholder="How much are you earning per month?"
        />

        <CustomInput
          name="salaryExpectation"
          keyboardType="number-pad"
          control={control}
          rules={{
            required: " Salary expectation is required",
            pattern: {
              value: /^[0-9\b]+$/,
              message:
                " Your entry cannot contain strings or special characters",
            },
          }}
          placeholder="What are your salary expectations per month?"
        />

        <DropDown
          control={control}
          data={experience}
          rowText={'name'}
          name="experience"
          minimal={true}
          rules={{ required: " Please choose your years of experience" }}
        />

        <DropDown
          control={control}
          data={qualification}
          name="educationLevel"
          minimal={true}
          rules={{ required: " Please choose your education level" }}
        />

        <View style={[styles.formLocationContainer, { zIndex: 9 }]}>
          <ScrollView
            horizontal
            style={{width: '100%'}}
            keyboardShouldPersistTaps='always'
          >
            <CustomLocation
              control={control}
              name="location"
              placeholder="Street, State, Country"
              rules={{ required: "Please enter your location details" }}
            />
          </ScrollView>
        </View>
      </ScrollView>
    );
  }

  function renderButtonNext() {
    return (
      <View style={styles.nextButton}>
        <Pressable
          onPress={handleSubmit(onNextPress)}
          style={styles.createContainer}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
            style={styles.createGradientContainer}
          >
            <Text style={styles.createTextItems}>Create</Text>
          </LinearGradient>
        </Pressable>
      </View>
    );
  }

  function renderBottomButton() {
    return (
      <View style={styles.btnContainer}>
        <Text style={styles.btnText} onPress={onProfileBenefitPress}>
          Profile benefits & Pricing
        </Text>
      </View>
    );
  }

  return (
    <View nestedScrollEnabled={true} style={styles.container}>
      {renderHeaderSection()}
      {renderNavigationSection()}
      {renderFormSection()}
      {renderButtonNext()}
      {renderBottomButton()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    paddingHorizontal: 15,
    paddingTop: Platform.OS === "ios" ? "5%" : "0%",
    width: "100%",
  },

  //header component section
  headerComponentContainer: {
    marginTop: Platform.OS === "ios" ? "5%" : "0%",
  },

  //header navigation section
  navigationContainer: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  textHeadingContainer: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  textHeadingItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  subHeadingContainer: {
    marginHorizontal: 15,
    marginVertical: 8,
  },
  headingSubText: {
    textAlign: "center",
    fontSize: 14,
    color: COLORS.white,
    fontFamily: "PoppinsLight",
  },
  formSection: {
    paddingHorizontal: 10,
  },
  formLocationContainer: {
    marginBottom: Platform.OS === "ios" ? "70%" : "56%",
  },

  //next button section
  nextButton: {
    alignSelf: "flex-end",
    marginBottom: Platform.OS === "ios" ? 50 : 10,
    width: "35%",
  },
  createContainer: {
    marginTop: 30,
  },
  createGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 45,
    width: "100%",
  },
  createTextItems: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  btnContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    margin: Platform.OS === "ios" ? -30 : 10,
    marginBottom: "15%",
  },
  btnText: {
    marginBottom: "-5%",
    color: COLORS.lightBlue,
    fontSize: 14,
  },
});

export default AddProfileInfoScreen;
