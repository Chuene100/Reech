import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  Platform,
} from "react-native";
import { useForm } from "react-hook-form";
import {
  AntDesign,
  Entypo,
  FontAwesome5,
  FontAwesome,
  Fontisto,
  MaterialIcons,
} from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";

//custom
import { COLORS, SIZES } from "../../constants";
import { CustomSortAndFilterLocation } from "../../components";
import DropDown from "../UI/DropDown";
import { experience } from "@/assets/data/dropDownData";

function SortRow({ title, message, icon, field, sort, onSortBy }) {
  return (
    <TouchableOpacity
      onPress={() => onSortBy(field)}
      style={[
        styles.sortItem,
        sort?.field === field
          ? { backgroundColor: COLORS.purple, color: COLORS.white }
          : {},
      ]}
    >
      <View style={styles.sortIcon}>
        <icon.component
          name={icon.name}
          size={18}
          color={sort?.field === field ? COLORS.white : COLORS.purple}
        />
      </View>
      <View style={styles.sortTextContainer}>
        <Text style={styles.sortTextHeading}>{title}</Text>
        <Text
          style={[
            styles.sortTextInfo,
            sort?.field === field ? { color: COLORS.white } : {},
          ]}
        >
          {message}
        </Text>
      </View>
      {sort?.field === field && (
        <View style={styles.sortIcon}>
          <AntDesign
            name={sort.direction > 0 ? "arrowdown" : "arrowup"}
            size={18}
            color={COLORS.white}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

const SortAndFilter = ({ sort, onSort, onFilter }) => {
  //form control: validate
  const {
    control,
    handleSubmit,
    reset
  } = useForm();

  const job_category_list = useSelector((state) => state.job_title.job_titles);

  const [sortModal, setSortModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);

  ///---------Sorting--------
  const onSortBy = (field) => {
    onSort({
      field,
      direction: 1,
    });
    setSortModal(false);
  };

  ///---------Filtering-------
  const onFilterBy = (data) => {
    const curr = {
      ...data,
      experience: data?.experience?.value,
      jobCategoryId: data?.jobCategoryId?._id,
      address: data.address ? data?.address?.split("|")[0] : undefined,
    };
    onFilter({
      filter: curr,
    });

    reset({
      address: undefined,
      experience: undefined,
      jobCategoryId: undefined,
    });
    setFilterModal(false);
  };

  return (
    <View style={styles.headerFilterSectionContainer}>
      {/*sort section*/}
      <View style={styles.headerFilterContent}>
        <Text style={styles.headerFilterText}>
          <FontAwesome name={"unsorted"} size={14} color={COLORS.white} />
          {"  "}
          Sort
        </Text>
        <TouchableOpacity onPress={() => setSortModal(true)}>
          <Entypo name={"chevron-down"} size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/*filter section*/}
      <View style={styles.headerFilterContent}>
        <Text style={styles.headerFilterText}>
          <FontAwesome5 name={"filter"} size={14} color={COLORS.white} />
          {"  "}Filter
        </Text>
        <TouchableOpacity onPress={() => setFilterModal(true)}>
          <Entypo name={"chevron-down"} size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/*sort modal*/}
      <Modal
        visible={sortModal}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        style={styles.modalSortContainer}
        onRequestClose={() => handleSubmit(setSortModal(false))}
      >
        <View style={styles.innerSortModalContainer}>
          {/*modal close action*/}
          <View
            style={[styles.innerSortModalHeader, { justifyContent: "center" }]}
          >
            <Pressable onPress={() => handleSubmit(setSortModal(false))}>
              <AntDesign name="closecircle" size={20} color={COLORS.white} />
            </Pressable>
          </View>
          <View style={styles.modalLiner}></View>

          {/*options section*/}
          <View style={styles.moreOptionContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps={true}

              nestedScrollEnabled={true}
              style={styles.moreOptionContent}
            >
              <SortRow
                title="By date"
                message="Most recent or oldest"
                icon={{ name: "calendar", component: AntDesign }}
                field="createdAt"
                onSortBy={onSortBy}
                sort={sort}
              />

              <SortRow
                title="Experience level"
                message="Sort list using job experiences: 2 years"
                icon={{ name: "home-work", component: MaterialIcons }}
                field="experience"
                onSortBy={onSortBy}
                sort={sort}
              />

              <SortRow
                title="Education Level"
                message="Sort list using education level"
                icon={{ name: "network-wired", component: FontAwesome5 }}
                field="educationLevel"
                onSortBy={onSortBy}
                sort={sort}
              />

              <SortRow
                title="Location"
                message="Sort using card locations: South Africa"
                icon={{ name: "location", component: Entypo }}
                field="address"
                onSortBy={onSortBy}
                sort={sort}
              />

              <SortRow
                title="Title"
                message="Sort using job titles: Engineering"
                icon={{ name: "subtitles", component: MaterialIcons }}
                field="jobTitle"
                onSortBy={onSortBy}
                sort={sort}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/*filter modal*/}
      <Modal
        visible={filterModal}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        style={styles.modalSortContainer}
        onRequestClose={() => handleSubmit(setFilterModal(false))}
      >
        {/*close section*/}
        <View style={styles.innerSortModalContainer}>
          {/*sort action*/}
          <View style={styles.innerSortModalHeader}>
            {/*close action*/}
            <Pressable
              style={{
                left: Platform.OS === "ios" ? 170 : 140,
                alignItems: "center",
              }}
              onPress={() => handleSubmit(setFilterModal(false))}
            >
              <AntDesign name="closecircle" size={18} color={COLORS.white} />
            </Pressable>

            {/*filter collection action*/}
            <View style={styles.filterButton}>
              <Pressable
                onPress={handleSubmit(onFilterBy)}
                style={styles.filterContainer}
              >
                <LinearGradient
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  colors={[
                    COLORS.purpleDarker,
                    COLORS.purpleDark,
                    COLORS.purple,
                  ]}
                  style={styles.filterGradientContainer}
                >
                  <Text style={styles.filterTextItem}>Apply Filters</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
          <View style={styles.modalLiner}></View>

          {/*options section*/}
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps='handled'
            style={[
              styles.moreOptionContent,
              { marginBottom: Platform.OS === "ios" ? 20 : 0 },
            ]}
          >
            {/*experience option*/}
            <View style={[styles.sortItem, { marginTop: 30, zIndex: -99 }]}>
              <View style={[styles.sortIcon, { marginTop: -50 }]}>
                <MaterialIcons
                  name="home-work"
                  size={18}
                  color={COLORS.purple}
                />
              </View>
              <View style={styles.sortTextContainer}>
                <Text style={styles.sortTextHeading}>Experience level</Text>
                <Text style={styles.sortTextInfo}>
                  Filter using experience level
                </Text>
                <View>
                  <DropDown
                    control={control}
                    data={experience}
                    name="experience"
                    textAlign={'center'}
                    iconColor={'purple'}
                    rowText={'name'}
                  />
                </View>
              </View>
            </View>

            {/*location option*/}
            <View style={[styles.sortItem, { marginTop: 45, zIndex: 99 }]}>
              <View style={styles.sortIcon}>
                <Entypo name="location" size={18} color={COLORS.purple} />
              </View>

              <View style={[styles.sortTextContainer, { zIndex: 99 }]}>
                <Text style={styles.sortTextHeading}>Location</Text>
                <Text style={styles.sortTextInfo}>
                  Filter using opportunity locations
                </Text>

                {/*location component*/}
                <View style={styles.locationComponentContainer}>
                    <CustomSortAndFilterLocation
                      name="address"
                      control={control}
                      placeholder="State, Country"
                    />
                </View>
              </View>
            </View>

            {/*rate option*/}
            <View style={[styles.sortItem, { marginTop: 50, zIndex: -99 }]}>
              <View style={[styles.sortIcon, { marginTop: -45 }]}>
                <Fontisto name="money-symbol" size={18} color={COLORS.purple} />
              </View>
              <View style={styles.sortTextContainer}>
                <Text style={styles.sortTextHeading}>Rate</Text>
                <Text style={styles.sortTextInfo}>High to low</Text>
                <View style={styles.rateOptionContainer}>
                  {/*high*/}
                  <Pressable
                    onPress={() => onFilterBy({ ratePerHour: { $gte: 150 } })}
                    style={styles.rateFrequency}
                  >
                    <LinearGradient
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      colors={[
                        COLORS.purpleDarker,
                        COLORS.purpleDark,
                        COLORS.purple,
                      ]}
                      style={styles.filterGradientContainer}
                    >
                      <Text style={styles.rateOptionText}>High</Text>
                    </LinearGradient>
                  </Pressable>

                  {/*low*/}
                  <Pressable
                    onPress={() => onFilterBy({ ratePerHour: { $lte: 150 } })}
                    style={styles.rateFrequency}
                  >
                    <LinearGradient
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      colors={[
                        COLORS.purpleDarker,
                        COLORS.purpleDark,
                        COLORS.purple,
                      ]}
                      style={styles.filterGradientContainer}
                    >
                      <Text style={styles.rateOptionText}>Low</Text>
                    </LinearGradient>
                  </Pressable>
                </View>
              </View>
            </View>

            {/*Industry option*/}
            <View style={[styles.sortItem, { marginTop: 50, zIndex: -99 }]}>
              <View style={[styles.sortIcon, { marginTop: -60 }]}>
                <FontAwesome5
                  name="network-wired"
                  size={18}
                  color={COLORS.purple}
                />
              </View>
              <View style={styles.sortTextContainer}>
                <Text style={styles.sortTextHeading}>Job category</Text>
                <Text style={styles.sortTextInfo}>
                  Filter using job category
                </Text>
                <View style={styles.industryCOntainer}>
                  <DropDown
                    control={control}
                    name="jobCategoryId"
                    data={job_category_list}
                    textAlign={'center'}
                    iconColor={'purple'}
                    rowText={'jobCategory'}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  //filter section
  headerFilterSectionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "8%",
    height: 40,
  },
  headerFilterContent: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: SIZES.padding,
    paddingHorizontal: SIZES.padding,
    paddingVertical: "1%",
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerFilterText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  filterTextContainer: {
    flexGrow: 1,
    flexDirection: "column",
    maxWidth: "85%",
  },

  //sort modal
  modalSortContainer: {
    height: "50%",
    marginTop: 10,
  },
  innerSortModalContainer: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? "35%" : "25%",
    padding: "4%",
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    backgroundColor: COLORS.black,
  },
  innerSortModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "10%",
    width: "100%",
    paddingHorizontal: Platform.OS === "ios" ? 0 : 10,
  },
  modalLiner: {
    alignSelf: "center",
    width: "40%",
    marginTop: "2.5%",
    marginBottom: "5%",
    borderRadius: 20,
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 3,
  },
  sortContainer: {
    flex: 1,
  },
  sortContent: {
    flexDirection: "column",
  },
  moreOptionContainer: {
    flexDirection: "column",
  },
  moreOptionContent: {
    height: "auto",
    backgroundColor: COLORS.transparent,
    marginBottom: 40,
  },
  sortItem: {
    top: 0,
    marginBottom: "5%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    height: 50,
  },
  sortItem2: {
    top: 50,
    marginBottom: "5%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    height: 50,
  },
  sortItem3: {
    top: 80,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    height: 50,
  },
  sortIcon: {
    paddingHorizontal: 8,
  },
  sortTextContainer: {
    flexGrow: 1,
    flexDirection: "column",
    maxWidth: "85%",
  },
  sortTextHeading: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  sortTextInfo: {
    marginTop: 5,
    color: COLORS.darkGray,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  locationComponentContainer: {
    top: 5,
    height: 60
  },

  dateOptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    top: 15,
  },
  dateOption: {
    overflow: "hidden",
    width: "45%",
    padding: 15,
    backgroundColor: COLORS.purple,
    borderRadius: 10,
  },
  dateOptionText: {
    alignSelf: "center",
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  rateOptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    top: 8,
  },
  rateFrequency: {
    overflow: "hidden",
    width: "45%",
    borderRadius: 10,
  },
  rateOptionText: {
    alignSelf: "center",
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  industryCOntainer: {},

  ////Added this for the filter button
  filterButton: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 30 : 0,
    marginBottom: Platform.OS === "ios" ? 10 : 0,
    width: "40%",
  },
  filterContainer: {
    width: "100%",
    zIndex: 10,
  },
  filterGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    height: 35,
    width: "100%",
  },
  filterTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
});

export default SortAndFilter;
