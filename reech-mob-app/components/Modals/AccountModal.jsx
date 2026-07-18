import React from "react";
import {
  Modal, View, Image, Text, Pressable, Platform, StyleSheet,
} from "react-native";
import { COLORS, icons } from "../../constants";
import { Ionicons, Octicons } from "@expo/vector-icons";

const AccountModal = ({ user, isModalVisible, closeModal, onPrioritiesPressed, onMutePressed, onRemovePressed, onReportPressed }) => {

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isModalVisible}
      statusBarTranslucent={true}
      style={styles.moreOptionModalContainer}
    >
      {/*more option modal content*/}
      <View style={styles.innerMoreModalContainer}>
        {/*modal close action section*/}
        <View style={styles.innerMoreModalContent}>
          <Pressable onPress={closeModal}>
            <Ionicons name="close" size={16} color={COLORS.white} />
          </Pressable>
        </View>

        {/*more modal option section */}
        <View style={styles.moreModalOptionContent}>
          {/*prior option*/}
          <Pressable
            onPress={() => onPrioritiesPressed()}
            style={styles.moreModalOptionContainer}
          >
            {/*icon section*/}
            <View style={styles.moreModalOptionIconContainer}>
              <Image
                source={icons.noHeart}
                style={{ height: 25, width: 25 }}
              />
            </View>

            {/*modal option text section*/}
            <View style={styles.moreModalOptionTextContainer}>
              <Text style={styles.moreModalOptionHeaderText}>
                Prioritise
              </Text>
              <Text style={styles.moreModalOptionInfoText}>
                See more from {user?.firstName} {user?.lastName}
              </Text>
            </View>
          </Pressable>

          {/*mute option*/}
          <Pressable
            onPress={() => onMutePressed()}
            style={styles.moreModalOptionContainer}
          >
            {/*icon section*/}
            <View style={styles.moreModalOptionIconContainer}>
              <Octicons name="mute" size={22} color={COLORS.white} />
            </View>

            {/*modal option text section*/}
            <View style={styles.moreModalOptionTextContainer}>
              <Text style={styles.moreModalOptionHeaderText}>Mute</Text>
              <Text style={styles.moreModalOptionInfoText}>
                Take a break from {user?.firstName} {user?.lastName}
              </Text>
            </View>
          </Pressable>

          {/*remove option*/}
          <Pressable
            onPress={() => onRemovePressed()}
            style={styles.moreModalOptionContainer}
          >
            {/*icon section*/}
            <View style={styles.moreModalOptionIconContainer}>
              <Image
                source={icons.noUser}
                style={{ height: 25, width: 25 }}
              />
            </View>

            {/*modal option text section*/}
            <View style={styles.moreModalOptionTextContainer}>
              <Text style={styles.moreModalOptionHeaderText}>Remove</Text>
              <Text style={styles.moreModalOptionInfoText}>
                Remove {user?.firstName} {user?.lastName} from your bubble
              </Text>
            </View>
          </Pressable>

          {/*report option*/}
          <Pressable
            onPress={() => onReportPressed()}
            style={styles.moreModalOptionContainer}
          >
            {/*icon section*/}
            <View style={styles.moreModalOptionIconContainer}>
              <Image
                source={icons.noFlag}
                style={{ height: 25, width: 25 }}
              />
            </View>

            {/*modal option text section*/}
            <View style={styles.moreModalOptionTextContainer}>
              <Text style={styles.moreModalOptionHeaderText}>Report</Text>
              <Text style={styles.moreModalOptionInfoText}>
                {`Do you want to hide ${user?.firstName} ${user?.lastName}'s posts?`}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default AccountModal;

const styles = StyleSheet.create({
  componentContainer: {
    flex: 1,
  },

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
    fontWeight: "400",
    marginBottom: "5%",
  },
  modalButtonsContainer: {
    flexDirection: "column",
    marginBottom: "5%",
    marginHorizontal: 30,
  },

  //more option modal
  moreOptionModalContainer: {
    width: Platform.OS === "ios" ? "105%" : "100%",
    right: Platform.OS === "ios" ? 25 : 18,
  },
  innerMoreModalContainer: {
    marginTop: Platform.OS === "ios" ? "146%" : "126%",
    padding: "4%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: COLORS.opacityBlack,
  },
  innerMoreModalContent: {
    right: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  moreModalOptionContent: {
    left: 30,
    flexDirection: "column",
  },
  moreModalOptionContainer: {
    top: 15,
    marginBottom: 30,
    flexDirection: "row",
  },
  moreModalOptionIconContainer: {
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
  },
  moreModalOptionTextContainer: {
    left: 10,
    width: "65%",
    flexDirection: "column",
  },
  moreModalOptionHeaderText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  moreModalOptionInfoText: {
    opacity: 0.8,
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "400",
  },
});
