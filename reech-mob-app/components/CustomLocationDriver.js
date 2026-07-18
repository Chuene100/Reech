import React from "react";
import { StyleSheet, SafeAreaView, Text } from "react-native";
import { Controller } from "react-hook-form";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons } from "@expo/vector-icons";

//import dependencies
import { COLORS, SIZES } from "../constants";

const googleApiKey = process.env.GOOGLE_PLACES_API_KEY;

const CustomLocationDriver = ({
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
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <>
          <SafeAreaView style={styles.container}>
            <GooglePlacesAutocomplete
              nearbyPlacesAPI="GooglePlacesSearch"
              GooglePlacesSearchQuery={{
                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                rankby: "distance",
                type: "cafe",
              }}
              GooglePlacesDetailsQuery={{
                // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                fields: [
                  "name",
                  "geometry",
                  "rating",
                  "formatted_phone_number",
                ],
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
                types: "address", // default: 'geocode'
                radius: 3000,
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
              keyboardShouldPersistTaps="handled"
              renderRightButton={() => (
                <Ionicons
                  name="search"
                  size={18}
                  color={COLORS.purple}
                  style={styles.icon}
                />
              )}
              styles={{
                textInputContainer: {
                  width: "100%",
                  flexDirection: "row",
                },
                textInput: {
                  flex: 1,
                  backgroundColor: COLORS.reechGray,
                  color: COLORS.white,
                  height: 44,
                  borderRadius: 25,
                  paddingVertical: 5,
                  paddingRight: 40,
                  paddingLeft: 20,
                  fontSize: 14,
                },
                description: {
                  color: COLORS.white,
                  fontFamily: "PoppinsLight",
                  fontSize: 14,
                },
                predefinedPlacesDescription: {
                  color: "#1faadb",
                },
                listView: {
                  position: "absolute",
                  backgroundColor: COLORS.black,
                  color: COLORS.white, //To see where exactly the list is
                  zIndex: 1051, //To popover the component outwards
                  top: 45,
                  overflowY: "scrollable",
                  height: 220,
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
          {error && (
            <Text
              style={{
                color: COLORS.purple,
                alignSelf: "stretch",
                fontSize: SIZES.body5,
                padding: SIZES.padding - 22,
                marginHorizontal: SIZES.padding,
                marginTop: 8,
              }}
            >
              {error.message || "Oops, something went wrong!"}
            </Text>
          )}
        </>
      )}
    />
  );
};

export default CustomLocationDriver;

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
