import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    home_feed: []
}

const opportunity_slice = createSlice({
    name: "opportunity",
    initialState,
    reducers: {
        setOpportunitiesList: (state, { payload: {home_feed} }) => {
            state.home_feed = home_feed;
        },
    },
});

export const { setOpportunitiesList } = opportunity_slice.actions;

export default opportunity_slice.reducer;
