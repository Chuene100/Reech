import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Platform, Pressable, Image, ScrollView } from "react-native";
import { AntDesign, Entypo, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

//import customs
import { COLORS, images } from "../../../../constants";
import NavHeader from "@/components/Headers/NavHeader";

const FileAttachmentScreen = () => {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(true);
  const [hasGalleryPicturePermission, setHasGalleryPicturePermission] = useState("false");
  const [certifiedIDCopy, setCertifiedIDCopy] = useState(null);
  const [proofOfResCopy, setProofOfResCopy] = useState(null);
  const [bankStatement, setBankStatement] = useState(null);
  const [driversLicense, setDriversLicense] = useState(null);
  const [vehiclePicture, setVehiclePicture] = useState(null);
  const [vehicleRegistration, setVehicleRegistration] = useState(null);
  const [proofOfInsurance, setProofOfInsurance] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await DocumentPicker.requestPermissionsAsync();
      setHasGalleryPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    async () => {
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPicturePermission(galleryStatus.status === "granted");
    };
  }, []);

  //certified id copy 
  const pickCertifiedIDCopy = async () => {
    if (hasGalleryPermission === false) {
      return alert("Permission to access your gallery is required!");
    }

    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      multiple: false,
    });

    if (result.assets[0].uri) {
      setCertifiedIDCopy(result);
    } else if (result.canceled === true) {
      console.log("You have canceled the uploading of your document process. Please retry later.");
    }
  };

  //proof of res copy
  const pickProofOfResCopy = async () => {
    if (hasGalleryPermission === false) {
      return alert("Permission to access your gallery is required!");
    }

    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      multiple: false,
    });

    if (result.assets[0].uri) {
      setProofOfResCopy(result);
    } else if (result.canceled === true) {
      console.log("You have canceled the uploading of your document process. Please retry later.");
    }
  }

  //proof of banking copy
  const pickBankStatement = async () => {
    if (hasGalleryPermission === false) {
      return alert("Permission to access your gallery is required!");
    }

    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      multiple: false,
    });

    if (result.assets[0].uri) {
      setBankStatement(result);
    } else if (result.canceled === true) {
      console.log("You have canceled the uploading of your document process. Please retry later.");
    }
  }

  //proof of drivers copy
  const pickDriversLicenseCopy = async () => {
    if (hasGalleryPermission === false) {
      return alert("Permission to access your gallery is required!");
    }

    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      multiple: false,
    });

    if (result.assets[0].uri) {
      setDriversLicense(result);
    } else if (result.canceled === true) {
      console.log("You have canceled the uploading of your document process. Please retry later.");
    }
  }

  //proof of drivers vehicle picture copy
  const pickVehiclePictureCopy = async () => {
    let chosenVehicleImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (hasGalleryPicturePermission === false) {
      return alert("Permission to access your gallery is required!");
    }

    if (chosenVehicleImage.canceled) {
      return alert(
        "You have chosen to cancel the uploading of your vehicle image."
      );
    }

    if (!chosenVehicleImage.canceled) {
      setVehiclePicture(chosenVehicleImage);
    }
  }

  //proof of vehicle registration copy
  const pickVehicleRegistrationCopy = async () => {
    if (hasGalleryPermission === false) {
      return alert("Permission to access your gallery is required!");
    }

    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      multiple: false,
    });

    if (result.assets[0].uri) {
      setVehicleRegistration(result);
    } else if (result.canceled === true) {
      console.log("You have canceled the uploading of your document process. Please retry later.");
    }
  }

  //proof of insurance copy
  const pickProofOfInsuranceCopy = async () => {
    if (hasGalleryPermission === false) {
      return alert("Permission to access your gallery is required!");
    }

    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      multiple: false,
    });

    if (result.assets[0].uri) {
      setProofOfInsurance(result);
    } else if (result.canceled === true) {
      console.log("You have canceled the uploading of your document process. Please retry later.");
    }
  }

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
      <View style={styles.screenHeaderTextContainer}>
        <Text style={styles.screenHeaderTextItem}>File Attachments</Text>
        <Text style={styles.screenSubHeaderTextItem}>
          Manage and find all of your connected files needed to verify your Reech
          account here. Check that these documents are not expired, that they are
          correct, and that they were issued by the proper authorities. Please
          submit a PDF file no larger than 5MB.
        </Text>
      </View>
    );
  }

  //file uploader section
  function renderFileUploaderSection() {
    return (
      <ScrollView showsVerticalScrollIndicator={false}
        style={styles.fileUploaderItemsContainer}
      >
        {/*general file attachments*/}
        <View style={styles.reechDriverFileUploaderHeaderContainer}>
          <Text style={styles.fileUploaderMainHeaderTextItem}>Mandatory Files</Text>
          <Text style={styles.reechDriverFileUploaderSubHeaderTextItem}>
            To validate your account as a Reech user, please upload the following files.
          </Text>
        </View>

        {/*id document uploader item*/}
        <View style={styles.fileUploaderContentContainer}>
          {/*header section*/}
          <View style={styles.fileUploaderHeaderContainer}>
            {/*icon section*/}
            <View style={styles.fileUploaderIconContainer}>
              <AntDesign name="idcard" size={20} color={COLORS.white} />
            </View>

            {/*text description section*/}
            <View style={styles.fileUploaderHeaderTextContainer}>
              <View style={styles.fileUploaderHeaderTextItemContainer}>
                <Text style={styles.fileUploaderHeaderTextItem}>Certified ID </Text>
                <Text style={styles.fileUploaderHeaderStatusTextItem}>{certifiedIDCopy ? "Added" : ""}</Text>
              </View>

              <Text style={styles.fileUploaderSubHeaderTextItem}>
                {`By reviewing a certified ID copy, Reech can establish that the person we're dealing with is who they claim to be.`}
              </Text>
            </View>
          </View>

          {/*uploaded file results*/}
          {certifiedIDCopy && <View style={styles.uploadedFileResultsContainer}>
            {/*file image section*/}
            <View style={styles.uploadedFileImageResultContainer}>
              <Image source={images.pdf}
                style={styles.uploadedFileImageResultItem}
              />
            </View>

            {/*file text section*/}
            <View style={styles.uploadedFileTextResultContainer}>
              {/*file name items*/}
              <View style={styles.uploadedFileNameTextResultContainer}>
                <Text style={styles.uploadedFileHeaderNameTextItem}>Filename:</Text>
                <Text numberOfLines={1} style={styles.uploadedFileNameTextItem}>
                  {certifiedIDCopy.assets[0].name}
                </Text>
              </View>

              {/*file size items*/}
              <View style={styles.uploadedFileNameTextResultContainer}>
                <Text style={styles.uploadedFileHeaderNameTextItem}>File size:</Text>
                <Text style={styles.uploadedFileNameTextItem}>
                  {certifiedIDCopy.assets[0].size > 1000000
                    ? (certifiedIDCopy.assets[0].size / 1000000).toFixed(1) + " MB"
                    : (certifiedIDCopy.assets[0].size / 1000).toFixed(1) + " KB"}
                </Text>
              </View>

              {/*file type items*/}
              <View style={styles.uploadedFileNameTextResultContainer}>
                <Text style={styles.uploadedFileHeaderNameTextItem}>File type:</Text>
                <Text style={styles.uploadedFileNameTextItem}>{certifiedIDCopy.assets[0].mimeType}</Text>
              </View>
            </View>
          </View>}

          {/*button to upload file*/}
          <Pressable
            onPress={pickCertifiedIDCopy}
            style={styles.fileUploaderButtonContainer}
          >
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
              style={styles.fileUploaderButtonGradientContainer}
            >
              <Text style={styles.fileUploaderButtonTextItem}>
                {certifiedIDCopy ? "Change" : "Upload"} file
              </Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/*proof of address document uploader item*/}
        <View style={styles.fileUploaderContentContainer}>
          {/*header section*/}
          <View style={styles.fileUploaderHeaderContainer}>
            {/*icon section*/}
            <View style={styles.fileUploaderIconContainer}>
              <FontAwesome5 name="house-user" size={20} color={COLORS.white} />
            </View>

            {/*text description section*/}
            <View style={styles.fileUploaderHeaderTextContainer}>
              <View style={styles.fileUploaderHeaderTextItemContainer}>
                <Text style={styles.fileUploaderHeaderTextItem}>Proof of Residence </Text>
                <Text style={styles.fileUploaderHeaderStatusTextItem}>{proofOfResCopy ? "Added" : ""}</Text>
              </View>

              <Text style={styles.fileUploaderSubHeaderTextItem}>
                {`A proof of residence assists Reech in verifying an individual's identity. It verifies that the individual supplying information is who they say they are.`}
              </Text>
            </View>
          </View>

          {/*uploaded file results*/}
          {proofOfResCopy && <View style={styles.uploadedFileResultsContainer}>
            {/*file image section*/}
            <View style={styles.uploadedFileImageResultContainer}>
              <Image source={images.pdf}
                style={styles.uploadedFileImageResultItem}
              />
            </View>

            {/*file text section*/}
            <View style={styles.uploadedFileTextResultContainer}>
              {/*file name items*/}
              <View style={styles.uploadedFileNameTextResultContainer}>
                <Text style={styles.uploadedFileHeaderNameTextItem}>Filename:</Text>
                <Text numberOfLines={1} style={styles.uploadedFileNameTextItem}>
                  {proofOfResCopy.assets[0].name}
                </Text>
              </View>

              {/*file size items*/}
              <View style={styles.uploadedFileNameTextResultContainer}>
                <Text style={styles.uploadedFileHeaderNameTextItem}>File size:</Text>
                <Text style={styles.uploadedFileNameTextItem}>
                  {proofOfResCopy.assets[0].size > 1000000
                    ? (proofOfResCopy.assets[0].size / 1000000).toFixed(1) + " MB"
                    : (proofOfResCopy.assets[0].size / 1000).toFixed(1) + " KB"}
                </Text>
              </View>

              {/*file type items*/}
              <View style={styles.uploadedFileNameTextResultContainer}>
                <Text style={styles.uploadedFileHeaderNameTextItem}>File type:</Text>
                <Text style={styles.uploadedFileNameTextItem}>{proofOfResCopy.assets[0].mimeType}</Text>
              </View>
            </View>
          </View>}

          {/*button to upload file*/}
          <Pressable
            onPress={pickProofOfResCopy}
            style={styles.fileUploaderButtonContainer}
          >
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
              style={styles.fileUploaderButtonGradientContainer}
            >
              <Text style={styles.fileUploaderButtonTextItem}>
                {proofOfResCopy ? "Change" : "Upload"} file
              </Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/*proof of banking document uploader item*/}
        <View style={styles.fileUploaderContentContainer}>
          {/*header section*/}
          <View style={styles.fileUploaderHeaderContainer}>
            {/*icon section*/}
            <View style={styles.fileUploaderIconContainer}>
              <FontAwesome name="bank" size={20} color={COLORS.white} />
            </View>

            {/*text description section*/}
            <View style={styles.fileUploaderHeaderTextContainer}>
              <View style={styles.fileUploaderHeaderTextItemContainer}>
                <Text style={styles.fileUploaderHeaderTextItem}>3 Months Bank Statement </Text>
                <Text style={styles.fileUploaderHeaderStatusTextItem}>{bankStatement ? "Added" : ""}</Text>
              </View>

              <Text style={styles.fileUploaderSubHeaderTextItem}>
                Requesting bank statements assists Reech in preventing fraud and confirming the
                accuracy of the information provided. It can aid in the verification of your
                identification and financial history.
              </Text>
            </View>
          </View>

          {/*uploaded file results*/}
          {bankStatement && <View style={styles.uploadedFileResultsContainer}>
            {/*file image section*/}
            <View style={styles.uploadedFileImageResultContainer}>
              <Image source={images.pdf}
                style={styles.uploadedFileImageResultItem}
              />
            </View>

            {/*file text section*/}
            <View style={styles.uploadedFileTextResultContainer}>
              {/*file name items*/}
              <View style={styles.uploadedFileNameTextResultContainer}>
                <Text style={styles.uploadedFileHeaderNameTextItem}>Filename:</Text>
                <Text numberOfLines={1} style={styles.uploadedFileNameTextItem}>
                  {bankStatement.assets[0].name}
                </Text>
              </View>

              {/*file size items*/}
              <View style={styles.uploadedFileNameTextResultContainer}>
                <Text style={styles.uploadedFileHeaderNameTextItem}>File size:</Text>
                <Text style={styles.uploadedFileNameTextItem}>
                  {bankStatement.assets[0].size > 1000000
                    ? (bankStatement.assets[0].size / 1000000).toFixed(1) + " MB"
                    : (bankStatement.assets[0].size / 1000).toFixed(1) + " KB"}
                </Text>
              </View>

              {/*file type items*/}
              <View style={styles.uploadedFileNameTextResultContainer}>
                <Text style={styles.uploadedFileHeaderNameTextItem}>File type:</Text>
                <Text style={styles.uploadedFileNameTextItem}>{bankStatement.assets[0].mimeType}</Text>
              </View>
            </View>
          </View>}

          {/*button to upload file*/}
          <Pressable
            onPress={pickBankStatement}
            style={styles.fileUploaderButtonContainer}
          >
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
              style={styles.fileUploaderButtonGradientContainer}
            >
              <Text style={styles.fileUploaderButtonTextItem}>
                {bankStatement ? "Change" : "Upload"} file
              </Text>
            </LinearGradient>
          </Pressable>
        </View>

        <View style={styles.fileUploaderSectionSeparator} />

        {/*Reech ride professional document attachments*/}
        <View style={styles.reechDriverFileUploaderHeaderContainer}>
          <Text style={styles.fileUploaderMainHeaderTextItem}>Reech Driver Professional</Text>
          <Text style={styles.reechDriverFileUploaderSubHeaderTextItem}>
            If you have registered as a Reech professional driver, please provide the
            data below so that we can validate your profile and vehicle details.
          </Text>
        </View>

        {/*drivers license document uploader item*/}
        <View style={styles.fileUploaderContentContainer}>
          {/*header section*/}
          <View style={styles.fileUploaderHeaderContainer}>
            {/*icon section*/}
            <View style={styles.fileUploaderIconContainer}>
              <FontAwesome name="drivers-license" size={20} color={COLORS.white} />
            </View>

            {/*text description section*/}
            <View style={styles.fileUploaderHeaderTextContainer}>
              <View style={styles.fileUploaderHeaderTextItemContainer}>
                <Text style={styles.fileUploaderHeaderTextItem}>{`Driver's License `}</Text>
                <Text style={styles.fileUploaderHeaderStatusTextItem}>{driversLicense ? "Pending verification" : ""}</Text>
              </View>

              <Text style={styles.fileUploaderSubHeaderTextItem}>
                {`Reech must check the identification of its drivers to guarantee that they are of legal driving age and have a valid driver's license for the type of car they want to drive. This contributes to the platform's safety and integrity.`}
              </Text>
            </View>
          </View>

          {/*uploaded file results*/}
          {driversLicense && <View style={styles.uploadedFileResultsContainer}>
            {/*file image section*/}
            <View style={styles.uploadedFileImageResultContainer}>
              <Image source={images.pdf}
                style={styles.uploadedFileImageResultItem}
              />
            </View>

            {/*file text section*/}
            <View style={styles.uploadedFileTextResultContainer}>
              {/*file name items*/}
              <View style={styles.uploadedFileNameTextResultContainer}>
                <Text style={styles.uploadedFileHeaderNameTextItem}>Filename:</Text>
                <Text numberOfLines={1} style={styles.uploadedFileNameTextItem}>
                  {driversLicense.assets[0].name}
                </Text>
              </View>

              {/*file size items*/}
              <View style={styles.uploadedFileNameTextResultContainer}>
                <Text style={styles.uploadedFileHeaderNameTextItem}>File size:</Text>
                <Text style={styles.uploadedFileNameTextItem}>
                  {driversLicense.assets[0].size > 1000000
                    ? (driversLicense.assets[0].size / 1000000).toFixed(1) + "MB"
                    : (driversLicense.assets[0].size / 1000).toFixed(1) + "KB"}
                </Text>
              </View>

              {/*file type items*/}
              <View style={styles.uploadedFileNameTextResultContainer}>
                <Text style={styles.uploadedFileHeaderNameTextItem}>File type:</Text>
                <Text style={styles.uploadedFileNameTextItem}>{driversLicense.assets[0].mimeType}</Text>
              </View>
            </View>
          </View>}

          {/*button to upload file*/}
          <Pressable
            onPress={pickDriversLicenseCopy}
            style={styles.fileUploaderButtonContainer}
          >
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
              style={styles.fileUploaderButtonGradientContainer}
            >
              <Text style={styles.fileUploaderButtonTextItem}>
                {driversLicense ? "Change" : "Upload"} file
              </Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/*drivers vehicle picture uploader item*/}
        <View style={styles.fileUploaderContentContainer}>
          {/*header section*/}
          <View style={styles.fileUploaderHeaderContainer}>
            {/*icon section*/}
            <View style={styles.fileUploaderIconContainer}>
              <FontAwesome name="photo" size={20} color={COLORS.white} />
            </View>

            {/*text description section*/}
            <View style={styles.fileUploaderHeaderTextContainer}>
              <View style={styles.fileUploaderHeaderTextItemContainer}>
                <Text style={styles.fileUploaderHeaderTextItem}>Vehicle Picture</Text>
                <Text style={styles.fileUploaderHeaderStatusTextItem}>{vehiclePicture ? "Pending verification" : ""}</Text>
              </View>

              <Text style={styles.fileUploaderSubHeaderTextItem}>
                Having a photograph of your vehicle on file assists passengers in
                identifying your vehicle when you arrive for a Reech ride. This improves
                safety because passengers may compare the car on the app to the one
                that arrives.
              </Text>
            </View>
          </View>

          {/*uploaded file results*/}
          {vehiclePicture && <View style={styles.uploadedFileResultsContainer}>
            {/*file image section*/}
            <View style={styles.uploadedFileImageResultContainer}>
              <Image source={{ uri: vehiclePicture.uri }}
                style={styles.uploadedFileImageResultItem}
              />
            </View>

            {/*file text section*/}
            <View style={styles.uploadedFileTextResultContainer}>
              {/*file name items*/}
              <View style={styles.uploadedFileNameTextResultContainer}>
                <Text style={styles.uploadedFileHeaderNameTextItem}>Filename:</Text>
                <Text numberOfLines={1} style={styles.uploadedFileNameTextItem}>
                  {vehiclePicture.uri.split('/').pop()}
                </Text>
              </View>

              {/*file size items*/}
              <View style={styles.uploadedFileNameTextResultContainer}>
                <Text style={styles.uploadedFileHeaderNameTextItem}>File size:</Text>
                <Text style={styles.uploadedFileNameTextItem}>
                  {vehiclePicture.fileSize > 1000000
                    ? (vehiclePicture.fileSize / 1000000).toFixed(1) + " MB"
                    : (vehiclePicture.fileSize / 1000).toFixed(1) + " KB"}
                </Text>
              </View>

              {/*file type items*/}
              <View style={styles.uploadedFileNameTextResultContainer}>
                <Text style={styles.uploadedFileHeaderNameTextItem}>File type:</Text>
                <Text style={styles.uploadedFileNameTextItem}>{vehiclePicture.uri.split('.').pop()}</Text>
              </View>
            </View>
          </View>}

          {/*button to upload file*/}
          <Pressable
            onPress={pickVehiclePictureCopy}
            style={styles.fileUploaderButtonContainer}
          >
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
              style={styles.fileUploaderButtonGradientContainer}
            >
              <Text style={styles.fileUploaderButtonTextItem}>
                {vehiclePicture ? "Change" : "Upload"} file
              </Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/*vehicle registration document uploader item*/}
        <View style={styles.fileUploaderContentContainer}>
          {/*header section*/}
          <View style={styles.fileUploaderHeaderContainer}>
            {/*icon section*/}
            <View style={styles.fileUploaderIconContainer}>
              <FontAwesome name="car" size={20} color={COLORS.white} />
            </View>

            {/*text description section*/}
            <View style={styles.fileUploaderHeaderTextContainer}>
              <View style={styles.fileUploaderHeaderTextItemContainer}>
                <Text style={styles.fileUploaderHeaderTextItem}>Vehicle Registration </Text>
                <Text style={styles.fileUploaderHeaderStatusTextItem}>{vehicleRegistration ? "Pending verification" : ""}</Text>
              </View>

              <Text style={styles.fileUploaderSubHeaderTextItem}>
                Vehicle registration information assists Reech in tracking and identifying
                vehicles in the event of a safety or accountability concern, such as an accident
                or an incident involving passengers.
              </Text>
            </View>
          </View>

          {/*uploaded file results*/}
          {vehicleRegistration && <View style={styles.uploadedFileResultsContainer}>
            {/*file image section*/}
            <View style={styles.uploadedFileImageResultContainer}>
              <Image source={images.pdf}
                style={styles.uploadedFileImageResultItem}
              />
            </View>

            {/*file text section*/}
            <View style={styles.uploadedFileTextResultContainer}>
              {/*file name items*/}
              <View style={styles.uploadedFileNameTextResultContainer}>
                <Text style={styles.uploadedFileHeaderNameTextItem}>Filename:</Text>
                <Text numberOfLines={1} style={styles.uploadedFileNameTextItem}>
                  {vehicleRegistration.assets[0].name}
                </Text>
              </View>

              {/*file size items*/}
              <View style={styles.uploadedFileNameTextResultContainer}>
                <Text style={styles.uploadedFileHeaderNameTextItem}>File size:</Text>
                <Text style={styles.uploadedFileNameTextItem}>
                  {vehicleRegistration.assets[0].size > 1000000
                    ? (vehicleRegistration.assets[0].size / 1000000).toFixed(1) + " MB"
                    : (vehicleRegistration.assets[0].size / 1000).toFixed(1) + " KB"}
                </Text>
              </View>

              {/*file type items*/}
              <View style={styles.uploadedFileNameTextResultContainer}>
                <Text style={styles.uploadedFileHeaderNameTextItem}>File type:</Text>
                <Text style={styles.uploadedFileNameTextItem}>{vehicleRegistration.assets[0].mimeType}</Text>
              </View>
            </View>
          </View>}

          {/*button to upload file*/}
          <Pressable
            onPress={pickVehicleRegistrationCopy}
            style={styles.fileUploaderButtonContainer}
          >
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
              style={styles.fileUploaderButtonGradientContainer}
            >
              <Text style={styles.fileUploaderButtonTextItem}>
                {vehicleRegistration ? "Change" : "Upload"} file
              </Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/*proof of insurance document uploader item*/}
        <View style={styles.fileUploaderContentContainer}>
          {/*header section*/}
          <View style={styles.fileUploaderHeaderContainer}>
            {/*icon section*/}
            <View style={styles.fileUploaderIconContainer}>
              <Entypo name="documents" size={20} color={COLORS.white} />
            </View>

            {/*text description section*/}
            <View style={styles.fileUploaderHeaderTextContainer}>
              <View style={styles.fileUploaderHeaderTextItemContainer}>
                <Text style={styles.fileUploaderHeaderTextItem}>Proof of Insurance </Text>
                <Text style={styles.fileUploaderHeaderStatusTextItem}>{proofOfInsurance ? "Pending verification" : ""}</Text>
              </View>

              <Text style={styles.fileUploaderSubHeaderTextItem}>
                {`Reech can identify who is responsible for covering costs in the event of an accident by having access to a driver's insurance information. This transparency is critical when dealing with insurance claims and legal concerns.`}
              </Text>
            </View>
          </View>

          {/*uploaded file results*/}
          {proofOfInsurance && <View style={styles.uploadedFileResultsContainer}>
            {/*file image section*/}
            <View style={styles.uploadedFileImageResultContainer}>
              <Image source={images.pdf}
                style={styles.uploadedFileImageResultItem}
              />
            </View>

            {/*file text section*/}
            <View style={styles.uploadedFileTextResultContainer}>
              {/*file name items*/}
              <View style={styles.uploadedFileNameTextResultContainer}>
                <Text style={styles.uploadedFileHeaderNameTextItem}>Filename:</Text>
                <Text numberOfLines={1} style={styles.uploadedFileNameTextItem}>
                  {proofOfInsurance.assets[0].name}
                </Text>
              </View>

              {/*file size items*/}
              <View style={styles.uploadedFileNameTextResultContainer}>
                <Text style={styles.uploadedFileHeaderNameTextItem}>File size:</Text>
                <Text style={styles.uploadedFileNameTextItem}>
                  {proofOfInsurance.assets[0].size > 1000000
                    ? (proofOfInsurance.assets[0].size / 1000000).toFixed(1) + " MB"
                    : (proofOfInsurance.assets[0].size / 1000).toFixed(1) + " KB"}
                </Text>
              </View>

              {/*file type items*/}
              <View style={styles.uploadedFileNameTextResultContainer}>
                <Text style={styles.uploadedFileHeaderNameTextItem}>File type:</Text>
                <Text style={styles.uploadedFileNameTextItem}>{proofOfInsurance.assets[0].mimeType}</Text>
              </View>
            </View>
          </View>}

          {/*button to upload file*/}
          <Pressable
            onPress={pickProofOfInsuranceCopy}
            style={styles.fileUploaderButtonContainer}
          >
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
              style={styles.fileUploaderButtonGradientContainer}
            >
              <Text style={styles.fileUploaderButtonTextItem}>
                {proofOfInsurance ? "Change" : "Upload"} file
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    )
  }

  return (
    <View style={styles.container}>
      {renderHeaderComponent()}
      {renderHeaderSection()}
      {renderFileUploaderSection()}
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
  screenHeaderTextContainer: {
    marginTop: 15,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  screenHeaderTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  screenSubHeaderTextItem: {
    marginTop: 5,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    textAlign: "center",
  },

  //file uploader section
  fileUploaderItemsContainer: {
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 15,
    flexDirection: "column",
  },
  fileUploaderContentContainer: {
    flexDirection: "column",
    paddingHorizontal: 5,
    paddingVertical: 10,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: COLORS.reechGray,
  },
  fileUploaderHeaderContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  fileUploaderIconContainer: {
    width: "10%",
    justifyContent: "flex-start",
    alignItems: "center",
    marginRight: 10,
  },
  fileUploaderHeaderTextContainer: {
    width: "85%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  fileUploaderHeaderTextItemContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fileUploaderMainHeaderTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  fileUploaderHeaderTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  fileUploaderHeaderStatusTextItem: {
    color: COLORS.greenActive,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  fileUploaderSubHeaderTextItem: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: "PoppinsLight",
    opacity: 0.5,
  },

  //file results section
  uploadedFileResultsContainer: {
    width: "100%",
    marginTop: 10,
    flexDirection: "row",
  },
  uploadedFileImageResultContainer: {
    width: "11%",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  uploadedFileImageResultItem: {
    width: 35,
    height: 35,
    resizeMode: "cover",
    borderRadius: 5,
  },
  uploadedFileTextResultContainer: {
    width: "85%",
    flexDirection: "column",
  },
  uploadedFileNameTextResultContainer: {
    width: "80%",
    flexDirection: "row",
  },
  uploadedFileHeaderNameTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
    marginRight: 5,
  },
  uploadedFileNameTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //file uploader button section
  fileUploaderButtonContainer: {
    width: "100%",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  fileUploaderButtonGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 45,
    width: "100%",
  },
  fileUploaderButtonTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  fileUploaderSectionSeparator: {
    width: "100%",
    marginTop: 5,
    marginBottom: 15,
    alignSelf: "center",
    borderWidth: StyleSheet.hairlineWidth * 3,
    borderBottomColor: COLORS.darkGray,
  },

  //reech driver section
  reechDriverFileUploaderHeaderContainer: {
    paddingHorizontal: 5,
    flexDirection: "column",
  },
  reechDriverFileUploaderSubHeaderTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    opacity: 0.5,
    marginBottom: 10,
  },
});

export default FileAttachmentScreen;
