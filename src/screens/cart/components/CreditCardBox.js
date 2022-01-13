import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../../styles";

import DropDownPicker from "react-native-dropdown-picker";
import { screenHeight } from "../../../config/settings";

//react navigation
import { useNavigation } from "@react-navigation/native";

//package
import i18n from "i18n-js";
import { useDispatch, useSelector } from "react-redux";

import {
  setPayMethod,
  setCreditCardNumber,
  setCreditCardId,
} from "../../../../src/actions/checkout";

export default function CreditCardBox({
  name,
  togglePaymentOverlay,
  cardItem
}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const image = {
    Alipay: require("../../../assets/user/alipay.png"),
    WeChatPay: require("../../../assets/user/wechat.png"),
    CreditCard: require("../../../assets/user/creditCard.png"),
    Paypal: require("../../../assets/user/paypal.png"),
  };

  // const [selectedCreditCard, setSelectedCreditCard] = useState("");

  const handleDropDownSelector = (item) => {
    if (item.label == "Add credit card") {
      togglePaymentOverlay();
      navigation.navigate("PaymentSetting");
      // navigation.navigate("PaymentSetting", {
      //   setCreditCardLocalState: setCreditCardSelected,
      // });
    } else {
      dispatch(setPayMethod("CreditCard" + "*" + item.value));
      dispatch(setCreditCardId(item.id));
      dispatch(setCreditCardNumber(item.value));

      // setSelectedCreditCard(item.value);
      // setCreditCardSelected({ number: item.value, id: item.id });
      togglePaymentOverlay();
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* pay method logo */}
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={name ? image[name] : null} />
      </View>

      {/* pay method name */}
      <TouchableOpacity style={styles.nameContainer} onPress={() => {
          handleDropDownSelector(cardItem)
      }}>
          <>
            {/* <DropDownPicker
              placeholder={i18n.t("Choose a credit card")}
              items={cardList.data}
              defaultValue={selectedCreditCard}
              containerStyle={{ height: 40 }}
              style={styles.dropDownPickerContainer}
              itemStyle={{
                justifyContent: "flex-start",
              }}
              dropDownStyle={{ backgroundColor: Colors.lightGrey }}
              onChangeItem={(item) => handleDropDownSelector(item)}
            /> */}
            
        <Text style={{ paddingLeft: screenHeight * 0.015 }}>
        {cardItem.label}
        </Text>
            
          </>
        
        
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  logoContainer: {
    flex: 0.2,
    alignItems: "center",
  },
  logo: {
    height: 60,
    width: 25,
    resizeMode: "contain",
  },
  nameContainer: {
    height: 60,
    borderBottomWidth: 0.3,
    borderBottomColor: Colors.darkGrey,
    flex: 0.8,
    justifyContent: "center",
  },
  dropDown: {
    height: 30,
    backgroundColor: "white",
  },
  creditCardDropDownImage: {
    height: 18,
    width: 25,
    resizeMode: "contain",
    alignItems: "center",
  },
  dropDownPickerContainer: {
    backgroundColor: Colors.white,
    borderWidth: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
