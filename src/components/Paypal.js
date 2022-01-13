import React from "react";
import { WebView } from "react-native-webview";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { serverUrl } from "../config/settings";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import i18n from "i18n-js";

export default function Paypal() {
  const route = useRoute();
  const navigation = useNavigation();
  const { link, orderNumber, userNumber } = route.params;

  const handlePaypalResponse = async (data) => {
    if (!data.navigationType && data.title === "") {
      const query = {
        userNumber: userNumber,
        orderNumber: orderNumber,
        paymentType: "Paypal",
        orderState: "1",
      };
      const result = await axios.post(`${serverUrl}userOrderManage.php`, query);
      if (result.data.message === "success") {
        Alert.alert(i18n.t("PaymentSuccess"));
        navigation.replace("OrderDetail", {
          state: " ",
          stateText: "All Orders",
        });
      }
    }
  };

  return (
    <WebView
      source={{ uri: link }}
      onNavigationStateChange={(data) => handlePaypalResponse(data)}
    />
  );
}
