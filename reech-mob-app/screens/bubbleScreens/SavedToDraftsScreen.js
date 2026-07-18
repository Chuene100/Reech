import React from "react"
import { ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";

//custom 
import { COLORS } from "../../constants";
import NavHeader from "@/components/Headers/NavHeader";

const SavedToDraftsScreen = () => {
    const navigation = useNavigation();

    //header component section
    function renderHeaderSection() {
        return (
            <View style={styles.savedToDraftsHeaderContainer}>
                <NavHeader message={"What would you like to do?"} />

                {/*screen header title*/}
                <View style={styles.screenHeaderTitleContainer}>
                    <Text style={styles.screenHeaderTitleTextItem}>Saved Drafts</Text>
                    <Text style={styles.screenHeaderSubTitleTextItem}>You can conveniently manage all of your saved drafts here. View all of your thoughts and how-to video drafts.</Text>
                </View>
            </View>
        )
    }

    //saved to draft main navigator section
    function renderSavedToDraftsOptionsSection() {
        return (
            <View style={styles.savedToDratsMainNavigatorContainer}>
                {/*saved to how to video drafts*/}
                <TouchableOpacity onPress={() => navigation.navigate("HowToVideoSavedDraftsScreen")}>
                    <ImageBackground
                        blurRadius={4}
                        source={{ uri: "https://images.unsplash.com/photo-1607968565043-36af90dde238?auto=format&fit=crop&q=80&w=1169&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}
                        style={styles.savedToDraftsBackgroundImageContainer}
                    >
                        {/*saved how-to video text header*/}
                        <View style={styles.savedToDraftsTextHeaderContainer}>
                            <Octicons name="video" size={36} color={COLORS.white} />

                            <Text style={styles.savedToDraftsTextHeaderTextItem}>
                                Saved How-to Videos Drafts
                            </Text>

                            <Text style={styles.savedToDraftsTextSubHeaderTextItem}>
                                View all of your previously stored how-to videos and decide whether to edit or remove them.
                            </Text>
                        </View>
                    </ImageBackground>
                </TouchableOpacity>

                {/*saved to thoughts drafts*/}
                <TouchableOpacity onPress={() => navigation.navigate("ThoughtsSavedDraftsScreen")}>
                    <ImageBackground
                        blurRadius={4}
                        source={{ uri: "https://images.unsplash.com/photo-1620662831351-9f68f76d0b9a?auto=format&fit=crop&q=80&w=1170&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}
                        style={styles.savedToDraftsBackgroundImageContainer}
                    >
                        {/*saved how-to video text header*/}
                        <View style={styles.savedToDraftsTextHeaderContainer}>
                            <MaterialCommunityIcons name="thought-bubble" size={36} color={COLORS.white} />

                            <Text style={styles.savedToDraftsTextHeaderTextItem}>
                                Saved Thought Drafts
                            </Text>

                            <Text style={styles.savedToDraftsTextSubHeaderTextItem}>
                                View all of your previously stored thoughts and decide whether to edit or remove them.
                            </Text>
                        </View>
                    </ImageBackground>
                </TouchableOpacity>
            </View>
        )
    }

    //screen content list
    function renderScreenContentList() {
        return (
            <>
                {renderHeaderSection()}
                {renderSavedToDraftsOptionsSection()}
            </>
        )
    }

    return (
        <View style={styles.savedToDraftsContainer}>
            {renderScreenContentList()}
        </View>
    )
}

const styles = StyleSheet.create({
    savedToDraftsContainer: {
        flex: 1,
        backgroundColor: COLORS.black
    },
    savedToDraftsHeaderContainer: {
        marginTop: Platform.OS === "ios" ? "10%" : 0,
    },
    screenHeaderTitleContainer: {
        marginTop: 15,
        paddingHorizontal: 20,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    screenHeaderTitleTextItem: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: "PoppinsBold",
        marginBottom: 5,
    },
    screenHeaderSubTitleTextItem: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsLight",
        textAlign: "center",
    },

    //saved to draft option section
    savedToDratsMainNavigatorContainer: {
        marginTop: 20,
        flexDirection: "column",
    },
    savedToDraftsBackgroundImageContainer: {
        width: "100%",
        height: Platform.OS === "ios" ? 300 : 280,
        resizeMode: "cover",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        overflow: "hidden",
        marginBottom: 20,
    },
    savedToDraftsTextHeaderContainer: {
        paddingHorizontal: 20,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    savedToDraftsTextHeaderTextItem: {
        marginVertical: 10,
        color: COLORS.white,
        fontSize: 16,
        fontFamily: "PoppinsBold",
    },
    savedToDraftsTextSubHeaderTextItem: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsLight",
        textAlign: "center",
    },
});

export default SavedToDraftsScreen;