import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    bubbleImages: {}
};

const bubble_image_slice = createSlice({
    name: "bubble_images",
    initialState,
    reducers: {
        setBubbleImage: (state, { payload: { url, data } }) => {
            return {
                ...state,
                bubbleImages: {
                    ...state.bubbleImages,
                    [url]: data,
                },
            };
        },
        removeBubbleImages: (state) => {
            state.bubbleImages = {}
        },
    },
});

export const { setBubbleImage, removeBubbleImages } = bubble_image_slice.actions;

export default bubble_image_slice.reducer;
