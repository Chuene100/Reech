import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { icons, COLORS } from "../../constants";
import Toast from "react-native-toast-message";

//import components
import {
  CustomPasswordInput,
  CustomButton,
  AuthHeader,
} from "../../components";
import { useResetPassowrdMutation } from "../../redux/api/auth";

const NewPasswordForgotScreen = ({ route }) => {
  //form control: validate
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [resetPasswordFn, { isLoading }] = useResetPassowrdMutation();

  const pwd = watch("password");

  const { height } = useWindowDimensions();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const previousData = route.params.data;

  const showError = (res) =>
    Toast.show({
      type: "error",
      text1: "Error",
      text2: res.error.data?.error ?? "Something went wrong. Please try again",
    });

  const onResetPasswordPressed = (data) => {
    setLoading(true);
    const formData = { email: previousData.email, password: data.password };

    resetPasswordFn(formData)
      .then((res) => {
        setLoading(false);
        if (res.error) {
          showError(res);
          return;
        }
        navigation.navigate("SignInScreen", { data: formData });
      })
      .catch((err) => {
        setLoading(false);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: err.data?.message ?? "Something went wrong. Please try again",
        });
      });
  };

  const onBackToSignInPress = () => {
    navigation.navigate("SignInScreen");
  };

  //render logo section
  function renderScreenHeaderSection() {
    return <AuthHeader words={"New password"} />;
  }

  //subheading section
  function renderSubheadingSection() {
    return (
      <View style={styles.subHeadingContainer}>
        <Text style={styles.subHeadingText}>Create a new password</Text>
      </View>
    );
  }

  //render info section
  function renderTextInfoSection() {
    return (
      <View style={styles.infoContainer}>
        <Text style={styles.warningInfoText}>
          Your new password must be different from previously used password(s).
        </Text>
        <Text style={styles.infoText}>
          This password will be used when you sign-in again
        </Text>
      </View>
    );
  }

  //screen form section
  function renderFormSection() {
    return (
      <View style={styles.formContainer}>
        <View style={styles.formItemContainer}>
          {/*new password item*/}
          <CustomPasswordInput
            name="password"
            control={control}
            placeholder="Password"
            rules={{
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
            }}
            secureTextEntry={true}
          />
        </View>

        {/*confirm password item*/}
        <View style={styles.formItemContainer}>
          <CustomPasswordInput
            name="passwordRepeat"
            control={control}
            placeholder="Confirm password"
            rules={{
              required: "Password confirmation is required",
              validate: (value) => value == pwd || "Password do not match",
              minLength: {
                value: 8,
                message:
                  "Password confirmation must be at least 8 characters long",
              },
            }}
            secureTextEntry={true}
          />
        </View>

        {/*submit action item*/}
        <View style={styles.formSubmitItem}>
          <CustomButton
            onPress={handleSubmit(onResetPasswordPressed)}
            text={
              !loading ? (
                "Reset password"
              ) : (
                <ActivityIndicator size={30} color="white" />
              )
            }
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      {renderScreenHeaderSection()}
      {renderSubheadingSection()}
      {renderTextInfoSection()}
      {renderFormSection()}
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //screen header section
  subHeadingContainer: {
    top: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15,
  },
  subHeadingText: {
    color: COLORS.white,
    fontSize: 26,
    fontFamily: "PoppinsBold",
  },

  //text info section
  infoContainer: {
    top: 50,
    marginHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  warningInfoText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "PoppinsLight",
  },
  infoText: {
    top: 20,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //form container section
  formContainer: {
    top: 100,
    marginHorizontal: 30,
  },
  formItemContainer: {
    marginBottom: 10,
  },
  formSubmitItem: {
    top: 50,
  },
});

export default NewPasswordForgotScreen;
