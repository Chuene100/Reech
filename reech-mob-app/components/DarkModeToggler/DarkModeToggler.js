import React, { useState, useContext } from "react";
import { View, Switch, StyleSheet } from "react-native";
import { EventRegister } from "react-native-event-listeners";

//import custom
import { themeContext } from "../../constants";

const DarkModeToggler = () => {
  const theme = useContext(themeContext);
  const [mode, setMode] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Switch
        value={mode}
        onValueChange={(value) => {
          setMode((value) => !value);
          EventRegister.emit("changeTheme", value);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DarkModeToggler;
