import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Platform,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";

//import customs
import { COLORS } from "../../constants";
import {
  CustomAccountMessage,
  EmptyFlatlistComponent,
  LoadingComponent,
} from "../../components";
import ChatRooms from "../../components/Chat/ChatRooms";
import { useListUserChatRoomsQuery } from "../../redux/api/chat";
import { useDispatch, useSelector } from "react-redux";
import { setChatRoomsList } from "../../redux/features/chat-slice";

import { FlatList } from "react-native-gesture-handler";
import { useSocket } from "../../utils/socket";

const MainMessageScreen = () => {
  const navigation = useNavigation();

  const socket = useSocket();
  // eslint-disable-next-line no-unused-vars
  const [searchList, setSearch] = useState([]);
  const [filterList, setFilterList] = useState([]);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.current_user);
  const data = useSelector((state) => state.chat.chat_rooms);


  const [roomCollection, setRoomCollection] = useState();


  const {
    data: rooms,
    refetch,
    isFetching,
    isLoading
  } = useListUserChatRoomsQuery(user?._id);

  // fetch messages from the api
  React.useEffect(() => {
    dispatch(setChatRoomsList({ chat_rooms: rooms }));
    setRoomCollection(data?.data)
    setSearch(data?.data);
    setFilterList(data?.data);
  }, [rooms, data]);

  // to run whenever there is a trigger from the backend
  // it will update the list of rooms
  React.useEffect(() => {
    // if (socket == null) return;

    socket.on("create-room", (room) => {
      console.log("room Listed.")
      setRoomCollection(...roomCollection, room);
    });
  }, []);

  //a method used to filter data according to the username
  const searchUsername = (text) => {
    if (!text) {
      setSearch(roomCollection);
      return
    }
    let filteredData = roomCollection.filter(
      (x) =>
        String(x?.userId?.firstName.toLowerCase()).includes(text.toLowerCase()) ||
        String(x?.userId?.lastName.toLowerCase()).includes(text.toLowerCase()) ||
        String(x?.fromUserId?.firstName.toLowerCase()).includes(text.toLowerCase()) ||
        String(x?.fromUserId?.lastName.toLowerCase()).includes(text.toLowerCase())
    );
    setSearch(filteredData);
  };

  const filterMessages = (filt) => {
    if (filt.type === "All") {
      setFilterList(roomCollection);
      return
    }
    let filteredData = roomCollection.filter((notif) =>
      filt.id === notif?.toProfileId
    );
    setFilterList(filteredData);
  };

  function renderChatSearch() {
    return (
      <View style={styles.searchComponent}>
        <View style={{ width: "100%", flexDirection: "row" }}>
          <SafeAreaView style={styles.searchContainer}>
            <View style={styles.innerSearchContainer}>
              <View style={styles.textInputContainer}>
                <TextInput
                  onChangeText={(text) => searchUsername(text)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Search"
                  placeholderTextColor={COLORS.white}
                  style={styles.inputMessages}
                  enablesReturnKeyAutomatically
                />
              </View>
              <View style={styles.inputIconContainer}>
                <FontAwesome
                  name="search"
                  size={16}
                  color={COLORS.purpleDark}
                />
              </View>
            </View>
          </SafeAreaView>

          {/*add new chat section*/}
          <TouchableOpacity
            style={styles.iconContent}
            onPress={() => navigation.navigate("ContactsScreen")}
          >
            <MaterialCommunityIcons
              name="clipboard-edit-outline"
              size={18}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderProfileCollection() {
    return (
      <View style={styles.accountComponent}>
        <CustomAccountMessage
          filter={({ filter }) => {
            filterMessages(filter)
          }}
        />
      </View>
    );
  }

  function renderMessageCollection() {
    return (
      <>
        <SafeAreaView style={styles.messageContainer}>
          <View style={{ paddingBottom: 150 }}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <LoadingComponent />
              </View>
            ) : (
              <FlatList
                data={filterList ?? []}//roomCollection
                keyExtractor={(item) => item._id.toString()}
                onRefresh={refetch}
                refreshing={isFetching}
                style={{ maxHeight: "80%" }}
                renderItem={({ item }) => {
                  return (
                    <View>
                      <ChatRooms item={item} styles={styles} />
                    </View>
                  );
                }}
                ListFooterComponent={
                  <View
                    style={{
                      marginBottom: Platform.OS === "ios" ? "50%" : "52%",
                    }}
                  ></View>
                }
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={<EmptyFlatlistComponent />}
                decelerationRate="fast"
              />
            )}
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <View style={styles.container}>
      {renderChatSearch()}
      {renderProfileCollection()}
      {renderMessageCollection()}
    </View>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "2.5%",
    justifyContent: "space-between",
    flexDirection: "column",
    backgroundColor: COLORS.black,
  },

  //search
  searchComponent: {
    paddingVertical: "10%",
    paddingHorizontal: "5%",
    marginBottom: -25,
  },
  accountComponent: {
    top: 0,
    bottom: 0,
    paddingVertical: Platform.OS === "ios" ? "0%" : "0%",
    paddingBottom: Platform.OS === "ios" ? "21.3%" : "26%",
    paddingHorizontal: "5%",
  },
  searchContainer: {
    position: "relative",
    marginHorizontal: Platform.OS === "android" ? "0%" : "0%",
    marginTop: "-13%",
    width: "80%",
  },
  innerSearchContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    height: 40,
    paddingHorizontal: 20,
    top: 10,
    marginBottom: 8,
    borderColor: COLORS.reechGray,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: COLORS.reechGray,
  },
  textInputContainer: {
    width: "92%",
    alignItems: "center",
  },
  inputIconContainer: {
    alignItems: "flex-end",
    width: "8%",
  },
  inputMessages: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 15,
    alignItems: "center",
  },

  //message collection
  loadingContainer: {
    flex: 1,
    position: "absolute",
    top: 80,
    left: "20%",
  },
  messageContainer: {
    flex: 1,
    top: Platform.OS === "ios" ? 420 : 380,
    marginBottom: Platform.OS === "android" ? "-70%" : "-70%",
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
  userPicVerified: {
    width: Platform.OS === "ios" ? 72 : 60,
    height: Platform.OS === "ios" ? 72 : 60,
    borderRadius: 8,
    borderColor: COLORS.black,
  },
  textContainer: {
    width: "65%",
    flexDirection: "column",
    marginTop: "5%",
    marginLeft: "3%",
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
    marginLeft: "4%",
  },
  timeFrame: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //icon section
  iconContainer: {
    flexDirection: "row",
  },
  iconContent: {
    width: 50,
    height: 40,
    bottom: Platform.OS === "ios" ? 42 : "10%",
    left: 10,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 3,
    borderColor: COLORS.purpleDark,
    backgroundColor: COLORS.transparent,
  },
});

export default MainMessageScreen;
