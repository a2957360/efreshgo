import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

//config
import { screenHeight, screenWidth } from "../../../config/settings";

//react navigation
import { useNavigation } from "@react-navigation/native";

//style
import { Colors } from "../../../styles";

//components
import LoadingSpinner from "../../../components/LoadingSpinner";

//package
import i18n from "i18n-js";
import Stripe from "react-native-stripe-api";
import { TextInputMask } from "react-native-masked-text";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  addPaymentMethod,
  resetAddPaymentMethodMessage,
} from "../../../actions/cart";
import {
  setPayMethod,
  setCreditCardNumber,
  setCreditCardId,
} from "../../../actions/checkout";

export default function PaymentSetting(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const apiKey =
    "sk_test_51GoZXUKHz11Tdu2p4a4VA0hI332msIkeOLYAYl5KrzSf2WqYXkigYU5YqqcEtfLjwm2ksbCyZHT3EgWy4bVbkCA600MWHT625y";

  const addPaymentMethodResultMessage = useSelector(
    (state) => state.cartData.addPaymentMethodResultMessage
  );
  const addPaymentMethodResult = useSelector(
    (state) => state.cartData.addPaymentMethodResult
  );
  const client = new Stripe(apiKey);

  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [cvc, setCvc] = useState("");

  const [cardNumberRef, setCardNumberRef] = useState();

  const userDataRedux = useSelector((state) => state.accountData.userInfo);
  const isAddPaymentMethodLoading = useSelector(
    (state) => state.cartData.isAddPaymentMethodLoading
  );

  const handleSubmit = () => {
    const cardNumberRawList = cardNumberRef.getRawValue();
    const cardNumberRaw =
      cardNumberRawList[0] +
      cardNumberRawList[1] +
      cardNumberRawList[2] +
      cardNumberRawList[3];

    if (
      name.length < 1 ||
      cardNumber.length < 1 ||
      expireDate.length < 1 ||
      cvc.length < 1
    ) {
      Alert.alert(
        i18n.t("Error Message"),
        i18n.t("Please enter valid information!"),
        [{ text: i18n.t("Confirm"), style: "ok" }]
      );
    } else {
      getTokenAddPayMethod({
        number: cardNumberRaw,
        exp_month: expireDate.slice(0, 2),
        exp_year: expireDate.slice(3, 5),
        cvc: cvc,
        // address_zip: "12345",
      });
    }
  };

  useEffect(() => {
    if (addPaymentMethodResultMessage == "success") {
      // if (props.route.params?.setCreditCardLocalState != undefined) {
      //   props.route.params.setCreditCardLocalState({
      //     number: addPaymentMethodResult.value,
      //     id: addPaymentMethodResult.id,
      //   });
      // }

      dispatch(setPayMethod("CreditCard" + "*" + addPaymentMethodResult.value));
      dispatch(setCreditCardId(addPaymentMethodResult.id));
      dispatch(setCreditCardNumber(addPaymentMethodResult.value));

      setTimeout(() => {
        Alert.alert(i18n.t("Success"), i18n.t("addCreditCardSuccessMessage"), [
          {
            text: i18n.t("Confirm"),
            onPress: () => {
              dispatch(resetAddPaymentMethodMessage());
              navigation.goBack();
            },
            style: "ok",
          },
        ]);
      }, 100);
    }
  }, [addPaymentMethodResultMessage]);

  const getTokenAddPayMethod = async (cardInfo) => {
    const token = await client.createToken(cardInfo);

    const data = {
      userNumber: userDataRedux.userNumber,
      cardToken: token.id,
    };

    if (token.id) {
      dispatch(addPaymentMethod(data));
    }

    if (token.error) {
      Alert.alert(i18n.t("Error Message"), i18n.t("addCrediCardError"), [
        {
          text: i18n.t("Cancel"),
          onPress: () => dispatch(resetAddPaymentMethodMessage()),
          style: "cancel",
        },
      ]);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1, justifyContent: "space-between" }}
      keyboardDismissMode={"on-drag"}
    >
      <LoadingSpinner isVisible={isAddPaymentMethodLoading} />
      {/* input section */}
      <View style={styles.inputSection}>
        {/* name input */}
        <TextInput
          keyboardType={"name-phone-pad"}
          maxLength={15}
          value={name}
          onChangeText={(text) => setName(text)}
          placeholder={i18n.t("Name")}
          style={styles.nameInput}
        />

        {/* cardNumber input */}
        {/* <TextInput
          keyboardType={"numeric"}
          value={cardNumber}
          onChangeText={(text) => setCardNumberv(text)}
          style={styles.cardNumberInput}
          placeholder={i18n.t("Card Number")}
        /> */}

        <TextInputMask
          style={styles.cardNumberInput}
          type={"credit-card"}
          maxLength={19}
          options={{
            obfuscated: false,
            issuer: "visa-or-mastercard",
          }}
          value={cardNumber}
          onChangeText={(text) => setCardNumber(text)}
          ref={(ref) => setCardNumberRef(ref)}
          placeholder={i18n.t("Card Number")}
        />

        {/* expireDate & CVC input */}
        <View style={styles.expireCvcInput}>
          {/* expireDate input */}
          {/* <TextInput
            keyboardType={"numeric"}
            maxLength={4}
            value={expireDate}
            onChangeText={(text) => setExpireDate(text)}
            style={styles.expireDateInput}
            placeholder={i18n.t("Expiry Date")}
          /> */}

          <TextInputMask
            style={styles.expireDateInput}
            type={"datetime"}
            options={{
              format: "MM/YY",
            }}
            value={expireDate}
            maxLength={5}
            onChangeText={(text) => setExpireDate(text)}
            placeholder={i18n.t("Expiry Date MM/YY")}
          />

          {/* CVC code input */}
          <TextInput
            keyboardType={"numeric"}
            value={cvc}
            maxLength={3}
            onChangeText={(text) => setCvc(text)}
            style={styles.cvcInput}
            placeholder={i18n.t("CVC")}
          />
        </View>
      </View>

      {/* submit button */}
      <View style={styles.button}>
        <TouchableOpacity
          // disabled={
          //   name.length < 1 ||
          //   cardNumber.length < 1 ||
          //   expireDate.length < 1 ||
          //   cvc.length < 1
          // }
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
  nameInput: {
    height: screenHeight * 0.05,
    width: "90%",
    borderBottomWidth: 1,
    borderColor: Colors.darkGrey,
    marginTop: screenHeight * 0.05,
    marginBottom: 10,
  },
  cardNumberInput: {
    height: screenHeight * 0.05,
    width: "90%",
    borderBottomWidth: 1,
    borderColor: Colors.darkGrey,
    marginVertical: 10,
  },
  expireCvcInput: {
    width: "90%",
    height: screenHeight * 0.05,
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "space-between",
  },
  expireDateInput: {
    width: "60%",
    height: screenHeight * 0.05,
    borderBottomWidth: 1,
    borderColor: Colors.darkGrey,
  },
  cvcInput: {
    width: "30%",
    height: screenHeight * 0.05,
    borderBottomWidth: 1,
    borderColor: Colors.darkGrey,
    justifyContent: "center",
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
    backgroundColor: Colors.white,
  },
  inputSection: {
    flex: 0.65,
    paddingHorizontal: 10,
    alignItems: "center",
    backgroundColor: Colors.white,
  },
});
