import React, { useState } from "react";
import { FlatList, Image, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Entypo, FontAwesome, Octicons } from "@expo/vector-icons";

//custom 
import { howToSavedDraftsData } from "../../../assets/data/savedToDraftsData";
import { COLORS } from "../../../constants";
import EmptyFlatlistComponent from "../../../components/EmptyFlatlistComponent";
import NavHeader from "@/components/Headers/NavHeader";

const HowToVideoSavedDraftsScreen = () => {
    const [data, setData] = useState(howToSavedDraftsData);

    const onVideoRemoveAllPressed = () => {
        setData([]);
    }

    const onEditVideoItemPressed = (item) => {
        console.log("edit saved draft thoughts pressed: ", item)
    }

    const onDeleteVideoItemPressed = (item) => {
        const itemIndex = data.findIndex((dataItem) => dataItem.id === item.id);

        if (itemIndex !== -1) {
            const newData = [...data];
            newData.splice(itemIndex, 1);

            setData(newData);
        }
    }

    //header section
    function renderHowToVideoDraftHeaderSection() {
        return (
            <View style={styles.headerHowToVideoDraftContainer}>
                <NavHeader message="What would you like to do?" />

                <View style={styles.headerHowToVideoDraftTitleContainer}>
                    <Text style={styles.headerHowToVideoDraftTitleTextItem}>
                        Manage all your saved how-to video drafts here.
                    </Text>
                </View>
            </View>
        )
    }

    //thought saved draft section
    function renderVideoDraftHeaderSection() {
        return (
            <View style={styles.videoDraftsItemMainContainer}>
                {/*drafts heading section*/}
                <View style={styles.draftsHeaderContainer}>
                    {/*title section*/}
                    <View style={styles.draftsHeadersContentContainer}>
                        <Octicons name="video" size={16} color={COLORS.white} />
                        <Text style={styles.draftsHeaderTextItem}>Saved drafts</Text>
                    </View>

                    {/*remove section*/}
                    <TouchableOpacity
                        onPress={onVideoRemoveAllPressed}
                        style={styles.draftsHeadersActionContentContainer}
                    >
                        <Text style={styles.draftsHeaderActionTextItem}>Remove all</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    //video drafts list  section
    function renderVideoDraftsListSection() {
        return (
            <View style={styles.draftContentContainer}>
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.draftItemContainer}>
                                <View style={styles.draftItemContentContainer}>
                                    <ImageBackground
                                        blurRadius={4}
                                        source={{ uri: "https://images.unsplash.com/photo-1576341566227-fdabf2791690?auto=format&fit=crop&q=80&w=1171&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}
                                        style={styles.draftMediaFileItem}
                                    >
                                        {/*remove and edit section*/}
                                        <View style={styles.draftItemActionContainer}>
                                            {/*edit item action*/}
                                            <TouchableOpacity onPress={() => onEditVideoItemPressed(item)} style={styles.draftEditItemContainer}>
                                                <FontAwesome name="pencil-square-o" size={14} color={COLORS.white} />
                                            </TouchableOpacity>

                                            {/*delete item action*/}
                                            <TouchableOpacity onPress={() => onDeleteVideoItemPressed(item)} style={styles.draftDeleteItemContainer}>
                                                <Entypo name="trash" size={14} color={COLORS.white} />
                                            </TouchableOpacity>
                                        </View>

                                        {/*thought title section*/}
                                        <View style={styles.draftTitleItemContainer}>
                                            <Text numberOfLines={2} style={styles.draftTitleItemText}>{item.title}</Text>
                                        </View>

                                        {/*draft created section*/}
                                        <View style={styles.draftItemCreatedAtContainer}>
                                            <Text style={styles.draftItemCreatedAtTextItem}>{item.createdAt}</Text>
                                        </View>

                                        {/*profile poster section*/}
                                        <View style={styles.draftProfileContainer}>
                                            <Image source={{ uri: item.profileImage }} style={styles.draftProfileImageItem} />
                                            <Text style={styles.draftProfileTitleTextItem}>Post as: </Text>
                                            <Text style={styles.draftProfileTitleNameTextItem}>{item.profileTitle}</Text>
                                        </View>
                                    </ImageBackground>
                                </View>
                            </View>
                        )
                    }}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={<View style={styles.draftListFooterItem} />}
                    ListEmptyComponent={<EmptyFlatlistComponent msg={"You have not saved any drafts as yet."} />}
                />
            </View>
        )
    }

    return (
        <View style={styles.savedToDraftsContainer}>
            {renderHowToVideoDraftHeaderSection()}
            {renderVideoDraftHeaderSection()}
            {renderVideoDraftsListSection()}
        </View>
    )
}

const styles = StyleSheet.create({
    savedToDraftsContainer: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    headerHowToVideoDraftContainer: {
        marginTop: Platform.OS === "ios" ? "10%" : 0,
    },
    headerHowToVideoDraftTitleContainer: {
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    headerHowToVideoDraftTitleTextItem: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsLight",
    },
    draftListFooterItem: {
        marginBottom: Platform.OS === "ios" ? "45%" : "30%",
    },

    //video draft items section
    videoDraftsItemMainContainer: {
        marginVertical: 10,
        paddingHorizontal: 15,
        flexDirection: "column",
    },
    draftsHeaderContainer: {
        width: "100%",
        height: 30,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    draftsHeadersContentContainer: {
        width: "50%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    draftsHeadersActionContentContainer: {
        width: "50%",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    draftsHeaderTextItem: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: "PoppinsBold",
        marginLeft: 5,
    },
    draftsHeaderActionTextItem: {
        color: COLORS.coralRed,
        fontSize: 12,
        fontFamily: "PoppinsLight",
        marginLeft: 5,
    },

    //draft content section
    draftContentContainer: {
        flexDirection: "row",
    },
    draftItemContainer: {
        flexWrap: "wrap",
    },
    draftItemContentContainer: {
        margin: 5,
    },
    draftMediaFileItem: {
        width: Platform.OS === "ios" ? 205 : 168,
        height: 188,
        resizeMode: "cover",
        borderRadius: 8,
        overflow: "hidden",
    },
    draftItemActionContainer: {
        width: "100%",
        marginTop: 5,
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    draftEditItemContainer: {
        width: 25,
        height: 25,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 25,
        backgroundColor: COLORS.darkGray,
    },
    draftDeleteItemContainer: {
        width: 25,
        height: 25,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 25,
        backgroundColor: COLORS.coralRed,
    },
    draftTitleItemContainer: {
        height: 80,
        marginTop: 10,
        paddingHorizontal: 5,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.reechGray,
    },
    draftTitleItemText: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsBold",
        textAlign: "center",
    },
    draftItemCreatedAtContainer: {
        marginTop: 5,
        paddingHorizontal: 5,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    draftItemCreatedAtTextItem: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsBold",
    },

    //profile poster section
    draftProfileContainer: {
        marginTop: 8,
        paddingHorizontal: 5,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    draftProfileImageItem: {
        width: 25,
        height: 25,
        resizeMode: "cover",
        borderRadius: 25,
    },
    draftProfileTitleTextItem: {
        color: COLORS.white,
        fontSize: 10,
        fontFamily: "PoppinsLight",
        marginLeft: 5,
    },
    draftProfileTitleNameTextItem: {
        color: COLORS.white,
        fontSize: 10,
        fontFamily: "PoppinsBold",
    },
});

export default HowToVideoSavedDraftsScreen;