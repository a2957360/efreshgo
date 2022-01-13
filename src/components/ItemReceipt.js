//react
import React, { useState, useEffect } from "react";
//redux
import { useDispatch, useSelector } from "react-redux";

//react navigation
import { useNavigation } from "@react-navigation/native";

//react native
import { StyleSheet, Text, View, FlatList } from "react-native";

//config
//import { itemReceiptList, itemReceiptFullList } from "../config/data";

//style
import { Colors } from "../styles";
import { TouchableOpacity } from "react-native-gesture-handler";

//package
import i18n from "i18n-js";
import { Ionicons } from "@expo/vector-icons";

export default function ItemReceipt(props) {
  //const { totalQuantity } = props;
  const [open, setOpen] = useState(false);

  const itemListData = useSelector(
    (state) => state.cartData.getProductPriceCartResultData.itemList
  );

  const language = useSelector((state) => state.accountData.language);

  let itemReceiptList;
  let itemReceiptFullList;
  const [receipt, setReceipt] = useState();

  useEffect(() => {
    if (itemListData) {
      if (itemListData.length > 3) {
        itemReceiptList = itemListData.slice(0, 3);
        itemReceiptFullList = itemListData;
        open === false
          ? setReceipt(itemReceiptList)
          : setReceipt(itemReceiptFullList);
      }
    }
  }, [open]);

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.itemRecipeContainer}>
        <View style={{ flex: 0.7 }}>
          <Text numberOfLines={1} style={styles.text}>
            {item.itemTitle}
          </Text>
        </View>

        <View style={{ flex: 0.1, alignItems: "flex-end" }}>
          <Text numberOfLines={1} style={styles.text}>
            x{item.itemQuantity}
          </Text>
        </View>

        <View style={{ flex: 0.2, alignItems: "flex-end" }}>
          <Text numberOfLines={1} style={styles.text}>
            ${item.itemSalesPrice ? item.itemSalesPrice : item.itemPrice}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        listKey={(item, index) => listKey + index.toString()}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
        data={receipt ? receipt : itemListData}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
      />
      {itemListData && itemListData.length > 3 ? (
        <TouchableOpacity onPress={() => setOpen(!open)}>
          <View style={styles.itemQuantityContainer}>
            {language == "Zh" ? (
              <Text style={{ paddingHorizontal: 5, fontWeight: "bold" }}>
                共{itemListData.length}件
              </Text>
            ) : (
              <Text style={{ paddingHorizontal: 5, fontWeight: "bold" }}>
                total {itemListData.length} items
              </Text>
            )}

            {open ? (
              <Ionicons name="ios-arrow-up" size={22} color="black" />
            ) : (
              <Ionicons name="ios-arrow-down" size={22} color="black" />
            )}
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
  },
  itemRecipeContainer: {
    flex: 1,
    flexDirection: "row",
    borderTopColor: Colors.midGrey,
    borderTopWidth: 1,
    height: 40,
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemQuantityContainer: {
    borderTopColor: Colors.midGrey,
    borderTopWidth: 1,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
