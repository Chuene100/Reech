import * as React from "react";
import { Text, View, useWindowDimensions, Platform } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";

import {
  QualificationExpScreen,
  ProjectsExpScreen,
  WorkExpScreen,
  EventsExpScreen,
  ExperienceTimelineExpScreen,
  HowToExpScreen,
  SkillSetExpScreen,
} from "../screens";

//custom
import { COLORS } from "../constants";

export default function TabViewExample({ Feed }) {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "What qualifies me" },
    { key: "second", title: "What I'm working on" },
    { key: "third", title: "Where I've worked" },
    { key: "fourth", title: "Events & Conferences" },
    { key: "fifth", title: "How-to" },
    { key: "sixth", title: "My bloopers" },
    { key: "seventh", title: "Thoughts" },
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
              textDecorationStyle: "solid",
            }}
          >
            {route.title}
          </Text>
        </View>
      )}
    />
  );

  const FirstRoute = () => (
    <View>
      <QualificationExpScreen Feed={Feed} />
    </View>
  );

  const SecondRoute = () => (
    <View>
      <ProjectsExpScreen Feed={Feed} />
    </View>
  );

  const ThirdRoute = () => (
    <View>
      <WorkExpScreen Feed={Feed} />
    </View>
  );

  const FourthRoute = () => (
    <View>
      <EventsExpScreen Feed={Feed} />
    </View>
  );

  const FifthRoute = () => (
    <View>
      <HowToExpScreen Feed={Feed} />
    </View>
  );

  const SixthRoute = () => (
    <View>
      <SkillSetExpScreen Feed={Feed} />
    </View>
  );

  const SeventhRoute = () => (
    <View>
      <ExperienceTimelineExpScreen Feed={Feed} />
    </View>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    fourth: FourthRoute,
    fifth: FifthRoute,
    sixth: SixthRoute,
    seventh: SeventhRoute,
  });

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
          marginTop: Platform.OS === "ios" ? "30%" : "-10%",
          marginBottom: "0%",
        }}
      />
    </>
  );
}
