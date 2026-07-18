import * as React from "react";
import { Text, View, useWindowDimensions, Platform } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";

//screens
import NowOpportunityCardsScreen from "../screens/homeScreenFullView/HomeScreenToggler/NowOpportunityCardsScreen";
import LaterOpportunityCardsScreen from "../screens/homeScreenFullView/HomeScreenToggler/LaterOpportunityCardsScreen";

//custom
import { COLORS } from "../constants";

export default function OpportunityCardsNavigation() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: "first", title: "Now" },
    { key: "second", title: "Later" },
  ]);

  const FirstRoute = () => (
    <View>
      <NowOpportunityCardsScreen />
    </View>
  );

  const SecondRoute = () => (
    <View>
      <LaterOpportunityCardsScreen />
    </View>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const renderTabBar = (routes) => (
    <TabBar
      {...routes}
      indicatorStyle={{
        backgroundColor: COLORS.white,
        marginBottom: 5,
      }}
      style={{
        backgroundColor: COLORS.transparent,
      }}
      renderLabel={({ route, color }) => (
        <View
          style={{
            flex: 1,
            marginBottom: 10,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              color,
              fontSize: Platform.OS === "ios" ? 16 : 14,
              fontFamily: "PoppinsBold",
              width: "100%",
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
          flex: 1,
          marginTop: Platform.OS === "ios" ? "-15%" : "-8%",
          marginBottom: "-200%",
        }}
      />
    </>
  );
}
