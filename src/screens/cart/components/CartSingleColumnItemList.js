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
import { screenWidth, screenHeight } from "../../../config/settings";

//style
import { Colors } from "../../../styles";

//component
import LoadingSpinner from "../../../components/LoadingSpinner";
import EmptyCart from "./EmptyCart";

//redux
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addProductToCart,
  resetAddProductToCartResultMessage,
} from "../../../actions/cart";

export default function CartSingleColumnItemList(props) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loadingVisible, setLoadingVisible] = useState(false);
  const { listKey, data } = props;

  const userNumber = useSelector(
    (state) => state.accountData.userInfo.userNumber
  );

  const getProductPriceCartResultData = useSelector(
    (state) => state.cartData.getProductPriceCartResultData
  );

  const addProductToCartResultMessage = useSelector(
    (state) => state.cartData.addProductToCartResultMessage
  );

  useEffect(() => {
    if (addProductToCartResultMessage == "success") {
      //setLoadingVisible(false);
      dispatch(resetAddProductToCartResultMessage());
    }
  }, [addProductToCartResultMessage]);

  const modifyQuantity = (itemNumber, quantity, type) => {
    if (type == "add") {
      //setLoadingVisible(true);
      const sendQuantity = quantity + 1;
      const data = {
        userNumber: userNumber,
        itemNumber: [itemNumber],
        itemQuantity: [sendQuantity],
      };
      dispatch(addProductToCart(data));
    } else {
      if (quantity > 0) {
        //setLoadingVisible(true);
        const sendQuantity = quantity - 1;
        const data = {
          userNumber: userNumber,
          itemNumber: [itemNumber],
          itemQuantity: [sendQuantity],
        };
        dispatch(addProductToCart(data));
      }
    }
  };

  const handlePress = (item) => {
    navigation.push("ProductDetail", {
      id: item.id,
      title: item.text,
      itemData: item,
      itemNumber: item.itemNumber,
    });
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => handlePress(item)}
        activeOpacity={1}
        key={index}
        style={styles.renderItemContainer}
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
              keyExtractor={(item, index) => index.toString()}
              data={item.itemTag.split(",")}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderTag}
            />

            <View style={{ flexDirection: "row" }}>
              {/* 商品价格 */}
              <View style={styles.priceContainer}>
                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                  <Text style={styles.itemDisplayPriceText}>
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
                {item.itemQuantity != 0 ? (
                  <Ionicons
                    onPress={() =>
                      modifyQuantity(
                        item.itemNumber,
                        item.itemQuantity,
                        "remove"
                      )
                    }
                    style={{ alignSelf: "center", padding: 10 }}
                    name="md-remove-circle"
                    size={24}
                    color={Colors.primary}
                  />
                ) : (
                  <Ionicons
                    // onPress={() =>
                    //   modifyQuantity(
                    //     item.itemNumber,
                    //     item.itemQuantity,
                    //     "remove"
                    //   )
                    // }
                    style={{ alignSelf: "center", padding: 10 }}
                    name="md-remove-circle"
                    size={24}
                    color={Colors.white}
                  />
                )}

                <View style={{ alignSelf: "center" }}>
                  <Text style={{ fontSize: 16, color: Colors.primary }}>
                    {item.itemQuantity ? item.itemQuantity : null}
                  </Text>
                </View>

                <Ionicons
                  onPress={() =>
                    modifyQuantity(item.itemNumber, item.itemQuantity, "add")
                  }
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
      <View style={styles.tagContainer}>
        <Text style={styles.tag}>{item}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <Overlay isVisible={loadingVisible}>
        <LoadingSpinner />
      </Overlay> */}
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={data}
        numColumns={1}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        ListEmptyComponent={
          <EmptyCart emptyMessage={"Shopping cart is empty"} />
        }
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
  renderItemContainer: {
    width: screenWidth,
    backgroundColor: Colors.white,
    marginRight: 1,
    marginBottom: 1,
  },
  itemDisplayPriceText: {
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
