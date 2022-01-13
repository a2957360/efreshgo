//react
import React, { useState, useEffect } from "react";

//redux
import { useDispatch, useSelector } from "react-redux";

//react navigation
import { useNavigation, useIsFocused } from "@react-navigation/native";

//react native components
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

//components
import NameCard from "./components/NameCard";
import AccountSummary from "./components/AccountSummary";
import MyOrders from "./components/MyOrders";
import SettingList from "./components/SettingList";
import Spacing from "../../components/Spacing";
import LoadingSpinner from "../../components/LoadingSpinner";

//packages
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n from "i18n-js";

//style
import { Colors } from "../../styles";

//translation data
import { languageData } from "../../i18n/i18n";

//config
import { screenHeight, screenWidth } from "../../config/settings";

import {
  resetGetVerificationResult,
  getUserInfomation,
} from "../../actions/account";

export default function User() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // const userDataRedux = useSelector((state) => state.accountData.userInfo);
  const userInfo = useSelector((state) => state.accountData.userInfo);

  useEffect(() => {
    getUserInfo();
  }, [isFocused]);

  const getUserInfo = async () => {
    const currentUser = JSON.parse(await AsyncStorage.getItem("currentUser"));

    if (!currentUser) {
      navigation.navigate("Login");
    } else {
      // if (currentUser !== userInfo.userNumber) {
      const data = {
        isGet: "1",
        userNumber: currentUser,
      };
      dispatch(getUserInfomation(data));
      // }
    }
  };

  if(!userInfo){
    return <LoadingSpinner />
  }
  else{
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ alignItems: "center" }}>
            <>
              <ImageBackground
                style={styles.imageBackgroundContainer}
                source={require("../../assets/user/bg.png")}
                contentContainerStyle={{ alignItems: "center" }}
              >
                <NameCard
                  data={{
                    avatar: userInfo.userImages,
                    name: userInfo.userName,
                    phone: userInfo.userPhone,
                  }}
                />
  
                <AccountSummary
                  data={{
                    credit: userInfo.userBalance,
                    point: userInfo.userPoint,
                  }}
                />
              </ImageBackground>
              <MyOrders orderTotal={userInfo.orderInfo} />
              <SettingList />
              <Spacing height="extraLarge" />
            </>
        </ScrollView>
      </View>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midGrey,
  },
  imageBackgroundContainer: {
    width: screenWidth,
    height: screenHeight * 0.3,
    alignItems: "center",
  },
});
