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
import { AirbnbRating } from "react-native-ratings";

//listitem(text 1 lines)
export default function ListItemForOrder(props) {
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

  const { title, data, link, lastItem, type, rate, reviewText } = props;

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
      {/* 左边的title */}

      <View style={styles.leftSideTitleContainer}>
        <Text style={styles.titleText}>{title}</Text>
      </View>

      <View style={styles.textInputContainer}>
        {type == "comment" ? (
          <View style={{ alignSelf: "flex-end" }}>
            {!rate || rate==undefined || rate == "0" ? (
              <Text style={styles.contentText}>
                {i18n.t("Currently no rate")}
              </Text>
            ) : (
              <AirbnbRating
                defaultRating={rate}
                showRating={false}
                size={20}
                selectedColor={Colors.primary}
                isDisabled={true}
                //defaultRating={5}
              />
            )}
          </View>
        ) : (
          <>
            {type == "commentText" ? (
              <Text numberOfLines={2} style={styles.contentText}>
                {!reviewText ? i18n.t("Currently no review") : reviewText}
              </Text>
            ) : (
              <Text numberOfLines={2} style={styles.contentText}>
                {data}
              </Text>
            )}
          </>
        )}
      </View>
    </View>
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
    fontSize: 15,
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
    fontSize: 12,
    //lineHeight: 25,
  },
  leftSideTitleContainer: {
    flex: 0.43,
    height: 30,
    justifyContent: "center",
  },
  rowContainer: {
    flex: 0.6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  imageContainer: {
    width: 30,
    height: 30,
  },
  textInputContainer: {
    flex: 0.57,
    height: 40,
    //flexDirection: "row",
    //alignItems: "center",
    justifyContent: "center",
  },
  textInputStyle: {
    fontSize: 16,
    height: 40,
    width: screenWidth * 0.6,
    //backgroundColor: "yellow",
    alignSelf: "flex-start",
  },
});
