import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    bubble_feed: []
};

const bubble_slice = createSlice({
    name: "bubble",
    initialState,
    reducers: {
        setBubbleFeed: (state, { payload: { bubble_feed } }) => {
            state.bubble_feed = bubble_feed;
        },
        updateBubbleFeedLike: (state, { payload: { bubble } }) => {
            const index = state.bubble_feed.findIndex(bub => bub._id === bubble.id);
            const newArray = [...state.bubble_feed];
            newArray[index].experienceLikeArray = bubble.arr;
            newArray[index].experienceLikeCount = bubble.arr.length;

            state.bubble_feed= newArray;
        },
        updateBubbleFeedComment: (state, { payload: { bubble } }) => {
            const index = state.bubble_feed.findIndex(bub => bub._id === bubble.id);
            const newArray = [...state.bubble_feed];
            newArray[index].userComments = bubble.arr;

            state.bubble_feed = newArray;
        },
    },
});

export const { setBubbleFeed, updateBubbleFeedLike, updateBubbleFeedComment } = bubble_slice.actions;

export default bubble_slice.reducer;
