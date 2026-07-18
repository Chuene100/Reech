import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    opportunityImages: {}
};

const opportunity_image_slice = createSlice({
    name: "opportunity_images",
    initialState,
    reducers: {
        setOpportunityImage: (state, { payload: { url, data } }) => {
            return {
                ...state,
                opportunityImages: {
                    ...state.opportunityImages,
                    [url]: data,
                },
            };
        },
        removeOpportunityImages: (state) => {
            state.opportunityImages = {}
        },
    },
});

export const { setOpportunityImage, removeOpportunityImages } = opportunity_image_slice.actions;

export default opportunity_image_slice.reducer;
