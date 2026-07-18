import React, { useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Octicons } from "@expo/vector-icons";

//import components

//import dependencies
import { messageUserProfilesData } from "../assets/data/userDataList";
import { COLORS } from "../constants";

const CustomAccountMessageMain = () => {
  const navigation = useNavigation();

  const [userProfiles, setUserProfiles] = useState(messageUserProfilesData);

  //screen reloader
  const [isFetching, setIsFetching] = useState(false);
  const fetchData = () => {
    setUserProfiles(messageUserProfilesData);
    setIsFetching(false);
  };
  const onRefresh = () => {
    setIsFetching(true);
    fetchData(userProfiles);
  };

  function renderAccountList() {
    function onAllProfilePressed() {
      console.log("all profile click");
    }

    return (
      <SafeAreaView style={styles.contentProfileContainer}>
        <FlatList
          data={userProfiles}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={onRefresh}
          refreshing={isFetching}
          renderItem={({ item }) => {
            if (!item.ads) {
              return (
                <TouchableOpacity
                  onPress={onAllProfilePressed}
                  style={styles.profileAccContainers}
                >
                  <View style={styles.imageHolder}>
                    <Image
                      source={item.proPic}
                      style={styles.imageItem}
                      resizeMode="cover"
                    />
                  </View>
                  <Text style={styles.imageText}>{item.jobIndustry}</Text>
                </TouchableOpacity>
              );
            }

            if (item.ads) {
              return (
                <TouchableOpacity
                  onPress={onAllProfilePressed}
                  style={styles.profileAccContainers}
                >
                  <View style={styles.imageContentContainer}>
                    <View style={styles.imageHolder}>
                      <Image
                        source={item.proPic}
                        style={styles.imageItemAd}
                        resizeMode="cover"
                      />
                    </View>
                  </View>
                  <Text style={styles.imageTextAd}>{item.jobIndustry}</Text>
                </TouchableOpacity>
              );
            }
          }}
          horizontal
          contentContainerStyle={{ paddingHorizontal: 0 }}
          showsHorizontalScrollIndicator={false}
          ListFooterComponent={<View style={{ marginBottom: 0 }}></View>}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.topScreenContainer}>
      {renderAccountList()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topScreenContainer: {
    flex: 1,
  },
  //profile messages
  contentProfileContainer: {
    marginTop: Platform.OS === "android" ? "-70%" : "-35%",
    top: Platform.OS === "ios" ? 92 : 208,
  },
  profileAccContainers: {
    marginBottom: 20,
    alignSelf: "center",
  },
  imageContentContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageHolder: {
    paddingTop: Platform.OS === "ios" ? 10 : 20,
    padding: Platform.OS === "ios" ? 9 : 4.5,
  },
  imageItem: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  imageItemAd: {
    width: 80,
    height: 80,
    borderRadius: 200,
  },
  imageText: {
    alignSelf: "center",
    color: COLORS.white,
    fontSize: 12,
  },
  imageTextAd: {
    alignSelf: "center",
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    right: 3.5,
  },
});

export default CustomAccountMessageMain;
