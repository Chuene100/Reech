import * as React from "react";
import { Text, View, useWindowDimensions, Platform } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { COLORS } from "../constants";
import {
  MainMessageScreen,
  NotificationMessageScreen,
  SupportMessageScreen,
} from "../screens";

const FirstRoute = () => (
  <MainMessageScreen />
);

const SecondRoute = () => {
  return (
    <View>
      <NotificationMessageScreen />
    </View>
  );
};

const ThirdRoute = () => {
  return (
    <View>
      <SupportMessageScreen />
    </View>
  );
};

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  third: ThirdRoute,
});

export default function TabViewExample() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Messages" },
    { key: "second", title: "Notifications" },
    { key: "third", title: "Support" },
  ]);

  const renderTabBar = (routes) => (
    <TabBar
      {...routes}
      indicatorStyle={{
        backgroundColor: "white",
      }}
      style={{
        backgroundColor: COLORS.transparent,
      }}
      renderLabel={({ route, focused, color }) => (
        <Text
          style={{
            color,
            margin: 8,
            fontSize: Platform.OS === "ios" ? 16 : 14,
            fontFamily: "PoppinsBold",
            width: "100%",
            textDecorationStyle: "solid",
          }}
        >
          {route.title}
        </Text>
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
        className={`flex flex-col h-full`}
      />
    </>
  );
}
