import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import StarRating from "react-native-star-rating-widget";

//customs
import { COLORS, images } from "../../constants";
import {
  
  CustomOpportunityDriverDescriptionInput,
} from "../../components";
import NavHeader from "@/components/Headers/NavHeader";

const RatePassengerExperienceScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigation = useNavigation();

  //state handlers
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  //send data
  const submitUserReviewData = (data) => {
    //user data
    const compiledData = {
      driverRatingToUser: rating,
      ratingReviewMessage:
        data.ratingUserReview === undefined
          ? "No review added"
          : data.ratingUserReview,
    };

    data = { ...compiledData };

    //validate if data is there
    if (data === null) {
      alert("Please complete the form to proceed further");
      setIsLoading(false);
    } else {
      console.log("submitted review data: ", {
        data: data,
      });
      setIsLoading(true);
    }
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerComponentsContainer}>
        <NavHeader
          message="What would you like to do?"
        />
        {/*replace top header with 
        <NavHeader 
          icon={<Feather name="more-vertical" size={24} color={COLORS.white} />}
          bubbleModal={true}
        />
        */}
      </View>
    );
  }

  //screen title section
  function renderScreenTitleSection() {
    return (
      <View style={styles.screenTitleContainer}>
        <Text style={styles.screenTitleItem}>Rate your trip with Nthando</Text>
      </View>
    );
  }

  //screen user profile info section
  function renderUserProfileInfoSection() {
    return (
      <View style={styles.userProfileInfoContainer}>
        {/*user profile picture section*/}
        <ImageBackground
          source={images.userFrame}
          style={styles.userProfilePictureBGContainer}
        >
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1632765854612-9b02b6ec2b15?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=686&q=80",
            }}
            style={styles.userProfilePictureItem}
          />
        </ImageBackground>

        {/*user profile text and action section*/}
        <View style={styles.userProfileTextContainer}>
          {/*username section*/}
          <View style={styles.userProfileUsernameContainer}>
            <Text style={styles.userProfileUsernameItem}>Nthando Khumalo</Text>
          </View>

          {/*add action section*/}
          <View style={styles.userProfileActionContainer}>
            <Text style={styles.userProfileActionItem}>Add to bubble</Text>
          </View>
        </View>
      </View>
    );
  }

  //rating review section
  function renderRatingUserReviewSection() {
    return (
      <View style={styles.ratingUserContainer}>
        {/*rating placement section*/}
        <View style={styles.ratingUserStarsContainer}>
          <StarRating
            rating={rating}
            onChange={setRating}
            maxStars={10}
            starSize={Platform.OS === "ios" ? 25 : 20}
            color={COLORS.purple}
            delay={100}
          />
        </View>

        {/*rating instruction section*/}
        <View style={styles.ratingUserInstructionContainer}>
          <Text style={styles.ratingUserInstructionTextItem}>
            <Text style={{ fontStyle: "italic" }}>Swipe</Text> or tap stars to
            rate
          </Text>
        </View>
      </View>
    );
  }

  //rating review section
  function renderRatingReviewSection() {
    return (
      <View style={styles.ratingUserReviewSectionContainer}>
        <CustomOpportunityDriverDescriptionInput
          name="ratingUserReview"
          control={control}
          rules={{
            required: "",
            maxLength: {
              value: 1000,
              message: "Description cannot contain more than 1000 characters",
            },
          }}
          placeholder={"Write your review..."}
        />
      </View>
    );
  }

  //send button section
  function renderSendButtonSection() {
    return (
      <View style={styles.sendUserButtonContainer}>
        <View style={styles.sendUserButtonContent}>
          <Pressable
            onPress={handleSubmit(submitUserReviewData)}
            style={styles.sendUserContainer}
          >
            <View style={styles.sendUserGradientContainer}>
              <Text style={styles.sendUserTextItem}>
                {isLoading ? (
                  <ActivityIndicator size={30} color={COLORS.white} />
                ) : (
                  "Send"
                )}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    );
  }

  //screen content list
  function renderScreenContentList() {
    return (
      <>
        {renderHeaderSection()}
        {renderScreenTitleSection()}
        {renderUserProfileInfoSection()}
        {renderRatingUserReviewSection()}
        {renderRatingReviewSection()}
        {renderSendButtonSection()}
      </>
    );
  }

  //screen content
  return (
    <View style={styles.rateScreenContainer}>{renderScreenContentList()}</View>
  );
};

//style custom
const styles = StyleSheet.create({
  rateScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //header section
  headerComponentsContainer: {
    zIndex: 99,
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  //screen title section
  screenTitleContainer: {
    marginTop: 65,
    justifyContent: "center",
    alignItems: "center",
  },
  screenTitleItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //user profile info section
  userProfileInfoContainer: {
    height: 250,
    marginTop: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  userProfilePictureBGContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 160,
    width: 160,
    marginBottom: 10,
  },
  userProfilePictureItem: {
    width: 150,
    height: 150,
    resizeMode: "cover",
    borderRadius: 8,
  },
  userProfileTextContainer: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  userProfileUsernameContainer: {
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  userProfileUsernameItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  userProfileActionContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  userProfileActionItem: {
    color: COLORS.purple,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //rating user section
  ratingUserContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  ratingUserStarsContainer: {
    marginTop: 35,
  },
  ratingUserInstructionContainer: {
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  ratingUserInstructionTextItem: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: "PoppinsLight",
    opacity: 0.6,
  },

  //rating user review section
  ratingUserReviewSectionContainer: {
    marginTop: 40,
    maxHeight: 130,
    paddingHorizontal: 10,
  },

  //send button section
  sendUserButtonContainer: {
    marginLeft: "70%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginTop: Platform.OS === "ios" ? 100 : 40,
    marginBottom: Platform.OS === "ios" ? 20 : 0,
  },
  sendUserButtonContent: {
    width: "100%",
  },
  sendUserContainer: {
    zIndex: 10,
  },
  sendUserGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    borderColor: COLORS.purple,
    borderWidth: 2,
    borderTopWidth: 0,
    height: 45,
    width: "100%",
    backgroundColor: COLORS.purpleDarker,
  },
  sendUserTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
});

export default RatePassengerExperienceScreen;
