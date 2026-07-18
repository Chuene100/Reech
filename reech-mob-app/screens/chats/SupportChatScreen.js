import React from "react";
import { Image, StyleSheet, View, Text, Alert, Pressable, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { FontAwesome } from "@expo/vector-icons";

//import customs
import { COLORS, images } from "../../constants";
import { CustomInput, CustomInputTextArea } from "../../components";
import { LinearGradient } from "expo-linear-gradient";
import NavHeader from "@/components/Headers/NavHeader";

const SupportChatScreen = () => {
  const navigation = useNavigation();

  const { control, handleSubmit } = useForm();

  //alert and redirect
  const onSendMessage = (message) => {
    Alert.alert(
      "😊 Hey, " + `${message.firstName}` + " " + `${message.lastName}` + "!",
      "\nWe are grateful for your letter.\nWe will get in touch with you as soon as an accessible person receives your mail. \n\nHave a great day! 🌻",
      [
        {
          text: "Send another mail",
          onPress: () => console.log("Sent another pressed"),
        },
        {
          text: "Go back",
          onPress: () =>
            navigation.reset({
              index: 0,
              routes: [{ name: "ManageProfileScreen" }],
            }),
          style: "cancel",
        },
      ]
    );
  };

  //render header
  function renderHeaderComponent() {
    return (
      <View style={styles.headerComponentContainer}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.content}>
        <Text style={styles.headingText}>Reech Support Chatroom</Text>
      </View>
    );
  }

  function renderFormSection() {
    return (
      <View style={styles.formContainer}>
        {/*top container*/}
        <View style={styles.formHeaderContainer}>
          <Image
            source={{ uri: images.chatting }}
            style={styles.formHeaderImage}
            resizeMode="contain"
          />
          <View style={styles.formTextContainer}>
            <Text style={styles.formHeaderText}>
              Looking for help or want to share your ideas?
            </Text>
            <Text style={styles.formSubHeaderText}>
              Our staff of technical experts is always available to assist you.
              Please submit your inquiry below, and they will get back to you as
              soon as possible.
            </Text>
          </View>
        </View>

        {/*form content container*/}
        <View style={styles.formContentContainer}>
          <CustomInput
            name="firstName"
            control={control}
            rules={{
              required: "First name is required",
              pattern: {
                value: /^[aA-zZ\s]+$/,
                message:
                  "Your entry cannot contain numbers or special characters",
              },
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters long",
              },
              maxLength: {
                value: 24,
                message: "Name must be max of 24 characters long",
              },
            }}
            placeholder="First name"
          />
          <CustomInput
            name="lastName"
            control={control}
            rules={{
              required: "Last name is required",
              pattern: {
                value: /^[aA-zZ\s]+$/,
                message:
                  "Your entry cannot contain numbers or special characters",
              },
              minLength: {
                value: 2,
                message: "Last name must be at least 2 characters long",
              },
              maxLength: {
                value: 24,
                message: "Last name must be max of 24 characters long",
              },
            }}
            placeholder="Last name"
          />
          <CustomInput
            name="subject"
            control={control}
            rules={{
              required: "Subject is required",
              pattern: {
                value: /^[aA-zZ\s]+$/,
                message:
                  "Your entry cannot contain numbers or special characters",
              },
              minLength: {
                value: 2,
                message: "Subject must be at least 2 characters long",
              },
              maxLength: {
                value: 50,
                message: "Subject must be max of 50 characters long",
              },
            }}
            placeholder="Subject"
          />
          <CustomInputTextArea
            name="message"
            control={control}
            rules={{
              required: "Message is required",
              minLength: {
                value: 2,
                message: "Message must be at least 2 characters long",
              },
            }}
            placeholder="Message"
          />

          <View style={styles.btnContainer}>
            <Pressable
              onPress={handleSubmit(onSendMessage)}
              style={styles.contactContainer}
            >
              <LinearGradient
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
                style={styles.contactGradientContainer}
              >
                <Text style={styles.contactTextItem}>
                  Contact us
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeaderComponent()}
      {renderHeaderSection()}
      {renderFormSection()}
    </View>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerComponentContainer: {
    marginTop: Platform.OS === "ios" ? 45 : 0,
  },

  //header text section
  content: {
    marginTop: 20,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headingText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },

  //form section
  formContainer: {
    flex: 1,
  },
  formHeaderContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: "5%",
  },
  formHeaderImage: {
    alignSelf: "center",
    width: 130,
    height: 130,
    maxHeight: 200,
    maxWidth: 200,
    borderRadius: 200,
    borderWidth: 3,
    borderColor: COLORS.white,
    backgroundColor: COLORS.purple,
  },
  formTextContainer: {
    marginTop: "5%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  formHeaderText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
    marginBottom: "3%",
    textAlign: "center"
  },
  formSubHeaderText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    marginBottom: "3%",
    textAlign: "center"
  },
  formContentContainer: {
    flex: 1,
    marginHorizontal: "8%",
  },
  btnContainer: {
    marginTop: "7.8%",
    marginBottom: "4%",
    marginHorizontal: "3%",
  },
  contactContainer: {
    marginHorizontal: 20,
    zIndex: 10,
  },
  contactGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 45,
    width: "100%",
  },
  contactTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
});

export default SupportChatScreen;
