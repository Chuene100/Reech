import React from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Platform,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

//import components
import { COLORS, FONTS } from "../../constants";
import {
  CustomPasswordInput,
  CustomButton,
  AuthHeader,
} from "../../components";
import { useSendVerificationOTPMutation } from "../../redux/api/auth";

const PasswordScreen = ({ route }) => {
  //form control: validate
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const pwd = watch("password");
  const navigation = useNavigation();

  const previousData = route.params.data;

  const [sendOTPFn, { isLoading }] = useSendVerificationOTPMutation();

  const showError = (res) =>
    Toast.show({
      type: "error",
      text1: "Error",
      text2: res.error.data?.error ?? "Something went wrong, Please try again.",
    });

  const onNextPressed = (data) => {
    var password = data.password;
    const newData = { password, ...previousData };

    sendOTPFn({ email: newData.email })
      .then((res) => {
        if (res.error) {
          showError(res);
          return;
        }
        navigation.navigate("ConfirmEmailScreen", {
          data: newData,
        });
      })
      .catch((err) => {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Something went wrong. Please try again.",
        });
      });
  };

  const onTermsOfUsePress = () => {
    navigation.navigate("TermsScreen");
  };

  const onPrivacyPolicyPress = () => {
    navigation.navigate("PolicyScreen");
  };

  //header section
  function renderHeaderSection() {
    return <AuthHeader words={"Customise your account"} />;
  }

  //subheading section
  function renderSubheadingSection() {
    return (
      <View style={styles.subheadingContent}>
        <Text style={styles.subheadingText}>Enter password</Text>
      </View>
    );
  }

  //form section
  function renderFormSection() {
    return (
      <View style={styles.formContainer}>
        {/*initial password*/}
        <View style={styles.formContent}>
          <Text style={styles.formHeadingText}>
            Make sure it's 8 characters or more
          </Text>

          <CustomPasswordInput
            name="password"
            control={control}
            placeholder=""
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

        {/*confirm password*/}
        <View style={styles.formContent}>
          <Text style={styles.formHeadingText}>Re-enter password</Text>

          <CustomPasswordInput
            name="passwordRepeat"
            control={control}
            placeholder=""
            rules={{
              required: "Password confirmation is required",
              validate: (value) => value == pwd || "Passwords do not match",
              minLength: {
                value: 8,
                message:
                  "Password confirmation must be at least 8 characters long",
              },
            }}
            secureTextEntry={true}
          />
        </View>
      </View>
    );
  }

  //form action section
  function renderActionSection() {
    return (
      <View style={styles.actionContainer}>
        {/*terms & condition*/}
        <Text style={styles.actionText}>
          By signing up, you agree to the
          <Text onPress={onTermsOfUsePress} style={styles.actionHyperlink}>
            {" "}
            Terms of service
          </Text>{" "}
          and
          <Text onPress={onPrivacyPolicyPress} style={styles.actionHyperlink}>
            {" "}
            Privacy Policy.
          </Text>
        </Text>

        {/*action button*/}
        <View style={styles.actionButton}>
          <CustomButton
            onPress={handleSubmit(onNextPressed)}
            text={
              !isLoading ? (
                "Next"
              ) : (
                <ActivityIndicator size={20} color="white" />
              )
            }
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeaderSection()}
      {renderSubheadingSection()}
      {renderFormSection()}
      {renderActionSection()}
    </View>
  );
};

const styles = StyleSheet.create({
  //screen content
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //subheading text
  subheadingContent: {
    top: 25,
    marginHorizontal: 15,
  },
  subheadingText: {
    color: COLORS.white,
    fontSize: 25,
    fontFamily: "PoppinsBold",
  },

  //form section
  formContainer: {
    marginHorizontal: 15,
  },
  formContent: {
    top: 50,
    marginBottom: 10,
    flexDirection: "column",
  },
  formHeadingText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "PoppinsLight",
  },

  //form action section
  actionContainer: {
    top: Platform.OS === "android" ? "38%" : "45%",
    marginHorizontal: 15,
  },
  actionText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
    alignSelf: "center",
  },
  actionHyperlink: {
    color: COLORS.lightBlue,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  actionButton: {
    top: 10,
    width: "48%",
    alignSelf: "flex-end",
  },
});

export default PasswordScreen;
