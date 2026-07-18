import * as React from "react";
import {
  ScrollView,
  Text,
  View,
  useWindowDimensions,
  Platform,
} from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";

import { VouchForPeopleScreen, VouchForPlacesScreen } from "../screens";

import { COLORS } from "../constants";

const FirstRoute = () => (
  <View>
    <VouchForPeopleScreen />
  </View>
);

const SecondRoute = () => (
  <View>
    <VouchForPlacesScreen />
  </View>
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

export default function TabViewExample() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "People" },
    { key: "second", title: "Places" },
  ]);

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
      renderLabel={({ route, focused, color }) => (
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
