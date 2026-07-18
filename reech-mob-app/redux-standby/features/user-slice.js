import { createSlice } from "@reduxjs/toolkit";
import { CURRENT_USER_KEY } from "../../constants/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
    current_user: {}
};

const user_slice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setCurrentUser: (state, { payload: { current_user } }) => {
            state.current_user = current_user;

            // persist credentials
            AsyncStorage.setItem(
                CURRENT_USER_KEY,
                JSON.stringify(current_user)
            );
        },
    },
});

export const { setCurrentUser } = user_slice.actions;

export default user_slice.reducer;
