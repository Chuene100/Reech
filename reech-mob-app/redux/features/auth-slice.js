import { createSlice } from "@reduxjs/toolkit";
import { USER_CREDENTIALS_KEY, CURRENT_USER_KEY } from "../../constants/auth";
import JWTDecode from "jwt-decode";
import { getCurrentEpoch } from "../../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getExistingUserCredentials = async () => {
  try {
    const userCredentialsString = await AsyncStorage.getItem(
      USER_CREDENTIALS_KEY
    );
    if (!userCredentialsString) {
      throw new Error("Crendetials not found");
    }

    const userCredentialsObject = JSON.parse(userCredentialsString);

    // check if credentials are of the correct shape
    if (
      typeof userCredentialsObject?.access_token !== "string" ||
      typeof userCredentialsObject?.refresh_token !== "string"
    ) {
      throw new Error("Invalid credential data");
    }

    // check if credentials are valid (can at least be refreshed)
    const refreshTokenExp = JWTDecode(userCredentialsObject.refresh_token)?.exp;
    if ((refreshTokenExp ?? 0) < getCurrentEpoch()) {
      throw new Error("Token expired");
    }
  } catch (error) {
    // TODO: handle errors
    return null;
  }
};

const initialState = {
  access_token: "",
  refresh_token: "",
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, { payload: { access_token, refresh_token } }) => {
      state.access_token = access_token;
      state.refresh_token = refresh_token;

      // persist credentials
      AsyncStorage.setItem(
        USER_CREDENTIALS_KEY,
        JSON.stringify({ access_token, refresh_token })
      );
    },
    removeCredentials: (state) => {
      (state.access_token = ""), (state.refresh_token = "");
      AsyncStorage.removeItem(USER_CREDENTIALS_KEY);
      (state.current_user = {});
      AsyncStorage.removeItem(CURRENT_USER_KEY);
    },
  },
});

export const { setCredentials, removeCredentials } = slice.actions;

export default slice.reducer;
