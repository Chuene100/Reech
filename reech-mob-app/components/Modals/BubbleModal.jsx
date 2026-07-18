import React from "react";
import { Modal, View, TouchableOpacity, Image, Text } from "react-native";
import { AntDesign, EvilIcons, Ionicons } from "@expo/vector-icons";

//custom
import { COLORS, icons } from "../../constants";

const BubbleModal = ({ isModalVisible, closeModal, navigation, styles }) => {
  return (
    <Modal
      visible={isModalVisible}
      animationIn="lightSpeedIn"
      animationOut="fadeOutDown"
    // coverScreen={true}
    >
      <View className='bg-black pt-20 h-full'>
        {/*header top section*/}
        <View style={styles.headerTopContainer}>

          {/*top navigation section*/}
          <View style={styles.headerTopContent}>
            <EvilIcons
              onPress={closeModal}
              name="close"
              size={24}
              color={COLORS.white}
            />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("WelcomeScreen"), closeModal;
              }}
              style={styles.reechImageLogoContainer}
            >
              <Image
                source={icons.logoPurpleAndWhite}
                style={styles.reechImageLogo}
              />
            </TouchableOpacity>
            <AntDesign name="" size={24} color={COLORS.white} />
          </View>

          {/*middle navigation section*/}
          <View style={styles.middleNavigationContentContainer}>
            {/*add experience navigation*/}
            <View style={styles.navigationContentItems}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("AddExperienceScreen"), closeModal();
                }}
                style={styles.navigationContainer}
              >
                <Ionicons name="" size={20} color={COLORS.transparent} />
                <Text style={styles.navigationTextItem}>Experience</Text>
                <Image
                  style={styles.navigationImageItem}
                  source={icons.nav1}
                />
              </TouchableOpacity>
              <Text style={styles.navigationDescriptionTextItem}>
                Share an experience with your bubble mates
              </Text>
            </View>

            {/*add community navigation*/}
            <View style={styles.navigationContentItems}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("AddCommunityEngagementScreen"),
                    closeModal();
                }}
                style={styles.navigationContainer}
              >
                <Ionicons name="" size={20} color={COLORS.transparent} />
                <Text style={styles.navigationTextItem}>
                  Add Community Engagement
                </Text>
                <Image
                  style={styles.navigationImageItem}
                  source={icons.nav2}
                />
              </TouchableOpacity>
              <Text style={styles.navigationDescriptionTextItem}>
                Showcase your community engagements
              </Text>
            </View>

            {/*add life experience navigation*/}
            <View style={styles.navigationContentItems}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("AddBeyondWorkScreen"), closeModal();
                }}
                style={styles.navigationContainer}
              >
                <Ionicons name="" size={20} color={COLORS.transparent} />
                <Text style={styles.navigationTextItem}>
                  Add a Life experience
                </Text>
                <Image
                  style={styles.navigationImageItem}
                  source={icons.nav3}
                />
              </TouchableOpacity>
              <Text style={styles.navigationDescriptionTextItem}>
                What you do beyond work
              </Text>
            </View>

            {/*add vouch for navigation*/}
            <View style={styles.navigationContentItems}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("VouchForBubbleMateScreen"),
                    closeModal();
                }}
                style={styles.navigationContainer}
              >
                <Ionicons name="" size={20} color={COLORS.transparent} />
                <Text style={styles.navigationTextItem}>Vouch for</Text>
                <Image
                  style={styles.navigationImageItem}
                  source={icons.nav4}
                />
              </TouchableOpacity>
              <Text style={styles.navigationDescriptionTextItem}>
                Speak up for the people and places you love
              </Text>
            </View>

            {/*add search reech navigation*/}
            <View style={styles.navigationContentItems}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("SearchReechersScreen"), closeModal();
                }}
                style={styles.navigationContainer}
              >
                <Ionicons name="" size={20} color={COLORS.transparent} />
                <Text style={styles.navigationTextItem}>Search Reech</Text>
                <Image
                  style={styles.navigationImageItem}
                  source={icons.nav5}
                />
              </TouchableOpacity>
              <Text style={styles.navigationDescriptionTextItem}>
                Search for people and places
              </Text>
            </View>

            {/*add search ad navigation*/}
            <View style={styles.navigationContentItems}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("SearchAdScreen"), closeModal();
                }}
                style={styles.navigationContainer}
              >
                <Ionicons name="" size={20} color={COLORS.transparent} />
                <Text style={styles.navigationTextItem}>Search Ad</Text>
                <Image
                  style={styles.navigationImageItem}
                  source={icons.nav6}
                />
              </TouchableOpacity>
              <Text style={styles.navigationDescriptionTextItem}>
                Search all Ads
              </Text>
            </View>
          </View>
        </View>

      </View>
    </Modal>
  );
}

export default BubbleModal;
