import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

//import dependencies
import { COLORS, images } from "../../constants";
import { CustomInput, CustomButton, AuthHeader } from "../../components";
import { useSendPassowrdVerificationOTPMutation } from "../../redux/api/auth";

const ForgotPasswordScreen = () => {
  //form control: validate
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [sendOTPFn, { isLoading }] = useSendPassowrdVerificationOTPMutation();

  const { height } = useWindowDimensions();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const showError = (res) =>
    Toast.show({
      type: "error",
      text1: "Error",
      text2: res.error.data?.error ?? "Something went wrong. Please try again",
    });

  const onSendResetPressed = (data) => {
    setLoading(true);
    sendOTPFn({ email: data.email })
      .then((res) => {
        setLoading(false);
        if (res.error) {
          showError(res);
          return;
        }
        navigation.navigate("ConfirmForgotEmailScreen", { data: res.data });
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

  //header section
  function renderHeaderSection() {
    return <AuthHeader words={"Forgot password"} />;
  }

  function renderInformationSection() {
    return (
      <>
        <View style={styles.headingTextContainer}>
          <Text style={styles.headingTextItem}>
            Did you forget your password?
          </Text>
        </View>

        <View style={styles.headingTextContainer}>
          <Text style={styles.infoTextItem}>
            Enter your email below to receive a reset code.
          </Text>
        </View>

        <View style={styles.inputContainer}>
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
        </View>

        <View style={styles.reechImageContainer}>
          <Image
            source={loading ? images.rg1 : images.r2}
            style={styles.reechieImage}
          />
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            onPress={handleSubmit(onSendResetPressed)}
            text={
              !loading ? (
                "Continue"
              ) : (
                <ActivityIndicator size={30} color="white" />
              )
            }
          />
        </View>
      </>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeaderSection()}
      {renderInformationSection()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //info section
  headingTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
    marginHorizontal: 15,
    paddingVertical: 15,
  },
  headingTextItem: {
    color: COLORS.white,
    fontSize: 24,
    fontFamily: "PoppinsBold",
  },
  infoTextItem: {
    opacity: 0.6,
    color: COLORS.white,
    fontSize: 15,
    fontFamily: "PoppinsLight",
  },
  inputContainer: {
    marginTop: 40,
    marginHorizontal: 20,
  },
  reechImageContainer: {
    top: Platform.OS === "android" ? 30 : 80,
    alignSelf: "center",
    height: 160,
    width: 160,
  },
  reechieImage: {
    width: 180,
    height: 180,
  },
  buttonContainer: {
    marginTop: Platform.OS === "android" ? 80 : 180,
    marginHorizontal: 15,
    width: 150,
    left: Platform.OS === "ios" ? 250 : 210,
    overflow: "hidden",
    borderRadius: 10,
  },
});

export default ForgotPasswordScreen;
