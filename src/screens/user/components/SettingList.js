import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

//react navigation
import {
  useNavigation,
  CommonActions,
  StackActions,
} from "@react-navigation/native";
import {
  resetGetVerificationResult,
  resetUserInfo,
} from "../../../actions/account";

import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

//style
import { Colors } from "../../../styles";

//config
import { screenHeight, screenWidth } from "../../../config/settings";

//package
import i18n from "i18n-js";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const settingMenu = [
  {
    image: require("../../../assets/user/coupon.png"),
    text: "MyCoupon",
    link: "Coupon",
  },
  {
    image: require("../../../assets/user/star.png"),
    text: "MyFavorite",
    link: "Favorite",
  },
  {
    image: require("../../../assets/user/address.png"),
    text: "MyAddress",
    link: "Address",
  },
  {
    image: require("../../../assets/user/card.png"),
    text: "MyPayment",
    link: "Payment",
  },
  {
    image: require("../../../assets/user/setting.png"),
    text: "MyAccount",
    link: "Account",
  },
  {
    image: require("../../../assets/user/phone.png"),
    text: "Contact",
    link: "Contact",
  },
  {
    image: require("../../../assets/user/exit.png"),
    text: "Exit",
    link: "Exit",
  },
];

export default function SettingList() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handlePress = (item) => {
    if (item.link == "Exit") {
      clearLocalStorage();
      dispatch(resetGetVerificationResult());
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
        key: null,
      });
    } else if (item.link == "Address") {
      navigation.navigate("Address", { userSettingFlag: true });
    } else {
      navigation.navigate(item.link);
    }
  };

  // const handleExit = async () => {
  //   //clear local storage
  //   clearLocalStorage();

  //   //clear redux userInfo & checkVerificationCodeResultMessage
  //   dispatch(resetGetVerificationResult());

  //   //navigation to Login
  //   navigation.reset({
  //     index: 0,
  //     routes: [{ name: "LoginStack" }],
  //     key: null,
  //   });
  // };

  const clearLocalStorage = async () => {
    try {
      await AsyncStorage.removeItem("currentUser");
      await AsyncStorage.removeItem("addressLocal");
    } catch (error) {
      console.log(error);
    }
  };

  const clearLocalAddress = async () => {
    try {
      await AsyncStorage.removeItem("addressLocal");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {settingMenu.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(item)}
            activeOpacity={1}
          >
            <View
              style={
                index === settingMenu.length - 1
                  ? styles.itemContainer
                  : [styles.itemContainer, styles.borderBottom]
              }
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  style={styles.image}
                  source={item.image}
                  resizeMode="contain"
                />

                <Text style={styles.text}>{i18n.t(item.text)}</Text>
              </View>

              <MaterialIcons
                name="navigate-next"
                size={24}
                color={Colors.darkGrey}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth * 0.9,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  itemContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 10,
  },
  borderBottom: {
    borderBottomColor: Colors.lightGrey,
    borderBottomWidth: 1,
  },
  image: {
    height: 25,
    width: 25,
  },
  text: {
    marginLeft: 10,
  },
});
