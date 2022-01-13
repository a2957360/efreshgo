import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

//styles
import { Colors } from "../../../styles";

//package
import i18n from "i18n-js";
import CountDown from "react-native-countdown-component";

//constant
import { screenWidth } from "../../../config/settings";

//redux
import { getVerificationCode } from "../../../actions/account";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function InputSection(props) {
  const dispatch = useDispatch();
  const {
    language,
    verifyInput,
    setVerifyInput,
    phoneInput,
    setPhoneInput,
  } = props;

  const [submit, setSubmit] = useState(false);

  const getVerificationCodeResult = useSelector(
    (state) => state.accountData.getVerificationCodeResult
  );

  const handleSend = () => {
    const areaCode = "+1";
    const data = {
      userPhone: areaCode + phoneInput,
      userRole: 0,
      language: language,
    };
    dispatch(getVerificationCode(data));
    setSubmit(true);
  };

  useEffect(() => {
    if (getVerificationCodeResult == "twilio error") {
      return Alert.alert(
        i18n.t("Error Message"),
        i18n.t("Phone number is not valid"),
        [
          {
            text: i18n.t("ReEnter"),
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
        ]
      );
    }
  }, [getVerificationCodeResult]);

  return (
    <View style={styles.inputSectioncontainer}>
      {/* phone input */}
      <View style={styles.phoneInputContainer}>
        {/* national flag */}
        <Image
          source={require("../../../assets/login/flag.png")}
          style={styles.flagImage}
        />

        {/* area number */}
        <Text>+1</Text>

        {/* phone input */}
        <TextInput
          style={styles.inputText}
          placeholder={i18n.t("Enter Your Phone Number")}
          onChangeText={(text) => setPhoneInput(text)}
          value={phoneInput}
          keyboardType={"numeric"}
        />
      </View>

      {/* verify code input */}
      <View style={styles.verifyCodeInputContainer}>
        <View style={styles.codeInputContainer}>
          {/* verify code input */}
          <TextInput
            style={styles.inputText}
            placeholder={i18n.t("Enter Verify Code")}
            onChangeText={(text) => setVerifyInput(text)}
            value={verifyInput}
            keyboardType={"numeric"}
          />
        </View>

        {/* send button */}
        <TouchableOpacity onPress={handleSend} style={styles.submitButton}>
          <View>
            {submit ? (
              <CountDown
                until={30}
                size={15}
                onFinish={() => setSubmit(false)}
                digitStyle={null}
                digitTxtStyle={{ color: Colors.white }}
                timeToShow={["S"]}
                timeLabels={{ s: null }}
              />
            ) : (
              <Text style={styles.text}>{i18n.t("Send")}</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputSectioncontainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    //backgroundColor: "yellow",
    paddingTop: 30,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: screenWidth * 0.8,
    height: screenWidth * 0.1,
    borderWidth: 0.3,
    borderRadius: 30,
    marginBottom: 15,
    borderColor: Colors.darkGrey,
  },
  codeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.3,
    borderRadius: 30,
    borderColor: Colors.darkGrey,
    width: screenWidth * 0.5,
    height: screenWidth * 0.1,
  },
  submitButton: {
    paddingHorizontal: 15,
    backgroundColor: Colors.primary,
    marginLeft: 10,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    width: screenWidth * 0.25,
    height: screenWidth * 0.1,
  },
  inputText: {
    flex: 1,
    padding: 10,
    marginLeft: 10,
  },
  text: {
    color: Colors.white,
    fontSize: 15,
  },
  flagImage: {
    height: 30,
    width: 30,
    resizeMode: "contain",
    marginLeft: 10,
  },
  verifyCodeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: screenWidth * 0.8,
    height: screenWidth * 0.1,
  },
});
