import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    current_profile: {}
};

const current_profile_slice = createSlice({
    name: "currentProfile",
    initialState,
    reducers: {
        setCurrentProfile: (state, { payload: { current_profile } }) => {
            state.current_profile = current_profile;
        },
        removeCurrentProfile: (state) => {
            state.current_profile = {}
        },
    },
});

export const { setCurrentProfile, removeCurrentProfile } = current_profile_slice.actions;

export default current_profile_slice.reducer;
