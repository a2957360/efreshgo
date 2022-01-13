import React, { useState, useEffect } from "react";

//react navigation
import { useNavigation } from "@react-navigation/native";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Keyboard,
} from "react-native";

//components
import ListItem from "../../components/ListItem";
import UnEditableListItem from "../../components/UnEditableListItem";
import ListItemUpdateVersion from "../../components/ListItemUpdateVersion";
import LoadingScreen from "../../components/LoadingScreen";

//package
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";
import * as Updates from "expo-updates";
import { screenHeight, screenWidth } from "../../config/settings";

//style
import { Colors } from "../../styles";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  resetGetVerificationResult,
  updateUserInfo,
  resetUpdateUserInfoResultMessage,
} from "../../actions/account";

export default function Account() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(null);

  const [avatar, setAvatar] = useState();
  const [userName, setUserName] = useState();
  const [email, setEmail] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  

  let languageCode;

  const userDataRedux = useSelector((state) => state.accountData.userInfo);
  const updateUserInfoResultMessage = useSelector(
    (state) => state.accountData.updateUserInfoResultMessage
  );

  useEffect(() => {
    async function getAppSetting() {
      await setLoading(true);
      await getLanguage();
      await setLoading(false);
    }
    getAppSetting();
    dispatch(resetGetVerificationResult());
    getUserInfo();
  }, []);

  useEffect(() => {
    setLoading(false);
    if (updateUserInfoResultMessage == "success") {
      return Alert.alert(
        i18n.t("Success"),
        i18n.t("You account information has updated!"),
        [
          {
            text: i18n.t("Confirm"),
            onPress: () => {
              navigation.navigate("User");
              dispatch(resetUpdateUserInfoResultMessage());
            },
          },
        ],
        { cancelable: false }
      );
    }
    if (updateUserInfoResultMessage == "fail") {
      return Alert.alert(
        i18n.t("Error Message"),
        i18n.t("Can not update your account information!"),
        [
          {
            text: i18n.t("Confirm"),
            onPress: () => {
              dispatch(resetUpdateUserInfoResultMessage());
            },
          },
        ],
        { cancelable: false }
      );
    }
  }, [updateUserInfoResultMessage]);

  const getUserInfo = () => {
    if (userDataRedux) {
      setAvatar(userDataRedux.userImages);
      setUserName(userDataRedux.userName);
      setEmail(userDataRedux.userEmail);
      setPhoneNumber(userDataRedux.userPhone);
    }
  };

  const handleSubmit = () => {
    let fileData = new FormData();

    const data = {
      userNumber: userDataRedux.userNumber,
      userName: userName,
      userPhone: phoneNumber,
      userEmail: email,
      userRole: userDataRedux.userRole,
      userExpoToken: 23.2,
    };

    for (var key in data) {
      fileData.append(key, data[key]);
    }

    if (avatar != userDataRedux.userImages) {
      fileData.append("userImages", {
        uri: avatar.uri,
        type: "image/jpeg",
        name: "userImage.png",
      });
    }

    // fileData.append("userImages", {
    //   uri: avatar.uri,
    //   type: "image/jpeg",
    //   name: "userImage",
    // });
    setLoading(true);
    dispatch(updateUserInfo(fileData));
  };

  const getLanguage = async () => {
    //get language code from local storage
    languageCode = await AsyncStorage.getItem("language");

    if (languageCode.includes("zh")) {
      setLanguage("中文");
    }

    if (languageCode.includes("en")) {
      setLanguage("English");
    }
  };

  const setToEnglish = async () => {
    await AsyncStorage.setItem("language", "en");
    await Updates.reloadAsync();
  };

  const setToChinese = async () => {
    await AsyncStorage.setItem("language", "zh");
    await Updates.reloadAsync();
  };

  if (loading === true) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* {userDataRedux && ( */}
      <>
        <View style={styles.cardContainer}>
          <UnEditableListItem
            title={i18n.t("Avatar")}
            dataType="image"
            link={"ChangeAvatar"}
            //data={avatar}
            avatarRedux={avatar}
            setAvatar={setAvatar}
          />
          {/* <ListItem
              title={i18n.t("Avatar")}
              dataType="image"
              data={require("../../assets/test/logo.png")}
            /> */}

          <ListItemUpdateVersion
            title={i18n.t("Username")}
            data={userName}
            value={userName}
            setValue={setUserName}
            type={"textInput"}
          />

          <ListItemUpdateVersion
            title={i18n.t("Email")}
            data={"info@efreshgo.ca"}
            value={email}
            setValue={setEmail}
            type={"textInput"}
            keyboardTypeTitle={"email"}
          />

          {/* <UnEditableListItem
            title={i18n.t("PhoneNumber")}
            data={ phoneNumber}
            link={"ChangePhone"}
          /> */}

          {/* <ListItem
        title={i18n.t("Language")}
        data={language}
        lastItem={true}
        link={"ChangeLanguage"}
      /> */}

          <UnEditableListItem
            title={i18n.t("Language")}
            data={language}
            lastItem={true}
            link={"ChangeLanguage"}
          />
        </View>

        {/* submit button */}
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 0.5, backgroundColor: Colors.white }}
          onPress={() => Keyboard.dismiss()}
        >
          <View></View>
        </TouchableOpacity>
        <View style={styles.button}>
          <TouchableOpacity
          activeOpacity={1}
            style={styles.submit}
            onPress={() => handleSubmit()}
          >
            <Text style={{ color: Colors.white, fontSize: 16 }}>
              {i18n.t("Confirm")}
            </Text>
          </TouchableOpacity>
        </View>
      </>
      {/* )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    paddingHorizontal: 15,
    paddingBottom: 5,
    backgroundColor: Colors.white,
  },
  titleContainer: {
    flexDirection: "row",
    paddingVertical: 18,
    borderBottomColor: Colors.midGrey,
    borderBottomWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomColor: Colors.midGrey,
    borderBottomWidth: 1,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 25,
  },
  submit: {
    height: screenHeight * 0.06,
    width: "80%",
    backgroundColor: Colors.primary,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
});
