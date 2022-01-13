import React, { useState, useEffect } from "react";

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

//react navigation
import { useNavigation, useIsFocused } from "@react-navigation/native";

//packages
import { Ionicons } from "@expo/vector-icons";
import { Overlay } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

//config
import { screenWidth } from "../config/settings";

//style
import { Colors } from "../styles";

//component
import LoadingSpinner from "../components/LoadingSpinner";
import Spacing from "./Spacing";
import LoadingScreen from "../components/LoadingScreen";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  addProductToCart,
  resetAddProductToCartResultMessage,
  getProductFromCart,
  reGetProductFromCart,
  resetMakeOrderResultMessage,
} from "../actions/cart";

export default function SingleRowItemList(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  let displayQuantity;
  const { data, productFromCartData } = props;
  const [loadingVisible, setLoadingVisible] = useState(false);

  const userNumber = useSelector(
    (state) => state.accountData.userInfo.userNumber
  );

  const addProductToCartResultMessage = useSelector(
    (state) => state.cartData.addProductToCartResultMessage
  );

  const makeOrderResultMessage = useSelector(
    (state) => state.cartData.makeOrderResultMessage
  );

  // useEffect(() => {
  //   onPageLoadedGetProductFromCart();
  // }, [isFocused]);

  // const onPageLoadedGetProductFromCart = async () => {
  //   const currentUser = JSON.parse(await AsyncStorage.getItem("currentUser"));
  //   const getProductDataInput = {
  //     isGet: "1",
  //     userNumber: currentUser,
  //   };
  //   dispatch(reGetProductFromCart(getProductDataInput));
  // };

  const handleAddProduct = (item) => {
    const quantity = item.itemQuantity + 1;
    //setLoadingVisible(true);
    const data = {
      userNumber: userNumber,
      itemNumber: [item.itemNumber],
      itemQuantity: [quantity],
    };
    dispatch(addProductToCart(data));
  };

  const handleRemoveProduct = (item) => {
    if (item.itemQuantity > 0) {
      setLoadingVisible(true);
      const quantity = item.itemQuantity - 1;
      const data = {
        userNumber: userNumber,
        itemNumber: [item.itemNumber],
        itemQuantity: [quantity],
      };
      dispatch(addProductToCart(data));
    }
  };

  const renderItem = ({ item, index }) => {
    if (productFromCartData) {
      const simpleCartList = Object.values(productFromCartData);

      if (simpleCartList) {
        let quantity = simpleCartList.filter(
          (element) => element.itemNumber === item.itemNumber
        );

        displayQuantity =
          quantity[0]?.itemQuantity !== undefined
            ? quantity[0]?.itemQuantity
            : 0;
        item.itemQuantity =
          quantity[0]?.itemQuantity !== undefined
            ? quantity[0]?.itemQuantity
            : 0;
      }
    } else {
      displayQuantity = 0;
    }

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.push("ProductDetail", {
            title: item.text,
            itemNumber: item.itemNumber,
            targetItemNumber: item.itemNumber,
          })
        }
        activeOpacity={1}
        key={index}
        style={styles.mainContainer}
      >
        <View style={styles.itemCardContainer}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{
                uri: item.itemImages && item.itemImages[0],
              }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {item.itemTitle}
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <View style={{ flex: 0.5 }}>
              <Text style={styles.priceText}>${item.itemDisplayPrice}</Text>
              {item.itemPrice !== item.itemDisplayPrice ? (
                <Text style={styles.itemPriceText}>${item.itemPrice}</Text>
              ) : null}
            </View>

            {/* 添加物品button样式 */}
            <View style={styles.buttonContainer}>
              {/* {displayQuantity !== 0 ? (
                <Ionicons
                  onPress={() => handleRemoveProduct(item)}
                  style={{ alignSelf: "center" }}
                  name="md-remove-circle"
                  size={20}
                  color={Colors.primary}
                />
              ) : (
                <Ionicons
                  onPress={() => handleRemoveProduct(item)}
                  style={{ alignSelf: "center" }}
                  name="md-remove-circle"
                  size={20}
                  color={Colors.white}
                />
              )} */}

              {/* 商品数量 */}
              <View style={{ alignSelf: "center", padding: 5 }}>
                <Text style={{ fontSize: 16, color: Colors.primary }}>
                  {displayQuantity != "0" ? displayQuantity : null}
                </Text>
              </View>

              <Ionicons
                onPress={() => handleAddProduct(item)}
                style={{ alignSelf: "center" }}
                name="md-add-circle"
                size={26}
                color={Colors.primary}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Spacing height="medium" />
      <FlatList
        keyExtractor={(item, index) => `itemRow_${index.toString()}`}
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: 0.33 * screenWidth,
    backgroundColor: Colors.white,
    marginRight: 1,
  },
  container: {
    flex: 1,
    //marginVertical: 8,
  },
  itemCardContainer: {
    flex: 1,
    padding: 10,
    paddingRight: 0,
    justifyContent: "space-between",
  },
  image: {
    width: screenWidth * 0.33 - 20,
    height: screenWidth * 0.33 - 20,
  },
  imageContainer: {},
  titleContainer: {
    marginTop: 5,
    height: 30,
  },
  title: {
    fontSize: 12,
  },
  priceContainer: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 40,
  },
  buttonContainer: {
    flex: 0.5,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  priceText: {
    fontSize: 18,
    color: Colors.red,
  },
  itemPriceText: {
    fontSize: 12,
    color: Colors.darkGrey,
    textDecorationLine: "line-through",
  },
});
