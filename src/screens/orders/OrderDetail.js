//react
import React, { useState, useEffect } from "react";

//react navigation
import { useNavigation, useIsFocused } from "@react-navigation/native";

//react native
import { StyleSheet, View } from "react-native";

//components
import OrderInfo from "./components/OrderInfo";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyCart from "../cart/components/EmptyCart";
import LoadingScreen from "../../components/LoadingScreen";

//packages
import { TabView, TabBar } from "react-native-tab-view";
import i18n from "i18n-js";

//config
import { productList } from "../../config/data";

//style
import { Colors } from "../../styles";

//redux
import { useDispatch, useSelector } from "react-redux";
import { getOrders, resetChangeOrderState } from "../../actions/order";

export default function OrderDetail(props) {
  const dispatch = useDispatch();
  // const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { state } = props.route.params;

  const [refreshing, setRefreshing] = useState(false);

  // const [routes] = useState([
  //   { key: 0, title: "待付款" },
  //   { key: 1, title: "待发货" },
  //   { key: 2, title: "待收货" },
  //   { key: 3, title: "待评价" },
  // ]);

  const userNumber = useSelector(
    (state) => state.accountData.userInfo.userNumber
  );
  const languageCode = useSelector((state) => state.accountData.language);

  const getOrdersResultData = useSelector(
    (state) => state.orderData.getOrdersResultData
  );

  // const deliveryAddress = useSelector(
  //   (state) => state.addressData.selectedAddress.addressStreet
  // );

  const changeOrderStateResultMessage = useSelector(
    (state) => state.orderData.changeOrderStateResultMessage
  );

  useEffect(() => {
    // 获取所有订单
    if (!isFocused) {
      return;
    }

    if (state == " ") {
      const data = {
        isGet: "1",
        userNumber: userNumber,
        language: languageCode,
      };
      dispatch(getOrders(data));
    } else {
      const data = {
        isGet: "1",
        userNumber: userNumber,
        orderState: state,
        language: languageCode,
      };
      dispatch(getOrders(data));
    }
  }, [isFocused]);

  useEffect(() => {
    if (changeOrderStateResultMessage == "success") {
      // alert("changed order state success");
      dispatch(resetChangeOrderState());
      if (state == " ") {
        const data = {
          isGet: "1",
          userNumber: userNumber,
          language: languageCode,
        };
        dispatch(getOrders(data));
      } else {
        const data = {
          isGet: "1",
          userNumber: userNumber,
          orderState: state,
          language: languageCode,
        };
        dispatch(getOrders(data));
      }
    }
  }, [changeOrderStateResultMessage]);


  if (!getOrdersResultData) {
    return <LoadingScreen />;
  } else if (getOrdersResultData == "") {
    return <EmptyCart emptyMessage={"This is empty!"} />;
  } else {
    return (
      <View style={styles.container}>
        <OrderInfo
          orderList={getOrdersResultData}
          // state={state}
          // stateText={stateText}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});



    //handle refresh event
    // const handleRefresh = async (index) => {
    //   if (!refreshing) {
    //     if (index == 0) {
    //       const data = {
    //         isGet: "1",
    //         orderState: stateNumberList[index],
    //         language: languageCode,
    //         // driverNumber: userInfo.driverNumber,
    //       };
    //       setIndex(index);
    //       dispatch(driverGetOrder(data));
    //     } else if (index == 1 || index == 2) {
    //       const data = {
    //         isGet: "1",
    //         driverNumber: userInfo.driverNumber,
    //         orderState: stateNumberList[index],
    //         language: languageCode,
    //       };
    //       setIndex(index);
    //       dispatch(driverGetOrder(data));
    //     }
    //     setRefreshing(false);
    //   }
    // };

  //监测navigation，获取订单
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     if (state == " ") {
  //       const data = {
  //         isGet: "1",
  //         userNumber: userNumber,
  //         language: languageCode,
  //       };
  //       dispatch(getOrders(data));
  //     } else {
  //       const data = {
  //         isGet: "1",
  //         userNumber: userNumber,
  //         orderState: state,
  //         language: languageCode,
  //       };
  //       dispatch(getOrders(data));
  //     }
  //   });
  //   return unsubscribe;
  // }, [navigation]);