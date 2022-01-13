import React, { useEffect, useState } from "react";

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

//config
import { screenWidth } from "../config/settings";

//style
import { Colors } from "../styles";

//component
import LoadingScreen from "../components/LoadingScreen";
import EmptyCart from "../screens/cart/components/EmptyCart";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  addProductToCart,
  resetAddProductToCartResultMessage,
  getProductFromCart,
} from "../actions/cart";

export default function SingleColumnItemList(props) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { listKey, data, favoriteProductData, searchedData } = props;

  const userNumber = useSelector(
    (state) => state.accountData.userInfo.userNumber
  );

  const getProductFromCartResultData = useSelector(
    (state) => state.cartData.getProductFromCartResultData
  );

  const isAddProductToCartLoading = useSelector(
    (state) => state.cartData.isAddProductToCartLoading
  );

  useEffect(() => {
    const data = {
      isGet: "1",
      userNumber: userNumber,
    };
    dispatch(getProductFromCart(data));
  }, []);

  const handleAddProduct = (item) => {
    const quantity = item.itemQuantity + 1;
    const data = {
      userNumber: userNumber,
      itemNumber: [item.itemNumber],
      itemQuantity: [quantity],
    };
    dispatch(addProductToCart(data));
  };

  const handleRemoveProduct = (item) => {
    if (item.itemQuantity > 0) {
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
    let displayQuantity;
    if (
      getProductFromCartResultData == "" ||
      !getProductFromCartResultData ||
      getProductFromCartResultData.length == 0
    ) {
      displayQuantity = 0;
    } else {
      let quantity = getProductFromCartResultData.filter(
        (element) => element.itemNumber === item.itemNumber
      );

      displayQuantity =
        quantity[0]?.itemQuantity !== undefined ? quantity[0]?.itemQuantity : 0;
      item.itemQuantity =
        quantity[0]?.itemQuantity !== undefined ? quantity[0]?.itemQuantity : 0;
    }
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.push("ProductDetail", {
            id: item.id,
            title: item.text,
            itemData: item,
            itemNumber: item.itemNumber,
          })
        }
        activeOpacity={1}
        //key={index}
        style={styles.mainContainer}
      >
        <View style={styles.itemCardContainer}>
          {/* 商品图片 */}
          <View>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{ uri: item.itemImages && item.itemImages[0] }}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* 商品名称*/}
          <View style={styles.infoContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.text} numberOfLines={1}>
                {item.itemTitle}
              </Text>
            </View>

            {/* 商品描述 */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.description} numberOfLines={1}>
                {item.itemSubTitle}
              </Text>
            </View>

            {/* 商品小标签 */}
            <FlatList
              //keyExtractor={(item, index) => index.toString()}
              data={item.itemTag}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderTag}
            />

            <View style={{ flexDirection: "row" }}>
              {/* 商品价格 */}
              <View style={styles.priceContainer}>
                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                  <Text style={styles.priceText}>
                    $
                    {item.itemDisplayPrice == item.itemPrice
                      ? item.itemPrice
                      : item.itemDisplayPrice}
                  </Text>

                  {item.itemDisplayPrice !== item.itemPrice ? (
                    <Text style={styles.itemPriceText}>${item.itemPrice}</Text>
                  ) : null}
                </View>
              </View>

              {/* 已添加物品button样式 */}
              <View style={styles.buttonContainer}>
                {item.itemQuantity !== 0 ? (
                  <Ionicons
                    onPress={() => handleRemoveProduct(item)}
                    style={{ alignSelf: "center", padding: 10 }}
                    name="md-remove-circle"
                    size={24}
                    color={Colors.primary}
                  />
                ) : (
                  <Ionicons
                    //onPress={() => handleRemoveProduct(item)}
                    style={{ alignSelf: "center", padding: 10 }}
                    name="md-remove-circle"
                    size={24}
                    color={Colors.white}
                  />
                )}

                {/* 商品数量 */}
                <View style={{ alignSelf: "center" }}>
                  <Text style={{ fontSize: 16, color: Colors.primary }}>
                    {displayQuantity != "0" ? displayQuantity : null}
                  </Text>
                </View>

                <Ionicons
                  onPress={() => handleAddProduct(item)}
                  style={{ alignSelf: "center", padding: 10 }}
                  name="md-add-circle"
                  size={24}
                  color={Colors.primary}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  //item tag
  const renderTag = ({ item, index }) => {
    return (
      <View>
        {item != "" ? (
          <View style={styles.tagContainer}>
            <Text style={styles.tag}>{item}</Text>
          </View>
        ) : (
          <Text></Text>
        )}
      </View>
    );
  };

  if (!data) {
    return <LoadingScreen />;
  } else {
    return (
      <View style={styles.container}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={data}
          numColumns={1}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          ListEmptyComponent={<EmptyCart emptyMessage={"This is empty!"} />}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    width: screenWidth,
    backgroundColor: Colors.white,
    marginRight: 1,
    marginBottom: 1,
  },
  itemCardContainer: {
    flex: 1,
    padding: 15,
    paddingBottom: 0,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  imageContainer: {
    flex: 1,
    marginRight: 15,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: screenWidth * 0.33 - 30,
    height: screenWidth * 0.33 - 30,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  titleContainer: {
    marginTop: 5,
  },
  title: {
    fontSize: 14,
  },
  descriptionContainer: {
    marginTop: 5,
  },
  description: {
    fontSize: 12,
  },
  tagContainer: {
    marginTop: 5,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    height: 20,
    marginRight: 5,
  },
  tag: {
    color: Colors.primary,
    fontSize: 10,
    padding: 0,
    margin: 0,
  },
  priceContainer: {
    flex: 3,
    marginTop: 5,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonContainer: {
    flex: 2.5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceText: {
    fontSize: 18,
    color: Colors.red,
  },
  itemPriceText: {
    fontSize: 12,
    color: Colors.darkGrey,
    textDecorationLine: "line-through",
    marginLeft: 5,
  },
});
