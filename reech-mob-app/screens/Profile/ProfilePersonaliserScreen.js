import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Alert, TouchableOpacity, Platform, SafeAreaView, ActivityIndicator, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { AntDesign } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { FlatList } from "react-native-gesture-handler";

//import dependencies
import { COLORS, SIZES } from "../../constants";
import NavHeader from "@/components/Headers/NavHeader";
import Modal from "react-native-modal";
import { useRegisterSeekerMutation } from "../../redux/api/profile";
import { useUploadSingleFileMutation } from "../../redux/api/api-slice";
import { useInit_doc_embeddingsMutation } from "../../redux/ml-api/recommendation";
import { useGetJobTitleQuery } from "../../redux/api/job-title";
import { LinearGradient } from "expo-linear-gradient";

const ProfilePersonaliserScreen = ({ route }) => {
  const navigation = useNavigation();

  const prevData = route.params.data;

  const { handleSubmit } = useForm();

  const { data: jobTitleData } = useGetJobTitleQuery(prevData?.jobTitleId);
  const [registerSeeker, { isLoading: isLoadingRegister }] = useRegisterSeekerMutation();
  const [uploadFn, { isLoading: isLoadingFile }] = useUploadSingleFileMutation();
  const [initDocFn, { isLoading: isLoadingInitDoc }] = useInit_doc_embeddingsMutation();

  const [isError, setIsError] = useState(false);
  const [arr, setArr] = useState([]);
  const [jobDt, setJobDt] = useState();

  useEffect(() => { setJobDt(jobTitleData?.skillIds); }, [jobTitleData]);

  const showError = (res) =>
    Toast.show({
      type: "error",
      text1: "Error",
      text2: res.error.data?.error ?? "Something went wrong. Please try again",
    });

  const onNextPress = async (data) => {
    const skills = arr.map((obj) => obj.id);
    data = { ...prevData, skillIds: skills };
    const loc = data.location.split("|");

    const info = {
      accountVisibility: data.accVisibility,
      address: loc[0],
      commitmentLevel: data.commitmentLevel,
      earning: data.earning,
      educationLevel: data.educationLevel.split("|")[0],
      NQFLevel: Number(data.educationLevel.split("|")[1]),
      rate: data.salaryExpectation,
      experience: data.experience.value,
      skillIds: data.skillIds,
      jobCategoryId: data.jobCategoryId,
      jobTitleId: data.jobTitleId,
      location: {
        type: "Point",
        coordinates: [Number(loc[2]), Number(loc[1])],
      },
      profileImage: data.photo.name,
      userId: data.UserId,
    };

    const formData = new FormData();
    formData.append("file", data.photo);
    try {
      const { data } = await uploadFn(formData); const url = data?.data; info.profileImage = url;
    }
    catch (error) {
      console.error(error); return;
    }

    registerSeeker(info).then(async (res) => {
      if (res.error) { showError(res); return; }

      initDocFn({ _id: res.data.data?._id }).then((res) => {
        if (res.error) { console.log("error: ", res.error); return; }
        navigation.navigate("RenderPersonalisationScreen", { data: data });
      });
    })
      .catch((err) => { Alert.alert("Error...", err.response.data.error); console.log(err); });
  };

  const closeModal = () => setIsError(() => !isError);

  const modalFun = () => (
    <Modal
      isVisible={isError}
      animationIn="lightSpeedIn"
      animationOut="lightSpeedOut"
    >
      <View style={styles.modalTopContainer}>
        {/*reechie section*/}
        <View style={styles.topContainer}>
          <View style={styles.topBackIcon}>
            <AntDesign
              onPress={closeModal}
              name="closecircle"
              size={20}
              color={COLORS.white}
            />
          </View>

          {/*heading section*/}
          <View style={styles.textTopContainer}>
            <View style={styles.textTopContent}>
              <Text style={styles.textTopItem}>Error</Text>
              <Text style={styles.textTopSubItem}>
                The process failed while trying to create your profile, please
                try again later.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  //header section
  function headerSectionContainer() {
    return (
      <View style={styles.headerItemContainer}>
        <NavHeader message="What would you like to do?" />
        {renderNavigationSection()}
      </View>
    );
  }

  //render function
  function renderNavigationSection() {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerTextItem}>
          Choose up to 4 that you are skilled in.
        </Text>
      </View>
    );
  }

  //category personaliser
  function renderJobCategories() {
    const Personaliser = (item) => {
      const data = jobDt?.map((obj) => {
        if (jobDt?.find(() => item.id === obj.id)) {
          var idx = arr.findIndex((obj) => obj.id === item?.id);
          if (idx !== -1) {
            setArr(arr.filter((data) => data.id != item.id));
          } else if (idx === -1 && arr.length < 4) {
            setArr([...arr, { skillName: item.skillName, id: item.id }]);
          } else {
            console.log("You can only select up to four items.");
          }
        }

        return obj;
      });
      setJobDt(data);
    };

    //flat list items
    const renderItem = ({ item }) => {
      var selected = arr.findIndex((obj) => obj.id === item?.id);
      return (
        <TouchableOpacity style={styles.proTouch} onPress={() => Personaliser(item)}>
          <View
            style={[
              styles.jobTitle,
              { backgroundColor: selected !== -1 ? COLORS.purple : COLORS.darkGray },
            ]}
          >
            <Text style={styles.jobTitleText}>{item.skillName}</Text>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <View style={styles.profileSelectSection}>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: SIZES.padding * 2 }}
          numColumns={2}
          columnWrapperStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: SIZES.padding,
          }}
          data={jobDt}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          ListFooterComponent={<View style={{ marginBottom: 30 }} />}
        />
        {modalFun(true)}
      </View>
    );
  }

  function renderBottomButton() {
    return (
      <View style={styles.nextButton}>
        <Pressable
          onPress={handleSubmit(onNextPress)}
          style={styles.createContainer}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
            style={styles.createGradientContainer}
          >
            <Text style={styles.createTextItems}>
              {!(isLoadingRegister || isLoadingFile || isLoadingInitDoc) ? (
                "Create"
              ) : (
                <ActivityIndicator size="small" color="#fff" />
              )}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {headerSectionContainer()}
      {renderJobCategories()}
      {renderBottomButton()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //header section
  headerItemContainer: {
    zIndex: 99,
    marginTop: Platform.OS === "ios" ? -15 : 0,
  },
  headerContainer: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  headerTopTextContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //job category section
  profileSelectSection: {
    height: "80%",
  },
  jobCategories: {
    marginHorizontal: 10,
  },
  proTouch: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  jobTitle: {
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: Platform.OS === "ios" ? 70 : 55,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  modalContainer: {},
  jobTitleText: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "PoppinsLight",
    color: COLORS.white,
  },
  nextButton: {
    flex: 1,
    alignSelf: "flex-end",
    width: "35%",
    margin: SIZES.padding,
    marginHorizontal: Platform.OS === "ios" ? 38 : 27,
  },
  createContainer: {
    marginTop: 0,
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

  btnContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    marginBottom: Platform.OS === "ios" ? 25 : 45,
  },
  btnText: {
    color: COLORS.lightBlue,
    fontSize: 16,
  },

  modalTopContainer: {
    height: "50%",
    width: "100%",
    justifyContent: "center",
  },
  topContainer: {
    flexDirection: "column",
    marginBottom: "10%",
    borderRadius: 10,
    backgroundColor: COLORS.purple,
  },
  topBackIcon: {
    top: 10,
    right: 10,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },

  textTopContainer: {
    marginHorizontal: 15,
    padding: 10,
  },
  textTopContent: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  textTopItem: {
    color: COLORS.white,
    fontSize: 26,
    fontFamily: "PoppinsBold",
  },
  textTopSubItem: {
    top: 10,
    paddingBottom: 10,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
});

export default ProfilePersonaliserScreen;
