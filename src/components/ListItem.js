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

//listitem(text 1 lines)
export default function ListItem(props) {
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
    // <TouchableOpacity onPress={() => handlePress()}>
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

      {dataType === "image" ? (
        <View
          style={{
            flex: 0.6,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Image
            style={{
              width: 30,
              height: 30,
            }}
            source={data}
          />
        </View>
      ) : (
        <View
          style={{
            flex: 0.75,
            height: 40,
            //flexDirection: "row",
            //alignItems: "center",
            justifyContent: "center",
          }}
        >
          {type == "textInput" ? (
            <TextInput
              value={value}
              placeholder={value}
              onChangeText={(text) => setValue(text)}
              style={{
                fontSize: 16,
                height: 40,
                width: screenWidth * 0.6,
                //backgroundColor: "yellow",
                alignSelf: "flex-start",
              }}
            />
          ) : (
            <Text numberOfLines={2} style={styles.contentText}>
              {data}
            </Text>
          )}
        </View>
      )}

      {/* rightIcon: 右边的灰色小箭头 
                TODO: 修改成可以input
                */}
      {/* {rightIcon === true ? (
          <MaterialIcons
            name="navigate-next"
            size={24}
            color={Colors.darkGrey}
          />
        ) : null} */}
    </View>
    // </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomColor: Colors.midGrey,
    borderBottomWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
    //backgroundColor: "green",
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
    textAlign: "right",
    fontSize: 16,
    //lineHeight: 25,
  },
  leftSideTitleContainer: {
    flex: 0.25,
    height: 30,
    justifyContent: "center",
  },
});
