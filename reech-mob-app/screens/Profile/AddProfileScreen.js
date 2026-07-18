import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

//import dependencies
import { COLORS, SIZES, images } from "../../constants";
import {
  CustomAccountToggler,
} from "../../components";
import NavHeader from "@/components/Headers/NavHeader";
import DropDown from "@/components/UI/DropDown";

const AddProfileScreen = ({ route }) => {
  const {
    control,
    handleSubmit,
  } = useForm();

  const navigation = useNavigation();
  const user = route.params.user;

  const [selectedCategory, setCategory] = React.useState({});

  const job_category_list = useSelector((state) => state.job_title.job_titles);

  const onCreateButtonPress = async (data) => {
    const fileName = profilePicture.split("/").pop();
    const newdata = {
      accVisibility: data.accVisibility === undefined ? false : data.accVisibility,
      jobCategoryId: data.jobCategoryId?._id,
      jobTitleId: data?.jobTitleId?._id,
      UserId: user?._id,
      photo: {
        name: "_profile-" + fileName,
        uri: profilePicture,
        type: "image/jpg",
      },
    };
    navigation.navigate("AddProfileInfoScreen", { data: newdata });
  };

  const onProfileBenefitPress = () => {
    navigation.navigate("ProfileBenefitsScreen");
  };

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
      return alert("Permission to access your gallery is required!");
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

  function renderHeaderSection() {
    return (
      <View style={styles.headerSectionContainer}>
        <NavHeader
          message="What would you like to do?"
        />
      </View>
    );
  }

  function renderNavigationSection() {
    return (
      <View style={styles.navigationContainer}>
        <Text style={styles.textHeadingItem}>Add profile</Text>
      </View>
    );
  }

  function renderImageSection() {
    return (
      <View style={styles.imageContainer}>
        {/*-----------I added this code Custom image picker---------------*/}
        <>
          <View style={styles.imgContainer}>
            <TouchableOpacity
              style={styles.touchPicture}
              onPress={() => pickImage()}
            >
              <Ionicons name="pencil-outline" size={22} color={COLORS.white} />
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
      <View style={styles.dropDownContainer}>
        <View style={styles.dropDownItem}>
          <DropDown
            name="jobCategoryId"
            data={job_category_list}
            control={control}
            placeholder="Category"
            rules={{ required: " Please select a job category" }}
            notifyChange={({ value }) => {
              setCategory(value);
            }}
            rowText={"jobCategory"}
          />
        </View>

        <View style={styles.dropDown}>
          <DropDown
            name="jobTitleId"
            data={selectedCategory.jobTitle}
            control={control}
            type="title"
            placeholder="Title"
            rules={{ required: " Please select a job title" }}
            
            notifyChange={({ value }) => { }}
            rowText={'jobTitle'}
          />
        </View>
      </View>
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
        <Pressable
          onPress={handleSubmit(onCreateButtonPress)}
          style={styles.createContainer}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
            style={styles.createGradientContainer}
          >
            <Text style={styles.createTextItems}>Create</Text>
          </LinearGradient>
        </Pressable>
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
    <View style={styles.container}>
      {renderHeaderSection()}
      {renderNavigationSection()}
      {renderImageSection()}
      {renderDropDown()}
      {renderToggleSection()}
      {renderCreateButton()}
      {renderBottomButton()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //header section
  headerSectionContainer: {
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  //navigation section
  navigationContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  textHeadingItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //image section
  imageContainer: {
    marginTop: Platform.OS === "ios" ? "30%" : "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  imgContainer: {
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
    width: Platform.OS == "android" ? 138 : 164,
    maxWidth: 160,
    maxHeight: 160,
  },
  profileImage: {
    marginTop: SIZES.padding * 2,
    borderRadius: 100,
  },

  //drop section
  dropDownContainer: {
    marginTop: Platform.OS === "ios" ? "20%" : "25%",
    marginHorizontal: 20,
  },
  dropDownItem: {
    marginVertical: Platform.OS === "ios" ? 20 : 15,
  },

  //toggle section
  toggleSection: {
    flexDirection: "row",
    marginBottom: 20,
    width: "100%",
    marginHorizontal: 30,
  },
  textSection: {
    marginTop: 20,
    width: Platform.OS === "ios" ? "74%" : "76%",
  },
  textStyle: {
    color: COLORS.darkGray,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  toggleSwitch: {
    top: Platform.OS === "ios" ? "3%" : "3%",
    left: Platform.OS === "ios" ? 25 : 6,
    width: "5%",
  },

  //create button
  createButton: {
    marginHorizontal: Platform.OS === "ios" ? 130 : 100,
    marginBottom: Platform.OS === "ios" ? 220 : 40,
  },
  createContainer: {
    marginTop: 30,
  },
  createGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 45,
    width: "100%",
  },
  createTextItems: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },

  //bottom button
  btnContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? -100 : 0,
  },
  btnText: {
    color: COLORS.lightBlue,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
});

export default AddProfileScreen;
