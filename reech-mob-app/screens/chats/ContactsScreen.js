import { View, FlatList, SafeAreaView } from "react-native";
import { useReadAllUserQuery } from "../../redux/api/api-slice";
import React, { useState } from "react";
import { setUsersList } from "../../redux/features/all-user-slice";
import { useDispatch, useSelector } from "react-redux";
import ContactCard from "../../components/Chat/ContactCard";
import { useCreateChatRoomMutation } from "../../redux/api/chat";
import { useNavigation } from "@react-navigation/native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import ChatSearch from "../../components/Chat/ChatSearch";
import { useSocket } from "../../utils/socket";
import { LoadingComponent } from "../../components";
import NavHeader from "../../components/Headers/NavHeader";


const ContactsScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const socket = useSocket();

  const user = useSelector((state) => state.user.current_user);
  const allUsers = useSelector((state) => state.allUser.read_users);

  const [contacts, setContacts] = useState();

  const {
    data,
    isLoading,
    isFetching,
  } = useReadAllUserQuery();

  React.useEffect(() => {
    dispatch(setUsersList({ read_users: data?.data }));
    setContacts(allUsers);
  }, [data, allUsers]);


  const [createChatRoomFn, { isLoading: isCreatingChatRoom }] = useCreateChatRoomMutation();

  const showError = (res) =>
    Toast.show({
      type: "error",
      text1: "Error",
      text2: res.error.data?.error ?? "Something went wrong. Please try again",
    });

  // navigate to inbox
  const navigateToChat = (item) => {
    navigation.navigate("MainMessageFullViewScreen", {
      id: item?._id,
      name: item?.name,
      // messages: item?.messages,
      avatar: item?.avatar
    });
  }

  const handleChat = (chatter, chattee) => {
    const payload = {
      userIds: [chattee._id],
      name: `${chattee.firstName} ${chattee.lastName}`,
      initiatorsName: `${chatter.firstName} ${chatter.lastName}`,
      chatInitiator: chatter._id,
      avatar: chattee.profileImage,
      initiatorsAvatar: chatter.profileImage,
    };
    // console.log(payload);
    createChatRoomFn(payload)
      .then((res) => {
        if (res.error) {
          showError(res);
          return;
        }
        navigateToChat(res?.data?.data);
      })
      .catch((err) => {
        console.error(err);
      })
    socket.emit("create-room", payload)
  }

  const searchContact = (text) => {
    let filteredData = allUsers.filter(
      (x) =>
        String(x.firstName.toLowerCase()).includes(text.toLowerCase()) ||
        String(x.lastName.toLowerCase()).includes(text.toLowerCase()) ||
        String(x.email.toLowerCase()).includes(text.toLowerCase())
    );
    setContacts(filteredData);
  };

  return (
    <View className={`flex top-0 bottom-0 pt-12 h-full bg-black`}>
      <View className={`mb-3`}>
        <NavHeader
          message="What will make you happy today?"
        />
      </View>

      <SafeAreaView className={`flex mr-3 mb-2 mx-5`}>
        <ChatSearch handleChange={(text) => searchContact(text)} />
      </SafeAreaView>

      {isLoading || isCreatingChatRoom ? (
        <View className={`flex items-center justify-center h-full -mt-24`}>
          <LoadingComponent />
        </View>
      ) : (
        <>
          {contacts &&
            <FlatList
              data={contacts}
              keyExtractor={(item) => item._id.toString()}
              refreshing={isFetching}
              renderItem={({ item }) => (
                <ContactCard
                  contact={item}
                  handleChat={() => handleChat(user, item)}
                />
              )}
              ListFooterComponent={
                <View style={{ marginBottom: "10%" }}></View>
              }
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
            />}
        </>)}
    </View>
  )
}

export default ContactsScreen;