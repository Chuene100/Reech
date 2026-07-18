import { Image, View } from "react-native";
import React from "react";
import { images } from "../../constants";
import { useSelector } from "react-redux";

const Avatar = ({ avatar }) => {
    const image = useSelector((state) => state.profile_images.profileImages);

    return (
        <View>
            <Image
                source={avatar ?
                    { uri: image[avatar] ?? avatar }
                    : images.defaultRounded}
                resizeMode="cover"
                className={"h-12 w-12 rounded-full"}
            />
        </View>
    )
}

export default Avatar;