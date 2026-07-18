import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { OptimizedFlatList } from "react-native-optimized-flatlist";

//import dependencies
import { icons, images, COLORS, SIZES, FONTS } from "../constants";
import {
  Ionicons,
  FontAwesome,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";

const OpportunityCard = () => {
  //dummy data
  const cardsData = [
    {
      id: "0",
      userPic: images.Ajo,
      userName: "Ajo Simpsons",
      cardImage: images.absa,
      cardTitle: "Senior Java Lead Developer",
      cardDescription:
        "Bring your possibility to life! Define your career with us With over years of rich history and strongly positioned as a local bank with regional and international expertise, a career with our family offers the opportunity to be part of this exciting growth journey, to reset our future and shape our destiny as a proudly African group.",
      location: "Randburg, Johannesburg",
      salary: "200 per day",
      timePeriod: "Tomorrow",
      likes: 42,
      verified: true,
    },
    {
      id: "1",
      userPic: images.Angela,
      userName: "Angela Khumalo",
      cardImage: images.cat,
      cardTitle: "Accounting Manager",
      cardDescription:
        "Whether it be ground-breaking products, best in class solutions or creating a lifelong career, you can do the work that matters at Caterpillar. With a 95-year legacy of quality and innovation and 150 locations in countries around the world, your impact spans the globe.",
      location: "Boksburg, Johannesburg",
      salary: "430 per hour",
      timePeriod: "23 Jun 2022",
      likes: 212,
      verified: true,
    },
    {
      id: "2",
      userPic: images.Bronwin,
      userName: "Bronwin Davidson",
      cardImage: images.mtn,
      cardTitle: "Manager Treasury Operations",
      cardDescription:
        "The Manager: Treasury Operations is responsible to implement and manage the centralised Treasury support function and operational process across the group to improve efficiencies and manage risk based on the approved Treasury Policy as amended from time to time.",
      location: "Bedfordview, Johannesburg",
      salary: "320 per day",
      timePeriod: "Today",
      likes: 652,
      verified: false,
    },
    {
      id: "3",
      userPic: images.James,
      userName: "James Abrahams",
      cardImage: images.netcare,
      cardTitle: "N17 Hospital Vacancies 2022-2023",
      cardDescription:
        "Netcare Careers 2022- As per the official website and Career24 Job portal published a notification to fill up the vacant position. All of the eligible candidates having the required qualification or experience as per the official notification criteria are eligible to apply for the vacant job of Confirmations Clerk positions For Gauteng Location.",
      location: "Pretoria, Johannesburg",
      salary: "2,310,000 annually",
      timePeriod: "14 October 2022",
      likes: 73,
      verified: true,
    },
    {
      id: "4",
      userPic: images.Julian,
      userName: "Julian Lukhele",
      cardImage: images.oldmutual,
      cardTitle: "Financial Adviser",
      cardDescription:
        "The role of a financial advisor is one that demands utmost professionalism, integrity and a customer-centric approach. An accredited financial advisor commands the respect and trust of those customers who are entrusting their and their families financial futures to them.",
      location: "Springs, Johannesburg",
      salary: "218 per hour",
      timePeriod: "18 September 2022",
      likes: 319,
      verified: false,
    },
    {
      id: "5",
      userPic: images.Michael,
      userName: "Michael Booison",
      cardImage: images.reactnative,
      cardTitle: "Mobile Developer",
      cardDescription:
        "Companies on OfferZen are looking for Mobile Developers with experience in React native to build apps on iOS and Android platforms. Ideal candidates will have experience in architecting and building mobile applications, and a strong team player.",
      location: "Kempton Park, Johannesburg",
      salary: "160 per hour",
      timePeriod: "1 July 2022",
      likes: 102,
      verified: false,
    },
    {
      id: "6",
      userPic: images.Nicole,
      userName: "Nicole Peterson",
      cardImage: images.sanlam,
      cardTitle: "Broker Consultant",
      cardDescription:
        "As an integral part of SanlamConnect Gauteng South Region, your primary focus will be to work with Brokers being the interface between themselves and SanlamConnect Gauteng South Region to reach business objectives in a dynamic, innovative and high performance business.",
      location: "Claremont, Cape Town",
      salary: "320 per day",
      timePeriod: "Tomorrow",
      likes: 87,
      verified: false,
    },
    {
      id: "7",
      userPic: images.Simon,
      userName: "Simon Baardman",
      cardImage: images.sasol,
      cardTitle: "Operator: Maintenance x 6",
      cardDescription:
        "This Maintenance Operator will be supporting the Maintenance Team by providing effective equipment maintenance assistance and reliability while adhering to procedures/codes, to increase stability and maintain sustainability of equipment.",
      location: "Waterfront, Cape Town",
      salary: "510 per day",
      timePeriod: "Today",
      likes: 7,
      verified: true,
    },
    {
      id: "8",
      userPic: images.Simphiwe,
      userName: "Nicole Peterson",
      cardImage: images.woolworths,
      cardTitle: "Senior Analyst Sales Performance",
      cardDescription:
        "To optimize sales opportunities through finding new growth possibilities and efficiencies in current sales waterfalls and processes. To create reporting mechanisms that highlight these and effectively communicate them to the sales force. In addition, it is also critical to be able to measure and communicate the impact of these optimization initiatives.",
      location: "North Beach, Durban",
      salary: "320 per day",
      timePeriod: "23 August 2022",
      likes: 45,
      verified: true,
    },
  ];

  //state hooks
  const [cards, setCards] = React.useState(cardsData);

  //card details
  function renderCardContent() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        style={{ marginVertical: SIZES.base, width: SIZES.width / 2 }}
        onPress={() => console.log("show full card modal")}
      >
        <ScrollView style={styles.cardContent}>
          <View style={styles.topSection}>
            <Image source={item.userPic} style={styles.userProfilePic} />
            <Text style={styles.topUsername}>
              {item.userName}{" "}
              {item.verified ? (
                <MaterialIcons name="verified" size={16} color="#3b5998" />
              ) : (
                ""
              )}
            </Text>
            <TouchableOpacity
              onPress={() => console.log("more option clicked")}
            >
              <Entypo
                name="dots-three-horizontal"
                size={18}
                color="gray"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomColor: COLORS.gray,
              borderBottomWidth: StyleSheet.hairlineWidth * 2,
              marginTop: -5,
              marginBottom: 10,
            }}
          />
          <View style={styles.oppSection}>
            <View style={styles.oppDetails}>
              {/* image section*/}
              <View>
                <Image source={item.cardImage} style={styles.oppPicture} />
                <Text style={styles.oppTitle} numberOfLines={1}>
                  {item.cardTitle}
                </Text>
              </View>

              {/* description section*/}
              <View>
                <Text style={styles.cardInfo} numberOfLines={3}>
                  {item.cardDescription}
                </Text>
              </View>

              {/* bottom section*/}
              <View>
                <View>
                  <Text style={styles.oppBottom}>
                    <View style={{ marginLeft: 11 }}>
                      <FontAwesome
                        name="map-marker"
                        size={15}
                        color={COLORS.white}
                      />
                    </View>
                    {item.location}
                  </Text>
                </View>
                <View>
                  <Text style={styles.oppBottom}>
                    <View style={{ marginLeft: 8 }}>
                      <FontAwesome
                        name="money"
                        size={12}
                        color={COLORS.white}
                      />
                    </View>
                    {item.salary}
                  </Text>
                </View>
                <View>
                  <Text style={styles.oppBottom}>
                    <View style={{ marginLeft: 8 }}>
                      <Ionicons
                        name="time-sharp"
                        size={14}
                        color={COLORS.white}
                      />
                    </View>
                    {item.timePeriod}
                  </Text>
                </View>
                <View>
                  <Text style={styles.oppBottom}>
                    <View style={{ marginLeft: 8 }}>
                      <FontAwesome
                        name="heart"
                        size={14}
                        color={COLORS.white}
                      />
                    </View>
                    {item.likes}
                  </Text>
                </View>
              </View>

              {/* share section*/}
              <View
                style={{
                  flexDirection: "row",
                  marginLeft: 220,
                }}
              >
                <TouchableOpacity
                  onPress={() => console.log("bookmark clicked")}
                >
                  <View style={{ marginLeft: 9, marginTop: -35 }}>
                    <Ionicons
                      name="bookmark-outline"
                      size={22}
                      color={COLORS.white}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log("share clicked")}>
                  <View style={{ marginLeft: 8, marginTop: -35 }}>
                    <Ionicons
                      name="share-outline"
                      size={22}
                      color={COLORS.white}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableOpacity>
    );

    return (
      <OptimizedFlatList
        data={cards}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: SIZES.padding * 3 }}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={<View style={{ marginBottom: 100 }}></View>}
      />
    );
  }

  //render component data for export
  return (
    <SafeAreaView style={styles.cardContainer}>
      {renderCardContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: "relative",
    marginTop: 10,
    height: "80%",
    backgroundColor: COLORS.black,
  },
  cardContent: {
    marginTop: 11,
    marginLeft: 10,
    width: 300,
    height: 440,
    borderRadius: 20,
    borderColor: COLORS.gray,
    borderWidth: 1,
    backgroundColor: COLORS.black,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: SIZES.padding + 4,
  },
  topUsername: {
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10,
    color: COLORS.white,
  },
  userProfilePic: {
    width: 60,
    height: 60,
    borderRadius: 200,
    borderColor: COLORS.lightBlue,
    borderWidth: 3,
    marginTop: -20,
    marginRight: -30,
    marginLeft: -20,
  },
  oppSection: {
    flex: 1,
  },
  oppDetails: {
    flex: 1,
    margin: 8,
    marginTop: -2,
  },
  oppPicture: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 10,
  },
  oppTitle: {
    fontFamily: "PoppinsBold",
    fontSize: 16,
    marginBottom: 5,
    color: COLORS.white,
  },
  cardInfo: {
    fontSize: 12,
    marginBottom: 10,
    fontSize: SIZES.body5,
    color: COLORS.white,
  },
  oppBottom: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
  },
});

export default OpportunityCard;
