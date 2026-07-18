import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    job_titles: []
};

const job_title_slice = createSlice({
    name: "job_title",
    initialState,
    reducers: {
        setJobTitle: (state, { payload: { job_titles } }) => {
            state.job_titles = job_titles;
        },
    },
});

export const { setJobTitle } = job_title_slice.actions;

export default job_title_slice.reducer;
