import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

//configue
import { screenHeight } from "../../../config/settings";
import { Colors } from "../../../styles";

//package
import i18n from "i18n-js";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

//redux
import { useDispatch, useSelector } from "react-redux";
import { setDeliverType, getProductPriceCart } from "../../../actions/cart";

export default function DeliveryOptions(props) {
  const dispatch = useDispatch();

  const deliverTypeRedux = useSelector(
    (state) => state.cartData.deliverTypeRedux
  );
  const userDataRedux = useSelector((state) => state.accountData.userInfo);

  const deliveryStore = useSelector((state) => state.accountData.deliveryStore);
  const languageCode = useSelector((state) => state.accountData.language);
  const selectedAddress = useSelector(
    (state) => state.addressData.selectedAddress
  );
  const deliveryDate = useSelector((state) => state.accountData.deliveryDate);
  const deliveryTime = useSelector((state) => state.accountData.deliveryTime);

  const { toggleOverlay } = props;

  const getDeliveryPrice = (deliveryTypeNumber) => {
    const data = {
      deliverType: deliveryTypeNumber,
      isGetPrice: "1",
      userNumber: userDataRedux.userNumber,
      storeNumber: deliveryStore.storeNumber,
      language: languageCode,
      userGeometry: selectedAddress.addressGeometry,
      storeGeometry: deliveryStore.storeLocation,
      expectDeliverTime:
        deliveryDate && deliveryTime
          ? deliveryDate + " " + deliveryTime.slice(8) + ":00"
          : "",
    };

    dispatch(getProductPriceCart(data));
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.ModalHeader}>
        <View style={styles.emptySpace}></View>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            {i18n.t("Choose Delivery Type")}
          </Text>
        </View>

        {/* cancel button */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => toggleOverlay()}
        >
          <AntDesign name="close" size={22} color="black" />
        </TouchableOpacity>
      </View>

      {/* 商家配送 */}
      <View style={{ flex: 0.9 }}>
        <TouchableOpacity
          onPress={() => {
            // setIsPickUpSelected(false);
            // setDeliveryTypeSelected(i18n.t("Store Delivery"));
            dispatch(setDeliverType("Store Delivery"));
            getDeliveryPrice("1");
            toggleOverlay();
          }}
        >
          <View style={styles.deliveryTypeContainer}>
            <Text>{i18n.t("Store Delivery")}</Text>
            {deliverTypeRedux != "Store Delivery" ? (
              <MaterialIcons
                name="radio-button-unchecked"
                size={22}
                color="black"
              />
            ) : (
              <MaterialIcons
                name="radio-button-checked"
                size={20}
                color="black"
              />
            )}
          </View>
        </TouchableOpacity>

        {/* 自取 */}
        <TouchableOpacity
          onPress={() => {
            // setIsPickUpSelected(true);
            // setDeliveryTypeSelected(i18n.t("Self Pickup"));
            dispatch(setDeliverType("Self Pickup"));
            getDeliveryPrice("0");
            toggleOverlay();
          }}
        >
          <View style={styles.deliveryTypeContainer}>
            <Text>{i18n.t("Self Pickup")}</Text>
            {deliverTypeRedux != "Store Delivery" ? (
              <MaterialIcons
                name="radio-button-checked"
                size={20}
                color="black"
              />
            ) : (
              <MaterialIcons
                name="radio-button-unchecked"
                size={22}
                color="black"
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 0.2,
    borderBottomColor: Colors.darkGrey,
  },
  deliveryTypeContainer: {
    height: screenHeight * 0.06,
    borderBottomColor: Colors.darkGrey,
    borderBottomWidth: 0.2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  ModalHeader: {
    flex: 0.12,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.2,
    borderBottomColor: Colors.darkGrey,
  },
  headerContainer: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "flex-end",
    //backgroundColor: "blue",
  },
  headerText: {
    fontSize: 17,
    fontWeight: "bold",
  },
  emptySpace: { flex: 0.2 },
});
