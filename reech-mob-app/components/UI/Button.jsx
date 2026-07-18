import React from "react"
import { ActivityIndicator, Pressable, Text, View } from "react-native"

const Button = ({onPress, text, type = "PRIMARY", bgColor, fgColor, icon, isLoading = false, from}) => {
    const textClasses = {
        BUBBLE : 'text-purple',
        ACTIVE : 'text-greenActive',
        REQUEST : 'text-orange',
        MATE : 'text-darkGray',
        TERTIARY : 'text-lightBlue',
        RESEND : 'text-lightBlue',
        GENERAL : '',
        DANGER : 'text-white',
        WHITE : 'text-purple',
        WELCOME : 'text-white',
        TRANSACTION : 'text-darkGray',
        ACCOUNT : 'text-white',
        PRIMARY : '',
    }
    const containerClasses = {
        BUBBLE : 'bg-transparent',
        ACTIVE : 'bg-transparent',
        REQUEST : 'bg-transparent',
        MATE : 'bg-transparent',
        TERTIARY : '',
        RESEND : 'items-start my-[-4]',
        GENERAL : 'bg-darkGray',
        DANGER : 'text-white',
        WHITE : 'bg-white',
        WELCOME : 'bg-white',
        TRANSACTION : 'bg-darkGray border-2 rounded-lg',
        ACCOUNT : 'bg-transparent',
        ACCOUNTBUBBLE : 'justify-center items-center bg-transparent border-2 border-darkGray rounded-lg',
        PRIMARY : 'bg-purple',
        SECONDARY : 'bg-purple',
        YES : 'bg-purple',
        NO : 'bg-darkGray',
    }
    
    return (
        <Pressable
            onPress={onPress}
            className='w-full h-[50] p-5 my-8 items-center justify-center text-center rounded-lg z-30'
            disabled={isLoading}
        >
            {isLoading ? (
                <ActivityIndicator
                    size={30}
                    color={from === "default" ? "#fff" : "#9e69c9"}
                />
            ) : (
                <View style={{flexDirection: "row"}}>
                    <Text>{icon}</Text>
                    <Text
                        className={`text-[14] font-[600] text-white 
                            ${`${textClasses[type]}`} 
                            ${fgColor ? `text-${fgColor}` : ''}
                        `}
                        
                    >
                        {text}
                    </Text>
                </View>
            )}
        </Pressable>
    );
}

export default Button;