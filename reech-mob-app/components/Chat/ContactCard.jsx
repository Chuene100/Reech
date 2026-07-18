import React from "react";
import { Pressable, Text, View } from "react-native";
import BoxAvatar from "./BoxAvatar";

const ContactCard = ({ contact, handleChat }) => {
    return (
        <Pressable onPress={handleChat}>
            <View className={`flex flex-row bg-slate-500/20 mx-2 rounded-lg my-1 p-3`}>
                <BoxAvatar user={contact} />

                <View className={`ml-2 flex justify-center`}>
                    <Text className={`text-white font-bold text-4`}>{`${contact.firstName} ${contact.lastName}`}</Text>
                </View>
            </View>
        </Pressable>
    )
}

export default ContactCard;