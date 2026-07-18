import React, { useState } from "react";
import {
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Entypo, AntDesign } from "@expo/vector-icons";

//import customs
import { COLORS, icons } from "../../constants";
import CustomButton from "../Auth/CustomButton";
import AccountModal from "../Modals/AccountModal";
import BubbleModal from "../Modals/BubbleModal";
import ProfileModal from "../Modals/ProfileModal";
import LatestProfileModal from "../Modals/LatestProfileModal";
import { useSelector } from "react-redux";

const NavHeader = ({
  message,
  accountModal,
  bubbleModal,
  profileModal,
  icon,
  to,
  to_params,
  consoleMsg,
  paramUser,
}) => {
  const currentUser = useSelector((state) => state.user.current_user);

  const [user] = useState(paramUser ?? currentUser ?? "")

  const navigation = useNavigation();

  //popup modal
  const [isModalTopVisible, setIsModalTopVisible] = useState(false);
  const handleTopModal = () => setIsModalTopVisible(() => !isModalTopVisible);
  const closeTopModal = () => setIsModalTopVisible(() => !isModalTopVisible);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleModal = () => setIsModalVisible(() => !isModalVisible);
  const closeModal = () => setIsModalVisible(() => !isModalVisible);

  const onPrioritiesPressed = () => {
    console.log("onPrioritiesPressed");
  };

  const onMutePressed = () => {
    console.log("onMutePressed");
  };

  const onRemovePressed = () => {
    console.log("onRemovePressed");
  };

  const onReportPressed = () => {
    console.log("onReportPressed");
  };

  //header items section
  function renderHeaderSection() {
    return (
      <>
        <View style={styles.headerItemsContainer}>
          {/*navigation container*/}
          <View style={styles.headerNavigationContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.headerNavigationContent}
            >
              <Entypo name="chevron-left" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/*images content container*/}
          <View style={styles.headerImageContainer}>
            {/*image content*/}
            <Pressable
              onPress={() => navigation.navigate("WelcomeScreen")}
              style={styles.headerImageContent}
            >
              <Image
                source={icons.logoPurpleAndWhite}
                style={styles.headerImageItem}
              />
            </Pressable>

            {/*dropdown trigger content*/}
            {message && (
              <Pressable
                onPress={handleTopModal}
                style={styles.dropdownIconContainer}
              >
                <Ionicons name="chevron-down" size={24} color={COLORS.white} />
              </Pressable>
            )}
          </View>

          {/*trigger logo dropdown modal*/}
          <Modal
            isVisible={isModalTopVisible}
            animationIn="lightSpeedIn"
            animationOut="lightSpeedOut"
          >
            <View style={styles.modalInnerContent}>
              <ImageBackground
                source={icons.popupBg}
                style={styles.modalBackgroundImageContainer}
              >
                {/*modal content items*/}
                <View style={styles.modalItemsContainer}>
                  {/*modal close action item*/}
                  <View style={styles.closeActionContainer}>
                    <AntDesign
                      onPress={closeTopModal}
                      name="closecircle"
                      size={20}
                      color={COLORS.white}
                    />
                  </View>

                  {/*modal information text items*/}
                  <View style={styles.modalTextInfoContainer}>
                    <Text style={styles.modalTextHeadingItem}>
                      Hi {user?.firstName}
                    </Text>

                    <Text style={styles.modalTextHeadingItem}>{message}</Text>
                  </View>

                  {/*modal button actions items*/}
                  <View style={styles.modalButtonsContainer}>
                    <CustomButton
                      onPress={() => [
                        navigation.navigate("ReechingForHomeScreen"),
                        closeTopModal(),
                      ]}
                      text="Reech for"
                      type="WELCOME"
                    />

                    <CustomButton
                      onPress={() => [
                        navigation.navigate("WelcomeScreen"),
                        closeTopModal(),
                      ]}
                      text="be Reeched"
                      type="WELCOME"
                    />
                  </View>
                </View>
              </ImageBackground>
            </View>
          </Modal>

          {/*other option container*/}

          <TouchableOpacity
            onPress={
              consoleMsg
                ? () => console.log(consoleMsg)
                : to
                  ? () => {
                    navigation.navigate(to, to_params);
                  }
                  : handleModal
            }
            style={styles.headerOtherOptionContainer}
          >
            {icon}
          </TouchableOpacity>

          {/*modal options*/}
          {accountModal === true && (
            <AccountModal
              isModalVisible={isModalVisible}
              closeModal={closeModal}
              onPrioritiesPressed={onPrioritiesPressed}
              onMutePressed={onMutePressed}
              onRemovePressed={onRemovePressed}
              onReportPressed={onReportPressed}
              user={user}
            />
          )}

          {bubbleModal === true && (
            <BubbleModal
              styles={styles}
              isModalVisible={isModalVisible}
              navigation={navigation}
              closeModal={closeModal}
            />
          )}

          {profileModal === true && (
            <LatestProfileModal
              isModalVisible={isModalVisible}
              closeModal={closeModal}
            />
          )}
        </View>
      </>
    );
  }

  return <View style={styles.componentContainer}>{renderHeaderSection()}</View>;
};

