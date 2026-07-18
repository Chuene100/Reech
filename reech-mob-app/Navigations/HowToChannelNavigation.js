import React, { useEffect, useState } from "react";
import { Text, View, useWindowDimensions, Platform } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";

//screens
import HowToChannelScreen from "../screens/howToScreens/HowToChannelScreen";
import ThoughtChannelScreen from "../screens/thoughtScreens/ThoughtChannelScreen";

//custom
import { COLORS } from "../constants";

export default function TabViewExample({ idx }) {
  const layout = useWindowDimensions();

  let route_idx = idx;

  const [index, setIndex] = useState(route_idx ?? 0);

  // Switch to the respective tab
  useEffect(() => {
    if (route_idx === 0) {
      setIndex(0);
    } else if (route_idx === 1) {
      setIndex(1);
    }
  }, [route_idx]);

  const [routes] = useState([
    { key: "first", title: "How To..." },
    { key: "second", title: "Thoughts" },
  ]);

  const FirstRoute = () => (
    <View>
      <HowToChannelScreen />
    </View>
  );

  const SecondRoute = () => (
    <View>
      <ThoughtChannelScreen />
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
        marginHorizontal: "20%",
        top: Platform.OS === "ios" ? 150 : 80,
        left: 0,
      }}
      renderLabel={({ route, focused, color }) => (
        <View
          style={{
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
          marginBottom: Platform.OS === "ios" ? "-295%" : "-230%",
        }}
      />
    </>
  );
}
