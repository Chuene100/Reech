import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";

//import dependencies
import { COLORS } from "../../constants";

//import components
import {
  CustomInput,
  CustomButton,
  CustomDatePicker,
  CustomDropDown,
  Header,
  CustomLocation,
  AuthHeader,
} from "../../components";

const SignUpScreen = () => {
  //form control: validate
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      id: "",
      dob: "",
      empStatus: "",
      location: "",
    },
  });

  const { height } = useWindowDimensions();
  const navigation = useNavigation();

  const onSignInPress = () => {
    navigation.navigate("SignInScreen");
  };

  const onNextPressed = (data) => {
    console.log("data: ", data);
    navigation.navigate("PasswordScreen", {
      data: data,
    });
  };

  //header section
  function renderHeaderSection() {
    return <AuthHeader words={"Create account"} />;
  }

  //render form section
  function renderFormSection() {
    return (
      <View style={styles.formScrollViewContainer}>
        {/*form item list*/}
        <ScrollView
          showsVerticalScrollIndicator={false}
          
          nestedScrollEnabled={true}
          style={styles.formContainer}
          keyboardShouldPersistTaps="always"
        >
          {/*first name item*/}
          <CustomInput
            name="firstName"
            control={control}
            rules={{
              required: "Name is required",
              pattern: {
                value: /^[a-zA-Z]+$/,
                message:
                  "Your entry cannot contain numbers or special characters",
              },
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters long",
              },
              maxLength: {
                value: 24,
                message: "Name must be max of 24 characters long",
              },
            }}
            placeholder="First name"
          />

          {/*last name item*/}
          <CustomInput
            name="lastName"
            control={control}
            rules={{
              required: "Surname is required",
              pattern: {
                value: /^[a-zA-Z]+$/,
                message:
                  "Your entry cannot contain numbers or special characters",
              },
              minLength: {
                value: 2,
                message: "Surname must be at least 2 characters long",
              },
              maxLength: {
                value: 24,
                message: "Surname must be max of 24 characters long",
              },
            }}
            placeholder="Last name"
          />

          {/*email item*/}
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
            placeholder="Email address"
          />

          {/*phone number item*/}
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

          {/*identification item*/}
          <CustomInput
            name="id"
            keyboardType="number-pad"
            control={control}
            rules={{
              required: "ID number is required",
              pattern: {
                value: /^[0-9\b]+$/,
                message:
                  " Your entry cannot contain strings or special characters",
              },
              maxLength: {
                value: 15,
                message: "ID number must be at least 15 characters long",
              },
            }}
            placeholder="ID or Passport"
          />

          {/*date of birth item*/}
          <CustomDatePicker
            name="dob"
            control={control}
            rules={{
              required: "Date of birth is required",
            }}
            placeholder="Date of birth"
          />

          {/*employment status item*/}
          <CustomDropDown
            name="empStatus"
            control={control}
            placeholder="Employment status"
            rules={{
              required: "Employment status is required",
            }}
          />

          {/*location item*/}
          <View style={styles.locationItem}>
            <ScrollView
              horizontal
              style={{width: '100%'}}
              keyboardShouldPersistTaps='always'
            >
              <CustomLocation
                name="location"
                control={control}
                rules={{ required: "Location is required" }}
                placeholder={"Location"}
              />
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }

  //render information section
  function renderInformationSection() {
    return (
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          All this information will not be visible to public. It will be used to
          provide you with relevant recommendations.
        </Text>
      </View>
    );
  }

  //render Info & Button Section
  function renderBottomSection() {
    return (
      <View>
        {/*are you a member*/}
        <View style={styles.memberContainer}>
          <Text style={styles.memberText}>Already have an account?</Text>
          <Pressable onPress={onSignInPress}>
            <Text style={styles.memberActionText}>Sign-in</Text>
          </Pressable>
        </View>

        {/*submit button*/}
        <View style={styles.bottomContainer}>
          <CustomButton onPress={handleSubmit(onNextPressed)} text="Next" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeaderSection()}
      {renderFormSection()}
      {renderInformationSection()}
      {renderBottomSection()}
    </View>
  );
};

const styles = StyleSheet.create({
  //header section
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //form section
  formScrollViewContainer: {
    height: "60%",
  },
  formContainer: {
    top: 15,
    marginHorizontal: 15,
  },
  locationItem: {
    marginBottom: 200,
  },

  //info section
  infoContainer: {
    height: 50,
    top: 10,
    marginHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    color: COLORS.white,
    opacity: 0.6,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //member section
  memberContainer: {
    top: 25,
    flexDirection: "row",
    marginHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  memberText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "PoppinsLight",
  },
  memberActionText: {
    left: 6,
    color: COLORS.lightBlue,
    fontSize: 19,
    fontFamily: "PoppinsLight",
  },

  bottomContainer: {
    top: 50,
    height: 60,
    width: 150,
    left: Platform.OS === "ios" ? 263 : 230,
    overflow: "hidden",
    flexDirection: "row",
    borderRadius: 10,
  },
});

export default SignUpScreen;
