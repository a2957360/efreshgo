import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

//config
import { screenHeight, screenWidth } from "../../../config/settings";

//style
import { Colors } from "../../../styles";

//component
import CountDown from "react-native-countdown-component";

//package
import i18n from "i18n-js";

//react navigation
import { useNavigation } from "@react-navigation/native";

//redux
import {
  getVerificationCode,
  checkVerificationCode,
  resetGetVerificationResult,
} from "../../../actions/account";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChangePhone() {
  const [phoneInput, setPhoneInput] = useState();
  const [verifyNum, setVerifyNum] = useState();
  const [submit, setSubmit] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  //language code stored in redux
  const language = useSelector((state) => state.accountData.language);

  const getVerificationCodeResult = useSelector(
    (state) => state.accountData.getVerificationCodeResult
  );

  const checkVerificationCodeResult = useSelector(
    (state) => state.accountData.checkVerificationCodeResult
  );

  const handleSendPress = () => {
    const areaCode = "+1";
    const data = {
      userPhone: areaCode + phoneInput,
      userRole: 0,
      language: language,
    };
    dispatch(getVerificationCode(data));
    setSubmit(true);
    storeUserPhoneNumber(phoneInput);
  };

  const handleSubmitPress = () => {
    // 如果手机号，验证码为空，不可以按完成按钮
    if (phoneInput && verifyNum) {
      const areaCode = "+1";
      const data = {
        userPhone: areaCode + phoneInput,
        userRole: 0,
        verificationCode: verifyNum,
        userExpoToken: 0,
      };
      dispatch(checkVerificationCode(data));
    } else {
      Alert.alert(
        i18n.t("Error Message"),
        i18n.t("updateUserPhoneErrorMessage"),
        [
          {
            text: i18n.t("ReEnter"),

            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
  };

  const storeUserPhoneNumber = async (phoneNumber) => {
    try {
      await AsyncStorage.setItem("userPhoneNumber", phoneNumber);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (getVerificationCodeResult == "twilio error") {
      return Alert.alert(
        i18n.t("Error Message"),
        i18n.t("Phone number is not valid"),
        [
          {
            text: i18n.t("ReEnter"),

            style: "cancel",
          },
          // { text: "OK", onPress: () => console.log("OK Pressed") },
        ],
        { cancelable: false }
      );
    }
  }, [getVerificationCodeResult]);

  useEffect(() => {
    if (checkVerificationCodeResult == "success") {
      navigation.navigate("Account");
      dispatch(resetGetVerificationResult());
    }
    if (checkVerificationCodeResult == "twilio error") {
      return Alert.alert(
        i18n.t("Error Message"),
        i18n.t("Verify code is not valid"),
        [
          {
            text: i18n.t("ReEnter"),
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
  }, [checkVerificationCodeResult]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.white }}>
      <View>
        {/* input container */}
        <View style={styles.phoneInputContainer}>
          {/* phone input */}
          <View style={styles.phoneInput}>
            <Image
              style={styles.flag}
              source={require("../../../assets/user/flag.png")}
            />
            <TextInput
              value={phoneInput}
              onChangeText={(text) => setPhoneInput(text)}
              placeholder={i18n.t("Enter Your Phone Number")}
              style={styles.input}
              keyboardType={"phone-pad"}
            />
          </View>

          {/* verify number input */}
          <View style={styles.verifyInputContainer}>
            {/* verify input */}
            <TextInput
              value={verifyNum}
              onChangeText={(text) => setVerifyNum(text)}
              placeholder={i18n.t("Enter Verify Code")}
              style={styles.input2}
              keyboardType={"phone-pad"}
            />

            {/* send button */}
            <TouchableOpacity
              onPress={() => handleSendPress()}
              style={styles.sendButton}
            >
              {submit ? (
                <CountDown
                  until={10}
                  size={15}
                  onFinish={() => setSubmit(false)}
                  digitStyle={null}
                  digitTxtStyle={{ color: Colors.white }}
                  timeToShow={["S"]}
                  timeLabels={{ s: null }}
                />
              ) : (
                <Text style={{ color: Colors.white }}>{i18n.t("Send")}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* submit button container */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            onPress={() => handleSubmitPress()}
            activeOpacity={1}
          >
            <View style={styles.finishButton}>
              <Text style={{ color: Colors.white }}>{i18n.t("Edit")}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  phoneInputContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: screenHeight * 0.1,
    height: screenHeight * 0.3,
  },
  phoneInput: {
    height: screenHeight * 0.05,
    width: screenWidth * 0.8,
    borderColor: Colors.darkGrey,
    borderWidth: 0.5,
    borderRadius: 30,
    flexDirection: "row",
    paddingLeft: 10,
    marginBottom: 20,
  },
  flag: {
    height: screenWidth * 0.06,
    width: screenWidth * 0.06,
    resizeMode: "contain",
    alignSelf: "center",
  },
  input: {
    width: "80%",
  },
  input2: {
    width: "60%",
    borderColor: Colors.darkGrey,
    borderWidth: 0.5,
    borderRadius: 30,
    paddingLeft: 5,
  },
  verifyInputContainer: {
    height: screenHeight * 0.05,
    width: screenWidth * 0.8,
    flexDirection: "row",
  },
  sendButton: {
    backgroundColor: Colors.primary,
    width: "30%",
    marginLeft: screenWidth * 0.07,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  finishButton: {
    height: screenHeight * 0.05,
    width: screenWidth * 0.8,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: screenHeight * 0.2,
    height: screenHeight * 0.55,
  },
});
