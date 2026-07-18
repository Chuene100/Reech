import React from "react";
import {
  Image,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Fontisto,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  FontAwesome,
  FontAwesome5,
  Octicons,
} from "@expo/vector-icons";

//custom data
import {
  channelArtsListData,
  channelBusinessListData,
  channelSportListData,
  channelComedyListData,
  channelTheEnvironmentData,
  channelEngineeringListData,
  channelFashionBeautyListData,
  channelFoodListData,
  channelHealthListData,
  channelKidsListData,
  channelLawListData,
  channelLifeListData,
  channelMusicListData,
  channelReligionListData,
  channelScienceListData,
  channelTransportListData,
  channelSpaceListData,
  channelTravelListData,
  channelOtherListData,
} from "../../assets/data/howTo/channelListData";

//customs
import { COLORS } from "../../constants";
import NavHeader from "@/components/Headers/NavHeader";

const HowToChannelCategoryScreen = () => {
  const navigation = useNavigation();

  //channel collection: arts
  function renderArtsChannelList() {
    const sortedData = channelArtsListData.map((item) => {
      const sortedCategoryList = item.categoryListItems.slice().sort((a, b) => {
        return a.catName.localeCompare(b.catName); // Sorting based on catName
      });

      return {
        ...item,
        categoryListItems: sortedCategoryList,
      };
    });

    return (
      <>
        <Text style={[styles.imageText, { alignSelf: "flex-start" }]}>
          <FontAwesome name="paint-brush" size={18} color={COLORS.white} />
          {"  "}
          Arts
        </Text>

        <FlatList
          horizontal
          data={sortedData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.countryContainer}>
                {/*channel items*/}
                <View style={styles.catListContainer}>
                  {item.categoryListItems.map((catItem, i) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("PostOpScreen", { idx: 0 })
                      }
                      key={i}
                      style={styles.catListContent}
                    >
                      <Image
                        source={catItem.catImage}
                        style={styles.catListImageItem}
                      />
                      <View style={styles.channelNameItemRecommend}>
                        <Text style={styles.catListTextItem}>
                          {catItem.catName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />
      </>
    );
  }

  //channel collection: business
  function renderBusinessListData() {
    const sortedData = channelBusinessListData.map((item) => {
      const sortedCategoryList = item.categoryListItems.slice().sort((a, b) => {
        return a.catName.localeCompare(b.catName); // Sorting based on catName
      });

      return {
        ...item,
        categoryListItems: sortedCategoryList,
      };
    });

    return (
      <>
        <Text style={[styles.imageText, { alignSelf: "flex-start" }]}>
          <Ionicons name="md-business" size={18} color={COLORS.white} />
          {"  "}
          Business
        </Text>

        <FlatList
          horizontal
          data={sortedData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.countryContainer}>
                {/*channel items*/}
                <View style={styles.catListContainer}>
                  {item.categoryListItems.map((catItem, i) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("PostOpScreen", { idx: 0 })
                      }
                      key={i}
                      style={styles.catListContent}
                    >
                      <Image
                        source={catItem.catImage}
                        style={styles.catListImageItem}
                      />
                      <View style={styles.channelNameItemRecommend}>
                        <Text style={styles.catListTextItem}>
                          {catItem.catName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />
      </>
    );
  }

  //channel collection: comedy
  function renderComedyListData() {
    const sortedData = channelComedyListData.map((item) => {
      const sortedCategoryList = item.categoryListItems.slice().sort((a, b) => {
        return a.catName.localeCompare(b.catName); // Sorting based on catName
      });

      return {
        ...item,
        categoryListItems: sortedCategoryList,
      };
    });

    return (
      <>
        <Text style={[styles.imageText, { alignSelf: "flex-start" }]}>
          <MaterialIcons name="theater-comedy" size={18} color={COLORS.white} />
          {"  "}
          Comedy
        </Text>

        <FlatList
          horizontal
          data={sortedData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.countryContainer}>
                {/*channel items*/}
                <View style={styles.catListContainer}>
                  {item.categoryListItems.map((catItem, i) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("PostOpScreen", { idx: 0 })
                      }
                      key={i}
                      style={styles.catListContent}
                    >
                      <Image
                        source={catItem.catImage}
                        style={styles.catListImageItem}
                      />
                      <View style={styles.channelNameItemRecommend}>
                        <Text style={styles.catListTextItem}>
                          {catItem.catName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />
      </>
    );
  }

  //channel collection: environment
  function renderEnvironmentListData() {
    const sortedData = channelTheEnvironmentData.map((item) => {
      const sortedCategoryList = item.categoryListItems.slice().sort((a, b) => {
        return a.catName.localeCompare(b.catName); // Sorting based on catName
      });

      return {
        ...item,
        categoryListItems: sortedCategoryList,
      };
    });

    return (
      <>
        <Text style={[styles.imageText, { alignSelf: "flex-start" }]}>
          <FontAwesome name="envira" size={18} color={COLORS.white} />
          {"  "}
          The Environment
        </Text>

        <FlatList
          horizontal
          data={sortedData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.countryContainer}>
                {/*channel items*/}
                <View style={styles.catListContainer}>
                  {item.categoryListItems.map((catItem, i) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("PostOpScreen", { idx: 0 })
                      }
                      key={i}
                      style={styles.catListContent}
                    >
                      <Image
                        source={catItem.catImage}
                        style={styles.catListImageItem}
                      />
                      <View style={styles.channelNameItemRecommend}>
                        <Text style={styles.catListTextItem}>
                          {catItem.catName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />
      </>
    );
  }

  //channel collection: engineering
  function renderEngineeringChannelList() {
    const sortedData = channelEngineeringListData.map((item) => {
      const sortedCategoryList = item.categoryListItems.slice().sort((a, b) => {
        return a.catName.localeCompare(b.catName); // Sorting based on catName
      });

      return {
        ...item,
        categoryListItems: sortedCategoryList,
      };
    });

    return (
      <>
        <Text style={[styles.imageText, { alignSelf: "flex-start" }]}>
          <MaterialIcons name="engineering" size={18} color={COLORS.white} />
          {"  "}
          Engineering
        </Text>

        <FlatList
          horizontal
          data={sortedData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.countryContainer}>
                {/*channel items*/}
                <View style={styles.catListContainer}>
                  {item.categoryListItems.map((catItem, i) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("PostOpScreen", { idx: 0 })
                      }
                      key={i}
                      style={styles.catListContent}
                    >
                      <Image
                        source={catItem.catImage}
                        style={styles.catListImageItem}
                      />
                      <View style={styles.channelNameItemRecommend}>
                        <Text style={styles.catListTextItem}>
                          {catItem.catName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />
      </>
    );
  }

  //channel collection: fashion
  function renderFashionChannelList() {
    const sortedData = channelFashionBeautyListData.map((item) => {
      const sortedCategoryList = item.categoryListItems.slice().sort((a, b) => {
        return a.catName.localeCompare(b.catName); // Sorting based on catName
      });

      return {
        ...item,
        categoryListItems: sortedCategoryList,
      };
    });

    return (
      <>
        <Text style={[styles.imageText, { alignSelf: "flex-start" }]}>
          <MaterialCommunityIcons
            name="hair-dryer"
            size={18}
            color={COLORS.white}
          />
          {"  "}
          Fashion, Hair & Beauty
        </Text>

        <FlatList
          horizontal
          data={sortedData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.countryContainer}>
                {/*channel items*/}
                <View style={styles.catListContainer}>
                  {item.categoryListItems.map((catItem, i) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("PostOpScreen", { idx: 0 })
                      }
                      key={i}
                      style={styles.catListContent}
                    >
                      <Image
                        source={catItem.catImage}
                        style={styles.catListImageItem}
                      />
                      <View style={styles.channelNameItemRecommend}>
                        <Text style={styles.catListTextItem}>
                          {catItem.catName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />
      </>
    );
  }

  //channel collection: food
  function renderFoodChannelList() {
    const sortedData = channelFoodListData.map((item) => {
      const sortedCategoryList = item.categoryListItems.slice().sort((a, b) => {
        return a.catName.localeCompare(b.catName); // Sorting based on catName
      });

      return {
        ...item,
        categoryListItems: sortedCategoryList,
      };
    });

    return (
      <>
        <Text style={[styles.imageText, { alignSelf: "flex-start" }]}>
          <Ionicons name="fast-food" size={18} color={COLORS.white} />
          {"  "}
          Food & Beverage
        </Text>

        <FlatList
          horizontal
          data={sortedData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.countryContainer}>
                {/*channel items*/}
                <View style={styles.catListContainer}>
                  {item.categoryListItems.map((catItem, i) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("PostOpScreen", { idx: 0 })
                      }
                      key={i}
                      style={styles.catListContent}
                    >
                      <Image
                        source={catItem.catImage}
                        style={styles.catListImageItem}
                      />
                      <View style={styles.channelNameItemRecommend}>
                        <Text style={styles.catListTextItem}>
                          {catItem.catName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />
      </>
    );
  }

  //channel collection: health
  function renderHealthChannelList() {
    const sortedData = channelHealthListData.map((item) => {
      const sortedCategoryList = item.categoryListItems.slice().sort((a, b) => {
        return a.catName.localeCompare(b.catName); // Sorting based on catName
      });

      return {
        ...item,
        categoryListItems: sortedCategoryList,
      };
    });

    return (
      <>
        <Text style={[styles.imageText, { alignSelf: "flex-start" }]}>
          <Fontisto name="nurse" size={18} color={COLORS.white} />
          {"  "}
          Health & Wellness
        </Text>

        <FlatList
          horizontal
          data={sortedData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.countryContainer}>
                {/*channel items*/}
                <View style={styles.catListContainer}>
                  {item.categoryListItems.map((catItem, i) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("PostOpScreen", { idx: 0 })
                      }
                      key={i}
                      style={styles.catListContent}
                    >
                      <Image
                        source={catItem.catImage}
                        style={styles.catListImageItem}
                      />
                      <View style={styles.channelNameItemRecommend}>
                        <Text style={styles.catListTextItem}>
                          {catItem.catName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />
      </>
    );
  }

  //channel collection: kids & family
  function renderKidsChannelList() {
    const sortedData = channelKidsListData.map((item) => {
      const sortedCategoryList = item.categoryListItems.slice().sort((a, b) => {
        return a.catName.localeCompare(b.catName); // Sorting based on catName
      });

      return {
        ...item,
        categoryListItems: sortedCategoryList,
      };
    });

    return (
      <>
        <Text style={[styles.imageText, { alignSelf: "flex-start" }]}>
          <MaterialIcons
            name="family-restroom"
            size={18}
            color={COLORS.white}
          />
          {"  "}
          Kids & Family
        </Text>

        <FlatList
          horizontal
          data={sortedData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.countryContainer}>
                {/*channel items*/}
                <View style={styles.catListContainer}>
                  {item.categoryListItems.map((catItem, i) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("PostOpScreen", { idx: 0 })
                      }
                      key={i}
                      style={styles.catListContent}
                    >
                      <Image
                        source={catItem.catImage}
                        style={styles.catListImageItem}
                      />
                      <View style={styles.channelNameItemRecommend}>
                        <Text style={styles.catListTextItem}>
                          {catItem.catName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />
      </>
    );
  }

  //channel collection: law
  function renderLawChannelList() {
    const sortedData = channelLawListData.map((item) => {
      const sortedCategoryList = item.categoryListItems.slice().sort((a, b) => {
        return a.catName.localeCompare(b.catName); // Sorting based on catName
      });

      return {
        ...item,
        categoryListItems: sortedCategoryList,
      };
    });

    return (
      <>
        <Text style={[styles.imageText, { alignSelf: "flex-start" }]}>
          <Octicons name="law" size={18} color={COLORS.white} />
          {"  "}
          Law & Politics
        </Text>

        <FlatList
          horizontal
          data={sortedData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.countryContainer}>
                {/*channel items*/}
                <View style={styles.catListContainer}>
                  {item.categoryListItems.map((catItem, i) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("PostOpScreen", { idx: 0 })
                      }
                      key={i}
                      style={styles.catListContent}
                    >
                      <Image
                        source={catItem.catImage}
                        style={styles.catListImageItem}
                      />
                      <View style={styles.channelNameItemRecommend}>
                        <Text style={styles.catListTextItem}>
                          {catItem.catName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />
      </>
    );
  }

  //channel collection: life
  function renderLifeChannelList() {
    const sortedData = channelLifeListData.map((item) => {
      const sortedCategoryList = item.categoryListItems.slice().sort((a, b) => {
        return a.catName.localeCompare(b.catName); // Sorting based on catName
      });

      return {
        ...item,
        categoryListItems: sortedCategoryList,
      };
    });

    return (
      <>
        <Text style={[styles.imageText, { alignSelf: "flex-start" }]}>
          <MaterialCommunityIcons name="beach" size={18} color={COLORS.white} />
          {"  "}
          Life
        </Text>

        <FlatList
          horizontal
          data={sortedData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.countryContainer}>
                {/*channel items*/}
                <View style={styles.catListContainer}>
                  {item.categoryListItems.map((catItem, i) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("PostOpScreen", { idx: 0 })
                      }
                      key={i}
                      style={styles.catListContent}
                    >
                      <Image
                        source={catItem.catImage}
                        style={styles.catListImageItem}
                      />
                      <View style={styles.channelNameItemRecommend}>
                        <Text style={styles.catListTextItem}>
                          {catItem.catName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />
      </>
    );
  }

  //channel collection: music & entertainment
  function renderMusicChannelList() {
    const sortedData = channelMusicListData.map((item) => {
      const sortedCategoryList = item.categoryListItems.slice().sort((a, b) => {
        return a.catName.localeCompare(b.catName); // Sorting based on catName
      });

      return {
        ...item,
        categoryListItems: sortedCategoryList,
      };
    });

    return (
      <>
        <Text style={[styles.imageText, { alignSelf: "flex-start" }]}>
          <Fontisto name="applemusic" size={18} color={COLORS.white} />
          {"  "}
          Music & Entertainment
        </Text>

        <FlatList
          horizontal
          data={sortedData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.countryContainer}>
                {/*channel items*/}
                <View style={styles.catListContainer}>
                  {item.categoryListItems.map((catItem, i) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("PostOpScreen", { idx: 0 })
                      }
                      key={i}
                      style={styles.catListContent}
                    >
                      <Image
                        source={catItem.catImage}
                        style={styles.catListImageItem}
                      />
                      <View style={styles.channelNameItemRecommend}>
                        <Text style={styles.catListTextItem}>
                          {catItem.catName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />
      </>
    );
  }

  //channel collection: religious
  function renderReligionChannelList() {
    const sortedData = channelReligionListData.map((item) => {
      const sortedCategoryList = item.categoryListItems.slice().sort((a, b) => {
        return a.catName.localeCompare(b.catName); // Sorting based on catName
      });

      return {
        ...item,
        categoryListItems: sortedCategoryList,
      };
    });

    return (
      <>
        <Text style={[styles.imageText, { alignSelf: "flex-start" }]}>
          <FontAwesome5 name="church" size={18} color={COLORS.white} />
          {"  "}
          Religious
        </Text>

        <FlatList
          horizontal
          data={sortedData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.countryContainer}>
                {/*channel items*/}
                <View style={styles.catListContainer}>
                  {item.categoryListItems.map((catItem, i) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("PostOpScreen", { idx: 0 })
                      }
                      key={i}
                      style={styles.catListContent}
                    >
                      <Image
                        source={catItem.catImage}
                        style={styles.catListImageItem}
                      />
                      <View style={styles.channelNameItemRecommend}>
                        <Text style={styles.catListTextItem}>
                          {catItem.catName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />
      </>
    );
  }

  //channel collection: science
  function renderScienceChannelList() {
    const sortedData = channelScienceListData.map((item) => {
      const sortedCategoryList = item.categoryListItems.slice().sort((a, b) => {
        return a.catName.localeCompare(b.catName); // Sorting based on catName
      });

      return {
        ...item,
        categoryListItems: sortedCategoryList,
      };
    });

    return (
      <>
        <Text style={[styles.imageText, { alignSelf: "flex-start" }]}>
          <MaterialIcons name="science" size={18} color={COLORS.white} />
          {"  "}
          Science & Technology
        </Text>

        <FlatList
          horizontal
          data={sortedData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.countryContainer}>
                {/*channel items*/}
                <View style={styles.catListContainer}>
                  {item.categoryListItems.map((catItem, i) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("PostOpScreen", { idx: 0 })
                      }
                      key={i}
                      style={styles.catListContent}
                    >
                      <Image
                        source={catItem.catImage}
                        style={styles.catListImageItem}
                      />
                      <View style={styles.channelNameItemRecommend}>
                        <Text style={styles.catListTextItem}>
                          {catItem.catName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />
      </>
    );
  }

  //channel collection: space
  function renderSpaceChannelList() {
    const sortedData = channelSpaceListData.map((item) => {
      const sortedCategoryList = item.categoryListItems.slice().sort((a, b) => {
        return a.catName.localeCompare(b.catName); // Sorting based on catName
      });

      return {
        ...item,
        categoryListItems: sortedCategoryList,
      };
    });

    return (
      <>
        <Text style={[styles.imageText, { alignSelf: "flex-start" }]}>
          <MaterialCommunityIcons
            name="office-building"
            size={18}
            color={COLORS.white}
          />
          {"  "}
          Space and Building
        </Text>

        <FlatList
          horizontal
          data={sortedData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.countryContainer}>
                {/*channel items*/}
                <View style={styles.catListContainer}>
                  {item.categoryListItems.map((catItem, i) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("PostOpScreen", { idx: 0 })
                      }
                      key={i}
                      style={styles.catListContent}
                    >
                      <Image
                        source={catItem.catImage}
                        style={styles.catListImageItem}
                      />
                      <View style={styles.channelNameItemRecommend}>
                        <Text style={styles.catListTextItem}>
                          {catItem.catName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />
      </>
    );
  }

  //channel collection: sport
  function renderSportChannelList() {
    const sortedData = channelSportListData.map((item) => {
      const sortedCategoryList = item.categoryListItems.slice().sort((a, b) => {
        return a.catName.localeCompare(b.catName); // Sorting based on catName
      });

      return {
        ...item,
        categoryListItems: sortedCategoryList,
      };
    });

    return (
      <>
        <Text style={[styles.imageText, { alignSelf: "flex-start" }]}>
          <MaterialCommunityIcons
            name="soccer-field"
            size={18}
            color={COLORS.white}
          />
          {"  "}
          Sport & Recreation
        </Text>

        <FlatList
          horizontal
          data={sortedData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.countryContainer}>
                {/*channel items*/}
                <View style={styles.catListContainer}>
                  {item.categoryListItems.map((catItem, i) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("PostOpScreen", { idx: 0 })
                      }
                      key={i}
                      style={styles.catListContent}
                    >
                      <Image
                        source={catItem.catImage}
                        style={styles.catListImageItem}
                      />
                      <View style={styles.channelNameItemRecommend}>
                        <Text style={styles.catListTextItem}>
                          {catItem.catName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />
      </>
    );
  }

  //channel collection: transport
  function renderTransportChannelList() {
    const sortedData = channelTransportListData.map((item) => {
      const sortedCategoryList = item.categoryListItems.slice().sort((a, b) => {
        return a.catName.localeCompare(b.catName); // Sorting based on catName
      });

      return {
        ...item,
        categoryListItems: sortedCategoryList,
      };
    });

    return (
      <>
        <Text style={[styles.imageText, { alignSelf: "flex-start" }]}>
          <FontAwesome5 name="truck-moving" size={18} color={COLORS.white} />
          {"  "}
          Transport
        </Text>

        <FlatList
          horizontal
          data={sortedData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.countryContainer}>
                {/*channel items*/}
                <View style={styles.catListContainer}>
                  {item.categoryListItems.map((catItem, i) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("PostOpScreen", { idx: 0 })
                      }
                      key={i}
                      style={styles.catListContent}
                    >
                      <Image
                        source={catItem.catImage}
                        style={styles.catListImageItem}
                      />
                      <View style={styles.channelNameItemRecommend}>
                        <Text style={styles.catListTextItem}>
                          {catItem.catName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />
      </>
    );
  }

  //channel collection: travel
  function renderTravelChannelList() {
    const sortedData = channelTravelListData.map((item) => {
      const sortedCategoryList = item.categoryListItems.slice().sort((a, b) => {
        return a.catName.localeCompare(b.catName); // Sorting based on catName
      });

      return {
        ...item,
        categoryListItems: sortedCategoryList,
      };
    });

    return (
      <>
        <Text style={[styles.imageText, { alignSelf: "flex-start" }]}>
          <MaterialIcons name="flight-takeoff" size={18} color={COLORS.white} />
          {"  "}
          Travel & Hospitality
        </Text>

        <FlatList
          horizontal
          data={sortedData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.countryContainer}>
                {/*channel items*/}
                <View style={styles.catListContainer}>
                  {item.categoryListItems.map((catItem, i) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("PostOpScreen", { idx: 0 })
                      }
                      key={i}
                      style={styles.catListContent}
                    >
                      <Image
                        source={catItem.catImage}
                        style={styles.catListImageItem}
                      />
                      <View style={styles.channelNameItemRecommend}>
                        <Text style={styles.catListTextItem}>
                          {catItem.catName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />
      </>
    );
  }

  //channel collection: other
  function renderOtherChannelList() {
    const sortedData = channelOtherListData.map((item) => {
      const sortedCategoryList = item.categoryListItems.slice().sort((a, b) => {
        return a.catName.localeCompare(b.catName); // Sorting based on catName
      });

      return {
        ...item,
        categoryListItems: sortedCategoryList,
      };
    });

    return (
      <>
        <Text style={[styles.imageText, { alignSelf: "flex-start" }]}>
          <MaterialCommunityIcons
            name="mother-heart"
            size={18}
            color={COLORS.white}
          />
          {"  "}
          Other
        </Text>

        <FlatList
          horizontal
          data={sortedData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.countryContainer}>
                {/*channel items*/}
                <View style={styles.catListContainer}>
                  {item.categoryListItems.map((catItem, i) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("PostOpScreen", { idx: 0 })
                      }
                      key={i}
                      style={styles.catListContent}
                    >
                      <Image
                        source={catItem.catImage}
                        style={styles.catListImageItem}
                      />
                      <View style={styles.channelNameItemRecommend}>
                        <Text style={styles.catListTextItem}>
                          {catItem.catName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />
      </>
    );
  }

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <NavHeader message="What would you like to do?" />
      </View>

      <View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.listsContainer}
        >
          {renderArtsChannelList()}
          {renderBusinessListData()}
          {renderComedyListData()}
          {renderEnvironmentListData()}
          {renderEngineeringChannelList()}
          {renderFashionChannelList()}
          {renderFoodChannelList()}
          {renderHealthChannelList()}
          {renderKidsChannelList()}
          {renderLawChannelList()}
          {renderLifeChannelList()}
          {renderMusicChannelList()}
          {renderReligionChannelList()}
          {renderScienceChannelList()}
          {renderSpaceChannelList()}
          {renderSportChannelList()}
          {renderTransportChannelList()}
          {renderTravelChannelList()}
          {renderOtherChannelList()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  screenHeader: {
    zIndex: 99,
    marginTop: Platform.OS === "android" ? "0%" : "-1%",
  },
  listsContainer: {
    height: "93%",
    marginTop: 20,
  },

  //channel collection
  countryContainer: {
    paddingVertical: 15,
  },
  catListContainer: {
    flexDirection: "row",
  },
  catListContent: {
    marginHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 160,
  },
  catListImageItem: {
    marginTop: 0,
    width: 140,
    height: 170,
    marginRight: 0,
    resizeMode: "cover",
    borderRadius: 10,
  },
  channelNameItemRecommend: {
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 34,
    maxWidth: 150,
  },
  catListTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    textAlign: "center",
  },
  imageText: {
    alignSelf: "center",
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
});

export default HowToChannelCategoryScreen;
