import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    read_users: []
};

const all_user_slice = createSlice({
    name: "allUser",
    initialState,
    reducers: {
        setUsersList: (state, { payload: { read_users } }) => {
            state.read_users = read_users;
        },
    },
});

export const { setUsersList } = all_user_slice.actions;

export default all_user_slice.reducer;
