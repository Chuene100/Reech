import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { Controller } from "react-hook-form";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons } from "@expo/vector-icons";

//import dependencies
import { COLORS } from "../constants";

const CustomLocation = ({
  control,
  name,
  rules = {},
  placeholder,
  invalue,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({
        field: { onChange, onBlur },
        fieldState: { error },
      }) => (
        <>
          <SafeAreaView
            style={[
              styles.container,
              { borderBottomColor: error ? COLORS.purple : COLORS.darkGray },
            ]}
          >
            <GooglePlacesAutocomplete
              nearbyPlacesAPI="GooglePlacesSearch"
              GooglePlacesSearchQuery={{
                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                rankby: "distance",
                type: "cafe",
              }}
              GooglePlacesDetailsQuery={{
                // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                fields: "geometry",
              }}
              filterReverseGeocodingByTypes={[
                // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                "locality",
                "administrative_area_level_3",
              ]}
              query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: process.env.GOOGLE_PLACES_API_KEY,
                language: "en", // language of the results
                types: "(cities)", // default: 'geocode'
              }}
              textInputProps={{
                onBlur: onBlur,
                onChangeText: (text) => onChange(text),
                placeholderTextColor: COLORS.white,
                clearButtonMode: "never",
              }}
              onPress={(data, details = null) => {
                if (details.geometry) {
                  const fieldData =
                    data.description +
                    "|" +
                    details.geometry.location.lat +
                    "|" +
                    details.geometry.location.lng;
                  onChange(fieldData);
                }
              }}
              fetchDetails={true}
              renderDescription={(row) => row.description}
              isRowScrollable={true}
              listViewDisplayed="auto" // true/false/undefined
              listUnderlayColor={COLORS.white}
              onFail={(error) => console.log("Error: " + error)}
              returnKeyType={"search"}
              debounce={200}
              placeholder={invalue !== "" && invalue ? invalue : placeholder}
              getDefaultValue={() => ""}
              minLength={1}
              autoFocus={false}
              enablePoweredByContainer={false}
              renderRightButton={() => (
                <Ionicons
                  name="search"
                  size={18}
                  color={COLORS.white}
                  style={styles.icon}
                />
              )}
              styles={{
                textInputContainer: {
                  width: "100%",
                  flexDirection: "row",
                },
                textInput: {
                  height: 44,
                  color: COLORS.white,
                  fontSize: 12,
                  fontFamily: "PoppinsLight",
                  textTransform: "capitalize",
                  borderBottomColor: COLORS.darkGray,
                  borderBottomWidth: 1,
                  backgroundColor: COLORS.black,
                },
                description: {
                  backgroundColor: COLORS.black,
                  color: COLORS.white,
                  fontFamily: "PoppinsLight",
                  fontSize: 12,
                },
                predefinedPlacesDescription: {
                  color: "#1faadb",
                },
                listView: {
                  backgroundColor: COLORS.black,
                  color: COLORS.white, //To see where exactly the list is
                  zIndex: 1051, //To popover the component outwards
                  overflowY: "scrollable",
                },
                loader: {
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  height: 20,
                },
                separator: {
                  height: 0.5,
                  backgroundColor: COLORS.darkGray,
                },
                row: {
                  backgroundColor: COLORS.black,
                  padding: 13,
                  height: 44,
                  flexDirection: "row",
                },
                poweredContainer: {
                  backgroundColor: COLORS.white,
                  justifyContent: "flex-end",
                  alignItems: "center",
                  borderBottomRightRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderColor: COLORS.darkGray,
                  borderTopWidth: 0.5,
                },
              }}
            />
          </SafeAreaView>
        </>
      )}
    />
  );
};

export default CustomLocation;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    backgroundColor: COLORS.black,
    width: "100%",
    height: 40,
    marginVertical: 8,
  },
  icon: {
    position: "absolute",
    paddingTop: 12,
    marginLeft: "91%",
  },
});
