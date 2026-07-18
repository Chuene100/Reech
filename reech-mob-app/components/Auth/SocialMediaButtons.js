import React from "react";
import { Alert, ActivityIndicator } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { COLORS } from "../../constants";
import CustomButton from "./CustomButton";
import Toast from "react-native-toast-message";

import { useGoogleLoginMutation } from "../../redux/api/auth";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/auth-slice";
import { setCurrentUser } from "../../redux/features/user-slice";

import * as WebBrowser from "expo-web-browser";

import * as Google from "expo-auth-session/providers/google";
import * as AppleAuthentication from "expo-apple-authentication";
import jwtDecode from "jwt-decode";

WebBrowser.maybeCompleteAuthSession();

const SocialMediaButtons = () => {
  const dispatch = useDispatch();

  const [googleLoginFn, { isLoading }] = useGoogleLoginMutation();

  const showError = (res) =>
    Toast.show({
      type: "error",
      text1: "Error",
      text2: res.error.data?.error ?? "Something went wrong. Please try again",
    });

  const Signin = async ({ email }) => {
    const data = { email };

    googleLoginFn(data)
      .then(async (res) => {
        if (res.error) {
          showError(res);
          // var error = res.error?.message ?? "Something went wrong. Please try again";
          // Alert.alert("Google signin Error", error);
          return;
        }

        dispatch(setCredentials({ ...res?.data?.token }));
        dispatch(setCurrentUser({ current_user: res?.data?.user }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  ////___________________Google Login___________________________
  /*
  const [_, __, promptAsync] = Google.useAuthRequest({
    expoClientId: process.env.EXPO_CLIENT_ID
  });

  const onSignInGooglePressed = async () => {

    var response = await promptAsync();
    
  if (response?.type === "success") {
    const { access_token } = response.params;

    const user = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    user
      .json()
      .then((info) => {
        var email = info.email;
        var user_name = info.name;

        Alert.alert(
          `Hi ${user_name}`,
          "Is this you? if this is you please click ok to continue.",
          [
            {
              text: "This is not me",
              onPress: () => { },
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => {
                Signin({ email });
              },
            },
          ]
        );
      })
      .catch((err) => {
        console.log(err);
        Alert.alert(
          "Google signin Error",
          "Error while signing you in, please try again later!"
        );
      });
  }
  };
  */

  ////________________________Apple Login____________________________
  const onSignInApplePressed = async () => {
    const userToken = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      ],
    });

    if (userToken.identityToken) {
      try {
        const credentials = await jwtDecode(userToken.identityToken);

        if (credentials.email_verified) {
          var email = credentials.email;

          Alert.alert(
            `Hi`,
            `You are about to signin to Reech, as \nemail: ${email} \nplease click OK to continue.`,
            [
              {
                text: "This is not me",
                onPress: () => { },
                style: "cancel",
              },
              {
                text: "OK",
                onPress: () => {
                  Signin({ email });
                },
              },
            ]
          );
        } else {
          throw new Error("User not verified");
        }
      } catch (error) {
        Alert.alert(
          "Apple Sign-in Error",
          error ?? "Error while signing you in. Please try again later!"
        );
      }
    } else {
      console.log("Apple login failed");
    }
  };

  return (
    <>
      <CustomButton
        //onPress={onSignInGooglePressed}
        text={
          !isLoading ? (
            "   Sign in with Google"
          ) : (
            <ActivityIndicator size={14} color="#9e69c9" />
          )
        }
        type="TRANSPARENT"
        icon={
          !isLoading ? (
            <AntDesign name="google" size={14} color={COLORS.white} />
          ) : (
            ""
          )
        }
      />
      <CustomButton
        onPress={onSignInApplePressed}
        text="    Sign in with Apple"
        type="TRANSPARENT"
        icon={<AntDesign name="apple1" size={14} color={COLORS.white} />}
      />
    </>
  );
};

export default SocialMediaButtons;