//custom style
const styles = StyleSheet.create({
  //header items container
  headerItemsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: Platform.OS === "ios" ? 35 : 30,
    marginHorizontal: Platform.OS === "ios" ? 10 : 8,
  },

  //navigation section
  headerNavigationContainer: {
    width: "10%",
  },
  headerNavigationContent: {
    justifyContent: "center",
    alignItems: "center",
  },

  //image section
  headerImageContainer: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerImageContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerImageItem: {
    resizeMode: "contain",
    width: Platform.OS === "ios" ? 100 : 80,
    height: 25,
  },
  dropdownIconContainer: {
    top: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  //other option section
  headerOtherOptionContainer: {
    width: "10%",
    justifyContent: "center",
    alignItems: "flex-end",
  },

  //modal content section
  modalInnerContent: {
    height: "50%",
    width: "100%",
    justifyContent: "center",
  },
  modalBackgroundImageContainer: {
    overflow: "hidden",
    width: "100%",
    resizeMode: "cover",
    borderRadius: 20,
  },
  modalItemsContainer: {
    flexDirection: "column",
    marginVertical: "2%",
    marginHorizontal: 10,
    borderRadius: 10,
  },
  closeActionContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  modalTextInfoContainer: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  modalTextHeadingItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
    marginBottom: "5%",
  },
  modalButtonsContainer: {
    flexDirection: "column",
    marginBottom: "5%",
    marginHorizontal: 30,
  },

  //modal top
  modalTopContainer: {
    height: "50%",
    width: "100%",
    justifyContent: "center",
  },
  imgBg: {
    overflow: "hidden",
    width: "100%",
    height: "auto",
    resizeMode: "cover",
    borderRadius: 10,
  },
  topContainer: {
    flexDirection: "column",
    marginBottom: "10%",
    borderRadius: 10,
  },
  topBackIcon: {
    top: 10,
    right: 10,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  textTopContainer: {
    marginHorizontal: 15,
    padding: 10,
  },
  textTopContent: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  textTopItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  textTopSubItem: {
    top: 10,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  textContainer: {
    marginHorizontal: 15,
    padding: 5,
  },
  textContent: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: COLORS.white,
    flexDirection: "row",
  },
  textItem: {
    color: COLORS.black,
    fontSize: 20,
    fontFamily: "PoppinsBold",
  },

  //navigation modal section
  navigationModalContainer: {
    backgroundColor: COLORS.black,
    width: "100%",
    right: Platform.OS === "ios" ? 21 : 18,
    top: Platform.OS === "ios" ? 0 : -15,
    marginBottom: Platform.OS === "ios" ? 0 : -20,
  },
  headerTopContainer: {
    width: "100%",
    padding: 2,
  },
  headerTopContent: {
    top: Platform.OS === "ios" ? -33 : -80,
    paddingHorizontal: Platform.OS === "ios" ? 0 : 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reechImageLogoContainer: {
    right: 15,
  },
  reechImageLogo: {
    width: Platform.OS === "ios" ? 100 : 80,
    height: 25,
    resizeMode: "contain",
  },

  //middle navigation content
  middleNavigationContentContainer: {
    flexDirection: "column",
    marginTop: Platform.OS === "ios" ? 50 : -45,
    padding: 2,
    paddingHorizontal: Platform.OS === "ios" ? 0 : 10,
  },
  navigationContentItems: {
    flexDirection: "column",
    marginBottom: 50,
  },
  navigationContainer: {
    backgroundColor: COLORS.reechGray,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  navigationTextItem: {
    alignSelf: "center",
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  navigationImageItem: {
    width: 30,
    height: 30,
    resizeMode: "cover",
  },
  navigationDescriptionTextItem: {
    marginTop: 10,
    color: COLORS.darkGray,
    fontSize: 10,
    fontFamily: "PoppinsLight",
  },
});

export default NavHeader;
