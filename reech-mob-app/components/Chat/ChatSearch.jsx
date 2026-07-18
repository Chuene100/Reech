import React from "react";
import { TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants";

const ChatSearch = ({ handleChange }) => {
    return (
        <View className={`flex flex-row items-center bg-slate-400/20 py-3 px-5  rounded-full`}>
            <TextInput
                onChangeText={handleChange}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Search"
                placeholderTextColor={COLORS.white}
                className={`text-white grow max-w-full`}
                enablesReturnKeyAutomatically
            />
            <Ionicons
                name="search"
                size={20}
                color={COLORS.white}
                className={`fixed`}
            />
        </View>
    )
}

export default ChatSearch;
