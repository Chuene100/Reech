import React from "react";
import { Platform, StyleSheet, View } from "react-native";

//import customs
import { COLORS } from "../../constants";
import { ComingSoonInAppScreen } from "../../components";
import NavHeader from "@/components/Headers/NavHeader";

const ReechRileyLibraryImageSelectorScreen = () => {
    //header section
    function renderHeaderComponent() {
        return (
            <View style={styles.headerComponentContainer}>
                <NavHeader
                    message="What would you like to do?"
                />
            </View>
        );
    }

    function renderComingSoon() {
        return (
            <ComingSoonInAppScreen />
        );
    }

    return (
        <View style={styles.container}>
            {renderHeaderComponent()}
            {renderComingSoon()}
        </View>
    );
};

{
    /* custom styles */
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    headerComponentContainer: {
        marginTop: Platform.OS === "ios" ? "10%" : "0%",
    },
});

export default ReechRileyLibraryImageSelectorScreen;
