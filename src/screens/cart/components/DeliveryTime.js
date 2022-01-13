import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";

//component
import { DeliveryTimeInterval } from "../../../config/data";
import LoadingScreen from "../../../components/LoadingScreen";

//const
import { screenHeight, screenWidth } from "../../../config/settings";

//style
import { Colors } from "../../../styles";

//package
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";

//redux
import { setDeliveryTime } from "../../../actions/account";
import { getProductPriceCart } from "../../../actions/cart";

//react navigation
import { useNavigation } from "@react-navigation/native";
import EmptyCart from "./EmptyCart";

export default function DeliveryTime(props) {
  const { setDeliveryTimeModalVisible, data } = props;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const selectedAddress = useSelector(
    (state) => state.addressData.selectedAddress
  );
  const deliveryDate = useSelector((state) => state.accountData.deliveryDate);

  const userDataRedux = useSelector((state) => state.accountData.userInfo);
  const deliveryStore = useSelector((state) => state.accountData.deliveryStore);
  const languageCode = useSelector((state) => state.accountData.language);
  const deliverTypeRedux = useSelector(
    (state) => state.cartData.deliverTypeRedux
  );

  const handleTimeButtonPress = (time) => {
    dispatch(setDeliveryTime(time));
    setDeliveryTimeModalVisible(false);

    //获取一次运费价格
    const data = {
      deliverType: deliverTypeRedux == "Store Delivery" ? "1" : "0",
      isGetPrice: "1",
      userNumber: userDataRedux.userNumber,
      storeNumber: deliveryStore.storeNumber,
      language: languageCode,
      userGeometry: selectedAddress.addressGeometry,
      storeGeometry: deliveryStore.storeLocation,
      expectDeliverTime: deliveryDate + " " + time.slice(8) + ":00",
    };
    dispatch(getProductPriceCart(data));
  };

  const renderTime = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.timeContainer}
        onPress={() => handleTimeButtonPress(item)}
        //onPress={() => radioClick(item.id)}
      >
        {/* time */}
        <View style={{ flex: 0.8, alignItems: "center" }}>
          <Text style={styles.timeText}>{item}</Text>
        </View>
        {/* selected icon */}
        {/* <View style={{ flex: 0.2, alignItems: "center" }}>
          {item.id == radioSelected ? (
            <FontAwesome name="check-circle" size={22} color="green" />
          ) : null}
        </View> */}
      </TouchableOpacity>
    );
  };

  if (!data) {
    return <LoadingScreen />;
  } else {
    return (
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        data={data}
        numColumns={1}
        renderItem={renderTime}
        ListEmptyComponent={<EmptyCart emptyMessage={"No data"} />}
      />
    );
  }
}

const styles = StyleSheet.create({
  timeContainer: {
    width: "100%",
    height: screenHeight * 0.09,
    alignItems: "center",
    flexDirection: "row",
  },
  timeText: {
    fontSize: 16,
  },
});
