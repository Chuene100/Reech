import React from "react";
import { StyleSheet, View, Text, Platform } from "react-native";

//import customs
import { COLORS } from "../../constants";
import { ComingSoonInAppScreen } from "../../components";
import NavHeader from "@/components/Headers/NavHeader";

const LoggedInBubbleProfileNotesScreen = ({ route }) => {

    const { profile } = route.params;

    //header section
    function renderHeaderComponent() {
        return (
            <View style={styles.headerComponentContainer}>
                <NavHeader message="What would you like to do?" />
            </View>
        );
    }

    //header section
    function renderHeaderSection() {
        return (
            <View style={styles.headerContentContainer}>
                <Text style={styles.headerTextItem}>{profile?.jobTitleId?.jobTitle} Notes</Text>
            </View>
        );
    }

    function renderComingSoon() {
        return (
            <View style={styles.comingSoon}>
                <ComingSoonInAppScreen />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {renderHeaderComponent()}
            {renderHeaderSection()}
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

    //header text
    headerContentContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: Platform.OS === "ios" ? 20 : 20,
    },
    headerTextItem: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: "PoppinsBold",
    },
    comingSoon: {
        justifyContent: "center",
        alignItems: "center",
    },
});

export default LoggedInBubbleProfileNotesScreen;
