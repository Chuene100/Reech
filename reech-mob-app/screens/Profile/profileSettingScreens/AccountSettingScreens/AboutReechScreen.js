import React from 'react'
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

//custom 
import { COLORS } from "../../../../constants";
import NavHeader from "@/components/Headers/NavHeader";


const AboutReechScreen = () => {
    //header section
    function renderHeaderSection() {
        return (
            <View style={styles.headerComponentItemContainer}>
                <NavHeader message="What would you like to do?" />

                {/*header text section*/}
                <View style={styles.headerSectionContentContainer}>
                    <Text style={styles.headerSectionContentTextItem}>
                        Reech for {Platform.OS === "ios" ? "iOS" : "Android"}
                    </Text>
                </View>
            </View>
        )
    }

    //screen content section
    function renderScreenContentSection() {
        return (
            <View style={styles.screenAboutContentContainer}>
                {/* about reech intro bio*/}
                <View style={styles.screenBioContainer}>
                    <Text style={styles.screenBioTextItem}>
                        We prioritize individuals and respect workmanship and simplicity
                        in our work. Our employees stimulate creativity all across the
                        world, assisting over 100,000 people in creating and sharing content.
                        Join us now!
                    </Text>
                </View>

                {/*app version section*/}
                <View style={styles.aboutAppItemContainer}>
                    <Text style={styles.aboutAppHeaderTextItem}>
                        App Version
                    </Text>
                    <Text style={styles.aboutAppInfoTextItem}>
                        1.0.0
                    </Text>
                </View>

                {/*app rights section*/}
                <View style={styles.aboutAppItemContainer}>
                    <Text style={styles.aboutAppHeaderTextItem}>
                        App Rights
                    </Text>
                    <Text style={styles.aboutAppInfoTextItem}>
                        Reech and the Reech logos are trademarks of Reecheble (Pty) Ltd. All rights reserved.
                    </Text>
                </View>

                {/*app development section*/}
                <View style={styles.aboutAppItemContainer}>
                    <Text style={styles.aboutAppHeaderTextItem}>
                        App Build
                    </Text>
                    <Text style={styles.aboutAppInfoTextItem}>
                        Reech for {Platform.OS === "ios" ? "iOS" : "Android"} is built using open source software:
                        <Text onPress={
                            () => console.log("navigate user to license screen - where we show all the libraries we used such as servers, framework, etc.")}
                            style={styles.aboutAppInfoLinkTextItem}>
                            {" "}license
                        </Text>
                        <TouchableOpacity

                        >

                        </TouchableOpacity>
                    </Text>
                </View>

                {/*app version section*/}
            </View>
        )
    }

    return (
        <View style={styles.aboutScreenContainer}>
            {renderHeaderSection()}
            {renderScreenContentSection()}
        </View>
    )
}

const styles = StyleSheet.create({
    aboutScreenContainer: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    headerComponentItemContainer: {
        marginTop: Platform.OS === "ios" ? "10%" : "0%",
    },
    headerSectionContentContainer: {
        marginVertical: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    headerSectionContentTextItem: {
        color: COLORS.white,
        fontSize: 28,
        fontFamily: "PoppinsLight"
    },

    //screen about content
    screenAboutContentContainer: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingHorizontal: 40,
    },
    screenBioContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 40,
    },
    screenBioTextItem: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsLight",
        textAlign: "center",
    },
    aboutAppItemContainer: {
        flexDirection: "column",
        marginBottom: 30,
    },
    aboutAppHeaderTextItem: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: "PoppinsBold",
        marginRight: 10,
        marginBottom: 5,
    },
    aboutAppInfoTextItem: {
        color: COLORS.white,
        fontSize: 14,
        fontFamily: "PoppinsLight"
    },
    aboutAppInfoLinkTextItem: {
        color: COLORS.lightBlue,
        fontSize: 14,
        fontFamily: "PoppinsLight",
    },
})

export default AboutReechScreen

