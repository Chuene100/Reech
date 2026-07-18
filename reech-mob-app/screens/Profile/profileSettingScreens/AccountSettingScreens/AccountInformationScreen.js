import React from "react";
import { Alert, Image, StyleSheet, ScrollView, View, Text, ImageBackground, Platform, TouchableOpacity, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";

//import customs
import { COLORS, images } from "../../../../constants";
import { CustomInput, CustomLocation } from "../../../../components";
import { useUpdateUserMutation, useDeleteUserMutation } from "../../../../redux/api/api-slice";
import { removeCredentials } from "../../../../redux/features/auth-slice";
import NavHeader from "@/components/Headers/NavHeader";
import DropDown from "@/components/UI/DropDown";
import { empStatus } from "@/assets/data/dropDownData";

const AccountInformationScreen = ({ route }) => {
  const navigation = useNavigation();

  const user = route.params.user;

  const { control, handleSubmit } = useForm();
  const dispatch = useDispatch();

  const image = useSelector((state) => state.profile_images.profileImages);

  const [updateUserFn] = useUpdateUserMutation();
  const [deleteUserFn] = useDeleteUserMutation();

  const showError = (res) =>
    Toast.show({
      type: "error",
      text1: "Error",
      text2: res.error.data?.error ?? "Something went wrong. Please try again",
    });

  const showToast = (message) =>
    Toast.show({
      type: "success",
      text1: "Success",
      text2: message,
    });

  const onUpdateDetailsPressed = (data) => {
    const userId = user?._id;
    const loc = data.location.split("|");
    delete data.location;

    const body = { ...data, address: loc[0], location: { type: "Point", coordinates: [loc[2], loc[1]] } };

    updateUserFn({ body, userId }).then((res) => {
      if (res.error) { showError(res); return; }
      showToast(res.data?.message);
    }).catch((err) => { console.log(err); });
  };

  //request verification
  const onVerificationRequestPress = () => {
    console.log("account verification requested pressed");
    Alert.alert(
      "✅ Request sent!",
      "\nHey " +
      `${user.firstName} ${user.lastName}` +
      "!" +
      "\n\n" +
      "Please note that we have received your account verification request and we will be in touch with you ASAP to give feedback on your request. \n\n Have a blessed day. 🌻",
      [
        {
          text: "Close",
          onPress: () => console.log("Close Pressed"),
          style: "cancel",
        },
      ]
    );
  };

  const DeactivateAccount = () => {
    const userId = user?._id;

    deleteUserFn({ userId }).then((res) => {
      if (res.error) { showError(res); return; }
      showToast(res.data?.message);

      Alert.alert(
        "😥 Goodbye, " + `${user?.firstName} ${user?.lastName}`,
        "\nWe really hate to see you leave 😥. But, we had a great time having you around. Please do come back at anytime. We are family! \n\n Have a blessed day. 🌻",
        [
          {
            text: "🥺 Cheers",
            onPress: () => {
              dispatch(removeCredentials());
            },
          },
        ]
      );
    }).catch((err) => { console.log(err); });
  };

  const onDeactivateAccountPress = () => {
    Alert.alert(
      "Are you serious?",
      "\n" + `${user?.firstName}` + "\n\n" + '"Let us talk about this..."',
      [
        {
          text: "✅ I am sure",
          onPress: () => {
            DeactivateAccount();
          },
        },
        {
          text: "🗣 How to improve your app",
          onPress: () => navigation.navigate("SupportChatScreen"),
        },
        {
          text: "🙅 Go back",
          onPress: () => console.log("Cancel process..."),
          style: "Cancel",
        },
      ]
    );
  };

  //header component
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
      <View style={styles.headerMainContent}>
        <Text style={styles.headersMainTextItem}>Account Information</Text>
      </View>
    );
  }

  function renderFormSection() {
    return (
      <View style={styles.formSectionContainer}>
        {/*top heading text*/}
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerMainTextItem}>Please Note:</Text>

          <Text style={styles.headerTextItem}>
            All this information will not be visible to the public.
            It will be used to provide relevant recommendations.
          </Text>
        </View>

        {/*update account details*/}
        <ScrollView
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
          style={styles.formSectionContent}
          
          nestedScrollEnabled={true}
        >

          {/*user image item*/}
          <View style={styles.usersAccountImageContainer}>
            <ImageBackground
              source={images.userFrame}
              style={styles.usersAccountImageContent}
            >
              <Image
                source={
                  user?.profileImage
                    ? { uri: image[user?.profileImage] ?? user?.profileImage }
                    : images.defaultRounded
                }
                resizeMode="cover"
                style={styles.usersAccountImageItem}
              />
            </ImageBackground>
          </View>

          {/*form header item*/}
          <View style={styles.formHeaderTextContainer}>
            <Text style={styles.formHeaderTextItem}>
              Update Account Details
            </Text>
          </View>

          {/*first name item*/}
          <CustomInput
            name="firstName"
            control={control}
            invalue={user?.firstName}
            rules={{
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

          {/*last name item*/}
          <CustomInput
            name="lastName"
            control={control}
            invalue={user?.lastName}
            rules={{
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
            placeholder="Last name"
          />

          {/*phone number item*/}
          <CustomInput
            name="phoneNumber"
            control={control}
            invalue={user.phoneNumber}
            keyboardType="number-pad"
            placeholder="Phone number"
            rules={{
              pattern: {
                value: /^[0-9\b]+$/,
                message:
                  "Your entry cannot contain strings or special characters",
              },
              maxLength: {
                value: 10,
                message: "Phone number must be at least 10 characters long",
              },
            }}
          />

          {/*employment status item*/}
          <DropDown
            name="empStatus"
            data={empStatus}
            control={control}
            invalue={user.empStatus}
            placeholder="Employment status"
            minimal={true}
          />

          {/*Location item*/}
          <View style={{ zIndex: 9 }}>
            <ScrollView
              horizontal
              style={{width: '100%'}}
              keyboardShouldPersistTaps='always'
            >
              <CustomLocation
                name="location"
                control={control}
                invalue={user?.address}
                placeholder="Street, State, Country"
              />
            </ScrollView>
          </View>

          {/*form buttons*/}
          <View style={styles.formActionButtonContainer}>
            {/*update button item*/}
            <TouchableOpacity
              onPress={handleSubmit(onUpdateDetailsPressed)}
              style={styles.formButtonContainer}
            >
              <LinearGradient
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
                style={styles.formButtonGradientContainer}
              >
                <Text style={styles.formButtonsTextItem}>Update</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/*cancel update button item*/}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.formCancelContainer}
            >
              <Text style={styles.formCancelTextItem}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.screenLiner} />
          {renderRequestInformationSection()}
          <View style={styles.screenLiner} />
          {renderDeactivateAccountSection()}
        </ScrollView>
      </View>
    );
  }

  //request verification section
  function renderRequestInformationSection() {
    return (
      <View style={styles.requestInfoContainer}>
        {/*request header section*/}
        <View style={styles.requestHeaderContainer}>
          <Text style={styles.requestHeaderTextItem}>
            Request account verification
          </Text>
        </View>

        {/*request description section*/}
        <View style={styles.requestDescriptionContainer}>
          <Text style={styles.requestDescriptionTextItem}>
            If your account has not yet been verified, you can ask for a
            verification check for your account to be verified.
          </Text>

          <Text style={styles.requestDescriptionTextItem}>
            Please note that you can only do so if you have established
            a business account with Reech.
          </Text>
        </View>

        {/*request button section*/}
        <TouchableOpacity
          onPress={onVerificationRequestPress}
          style={styles.requestButtonTextContainer}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
            style={styles.formActionButtonContent}
          >
            <Text style={styles.requestButtonTextItem}>Verify account</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    )
  }

  //deactivate account section
  function renderDeactivateAccountSection() {
    return (
      <View style={styles.requestInfoContainer}>
        {/*request header section*/}
        <View style={styles.requestHeaderContainer}>
          <Text style={styles.requestHeaderTextItem}>
            Deactivate my account
          </Text>
        </View>

        {/*request description section*/}
        <View style={styles.requestDescriptionContainer}>
          <Text style={styles.requestDescriptionBoldTextItem}>
            Hey {user.firstName} {user.lastName}!
          </Text>

          <Text style={styles.requestDescriptionTextItem}>
            {`Please be aware that after turning off your account, you won't be able to access it, you won't be able to access everything that it had.`}
          </Text>

          <Text style={styles.requestDescriptionTextItem}>
            {`You won't be able to get anything that has to do with this account. Are you confident doing this?`}
          </Text>
        </View>

        {/*request button section*/}
        <TouchableOpacity
          onPress={onDeactivateAccountPress}
          style={styles.requestButtonTextContainer}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[COLORS.red, COLORS.transparent, COLORS.red]}
            style={styles.formActionButtonContent}
          >
            <Text style={styles.requestButtonTextItem}>Deactivate</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    )
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
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  //header text
  headerMainContent: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  headersMainTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //header text section
  headerTextContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerMainTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
    textAlign: "center",
  },
  headerTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    textAlign: "center",
  },

  //top image
  usersAccountImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  usersAccountImageContent: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  usersAccountImageItem: {
    width: 90,
    height: 90,
    resizeMode: "cover",
    borderRadius: 6,
  },
  formHeaderTextContainer: {
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  formHeaderTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },

  //form section
  formSectionContainer: {
    flex: 1,
  },
  formSectionContent: {
    flexDirection: "column",
    marginHorizontal: "6%",
    marginBottom: Platform.OS === "ios" ? 30 : 0,
  },
  screenLiner: {
    borderBottomColor: COLORS.white,
    borderBottomWidth: StyleSheet.hairlineWidth * 3,
    marginBottom: "5%",
  },
  formActionButtonContainer: {
    width: "100%",
    marginVertical: 20,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  formButtonContainer: {
    width: "45%",
  },
  formButtonGradientContainer: {
    height: 45,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  formButtonsTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  formCancelContainer: {
    width: "45%",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  formCancelTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //request info section
  requestInfoContainer: {
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginBottom: 20,
  },
  requestHeaderContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  requestHeaderTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  requestDescriptionContainer: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  requestDescriptionTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    textAlign: "center",
    marginBottom: 15,
  },
  requestDescriptionBoldTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    textAlign: "center",
    marginBottom: 15,
  },
  requestButtonTextContainer: {
    width: "100%",
  },
  formActionButtonContent: {
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  requestButtonTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
});

export default AccountInformationScreen;
