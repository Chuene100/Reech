import React from "react";
import { Pressable, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants";


const ChatMessageInput = ({ handleChange, handleSubmit, reply }) => {
    return (
        <View className={`flex flex-row items-center bg-slate-400/20 py-3 px-5 z-20  rounded-full`}>
            <Ionicons
                name="attach"
                size={26}
                color={COLORS.white}
            />
            <TextInput
                onChangeText={handleChange}
                value={reply}
                autoCorrect={false}
                placeholder="Type your message..."
                placeholderTextColor={COLORS.white}
                className={`text-white grow max-w-70`}
                enablesReturnKeyAutomatically
            />
            <Pressable onPress={handleSubmit}>
                <Ionicons
                    name="send"
                    size={26}
                    color={COLORS.white}
                    className={`fixed`}
                />
            </Pressable>
        </View>
    )
}

export default ChatMessageInput;
