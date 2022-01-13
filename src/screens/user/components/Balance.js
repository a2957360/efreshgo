import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from "react-native";

//components
import TopUpMethod from "./TopUpMethod";
import TopUpAmount from "./TopUpAmount";
import PaymentModal from "../../cart/components/PaymentModal";

//styles
import { Colors } from "../../../styles";
import Spacing from "../../../components/Spacing";

//const
import { screenHeight, screenWidth } from "../../../config/settings";

//package
import i18n from "i18n-js";
import { Overlay } from "react-native-elements";

export default function Balance({ route }) {
  const credit = route.params.credit;

  const [visible, setVisible] = useState(false);
  const [creditCardSelected, setCreditCardSelected] = useState("");

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <ScrollView style={styles.mainContainer} keyboardDismissMode={"on-drag"}>
      {/* 账户余额 */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>
          {i18n.t("Account Balance")}: ${credit}
        </Text>
      </View>
      <Spacing height="large" />
      {/* 充值方式 */}
      <View style={styles.method}>
        <TopUpMethod
          route={route}
          toggleOverlay={toggleOverlay}
          creditCardSelected={creditCardSelected}
        />
      </View>
      <Spacing height="large" />
      {/* 充值数额 */}
      <View style={styles.amountContainer}>
        <TopUpAmount />
      </View>

      {/* overlay */}
      <Overlay
        isVisible={visible}
        onBackdropPress={() => toggleOverlay()}
        overlayStyle={{
          width: "100%",
          height: "50%",
          position: "absolute",
          bottom: 0,
        }}
      >
        <PaymentModal
          togglePaymentOverlay={toggleOverlay}
          setCreditCardSelected={setCreditCardSelected}
        />
      </Overlay>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    //flex: 1,
    backgroundColor: Colors.midGreyGrey,
  },
  balanceContainer: {
    width: screenWidth,
    height: screenHeight * 0.08,
    backgroundColor: Colors.white,
    justifyContent: "center",
    paddingLeft: screenWidth * 0.04,
  },
  method: {
    width: screenWidth,
    height: screenHeight * 0.06,
    backgroundColor: Colors.white,
  },

  balanceText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  amountContainer: {
    width: screenWidth,
    height: screenHeight * 0.14,
    backgroundColor: Colors.white,
  },
});
