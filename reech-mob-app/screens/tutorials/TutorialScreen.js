import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform, ScrollView, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";

//import customs
import {
  reechingForTutorialData,
  beReechedTutorialData,
  bubbleScreenTutorialData,
  messageScreenTutorialData,
  howToTutorialData,
  thoughtsScreenTutorialData,
  accountScreenTutorialData,
  dashboardScreenTutorialData,
} from "../../assets/data/reechInfoData";
import { COLORS } from "../../constants";
import NavHeader from "@/components/Headers/NavHeader";

const TutorialScreen = () => {
  const navigation = useNavigation();

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
      <View style={styles.headerTutorialTextContainer}>
        <Text style={styles.headerTutorialTextItem}>Reech Tutorial</Text>

        <View style={styles.headerTextDescriptionContainer}>
          <Text style={styles.headerTextDescriptionTextItem}>
            Watch the videos below to have a better visual understanding of
            where to access all of the stuff you need in the Reech app.
          </Text>
        </View>
      </View>
    );
  }

  //reech tutorial items
  function renderTutorialListSection() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.reechTutorialContainer}
      >
        {/*reech tutorial content: reeching for*/}
        <View style={styles.reechTutorialContentContainer}>
          <View style={styles.reechTutorialConceptTitleContainer}>
            <Text style={styles.reechTutorialConceptTitle}>Reeching For</Text>
          </View>

          {/*reech lessons collection*/}
          <View
            style={styles.reechTutorialContentItemContainer}>
            <View style={styles.reechVideoThumbnailContainer}>
              {reechingForTutorialData.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => navigation.navigate("TutorialFullViewScreen", { item: item })}
                  style={styles.reechVideoThumbnailContent}>

                  <ImageBackground

                    source={{ uri: item?.videoThumbnail }}
                    style={styles.reechVideoThumbnail}>
                    <View style={styles.reechVideoPlayButtonContainer}>
                      <Entypo name="controller-play" size={16} color={COLORS.white} />
                    </View>
                  </ImageBackground>

                  {/*reech total title*/}
                  <View style={styles.reechTotalTitleContainer}>
                    <Text style={styles.reechTotalTitleItem}>{item?.videoTitle}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/*reech tutorial content: be reeched*/}
        <View style={styles.reechTutorialContentContainer}>
          <View style={styles.reechTutorialConceptTitleContainer}>
            <Text style={styles.reechTutorialConceptTitle}>Be Reeched</Text>
          </View>

          {/*reech lessons collection*/}
          <View
            style={styles.reechTutorialContentItemContainer}>
            <View style={styles.reechVideoThumbnailContainer}>
              {beReechedTutorialData.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => navigation.navigate("TutorialFullViewScreen", { item: item })}
                  style={styles.reechVideoThumbnailContent}>
                  <ImageBackground

                    source={{ uri: item?.videoThumbnail }}
                    style={styles.reechVideoThumbnail}>
                    <View style={styles.reechVideoPlayButtonContainer}>
                      <Entypo name="controller-play" size={16} color={COLORS.white} />
                    </View>
                  </ImageBackground>

                  {/*reech total title*/}
                  <View style={styles.reechTotalTitleContainer}>
                    <Text style={styles.reechTotalTitleItem}>{item?.videoTitle}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/*reech tutorial content: bubble screen*/}
        <View style={styles.reechTutorialContentContainer}>
          <View style={styles.reechTutorialConceptTitleContainer}>
            <Text style={styles.reechTutorialConceptTitle}>Bubble Screen</Text>
          </View>

          {/*reech lessons collection*/}
          <View
            style={styles.reechTutorialContentItemContainer}>
            <View style={styles.reechVideoThumbnailContainer}>
              {bubbleScreenTutorialData.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => navigation.navigate("TutorialFullViewScreen", { item: item })}
                  style={styles.reechVideoThumbnailContent}>
                  <ImageBackground

                    source={{ uri: item?.videoThumbnail }}
                    style={styles.reechVideoThumbnail}>
                    <View style={styles.reechVideoPlayButtonContainer}>
                      <Entypo name="controller-play" size={16} color={COLORS.white} />
                    </View>
                  </ImageBackground>

                  {/*reech total title*/}
                  <View style={styles.reechTotalTitleContainer}>
                    <Text style={styles.reechTotalTitleItem}>{item?.videoTitle}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/*reech tutorial content: message*/}
        <View style={styles.reechTutorialContentContainer}>
          <View style={styles.reechTutorialConceptTitleContainer}>
            <Text style={styles.reechTutorialConceptTitle}>Message Screen</Text>
          </View>

          {/*reech lessons collection*/}
          <View
            style={styles.reechTutorialContentItemContainer}>
            <View style={styles.reechVideoThumbnailContainer}>
              {messageScreenTutorialData.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => navigation.navigate("TutorialFullViewScreen", { item: item })}
                  style={styles.reechVideoThumbnailContent}>
                  <ImageBackground

                    source={{ uri: item?.videoThumbnail }}
                    style={styles.reechVideoThumbnail}>
                    <View style={styles.reechVideoPlayButtonContainer}>
                      <Entypo name="controller-play" size={16} color={COLORS.white} />
                    </View>
                  </ImageBackground>

                  {/*reech total title*/}
                  <View style={styles.reechTotalTitleContainer}>
                    <Text style={styles.reechTotalTitleItem}>{item?.videoTitle}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/*reech tutorial content: how-to*/}
        <View style={styles.reechTutorialContentContainer}>
          <View style={styles.reechTutorialConceptTitleContainer}>
            <Text style={styles.reechTutorialConceptTitle}>How-to Screen</Text>
          </View>

          {/*reech lessons collection*/}
          <View
            style={styles.reechTutorialContentItemContainer}>
            <View style={styles.reechVideoThumbnailContainer}>
              {howToTutorialData.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => navigation.navigate("TutorialFullViewScreen", { item: item })}
                  style={styles.reechVideoThumbnailContent}>
                  <ImageBackground

                    source={{ uri: item?.videoThumbnail }}
                    style={styles.reechVideoThumbnail}>
                    <View style={styles.reechVideoPlayButtonContainer}>
                      <Entypo name="controller-play" size={16} color={COLORS.white} />
                    </View>
                  </ImageBackground>

                  {/*reech total title*/}
                  <View style={styles.reechTotalTitleContainer}>
                    <Text style={styles.reechTotalTitleItem}>{item?.videoTitle}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/*reech tutorial content: thoughts*/}
        <View style={styles.reechTutorialContentContainer}>
          <View style={styles.reechTutorialConceptTitleContainer}>
            <Text style={styles.reechTutorialConceptTitle}>Thoughts Screen</Text>
          </View>

          {/*reech lessons collection*/}
          <View
            style={styles.reechTutorialContentItemContainer}>
            <View style={styles.reechVideoThumbnailContainer}>
              {thoughtsScreenTutorialData.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => navigation.navigate("TutorialFullViewScreen", { item: item })}
                  style={styles.reechVideoThumbnailContent}>
                  <ImageBackground

                    source={{ uri: item?.videoThumbnail }}
                    style={styles.reechVideoThumbnail}>
                    <View style={styles.reechVideoPlayButtonContainer}>
                      <Entypo name="controller-play" size={16} color={COLORS.white} />
                    </View>
                  </ImageBackground>

                  {/*reech total title*/}
                  <View style={styles.reechTotalTitleContainer}>
                    <Text style={styles.reechTotalTitleItem}>{item?.videoTitle}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/*reech tutorial content: Account*/}
        <View style={styles.reechTutorialContentContainer}>
          <View style={styles.reechTutorialConceptTitleContainer}>
            <Text style={styles.reechTutorialConceptTitle}>Account Screen</Text>
          </View>

          {/*reech lessons collection*/}
          <View
            style={styles.reechTutorialContentItemContainer}>
            <View style={styles.reechVideoThumbnailContainer}>
              {accountScreenTutorialData.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => navigation.navigate("TutorialFullViewScreen", { item: item })}
                  style={styles.reechVideoThumbnailContent}>
                  <ImageBackground

                    source={{ uri: item?.videoThumbnail }}
                    style={styles.reechVideoThumbnail}>
                    <View style={styles.reechVideoPlayButtonContainer}>
                      <Entypo name="controller-play" size={16} color={COLORS.white} />
                    </View>
                  </ImageBackground>

                  {/*reech total title*/}
                  <View style={styles.reechTotalTitleContainer}>
                    <Text style={styles.reechTotalTitleItem}>{item?.videoTitle}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/*reech tutorial content: dashboard*/}
        <View style={styles.reechTutorialContentContainer}>
          <View style={styles.reechTutorialConceptTitleContainer}>
            <Text style={styles.reechTutorialConceptTitle}>Dashboard Screen</Text>
          </View>

          {/*reech lessons collection*/}
          <View
            style={styles.reechTutorialContentItemContainer}>
            <View style={styles.reechVideoThumbnailContainer}>
              {dashboardScreenTutorialData.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => navigation.navigate("TutorialFullViewScreen", { item: item })}
                  style={styles.reechVideoThumbnailContent}>
                  <ImageBackground

                    source={{ uri: item?.videoThumbnail ?? "" }}
                    style={styles.reechVideoThumbnail}>
                    <View style={styles.reechVideoPlayButtonContainer}>
                      <Entypo name="controller-play" size={16} color={COLORS.white} />
                    </View>
                  </ImageBackground>

                  {/*reech total title*/}
                  <View style={styles.reechTotalTitleContainer}>
                    <Text style={styles.reechTotalTitleItem}>{item?.videoTitle}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }


  return (
    <View style={styles.tutorialScreenContainer}>
      {renderHeaderComponent()}
      {renderHeaderSection()}
      {renderTutorialListSection()}
    </View>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  tutorialScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerComponentContainer: {
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  //header text
  headerTutorialTextContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTutorialTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  headerTextDescriptionContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextDescriptionTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    textAlign: "center",
  },

  //reech tutorial content
  reechTutorialContainer: {
    width: "100%",
    marginTop: 10,
    marginBottom: Platform.OS === "ios" ? 40 : 0,
    flexDirection: "column",
  },
  reechTutorialContentContainer: {
    marginTop: 10,
    flexDirection: "column",
    paddingHorizontal: 10,
  },
  reechTutorialConceptTitleContainer: {
    marginBottom: 10,
  },
  reechTutorialConceptTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  reechTutorialContentItemContainer: {
    flexDirection: "row",
  },
  reechVideoThumbnailContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  reechVideoThumbnailContent: {
    flexDirection: "column",
    marginHorizontal: Platform.OS === "ios" ? 20 : 10,
  },
  reechVideoThumbnail: {
    width: Platform.OS === "ios" ? 160 : 140,
    height: Platform.OS === "ios" ? 120 : 100,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  reechVideoPlayButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: COLORS.reechGray,
  },
  reechTotalTitleContainer: {
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  reechTotalTitleItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    marginBottom: 10,
  },
});

export default TutorialScreen;
