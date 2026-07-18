import React, { memo } from "react";
import { FlatList, Dimensions, StyleSheet } from "react-native";

import Emoji from "./Emoji";
import { emojisByCategory } from "../../assets/data/emojiData/emojis";
import { COLORS } from "../../constants";

const EmojiCategory = ({ category }) => {
  return (
    <FlatList
      data={emojisByCategory[category]}
      renderItem={({ item }) => <Emoji item={item} />}
      keyExtractor={(item) => item}
      numColumns={9}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default memo(EmojiCategory);
