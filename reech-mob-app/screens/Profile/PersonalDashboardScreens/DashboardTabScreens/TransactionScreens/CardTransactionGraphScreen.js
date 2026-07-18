import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Octicons } from "@expo/vector-icons";
import { LineChart } from "react-native-gifted-charts";

//custom
import { COLORS } from "../../../../../constants";
import { CustomPersonalDBHeader } from "../../../../../components";
import NavHeader from "@/components/Headers/NavHeader";

const CardTransactionGraphScreen = ({ route }) => {
  const { cardData } = route.params;

  function formatBalance(balance) {
    return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const formattedBalance = `${cardData?.currencySymbol ? cardData.currencySymbol : ""
    } ${formatBalance(cardData?.remainingBalance / 100)}`;

  const customDataPoint = () => {
    return (
      <View
        style={{
          width: 10,
          height: 10,
          backgroundColor: "white",
          borderWidth: 4,
          borderRadius: 10,
          borderColor: COLORS.white,
        }}
      />
    );
  };

  const customLabel = (val) => {
    return (
      <View style={{ width: 20, marginLeft: 40 }}>
        <Text style={{ color: "white", fontWeight: "bold" }}>{val}</Text>
      </View>
    );
  };

  //v2 graph data
  const data1 = [
    {
      value: 70,
      labelComponent: () => customLabel("19"),
      customDataPoint: customDataPoint,
    },
    {
      value: 36,
      labelComponent: () => customLabel("20"),
      customDataPoint: customDataPoint,
    },
    {
      value: 50,
      labelComponent: () => customLabel("21"),
      customDataPoint: customDataPoint,
    },
    {
      value: 40,
      labelComponent: () => customLabel("22"),
      customDataPoint: customDataPoint,
    },
    {
      value: 18,
      labelComponent: () => customLabel("23"),
      customDataPoint: customDataPoint,
    },
    {
      value: 38,
      labelComponent: () => customLabel("24"),
      customDataPoint: customDataPoint,
    },
  ];

  const data2 = [
    {
      value: 50,
      labelComponent: () => customLabel("19"),
      customDataPoint: customDataPoint,
    },
    {
      value: 10,
      labelComponent: () => customLabel("20"),
      customDataPoint: customDataPoint,
    },
    {
      value: 45,
      labelComponent: () => customLabel("21"),
      customDataPoint: customDataPoint,
    },
    {
      value: 30,
      labelComponent: () => customLabel("22"),
      customDataPoint: customDataPoint,
    },
    {
      value: 45,
      labelComponent: () => customLabel("23"),
      customDataPoint: customDataPoint,
    },
    {
      value: 18,
      labelComponent: () => customLabel("24"),
      customDataPoint: customDataPoint,
    },
    {
      value: 18,
      labelComponent: () => customLabel("25"),
      customDataPoint: customDataPoint,
    },
  ];

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.graphScreenHeader}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  //dashboard header section
  function renderDashboardHeaderSection() {
    return (
      <View style={styles.graphDashboardHeaderContainer}>
        <CustomPersonalDBHeader />
        <View style={styles.screenItemSeparator} />
      </View>
    );
  }

  //card details section
  function renderCardInfoContainerSection() {
    return (
      <View style={styles.cardBalanceInfoContainer}>
        <View style={styles.cardBalanceInfoContent}>
          <Text style={styles.cardBalanceInfoCardNameTextItem}>
            {cardData.name}
          </Text>
        </View>

        <View style={styles.cardBalanceInfoContent}>
          <Text style={styles.cardBalanceInfoCardBalanceTextItem}>
            {formattedBalance}
          </Text>
        </View>
      </View>
    );
  }

  //graph section
  function renderGraphLayoutSection() {
    return (
      <View style={styles.graphLayoutContainer}>
        <LineChart
          areaChart
          curved
          data={data1}
          data2={data2}
          hideDataPoints
          isAnimated
          hideYAxisText
          animationDuration={1200}
          maxValue={100}
          spacing={80}
          width={420}
          color1={COLORS.purple}
          color2={COLORS.teal}
          startFillColor1={COLORS.purple}
          startFillColor2={COLORS.teal}
          endFillColor1={COLORS.purple}
          endFillColor2={COLORS.teal}
          startOpacity={0.9}
          endOpacity={0.2}
          initialSpacing={-2}
          noOfSections={0}
          hideRules
          pointerConfig={{
            pointerStripUptoDataPoint: true,
            pointerStripColor: "lightgray",
            pointerStripWidth: 2,
            strokeDashArray: [2, 5],
            pointerColor: "lightgray",
            radius: 4,
            pointerLabelWidth: 100,
            pointerLabelHeight: 120,
            pointerLabelComponent: (items) => {
              return (
                <View style={styles.graphLabelContainer}>
                  {/*cost heading*/}
                  <View style={styles.graphLabelContent}>
                    <View style={styles.graphLabelHeadingInTextContainer}>
                      <Text style={styles.graphLabelHeadingTextItem}>
                        Incoming
                      </Text>
                    </View>

                    <View style={styles.graphLabelHeadingOutTextContainer}>
                      <Text style={styles.graphLabelHeadingTextItem}>
                        Outgoing
                      </Text>
                    </View>
                  </View>

                  {/*cost items*/}
                  <View style={styles.graphLabelContent}>
                    {/*incoming cost*/}
                    <View style={styles.graphLabelContentItems}>
                      <View style={styles.graphLabelIconContainer}>
                        <Octicons
                          name="dot-fill"
                          size={10}
                          color={COLORS.purple}
                        />
                      </View>

                      <View style={styles.graphLabelAmountContainer}>
                        <Text style={styles.graphLabelTextItem}>
                          {items[1].value}
                        </Text>
                      </View>
                    </View>

                    {/*outgoing cost*/}
                    <View style={styles.graphLabelContentItems}>
                      <View style={styles.graphLabelIconContainer}>
                        <Octicons
                          name="dot-fill"
                          size={10}
                          color={COLORS.teal}
                        />
                      </View>

                      <View style={styles.graphLabelAmountContainer}>
                        <Text style={styles.graphLabelTextItem}>
                          {items[1].value}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            },
          }}
        />
      </View>
    );
  }

  //screen content list
  function renderScreenContentList() {
    return (
      <>
        {renderHeaderSection()}
        {renderDashboardHeaderSection()}
        {renderCardInfoContainerSection()}
        {renderGraphLayoutSection()}
      </>
    );
  }

  return (
    <View style={styles.graphScreenContainer}>{renderScreenContentList()}</View>
  );
};

const styles = StyleSheet.create({
  graphScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //header section
  graphScreenHeader: {
    marginTop: Platform.OS === "ios" ? "10%" : 0,
  },
  graphDashboardHeaderContainer: {
    width: "100%",
    paddingHorizontal: 10,
    flexDirection: "column",
  },
  screenItemSeparator: {
    width: "100%",
    alignSelf: "center",
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 3,
    opacity: 0.4,
    marginBottom: 2.5,
  },

  //card balance info section
  cardBalanceInfoContainer: {
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  cardBalanceInfoContent: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  cardBalanceInfoCardNameTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  cardBalanceInfoCardBalanceTextItem: {
    color: COLORS.purple,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //graph layout section
  graphLayoutContainer: {
    width: "100%",
  },
  graphLabelContainer: {
    height: 60,
    width: 130,
    backgroundColor: COLORS.darkGray,
    borderRadius: 4,
    justifyContent: "center",
    paddingEnd: 10,
    paddingStart: 10,
  },
  graphLabelContent: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  graphLabelHeadingInTextContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  graphLabelHeadingOutTextContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  graphLabelHeadingTextItem: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: "PoppinsLight",
    opacity: 0.5,
  },
  graphLabelContentItems: {
    width: "56%",
    right: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  graphLabelIconContainer: {
    width: "10%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  graphLabelAmountContainer: {
    width: "auto",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  graphLabelTextItem: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: "PoppinsBold",
  },
});

export default CardTransactionGraphScreen;
