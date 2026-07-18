import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";

//import dependencies
import { COLORS, FONTS } from "../../../constants";
import {
  Header,
  CustomButton,
  CustomInput,
  CustomLocation,
} from "../../../components";
import DropDown from "@/components/UI/DropDown";
import { availability, experience, qualification } from "@/assets/data/dropDownData";

const AuthAddProfileInfoScreen = ({ route }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigation = useNavigation();
  const prevData = route.params.data;

  const onNextPress = (data) => {
    data = { ...data, ...prevData };

    navigation.navigate("AuthProfilePersonaliserScreen", { data: data });
  };

  const onProfileBenefitPress = () => {
    navigation.navigate("ProfileBenefitsScreen");
  };

  //render function
  function renderNavigationSection() {
    return (
      <View>
        {/*header navigation section*/}
        <Header />
        <View style={styles.content}>
          <TouchableOpacity style={styles.goBack}>
            <Ionicons
              name="chevron-back"
              size={26}
              color={COLORS.white}
              onPress={() => navigation.goBack()}
            />
          </TouchableOpacity>

          <View style={styles.headingContainer}>
            <Text style={styles.headingText}>Add Profile</Text>
          </View>
        </View>
        <View>
          <Text style={styles.headingSubText}>
            Note: all this information will not be visible to the public. It
            will be used to provide relevant recommendations
          </Text>
        </View>
      </View>
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
          rules={{ required: " Please choose your years of experience" }}
        />
        <View style={{ zIndex: 10 }}>
        <DropDown
          control={control}
          data={qualification}
          name="educationLevel"
          rules={{ required: " Please choose your education level" }}
        />
        </View>

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
        <CustomButton text="Next" onPress={handleSubmit(onNextPress)} />
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

  //header navigation section
  content: {
    flexDirection: "row",
    marginTop: Platform.OS === "android" ? 70 : 80,
  },
  goBack: {
    width: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  headingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 40,
    marginLeft: 10,
  },
  headingText: {
    color: COLORS.white,
    ...FONTS.body2,
  },
  headingSubText: {
    alignSelf: "center",
    marginTop: "5%",
    marginBottom: "4%",
    fontSize: 16,
    color: COLORS.white,
    fontFamily: "PoppinsBold",
  },

  textSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textInfo: {
    fontFamily: "PoppinsBold",
    marginHorizontal: "3%",
    color: COLORS.white,
  },
  formSection: {
    paddingHorizontal: 10,
  },
  formLocationContainer: {
    marginBottom: "80%",
  },
  nextButton: {
    position: "relative",
    alignSelf: "flex-end",
    marginBottom: Platform.OS === "ios" ? 50 : 10,
    width: "35%",
  },
  btnContainer: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    margin: Platform.OS === "ios" ? -30 : 10,
    marginBottom: "15%",
  },
  btnText: {
    marginBottom: "-5%",
    color: COLORS.lightBlue,
    fontSize: 16,
  },
});

export default AuthAddProfileInfoScreen;
