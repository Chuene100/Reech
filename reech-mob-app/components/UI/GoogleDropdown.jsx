import React from 'react';
import { Controller } from 'react-hook-form';
import { StyleSheet, SafeAreaView } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

//import dependencies
import { COLORS } from "../../../constants";

const googleApiKey = process.env.GOOGLE_PLACES_API_KEY;

const GoogleDropdown = ({ control, name, rules = {}, placeholder }) => {
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
              <SafeAreaView
                style={[
                  styles.container,
                  {
                    zIndex: 1051,
                    borderColor: error ? COLORS.purple : COLORS.gray,
                    borderWidth: error ? 1 : 0,
                    borderRadius: error ? 25 : 0,
                    height: error ? 45 : 40,
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
                    key: googleApiKey, //"AIzaSyABl_usXY56x3L_TKUGprok1Z-4FL6Mm0g",
                    language: "en", // language of the results
                    types: "address", // default: 'geocode'
                    radius: 3000,
                  }}
                  textInputProps={{
                    onBlur: onBlur,
                    // onChangeText: (text) => onChange(text),
                    placeholderTextColor: COLORS.darkGray,
                    clearButtonMode: "never",
                  }}
                  onPress={(data, details) => {
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
                  listViewDisplayed="auto" // true/false/undefinedf
                  listUnderlayColor={COLORS.white}
                  onFail={(error) => console.log(" Error: " + error)}
                  returnKeyType={"default"}
                  debounce={200}
                  placeholder={placeholder}
                  getDefaultValue={() => ""}
                  minLength={1}
                  autoFocus={false}
                  enablePoweredByContainer={false}
                  styles={styles.googleContainer}
                />
              </SafeAreaView>
            </>
          )}
        />
      );
};

const styles = StyleSheet.create({
    container: {
      position: "relative",
      flex: 1,
      width: "100%",
      marginVertical: 8,
    },
    googleContainer: {
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
        borderWidth: 0.5,
        borderColor: COLORS.reechGray,
        paddingVertical: 5,
        paddingHorizontal: 20,
        fontSize: 15,
        fontWeight: "400",
        textTransform: "capitalize",
      },
      description: {
        backgroundColor: COLORS.black,
        fontWeight: "400",
        color: COLORS.white,
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
    },
    icon: {
      position: "absolute",
      paddingTop: 12,
      marginLeft: "91%",
    },
  });

export default GoogleDropdown;