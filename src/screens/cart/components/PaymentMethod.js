import React from "react";
import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";

//component
import PayMethodBox from "./PayMethodBox";
import CreditCardBox from "./CreditCardBox";

import { setPayMethod } from "../../../../src/actions/checkout";

export default function PaymentMethod({togglePaymentOverlay}) {
  const dispatch = useDispatch();

  //credit card list
  const cardList = useSelector((state) => state.cartData.getPaymentMethodData.data);

  const handlePress = (method) => {
    dispatch(setPayMethod(method));
    togglePaymentOverlay();
  };

  console.log('this is cardList',cardList)

  const renderLayout = () => {
    return (
      <View >
        <TouchableOpacity
          onPress={() => {
            handlePress("Paypal");
          }}
        >
          <View >
            <PayMethodBox name={"Paypal"} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            handlePress("Alipay");
          }}
        >
          <View >
            <PayMethodBox name={"Alipay"} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            handlePress("WeChatPay");
          }}
        >
          <View >
            <PayMethodBox name={"WeChatPay"} />
          </View>
        </TouchableOpacity>

        <View>
          {cardList && cardList.length != 0 && 
          cardList.map((element) =>  
          <CreditCardBox
            name={"CreditCard"}
            togglePaymentOverlay={togglePaymentOverlay}
            // setCreditCardSelected={setCreditCardSelected}
            cardItem={element}
          />)
          }        
        </View>
      </View>
    );
  };

  return (
    <FlatList
      keyExtractor={(item, index) => index.toString()}
      style={styles.container}
      showsVerticalScrollIndicator={false}
      data={null}
      ListEmptyComponent={renderLayout}
    />
  );
}

const styles = StyleSheet.create({});
