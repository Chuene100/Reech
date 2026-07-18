import React, { useEffect, useRef } from "react";
import { Alert, StyleSheet, View, Text, Image, TouchableOpacity, Platform } from "react-native";
import { Camera } from "expo-camera";

//custom
import { COLORS, FONTS, SIZES, icons, images } from "../../../constants";
import { CustomShare } from "../../../components";

const ScanAccountQrCode = ({ navigation }) => {
  const [hasPermission, setHasPermission] = React.useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  function renderHeader() {
    return (
      <View style={styles.headerContainer}>
        {/* navigation */}
        <TouchableOpacity
          style={styles.headerNavItem}
          onPress={() => navigation.goBack()}
        >
          <Image source={icons.close} style={styles.headerBackIcon} />
        </TouchableOpacity>

        {/* info heading text */}
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Scan QR Code</Text>
        </View>

        {/* info area */}
        <TouchableOpacity
          style={styles.headerInfoModal}
          onPress={() =>
            Alert.alert(
              "How does it work?",
              "Please ensure that the QR code you are trying to scan is placed within the focus area of the camera.",
              [
                {
                  text: "Go back",
                  onPress: () => console.log("cancel clicked"),
                  style: "cancel",
                },
              ]
            )
          }
        >
          <Image source={icons.info} style={styles.headerBackIcon} />
        </TouchableOpacity>
      </View>
    );
  }

  function renderScanFocus() {
    return (
      <View style={styles.scanFocusContainer}>
        <Image
          source={images.focus}
          resizeMode="stretch"
          style={styles.scanFocus}
        />
      </View>
    );
  }

  function renderBottomShareMethods() {
    return <CustomShare />;
  }

  function onQRCodeRead(result) {
    console.log(result.data);
  }

  return (
    <View style={styles.screenContainer}>
      <Camera
        ref={(ref) => {
          useRef.camera = ref;
        }}
        style={styles.cameraStyle}
        captureAudio={false}
        type={Camera.Constants.Type.back}
        flashMode={Camera.Constants.FlashMode.off}
        onBarCodeScanned={onQRCodeRead}
        androidCameraPermissionOptions={{
          title: "Permission to use camera",
          message: "Camera is required for barcode scanning",
          buttonPositive: "OK",
          buttonNegative: "Cancel",
        }}
      >
        {renderHeader()}
        {renderScanFocus()}
        {renderBottomShareMethods()}
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  //screen section
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.transparent,
  },
  cameraStyle: {
    flex: 1,
  },

  //header section
  headerContainer: {
    flexDirection: "row",
    marginTop: Platform.OS === "ios" ? "8%" : 0,
    paddingHorizontal: SIZES.padding * 2,
  },
  headerNavItem: {
    width: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  headerBackIcon: {
    height: 15,
    width: 15,
    tintColor: COLORS.white,
  },
  headerTextContainer: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  headerInfoModal: {
    height: 45,
    width: 45,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  //scan focus
  scanFocusContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scanFocus: {
    marginTop: "-55%",
    width: 200,
    height: 300,
  },

  //bottom section
  bottomShareMethodsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 220,
    padding: SIZES.padding * 3,
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
    backgroundColor: COLORS.black,
  },
  bottomHeader: {
    ...FONTS.h4,
    color: COLORS.white,
    alignSelf: "center",
  },
  bottomOptionsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: SIZES.padding * 2,
  },
  bottomOptionItem: {
    width: "35%",
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  iconItem: {
    height: 25,
    width: 25,
  },
  iconText: {
    paddingHorizontal: 10,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },
  qrCodeIcon: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 0,
  },
});

export default ScanAccountQrCode;
