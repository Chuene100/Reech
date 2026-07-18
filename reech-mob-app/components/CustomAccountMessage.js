import React, { useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

//import components

//import dependencies
import { COLORS, images } from "../constants";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";

const CustomAccountMessage = ({ filter }) => {
  const profiles = useSelector((state) => state.profiles.user_profiles);
  const current_user = useSelector((state) => state.user.current_user);
  const image = useSelector((state) => state.profile_images.profileImages);
  const [selectedId, setSelected] = useState(current_user._id)

  function renderAccountList() {
    function onAllProfilePressed({ type, item }) {
      setSelected(item._id)
      if (type === 'User') {
        filter({ filter: { type: "All", id: item._id } })
      }
      if (type === 'Profile') {
        filter({ filter: { type: "Profile", id: item._id } })
      }
      if (type === 'Ads') {
        filter({ filter: { type: "Ads", id: item._id } })
      }
    }

    return (
      <SafeAreaView style={styles.contentProfileContainer}>
        {profiles &&
        <FlatList
          data={[{ ShowAll: true }, ...profiles]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            if (item?.ShowAll) {
              return (
                <TouchableOpacity
                  onPress={() => onAllProfilePressed({ type: "User", item: current_user })}
                  style={styles.profileContainers}
                >
                  <View style={styles.imageHolder}>
                    {selectedId === current_user?._id ? <LinearGradient
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      colors={[
                        COLORS.purpleDarker,
                        COLORS.purpleDark,
                        COLORS.purple,
                      ]}
                      style={styles.gradientColorContainer}
                    >
                      <Image
                        source={
                          current_user?.profileImage
                            ? {
                              uri:
                                image[current_user?.profileImage] ??
                                current_user?.profileImage,
                            }
                            : images.defaultRounded
                        }
                        style={styles.imageItem}
                        resizeMode="cover"
                      />
                    </LinearGradient>
                      :
                      <Image
                        source={
                          current_user?.profileImage
                            ? {
                              uri:
                                image[current_user?.profileImage] ??
                                current_user?.profileImage,
                            }
                            : images.defaultRounded
                        }
                        style={styles.imageItem}
                        resizeMode="cover"
                      />
                    }
                  </View>
                  <Text style={styles.imageText}>All</Text>
                </TouchableOpacity>
              );
            }

            if (!item?.ads) {
              return (
                <TouchableOpacity
                  onPress={() => onAllProfilePressed({ type: "Profile", item })}
                  style={styles.profileContainers}
                >
                  <View style={styles.imageHolder}>
                    {selectedId === item?._id ? <LinearGradient
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      colors={[
                        COLORS.purpleDarker,
                        COLORS.purpleDark,
                        COLORS.purple,
                      ]}
                      style={styles.gradientColorContainer}
                    >
                      <Image
                        source={
                          item?.profileImage
                            ? {
                              uri:
                                image[item?.profileImage] ?? item?.profileImage,
                            }
                            : images.defaultRounded
                        }
                        style={styles.imageItem}
                        resizeMode="cover"
                      />
                    </LinearGradient>
                      :
                      <Image
                        source={
                          item?.profileImage
                            ? {
                              uri:
                                image[item?.profileImage] ?? item?.profileImage,
                            }
                            : images.defaultRounded
                        }
                        style={styles.imageItem}
                        resizeMode="cover"
                      />
                    }
                  </View>
                  <Text style={styles.imageText}>
                    {item?.jobTitleId?.jobTitle}
                  </Text>
                </TouchableOpacity>
              );
            }

            if (item?.ads) {
              return (
                <TouchableOpacity
                  onPress={() => onAllProfilePressed({ type: "Ads" })}
                  style={styles.profileContainers}
                >
                  <View style={styles.imageContentContainer}>
                    <View style={styles.imageHolder}>
                      {selectedId === item?._id ? <LinearGradient
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        colors={[
                          COLORS.purpleDarker,
                          COLORS.purpleDark,
                          COLORS.purple,
                        ]}
                        style={styles.gradientColorContainer}
                      >
                        <Image
                          source={
                            item?.profileImage
                              ? {
                                uri:
                                  image[item?.profileImage] ??
                                  item?.profileImage,
                              }
                              : images.u1
                          }
                          style={styles.imageItemAd}
                          resizeMode="cover"
                        />
                      </LinearGradient>
                        : <Image
                          source={
                            item?.profileImage
                              ? {
                                uri:
                                  image[item?.profileImage] ??
                                  item?.profileImage,
                              }
                              : images.u1
                          }
                          style={styles.imageItemAd}
                          resizeMode="cover"
                        />
                      }
                    </View>
                  </View>
                  <Text style={styles.imageTextAd}>
                    {item?.jobTitleId?.jobTitle}
                  </Text>
                </TouchableOpacity>
              );
            }
          }}
          horizontal
          contentContainerStyle={{ paddingHorizontal: 0 }}
          showsHorizontalScrollIndicator={false}
        />
        }
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.topScreenContainer}>
      {renderAccountList()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topScreenContainer: {
    flex: 1,
  },
  //profile messages
  contentProfileContainer: {
    marginTop: Platform.OS === "android" ? "-70%" : "-35%",
    top: Platform.OS === "ios" ? 92 : 208,
  },
  gradientColorContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 1,
  },
  profileContainers: {
    marginBottom: 20,
    alignSelf: "center",
    paddingHorizontal: 10,
  },
  imageContentContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageHolder: {
    paddingTop: Platform.OS === "ios" ? 10 : 20,
    padding: Platform.OS === "ios" ? 9 : 4.5,
  },
  imageItem: {
    width: 70,
    height: 70,
    borderRadius: 50,
    alignSelf: "center",
  },
  imageItemAd: {
    width: 70,
    height: 70,
    borderColor: COLORS.purple,
    borderWidth: 2,
    borderRadius: 200,
  },
  imageText: {
    textAlign: "center",
    color: COLORS.white,
    fontSize: 12,
  },
  imageTextAd: {
    alignSelf: "center",
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    right: 3.5,
  },
});

export default CustomAccountMessage;
