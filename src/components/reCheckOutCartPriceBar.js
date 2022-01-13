import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Button,
  ActivityIndicator,
} from "react-native";
import WebView from "react-native-webview";
import { Colors } from "../styles";

//packages
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";
import { serverUrl } from "../config/settings";

//translation data
import { languageData } from "../i18n/i18n";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  makeOrder,
  resetMakeOrderResultMessage,
  setMakeOrderLoading,
} from "../actions/cart";
import { changeOrderState } from "../actions/order";
import { reCheckOutMakeOrder } from "../actions/reCheckOut";

//alipay package
import Alipay from "../Alipay";
import axios from "axios";
import sha256 from "sha256";

export default function ReCheckOutCartPriceBar(props) {
  i18n.translations = languageData;
  const dispatch = useDispatch();

  const {
    price,
    newPrice,
    buttonText,
    navigationPage,
    isEmpty,
    type,
    orderData,
    number,
  } = props.data;
  const { togglePaymentOverlay,setLocalMakeOrderLoading } = props;

  const navigation = useNavigation();

  const languageCode = useSelector((state) => state.accountData.language);

  const userNumber = useSelector(
    (state) => state.accountData.userInfo.userNumber
  );

  const orderAddress = useSelector(
    (state) => state.addressData.selectedAddress.addressStreet
  );

  const addressComment = useSelector(
    (state) => state.addressData.selectedAddress.addressComment
  );
  const addressPhone = useSelector(
    (state) => state.addressData.selectedAddress.addressPhone
  );
  const addressUsername = useSelector(
    (state) => state.addressData.selectedAddress.addressUsername
  );
  const addressRoomNo = useSelector(
    (state) => state.addressData.selectedAddress.addressRoomNo
  );

  // const makeOrderResultData = useSelector(
  //   (state) => state.cartData.makeOrderResultData
  // );
  const selectedPayMethod = useSelector((state) => state.paymentData.method);
  // const creditCardId = useSelector((state) => state.paymentData.creditCardId);

  const deliveryTime = useSelector((state) => state.accountData.deliveryTime);
  const deliveryDate = useSelector((state) => state.accountData.deliveryDate);
  // const makeOrderResultMessage = useSelector(
  //   (state) => state.accountData.makeOrderResultMessage
  // );

  //alipay state
  const [appOrder, setAppOrder] = useState("");

  const [paypalModal, setPaypalModal] = useState({ open: false, uri: "" });
  
  const makeOrderAsync = async () => {
    const data = {
      isUpdate: "1",
      language: languageCode,
      userNumber: userNumber,
      orderAddress: `Room#: ${addressRoomNo}, ` + orderAddress,
      deliverType: orderData.isPickUpSelected ? "0" : "1",
      expectDeliverTime: deliveryDate + deliveryTime.split("-")[1] + ":00",
      paymentType: "CreditCard",
      cardId: orderData.cardId,
      itemPrice: orderData.itemPrice,
      deliverPrice: orderData.deliverPrice,
      couponPrice: orderData.couponPrice,
      orderTax: orderData.orderTax,
      totalPrice: orderData.totalPrice,
      couponNumber: orderData.couponNumber,
      storeNumber: orderData.storeNumber,
      orderNumber: orderData.orderNumber,
      itemList: orderData.itemList,
      orderComent: addressComment,
      orderUserPhone: addressPhone,
      orderUserName: addressUsername
    };
    dispatch(setMakeOrderLoading(true));
    dispatch(reCheckOutMakeOrder(data));
  };

  const makeAlipayOrderAsync = async (payment) => {
    const data = {
      isUpdate: "1",
      language: languageCode,
      userNumber: userNumber,
      orderAddress: `Room#: ${addressRoomNo}, ` + orderAddress,
      deliverType: orderData.isPickUpSelected ? "0" : "1",
      expectDeliverTime: deliveryDate + deliveryTime.split("-")[1] + ":00",
      paymentType: payment,
      itemPrice: orderData.itemPrice,
      deliverPrice: orderData.deliverPrice,
      couponPrice: orderData.couponPrice,
      orderTax: orderData.orderTax,
      totalPrice: orderData.totalPrice,
      couponNumber: orderData.couponNumber,
      storeNumber: orderData.storeNumber,
      orderNumber: orderData.orderNumber,
      itemList: orderData.itemList,
      orderNo: orderData.orderNo,
      orderComent: addressComment,
      orderUserPhone: addressPhone,
      orderUserName: addressUsername
    };
    setLocalMakeOrderLoading(true)
    dispatch(reCheckOutMakeOrder(data));
  };

  const handlePress = () => {
    if (!isEmpty) {
      if (type !== "order") {
        navigation.navigate(navigationPage);
      } else {
        //下单
        if (selectedPayMethod && orderAddress && deliveryDate && deliveryTime) {
          handlePayment(selectedPayMethod);
        } else {
          Alert.alert(
            i18n.t("Error Message"),
            i18n.t(
              "Please make sure you have completed the infomations before making an order!"
            ),
            [
              {
                text: i18n.t("Confirm"),
                onPress: () => {
                  return;
                },
                style: "ok",
              },
            ]
          );
        }
      }
    }
  };

  //下单
  const handlePayment = (selectedPayMethod) => {
    if (selectedPayMethod == "Paypal") {
      handlePaypal();
    } else if (selectedPayMethod == "WeChatPay") {
      console.log("paying by wechat");
      makeAlipayOrderAsync("WeChatPay");
    } else if (selectedPayMethod == "Alipay") {
      makeAlipayOrderAsync("Alipay");
    } else if (selectedPayMethod.includes("CreditCard")) {
      if (orderData.cardId != "") {
        makeOrderAsync();
      } else {
        Alert.alert("Error Message", "Please select a credit card!", [
          {
            text: "Confirm",
            onPress: () => {
              togglePaymentOverlay("PaymentOptions");
            },
            style: "ok",
          },
        ]);
      }
    }
  };

  const handlePaypal = async () => {
    const data = {
      language: languageCode,
      userNumber: userNumber,
      orderAddress: orderAddress,
      deliverType: orderData.isPickUpSelected ? "0" : "1",
      expectDeliverTime: deliveryDate + deliveryTime.split("-")[1] + ":00",
      paymentType: "Paypal",
      itemPrice: orderData.itemPrice,
      deliverPrice: orderData.deliverPrice,
      couponPrice: orderData.couponPrice,
      orderTax: orderData.orderTax,
      totalPrice: orderData.totalPrice,
      couponNumber: orderData.couponNumber,
      storeNumber: orderData.storeNumber,
      orderComent: addressComment,
      userPhone: addressPhone
    };
    // dispatch(setMakeOrderLoading(true));
    const makeOrderResult = await axios.post(
      `${serverUrl}orderModule.php`,
      data
    );
    const paypalOrder = await axios.post(`${serverUrl}paypalPayment.php`, {
      orderNumber: makeOrderResult.data.data.orderNumber,
    });

    if (paypalOrder.data.data.links) {
      navigation.navigate("Paypal", {
        link: paypalOrder.data.data.links,
        userNumber: userNumber,
        orderNumber: makeOrderResult.data.data.orderNumber,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.cartIconContainer}>
          <Image
            style={styles.image}
            source={require("../assets/product/cart.png")}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.priceTextContainer}>${price}</Text>

        {newPrice ? (
          <Text style={styles.newPriceContainer}>${newPrice}</Text>
        ) : null}
      </View>

      <TouchableOpacity
        activeOpacity={1}
        style={styles.buttonContainer}
        onPress={() => handlePress()}
      >
        <View style={isEmpty ? [styles.button, styles.bgc] : styles.button}>
          <Text style={styles.buttonText}>
            {i18n.t(buttonText)}
            {/* {number && "(" + number + ")"} */}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopColor: Colors.lightGrey,
    borderTopWidth: 1,
  },
  image: {
    width: 25,
    height: 25,
  },
  button: {
    borderRadius: 20,
    height: 40,
    //width: 120,
    marginRight: 20,
    paddingVertical: 3,
    paddingHorizontal: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
  },
  buttonText: {
    color: Colors.white,
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 16,
    textAlign: "center",
  },
  bgc: {
    backgroundColor: Colors.darkGrey,
  },
  subContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
  },
  cartIconContainer: {
    borderRightWidth: 1,
    borderRightColor: Colors.lightGrey,
    paddingRight: 20,
  },
  priceTextContainer: {
    color: Colors.red,
    fontSize: 20,
    fontWeight: "500",
    marginLeft: 15,
  },
  newPriceContainer: {
    fontSize: 16,
    color: Colors.black,
    textDecorationLine: "line-through",
    alignSelf: "flex-end",
    marginLeft: 10,
  },
  buttonContainer: {
    justifyContent: "center",
  },
});
