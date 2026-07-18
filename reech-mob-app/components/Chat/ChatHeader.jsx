import { Text, View } from "react-native"
import Avatar from "./Avatar";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants";
import React from "react";

const ChatHeader = ({ name, avatar }) => {
    return (
        <View className={"flex flex-row items-center grow"}>
            <Avatar avatar={avatar} />
            <View className={"flex flex-row w-4/5 justify-between"}>
                <View className={"ml-2"}>
                    <Text className={"text-white font-bold text-4"}>{name}</Text>
                    <Text className={"text-xs text-slate-300"}>Online</Text>
                </View>
                {/* <View>
                    <Ionicons
                        name="menu-outline"
                        size={26}
                        color={COLORS.white}
                        className={"fixed"}
                    />
                </View> */}
            </View>

        </View>
    )
}

export default ChatHeader;