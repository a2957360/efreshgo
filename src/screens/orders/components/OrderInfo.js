//react
import React, { useState, useEffect } from "react";

//react navigation
import { useNavigation } from "@react-navigation/native";

//react native
import {
  Alert,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";

//components
import SmallListItem from "../../../components/SmallListItem";
//import ListItem from "../../../components/ListItem";
import ListItemForOrder from "../../../components/ListItemForOrder";
// import ItemReceipt from "../../../components/ItemReceipt";
import ItemReceiptForOrder from "../../../components/ItemReciptForOrder";
import Spacing from "../../../components/Spacing";

//package
import i18n from "i18n-js";
import { MaterialIcons } from "@expo/vector-icons";

//config
// import { orderList } from "../../../config/data";

//style
import { Colors } from "../../../styles";
import { screenWidth } from "../../../config/settings";

//redux
import { useDispatch, useSelector } from "react-redux";
import { receiveDelivery } from "../../../actions/order";
import { reCheckOutUpdateCart } from "../../../actions/reCheckOut";

function StateButton({ orderState, orderNumber, buttonTitle, orderInfo,type }) {
  const isPressable =
    orderState == "0" ||
    // orderState == "5" ||
    orderState == "7" ||
    orderState == "6" ||
    orderState == "8";

    const buttonTitleTextList = {
      En : {
        "0" : "Unpaid",
        "1" : "Paid",
        "2" : "Wait",
        "3" : "Preparing",
        "4" : "UnPickuped",
        "5" : "Delivering",
        "6" : "Received",
        "7" : "Uncomment",
        "8" : "Refund",
        "9" : "Refunding",
        "10" : "Refunded",
        "11" : "Refund Denied",
        "12" : "Canceled"
      },
      Zh : {
        "0" : "未付款",
        "1" : "已付款",
        "2" : "待接单",
        "3" : "备货中",
        "4" : "待取货",
        "5" : "Delivering",
        "6" : "确认收货",
        "7" : "待评价",
        "8" : "申请退款",
        "9" : "等待退款",
        "10" : "已退款",
        "11" : "拒绝退款",
        "12" : "已取消",
      }
    }

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const languageCode = useSelector((state) => state.accountData.language);
  const userNumber = useSelector(
    (state) => state.accountData.userInfo.userNumber
  );

  const handleButtonPress = () => {
    //去付款
    if (orderState == "0") {
      const data = {
        isRepayment: 1,
        userNumber: userNumber,
        itemList: orderInfo.itemList,
      };

      //弹窗提示去付款会清空当前购物车
      Alert.alert(
        i18n.t("reCheckOutWarning"),
        i18n.t("reCheckOutWarningMessage"),
        [
          {
            text: i18n.t("Cancel"),
            onPress: () => {
              return;
            },
            style: "cancel",
          },
          {
            text: i18n.t("Confirm"),
            onPress: () => {
              dispatch(reCheckOutUpdateCart(data));
              navigation.navigate("CheckOutFromUnpaidOrder", {
                orderNumber: orderNumber,
                orderNo: orderInfo.orderNo
              });
              return;
            },
            style: "ok",
          },
        ]
      );
    }

    //确认收货
    else if (orderState == "6") {
      const data = {
        userNumber: userNumber,
        orderNumber: orderNumber,
        orderState: "7",
      };
      dispatch(receiveDelivery(data));
      return;
    }

    //申请退款
    else if (orderState == "7" && type == "Refund" ) {
      navigation.navigate("Refund", {
        orderNumber: orderNumber,
        userNumber: userNumber,
      });
      return;
    }

    //申请退款
    else if (orderState == "8" ) {
      navigation.navigate("Refund", {
        orderNumber: orderNumber,
        userNumber: userNumber,
      });
      return;
    }

    //去评价
    else if (orderState == "7" && type == "Review" ) {
      navigation.navigate("Review", { orderInfo: orderInfo });
      return;
    }
  };

  return (
    <View style={styles.stateButtonMainContainer}>
      <TouchableOpacity
        style={{
          ...styles.buttonContainer,
          backgroundColor: isPressable ? Colors.primary : Colors.white,
        }}
        activeOpacity={1}
        onPress={() => handleButtonPress()}
      >
       
        <Text
          style={{
            ...styles.buttonText,
            color: isPressable ? Colors.white : Colors.primary,
          }}
        >
          {!type ? buttonTitleTextList[languageCode][orderState] : i18n.t(type)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function OrderInfo(props) {
  // const { data, state, stateText } = props;
  const { orderList } = props;


  const renderOrder = ({ item, index }) => {

    return (
      <View key={index} style={styles.orderMainContainer}>
        <View style={styles.cardContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{i18n.t("OrderNumber")}:</Text>
            <Text style={styles.titleText}>{item.orderNo}</Text>
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.subtitleText}>{i18n.t("OrderTime")}:</Text>
            <Text style={styles.subtitleText}>{item.orderCreateTime}</Text>
          </View>

          {/* 商品列表 */}
          <ItemReceiptForOrder
            items={item.itemList}
            // totalQuantity={item.totalQuantity}
          />
        </View>

        {/* 价格详情 */}
        <View
          style={[
            styles.cardContainer,
            { borderBottomWidth: 0.5, borderBottomColor: Colors.midGrey },
          ]}
        >
          {/* 合计 */}
          <SmallListItem title={i18n.t("Sum")} data={`$${item.itemPrice}`} />
          {/* 运费 */}
          <SmallListItem
            title={i18n.t("DeliveryFee")}
            data={`$${item.deliverPrice}`}
          />
          {/* 税 */}
          <SmallListItem title="GST/PST" data={`$${item.orderTax}`} />
          {/* 总计 */}
          <SmallListItem title={i18n.t("Total")} data={`$${item.totalPrice}`} />
          {/* <Spacing height="extraSmall" /> */}
        </View>

        {/* 具体详情  */}
        <View style={styles.cardContainer}>

           {/* 商家名字 */}
           <ListItemForOrder
            title={i18n.t("StoreName")}
            data={item.storeName}
          />

           {/* 商家评级 */}
           <ListItemForOrder
            title={i18n.t("StoreRank")}
            // data={item.storeNumber}
            type={"comment"}
            rate={item.storeOverAllRate}
          />

           {/* 商家电话 */}
           <ListItemForOrder
            title={i18n.t("StorePhone")}
            data={item.storePhone}
          />

          {/* 商家地址 */}
          <ListItemForOrder
            title={i18n.t("StoreAddress")}
            data={item.storeAddress}
          />

          {/* 如果自取就不显示司机信息 */}
          {item.deliverType == "1" && item.orderState>"2" ? 
            <>
              {/* 司机姓名 */}
          <ListItemForOrder
            title={i18n.t("DriverName")}
            data={item.driverName}
          />

          {/* 司机评级 */}
          <ListItemForOrder
            title={i18n.t("DriverRank")}
            type={"comment"}
            rate={item.driverOverAllRate}
          />

          {/* 司机电话 */}
          <ListItemForOrder
            title={i18n.t("DriverPhone")}
            data={item.driverPhone}
          />
            </>  : null
        }
          
          {/* 我的地址 */}
          <ListItemForOrder
            title={i18n.t("MyAddress")}
            data={item.orderAddress}
          />

          {/* 配送方式 */}
          <ListItemForOrder
            title={i18n.t("DeliveryMethod")}
            data={item.deliverTypeTile}
          />

          {/* 配送时间 */}
          <ListItemForOrder
            title={i18n.t("DeliveryTime")}
            data={item.expectDeliverTime}
          />

          {/* 备注 */}
          <ListItemForOrder
            title={i18n.t("Notes")}
            data={item.orderComent}
          />

          {/* 司机给客人评级*/}
          <ListItemForOrder
            title={i18n.t("Rate from driver")}
            type={"comment"}
            rate={item.driverForUserRate}
          />

          {/* 司机给客人评论*/}
          <ListItemForOrder
            title={i18n.t("Opinion from driver")}
            type={"commentText"}
            reviewText={item.driverForUserReview}
          />

          {/* 商家给客人评级*/}
          <ListItemForOrder
            title={i18n.t("Rate from store")}
            type={"comment"}
            rate={item.storeForUserRate}
          />

          {/* 商家给客人评论*/}
          <ListItemForOrder
            title={i18n.t("Opinion from store")}
            type={"commentText"}
            reviewText={item.storeForUserReview}
          />

           {/* 客人给司机评级*/}
          {item.deliverType != "0" && 
          <ListItemForOrder
            title={i18n.t("For Driver Rate")}
            type={"comment"}
            rate={item.driverRate}
          />}
          

          {/* 客人给司机评论*/}
          {item.deliverType != "0" &&  
          <ListItemForOrder
            title={i18n.t("For Driver Opinion")}
            type={"commentText"}
            reviewText={item.driverReview}
          />}
          

          {/* 客人给商家评级*/}
          <ListItemForOrder
            title={i18n.t("For Store Rate")}
            type={"comment"}
            rate={item.storeRate}
          />

          {/* 客人给商家评论*/}
          <ListItemForOrder
            title={i18n.t("For Store Opinion")}
            type={"commentText"}
            reviewText={item.storeReview}
          />
        </View>

        {/* 状态操作 */}
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          {/* 待评价&申请退款 */}
          {/* 未付款，配送中，待收货，已完成 */}
          {item.orderState == "7" ? (
            <>
              <StateButton
                buttonTitle={i18n.t("Review")}
                orderState={item.orderState}
                orderNumber={item.orderNumber}
                orderInfo={item}
                type={"Review"}
              />
              <StateButton
                buttonTitle={i18n.t("Refund")}
                orderState={item.orderState}
                orderNumber={item.orderNumber}
                orderInfo={item}
                type={"Refund"}
              />
            </>
          ) : (
            <StateButton
              buttonTitle={
                item.orderState == "0" ||
                // item.orderState == "5" ||
                item.orderState == "6" ||
                item.orderState == "8"
                  ? item.orderButtonText
                  : item.orderStateTitle
              }
              orderState={item.orderState}
              orderNumber={item.orderNumber}
              orderInfo={item}
              
            />
          )}
        </View>

        <Spacing height="large" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        style={styles.layoutContainer}
        showsVerticalScrollIndicator={false}
        numColumns={1}
        data={orderList}
        renderItem={renderOrder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midGrey,
  },
  cardContainer: {
    paddingHorizontal: 15,
    paddingBottom: 5,
  },
  titleContainer: {
    flexDirection: "row",
    height: 50,
    borderTopColor: Colors.midGrey,
    borderTopWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0,
  },
  titleText: {
    fontSize: 15,
    fontWeight: "bold",
    paddingRight: 5,
  },
  subtitleText: {
    fontSize: 13,
  },
  textContainer: {
    flexDirection: "row",
    borderBottomColor: Colors.midGrey,
    borderBottomWidth: 1,
  },
  contentText: {
    fontSize: 13,
    textAlign: "right",
  },
  buttonContainer: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    width: 100,
  },
  buttonText: {
    color: Colors.primary,
    fontSize: 14,
  },
  stateButtonMainContainer: {
    // borderTopColor: Colors.midGrey,
    // borderTopWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  orderMainContainer: {
    backgroundColor: Colors.white,
    width: screenWidth,
  },
});
