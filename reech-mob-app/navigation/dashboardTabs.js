import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Text,
} from "react-native";
import {
  createBottomTabNavigator,
  BottomTabBar,
} from "@react-navigation/bottom-tabs";
import { isIphoneX } from "react-native-iphone-x-helper";
import Svg, { Path } from "react-native-svg";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";

//custom
import { COLORS } from "../constants";

//import screens
import {
  ActivityDashboardScreen,
  MySafetyScreen,
  MyRewardsScreen,
  WalletScreen,
  WishlistScreen,
} from "../screens";

//define bottom tab nav
const Tab = createBottomTabNavigator();

const TabBarCustomButton = ({ accessibilityState, children, onPress }) => {
  var isSelected = accessibilityState.selected;

  if (isSelected) {
    return (
      <View style={styles.isSelectedContainer}>
        <View style={styles.isSelectedContent}>
          <View style={styles.svgSpacer}></View>
          <Svg width={100} height={100} viewBox="0 0 75 61">
            <Path
              d="M75.2 0v61H0V0c4.1 0 7.4 3.1 7.9 7.1C10 21.7 22.5 33 37.7 33c15.2 0 27.7-11.3 29.7-25.9.5-4 3.9-7.1 7.9-7.1h-.1z"
              fill={COLORS.black}
            />
          </Svg>
          <View style={styles.svgSpacer}></View>
        </View>

        <TouchableOpacity
          style={styles.isSelectedTouchContainer}
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
    return (
      <View style={[{ paddingBottom: 5, backgroundColor: COLORS.black }]}>
        <BottomTabBar {...props.props} />
      </View>
    );
  }
};

{
  /* declare tabs */
}
const DashboardTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar props={props} />}
    >
      <Tab.Screen
        name="Activity"
        component={ActivityDashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIconContainer}>
              <AntDesign
                name="piechart"
                size={20}
                color={focused ? COLORS.purple : COLORS.white}
              />
              <Text style={styles.tabIconTextItem}>Activity</Text>
            </View>
          ),
          tabBarButton: (props) => <TabBarCustomButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIconContainer}>
              <Ionicons
                name="wallet-outline"
                size={20}
                color={focused ? COLORS.purple : COLORS.white}
              />
              <Text style={styles.tabIconTextItem}>Wallet</Text>
            </View>
          ),
          tabBarButton: (props) => <TabBarCustomButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIconContainer}>
              <Feather
                name="star"
                size={20}
                color={focused ? COLORS.purple : COLORS.white}
              />
              <Text style={styles.tabIconTextItem}>Wishlist</Text>
            </View>
          ),
          tabBarButton: (props) => <TabBarCustomButton {...props} />,
        }}
      />
      <Tab.Screen
        name="My Safety"
        component={MySafetyScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIconContainer}>
              <MaterialCommunityIcons
                name="alarm-light-outline"
                size={20}
                color={focused ? COLORS.purple : COLORS.white}
              />
              <Text style={styles.tabIconTextItem}>My Safety</Text>
            </View>
          ),
          tabBarButton: (props) => <TabBarCustomButton {...props} />,
        }}
      />
      <Tab.Screen
        name="My Rewards"
        component={MyRewardsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIconContainer}>
              <SimpleLineIcons
                name="present"
                size={20}
                color={focused ? COLORS.purple : COLORS.white}
              />
              <Text style={styles.tabIconTextItem}>My Rewards</Text>
            </View>
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
    backgroundColor: COLORS.black,
  },
  isSelectedContent: {
    flexDirection: "row",
    position: "absolute",
    backgroundColor: COLORS.black,
  },
  svgSpacer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  isSelectedTouchContainer: {
    top: Platform.OS === "ios" ? 15 : 11,
    justifyContent: "center",
    alignItems: "center",
    width: 95,
    height: Platform.OS === "ios" ? 48 : 38,
  },
  isSelectedItems: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 95,
    backgroundColor: COLORS.black,
    marginBottom: Platform.OS === "ios" ? -30 : -10,
  },
  iosTabBarContainerSpacer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 0,
    backgroundColor: COLORS.black,
  },

  //tab icon section
  tabIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  tabIconTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
});

export default DashboardTabs;
