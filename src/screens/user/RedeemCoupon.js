import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

//react navigation
import { useNavigation } from "@react-navigation/native";

import {
  StyleSheet,
  ScrollView,
  TextInput,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";

import { getCoupon } from "../../actions/coupon";

//style
import { Colors } from "../../styles";

import i18n from "i18n-js";

//config
import { screenHeight, screenWidth } from "../../config/settings";

//package
import axios from "axios";
import { serverUrl } from "../../config/settings";

export default function RedeemCoupon() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [code, setCode] = useState("");

  const userDataRedux = useSelector((state) => state.accountData.userInfo);

  const handleSubmit = async () => {
    const data = {
      userNumber: userDataRedux.userNumber,
      couponCode: code,
      isRender: "1",
    };
    // dispatch(redeemCoupon(data));
    // navigation.goBack();

    try {
      const res = await axios.post(`${serverUrl}couponModule.php`, data);

      if (res.status === 200) {
        const body = {
          userNumber: data.userNumber,
          isGet: "1",
        };
        dispatch(getCoupon(body));
        if (res.data.message == "fail") {
          alert(i18n.t("redeemCouponErrorMessage"));
        } 
        else if(res.data.message == "already add"){
          alert(i18n.t("redeemCouponErrorMessage"));
        }
        else if (res.data.message == "success") {
          alert(i18n.t("redeemCouponSuccessMessage"));
          navigation.goBack();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputSection}>
        <TextInput
          onChangeText={(text) => setCode(text)}
          value={code}
          placeholder={i18n.t("reDeemCouponPlaceHolder")}
          placeholderTextColor={Colors.darkGrey}
          style={styles.text}
          keyboardType={"twitter"}
        />
      </View>
      <View style={styles.button}>
        <TouchableOpacity
          disabled={code.length < 1}
          activeOpacity={1}
          style={styles.submit}
          onPress={() => handleSubmit()}
        >
          <Text style={{ color: Colors.white, fontSize: 16 }}>
            {i18n.t("Confirm")}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midGrey,
  },
  text: {
    fontSize: 16,
    height: 50,
    paddingHorizontal: 15,
    backgroundColor: Colors.white,
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
    flex: 0.35,
    alignItems: "center",
    justifyContent: "center",
  },
  inputSection: { flex: 0.65 },
});
