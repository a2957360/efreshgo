import React, { useState, useEffect } from "react";

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
} from "react-native";

//style
import { Colors } from "../styles";

//package
import i18n from "i18n-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";
import { MaterialIcons } from "@expo/vector-icons";
import { useActionSheet } from "@expo/react-native-action-sheet";

//redux
import { useDispatch, useSelector } from "react-redux";
import { setLanguageCode } from "../../src/actions/account";

//component
import ImageUpload from "./ImageUpload";
import LoaddingSpinner from "./LoadingSpinner";

export default function UnEditableListItem(props) {
  const {
    title,
    dataType,
    data,
    link,
    lastItem,
    type,
    setAvatar,
    avatarRedux,
  } = props;

  const { showActionSheetWithOptions } = useActionSheet();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [pickedAvatar, setPickedAvatar] = useState();

  const userDataRedux = useSelector((state) => state.accountData.userInfo);

  const showUploadOption = () => {
    const actionOptions = ["Camera", "Choose from Album", "Cancel"];
    showActionSheetWithOptions(
      { title: "上传头像", options: actionOptions, cancelButtonIndex: 2 },
      (buttonIndex) => {
        switch (buttonIndex) {
          default:
            break;
          case 0:
            takePhoto();
            break;
          case 1:
            pickPhoto();
            break;
        }
      }
    );
  };

  const takePhoto = async () => {
    const imageUri = await ImageUpload.takeAvatarPhoto();

    setPickedAvatar(imageUri.uri);
    setAvatar(imageUri);
  };

  const pickPhoto = async () => {
    const imageUri = await ImageUpload.pickAvatarPhoto();

    setPickedAvatar(imageUri.uri);
    setAvatar(imageUri);
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
      } else if (link == "ChangeAvatar") {
        showUploadOption();
      } else {
        navigation.navigate(link);
      }
    } else {
      return;
    }
  };

  return (
    <TouchableOpacity onPress={() => handlePress()} activeOpacity={1}>
      {userDataRedux ? (
        <View
          style={
            lastItem === true
              ? [
                  styles.titleContainer,
                  { borderBottomWidth: 1, borderColors: Colors.midGrey },
                ]
              : styles.titleContainer
          }
        >
          <View style={styles.leftSideTitleContainer}>
            <Text style={styles.titleText}>{title}</Text>
          </View>

          {dataType === "image" ? (
            <View
              style={{
                flex: 0.7,
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
                source={{ uri: pickedAvatar ? pickedAvatar : avatarRedux }}
              />
            </View>
          ) : (
            <View
              style={{
                flex: 0.7,
                height: 30,
                alignItems: "center",
              }}
            >
              <Text numberOfLines={1} style={styles.contentText}>
                {data}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <LoaddingSpinner />
      )}
    </TouchableOpacity>
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
    paddingVertical: 13,
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
    alignSelf: "flex-end",
    fontSize: 16,
    lineHeight: 25,
  },
  leftSideTitleContainer: {
    flex: 0.25,
    //backgroundColor: "yellow",
    height: 30,
    justifyContent: "center",
  },
});
