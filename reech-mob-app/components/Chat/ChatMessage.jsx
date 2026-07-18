import React from "react";
import moment from "moment";
import { View, Text } from "react-native";

const ChatMessage = ({ color, textColor, classnames, item }) => {
    return (
        <View className={`${classnames} flex flex-col`}>
            <View className={`flex flex-col w-fit max-w-3/4 py-1`}>
                <View className={`${color} rounded-b-lg p-2`}>
                    <Text className={`text-sm ${textColor}`}>{item.message}</Text>
                </View>
                <Text className={"text-slate-300 text-xs self-end italic"}>{moment(item.createdAt).format('HH:mm')}</Text>
            </View>
        </View>
    )

}

export default ChatMessage;