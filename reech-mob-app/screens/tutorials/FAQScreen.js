import React from "react";
import { FlatList, StyleSheet, View, Text, Platform } from "react-native";
import { SimpleAccordion } from "react-native-simple-accordion";

//import customs
import { faqContentItems } from "../../assets/data/reechInfoData";
import { COLORS } from "../../constants";
import NavHeader from "@/components/Headers/NavHeader";

const FAQScreen = () => {
  //header section
  function renderHeaderComponent() {
    return (
      <View style={styles.headerComponentContainer}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.content}>
        <Text style={styles.headingText}>Frequently asked questions</Text>
      </View>
    );
  }

  function renderFAQContent() {
    const renderItem = ({ item }) => (
      <View style={styles.faqContainer}>
        <SimpleAccordion
          title={item.title}
          bannerStyle={styles.bannerStyle}
          showArrows={true}
          arrowColor={styles.arrowColor}
          titleStyle={styles.faqTextStyle}
          viewContainerStyle={styles.viewContainerStyle}
          viewInside={
            <View style={styles.faqTextContainer}>
              <Text style={styles.faqTextItem}>{item.content}</Text>
            </View>
          }
        />
      </View>
    );
    return (
      <FlatList
        ListHeaderComponent={<View style={styles.flatlistHeader}></View>}
        data={faqContentItems}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        numbColumns={1}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ marginBottom: "10%" }}></View>}
      />
    );
  }

  return (
    <View style={styles.container}>
      {renderHeaderComponent()}
      {renderHeaderSection()}
      {renderFAQContent()}
    </View>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerComponentContainer: {
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  //header text
  content: {
    marginTop: 20,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  headingText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //faq collection
  faqContainer: {
    flex: 1,
    margin: 15,
  },
  flatlistHeader: {
    flex: 1,
  },
  bannerStyle: {
    borderWidth: 3,
    borderRadius: 30,
    backgroundColor: COLORS.purpleDark,
  },
  arrowColor: {
    color: COLORS.black,
  },
  faqTextStyle: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  faqTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: COLORS.reechGray,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "102%",
  },
  faqTextItem: {
    fontSize: 12,
    fontFamily: "PoppinsLight",
    color: COLORS.white,
  },
  viewContainerStyle: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
});

export default FAQScreen;
