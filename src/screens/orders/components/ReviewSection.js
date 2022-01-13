import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";

//config
import { screenHeight, screenWidth } from "../../../config/settings";
import { Colors } from "../../../styles";
import Spacing from "../../../components/Spacing";

//package
import { Rating, AirbnbRating } from "react-native-ratings";
import i18n from "i18n-js";

export default function ReviewSection(props) {
  const {
    driverName,
    storeName,
    phone,
    reviewInput,
    setReviewInput,
    setRating,
    type,
  } = props;

  const handleKeyDown = (e) => {
    if (e.nativeEvent.key == "Enter") {
      Keyboard.dismiss();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* info section */}
      <View style={styles.infoContainer}>
        <Image
          style={styles.avatarContainer}
          source={require("../../../assets/user/avatarEmpty.png")}
        />
        <View style={styles.infoTextContainer}>
          <Text style={{ paddingVertical: 5 }}>
            {type == "store" ? storeName : i18n.t("Driver") + driverName}
          </Text>
          <Text>{phone}</Text>
        </View>
      </View>
      <Spacing height="medium" />

      {/* rating section */}
      <View style={styles.ratingSectionContainer}>
        <Text style={{ paddingHorizontal: 15 }}>
          {storeName ? i18n.t("Product Rating:") : i18n.t("Driver Rating:")}
        </Text>
        <AirbnbRating
          defaultRating={5}
          showRating={false}
          size={20}
          selectedColor={Colors.primary}
          onFinishRating={(val) => setRating(val)}
          //isDisabled={isDisabled}
          //defaultRating={5}
        />
      </View>
      <Spacing height="medium" />

      {/* input section */}
      {/* <View style={styles.inputSectionContainer}> */}
      <TextInput
        style={styles.reviewInputContainer}
        multiline
        numberOfLines={3}
        maxLength={120}
        placeholder={
          storeName
            ? i18n.t("Please make a product review")
            : i18n.t("Please make a driver review")
        }
        onChangeText={(text) => setReviewInput(text)}
        value={reviewInput}
        returnKeyType={"done"}
        onKeyPress={(e) => handleKeyDown(e)}
      />
      {/* </View> */}
      <Spacing height="medium" />
    </View>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    height: screenHeight * 0.1,
    flexDirection: "row",
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  avatarContainer: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  infoTextContainer: {
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  ratingSectionContainer: {
    height: screenHeight * 0.06,
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
  },
  reviewInputContainer: {
    height: 100,
    width: "100%",
    backgroundColor: Colors.white,
    paddingHorizontal: 15,
  },
  inputSectionContainer: {
    height: screenHeight * 0.17,
    width: screenWidth,
    backgroundColor: Colors.white,
  },
});
