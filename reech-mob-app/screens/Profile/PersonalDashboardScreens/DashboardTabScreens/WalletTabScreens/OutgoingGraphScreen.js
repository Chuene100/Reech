import React from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";

//customs
import { COLORS } from "../../../../../constants";

const OutgoingGraphScreen = () => {
  const { width } = useWindowDimensions();

  //chart data
  const incomingData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        data: [300, 740, 653, 523],
      },
    ],
  };

  const chartConfig = {
    decimalPlaces: 0,
    color: () => COLORS.brown,
    labelColor: () => COLORS.darkGray,
    fillShadowGradient: COLORS.brown,
    fillShadowGradientOpacity: 1,
    backgroundColor: COLORS.transparent,
    backgroundGradientFrom: COLORS.transparent,
    backgroundGradientTo: COLORS.transparent,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: COLORS.transparent,
    },
  };

  return (
    <View style={styles.incomingContainer}>
      <Text style={styles.incomingHeader}>
        {" "}
        Payment Made{"\n"}November 2022
      </Text>

      {/*graph display*/}
      <BarChart
        data={incomingData}
        chartConfig={chartConfig}
        yAxisLabel="R"
        verticalLabelRotation={0}
        horizontalLabelRotation={0}
        showBarTops={true}
        showValuesOnTopOfBars={true}
        fromZero={true}
        width={width - 50}
        height={Platform.OS === "ios" ? 250 : 180}
        withInnerLines={false}
        style={{
          marginVertical: 18,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

export default OutgoingGraphScreen;

const styles = StyleSheet.create({
  incomingContainer: {
    top: Platform.OS === "ios" ? 30 : 10,
    left: Platform.OS === "ios" ? 63 : 65,
    width: Platform.OS === "ios" ? "78%" : "74%",
    height: "80%",
    padding: Platform.OS === "ios" ? 20 : 0,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: COLORS.darkGray,
  },
  incomingHeader: {
    top: 5,
    alignSelf: "center",
    color: COLORS.darkGray,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
});
