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
import { useNavigation } from "@react-navigation/native";

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

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  addProductToCart,
  resetAddProductToCartResultMessage,
  getProductFromCart,
} from "../actions/cart";

export default function TripleColumnItemList(props) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  let displayQuantity;
  const { listKey, data } = props;

  const [loadingVisible, setLoadingVisible] = useState(false);

  const userNumber = useSelector(
    (state) => state.accountData.userInfo.userNumber
  );

  const getProductFromCartResultData = useSelector(
    (state) => state.cartData.getProductFromCartResultData
  );

  const addProductToCartResultMessage = useSelector(
    (state) => state.cartData.addProductToCartResultMessage
  );

  // useEffect(() => {
  //   onPageLoadedGetProductFromCart();
  // }, []);

  // const onPageLoadedGetProductFromCart = async () => {
  //   const currentUser = JSON.parse(await AsyncStorage.getItem("currentUser"));
  //   const getProductDataInput = {
  //     isGet: "1",
  //     userNumber: currentUser,
  //   };

  //   dispatch(getProductFromCart(getProductDataInput));
  // };

  useEffect(() => {
    if (addProductToCartResultMessage == "success") {
      //setLoadingVisible(false);
      dispatch(resetAddProductToCartResultMessage());
    }
  }, [addProductToCartResultMessage]);

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
    if (getProductFromCartResultData) {
      const simpleCartList = Object.values(getProductFromCartResultData);
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
            id: item.id,
            title: item.text,
            itemNumber: item.itemNumber,
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
              source={{ uri: item.itemImages[0] }}
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
      {/* <Overlay isVisible={loadingVisible}>
        <LoadingSpinner />
      </Overlay> */}
      <FlatList
        keyExtractor={(item, index) => `tripleitem_${index.toString()}`}
        data={data}
        numColumns={3}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  mainContainer: {
    width: 0.33 * screenWidth,
    backgroundColor: Colors.white,
    marginRight: 1,
    marginBottom: 1,
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
  buttonContainer: {
    flex: 0.5,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
