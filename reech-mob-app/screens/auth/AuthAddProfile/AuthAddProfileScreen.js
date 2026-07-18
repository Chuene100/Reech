import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

//import dependencies
import { COLORS, SIZES, FONTS, images } from "../../../constants";
import {
  CustomAccountToggler,
  CustomButton,
  HeaderImage,
} from "../../../components";
import { useListJobCategoryQuery } from "../../../redux/api/job-category";
import DropDown from "@/components/UI/DropDown";

const AuthAddProfileScreen = ({ route }) => {
  const {
    control,
    handleSubmit,
    // formState: { errors },
  } = useForm();

  const navigation = useNavigation();
  const data = route.params.user;
  const user = data.user;

  const [selectedCategory, setCategory] = React.useState({});
  const { data: job_category_list } = useListJobCategoryQuery();

  const onCreateButtonPress = async (data) => {
    const fileName = profilePicture.split("/").pop();
    const newdata = {
      accVisibility:
        data.accVisibility === undefined ? false : data.accVisibility,
      jobCategoryId: data.jobCategoryId?._id,
      jobTitleId: data?.jobTitleId?._id,
      userId: user?._id,
      photo: {
        name: "_profile-" + fileName,
        uri: profilePicture,
        type: "image/jpg",
      },
    };
    navigation.navigate("AuthAddProfileInfoScreen", { data: newdata });
  };

  const onProfileBenefitPress = () => {
    navigation.navigate("ProfileBenefitsScreen");
  };

  function renderNavigationSection() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={{
            width: 45,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="chevron-back"
            size={30}
            color={COLORS.white}
            onPress={() => navigation.goBack()}
          />
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 40,
          }}
        >
          <Text style={{ color: COLORS.white, ...FONTS.body3 }}>
            Add profile
          </Text>
        </View>
      </View>
    );
  }

  //////------------I added this code from Custom Image Picker--------------///
  const { height } = useWindowDimensions();

  const [hasGalleryPermission, setHasGalleryPermission] = useState("false");
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    async () => {
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    };
  }, []);

  const pickImage = async () => {
    let chosenImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (hasGalleryPermission === false) {
      return alert(" Permission to access your gallery is required!");
    }

    if (chosenImage.canceled) {
      return alert(
        "🤗 You can always change your profile picture at a later stage. You can continue to use this profile picture."
      );
    }

    if (!chosenImage.canceled) {
      setProfilePicture(chosenImage.uri);
    }
  };

  function renderImageSection() {
    return (
      <View style={styles.imageContainer}>
        {/* <CustomImagePicker name="profilePic" control={control} /> */}

        {/*-----------I aaded this code Custom image picker---------------*/}
        <>
          <View
            style={[
              styles.imgcontainer,
              { borderColor: COLORS.gray },
              // { borderColor: error ? COLORS.purple : COLORS.gray },
            ]}
          >
            <TouchableOpacity
              style={styles.touchPicture}
              onPress={() => pickImage()}
            >
              <Ionicons name="pencil-outline" size={25} color={COLORS.white} />
            </TouchableOpacity>

            {profilePicture ? (
              <Image
                source={{
                  uri: profilePicture,
                }}
                style={[
                  styles.logo,
                  styles.profileImage,
                  { height: height * 0.19 },
                ]}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={images.defaultRounded}
                style={[
                  styles.logo,
                  styles.profileImage,
                  { height: height * 0.19 },
                ]}
                resizeMode="cover"
              />
            )}
          </View>
        </>
        {/*--------------------The code ends here---------------------------*/}
      </View>
    );
  }

  function renderDropDown() {
    return (
      <>
        <View style={styles.dropDown}>
          <DropDown
            name="jobCategoryId"
            data={job_category_list?.data}
            control={control}
            placeholder="Category"
            rules={{ required: " Please select a job category!" }}
            notifyChange={({ value }) => {
              setCategory(value);
            }}
          />
        </View>

        <View style={styles.dropDown}>
          <DropDown
            name="jobTitleId"
            data={selectedCategory.jobTitle}
            control={control}
            type="title"
            placeholder="Title"
            rules={{ required: " Please select a job title!" }}
            // notifyChange={({ value }) => {}}
          />
        </View>
      </>
    );
  }

  function renderToggleSection() {
    return (
      <View style={styles.toggleSection}>
        <View style={styles.textSection}>
          <Text style={styles.textStyle}>
            Make private (profile is only visible to bubble mates and people
            viewing my application)
          </Text>
        </View>
        <View style={styles.toggleSwitch}>
          <CustomAccountToggler name="accVisibility" control={control} />
        </View>
      </View>
    );
  }

  function renderCreateButton() {
    return (
      <View style={styles.createButton}>
        <CustomButton
          onPress={handleSubmit(onCreateButtonPress)}
          text="Create"
        />
      </View>
    );
  }

  function renderBottomButton() {
    return (
      <View style={styles.btnContainer}>
        <Text style={styles.btnText} onPress={onProfileBenefitPress}>
          Profile benefits & Pricing
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <HeaderImage />
      {renderNavigationSection()}
      {renderImageSection()}
      {renderDropDown()}
      {renderToggleSection()}
      {renderCreateButton()}
      {renderBottomButton()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  ////I aaded this code from Custom Image Picker--------
  imgcontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  touchPicture: {
    zIndex: 10,
    marginBottom: -50,
    marginLeft: 100,
  },
  logo: {
    width: Platform.OS == "android" ? 146 : 164,
    maxWidth: 160,
    maxHeight: 160,
  },
  profileImage: {
    marginTop: SIZES.padding * 2,
    borderRadius: 100,
  },
  ////--------- The code ends here------------

  imageContainer: {
    marginTop: Platform.OS === "ios" ? 50 : 20,
    justifyContent: "center",
    alignItems: "center",
  },
  dropDown: {
    margin: SIZES.padding * 2,
    marginHorizontal: "10%",
    marginBottom: SIZES.padding / 2,
  },
  toggleSection: {
    flexDirection: "row",
    marginBottom: 20,
    width: "100%",
  },
  textSection: {
    marginTop: SIZES.padding,
    marginHorizontal: 27,
    left: 15,
    width: "60%",
  },
  textStyle: {
    color: COLORS.darkGray,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  toggleSwitch: {
    width: "25%",
  },
  createButton: {
    marginHorizontal: 130,
    marginBottom: Platform.OS === "ios" ? 220 : 40,
  },
  btnContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 30 : 65,
  },
  btnText: { color: COLORS.lightBlue, fontSize: 16 },
});

export default AuthAddProfileScreen;
