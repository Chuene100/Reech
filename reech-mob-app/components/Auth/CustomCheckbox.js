import React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { COLORS } from "../../constants";

const CustomCheckbox = (props) => {
  const iconName = props.isChecked ? "checkcircle" : "checkcircleo";

  return (
    <View style={styles.container}>
      <Pressable onPress={props.onPress}>
        <AntDesign name={iconName} size={20} color={COLORS.darkGray} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
  },
});

export default CustomCheckbox;
