import { createSlice } from "@reduxjs/toolkit";
import { CURRENT_USER_KEY } from "../../constants/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
    user_email: "",
    user_password: ""
};

const remember_me_slice = createSlice({
    name: "remember_me",
    initialState,
    reducers: {
        setRememberMe: (state, { payload: { user_email, user_password } }) => {
            state.user_email = user_email;
            state.user_password = user_password;

            // persist credentials
            AsyncStorage.setItem(
                CURRENT_USER_KEY,
                JSON.stringify(user_email, user_password)
            );
        },
        removeRememberMe: (state) => {
            state.user_email = "";
            state.user_password = "";
        }
    },
});

export const { setRememberMe, removeRememberMe } = remember_me_slice.actions;

export default remember_me_slice.reducer;