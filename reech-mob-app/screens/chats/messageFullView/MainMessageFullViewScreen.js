import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

//import customs
import { COLORS } from "../../../constants";
import ChatHeader from "../../../components/Chat/ChatHeader";
import ChatMessage from "../../../components/Chat/ChatMessage";
import ChatMessageInput from "../../../components/Chat/ChatMessageInput";
import {
  useListRoomMessagesQuery,
  usePostMessageMutation,
} from "../../../redux/api/chat";
import { useSelector } from "react-redux";
// import { useSocket } from "../../../utils/socket";
import moment from "moment";
import Toast from "react-native-toast-message";


const MainMessageFullViewScreen = ({ route, navigation }) => {
  // const dispatch = useDispatch();
  // const socket = useSocket();

  const { avatar, name, id } = route.params;
  const [chatMessages, setChatMessages] = useState();
  const user = useSelector((state) => state.user.current_user);
  const [reply, setReply] = useState("");
  const [msg, setMsg] = useState('');
  const tempMsg = {createdAt:moment(), message: msg}

  // const [typing, setTyping] = useState();
  // let messageSent;

  const [postMsgFn, { isLoading: isSendingMsg }] = usePostMessageMutation();

  const showError = (res) =>
    Toast.show({
      type: "error",
      text1: "Error",
      text2: res.error.data?.error ?? "Something went wrong. Please try again",
    });

  const handlePostMsg = async () => {
      const payload = {
        message: reply,
        postedByUser: user._id,
        roomId: id && id,
      }

      setMsg(payload.message)
      setReply('')

      postMsgFn(payload)
        .then(async (res) => {
          if (res.error) {
            showError(res);
            return;
          }
          console.log('message sent');
        })
        .catch((err) => {
          var error = "Network error, please try again later";
          Toast.show({
            type: "error",
            text1: "Error",
            text2: error,
          });
        });
  }

  const { data, isLoading } = useListRoomMessagesQuery(
    id && id
  );

  React.useEffect(() => {
    setChatMessages(data?.data);
    setMsg('')
  }, [data]);


  // React.useEffect(() => {
  //   socket.on("new-message-received", (message) => {
  //     setChatMessages([message, ...chatMessages]);
  //   })
  // }, []);

  const handleChange = (e) => {
    setReply(e);
  };

  //header section
  function renderHeaderSection() {
    return (
      <View className="flex flex-row mt-10 items-center">
        <TouchableOpacity className="mr-2">
          <Ionicons
            name="chevron-back"
            size={26}
            color={COLORS.white}
            onPress={() => navigation.goBack()}
          />
        </TouchableOpacity>
        <ChatHeader avatar={avatar} name={name} />
      </View>
    );
  }

  function renderMessageInbox() {
    return (
      <View className="flex flex-col justify-end grow bg-slate-400/20 rounded-lg my-2 p-3">
        {isLoading ?
          <Text className={`text-white italic text-xs`}>loading messages...</Text>
          :
          <FlatList
            data={chatMessages && chatMessages}
            contentContainerStyle={styles.inboxContainer}
            renderItem={({ item }) => (
              <ChatMessage
                color={`bg-purple ${
                  user._id === item.postedByUser ? "bg-white rounded-tl-lg" : ""
                } ${!(user._id === item.postedByUser) ? "rounded-tr-lg" : ""}`}
                textColor={`${
                  user._id === item.postedByUser ? "text-purple" : "text-white"
                }`}
                classnames={` ${
                  user._id === item.postedByUser ? "items-end" : "items-start"
                }`}
                item={item}
              />
            )}
            keyExtractor={(item, index) => index}
          />
        }
        {msg && <ChatMessage 
          color="bg-white rounded-tl-lg"
          classnames={'items-end'}
          textColor={'text-purple'}
          item={tempMsg}
        />}
      </View>
    );
  }

  function renderMessageInput() {
    return (
      <ChatMessageInput
        handleChange={handleChange}
        handleSubmit={handlePostMsg}
        reply={reply}
      />
    );
  }

  return (
    <View className="flex flex-col h-full bg-black py-10">
      {renderHeaderSection()}
      {renderMessageInbox()}
      {renderMessageInput()}
    </View>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  inboxContainer: {
    flex: 1,
    flexDirection: "column-reverse"
  }
});

export default MainMessageFullViewScreen;
