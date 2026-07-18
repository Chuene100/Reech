import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  KeyboardAvoidingView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

//import dependencies
import { COLORS, FONTS } from "../../constants";
import { CustomInputUniqueCode, CustomButton, Header } from "../../components";
import { useSignUpMutation } from "../../redux/api/api-slice";
import {
  useResendVerificationOTPMutation,
  useVerifyOTPMutation,
} from "../../redux/api/auth";

const ConfirmEmailScreen = ({ route }) => {
  //form control: validate
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigation = useNavigation();
  const previousData = route.params.data;
  const [signUpFn, { isLoading: isLoadingSignUp }] = useSignUpMutation();
  const [resendOTPFn, { isLoading: isLoadingResendOTP }] =
    useResendVerificationOTPMutation();
  const [verifyOTP, { isLoading: isLoadingVerifyOTP }] = useVerifyOTPMutation();

  //show error message
  const showError = (res) =>
    Toast.show({
      type: "error",
      text1: "Error",
      text2: res.error.data?.error ?? "Something went wrong. Please try again",
    });

  //sign up user
  const onSignUpPress = (data) => {
    const loc = previousData.location.split("|");
    delete previousData.location;

    const payload = {
      ...previousData,
      otp: data.code,
      address: loc[0],
      location: { type: "Point", coordinates: [loc[2], loc[1]] },
    };

    //verify user info
    verifyOTP(payload)
      .then((verif) => {
        if (verif.error) {
          showError(verif);
          return;
        }
        signUpFn(payload).then((res) => {
          if (res.error) {
            showError(res);
            return;
          }
          navigation.navigate("AuthAddProfileScreen", { user: res.data.data });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //resend otp via email
  const onEmailResendPressed = () => {
    const data = { email: previousData.email };
    resendOTPFn(data)
      .then((res) => {
        Alert.alert(
          "Details",
          "A new code has been sent to your email address! Please enter the code sent 😊."
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //resend otp via mobile number
  const onPhoneResendPressed = () => {
    Alert.alert(
      "Details",
      "A new code has been sent to your phone number! Please enter the code sent 😊."
    );
  };

  //header screen section
  function renderScreenHeaderSection() {
    return (
      <View>
        <Header />
        <View style={styles.content}>
          <Pressable style={styles.goBack}>
            <Ionicons
              name="chevron-back"
              size={26}
              color={COLORS.white}
              onPress={() => navigation.goBack()}
            />
          </Pressable>

          <View style={styles.headingContainer}>
            <Text style={styles.headingText}>Verify your account</Text>
          </View>
        </View>
      </View>
    );
  }

  //subheading content
  function renderSubheadingContent() {
    return (
      <View style={styles.subheadingContainer}>
        <Text style={styles.subheading}>We sent you a 6-digit code</Text>
        <Text style={styles.subheadingText}>Enter it below to verify:</Text>
        <View style={styles.userEmailContainer}>
          <Text style={styles.userEmail}>{previousData.email}</Text>
        </View>
      </View>
    );
  }

  //verification code section
  function renderVerificationCodeSection() {
    return (
      <View style={styles.verificationCodeContainer}>
        <CustomInputUniqueCode
          control={control}
          name="code"
          rules={{
            required: "OTP code is required",
            pattern: {},
          }}
        />

        {/*resend code options*/}
        <View style={styles.resendCodeContainer}>
          <Text style={styles.resendCodeInfoText}>Code expires in 1 hour</Text>
        </View>
      </View>
    );
  }

  //resend button section
  function renderResendButtonSection() {
    return (
      <View style={styles.resendCodeAction}>
        {/*resend via email*/}
        <Pressable onPress={onEmailResendPressed}>
          <CustomButton
            onPress={onEmailResendPressed}
            text="Resend code via email"
            type="RESEND"
          />
        </Pressable>

        {/*resend via mobile number*/}
        {/* <Pressable onPress={onPhoneResendPressed}>
          <CustomButton text="Resend mobile number" type="RESEND" />
        </Pressable> */}
      </View>
    );
  }

  function renderSubmitSection() {
    return (
      <KeyboardAvoidingView behavoir='position' style={styles.submitButtonContainer}>
        <CustomButton
          onPress={handleSubmit(onSignUpPress)}
          text={
            !isLoadingSignUp && !isLoadingResendOTP ? (
              "Sign up"
            ) : (
              <ActivityIndicator size={20} color="white" />
            )
          }
        />
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      {renderScreenHeaderSection()}
      {renderSubheadingContent()}
      {renderVerificationCodeSection()}
      {renderResendButtonSection()}
      {renderSubmitSection()}
    </View>
  );
};

const styles = StyleSheet.create({
  //screen content
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //navigation header
  content: {
    flexDirection: "row",
    marginTop: Platform.OS === "android" ? 70 : 90,
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
    ...FONTS.body3,
  },

  //subheading section
  subheadingContainer: {
    top: 25,
    marginHorizontal: 15,
  },
  subheading: {
    color: COLORS.white,
    fontSize: 26,
    fontFamily: "PoppinsBold",
    alignSelf: "center",
  },
  subheadingText: {
    marginTop: 20,
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "PoppinsLight",
  },
  userEmailContainer: {
    marginTop: 10,
  },
  userEmail: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "PoppinsBold",
  },

  //verification code section
  verificationCodeContainer: {
    top: 45,
    marginHorizontal: 10,
  },
  resendCodeContainer: {
    top: 20,
  },
  resendCodeInfoText: {
    color: COLORS.darkGray,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    left: 5,
  },

  //resend code buttons
  resendCodeAction: {
    top: 90,
    marginHorizontal: 10,
  },

  //render submit button
  submitButtonContainer: {
    top: Platform.OS === "android" ? "36%" : "45%",
    marginHorizontal: 15,
    width: "50%",
  },
});

export default ConfirmEmailScreen;
