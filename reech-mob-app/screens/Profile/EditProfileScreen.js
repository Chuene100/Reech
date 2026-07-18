import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform, ActivityIndicator, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

//import dependencies
import { COLORS } from "../../constants";
import { CustomButton, CustomImagePickerProfile, CustomCoverPicture, BlurbComponent } from "../../components";
import NavHeader from "@/components/Headers/NavHeader";
import { useUpdateUserMutation } from "../../redux/api/api-slice";


const EditProfileScreen = ({ route }) => {
  const { control, handleSubmit } = useForm();

  const navigation = useNavigation();
  const onLocationPress = () => {
    console.log("location pressed...");
  };

  const [updateUserFn, { isLoading }] = useUpdateUserMutation();
  const user = useSelector((state) => state.user.current_user);

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

  const onSavePressed = (data) => {
    const body = { blurb: data.accountBlurb };
    const userId = user?._id;

    updateUserFn({ body, userId })
      .then((res) => {
        if (res.error) {
          showError(res);
          return;
        }
        showToast(res.data?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  function renderScreenContentItems() {
    return (
      <View style={styles.container}>
        {/*image seCtion*/}
        <View style={styles.topSectionImage}>
          <CustomCoverPicture name="coverPicture" control={control} user={user} />

          <View style={styles.profilePic}>
            <CustomImagePickerProfile name="profilePic" control={control} user={user} />
          </View>
        </View>

        <View style={styles.spacer}></View>

        {/*location section*/}
        <TouchableOpacity onPress={onLocationPress}>
          <View style={styles.locationContainer}>
            <MaterialCommunityIcons name="map-marker" size={28} color={COLORS.purple} style={styles.mapIcon} />
            <Text style={[styles.screenText, { fontWeight: "600" }]}>
              {user?.address ? user?.address : "Location"}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.horizontalLine} />

        {/*blurb textarea*/}
        <View style={styles.blurbContainer}>
          <BlurbComponent name="accountBlurb" control={control} invalue={user.blurb}
            rules={{
              required: "Please ensure you provide a blurb for your account.",
              pattern: { value: /[a-zA-Z]/, message: "Your entry may not contain an email or mobile number" },
              maxLength: { value: 2000, message: "Blurb must only be 2000 characters long" },
            }}
            placeholder="Blurb with information you would like to share (Max 2000 characters)"
          />
        </View>

        {/*blurb save*/}
        <View style={styles.pencilIcon}>
          {isLoading ? (
            <ActivityIndicator size={"small"} color={COLORS.purple} />
          ) : (
            <MaterialCommunityIcons name="content-save-all" size={24} color={COLORS.white} onPress={handleSubmit(onSavePressed)} />
          )}
        </View>

        <View style={styles.horizontalLine} />

        {/*button navigation*/}
        <View style={styles.buttons}>
          <CustomButton text="Opportunity cards I've posted" onPress={() => navigation.navigate("MyOpportunityCardScreen")} />
          <CustomButton text="Active profiles" onPress={() => navigation.navigate("ProfileScreen")} />
          <CustomButton text="I vouch for" onPress={() => navigation.navigate("IVouchForScreen")} />
        </View>
      </View>
    );
  }

  function renderScreenContentList() {
    return (
      <>
        {renderHeaderSection()}
        {renderScreenContentItems()}
      </>
    );
  }

  return <View style={styles.container}>{renderScreenContentList()}</View>;
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerContainer: {
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },
  topSectionImage: {
    margin: 15,
    marginTop: 30,
    height: 180,
    borderRadius: 25,
  },
  profilePic: {
    justifyContent: "center",
    alignContent: "center",
  },
  screenText: {
    color: COLORS.white,
    marginTop: 3,
    fontSize: 18,
  },
  spacer: {
    marginVertical: 25,
  },
  mapIcon: {
    marginRight: 18,
    marginLeft: 40,
  },
  horizontalLine: {
    marginTop: 10,
    marginHorizontal: 36,
    borderBottomColor: COLORS.gray,
    borderBottomWidth: StyleSheet.hairlineWidth * 1,
  },
  locationContainer: {
    marginTop: "5%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  blurbContainer: {
    marginHorizontal: "8%",
  },
  pencilIcon: {
    right: 25,
    alignSelf: "flex-end",
  },
  buttons: {
    marginHorizontal: 20,
  },
});

export default EditProfileScreen;
