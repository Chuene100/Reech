import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import moment from "moment";

//Custom import
import { useReadUserQuery } from "../../redux/api/api-slice";
import BoxAvatar from "./BoxAvatar";

const ChatRooms = ({ userId, item, styles }) => {
  const navigation = useNavigation();
  // eslint-disable-next-line no-unused-vars
  const [recentMessage, setRecentMessage] = useState(
    item?.recentMessage && item.recentMessage[0]
  );
  

  const { data: user } = useReadUserQuery( userId === item?.userIds[0] ? item?.userIds[1] : item?.userIds[0]);

  // last message
  // useLayoutEffect(() => {
  //     setRecentMessage(item.messages[item.messages.length - 1]);
  // }, []);

  // navigate to inbox
  const handleNavigation = () => {
    navigation.navigate("MainMessageFullViewScreen", {
      id: item?._id,
      userId: user?._id,
      name: item?.name,
      avatar: item?.avatar
    });
  };

  return (
    <View style={styles.messageContent}>
      <TouchableOpacity style={styles.messageItems} onPress={handleNavigation}>
        <BoxAvatar user={item} />
        
        <View style={styles.textContainer}>
          <Text style={styles.username}>
            {item?.name}
          </Text>
          {item?.recentMessage[0]?.message ? (
            <Text style={styles.userMessage} numberOfLines={1}>
              {item?.recentMessage[0]?.message.length < 40
                ? item?.recentMessage[0]?.message
                : item?.recentMessage[0]?.message.slice(0, 37) + "..."}
            </Text>
          ) : (
            <Text
              style={[
                styles.userMessage,
                { opacity: 0.5, fontStyle: "italic" },
              ]}
            >
              Open to start chatting.
            </Text>
          )}
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.timeFrame}>
            {recentMessage && moment(recentMessage.createdAt).format("HH:mm")}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ChatRooms;
