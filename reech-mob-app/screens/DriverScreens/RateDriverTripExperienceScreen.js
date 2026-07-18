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

const RateDriverProgressScreen = () => {
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
  const submitDriverReviewData = (data) => {
    //user data
    const compiledData = {
      userRatingToDriver: rating,
      ratingReviewMessage:
        data.ratingReview === undefined ? "No review added" : data.ratingReview,
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
      <View style={styles.headerComponentContainer}>
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

  //screen top section
  function renderTopHeaderSection() {
    return (
      <View style={styles.headerTopSectionContainer}>
        {/*image section*/}
        <View style={styles.headerImageContainer}>
          <ImageBackground
            source={images.userFrame}
            style={styles.headerImageContent}
          >
            <Image
              source={{ uri: images.Bronwin }}
              style={styles.headerImageItem}
            />
          </ImageBackground>
        </View>

        {/*text section*/}
        <View style={styles.headerTextContainer}>
          {/*username section*/}
          <View style={styles.headerTextNameContainer}>
            <Text style={styles.headerTextNameItem}>Angela Rodgers</Text>
          </View>

          {/*add button section: if bubble mates replace with "Bubble mate"*/}
          <View style={styles.headerButtonContainer}>
            <Text style={styles.headerButtonTextItem}>Add to bubble</Text>
          </View>
        </View>
      </View>
    );
  }

  //rating driver section
  function renderRatingSection() {
    return (
      <View style={styles.ratingDriverSectionContainer}>
        {/*rating header section*/}
        <View style={styles.ratingHeaderTextContainer}>
          <Text style={styles.ratingHeaderTextItem}>
            Rate Angela as a driver
          </Text>
        </View>

        {/*rating driver profile section*/}
        <View style={styles.ratingDriverProfileContainer}>
          {/*rating profile picture section*/}
          <View style={styles.ratingDriverProfilePictureContainer}>
            <View style={styles.ratingDriverProfilePictureContent}>
              {/*rating indicator item*/}
              <View style={styles.ratingDriverIndicatorContainer}>
                <Text style={styles.ratingDriverIndicator}>{rating}</Text>
              </View>

              {/*user profile picture item*/}
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1603189661342-e45f1374f890?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
                }}
                style={styles.ratingDriverProfilePictureItem}
              />
            </View>

            {/*rating placement section*/}
            <View style={styles.ratingStarsContainer}>
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
            <View style={styles.ratingInstructionContainer}>
              <Text style={styles.ratingInstructionTextItem}>
                <Text style={{ fontStyle: "italic" }}>Swipe</Text> or tap stars
                to rate
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  //rating review section
  function renderRatingReviewSection() {
    return (
      <View style={styles.ratingReviewSectionContainer}>
        <CustomOpportunityDriverDescriptionInput
          name="ratingReview"
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
      <View style={styles.sendButtonContainer}>
        <View style={styles.sendButtonContent}>
          <Pressable
            onPress={handleSubmit(submitDriverReviewData)}
            style={styles.sendContainer}
          >
            <View style={styles.sendGradientContainer}>
              <Text style={styles.sendTextItem}>
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
        {renderTopHeaderSection()}
        {renderRatingSection()}
        {renderRatingReviewSection()}
        {renderSendButtonSection()}
      </>
    );
  }

  //screen item list
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
  headerComponentContainer: {
    zIndex: 99,
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  //header image section
  headerTopSectionContainer: {
    marginTop: "20%",
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerImageContainer: {
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  headerImageContent: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImageItem: {
    width: 90,
    height: 90,
    resizeMode: "cover",
    borderRadius: 8,
  },
  headerTextContainer: {
    width: "68%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  headerTextNameContainer: {
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextNameItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  headerButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerButtonTextItem: {
    color: COLORS.purple,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //rating driver section
  ratingDriverSectionContainer: {
    marginTop: 50,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  ratingHeaderTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  ratingHeaderTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  ratingDriverProfileContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  ratingDriverProfilePictureContainer: {
    marginTop: -20,
  },
  ratingDriverProfilePictureContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  ratingDriverIndicatorContainer: {
    zIndex: 9,
    height: 25,
    width: 25,
    top: 40,
    left: 65,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: COLORS.purple,
  },
  ratingDriverIndicator: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: "PoppinsLight",
  },
  ratingDriverProfilePictureItem: {
    width: 180,
    height: 180,
    resizeMode: "cover",
    borderRadius: 180,
  },
  ratingStarsContainer: {
    marginTop: 15,
  },
  ratingInstructionContainer: {
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  ratingInstructionTextItem: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: "PoppinsLight",
    opacity: 0.6,
  },

  //rating review section
  ratingReviewSectionContainer: {
    marginTop: 20,
    maxHeight: 130,
    paddingHorizontal: 10,
  },

  //send button section
  sendButtonContainer: {
    marginLeft: "70%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginTop: Platform.OS === "ios" ? 100 : 40,
    marginBottom: Platform.OS === "ios" ? 20 : 0,
  },
  sendButtonContent: {
    width: "100%",
  },
  sendContainer: {
    zIndex: 10,
  },
  sendGradientContainer: {
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
  sendTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
});

export default RateDriverProgressScreen;
