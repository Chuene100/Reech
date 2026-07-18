import { Text } from "react-native"

const ErrorMessage = ({error}) => {
    <Text
        className={`text-purple self-stretch font-[${SIZES.body5}] p-[${SIZES.padding - 22}] mx-[${SIZES.padding}] pb-[10]`}
    >
        {error.message || "Oops, something went wrong!"}
    </Text>
}

export default ErrorMessage;