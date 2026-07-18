import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, Platform } from "react-native";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import { FontAwesome } from "@expo/vector-icons";
import io from "socket.io-client";

//customs
import { COLORS } from "../../constants";
import SingleHowToVideo from "./SingleHowToVideo";
import LoadingComponent from "../LoadingComponent";
import { useHowToFeedQuery } from "../../redux/api/how-to";
import EmptyFlatlistComponent from "../EmptyFlatlistComponent";

//track database changes
const SOCKET_SERVER_URL = "https://reech-node-api-7o3szyfdpq-uc.a.run.app/";
//`${process.env.REACT_APP_API_URL}${process.env.MAIN_API_BASE_PATH}/`

const HowToComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [howToData, setHowToData] = useState();
  const [searchHowTo, setSearchHowTo] = useState();

  const { data, refetch, isLoading, isFetching } = useHowToFeedQuery();

  React.useEffect(() => {
    setHowToData(data?.data ?? [])
    setSearchHowTo(data?.data ?? [])
  }, [data])

  useEffect(() => {
    const connectSocket = async () => {
      const socket = io(SOCKET_SERVER_URL, {
        transports: ["websocket"],
        extraHeaders: {
          "Svc-Tkn": `Bearer ${process.env.SvcTkn_Main_API}`,
        },
      });

      
      socket.on("how-to-updated", (data) => {
        refetch();
      });
    };
    connectSocket();
  }, []);

  const handleChangeIndexValue = ({ index }) => {
    setCurrentIndex(index);
  };

  //a method used to filter data according to the username
  const searchChannel = (text) => {
    let filteredData = howToData?.filter(
      (x) =>
        String(x?.subChannelId?.channel?.toLowerCase()).includes(text.toLowerCase()) ||
        String(x?.subChannelId?.subChannel?.toLowerCase()).includes(text.toLowerCase()) ||
        String(x?.description?.toLowerCase()).includes(text.toLowerCase()) ||
        String(x?.title?.toLowerCase()).includes(text.toLowerCase())
    );
    setSearchHowTo(filteredData);
  };

  return (
    <>
      {/*search function*/}
      <View style={styles.howToSearchContainer}>
        <View style={styles.innerSearchContainer}>
          <View style={styles.textInputContainer}>
            <TextInput
              onChangeText={(text) => searchChannel(text)}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Search"
              placeholderTextColor={COLORS.white}
              style={styles.inputsHowT}
              enablesReturnKeyAutomatically
              textAlign="center"
            />
          </View>
          <FontAwesome name="search" size={16} color={COLORS.purpleDark} style={{ top: Platform.OS === "ios" ? 0 : 5 }} />
        </View>
      </View>

      {/*how to swiping component*/}

      {isLoading ?
        <View style={styles.loadingContainer}>
          <LoadingComponent />
        </View> :
        <SwiperFlatList
          data={searchHowTo ?? []}
          refreshing={isFetching}
          onRefresh={refetch}
          onChangeIndex={handleChangeIndexValue}
          renderItem={({ item, index }) => (
            <SingleHowToVideo
              item={item}
              index={index}
              currentIndex={currentIndex}
            />
          )}
          keyExtractor={(item, index) => index}
          vertical={true}
          ListEmptyComponent={
            <View style={styles.videoEmptyComponent}>
              <EmptyFlatlistComponent />
            </View>
          }
        />
      }
    </>
  );
};

const styles = StyleSheet.create({
  howToSearchContainer: {
    marginHorizontal: "8%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  innerSearchContainer: {
    top: Platform.OS === "ios" ? 130 : 60,
    flexDirection: "row",
    paddingVertical: Platform.OS === "ios" ? 10 : 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: COLORS.reechGray,
  },
  textInputContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "93%",
  },
  inputsHowT: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 14,
    width: "100%",
    alignItems: "center",
  },

  //loading
  loadingContainer: {
    flex: 1,
    top: 60,
  },
  videoEmptyComponent: {
    marginTop: "60%",
    justifyContent: "center",
    alignItems: "center",
  }
});

export default HowToComponent;
