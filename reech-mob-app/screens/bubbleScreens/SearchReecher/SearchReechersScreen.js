import React from "react";
import { StyleSheet, View, Text, Platform, Image } from "react-native";

//import customs
import { COLORS, icons } from "../../../constants";
import { SearchForReecherNavigation } from "../../../Navigations";
import NavHeader from "@/components/Headers/NavHeader";

const SearchReechersScreen = () => {
  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.contentContainerReecher}>
        <NavHeader message="What would you like to do?" />

        <View style={styles.headingContainer}>
          <Image source={icons.searchReech} style={styles.searchImageItem} />
          <Text style={styles.headingText}>Search reech</Text>
        </View>
      </View>
    );
  }

  function renderContentSection() {
    return (
      <View style={styles.contentListItems}>
        <SearchForReecherNavigation />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeaderSection()}
      {renderContentSection()}
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
  contentContainerReecher: {
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },
  headingContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 40,
    marginLeft: 10,
    marginVertical: 10,
    flexDirection: "row",
  },
  searchImageItem: {
    width: 50,
    height: 50,
  },
  headingText: {
    left: 10,
    marginTop: "5%",
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "PoppinsLight",
  },

  //content list section
  contentListItems: {
    flexDirection: "column",
    justifyContent: "flex-start",
    marginTop: Platform.OS === "ios" ? "14%" : "8%",
    margin: "5%",
  },
});

export default SearchReechersScreen;
