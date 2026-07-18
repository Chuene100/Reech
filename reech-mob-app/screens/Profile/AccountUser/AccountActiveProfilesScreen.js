import React, { useEffect } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList, Pressable, Platform, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

//import dependencies
import { COLORS, SIZES, images } from "../../../constants";
import { EmptyFlatlistComponent } from "../../../components";
import { setUsersImage } from "../../../redux/features/all-user-image-slice";
import NavHeader from "@/components/Headers/NavHeader";

const AccountActiveProfilesScreen = ({ route }) => {
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const { myProfiles, user } = route.params;

  const image = useSelector((state) => state.users_images.usersImages);

  useEffect(() => {
    if (myProfiles)
      for (var dt in myProfiles) { !image[myProfiles[dt].profileImage] && _loadImage(myProfiles[dt].profileImage) }
  }, [myProfiles]);

  useEffect(() => {
    if (user) {
      !image[user?.profileImage] && _loadImage(user?.profileImage);
      !image[user?.coverImage] && _loadImage(user?.coverImage);
    }
  }, [user]);

  const _loadImage = async (url) => {
    try {
      if (url) {
        const response = await fetch(url);

        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => { dispatch(setUsersImage({ url, data: reader.result })) };
      }
    }
    catch (error) { console.error(`Error loading image: ${error}`) }
  };

  //header component
  function renderHeaderComponent() {
    return (
      <View style={styles.headerTop}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  //header section
  function renderHeader() {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={styles.headingTextItem}>Active Profiles</Text>
        </View>
      </View>
    );
  }

  //render profile picture edit
  function renderProfilePictureEdit() {
    return (
      <View style={styles.profilePictureEdit}>
        <ImageBackground
          source={images.userFrame}
          style={styles.mainProfileImageContainer}
        >
          <Image
            source={
              user?.profileImage
                ? { uri: image[user?.profileImage] ?? user?.profileImage }
                : images.defaultRounded
            }
            style={styles.mainProfileImageItem}
          />
        </ImageBackground>

        <Text style={styles.userName}>
          {user?.firstName} {user?.lastName}
        </Text>
      </View>
    );
  }

  //render profile selection
  function renderProfileSection() {
    return (
      <View style={styles.profileSelectSection}>
        <FlatList
          data={myProfiles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={styles.proTouch}
                onPress={() =>
                  navigation.navigate("BubbleMateProfileViewScreen", {
                    profileId: item._id,
                    userId: user?._id,
                  })
                }
              >
                <View style={styles.profilePic}>
                  <Image
                    source={
                      item.profileImage
                        ? { uri: image[item.profileImage] ?? item.profileImage }
                        : images.defaultRounded
                    }
                    resizeMode="cover"
                    style={styles.picItem}
                  />
                </View>

                <View style={styles.jobText}>
                  <Text style={styles.jobTitle}>
                    {item?.jobTitleId?.jobTitle}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginTop: SIZES.padding,
          }}
          contentContainerStyle={{ paddingHorizontal: SIZES.padding * 2 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={<EmptyFlatlistComponent />}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeaderComponent()}
      {renderHeader()}
      {renderProfilePictureEdit()}
      {renderProfileSection()}
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
  headerTop: {
    zIndex: 99,
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },
  headerContainer: {
    marginTop: 20,
    flexDirection: "column",
  },
  headerContent: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  headingTextItem: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "PoppinsLight",
  },

  logo2: {
    top: 3,
    left: 3,
    width: Platform.OS == "android" ? 144 : 164,
    maxWidth: 112,
    maxHeight: 112,
  },
  image: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  profilePictureEdit: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    borderColor: COLORS.black,
    borderWidth: 3,
    borderRadius: 8,
  },
  mainProfileImageContainer: {
    top: 15,
    width: 100,
    height: 100,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  mainProfileImageItem: {
    width: 92,
    height: 92,
    resizeMode: "cover",
    borderRadius: 6,
  },
  userName: {
    marginTop: 35,
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "PoppinsBold",
  },
  profileSelectSection: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  proTouch: {
    marginTop: 20,
    width: "50%",
  },
  profilePic: {
    height: 100,
    borderRadius: 200,
  },
  picItem: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },
  jobText: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  jobTitle: {
    marginTop: 10,
    fontFamily: "PoppinsLight",
    fontSize: 14,
    color: COLORS.white,
    textAlign: "center",
  },
});

export default AccountActiveProfilesScreen;
