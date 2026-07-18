import * as React from "react";
import { Text, View, useWindowDimensions, Platform } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";

import {
  IncomingGraphScreen,
  OutgoingGraphScreen,
  DepositGraphScreen,
  RetirementGraphScreen,
  SavingsGraphScreen,
} from "../screens";

import { COLORS } from "../constants";

{
  /*
  Commented out navigation links will be added on the next release, don't remove, still waiting for the screen designs 
*/
}

const FirstRoute = () => (
  <View>
    <IncomingGraphScreen />
  </View>
);

const SecondRoute = () => (
  <View>
    <OutgoingGraphScreen />
  </View>
);

const ThirdRoute = () => (
  <View>
    <DepositGraphScreen />
  </View>
);

// const ThirdRoute = () => (
//   <View>
//     <RetirementGraphScreen />
//   </View>
// );

// const FourthRoute = () => (
//   <View>
//     <SavingsGraphScreen />
//   </View>
// );

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  third: ThirdRoute,
  // third: ThirdRoute,
  // fourth: FourthRoute,
});

export default function TabViewExample() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Incoming" },
    { key: "second", title: "Outgoing" },
    { key: "third", title: "Deposit" },
    // { key: "third", title: "Retirement" },
    // { key: "fourth", title: "Savings" },
  ]);

  const renderTabBar = (routes) => (
    <TabBar
      scrollEnabled={true}
      {...routes}
      indicatorStyle={{
        backgroundColor: "white",
        marginBottom: 5,
      }}
      style={{
        marginHorizontal: 30,
        backgroundColor: COLORS.transparent,
      }}
      renderLabel={({ route, focused, color }) => (
        <View
          style={{
            marginTop: 20,
            marginBottom: 10,
            justifyContent: "flex-start",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              color,
              fontSize: Platform.OS === "ios" ? 16 : 14,
              fontFamily: "PoppinsBold",
              textDecorationStyle: "solid",
            }}
          >
            {route.title}
          </Text>
        </View>
      )}
    />
  );

  return (
    <>
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        activeColor={COLORS.black}
        inactiveColor={COLORS.white}
        style={{
          marginTop: Platform.OS === "ios" ? "-12%" : "-10%",
          marginBottom: "0%",
          left: Platform.OS === "ios" ? 0 : 0,
          width: "100%",
        }}
      />
    </>
  );
}
