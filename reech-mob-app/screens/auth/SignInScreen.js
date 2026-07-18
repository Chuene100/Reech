import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  TouchableOpacity
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { Fontisto } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

//import dependencies
import { icons, COLORS } from "../../constants";

//import components
import {
  CustomInput,
  CustomPasswordInputSignIn,
  SocialMediaButtons,
  CustomCheckbox,
} from "../../components";
import { useLoginMutation } from "../../redux/api/auth";
import { useUpdateUserMutation } from "../../redux/api/api-slice";
import { setCurrentUser } from "../../redux/features/user-slice";
import {
  setCredentials,
  removeCredentials,
} from "../../redux/features/auth-slice";
import {
  setRememberMe,
  removeRememberMe,
} from "../../redux/features/remember-me-slice";
import { useSelector, useDispatch } from "react-redux";

const SignInScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  //form control: validate
  const {
    control,
    handleSubmit,
    setValue,
  } = useForm();

  const showError = (res) =>
    Toast.show({
      type: "error",
      text1: "Error",
      text2: res.error.data?.error,
    });

  const [accept, setAccept] = useState(false);
  const [error, setError] = useState("");

  const [loginFn, { isLoading }] = useLoginMutation();

  const user = useSelector((state) => state.user.current_user);
  const email = useSelector((state) => state.remember_me.user_email);
  const password = useSelector((state) => state.remember_me.user_password);

  const [updateUserFn] = useUpdateUserMutation();

  useEffect(() => {
    if (password == "" || email == "") {
      setAccept(false);
    } else {
      setAccept(true);
      setValue("email", email);
      setValue("password", password);
    }
  }, []);

  const onSignInPressed = (data) => {
    if (user?._id) { SignOut(); }

    loginFn(data)
      .then(async (res) => {
        if (res.error) {
          showError(res);
          setError(
            res.error.data?.error ??
            `Something went wrong. Please check your credentials and try again: ${JSON.stringify(res.error)}`
          );
          return;
        }
        setError("");

        dispatch(setCredentials({ ...res?.data?.token }));
        dispatch(setCurrentUser({ current_user: res?.data?.user }));

        if (accept) {
          dispatch(
            setRememberMe({
              user_email: data?.email,
              user_password: data?.password,
            })
          );
        } else {
          dispatch(removeRememberMe());
        }
      })
      .catch((err) => {
        var error =
          err.data?.message ?? "Network error, please try again later";
        setError(error);
      });
  };

  const SignOut = () => {
    const userId = user?._id;
    const body = { isOnline: false };

    updateUserFn({ body, userId })
      .then((res) => {
        if (res.error) {
          console.log(res.error.data?.message);
          return;
        }
        console.log("User logged out successfully. LoginScreen");

        dispatch(removeCredentials());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const rememberMeButton = () => {
    const status = !accept;
    setAccept(status);
    console.log("status: ", status);
  };

  const onForgotPasswordPressed = () => {
    navigation.navigate("ForgotPasswordScreen");
  };

  const onLearnMorePress = () => {
    console.log("learn more pressed");
  };

  const onSignUpPressed = () => {
    navigation.navigate("SignUpScreen");
  };

  //header section 
  function renderHeaderSection() {
    return (
      <View style={styles.headerTopContentContainer}>
        {/*image logo*/}
        <View style={styles.headerLogoContainer}>
          <Image
            source={icons.appIconWhiteAndPurple}
            style={styles.headerLogoItem}
          />
        </View>

        {/*main header text*/}
        <View style={styles.headerTextContentContainer}>
          <Text style={styles.headerTextContentItem}>start reeching...</Text>
        </View>

        {/*sub-header text*/}
        <View style={styles.headerSubTextContentContainer}>
          <Text style={styles.headerSubTextContentItem}>Sign in</Text>
        </View>

        {/*account-header button*/}
        <TouchableOpacity onPress={onSignUpPressed} style={styles.headerAccountTextContentContainer}>
          <Text style={styles.headerAccountTextContentItem}>No account? Click Here</Text>
        </TouchableOpacity>
      </View>
    )
  }

  //form input section
  function renderFormTextInputSection() {
    return (
      <View style={styles.formTextInputContainer}>
        {/*email address input*/}
        <CustomInput
          name="email"
          invalue={email}
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

        {/*password input*/}
        <CustomPasswordInputSignIn
          name="password"
          invalue={password}
          control={control}
          placeholder="Password"
          rules={{
            required: "Password is required",
          }}
          secureTextEntry={true}
        />

        {/*error message prompt*/}
        {error !== "" && (
          <View style={styles.errorMessagePromptContainer}>
            <Text style={styles.errorMessagePromptTextItem}>{error}</Text>
          </View>
        )}
      </View>
    )
  }

  //other account option section
  function renderAccountOtherOptionSection() {
    return (
      <View style={styles.otherOptionContainer}>
        {/*remember me trigger*/}
        <View style={styles.rememberMeButtonContainer}>
          {/*check box icon*/}
          <View style={styles.rememberMeIconContainer}>
            <CustomCheckbox
              onPress={() => rememberMeButton()}
              isChecked={accept}
            />
          </View>

          {/*check box text*/}
          <View style={styles.rememberMeTextContainer}>
            <Text style={styles.rememberMeTextItem}>Remember me. </Text>
            <Text onPress={onLearnMorePress} style={styles.rememberMeLearnTextItem}>Learn more</Text>
          </View>
        </View>

        {/*forgot password section*/}
        <View style={styles.forgotMyPasswordContainer}>
          <Text onPress={onForgotPasswordPressed} style={styles.forgotMyPasswordTextItem}>Forgot password?</Text>
        </View>
      </View>
    )
  }

  //action buttons
  function renderActionButtonSection() {
    return (
      <View style={styles.actionButtonsContainer}>
        {/*continue button item*/}
        <TouchableOpacity
          onPress={handleSubmit(onSignInPressed)}
          style={styles.actionButtonContentContainer}>
          {/*button icon item*/}
          {!isLoading
            ? (
              <Fontisto name="unlocked" size={14} color={COLORS.white} />
            ) : (
              ""
            )
          }

          {/*button text item*/}
          <Text style={styles.actionButtonContentTextItem}>
            {!isLoading
              ? ("Continue") : (
                <ActivityIndicator size={20} color="#9e69c9" />
              )
            }
          </Text>
        </TouchableOpacity>

        {/*or text section*/}
        <View style={styles.orMessagePromptContainer}>
          <Text style={styles.orMessagePromptTextItem}>Or</Text>
        </View>

        {/*continue button item*/}
        <SocialMediaButtons />
      </View>
    )
  }

  //screen content list
  function renderScreenContentList() {
    return (
      <>
        {renderHeaderSection()}
        {renderFormTextInputSection()}
        {renderAccountOtherOptionSection()}
        {renderActionButtonSection()}
      </>
    )
  }

  return (
    <ScrollView
      style={styles.scrollingContainer}
      showsVerticalScrollIndicator={false}
    >
      {renderScreenContentList()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollingContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //header section
  headerTopContentContainer: {
    marginTop: Platform.OS === "ios" ? " 11%" : 0,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  headerLogoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerLogoItem: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  headerTextContentContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextContentItem: {
    color: COLORS.white,
    fontSize: 25,
    fontFamily: "PoppinsLight",
  },
  headerSubTextContentContainer: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  headerSubTextContentItem: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: "PoppinsLight",
  },
  headerAccountTextContentContainer: {
    marginVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  headerAccountTextContentItem: {
    color: COLORS.lightBlue,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //form input section
  formTextInputContainer: {
    paddingHorizontal: 20,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  errorMessagePromptContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  errorMessagePromptTextItem: {
    color: COLORS.purple,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //other option section
  otherOptionContainer: {
    marginTop: 25,
    marginHorizontal: 15,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  rememberMeButtonContainer: {
    width: "100%",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  rememberMeIconContainer: {
    width: Platform.OS === "ios" ? "8%" : "9.5%",
    justifyContent: "center",
  },
  rememberMeTextContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  rememberMeTextItem: {
    color: COLORS.darkGray,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  rememberMeLearnTextItem: {
    color: COLORS.lightBlue,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  forgotMyPasswordContainer: {
    marginTop: 20,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  forgotMyPasswordTextItem: {
    color: COLORS.lightBlue,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },

  //action buttons section
  actionButtonsContainer: {
    marginTop: Platform.OS === "ios" ? 170 : 80,
    paddingHorizontal: 15,
    flexDirection: "column",
  },
  actionButtonContentContainer: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 30,
  },
  actionButtonContentTextItem: {
    marginLeft: 10,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  orMessagePromptContainer: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  orMessagePromptTextItem: {
    color: COLORS.darkGray,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
});

export default SignInScreen;
