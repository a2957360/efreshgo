import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

//react navigation
import { useNavigation } from "@react-navigation/native";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Keyboard,
} from "react-native";

//style
import { Colors } from "../styles";

//package
import i18n from "i18n-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";
import { MaterialIcons } from "@expo/vector-icons";
import { setLanguageCode } from "../../src/actions/account";
import { screenWidth } from "../config/settings";

export default function ListItemUpdateVersion(props) {
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

  const {
    title,
    dataType,
    data,
    rightIcon,
    link,
    lastItem,
    value,
    setValue,
    type,
    keyboardTypeTitle,
  } = props;

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handlePress = () => {
    if (link) {
      if (link == "ChangeLanguage") {
        Alert.alert(
          i18n.t("SwitchLanguage"),
          "",
          [
            {
              text: "English",
              onPress: () => {
                setToEnglish();
                dispatch(setLanguageCode("En"));
              },
            },
            {
              text: "简体中文",
              onPress: () => {
                setToChinese();
                dispatch(setLanguageCode("Zh"));
              },
            },
            {
              text: i18n.t("Cancel"),
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
      } else {
        navigation.navigate(link);
      }
    } else {
      return;
    }
  };

  return (
    <View
      style={
        lastItem === true
          ? [styles.titleContainer, { borderBottomWidth: 0 }]
          : styles.titleContainer
      }
    >
      <TouchableOpacity
        style={styles.leftSideTitleContainer}
        onPress={() => Keyboard.dismiss()}
      >
        <Text style={styles.titleText}>{title}</Text>
      </TouchableOpacity>

      <View style={styles.textInputContainer}>
        {/* 如果是email input，keyboardType变成email的，其他的为default */}
        {keyboardTypeTitle == "email" ? (
          <TextInput
            value={value}
            placeholder={value}
            onChangeText={(text) => setValue(text)}
            style={styles.inputTextStyle}
            keyboardType={"email-address"}
          />
        ) : (
          <TextInput
            value={value}
            placeholder={value}
            onChangeText={(text) => setValue(text)}
            style={styles.inputTextStyle}
          />
        )}
      </View>
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
    height: 50,
    flexDirection: "row",

    borderBottomColor: Colors.midGrey,
    borderBottomWidth: 1,
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
    alignSelf: "flex-end",
    fontSize: 16,
    lineHeight: 25,
  },
  leftSideTitleContainer: {
    flex: 0.25,
    //height: 30,
    justifyContent: "center",
  },
  textInputContainer: {
    flex: 0.75,
  },
  inputTextStyle: {
    flex: 1,
    fontSize: 16,
    textAlign: "right",
  },
});
