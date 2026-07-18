import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Octicons } from "@expo/vector-icons";

//import customs
import { supportMessageCollectionItems } from "../../assets/data/messageData";
import { COLORS, images } from "../../constants";
import { EmptyFlatlistComponent } from "../../components";

const SupportMessageScreen = () => {
  const navigation = useNavigation();

  const [messageCollection, setMessageCollection] = useState(
    supportMessageCollectionItems
  );

  //reloader
  const [isFetching, setIsFetching] = useState(false);
  const fetchData = () => {
    setMessageCollection(supportMessageCollectionItems);
    setIsFetching(false);
  };

  const onRefresh = () => {
    setIsFetching(true);
    fetchData(messageCollection);
  };

  function renderMessageCollection() {
    return (
      <SafeAreaView style={styles.messageContainer}>
        <View>
          <FlatList
            data={messageCollection}
            keyExtractor={(item, index) => index.toString()}
            onRefresh={onRefresh}
            refreshing={isFetching}
            renderItem={({ item }) => {
              if (!item.bot) {
                return (
                  <View style={styles.messageContent}>
                    <TouchableOpacity
                      style={styles.messageItems}
                      onPress={() => navigation.navigate(item.action)}
                    >
                      <ImageBackground
                        source={images.userFrame}
                        style={styles.imageItem}
                      >
                        <Image
                          source={
                            item.profilePic
                              ? { uri: item.profilePic }
                              : images.u1
                          }
                          resizeMode="cover"
                          style={styles.userPic}
                        />
                      </ImageBackground>

                      <View style={styles.textContainer}>
                        <Text style={styles.username}>
                          {item.username}
                          {"  "}
                          <Octicons
                            name="dot-fill"
                            size={14}
                            color={COLORS.green}
                          />
                        </Text>
                        <Text style={styles.userMessage} numberOfLines={1}>
                          {item.message}
                        </Text>
                      </View>

                      <View style={styles.dateContainer}>
                        <Text style={styles.timeFrame}>
                          {item.sentTimestamp}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }

              {
                /*reechie section*/
              }
              if (item.bot) {
                return (
                  <View style={styles.messageContent}>
                    <TouchableOpacity
                      style={styles.messageItems}
                      onPress={() => navigation.navigate(item.action)}
                    >
                      <View style={styles.imageItemReechie}>
                        <Image
                          source={item?.profilePic}
                          resizeMode="cover"
                          style={styles.userPicReechie}
                        />
                      </View>

                      <View style={styles.textContainer}>
                        <Text style={styles.username}>{item.username} </Text>
                        <Text style={styles.userMessage} numberOfLines={1}>
                          {item.message}
                        </Text>
                      </View>

                      <View style={styles.dateContainer}>
                        <Text style={styles.timeFrame}>
                          {item.sentTimestamp}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }
            }}
            ListFooterComponent={<View style={{ marginBottom: "0%" }}></View>}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={<EmptyFlatlistComponent />}
          />
        </View>
      </SafeAreaView>
    );
  }

  return <View style={styles.container}>{renderMessageCollection()}</View>;
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "2.5%",
    justifyContent: "space-between",
    flexDirection: "column",
  },

  //message collection
  messageContainer: {
    flex: 1,
    top: Platform.OS === "ios" ? 420 : 380,
    marginBottom: Platform.OS === "android" ? "-52%" : "-62%",
    marginTop: "-100%",
  },
  messageContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "column",
  },
  messageItems: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageItem: {
    width: Platform.OS === "ios" ? 80 : 68,
    height: Platform.OS === "ios" ? 80 : 68,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  userPic: {
    width: Platform.OS === "ios" ? 72 : 60,
    height: Platform.OS === "ios" ? 72 : 60,
    borderRadius: 8,
    borderColor: COLORS.black,
  },
  imageItemReechie: {
    width: "20%",
  },
  userPicReechie: {
    width: Platform.OS === "ios" ? 72 : 70,
    height: Platform.OS === "ios" ? 72 : 70,
    borderRadius: 8,
  },
  textContainer: {
    width: "60%",
    flexDirection: "column",
    marginTop: "0%",
    marginLeft: Platform.OS === "ios" ? "3%" : "4%",
    justifyContent: "center",
  },
  username: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  userMessage: {
    marginTop: "2%",
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  dateContainer: {
    width: "20%",
    flexDirection: "column",
    marginTop: Platform.OS === "ios" ? "11%" : "12%",
    marginLeft: "5%",
  },
  timeFrame: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
});

export default SupportMessageScreen;
