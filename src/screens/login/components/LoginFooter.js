import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { screenWidth, serverUrl, fbAppId } from "../../../config/settings";

//styles
import { Colors } from "../../../styles";

//package
import i18n from "i18n-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Facebook from "expo-facebook";
import axios from "axios";
import * as AppleAuthentication from "expo-apple-authentication";
import * as WeChat from "react-native-wechat-lib";

//react navigation
import { useNavigation } from "@react-navigation/native";

//redux
import {
  checkVerificationCode,
  thirdPartyLogin,
  setLoginLoading
} from "../../../actions/account";
import { useDispatch, useSelector } from "react-redux";

export default function LoginFooter(props) {
  const { verifyInput, phoneInput } = props;

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const checkVerificationCodeResult = useSelector(
    (state) => state.accountData.checkVerificationCodeResult
  );

  const userInfo = useSelector((state) => state.accountData.userInfo);

  const handleSubmit = async () => {
    if (phoneInput.length !== 10) {
      Alert.alert(i18n.t("Phone number is not valid"));
      return;
    }
    if (verifyInput.length !== 6) {
      Alert.alert(i18n.t("Verify code is not valid"));
      return;
    }
    const notificationToken = JSON.parse(
      await AsyncStorage.getItem("notificationToken")
    );
      console.log("notificationToken",notificationToken)
    const areaCode = "+1";
    const data = {
      userPhone: areaCode + phoneInput,
      userRole: 0,
      verificationCode: verifyInput,
      userExpoToken: notificationToken,
    };
    dispatch(checkVerificationCode(data));
  };

  const storeUserInfo = async (data) => {
    await AsyncStorage.setItem("currentUser", JSON.stringify(data));
    navigation.replace("Home");
  };

  // const onPageLoaded = async () => {
  //   const currentUser = JSON.parse(await AsyncStorage.getItem("currentUser"));

  //   if (currentUser) {
  //     navigation.replace("Home");
  //   }
  // };

  //check if local storage has userNumber
  useEffect(() => {
    // onPageLoaded();
    if (checkVerificationCodeResult == "success" && userInfo) {
      //store userNumber in localstorage & navigation to home page
      storeUserInfo(userInfo.userNumber);
    }
    if (
      checkVerificationCodeResult == "twilio error" ||
      checkVerificationCodeResult == "fail"
    ) {
      return Alert.alert(
        i18n.t("Error Message"),
        i18n.t("Verify code is not valid"),
        [
          {
            text: i18n.t("ReEnter"),
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
    if (checkVerificationCodeResult == "verificationCode wrong") {
      return Alert.alert(
        i18n.t("Error Message"),
        i18n.t("verificationCode wrong"),
        [
          {
            text: i18n.t("ReEnter"),
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
    if (checkVerificationCodeResult == "fail") {
      return Alert.alert(
        i18n.t("Error Message"),
        i18n.t("Verify code is not valid"),
        [
          {
            text: i18n.t("ReEnter"),
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
  }, [checkVerificationCodeResult]);

  const handleWeChatLogin = async () => {
    const notificationToken = JSON.parse(
      await AsyncStorage.getItem("notificationToken")
    );
    WeChat.sendAuthRequest("snsapi_userinfo", "123").then((res) => {
      //call loading
      dispatch(setLoginLoading(true))
      console.log("33333333", res);
      wechatAppId = "wx25609b0762f5450c";
      wechatSecret = "980b0e7b614d55661642b54093745880";
      if (res.errCode == 0) {
        const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${wechatAppId}&secret=${wechatSecret}&code=${res.code}&grant_type=authorization_code`;
        try {
          axios.get(url).then((wechatres) => {
            if (wechatres.status == 200) {
              const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${wechatres.data.access_token}&openid=${wechatres.data.openid}`;
              try {
                axios.get(url).then((wechatinfores) => {
                  console.log("get return", wechatinfores.data);
                  const query = {
                    isCheck: 1,
                    userImages: wechatinfores.data.headimgurl,
                    userName: wechatinfores.data.nickname,
                    userWechatToken: wechatres.data.openid,
                    userExpoToken: notificationToken,
                  };
                  console.log("check data", query);
                  dispatch(thirdPartyLogin(query));
                });
              } catch (error) {
                console.log("Put request Failed", error);
                dispatch(setLoginLoading(false))
              }
            }
          });
        } catch (error) {
          console.log("Put request Failed", error);
          dispatch(setLoginLoading(false))
        }
      }
    });
  };

  const handleFBlogin = async () => {
    try {
      await Facebook.initializeAsync({
        appId: fbAppId,
      });
      const {
        type,
        token,
        permissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["email", "public_profile"],
      });
      if (type === "success") {
        const res = await fetch(
          `https://graph.facebook.com/me?access_token=${token}`
        );
        const profile = await res.json();
        const notificationToken = JSON.parse(
          await AsyncStorage.getItem("notificationToken")
        );
        const query = {
          isCheck: 1,
          userName: profile.name,
          userFacebookToken: profile.id,
          userExpoToken: notificationToken,
        };
        dispatch(thirdPartyLogin(query));
      } else {
        Alert.alert(i18n.t("FacebookLogInFailed"));
      }
    } catch ({ message }) {
      alert(`Facebook login Error: ${message}`);
    }
  };

  const handleAppleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const notificationToken = JSON.parse(
        await AsyncStorage.getItem("notificationToken")
      );
      const query = {
        isCheck: 1,
        userName: `${credential.fullName.givenName} ${credential.fullName.familyName}`,
        userEmail: credential.email,
        userAppleToken: credential.user,
        userExpoToken: notificationToken,
      };
      dispatch(thirdPartyLogin(query));
    } catch (e) {
      if (e.code === "ERR_CANCELED") {
        // handle that the user canceled the sign-in flow
        Alert.alert(i18n.t("AppleSignInCanceled"));
      } else {
        // handle other errors
        console.log(123, e);
      }
    }
  };
  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" color="black" />
  //     </View>
  //   );
  // } else {
  return (
    <View style={{ flex: 1 }}>
      {/* icons row */}
      <View style={styles.iconRow}>
        <TouchableOpacity onPress={() => handleFBlogin()}>
          <Image
            source={require("../../../assets/login/facebook.png")}
            style={{ height: 50, width: 50, resizeMode: "contain" }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleWeChatLogin()}>
          <Image
            source={require("../../../assets/login/wechat.png")}
            style={{ height: 50, width: 50, resizeMode: "contain" }}
          />
        </TouchableOpacity>

        {Platform.OS == "ios" && (
          <TouchableOpacity onPress={() => handleAppleLogin()}>
            <Image
              source={require("../../../assets/login/apple.png")}
              style={{ height: 50, width: 50, resizeMode: "contain" }}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* login button % statement */}
      <View style={styles.bottomContainer}>
        {/* login button */}
        <TouchableOpacity
          style={styles.loginButton}
          activeOpacity={1}
          onPress={() => handleSubmit()}
        >
          <Text style={styles.text}>{i18n.t("Login")}</Text>
        </TouchableOpacity>

        {/* statement text */}
        <View style={styles.statementContainer}>
          <Text style={{ fontSize: 12 }}>{i18n.t("Sign in to agree")}</Text>
          <Text style={{ color: Colors.primary, fontSize: 12 }}>
            {i18n.t("Terms of Service and Privacy Policy")}
          </Text>
        </View>
      </View>
    </View>
  );
  // }
}

const styles = StyleSheet.create({
  iconRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingBottom: 20,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    width: screenWidth * 0.8,
    height: screenWidth * 0.1,
    borderRadius: 30,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: Colors.white,
    fontSize: 16,
  },
  statementContainer: {
    flexDirection: "row",
    width: screenWidth * 0.8,
    height: screenWidth * 0.1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
});
