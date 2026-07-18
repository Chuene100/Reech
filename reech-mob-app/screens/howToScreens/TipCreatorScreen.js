import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Platform,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";

//customs
import { COLORS, images } from "../../constants";
import { CustomInput, CustomInputTextAreaTip } from "../../components";
import NavHeader from "@/components/Headers/NavHeader";

const TipCreatorScreen = ({ route }) => {
  const { control, handleSubmit } = useForm();

  const navigation = useNavigation();

  const item = route.params.item;
  const profilePicture = route.params.profilePicture;
  const title = route.params.title;
  const userName = route.params.userName;
  const video = route.params.video;
  const profileName = route.params.profileName;
  const thoughtType = route.params.thoughtType;

  const user = useSelector((state) => state.user.current_user);

  //tip values
  const [tenValue, setTenValue] = useState(false);
  const [twentyValue, setTwentyValue] = useState(false);
  const [fiftyValue, setFiftyValue] = useState(false);

  const setTen = () => {
    setTenValue(true);
    setTwentyValue(false);
    setFiftyValue(false);
  };
  const setTwenty = () => {
    setTenValue(false);
    setTwentyValue(true);
    setFiftyValue(false);
  };
  const setFifty = () => {
    setTenValue(false);
    setTwentyValue(false);
    setFiftyValue(true);
  };

  const tipCreatorHandler = (data) => {
    console.log(data);
    navigation.goBack();
  };

  //screen header section
  function renderHeaderSection() {
    return (
      <View style={styles.screenHeader}>
        <NavHeader message="What would you like to do?" />
      </View>
    )
  }

  //receiver profile section
  function renderReceiverProfileSection() {
    return (
      <View style={styles.receiverContainer}>
        <TouchableOpacity onPress={() => {
          if (item.userId?._id === user?._id)
            navigation.navigate("LoggedInAccountUserScreen");
          else
            navigation.navigate("AccountFullViewScreen", {
              userId: item.userId?._id,
            });
        }}>
          <ImageBackground
            source={images.userFrame}
            style={styles.receiverImageContainer}
          >
            <Image source={{ uri: profilePicture }} style={styles.receiverImage} />
          </ImageBackground>
        </TouchableOpacity>


        {/*tip creator information*/}
        <View style={styles.receiverInfoContainer}>
          <Text onPress={() => {
            if (item.userId?._id === user?._id)
              navigation.navigate("LoggedInAccountUserScreen");
            else
              navigation.navigate("AccountFullViewScreen", {
                userId: item.userId?._id,
              });
          }}
            style={styles.receiverInfoName}
          >
            {thoughtType ? `${title}` : `${userName}`}
          </Text>

          <Text numberOfLines={3} style={styles.receiverInfoProName}>
            {thoughtType ? `${profileName}` : `${title}`}
          </Text>

          <Text style={styles.receiverInfoVidName}>
            {thoughtType ? (
              <MaterialCommunityIcons
                name="thought-bubble"
                size={16}
                color={COLORS.darkGray}
              />
            ) : (
              <Octicons name="video" size={18} color={COLORS.white} />
            )}
            {thoughtType ? " " + thoughtType + " thought" : " " + video}
          </Text>
        </View>
      </View>
    )
  }

  //tip option section
  function renderTipOptionSection() {
    return (
      <View style={styles.tipMoneyContainer}>
        <View style={styles.tipCircular}>
          {/*ten*/}
          <Pressable
            control={control}
            onPress={() => setTen()}
            style={styles.tipItem}
          >
            <View
              style={[
                styles.tipItemCenterContainer,
                {
                  borderColor: tenValue ? COLORS.purple : COLORS.transparent,
                  backgroundColor: tenValue
                    ? COLORS.purple
                    : COLORS.transparent,
                },
              ]}
            >
              <Text style={styles.moneyTip}>R10</Text>
            </View>
          </Pressable>

          {/*twenty*/}
          <Pressable
            control={control}
            onPress={() => setTwenty()}
            style={styles.tipItem}
          >
            <View
              style={[
                styles.tipItemCenterContainer,
                {
                  borderColor: twentyValue ? COLORS.purple : COLORS.transparent,
                  backgroundColor: twentyValue
                    ? COLORS.purple
                    : COLORS.transparent,
                },
              ]}
            >
              <Text style={styles.moneyTip}>R20</Text>
            </View>
          </Pressable>

          {/*fifty*/}
          <Pressable
            control={control}
            onPress={() => setFifty()}
            style={styles.tipItem}
          >
            <View
              style={[
                styles.tipItemCenterContainer,
                {
                  borderColor: fiftyValue ? COLORS.purple : COLORS.transparent,
                  backgroundColor: fiftyValue
                    ? COLORS.purple
                    : COLORS.transparent,
                },
              ]}
            >
              <Text style={styles.moneyTip}>R50</Text>
            </View>
          </Pressable>

          {/*custom money*/}
          <View style={styles.customTipContainer}>
            <Text style={styles.customText}>R</Text>
            <View style={styles.customInput}>
              <CustomInput
                name="paymentAmount"
                control={control}
                placeholder={"Custom"}
                rules={{
                  require: "Please enter an amount to be tipped",
                  pattern: {
                    value: /^[0-9\b]+$/,
                    message:
                      " Your entry cannot contain strings or special characters",
                  },
                }}
              />
            </View>
          </View>
        </View>
      </View>
    )
  }

  //tip creator section 
  function renderTipCreatorFormSection() {
    return (
      <View style={styles.personalContainer}>
        <Text style={styles.personalTextHeading}>
          Creator receives 100% of your tip.
        </Text>

        {/*tip creator form*/}
        <ScrollView showsVerticalScrollIndicator={false} style={styles.personalRefText}>
          <CustomInputTextAreaTip
            name="paymentRef"
            control={control}
            placeholder={"Add personal note up to 140 characters"}
            rules={{
              required: "Please add a reference",
              maxLength: {
                value: 140,
                message: "A personal note can only be 140 characters long.",
              },
            }}
          />
        </ScrollView>

        {/*tip button item*/}
        <Pressable
          onPress={handleSubmit(tipCreatorHandler)}
          style={styles.btnContentTip}
        >
          <Image source={images.tipButton} style={styles.tipButtonItem} />
        </Pressable>
      </View>
    )
  }

  //screen content list
  function renderScreenContentList() {
    return (
      <>
        {renderHeaderSection()}
        {renderReceiverProfileSection()}
        {renderTipOptionSection()}
        {renderTipCreatorFormSection()}
      </>
    )
  }

  return (
    <View style={styles.tipModalInnerContent}>
      {renderScreenContentList()}
    </View>
  );
};

