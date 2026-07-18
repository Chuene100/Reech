import React from "react";
import { StyleSheet, View, Image, TouchableOpacity, Platform } from "react-native";
import { createBottomTabNavigator, BottomTabBar } from "@react-navigation/bottom-tabs";
import { isIphoneX } from "react-native-iphone-x-helper";
import { useSelector } from "react-redux";

//import dependencies
import { COLORS, icons, images } from "../constants";

//import screens
import {
  ChatroomScreen,
  HomeScreen,
  BubbleScreen,
  PostOpScreen,
  LoggedInAccountUserScreen,
} from "../screens";

//define bottom tab nav
const Tab = createBottomTabNavigator();

const TabBarCustomButton = ({
  accessibilityState,
  children,
  onPress,
}) => {
  const isSelected = accessibilityState.selected;

  if (isSelected) {
    return (
      <View style={styles.isSelectedContainer}>
        <TouchableOpacity
          style={[styles.isSelectedTouchContainer]}
          onPress={onPress}
        >
          {children}
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <TouchableOpacity
        style={styles.isSelectedItems}
        activeOpacity={1}
        onPress={onPress}
      >
        {children}
      </TouchableOpacity>
    );
  }
};

{
  /* custom tab bar style for iOS */
}
const CustomTabBar = (props) => {
  if (isIphoneX()) {
    return (
      <View>
        <View style={styles.iosTabBarContainerSpacer}></View>
        <BottomTabBar {...props.props} />
      </View>
    );
  } else {
    return <BottomTabBar {...props.props} />;
  }
};

{
  /* declare tabs */
}
const Tabs = () => {
  const user = useSelector((state) => state.user.current_user);
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: "rgba(0,0,0, 0.7)",
        },
      }}
      tabBar={(props) => <CustomTabBar props={props} />}
    >
      <Tab.Screen
        name="Welcome"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? icons.homeActive : icons.homeIcon}
              style={focused ? styles.customIconFocused : styles.customIcon}
              resizeMode="contain"
            />
          ),
          tabBarButton: (props) => <TabBarCustomButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Bubble"
        component={BubbleScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? icons.bubbleActive : icons.bubbleIcon}
              style={focused ? styles.customIconFocused : styles.customIcon}
              resizeMode="contain"
            />
          ),
          tabBarButton: (props) => <TabBarCustomButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatroomScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? icons.chatActive : icons.chatIcon}
              style={focused ? styles.customIconFocused : styles.customIcon}
              resizeMode="contain"
            />
          ),
          tabBarButton: (props) => <TabBarCustomButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Post"
        component={PostOpScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? icons.howToActive : icons.howToIcon}
              style={focused ? styles.customIconFocused : styles.customIcon}
              resizeMode="contain"
            />
          ),
          tabBarButton: (props) => <TabBarCustomButton {...props} />,
        }}
      />
      <Tab.Screen
        name=" "
        component={LoggedInAccountUserScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            //show icon or profile picture

            <Image
              source={
                user?.profileImage
                  ? { uri: user?.profileImage }
                  : images.defaultRounded
              }
              style={focused ? styles.customImageFocused : styles.customImage}
              resizeMode="cover"
            />
          ),
          tabBarButton: (props) => <TabBarCustomButton {...props} />,
        }}
      />
    </Tab.Navigator>
  );
};

{
  /* custom styles*/
}
const styles = StyleSheet.create({
  //is selected
  isSelectedContainer: {
    flex: 1,
    alignItems: "center",
  },
  isSelectedTouchContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 85,
    height: 50,
    borderRadius: 50,
    borderTopWidth: 2,
    borderColor: COLORS.purple,
  },
  isSelectedItems: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    marginBottom: Platform.OS === "ios" ? -30 : 0,
  },
  iosTabBarContainerSpacer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 0,
  },

  //miscellaneous
  customIconFocused: {
    width: "35%",
    height: 80,
    maxWidth: 100,
    maxHeight: 80,
  },
  customIcon: {
    width: "35%",
    height: 80,
    maxWidth: 100,
    maxHeight: 80,
    marginTop: Platform.OS === "ios" ? -20 : 0,
  },
  customImageFocused: {
    top: Platform.OS === "ios" ? 5 : -2,
    width: 33,
    height: 33,
    borderRadius: 8,
    borderColor: COLORS.purple,
    borderWidth: 2,
  },
  customImage: {
    top: -3,
    width: 33,
    height: 33,
    borderRadius: 8,
    marginTop: Platform.OS === "ios" ? -10 : 5,
  },
  inActive: {
    marginTop: Platform.OS === "ios" ? -15 : 0,
  },
  active: {
    marginTop: 0,
  },
});

export default Tabs;
