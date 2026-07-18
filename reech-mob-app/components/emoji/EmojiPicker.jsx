import React, { useState, memo } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { TabView } from "react-native-tab-view";

import categories from "../../assets/data/emojiData/emojiCategories";

import EmojiCategory from "./EmojiCategory";
import EmojiTabBar from "./EmojiTabBar";

const EmojiPicker = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState(
    categories.tabs.map((tab) => ({ key: tab.category, title: tab.tabLabel }))
  );

  const renderScene = ({ route }) => <EmojiCategory category={route.key} />;

  return (
    <TabView
      renderTabBar={(props) => <EmojiTabBar setIndex={setIndex} {...props} />}
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      initialLayout={{ width: layout.width }}
    />
  );
};

export default memo(EmojiPicker);
