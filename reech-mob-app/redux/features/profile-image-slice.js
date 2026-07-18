import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    profileImages: {}
};

const profile_image_slice = createSlice({
    name: "profile_images",
    initialState,
    reducers: {
        setProfileImage: (state, { payload: { url, data } }) => {
            return {
                ...state,
                profileImages: {
                    ...state.profileImages,
                    [url]: data,
                },
            };
        },
        removeProfileImages: (state) => {
            state.profileImages = {}
        },
    },
});

export const { setProfileImage, removeProfileImages } = profile_image_slice.actions;

export default profile_image_slice.reducer;
