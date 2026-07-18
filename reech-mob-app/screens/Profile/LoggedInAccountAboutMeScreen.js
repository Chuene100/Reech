import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Animated,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather, FontAwesome5, Fontisto, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

//custom
import { setUsersImage } from "../../redux/features/all-user-image-slice";
import { COLORS, images } from "../../constants";
import { BlurbComponent, CustomCoverPicture, CustomImagePickerProfile, EmptyFlatlistComponent, LoadingComponent } from "../../components";
import NavHeader from "@/components/Headers/NavHeader";
import { useReadUserQuery, useListMyProfilesQuery, useUpdateUserMutation } from "../../redux/api/api-slice";

const LoggedInAccountAboutMeScreen = ({ route }) => {
  const { control, handleSubmit } = useForm();

  const navigation = useNavigation();

  const dispatch = useDispatch();

  const { userId } = route.params;

  const image = useSelector((state) => state.users_images.usersImages);

  const {
    data: user,
    error: fetchError,
    isLoading,
  } = useReadUserQuery(userId ?? null);

  const {
    data: myProfiles,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useListMyProfilesQuery(userId ?? null);

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
        reader.onloadend = () => {
          dispatch(setUsersImage({ url, data: reader.result }));
        };
      }
    } catch (error) {
      console.error(`Error loading image: ${error}`);
    }
  };

  const [updateUserFn, { isLoadingUpdate }] = useUpdateUserMutation();

  const showError = (res) =>
    Toast.show({
      type: "error",
      text1: "Error",
      text2:
        res.error.data?.message ?? "Something went wrong. Please try again",
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

  //my links panel pop-up
  const [myLinksSidePanelMenuCollection] = useState(new Animated.Value(0));

  const [popSideMenuSection, setPopSideMenuSection] = useState(false);

  const popInSideMenuItems = () => {
    setPopSideMenuSection(true);

    Animated.timing(myLinksSidePanelMenuCollection, {
      toValue: 100,
      duration: 1000,
      useNativeDriver: false,
    });
  };

  const popOutSideMenuItems = () => {
    setPopSideMenuSection(false);

    Animated.timing(myLinksSidePanelMenuCollection, {
      toValue: 100,
      duration: 1000,
      useNativeDriver: false,
    });
  };

  //screen loading component
  const loadingComponent = () => (
    <View style={styles.loadingComponent}>
      <LoadingComponent />
    </View>
  );

  //render header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  //render image and text section
  function renderScreenTopImageTextSection() {
    return (
      <View
        style={[
          styles.topImageTextContainer,
          { bottom: popSideMenuSection ? 190 : 90 },
        ]}
      >
        {/*cover image*/}
        <View style={styles.coverImageContainer}>
          <CustomCoverPicture
            name="coverPicture"
            control={control}
            user={user}
          />
        </View>

        {/*user name and profile pic*/}
        <View styles={styles.textAndPicContainer}>
          {/*user profile picture*/}
          <View style={styles.userProfileContainer}>
            <CustomImagePickerProfile
              name="profilePic"
              control={control}
              user={user}
            />
          </View>
        </View>

        {/*username section*/}
        <View style={styles.userTextSectionContainer}>
          <Text style={styles.usernameTextItem}>
            <Text style={styles.aboutUserTextItem}>...about </Text>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.userPronouns}>They/Them</Text>
        </View>
      </View>
    );
  }

  //render screen top links section
  function renderScreenLinkSection() {
    return (
      <View
        style={[
          styles.linkContainer,
          { marginTop: popSideMenuSection ? -100 : 0 },
        ]}
      >
        {/*link section*/}
        <TouchableOpacity
          onPress={() => {
            popSideMenuSection === false
              ? popInSideMenuItems()
              : popOutSideMenuItems();
          }}
          style={styles.linkItemContainer}
        >
          <Entypo name="share" size={20} color={COLORS.white} />
        </TouchableOpacity>

        {/*beyond work section*/}
        <TouchableOpacity
          onPress={() => [
            navigation.navigate("BeyondWorkScreen", {
              userId: user?._id,
            }),
            popOutSideMenuItems(),
          ]}
          style={[styles.navItemContainer, { width: "30%", left: 4 }]}
        >
          <Text style={styles.navTextItem}>Beyond work</Text>
        </TouchableOpacity>

        {/*community engagement section*/}
        <TouchableOpacity
          onPress={() => [
            navigation.navigate("MyCommunityEngageScreen", {
              userId: user?._id,
            }),
            popOutSideMenuItems(),
          ]}
          style={[styles.navItemContainer, { width: "50%", left: 6 }]}
        >
          <Text style={styles.navTextItem}>My community engagements</Text>
        </TouchableOpacity>
      </View>
    );
  }

  //my links pop-up section
  function renderMyLinksSidePanelSection() {
    return popSideMenuSection ? (
      <Animated.View style={styles.myLinksContentContainer}>
        {/*top my links section*/}
        <Pressable
          onPress={() => popOutSideMenuItems()}
          style={styles.myLinksTopSectionContainer}
        >
          <Entypo name="share" size={20} color={COLORS.white} />
          <Text style={styles.myLinksTopTextHeadingItem}>My links</Text>
        </Pressable>

        {/*bottom my links items*/}
        <View style={styles.myLinksBottomSectionContainer}>
          <View style={styles.myLinksBottomContentContainer}>
            {/*instagram section item*/}
            <Pressable
              onPress={() => [
                console.log("instagram pressed"),
                popOutSideMenuItems(),
              ]}
              style={styles.myLinksBottomItemContainer}
            >
              <Image source={images.In} style={styles.myLinkImageItem} />
              <Text style={styles.myLinksTopTextItem}>Instagram</Text>
            </Pressable>

            {/*youtube section item*/}
            <Pressable
              onPress={() => [
                console.log("youtube pressed"),
                popOutSideMenuItems(),
              ]}
              style={styles.myLinksBottomItemContainer}
            >
              <Image source={images.youtube} style={styles.myLinkImageItem} />
              <Text style={styles.myLinksTopTextItem}>YouTube</Text>
            </Pressable>

            {/*facebook section item*/}
            <Pressable
              onPress={() => [
                console.log("facebook pressed"),
                popOutSideMenuItems(),
              ]}
              style={styles.myLinksBottomItemContainer}
            >
              <Image source={images.fb} style={styles.myLinkImageItem} />
              <Text style={styles.myLinksTopTextItem}>Facebook</Text>
            </Pressable>

            {/*tiktok section item*/}
            <Pressable
              onPress={() => [
                console.log("tiktok pressed"),
                popOutSideMenuItems(),
              ]}
              style={styles.myLinksBottomItemContainer}
            >
              <Image source={images.tiktok} style={styles.myLinkImageItem} />
              <Text style={styles.myLinksTopTextItem}>TikTok</Text>
            </Pressable>

            {/*linkedIn section item*/}
            <Pressable
              onPress={() => [
                console.log("linkedin pressed"),
                popOutSideMenuItems(),
              ]}
              style={styles.myLinksBottomItemContainer}
            >
              <Image source={images.linkedin} style={styles.myLinkImageItem} />
              <Text style={styles.myLinksTopTextItem}>LinkedIn</Text>
            </Pressable>

            {/*pdf section item*/}
            <Pressable
              onPress={() => [
                navigation.navigate("MyPdfLinkScreen", {
                  userId: user?._id,
                }),
                popOutSideMenuItems(),
              ]}
              style={styles.myLinksBottomItemContainer}
            >
              <Image source={images.pdf} style={styles.myLinkImageItem} />
              <Text style={styles.myLinksTopTextItem}>PDFs</Text>
            </Pressable>

            {/*web section item*/}
            <Pressable
              onPress={() => [
                navigation.navigate("MyWebLinkScreen", {
                  userId: user?._id,
                }),
                popOutSideMenuItems(),
              ]}
              style={styles.myLinksBottomItemContainer}
            >
              <Image source={images.web} style={styles.myLinkImageItem} />
              <Text style={styles.myLinksTopTextItem}>Web</Text>
            </Pressable>

            {/*other links section item*/}
            <Pressable
              onPress={() => [
                navigation.navigate("MyOtherLinkScreen", {
                  userId: user?._id,
                }),
                popOutSideMenuItems(),
              ]}
              style={styles.myLinksBottomItemContainer}
            >
              <Image source={images.link} style={styles.myLinkImageItem} />
              <Text style={styles.myLinksTopTextItem}>Other links</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    ) : null;
  }

  //scrolling section
  function renderScrollingSection() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollingSectionContainer}
      >
        {/*my life top section*/}
        <View style={styles.myLifeTopScrollSection}>
          {/*subheading section*/}
          <View style={styles.subHeadingTextActionContainer}>
            <Text style={styles.headingTextItem}>My Life and Career</Text>
            <View style={styles.saveBlurbIcon}>
              {isLoadingUpdate ? (
                <ActivityIndicator size={"small"} color={COLORS.purple} />
              ) : (
                <MaterialCommunityIcons
                  name="content-save-all"
                  size={20}
                  color={COLORS.white}
                  onPress={handleSubmit(onSavePressed)}
                />
              )}
            </View>
          </View>

          {/*blurb editing section*/}
          <View style={styles.blurbEditingContainer}>
            <BlurbComponent
              name="accountBlurb"
              control={control}
              invalue={user.blurb}
              rules={{
                required: "Please ensure you provide a blurb for your account.",
                pattern: {
                  // value: /[a-zA-Z]/,
                  value: /^(?!https:\/\/|http:\/\/|www\.)(.*\.com)$|^[^@\s]+@[^@\s]+\.[^@\s]+$|^\D*$/,
                  message:
                    "Your entry may not contain an email address, website or mobile number",
                },
                maxLength: {
                  value: 1000,
                  message: "Blurb must only be 1000 characters long",
                },
              }}
              placeholder="Blurb with information you would like to share (Max 1000 characters)"
            />
          </View>
        </View>
        <View style={styles.dividerItem} />

        {/*personality section*/}
        <View style={styles.myLifeTopScrollSection}>
          {/*subheading section*/}
          <View style={styles.subHeadingTextActionContainer}>
            <Text style={styles.headingTextItem}>Personality</Text>
            <Feather
              onPress={() => console.log("personality edit option clicked")}
              name="edit"
              size={20}
              color={COLORS.white}
            />
          </View>

          {/*personality items collection*/}
          <View style={styles.personalityItemsContainer}>
            {/*social item*/}
            <TouchableOpacity
              onPress={() => [
                navigation.navigate("PersonalityAccountScreen"),
                popOutSideMenuItems(),
              ]}
              style={styles.personalityItemContent}
            >
              <View>
                <Image
                  source={{ uri: images.s0 }}
                  style={styles.personalityImageItem}
                />
              </View>
              <View style={styles.personalityCategoryItemContainer}>
                <Text
                  style={[
                    styles.personalityCategoryItem,
                    { backgroundColor: COLORS.pink },
                  ]}
                >
                  Social
                </Text>
              </View>
            </TouchableOpacity>

            {/*outdoorsy item*/}
            <TouchableOpacity
              onPress={() => [
                navigation.navigate("OutdoorsyAccountScreen"),
                popOutSideMenuItems(),
              ]}
              style={[
                styles.personalityItemContainer,
                { borderRadius: 8, borderWidth: 2, borderColor: COLORS.green },
              ]}
            >
              <Image
                source={{ uri: images.s4 }}
                style={styles.personalityImageItem}
              />
              <View style={styles.personalityCategoryItemContainer}>
                <Text
                  style={[
                    styles.personalityCategoryItem,
                    { backgroundColor: COLORS.green },
                  ]}
                >
                  Outdoorsy
                </Text>
              </View>
            </TouchableOpacity>

            {/*expressive item*/}
            <TouchableOpacity
              onPress={() => [
                navigation.navigate("ExpressiveAccountScreen"),
                popOutSideMenuItems(),
              ]}
              style={[
                styles.personalityItemContainer,
                { borderRadius: 8, borderWidth: 2, borderColor: COLORS.red },
              ]}
            >
              <Image
                source={{ uri: images.s3 }}
                style={styles.personalityImageItem}
              />
              <View style={styles.personalityCategoryItemContainer}>
                <Text
                  style={[
                    styles.personalityCategoryItem,
                    { backgroundColor: COLORS.red },
                  ]}
                >
                  Expressive
                </Text>
              </View>
            </TouchableOpacity>

            {/*energetic item*/}
            <TouchableOpacity
              onPress={() => [
                navigation.navigate("EnergeticAccountScreen"),
                popOutSideMenuItems(),
              ]}
              style={[
                styles.personalityItemContainer,
                { borderRadius: 8, borderWidth: 2, borderColor: COLORS.yellow },
              ]}
            >
              <Image
                source={{ uri: images.s1 }}
                style={styles.personalityImageItem}
              />
              <View style={styles.personalityCategoryItemContainer}>
                <Text
                  style={[
                    styles.personalityCategoryItem,
                    { backgroundColor: COLORS.yellow },
                  ]}
                >
                  Energetic
                </Text>
              </View>
            </TouchableOpacity>

            {/*reflective item*/}
            <TouchableOpacity
              onPress={() => [
                navigation.navigate("ReflectiveAccountScreen"),
                popOutSideMenuItems(),
              ]}
              style={[
                styles.personalityItemContainer,
                { borderRadius: 8, borderWidth: 2, borderColor: COLORS.blue },
              ]}
            >
              <Image
                source={{ uri: images.s2 }}
                style={styles.personalityImageItem}
              />
              <View style={styles.personalityCategoryItemContainer}>
                <Text
                  style={[
                    styles.personalityCategoryItem,
                    { backgroundColor: COLORS.blue },
                  ]}
                >
                  Reflective
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.dividerItem} />

        {/*work style section*/}
        <View style={styles.myLifeTopScrollSection}>
          {/*subheading section*/}
          <View style={styles.subHeadingTextActionContainer}>
            <Text style={styles.headingTextItem}>Work style</Text>
            <Feather
              onPress={() => console.log("work style edit option clicked")}
              name="edit"
              size={20}
              color={COLORS.white}
            />
          </View>

          {/*work style items*/}
          <View style={styles.workStyleItemContainer}>
            {/*idea oriented section*/}
            <TouchableOpacity
              onPress={() => [
                navigation.navigate("WorkStyleIdeaScreen"),
                popOutSideMenuItems(),
              ]}
              style={[
                styles.navItemContainer,
                {
                  flexDirection: "row",
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                },
              ]}
            >
              <FontAwesome5 name="users" size={20} color={COLORS.orange} />
              <Text style={[styles.navTextItem, { marginLeft: 10 }]}>
                Idea oriented
              </Text>
            </TouchableOpacity>

            {/*Hybrid section*/}
            <TouchableOpacity
              onPress={() => [
                navigation.navigate("WorkStyleHybridScreen"),
                popOutSideMenuItems(),
              ]}
              style={[
                styles.navItemContainer,
                {
                  flexDirection: "row",
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                },
              ]}
            >
              <FontAwesome5 name="database" size={20} color={COLORS.pink} />
              <Text style={[styles.navTextItem, { marginLeft: 10 }]}>
                Hybrid
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.dividerItem} />

        {/*favourite things section*/}
        <View style={styles.myLifeTopScrollSection}>
          {/*subheading section*/}
          <View style={styles.subHeadingTextActionContainer}>
            <Text style={styles.headingTextItem}>Favourite things</Text>
            <Feather
              onPress={() =>
                console.log("favourite things edit option clicked")
              }
              name="edit"
              size={20}
              color={COLORS.white}
            />
          </View>

          {/*things i love section*/}
          <View style={styles.thingsILoveContainer}>
            <Text style={styles.thingsILoveHeadingItem}>
              Things I love to eat:
            </Text>

            {/*food list items*/}
            <View style={styles.countryContainer}>
              <TouchableOpacity
                onPress={() => [
                  console.log("on sushi pressed"),
                  popOutSideMenuItems(),
                ]}
                style={styles.navItemContainer}
              >
                <Text
                  style={[
                    styles.navTextItem,
                    { color: COLORS.orange, marginHorizontal: 18 },
                  ]}
                >
                  Sushi
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => [
                  console.log("on Tacos pressed"),
                  popOutSideMenuItems(),
                ]}
                style={styles.navItemContainer}
              >
                <Text
                  style={[
                    styles.navTextItem,
                    { color: COLORS.pink, marginHorizontal: 18 },
                  ]}
                >
                  Tacos
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => [
                  console.log("on street food pressed"),
                  popOutSideMenuItems(),
                ]}
                style={styles.navItemContainer}
              >
                <Text
                  style={[
                    styles.navTextItem,
                    { color: COLORS.lightBlue, marginHorizontal: 18 },
                  ]}
                >
                  Street food
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/*music section*/}
          <View style={styles.thingsILoveContainer}>
            <Text style={styles.thingsILoveHeadingItem}>Music:</Text>

            {/*music list items*/}
            <View style={styles.countryContainer}>
              <TouchableOpacity
                onPress={() => [
                  console.log("on elvis pressed"),
                  popOutSideMenuItems(),
                ]}
                style={styles.navItemContainer}
              >
                <Text
                  style={[
                    styles.navTextItem,
                    { color: COLORS.lightBlue, marginHorizontal: 18 },
                  ]}
                >
                  Elvis
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => [
                  console.log("on classical pressed"),
                  popOutSideMenuItems(),
                ]}
                style={styles.navItemContainer}
              >
                <Text
                  style={[
                    styles.navTextItem,
                    { color: COLORS.yellow, marginHorizontal: 18 },
                  ]}
                >
                  Classical
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => [
                  console.log("on house pressed"),
                  popOutSideMenuItems(),
                ]}
                style={styles.navItemContainer}
              >
                <Text
                  style={[
                    styles.navTextItem,
                    { color: COLORS.purple, marginHorizontal: 18 },
                  ]}
                >
                  House
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/*parts of the world section*/}
          <View style={[styles.thingsILoveContainer]}>
            <Text style={styles.thingsILoveHeadingItem}>
              {`Parts of the world I've seen:`}
            </Text>

            {/*country list items*/}
            <View style={styles.countryContainer}>
              {/*country list section*/}
              <TouchableOpacity
                onPress={() => [
                  console.log("on country item pressed"),
                  popOutSideMenuItems(),
                ]}
                style={[styles.navItemContainer, styles.navItemCustom]}
              >
                <Image
                  source={{
                    uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Flag_of_the_United_States_%28Pantone%29.svg/800px-Flag_of_the_United_States_%28Pantone%29.svg.png",
                  }}
                  style={{ width: 20, height: 20 }}
                />
                <Text style={[styles.navTextItem, { marginHorizontal: 8 }]}>
                  Connecticut
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => [
                  console.log("on country item pressed"),
                  popOutSideMenuItems(),
                ]}
                style={[styles.navItemContainer, styles.navItemCustom]}
              >
                <Image
                  source={{
                    uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Flag_of_Kuala_Lumpur%2C_Malaysia.svg/1200px-Flag_of_Kuala_Lumpur%2C_Malaysia.svg.png",
                  }}
                  style={{ width: 20, height: 20 }}
                />
                <Text style={[styles.navTextItem, { marginHorizontal: 8 }]}>
                  Kuala Lampur
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/*activities section*/}
          <View style={[styles.thingsILoveContainer]}>
            <Text style={styles.thingsILoveHeadingItem}>Activities:</Text>

            {/*activities list items*/}
            <View style={styles.countryContainer}>
              {/*activity list section*/}
              <TouchableOpacity
                onPress={() => [
                  console.log("on Hiking pressed"),
                  popOutSideMenuItems(),
                ]}
                style={[styles.navItemContainer, styles.navItemCustom]}
              >
                <FontAwesome5 name="hiking" size={20} color={COLORS.green} />
                <Text style={[styles.navTextItem, { marginHorizontal: 10 }]}>
                  Hiking
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => [
                  console.log("on photography pressed"),
                  popOutSideMenuItems(),
                ]}
                style={[styles.navItemContainer, styles.navItemCustom]}
              >
                <Fontisto name="camera" size={20} color={COLORS.purple} />
                <Text style={[styles.navTextItem, { marginHorizontal: 10 }]}>
                  Photography
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => [
                  console.log("on netball pressed"),
                  popOutSideMenuItems(),
                ]}
                style={[styles.navItemContainer, styles.navItemCustom]}
              >
                <FontAwesome5
                  name="basketball-ball"
                  size={20}
                  color={COLORS.lightBlue}
                />
                <Text style={[styles.navTextItem, { marginHorizontal: 10 }]}>
                  Netball
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  //render screen items
  function renderScreenItems() {
    return (
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        style={styles.screenContentContainer}
      >
        {renderHeaderSection()}
        {renderMyLinksSidePanelSection()}
        {renderScreenTopImageTextSection()}
        {renderScreenLinkSection()}
        {renderScrollingSection()}
      </ScrollView>
    );
  }

  //render screen content
  return (
    <View style={styles.container}>
      {isLoading || isLoadingProfile
        ? loadingComponent()
        : fetchError || profileError
          ? EmptyFlatlistComponent()
          : renderScreenItems()}
    </View>
  );
};

