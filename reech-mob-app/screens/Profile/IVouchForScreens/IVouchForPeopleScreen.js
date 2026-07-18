import React, { useEffect } from "react";
import { Image, TouchableOpacity, StyleSheet, View, Text, Platform, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { FlatList } from "react-native-gesture-handler";

//import customs
import { COLORS, images } from "../../../constants";
import { EmptyFlatlistComponent, LoadingComponent } from "../../../components";
import { useListMyVouchesQuery } from "../../../redux/api/vouch";

///__________________Tracking database changes__________________
const SOCKET_SERVER_URL = "https://reech-node-api-7o3szyfdpq-uc.a.run.app/";
//`${process.env.REACT_APP_API_URL}${process.env.MAIN_API_BASE_PATH}`;

const IVouchForPeopleScreen = () => {
  const navigation = useNavigation();

  const current_user = useSelector((state) => state.user.current_user);

  const { data, refetch, isFetching, isLoading } = useListMyVouchesQuery(current_user?._id);

  useEffect(() => {
    const connectSocket = async () => {
      const socket = io(SOCKET_SERVER_URL, {
        transports: ["websocket"],
        extraHeaders: {
          "Svc-Tkn": `Bearer ${process.env.SvcTkn_Main_API}`,
        },
      });
      socket.on("vouch-updated", () => {
        refetch();
      });
    };
    connectSocket();
  }, []);

  //screen loading component
  const loadingComponent = () => (
    <View style={styles.loadingComponent}>
      <LoadingComponent />
    </View>
  );

  function renderUserVouchListSection() {
    return (
      <>
        <View style={styles.userVouchListContainer}>
          <View style={styles.userVouchContent}>
            <FlatList
              data={data?.data}
              keyExtractor={(item, index) => index.toString()}
              onRefresh={refetch}
              refreshing={isFetching}
              renderItem={({ item }) => {
                return (
                  <View style={styles.flatListContainer}>
                    <View style={styles.flatListContent}>
                      <View style={styles.imageItemContainer}>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("AccountFullViewScreen", {
                              userId: item.vouchFor?.userId?._id,
                            })
                          }
                        >
                          <ImageBackground
                            source={images.userFrame}
                            style={styles.gradientColorContainerPeopleIVouch}
                          >
                            <Image
                              source={{
                                uri: item.vouchFor?.userId?.profileImage,
                              }}
                              style={styles.imageItem}
                            />
                          </ImageBackground>
                        </TouchableOpacity>

                        {/*vouch user info section*/}
                        <View style={styles.imageTextContainer}>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate("AccountFullViewScreen", {
                                userId: item.vouchFor?.userId?._id,
                              })
                            }
                          >
                            <Text style={styles.imageTextName}>
                              {item.vouchFor?.userId?.firstName}{" "}
                              {item.vouchFor?.userId?.lastName}
                            </Text>
                          </TouchableOpacity>

                          <Text numberOfLines={2} style={styles.imageTextBlurb}>
                            {item.vouchFor?.userId?.blurb}
                          </Text>

                          <View style={styles.imageTextButtonContainer}>
                            <Text style={styles.imageText}>
                              {moment(item.vouchDate).format("MMM YYYY")}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={{ flexDirection: "column" }}>
                        {/*vouch message section*/}
                        <View style={styles.vouchMessageContainer}>
                          <Text style={styles.vouchMessage}>
                            {item.description}
                          </Text>
                        </View>

                        {/*vouch image section*/}
                        <View style={styles.vouchImageContainer}>
                          <Image
                            source={{ uri: item.vouchImage }}
                            style={styles.vouchImageAttachmentItem}
                          />
                        </View>

                        <View style={styles.horizontalLine}></View>
                      </View>

                      <View style={styles.flatListBottom}></View>
                    </View>
                  </View>
                );
              }}
              ListFooterComponent={
                <View
                  style={{
                    marginBottom: Platform.OS === "ios" ? "6%" : "8%",
                  }}
                ></View>
              }
              ListEmptyComponent={<EmptyFlatlistComponent />}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      {isLoading ? (
        loadingComponent()
      ) : (
        <View style={styles.contentContainerIVouch}>
          {renderUserVouchListSection()}
        </View>
      )}
    </>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  contentContainerIVouch: {
    flex: 1,
    flexDirection: "column",
  },

  //loading component
  loadingComponent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  //user vouch list section
  userVouchListContainer: {
    flex: 1,
    marginTop: 10,
  },
  userVouchContent: {
    width: "100%",
    flexDirection: "column",
  },

  //flatlist section
  flatListContainer: {
    flex: 1,
  },
  flatListContent: {
    flexDirection: "column",
  },
  imageItemContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  gradientColorContainerPeopleIVouch: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  imageItem: {
    width: 72,
    height: 72,
    resizeMode: "cover",
    borderRadius: 6,
  },
  imageTextContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    marginLeft: "2%",
    width: "100%",
  },
  imageTextName: {
    width: "80%",
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  imageTextBlurb: {
    width: Platform.OS === "ios" ? "76%" : "75%",
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    marginBottom: 2,
  },
  imageTextButtonContainer: {
    backgroundColor: COLORS.transparent,
    flexDirection: "row",
    alignItems: "center",
    height: 25,
    justifyContent: "space-between",
    width: "100%",
  },
  imageText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  vouchMessageContainer: {
    marginTop: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  vouchMessage: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  vouchImageContainer: {
    width: "100%",
    marginTop: "3%",
  },
  vouchImageAttachmentItem: {
    width: "100%",
    height: 360,
    resizeMode: "cover",
    borderRadius: 10,
  },

  horizontalLine: {
    marginVertical: "5%",
    borderBottomColor: COLORS.gray,
    borderBottomWidth: StyleSheet.hairlineWidth * 1,
  },
  flatListBottom: {
    marginBottom: "2.5%",
  },
});

export default IVouchForPeopleScreen;
