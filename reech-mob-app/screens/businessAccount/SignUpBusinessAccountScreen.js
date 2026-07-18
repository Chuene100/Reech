import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";

//import dependencies
import { COLORS, SIZES } from "../../constants";

//import components
import {
  CustomInput,
  CustomInputLocation,
  CustomButton,
  Header,
} from "../../components";
import DropDown from "@/components/UI/DropDown";
import { annualRevenue, jobIndustry } from "@/assets/data/dropDownData";

const SignUpBusinessAccountScreen = () => {
  //form control: validate
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const pwd = watch("password");

  const navigation = useNavigation();

  const onRegisterPressed = (data) => {
    console.log(data);
    navigation.navigate("PasswordScreen");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Header words="Create business account" />
        <CustomInput
          name="businessName"
          control={control}
          rules={{
            required: "Business name is required",
            minLength: {
              value: 2,
              message: "Business name must be at least 2 characters long",
            },
            maxLength: {
              value: 50,
              message: "Business name must be max of 50 characters long",
            },
          }}
          placeholder="Business name"
        />

        <DropDown 
          name="jobIndustry" 
          data={jobIndustry}
          control={control} 
          placeholder={'Job Industry'}
        />

        <CustomInput
          name="email"
          control={control}
          keyboardType="email-address"
          rules={{
            required: "Email address is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address provided",
            },
          }}
          placeholder="Email"
        />

        <CustomInput
          name="phoneNumber"
          control={control}
          keyboardType="number-pad"
          placeholder="Phone number"
          rules={{
            required: "Phone number is required",
            pattern: {
              value: /^[0-9\b]+$/,
              message:
                "Your entry cannot contain strings or special characters",
            },
            maxLength: {
              value: 10,
              message: "Phone number must be at least 10 characters long",
            },
          }}
        />

        <CustomInput
          name="RegNumber"
          control={control}
          keyboardType="number-pad"
          placeholder="Registration number"
          rules={{
            required: "Registration number is required",
            maxLength: {
              value: 14,
              message:
                "Registration number must be at least 14 characters long",
            },
          }}
        />

        <DropDown
          name="annualRevenue" 
          data={annualRevenue}
          control={control} 
          placeholder={'Annual revenue'}
        />

        <CustomInput
          name="numOfEmployees"
          control={control}
          rules={{
            required: "Number of employees are required",
            pattern: {
              value: /^[0-9\b]+$/,
              message:
                "Your entry cannot contain strings or special characters",
            },
            minLength: {
              value: 1,
              message: "Business name must be at least 1 characters long",
            },
          }}
          placeholder="Number of employees"
        />

        <CustomInputLocation
          name="businessLocation"
          control={control}
          rules={{
            required: "Business location is required",
            minLength: {
              value: 1,
              message: "Business name must be at least 1 characters long",
            },
          }}
          placeholder="Location"
        />

        <View style={styles.spacer}></View>

        <View style={styles.infoSection}>
          <Text style={styles.infoSectionText}>
            Note: all this information will not be visible to public. It will be
            used to provide relevant recommendations
          </Text>
        </View>

        <View style={styles.buttonSection}>
          <CustomButton onPress={handleSubmit(onRegisterPressed)} text="Next" />
        </View>
        <View style={styles.spacerBelow}></View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",

    paddingHorizontal: 25,
    backgroundColor: COLORS.black,
  },
  terms: {
    fontSize: 12,
    marginVertical: 10,
  },
  link: {
    color: COLORS.purple,
    fontFamily: "PoppinsBold",
  },

  spacer: {
    marginBottom: 26,
  },
  infoSection: { marginTop: 2 },
  infoSectionText: {
    marginVertical: 20,
    marginHorizontal: -14,
    fontSize: 13,
    color: COLORS.darkGray,
    fontSize: 16,
  },
  buttonSection: { marginLeft: 220, width: "40%", marginBottom: 10 },
  spacerBelow: { marginBottom: 70 },
});

export default SignUpBusinessAccountScreen;
