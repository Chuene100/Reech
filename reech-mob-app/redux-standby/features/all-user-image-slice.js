import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    usersImages: {}
};

const users_image_slice = createSlice({
    name: "users_images",
    initialState,
    reducers: {
        setUsersImage: (state, { payload: { url, data } }) => {
            return {
                ...state,
                usersImages: {
                    ...state.usersImages,
                    [url]: data,
                },
            };
        },
        removeUsersImages: (state) => {
            state.usersImages = {}
        },
    },
});

export const { setUsersImage , removeUsersImages} = users_image_slice.actions;

export default users_image_slice.reducer;
