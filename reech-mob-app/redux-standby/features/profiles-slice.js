import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user_profiles: []
};

const profiles_slice = createSlice({
    name: "profiles",
    initialState,
    reducers: {
        setProfiles: (state, { payload: { user_profiles } }) => {
            state.user_profiles = user_profiles;
        },
    },
});

export const { setProfiles } = profiles_slice.actions;

export default profiles_slice.reducer;
