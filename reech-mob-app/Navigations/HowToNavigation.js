import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  useWindowDimensions,
  StyleSheet,
  Platform,
} from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";

//screens
import { HowToTutorialsScreen, ThoughtsScreen } from "../screens";

//customs
import { COLORS } from "../constants";

export default function HowToNavigation({ idx }) {
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
      <HowToTutorialsScreen />
    </View>
  );

  const SecondRoute = () => {
    return (
      <View>
        <ThoughtsScreen />
      </View>
    );
  };

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const renderTabBar = (routes) => (
    <TabBar
      {...routes}
      indicatorStyle={styles.indicatorStyle}
      style={styles.tabBarMainStyle}
      renderLabel={({ route, focused, color }) => (
        <Text style={[styles.tabLabelStyle, color]}>{route.title}</Text>
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
        style={styles.tabViewStyle}
      />
    </>
  );
}

const styles = StyleSheet.create({
  indicatorStyle: {
    width: "3%",
    marginLeft: "17%",
    backgroundColor: COLORS.white,
  },
  tabBarMainStyle: {
    top: Platform.OS === "ios" ? 180 : 115,
    marginHorizontal: "20%",
    backgroundColor: COLORS.transparent,
    shadowColor: COLORS.transparent,
  },
  tabLabelStyle: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  tabViewStyle: {
    marginTop: Platform.OS === "ios" ? "-25%" : "-23%",
    zIndex: 9,
  },
});
