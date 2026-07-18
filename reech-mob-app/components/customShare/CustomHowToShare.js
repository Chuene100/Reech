import React, { useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

//customs
import { COLORS, images } from "../../constants";

const CustomHowToShare = () => {
  const [shareModal, setShareModal] = useState(false);

  return (
    <View>
      <Pressable
        onPress={() => setShareModal(true)}
        style={styles.actionContent}
      >
        <FontAwesome name="share-square-o" size={24} color={COLORS.white} />
        <Text style={styles.actionText}>165</Text>
      </Pressable>

      <Modal
        visible={shareModal}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={false}
        presentationStyle="pageSheet"
        style={styles.shareModalContainer}
      >
        <View style={styles.shareInnerModalContainer}>
          {/*middle share section*/}
          <View style={styles.shareMiddleSectionContainer}>
            {/*close modal*/}
            <Pressable
              style={styles.shareCloseIcon}
              onPress={() => setShareModal(false)}
            >
              <AntDesign name="closecircle" size={25} color={COLORS.white} />
            </Pressable>

            {/*social icon section*/}
            <View style={styles.shareMiddleSectionContent}>
              <Text style={styles.shareMiddleText}>Share to...</Text>
              {/*whatsapp social link*/}
              <Pressable
                onPress={() => console.log("whatsapp share")}
                style={styles.shareSocialIcons}
              >
                <Image source={images.wa} style={styles.shareIconItem} />
                <Text style={styles.shareIconText}>whatsApp</Text>
              </Pressable>

              {/*messages social link*/}
              <Pressable
                onPress={() => console.log("message share")}
                style={styles.shareSocialIcons}
              >
                <Image source={images.em} style={styles.shareIconItem} />
                <Text style={styles.shareIconText}>messages</Text>
              </Pressable>

              {/*instagram social link*/}
              <Pressable
                onPress={() => console.log("instagram share")}
                style={styles.shareSocialIcons}
              >
                <Image source={images.In} style={styles.shareIconItem} />
                <Text style={styles.shareIconText}>instagram stories</Text>
              </Pressable>

              {/*messenger social link*/}
              <Pressable
                onPress={() => console.log("messenger share")}
                style={styles.shareSocialIcons}
              >
                <Image source={images.ms} style={styles.shareIconItem} />
                <Text style={styles.shareIconText}>messenger</Text>
              </Pressable>

              {/*twitter social link*/}
              <Pressable
                onPress={() => console.log("twitter share")}
                style={styles.shareSocialIcons}
              >
                <Image
                  source={images.tw}
                  style={[styles.shareIconItem, { width: 60, height: 60 }]}
                />
                <Text style={styles.shareIconText}>twitter</Text>
              </Pressable>

              {/*generated-link video link*/}
              <Pressable
                onPress={() => console.log("link share")}
                style={styles.shareSocialIcons}
              >
                <Image source={images.link} style={styles.shareIconItem} />
                <Text style={styles.shareIconText}>copy link</Text>
              </Pressable>

              {/*more options*/}
              <Pressable
                onPress={() => console.log("more option show")}
                style={styles.moreShare}
              >
                <Text style={styles.moreShareText}>more options</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  actionContent: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    marginTop: 5,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },

  //share modal
  shareModalContainer: {
    height: "100%",
    marginTop: 10,
    activeOpacity: 0.9,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  shareInnerModalContainer: {
    flex: 1,
    marginTop: "0%",
    padding: "4%",
    backgroundColor: COLORS.black,
    transparent: true,
  },
  shareMiddleSectionContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  shareMiddleSectionContent: {
    alignItems: "flex-start",
    padding: 10,
  },
  shareMiddleText: {
    alignSelf: "center",
    color: COLORS.white,
    fontSize: 26,
    fontFamily: "PoppinsBold",
  },
  shareSocialIcons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  shareIconItem: {
    width: 50,
    height: 50,
    resizeMode: "cover",
  },
  shareIconText: {
    left: 10,
    textTransform: "capitalize",
    color: COLORS.white,
    fontSize: 20,
    fontFamily: "PoppinsBold",
  },
  moreShare: {
    top: 20,
    alignSelf: "center",
  },
  moreShareText: {
    textTransform: "capitalize",
    color: COLORS.white,
    fontSize: 22,
    fontFamily: "PoppinsBold",
  },
  shareCloseIcon: {
    alignSelf: "flex-end",
    bottom: 20,
  },
});

export default CustomHowToShare;
