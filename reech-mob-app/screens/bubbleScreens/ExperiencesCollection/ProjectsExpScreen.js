import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Pressable,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";

//import customs
import { COLORS, SIZES } from "../../../constants";
import { EmptyFlatlistComponent } from "../../../components";
import { useSelector } from "react-redux";

const ProjectsExpScreen = ({ Feed }) => {
  const navigation = useNavigation();
  const image = useSelector((state) => state.bubble_images.bubbleImages);

  const Data = Feed?.filter((feed) => feed.cardType === "What I'm working on");
  const [projectExperienceDataCollection] = useState(Data);

  function renderItemCollection() {
    return (
      <SafeAreaView style={styles.itemContainer}>
        <View>
          <FlatList
            data={projectExperienceDataCollection}
            keyExtractor={(item) => `${item?._id}`}
            numColumns={3}
            contentContainerStyle={styles.flContent}
            columnWrapperStyle={styles.flColumnWrapper}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <SafeAreaView style={styles.imageContainer}>
                  <Pressable
                    onPress={() =>
                      navigation.navigate("ExperienceFullViewScreen", {
                        data: item,
                      })
                    }
                    style={styles.imageContent}
                  >
                    <Image
                      source={{
                        uri:
                          image[item?.experienceImage] ?? item?.experienceImage,
                      }}
                      style={styles.imageItem}
                    />
                  </Pressable>
                </SafeAreaView>
              );
            }}
            ListFooterComponent={
              <View
                style={{
                  marginBottom: Platform.OS === "android" ? "50%" : "40%",
                }}
              ></View>
            }
            ListEmptyComponent={
              <View style={{ bottom: 90 }}>
                <EmptyFlatlistComponent />
              </View>
            }
          />
        </View>
      </SafeAreaView>
    );
  }

  return <View style={styles.container}>{renderItemCollection()}</View>;
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "column",
  },

  //message collection
  itemContainer: {
    top: Platform.OS === "ios" ? 410 : 380,
    marginBottom: Platform.OS === "android" ? "-52%" : "-52%",
    marginTop: "-75%",
  },
  imageContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: COLORS.transparent,
  },
  imageContent: {
    paddingHorizontal: 4,
    width: "100%",
    height: 200,
    backgroundColor: COLORS.transparent,
  },
  imageItem: {
    width: "100%",
    height: 200,
    alignSelf: "center",
    resizeMode: "cover",
    borderRadius: 5,
  },
  flContent: {
    justifyContent: "space-between",
    paddingHorizontal: Platform.OS === "ios" ? 50 : 60,
  },
  flColumnWrapper: {
    justifyContent: "space-between",
    width: "100%",
    marginBottom: SIZES.padding * 1,
  },
});

export default ProjectsExpScreen;
