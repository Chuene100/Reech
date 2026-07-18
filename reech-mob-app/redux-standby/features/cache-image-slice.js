import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cachedImages: {}
};

const image_cache_slice = createSlice({
    name: "image_cache",
    initialState,
    reducers: {
        setImage: (state, { payload: { url, data } }) => {
            return {
                ...state,
                cachedImages: {
                    ...state.cachedImages,
                    [url]: data,
                },
            };
        }
    },
});

export const { setImage } = image_cache_slice.actions;

export default image_cache_slice.reducer;
