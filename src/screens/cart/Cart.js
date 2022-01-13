//react
import React, { useState, useEffect } from "react";

//redux
import { useDispatch, useSelector } from "react-redux";

//react navigation
import { useNavigation, useIsFocused } from "@react-navigation/native";

//react native components
import { StyleSheet, View } from "react-native";

//components
import Spacing from "../../components/Spacing";
import CartPriceBar from "../../components/CartPriceBar";
import CartSingleColumnItemList from "./components/CartSingleColumnItemList";
import LoadingScreen from "../../components/LoadingScreen";

//packages
import i18n from "i18n-js";

//config
import { productList } from "../../config/data";
import { screenHeight, screenWidth } from "../../config/settings";

//style
import { Colors } from "../../styles";

//translation data
import { languageData } from "../../i18n/i18n";

import {
  getProductPriceCart,
  resetAddProductToCartResultMessage,
} from "../../actions/cart";

function Cart() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const userNumber = useSelector(
    (state) => state.accountData.userInfo.userNumber
  );

  const languageCode = useSelector((state) => state.accountData.language);

  const getProductPriceCartResultData = useSelector(
    (state) => state.cartData.getProductPriceCartResultData
  );

  const addProductToCartResultMessage = useSelector(
    (state) => state.cartData.addProductToCartResultMessage
  );

  const selectedAddress = useSelector(
    (state) => state.addressData.selectedAddress
  );
  const selectedStore = useSelector((state) => state.accountData.deliveryStore);

  const deliverTypeRedux = useSelector(
    (state) => state.cartData.deliverTypeRedux
  );

  const deliveryDate = useSelector((state) => state.accountData.deliveryDate);
  const deliveryTime = useSelector((state) => state.accountData.deliveryTime);

  //render data
  const itemsPrice = getProductPriceCartResultData;
  const cartItems = getProductPriceCartResultData;

  useEffect(() => {
    const data = {
      deliverType: deliverTypeRedux == "Store Delivery" ? "1" : "0",
      isGetPrice: "1",
      userNumber: userNumber,
      language: languageCode,
      userGeometry: selectedAddress ? selectedAddress.addressGeometry : "",
      storeGeometry: selectedStore ? selectedStore.storeLocation : "",
      expectDeliverTime:
        deliveryDate && deliveryTime
          ? deliveryDate + " " + deliveryTime.slice(8) + ":00"
          : "",
    };

    dispatch(getProductPriceCart(data));
  }, [isFocused]);

  useEffect(() => {
    if (addProductToCartResultMessage == "success") {
      const data = {
        deliverType: deliverTypeRedux == "Store Delivery" ? "1" : "0",
        isGetPrice: "1",
        userNumber: userNumber,
        storeNumber: "1",
        language: languageCode,
        userGeometry: selectedAddress ? selectedAddress.addressGeometry : "",
        storeGeometry: selectedStore ? selectedStore.storeLocation : "",
        expectDeliverTime:
          deliveryDate && deliveryTime
            ? deliveryDate + " " + deliveryTime.slice(8) + ":00"
            : "",
      };

      dispatch(getProductPriceCart(data));
      dispatch(resetAddProductToCartResultMessage());
    }
  }, [addProductToCartResultMessage]);

  if (!getProductPriceCartResultData) {
    return <LoadingScreen />;
  } else {
    return (
      <View style={styles.container}>
        <>
          <View style={{ flex: 0.9 }}>
            <CartSingleColumnItemList data={cartItems.itemList} />
          </View>

          {/* 购物车bar
            price：购物车总价
            number：物品数量 */}
          <View style={{ flex: 0.1 }}>
            <CartPriceBar
              data={{
                buttonText: "GoCheckout",
                navigationPage: "Checkout",
                price: itemsPrice.itemPrice,
                isEmpty: cartItems.itemList.length == 0 ? true : false,
                number: getProductPriceCartResultData.totalQuantity,
              }}
            />
          </View>
        </>
      </View>
    );
  }
}

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midGrey,
  },
  button: {
    borderRadius: 8,
    marginLeft: 25,
    marginRight: 25,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: "#f01d71",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 16,
    textAlign: "center",
  },
  image: {
    marginTop: 0.15 * screenHeight,
    height: screenWidth * 0.33,
    width: screenWidth * 0.33,
    resizeMode: "contain",
  },
  statement: {
    fontSize: 23,
    color: Colors.darkGrey,
    marginTop: 20,
  },
  darkButton: {
    backgroundColor: Colors.darkGrey,
  },
});

//empty

// (
//           <CartPriceBar
//             data={{
//               buttonText: "GoCheckout",
//               navigationPage: "Checkout",
//               price: 0,
//               number: 2,
//               isEmpty: true,
//             }}
//           />
//         )
