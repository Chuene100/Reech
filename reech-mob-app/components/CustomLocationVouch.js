import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { Controller } from "react-hook-form";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { FontAwesome } from "@expo/vector-icons";

//import dependencies
import { COLORS } from "../constants";

const CustomLocationVouch = ({ control, name, rules = {}, placeholder }) => {
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
              {
                borderBottomColor: error ? COLORS.purple : COLORS.dark,
              },
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
              placeholder={placeholder}
              getDefaultValue={() => ""}
              minLength={1}
              autoFocus={false}
              enablePoweredByContainer={false}
              renderRightButton={() => (
                <FontAwesome
                  name="chevron-down"
                  size={16}
                  color={COLORS.darkGray}
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
                  paddingVertical: 5,
                  paddingHorizontal: 16,
                  color: COLORS.white,
                  fontSize: 12,
                  fontFamily: "PoppinsLight",
                  textTransform: "capitalize",
                  backgroundColor: COLORS.black,
                },
                description: {
                  color: COLORS.white,
                  fontSize: 12,
                  fontFamily: "PoppinsLight",
                  backgroundColor: COLORS.black,
                },
                predefinedPlacesDescription: {
                  color: "#1faadb",
                },
                listView: {
                  position: "absolute",
                  top: 48,
                  height: 200,
                  zIndex: 1051, //To popover the component outwards
                  color: COLORS.white, //To see where exactly the list is
                  overflowY: "scrollable",
                  backgroundColor: COLORS.black,
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
                  justifyContent: "flex-end",
                  alignItems: "center",
                  borderBottomRightRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderColor: COLORS.darkGray,
                  borderTopWidth: 0.5,
                  backgroundColor: COLORS.white,
                },
              }}
            />
          </SafeAreaView>
        </>
      )}
    />
  );
};

export default CustomLocationVouch;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    width: "100%",
    height: 40,
    marginVertical: 8,
    backgroundColor: COLORS.black,
  },
  icon: {
    position: "absolute",
    paddingTop: 12,
    marginLeft: "92%",
  },
});
