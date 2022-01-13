
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";

//packages
import i18n from "i18n-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { serverUrl } from "../../config/settings";

//styles
import { Colors } from "../../styles";

//components
import LoginFooter from "./components/LoginFooter";
import InputSection from "./components/InputSection";
import LoadingScreen from "../../components/LoadingScreen";

//translation data
import { languageData } from "../../i18n/i18n";

//constant
import { screenHeight } from "../../config/settings";
import { screenWidth } from "../../config/settings";

//redux
import { useDispatch, useSelector } from "react-redux";
import { getUserInfomation } from "../../actions/account";
import { resetGetVerificationResult } from "../../actions/account";

export default function Login({ navigation }) {
  i18n.translations = languageData;
  const dispatch = useDispatch();

  const [verifyInput, setVerifyInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");

  //language code stored in redux
  const language = useSelector((state) => state.accountData.language);

  const isLoginLoading = useSelector((state) => state.accountData.isLoginLoading);

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    const userNumber = JSON.parse(await AsyncStorage.getItem("currentUser"));
    //第一次进来,没有存localstorage
    if(!userNumber){
      return
    }
    else{
      const query = {
        isGet: 1,
        userNumber: userNumber,
      };
      await axios.post(`${serverUrl}userModule.php`, query).then((res) => {
         // 如果这个用户不存在或者被删掉，清楚localstorage
        if(!res.data.data){
          clearLocalStorage();
          dispatch(resetGetVerificationResult());
          Alert.alert(systemErrorMessage);
        }
        //如果用户存在，存userInfo,跳转到首页
        else{
          dispatch(getUserInfomation(query));
          navigation.replace("Home")
        }
      })
    }
  }
  const clearLocalStorage = async () => {
    try {
      await AsyncStorage.removeItem("currentUser");
      await AsyncStorage.removeItem("addressLocal");
    } catch (error) {
      console.log(error);
    }
  };

 
  if (!language) {
    return <LoadingScreen />;
  } else if (isLoginLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  } else {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView keyboardDismissMode={"on-drag"}>
          {/* logo */}
          <View style={styles.logoContainer}>
            {/* mainLogo */}

            <Image
              source={
                language == "En"
                  ? require("../../assets/login/mainLogoEn.png")
                  : require("../../assets/login/mainLogo.png")
              }
              style={language == "En" ? styles.mainLogoEn : styles.mainLogoCh}
            />
          </View>

          {/* InputSection */}
          <View style={{ height: screenHeight * 0.3 }}>
            <InputSection
              language={language}
              verifyInput={verifyInput}
              setVerifyInput={setVerifyInput}
              phoneInput={phoneInput}
              setPhoneInput={setPhoneInput}
            />
          </View>

          {/* LoginFooter */}
          <View style={{ height: screenWidth * 0.65 }}>
            <LoginFooter
              language={language}
              verifyInput={verifyInput}
              phoneInput={phoneInput}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  logoContainer: {
    height: screenHeight * 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  mainLogoEn: {
    height: screenHeight * 0.18,
    width: screenWidth * 0.34,
    resizeMode: "contain",
  },
  mainLogoCh: {
    height: screenHeight * 0.15,
    width: screenWidth * 0.3,
    resizeMode: "contain",
  },
});

 // if(loading){
  //   return(
  //     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
  //       <ActivityIndicator size='large' />
  //     </View>
  //   )
  // }else{

// const getUserInfo = async () => {
//   // await AsyncStorage.removeItem("currentUser");
//   // return;
//   const userNumber = JSON.parse(await AsyncStorage.getItem("currentUser"));
//   if (!userNumber) {
//     return;
//   } 
//   else {
//     const query = {
//       isGet: 1,
//       userNumber: userNumber,
//     };
//     // dispatch(getUserInfomation(query))
//     await axios.post(`${serverUrl}userModule.php`, query).then((res) => {
//       // 如果这个用户不存在或者被删掉，清楚localstorage
//       if(!res){
//         console.log('here no user')
//         clearLocalStorage();
//         dispatch(resetGetVerificationResult());
//         Alert.alert(systemErrorMessage);
//       }
//       //如果用户存在，存userInfo
//       else{
//         dispatch({
//           type: GET_USER_INFO_SUCCESS,
//           payload: res.data,
//         });
//         navigation.replace("Home")
//       }
//     })
  
// };