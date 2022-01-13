//react
import React, { useState, useEffect } from "react";

//react navigation
import { useNavigation } from "@react-navigation/native";

//react native
import { StyleSheet, Text, View } from "react-native";

//packages
import { Ionicons } from "@expo/vector-icons";
import i18n from "i18n-js";

//config
//import { productList } from "../../../config/data";

//style
import { Colors } from "../../../styles";

//redux
import { useDispatch, useSelector } from "react-redux";
import { addProductToCart } from "../../../actions/cart";

export default function QuantitySelector(props) {
  const dispatch = useDispatch();
  const { quantity, itemNumber } = props;

  const [displayQuantity, setDisplayQuantity] = useState();

  const userNumber = useSelector(
    (state) => state.accountData.userInfo.userNumber
  );

  useEffect(() => {
    setDisplayQuantity(quantity);
  }, []);

  const handleAddProduct = () => {
    const modifiedQuantity = displayQuantity + 1;
    //setLocalQuantity(modifiedQuantity);
    setDisplayQuantity(modifiedQuantity);

    const data = {
      userNumber: userNumber,
      itemNumber: [itemNumber],
      itemQuantity: [modifiedQuantity],
    };
    dispatch(addProductToCart(data));
  };

  const handleRemoveProduct = () => {
    if (displayQuantity > 0) {
      const modifiedQuantity = displayQuantity - 1;
      //setLocalQuantity(modifiedQuantity);
      setDisplayQuantity(modifiedQuantity);

      const data = {
        userNumber: userNumber,
        itemNumber: [itemNumber],
        itemQuantity: [modifiedQuantity],
      };
      dispatch(addProductToCart(data));
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 0.22, justifyContent: "center" }}>
        <Text style={{ fontSize: 20 }}>{i18n.t("Quantity")}</Text>
      </View>

      {/* 已添加物品button样式 */}
      <View style={styles.buttonContainer}>
        {displayQuantity !== 0 ? (
          <Ionicons
            onPress={() => handleRemoveProduct()}
            style={{ alignSelf: "center", padding: 10 }}
            name="md-remove-circle"
            size={24}
            color={Colors.primary}
          />
        ) : (
          <Ionicons
            //onPress={() => handleRemoveProduct()}
            style={{ alignSelf: "center", padding: 10 }}
            name="md-remove-circle"
            size={24}
            color={Colors.white}
          />
        )}

        <View style={{ alignSelf: "center" }}>
          <Text style={{ fontSize: 18, color: Colors.primary }}>
            {displayQuantity != "0" ? displayQuantity : null}
          </Text>
        </View>

        <Ionicons
          onPress={() => handleAddProduct()}
          style={{ alignSelf: "center", padding: 10 }}
          name="md-add-circle"
          size={24}
          color={Colors.primary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
    paddingRight: 10,
  },
  buttonContainer: {
    flex: 0.3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