const styles = StyleSheet.create({
  screenHeader: {
    marginTop: Platform.OS === "ios" ? "8%" : 0,
  },

  //receiver section
  receiverContainer: {
    width: "100%",
    flexDirection: "row",
    marginTop: 30,
    marginBottom: 10,
  },
  receiverImageContainer: {
    width: 110,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "cover",
    borderRadius: 8,
    borderWidth: 2,
  },
  receiverImage: {
    top: 2,
    left: 2,
    width: 105,
    height: 105,
    resizeMode: "cover",
    borderRadius: 8,
    borderColor: COLORS.black,
    borderWidth: 3,
  },
  receiverInfoContainer: {
    width: "60%",
    left: 15,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  receiverInfoName: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  receiverInfoProName: {
    color: COLORS.darkGray,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    textTransform: "capitalize",
    marginVertical: 2,
  },
  receiverInfoVidName: {
    color: COLORS.darkGray,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    marginTop: 2,
  },

  //tip section
  tipModalInnerContent: {
    flex: 1,
    marginTop: "0%",
    padding: "4%",
    backgroundColor: COLORS.black,
  },
  tipMoneyContainer: {
    flexDirection: "row",
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 0,
    width: "100%",
    right: 10,
    backgroundColor: COLORS.transparent,
  },
  tipCircular: {
    width: "60%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tipItem: {
    justifyContent: "center",
    alignItems: "center",
    width: 74,
    height: 74,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.purple,
    backgroundColor: COLORS.transparent,
  },
  tipItemCenterContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 50,
    borderWidth: 3,
  },
  moneyTip: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  customTipContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    width: Platform.OS === "ios" ? "60%" : 110,
    height: 74,
    padding: 10,
    marginHorizontal: 0,
    borderColor: COLORS.black,
    borderRadius: 10,
    borderWidth: 3,
  },
  customText: {
    top: 15,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  customInput: {
    width: "95%",
    bottom: 2,
  },
  personalContainer: {
    marginVertical: 15,
  },
  personalTextHeading: {
    color: COLORS.darkGray,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  personalRefText: {
    right: 2,
    marginTop: 10,
  },
  btnContentTip: {
    top: Platform.OS === "ios" ? "40%" : "25%",
    justifyContent: "center",
    alignSelf: "center",
    marginHorizontal: 50,
    left: 10,
    width: "50%",
  },
  tipButtonItem: {
    height: 45,
    width: 165,
  },
  tipGradientContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    height: 45,
    width: "100%",
  },
  btnTextItemTip: {
    alignSelf: "center",
    color: COLORS.white,
    fontSize: 20,
    fontFamily: "PoppinsBold",
  },
});

export default TipCreatorScreen;
