// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback } from "react";
import { LogBox, StatusBar, AppState, View, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigation from "./navigation/AppNavigation";
import { EventRegister } from "react-native-event-listeners";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { darkMode, themeContext } from "./constants";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
// @ts-ignore
import "intl";
// @ts-ignore
import "intl/locale-data/jsonp/en";
// @ts-ignore
import { styled, withExpoSnack } from "nativewind";

//import customs
import { useSelector } from "react-redux";
import { useUpdateUserMutation } from "./redux/api/api-slice";

///__________________Tracking database changes__________________
import io from "socket.io-client";
import { SocketProvider } from "./utils/socket";
const SOCKET_SERVER_URL = "https://reech-node-api-7o3szyfdpq-uc.a.run.app/";
//`${process.env.REACT_APP_API_URL}${process.env.MAIN_API_BASE_PATH}`;

const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "green", backgroundColor: "#333" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        ...props.text1Style,
        color: "white",
      }}
      text2Style={{
        ...props.text2Style,
        color: "white",
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "red", backgroundColor: "#333" }}
      text1Style={{
        ...props.text1Style,
        color: "white",
      }}
      text2Style={{
        ...props.text2Style,
        color: "white",
      }}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  tomatoToast: ({ text1, props }) => (
    <View style={{ height: 60, width: "100%", backgroundColor: "tomato" }}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  ),
};

const UserStatus = () => {
  //App is open or closed, to change the user status(Online/Offline)
  const appState = useRef(AppState.currentState);
  // @ts-ignore
  const [isInApp, setIsInApp] = useState(appState.current);

  // @ts-ignore
  const user = useSelector((state) => state.user.current_user);
  const [updateUserFn] = useUpdateUserMutation();

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      _handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  });

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      if (user?._id) updateUserOnlineStatus(true);
    } else {
      if (user?._id) updateUserOnlineStatus(false);
    }

    appState.current = nextAppState;
    setIsInApp(appState.current);
  };

  const updateUserOnlineStatus = (online) => {
    const userId = user?._id;
    const body = { isOnline: online };

    updateUserFn({ body, userId })
      .then((res) => {
        // @ts-ignore
        if (res.error) {
          // @ts-ignore
          console.log(res.error.data?.message);
          return;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    const connectSocket = async () => {
      const socket = io(SOCKET_SERVER_URL, {
        transports: ["websocket"],
        query: {
          _id: user?._id,
        },
        extraHeaders: {
          "Svc-Tkn": `Bearer ${process.env.SvcTkn_Main_API}`,
        },
      });
      socket.on("connect", () => {
        setInterval(() => {
          socket.emit(`heartbeat`, { userId: user?._id });
        }, 5000);
      });
    };
    connectSocket();
  }, [user]);

  return <></>;
};

// SplashScreen.preventAutoHideAsync();

const App = () => {
  //dark mode theme
  const [mode, setMode] = useState(false);

  useEffect(() => {
    const eventListener = EventRegister.addEventListener(
      "changeTheme",
      (data) => {
        setMode(data);
        console.log(data);
      }
    );
    return () => {
      // @ts-ignore
      EventRegister.removeEventListener(eventListener);
      // eventListener.remove()
    };
  });

  //disable yellow warning messages
  LogBox.ignoreAllLogs();

  //define app theme
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      border: "transparent",
    },
  };

  //load app fonts
  const [fontsLoaded] = useFonts({
    // @ts-ignore
    PoppinsBlack: require("./assets/fonts/Poppins-Black.ttf"),
    // @ts-ignore
    PoppinsBold: require("./assets/fonts/Poppins-Bold.ttf"),
    // @ts-ignore
    PoppinsItalic: require("./assets/fonts/Poppins-Italic.ttf"),
    // @ts-ignore
    PoppinsLight: require("./assets/fonts/Poppins-Light.ttf"),
    // @ts-ignore
    PoppinsMedium: require("./assets/fonts/Poppins-Medium.ttf"),
    // @ts-ignore
    PoppinsRegular: require("./assets/fonts/Poppins-Regular.ttf"),
    // @ts-ignore
    PoppinsThin: require("./assets/fonts/Poppins-Thin.ttf"),
  });

  const onAppLayoutView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!onAppLayoutView) {
    return null;
  }

  return (
    <>
      <Provider store={store}>
        <SocketProvider>
          <UserStatus />
          <SafeAreaProvider>
            <themeContext.Provider
              value={mode === true ? darkMode.dark : darkMode.light}
            >
              <NavigationContainer theme={theme}>
                {/* <AppNavigation onLayout={onAppLayoutView} /> */}
                <AppNavigation />
                <StatusBar
                  // @ts-ignore
                  style="dark" hidden />
              </NavigationContainer>
            </themeContext.Provider>
          </SafeAreaProvider>
        </SocketProvider>
      </Provider>
      <Toast config={toastConfig} />
    </>
  );
};

export default withExpoSnack(App);