const styles = StyleSheet.create({
  //screen container
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //loading component
  loadingComponent: {
    flex: 1,
    top: 0,
  },

  //screen content container
  screenContentContainer: {
    top: Platform.OS === "ios" ? 0 : 0,
  },
  headerContainer: {
    marginTop: Platform.OS === "ios" ? 45 : 0,
    zIndex: 99,
  },

  //image text section
  topImageTextContainer: {
    maxHeight: 270,
    flexDirection: "column",
  },
  coverImageContainer: {
    width: "100%",
  },
  imageCoverItem: {
    width: "100%",
    height: 260,
    resizeMode: "cover",
  },

  //text and picture section
  textAndPicContainer: {
    flexDirection: "column",
  },
  userTextSectionContainer: {
    flexDirection: "column",
    marginVertical: 5,
    bottom: 220,
  },
  usernameTextItem: {
    alignSelf: "center",
    top: 2,
    marginBottom: 10,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  aboutUserTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  userPronouns: {
    alignSelf: "center",
    color: COLORS.darkGray,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  userProfileContainer: {
    marginTop: -90,
    alignSelf: "center",
  },
  userProfilePictureItem: {
    width: 120,
    height: 120,
    resizeMode: "cover",
    borderRadius: 15,
    borderColor: COLORS.black,
    borderWidth: 5,
  },

  //link section
  linkContainer: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 5,
  },
  linkItemContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "15%",
    height: 40,
    padding: 5,
    borderRadius: 8,
    backgroundColor: COLORS.purpleTransparent,
  },
  navItemContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 3,
    marginBottom: 5,
    padding: 5,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.darkGray,
    backgroundColor: COLORS.transparent,
  },
  navTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },

  //my links modal
  myLinksContentContainer: {
    top: 60,
    left: 20,
    width: "20%",
    height: 100,
    padding: 2,
    zIndex: 9,
  },
  myLinksTopSectionContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 10,
    backgroundColor: COLORS.purpleTransparent,
  },
  myLinksTopTextHeadingItem: {
    marginTop: 4,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },
  myLinksBottomSectionContainer: {
    justifyContent: "center",
    width: "100%",
    height: 540,
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderRadius: 15,
    backgroundColor: COLORS.opacityBlackDarker,
  },
  myLinksBottomContentContainer: {
    top: -10,
  },
  myLinksBottomItemContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 16,
  },
  myLinkImageItem: {
    width: 28,
    height: 28,
    borderRadius: 28,
  },
  myLinksTopTextItem: {
    marginTop: 8,
    color: COLORS.white,
    fontSize: 11,
    fontFamily: "PoppinsLight",
  },

  //scrolling section
  scrollingSectionContainer: {
    flex: 1,
    top: Platform.OS === "ios" ? 5 : 0,
    minHeight: Platform.OS === "ios" ? 480 : 350,
    paddingVertical: 10,
    marginBottom: Platform.OS === "ios" ? "10%" : 0,
    backgroundColor: COLORS.transparent,
  },
  myLifeTopScrollSection: {
    marginTop: 5,
    paddingTop: 5,
    paddingBottom: 5,
    marginHorizontal: 10,
    flexDirection: "column",
  },
  subHeadingTextActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  headingTextItem: {
    color: COLORS.darkGray,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  saveBlurbIcon: {
    marginTop: 10,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  blurbEditingContainer: {
    marginBottom: 5,
  },
  dividerItem: {
    marginTop: 10,
    width: "95%",
    alignSelf: "center",
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  //personality section
  personalityItemsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  personalityItemContent: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.pink,
    marginLeft: 2,
    marginBottom: 8,
    position: "relative",
    overflow: "hidden",
    width: Platform.OS === "ios" ? 132 : 105,
  },
  personalityItemContainer: {
    width: Platform.OS === "ios" ? 132 : 105,
    marginLeft: Platform.OS === "ios" ? 4 : 2,
    marginBottom: 8,
    position: "relative",
  },
  personalityImageItem: {
    width: Platform.OS === "ios" ? 128 : 101,
    height: 50,
    borderRadius: 6,
    resizeMode: "cover",
  },
  personalityCategoryItemContainer: {
    position: "absolute",
    top: 34,
    left: Platform.OS === "ios" ? 12 : 10,
    width: "80%",
  },
  personalityCategoryItem: {
    textAlign: "center",
    color: COLORS.white,
    fontSize: 11,
    fontFamily: "PoppinsBold",
  },

  //work style section
  workStyleItemContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },

  //favourite things section
  thingsILoveContainer: {
    flexDirection: "column",
    marginBottom: 10,
    backgroundColor: COLORS.transparent,
  },
  thingsILoveHeadingItem: {
    zIndex: 99,
    marginBottom: 8,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },
  countryContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
  },
  navItemCustom: {
    flexDirection: "row",
    paddingHorizontal: 10,
  },
});

export default LoggedInAccountAboutMeScreen;
