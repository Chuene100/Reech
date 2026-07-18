import React, { useState } from "react";
import { FlatList, Image, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Entypo, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";


//custom 
import { thoughtsSavedDraftsData } from "../../../assets/data/savedToDraftsData";
import { COLORS } from "../../../constants";
import EmptyFlatlistComponent from "../../../components/EmptyFlatlistComponent";
import NavHeader from "@/components/Headers/NavHeader";

const ThoughtsSavedDraftsScreen = () => {
    const navigation = useNavigation();

    const [data, setData] = useState(thoughtsSavedDraftsData);

    const onThoughtRemoveAllPressed = () => {
        setData([]);
    }

    const onEditThoughtItemPressed = (item) => {
        navigation.navigate("EditThoughtSavedDataScreen", { item: item })
    }

    const onDeleteThoughtItemPressed = (item) => {
        const itemIndex = data.findIndex((dataItem) => dataItem.id === item.id);

        if (itemIndex !== -1) {
            const newData = [...data];
            newData.splice(itemIndex, 1);

            setData(newData);
        }
    }

    //header section
    function renderThoughtsDraftHeaderSection() {
        return (
            <View style={styles.headerThoughtsDraftContainer}>
                <NavHeader message="What would you like to do?" />

                <View style={styles.headerThoughtsDraftTitleContainer}>
                    <Text style={styles.headerThoughtsDraftTitleTextItem}>
                        Manage all your saved thought drafts here.
                    </Text>
                </View>
            </View>
        )
    }

    //thought saved draft section
    function renderThoughtsTopHeaderSection() {
        return (
            <View style={styles.thoughtsDraftsItemMainContainer}>
                {/*drafts heading section*/}
                <View style={styles.draftsHeaderContainer}>
                    {/*title section*/}
                    <View style={styles.draftsHeadersContentContainer}>
                        <MaterialCommunityIcons name="thought-bubble" size={16} color={COLORS.white} />
                        <Text style={styles.draftsHeaderTextItem}>Saved drafts</Text>
                    </View>

                    {/*remove section*/}
                    <TouchableOpacity
                        onPress={onThoughtRemoveAllPressed}
                        style={styles.draftsHeadersActionContentContainer}
                    >
                        <Text style={styles.draftsHeaderActionTextItem}>Remove all</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    //thought data  list 
    function renderThoughtDraftDataList() {
        return (
            <View style={styles.draftContentContainer}>
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2}
                    renderItem={({ item, index }) => {
                        return (
                            <View key={index} style={styles.draftItemContainer}>
                                <View style={styles.draftItemContentContainer}>
                                    <ImageBackground
                                        blurRadius={4}
                                        source={{ uri: item.fileLink.uri }}
                                        style={styles.draftMediaFileItem}
                                    >
                                        {/*remove and edit section*/}
                                        <View style={styles.draftItemActionContainer}>
                                            {/*edit item action*/}
                                            <TouchableOpacity onPress={() => onEditThoughtItemPressed(item)} style={styles.draftEditItemContainer}>
                                                <FontAwesome name="pencil-square-o" size={14} color={COLORS.white} />
                                            </TouchableOpacity>

                                            {/*delete item action*/}
                                            <TouchableOpacity onPress={() => onDeleteThoughtItemPressed(item)} style={styles.draftDeleteItemContainer}>
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
            {renderThoughtsDraftHeaderSection()}
            {renderThoughtsTopHeaderSection()}
            {renderThoughtDraftDataList()}
        </View>
    );
}

const styles = StyleSheet.create({
    savedToDraftsContainer: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    headerThoughtsDraftContainer: {
        marginTop: Platform.OS === "ios" ? "10%" : 0,
    },
    headerThoughtsDraftTitleContainer: {
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    headerThoughtsDraftTitleTextItem: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: "PoppinsLight",
    },
    draftListFooterItem: {
        marginBottom: Platform.OS === "ios" ? "45%" : "30%",
    },

    //thoughts draft items section
    thoughtsDraftsItemMainContainer: {
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
        height: 85,
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
        paddingHorizontal: 5,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: COLORS.reechGray,
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

export default ThoughtsSavedDraftsScreen;