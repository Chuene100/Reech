import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable, Platform, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";

//import customs
import { COLORS, icons } from "../../../constants";
import { BlurbComponent } from "../../../components";
import NavHeader from "@/components/Headers/NavHeader";
import { ImageBackground } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const AddThoughtDescriptionScreen = ({ route }) => {
  const navigation = useNavigation();

  const { control, handleSubmit } = useForm();

  const previousThoughtData = route.params.data;

  const [savedToDrafts, setSavedToDrafts] = useState(false);

  //handle data to be submitted
  const saveButtonPressed = (data) => {
    data = { ...data, ...previousThoughtData };

    navigation.navigate("ThoughtsSavedDraftsScreen", data);
    setSavedToDrafts(false);
  };

  //handle data to be submitted
  const previewButtonPressed = (data) => {
    data = { ...data, ...previousThoughtData };

    navigation.navigate("PreviewThoughtScreen", {
      data: data,
    });
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader
          message="What would you like to do?"
        />

        {/*header text item*/}
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitleItem}>Add your thought</Text>
        </View>
      </View>
    );
  }

  //form items section
  function renderFormItemSection() {
    return (
      <View style={styles.formItemContainer}>
        {/*add description section*/}
        <View style={styles.formItemDescriptionContent}>
          <View style={styles.formDescriptionComponentItem}>
            <BlurbComponent
              name="thought"
              control={control}
              rules={{
                required: "Please ensure you provide a thought.",
                maxLength: {
                  value: 10000,
                  message: "Thought must only be 10000 characters long",
                },
              }}
              placeholder="Start writing your thought here..."
            />
          </View>
        </View>
      </View>
    );
  }

  //button section
  function renderSaveAndSubmitButtonSection() {
    return (
      <View style={styles.buttonItemsContainer}>
        {/*save to draft*/}
        <Pressable
          onPress={() => setSavedToDrafts(true)}
          style={styles.buttonContainer}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
            style={styles.buttonGradientContainer}
          >
            <Text style={styles.buttonTextItem}>Save to drafts</Text>
          </LinearGradient>
        </Pressable>

        <Pressable
          onPress={handleSubmit(previewButtonPressed)}
          style={styles.buttonContainer}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
            style={styles.buttonGradientContainer}
          >
            <Text style={styles.buttonTextItem}>Preview</Text>
          </LinearGradient>
        </Pressable>
      </View>
    );
  }

  //saved to drafts modal
  function renderSavedToDraftsModal() {
    return (
      <Modal
        visible={savedToDrafts}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        style={styles.savedModalContainer}
      >
        <ImageBackground
          source={icons.popupBg}
          style={styles.savedInnerModalContainer}
        >
          {/*modal close action section*/}
          <View style={styles.savedInnerModalContent}>
            <Pressable onPress={() => setSavedToDrafts(false)}>
              <Ionicons name="close" size={18} color={COLORS.white} />
            </Pressable>
          </View>

          {/*modal option text section*/}
          <View style={styles.savedModalOptionContent}>
            {/*save option*/}
            <Pressable
              onPress={handleSubmit(saveButtonPressed)}
              style={styles.savedModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.savedModalOptionIconContainer}>
                <MaterialCommunityIcons name="content-save-all" size={25} color={COLORS.white} />
              </View>

              {/*modal option text section*/}
              <View style={styles.savedModalOptionTextContainer}>
                <Text style={styles.savedModalOptionHeaderText}>Save to drafts</Text>
                <Text style={styles.savedModalOptionInfoText}>
                  Fill out the form, store your info, and come back later to make changes.
                </Text>
              </View>
            </Pressable>
          </View>
        </ImageBackground>
      </Modal>
    )
  }

  //screen list
  return (
    <View style={styles.container}>
      {renderHeaderSection()}
      {renderFormItemSection()}
      {renderSaveAndSubmitButtonSection()}
      {renderSavedToDraftsModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //header section
  headerContainer: {
    zIndex: 99,
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },
  headerTitleContainer: {
    marginTop: 15,
    marginHorizontal: 20,
  },
  headerTitleItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //form item section
  formItemContainer: {
    marginTop: 10,
    height: "73%",
  },
  formItemTitleContent: {
    marginBottom: 5,
  },
  formItemDescriptionContent: {
    marginTop: 0,
  },
  formDescriptionComponentItem: {
    paddingTop: 5,
    paddingHorizontal: 10,
    height: "100%",
  },

  //button section
  buttonItemsContainer: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingVertical: 2,
    marginTop: 30,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: "45%",
  },
  buttonGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 45,
    width: "100%",
  },
  buttonTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //saved to drafts modal
  savedModalContainer: {
    marginTop: 10,
  },
  savedInnerModalContainer: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? "185%" : "175%",
    padding: "4%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  savedInnerModalContent: {
    right: 5,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  savedModalOptionContent: {
    left: Platform.OS === "ios" ? 18 : 30,
    flexDirection: "column",
  },
  savedModalOptionContainer: {
    top: 15,
    marginBottom: 25,
    flexDirection: "row",
  },
  savedModalOptionIconContainer: {
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
  },
  savedModalOptionTextContainer: {
    left: Platform.OS === "ios" ? 20 : 20,
    width: "65%",
    flexDirection: "column",
  },
  savedModalOptionHeaderText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  savedModalOptionInfoText: {
    marginTop: 2,
    opacity: 0.8,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
});

export default AddThoughtDescriptionScreen;
