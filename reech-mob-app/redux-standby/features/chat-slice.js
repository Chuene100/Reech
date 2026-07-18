import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    chat_rooms: [],
    chat_messages: []
}

const chat_slice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setChatRoomsList: (state, {payload: {chat_rooms}}) => {
            state.chat_rooms = chat_rooms;
        }
    }
});

export const { setChatRoomsList } = chat_slice.actions;

export default chat_slice.reducer;