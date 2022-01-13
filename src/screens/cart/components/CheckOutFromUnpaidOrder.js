//react
import React, { useState, useEffect, useRef } from "react";
//redux
import { useDispatch, useSelector } from "react-redux";

//react navigation
import { useNavigation, useIsFocused } from "@react-navigation/native";

//react native
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";

//components

//config
import { screenHeight, screenWidth } from "../../../config/settings";

import ItemReceipt from "../../../components/ItemReceipt";
import Spacing from "../../../components/Spacing";
import ReCheckOutCartPriceBar from "../../../components/ReCheckOutCartPriceBar";
import DeliveryTimeModal from "../../cart/components/DeliveryTimeModal";

//package
import i18n from "i18n-js";
import { MaterialIcons } from "@expo/vector-icons";

//style
import { Colors } from "../../../styles";

//package
import { Overlay } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

//component
import DeliveryType from "./DeliveryType";
import PaymentModal from "./PaymentModal";
import LoadingSpinner from "../../../components/LoadingSpinner";
import LoadingScreen from "../../../components/LoadingScreen";
import AlertBoxAfterPayment from "../../../components/AlertBoxAfterPayment";

//wechat alipay package
import axios from "axios";
import sha256 from "sha256";
import { serverUrl } from "../../../config/settings";
import Alipay from "../../../Alipay";

//wechatpay
import * as WeChat from "react-native-wechat-lib";

//redux
import {
  makeOrder,
  makeOrderPayByCreditCard,
  getPaymentMethod,
  setMakeOrderLoading,
  getProductPriceCart,
  resetMakeOrderPayByCreditCardResultMessage,
} from "../../../actions/cart";
import { reCheckOutMakeOrderEnd } from "../../../actions/reCheckOut";
import { changeOrderState } from "../../../actions/order";

//carditem(text 2 lines)
function CardItem(props) {
  const navigation = useNavigation();
  const { title, data, link, lastItem, arrowShown } = props;

  ///redux data
  const selectedAddress = useSelector(
    (state) => state.addressData.selectedAddress
  );

  const handlePress = () => {
    if (link == "Address") {
      navigation.navigate("Address", {
        checkOutFlag: true,
      });
    }
    if (link == "ChooseShop") {
      if (selectedAddress || selectedAddress != "") {
        navigation.navigate("ChooseShop", {
          checkOutFlag: true,
        });
      } else {
        Alert.alert(
          i18n.t("Error Message"),
          i18n.t("Please select your address before choose store!"),
          [
            {
              text: i18n.t("Confirm"),
              onPress: () => {
                navigation.navigate("Address", {
                  checkOutFlag: true,
                });
              },
              style: "ok",
            },
          ]
        );
      }
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => handlePress()}
        style={styles.titleContainer}
      >
        <View style={styles.cardItemTitleContainer}>
          <Text style={styles.titleText}>{i18n.t(title)}</Text>
          {arrowShown && (
            <MaterialIcons
              name="navigate-next"
              size={24}
              color={Colors.darkGrey}
            />
          )}
        </View>
      </TouchableOpacity>

      <View style={[styles.textContainer, { borderBottomWidth: 0 }]}>
        <Text numberOfLines={2} style={styles.contentText}>
          {data}
        </Text>
      </View>
    </View>
  );
}

//listitem(text 1 lines)
function ListItem(props) {
  const navigation = useNavigation();
  const {
    title,
    data,
    link,
    lastItem,
    name,
    togglePaymentOverlay,
    setPaymentModal,
    toggleOverlay,
    arrowShown,
    itemPrice,
    deliveryPrice,
    orderTax,
    setDeliveryTimeModalVisible,
  } = props;

  const selectedStore = useSelector((state) => state.accountData.deliveryStore);
  const selectedAddress = useSelector(
    (state) => state.addressData.selectedAddress
  );

  const handlePress = () => {
    if (name == "DeliveryType" || name == "PaymentOptions") {
      toggleOverlay();
      if (name == "PaymentOptions") {
        setPaymentModal(true);
      }
    }
    if (name == "DeliveryTime") {
      //如果选了地址，查有没有选店铺
      if (selectedAddress) {
        //有自己的地址， 有商店，弹时间
        if (selectedStore) {
          setDeliveryTimeModalVisible(true);
        }
        //有自己的地址，无商店，调转选商店
        else {
          console.log("selected store", selectedStore);
          Alert.alert(
            i18n.t("Error Message"),
            i18n.t("Please select your shop before choose delivery time!"),
            [
              {
                text: i18n.t("Confirm"),
                onPress: () => {
                  navigation.navigate("ChooseShop", {
                    checkOutFlag: true,
                  });
                },
                style: "ok",
              },
            ]
          );
        }
      }
      //如果没有选自己的地址，跳选地址
      else {
        Alert.alert(
          i18n.t("Error Message"),
          i18n.t(
            "Please select your address before choose delivery time and shop!"
          ),
          [
            {
              text: i18n.t("Confirm"),
              onPress: () => {
                navigation.navigate("Address", {
                  checkOutFlag: true,
                });
              },
              style: "ok",
            },
          ]
        );
      }
    }
    if (link) {
      if (link == "Coupon") {
        navigation.navigate("Coupon", {
          itemPrice: itemPrice,
          deliverPrice: deliveryPrice,
          orderTax: orderTax,
        });
      } else {
        navigation.navigate(link, {
          title: name,
        });
      }
    }
  };

  return (
    <TouchableOpacity activeOpacity={1} onPress={() => handlePress()}>
      <View
        style={
          lastItem === true
            ? [styles.titleContainer, { borderBottomWidth: 0 }]
            : styles.titleContainer
        }
      >
        <View style={{ flex: 0.28 }}>
          <Text style={styles.titleText}>{i18n.t(title)}</Text>
        </View>

        <View style={styles.listItemContainer}>
          <Text numberOfLines={1} style={styles.contentText}>
            {data}
          </Text>
          {arrowShown && (
            <MaterialIcons
              name="navigate-next"
              size={24}
              color={Colors.darkGrey}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function CheckOutFromUnpaidOrder(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [paymentModal, setPaymentModal] = useState(false);
  // const [isPickUpSelected, setIsPickUpSelected] = useState(false);
  const [visible, setVisible] = useState(false);

  // const [deliveryTypeSelected, setDeliveryTypeSelected] = useState(
  //   i18n.t("Store Delivery")
  // );
  const [creditCardSelected, setCreditCardSelected] = useState({
    number: "",
    id: "",
  });
  const [useCouponResultData, setUseCouponResultData] = useState();

  const [selectedCoupon, setSelectedCoupon] = useState();

  const [deliveryTimeModalVisible, setDeliveryTimeModalVisible] = useState(
    false
  );

  const [localMakeOrderLoading, setLocalMakeOrderLoading] = useState(false)

  const [thirPartyPayAlertLoading, setThirPartyPayAlertLoading] = useState(false)

  // const isMakeOrderLoading = useSelector(
  //   (state) => state.cartData.isMakeOrderLoading
  // );

  const reCheckOutMakeOrderResultMessage = useSelector(
    (state) => state.reCheckOutData.reCheckOutMakeOrderResultMessage
  );

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const togglePaymentOverlay = (type) => {
    if (type == "PaymentOptions") {
      toggleOverlay();
      setPaymentModal(true);
    } else {
      setVisible(!visible);
      setPaymentModal(false);
    }
  };

  //get data from redux
  const userDataRedux = useSelector((state) => state.accountData.userInfo);

  const deliveryTime = useSelector((state) => state.accountData.deliveryTime);

  const deliveryDate = useSelector((state) => state.accountData.deliveryDate);

  const selectedPayMethod = useSelector((state) => state.paymentData.method);

  const useCouponSuccessData = useSelector(
    (state) => state.cartData.useCouponSuccessData
  );

  const setSelectedCouponInfoData = useSelector(
    (state) => state.cartData.setSelectedCouponInfoData
  );

  const useCouponSuccessMessage = useSelector(
    (state) => state.cartData.useCouponSuccessMessage
  );

  const getProductPriceCartResultData = useSelector(
    (state) => state.cartData.getProductPriceCartResultData
  );

  // const addressComment = useSelector(
  //   (state) => state.addressData.selectedAddress.addressComment
  // );

  const reCheckOutMakeOrderResultData = useSelector(
    (state) => state.reCheckOutData.reCheckOutMakeOrderResultData
  );

  ///redux data
  const userNumber = useSelector(
    (state) => state.accountData.userInfo.userNumber
  );

  const languageCode = useSelector((state) => state.accountData.language);

  const selectedAddress = useSelector(
    (state) => state.addressData.selectedAddress
  );
  const storeList = useSelector((state) => state.accountData.storeList);

  const selectedStore = useSelector((state) => state.accountData.deliveryStore);

  const makeOrderPayByCreditCardResultMessage = useSelector(
    (state) => state.cartData.makeOrderPayByCreditCardResultMessage
  );
  const deliverTypeRedux = useSelector(
    (state) => state.cartData.deliverTypeRedux
  );

  const creditCardId = useSelector((state) => state.paymentData.creditCardId);

  const itemList = getProductPriceCartResultData.itemList;
  const deliveryPrice = getProductPriceCartResultData.deliverPrice;
  const itemPrice = getProductPriceCartResultData.itemPrice;
  const orderTax = getProductPriceCartResultData.orderTax;
  const totalPrice = getProductPriceCartResultData.totalPrice;

  useEffect(() => {
    const data = {
      deliverType: deliverTypeRedux == "Store Delivery" ? "1" : "0",
      isGetPrice: "1",
      userNumber: userNumber,
      language: languageCode,
      userGeometry: selectedAddress ? selectedAddress.addressGeometry : "",
      storeGeometry: selectedStore ? selectedStore.storeLocation : "",
      expectDeliverTime:
        deliveryDate && deliveryTime
          ? deliveryDate + " " + deliveryTime.slice(8) + ":00"
          : "",
    };

    //如果orderNumber没有传过来，提示他重试
    if (props.route.params?.orderNumber == undefined) {
      Alert.alert(i18n.t("Error Message"), i18n.t("systemErrorMessage"), [
        {
          text: i18n.t("Confirm"),
          onPress: () => {
            navigation.goBack();
          },
          style: "ok",
        },
      ]);
    }

    dispatch(getProductPriceCart(data));
  
  }, [isFocused]);



  //如果选好了优惠卷，存储优惠卷之后的订单价格
  useEffect(() => {
    if (useCouponSuccessMessage == "success") {
      if (setSelectedCouponInfoData != "") {
        setSelectedCoupon(setSelectedCouponInfoData);
        setUseCouponResultData(useCouponSuccessData);
      }
    }
  }, [useCouponSuccessMessage]);

  //get stored creditcards
  useEffect(() => {
    const data = {
      isGet: "1",
      userNumber: userDataRedux.userNumber,
    };
    dispatch(getPaymentMethod(data));
    //onPageLoaded();
  }, []);

  //创建订单后，调支付api
  const mounting = useRef(true);
  useEffect(() => {
    if (mounting.current) {
      mounting.current = false;
      return;
    }
    if (reCheckOutMakeOrderResultMessage == "success") {
      //通过回来的paymentType，掉不同的支付方式
      if (
        reCheckOutMakeOrderResultData != "" &&
        reCheckOutMakeOrderResultData
      ) {
        if (reCheckOutMakeOrderResultData.paymentType == "CreditCard") {
          //调用银行卡支付api
          const data = {
            userNumber: userNumber,
            orderNumber: props.route.params.orderNumber,
            cardId: reCheckOutMakeOrderResultData.cardId,
          };
          dispatch(makeOrderPayByCreditCard(data));
        } else if (reCheckOutMakeOrderResultData.paymentType == "Alipay") {
          //调支付宝
          handleAliPay();
        } else if (reCheckOutMakeOrderResultData.paymentType == "WeChatPay") {
          //调微信支付
          handleWechatpay(reCheckOutMakeOrderResultData.orderNo);
        }
      }
    }
    else if (reCheckOutMakeOrderResultMessage === "fail") {
      Alert.alert(i18n.t("Error Message"), i18n.t("systemErrorMessage"), [
        {
          text: i18n.t("Cancel"),
          onPress: () => {
            dispatch(setMakeOrderLoading(false));
            dispatch(reCheckOutMakeOrderEnd());
          },
          style: "ok",
        },
      ]);
    }
    else if (reCheckOutMakeOrderResultMessage == "noitem") {
      setLocalMakeOrderLoading(false)
      dispatch(reCheckOutMakeOrderEnd());
      Alert.alert(i18n.t("Error Message"), i18n.t("Payment failed, please try again!"), [
        {
          text: i18n.t("Confirm"),
          onPress: () => {
            navigation.goBack()
          },
          style: "ok",
        },
      ]);
    }
  }, [reCheckOutMakeOrderResultMessage]);

  //银行卡支付后，更改订单状态，弹窗提示结果
  useEffect(() => {
    if (makeOrderPayByCreditCardResultMessage == "success") {
      Alert.alert(i18n.t("Success"), i18n.t("creditCardSuccessMessage"), [
        {
          text: i18n.t("Confirm"),
          onPress: () => {
            // navigation.replace("OrderDetail",{
            //   state: " ",
            //   stateText: "All Orders"
            // });
            navigation.goBack();
            dispatch(resetMakeOrderPayByCreditCardResultMessage());
            dispatch(reCheckOutMakeOrderEnd());
            dispatch(setMakeOrderLoading(false));
          },
          style: "ok",
        },
      ]);
    }
    if (makeOrderPayByCreditCardResultMessage === "fail") {
      Alert.alert(i18n.t("Error Message"), i18n.t("creditCardErrorMessage"), [
        {
          text: i18n.t("Cancel"),
          onPress: () => {
            dispatch(resetMakeOrderPayByCreditCardResultMessage());
            dispatch(setMakeOrderLoading(false));
          },
          style: "ok",
        },
      ]);
    }
  }, [makeOrderPayByCreditCardResultMessage]);

  let alphaPartnerCode = "C3QAYO";
  let alphaCredentialCode = "R05tKUlaN30ld7G0ZwWPLYomPKx8QFPo";
  let time = new Date().getTime();

  //生成时间和签名
  const createTimeAndSign = () => {
    let valid_string = `${alphaPartnerCode}&${time}&123&${alphaCredentialCode}`;
    let sign = sha256(valid_string).toLowerCase();
    return { time, sign };
  };

  //随机生成app_order
  const editApporder = () => {
    return Math.floor(Math.random() * 1000000000);
  };

  //微信支付
  const handleWechatpay = (orderNoParam) => {
    const t = createTimeAndSign()["time"];
    const s = createTimeAndSign()["sign"];

    //向alphaPay 创建支付订单的地址
    const url = `https://pay.alphapay.ca/api/v1.0/gateway/partners/${alphaPartnerCode}/app_orders/${orderNoParam}?time=${t}&nonce_str=123&sign=${s}`;
    const data = {
      description: "eFreshGo",
      // price:  useCouponResultData ?  Math.round(useCouponResultData.totalPrice* 100) : Math.round(totalPrice*100),
      price:  "1",
      currency: "CAD",
      channel: "Wechat",
      notify_url: `${serverUrl}alphaPayFinsih.php`,
      operator: "dev01",
      system: "ios",
      version: "1.0",
      appid: "wx25609b0762f5450c",
    };
    console.log('recheckout url', url)
    console.log('recheckout data', data)
    setLocalMakeOrderLoading(false)
    try {
      axios.put(url, data).then((res) => {   
        console.log('this is res',res)
        const sdkParams = res["data"]["sdk_params"];
        console.log("SDK_Params: ", sdkParams); 
        wechatPayAction(sdkParams);
      });
    } catch (error) {
      console.log("Put request Failed", error);
    }
  };

  const wechatPayAction = async (payStr) => {
    WeChat.pay(payStr);
    setThirPartyPayAlertLoading(true)
    dispatch(reCheckOutMakeOrderEnd());

  };

  //支付宝支付
  const handleAliPay = () => {
    
    const t = createTimeAndSign()["time"];
    const s = createTimeAndSign()["sign"];

    //生成app_order
    let testOrderNo = editApporder();

    //向alphaPay 创建支付订单的地址
    const url = `https://pay.alphapay.ca/api/v1.0/gateway/partners/${alphaPartnerCode}/app_orders/${testOrderNo}?time=${t}&nonce_str=123&sign=${s}`;
    const data = {
      description: "eFreshGo",
      // price: useCouponResultData ? Math.round(useCouponResultData.totalPrice* 100) : Math.round(totalPrice*100),
      price:  "1",
      currency: "CAD",
      channel: "Alipay",
      //notify_url: "www.alphapay.com/success.php",
      operator: "dev01",
      system: "ios",
      version: "1.0",
      //appid: "wx0000000000000001",
    };
    console.log('recheckout data', data)
    setTimeout(() =>{
      setLocalMakeOrderLoading(false)
    }, 100)
    try {
      axios.put(url, data).then((res) => {
        console.log('this is res',res)
        const sdkParams = res["data"]["sdk_params"];
        console.log("SDK_Params: ", sdkParams);
        aliPayAction(sdkParams);
      });
    } catch (error) {
      console.log("Put request Failed", error);
    }
  };

  const aliPayAction = async (payStr) => {
    console.log('seting thirPartyPay loading true')
    setThirPartyPayAlertLoading(true)
    Alipay.pay(payStr)
      .then((data) => {
        let resultDic = {};
        if (Platform.OS === "ios") {
          resultDic = data[0];
        } else {
          resultDic = data;
        }

        if (resultDic.resultStatus == "9000") {
          //支付成功
          console.log('this is result',resultDic);
          setThirPartyPayAlertLoading(false)   
          Alert.alert("Success", "Successfully make an order", [
            {
              text: "Confirm",
              onPress: () => {
                // dispatch(setMakeOrderLoading(false));
                dispatch(reCheckOutMakeOrderEnd());
                navigation.goBack();
                // navigation.replace("OrderDetail",{
                //   state: " ",
                //   stateText: "All Orders"
                // });
              },
              style: "ok",
            },
          ]);
          const data = {
            userNumber: userDataRedux.userNumber,
            orderNumber: reCheckOutMakeOrderResultData.orderNumber,
            paymentType: "Alipay",
            orderState: "1",
          };

          dispatch(changeOrderState(data));
        } else {
          //支付失败
          console.log("Unsuccessfully Paid");
          setThirPartyPayAlertLoading(false)   
          Alert.alert("Error Message", "Payment failed, please try again!", [
            {
              text: "Confirm",
              onPress: () => {
                // dispatch(setMakeOrderLoading(false));
                dispatch(reCheckOutMakeOrderEnd());
                // navigation.replace("OrderDetail",{
                //   state: " ",
                //   stateText: "All Orders"
                // });
                navigation.goBack();
              },
              style: "ok",
            },
          ]);
        }
      })
      .catch((err) => {
        console.log("err= " + err);
      });
  };

  const handleWechatPayAlertModal = () => {
    setThirPartyPayAlertLoading(false)
    dispatch(reCheckOutMakeOrderEnd());
    navigation.goBack()
    // navigation.replace("OrderDetail", {
    //   state: " ",
    //   stateText: "All Orders",
    // });
  }

  const renderLayout = () => {
    return (
      <View style={styles.layout}>
        {/* 商品详情 */}
        <View style={styles.cardContainer}>
          <View style={[styles.titleContainer, { borderBottomWidth: 0 }]}>
            <Text style={styles.titleText}>{i18n.t("ProductDetail")}</Text>
          </View>

          <ItemReceipt
            data={itemList}
            totalQuantity={getProductPriceCartResultData.totalQuantity}
          />
        </View>

        <Spacing height="medium" />

        {/* 配送方式 */}
        <View style={styles.cardContainer}>
          <ListItem
            title="DeliveryType"
            lastItem={true}
            data={i18n.t(deliverTypeRedux)}
            name={"DeliveryType"}
            toggleOverlay={toggleOverlay}
            arrowShown={true}
          />
        </View>
        <Spacing height="medium" />

        {/* 我的地址 */}
        <View style={styles.cardContainer}>
          <CardItem
            title="MyAddress"
            data={
              selectedAddress != undefined
                ? selectedAddress.addressStreet
                : i18n.t("Please selecte your address")
            }
            link={"Address"}
            arrowShown={true}
          />
        </View>
        <Spacing height="medium" />

        {/* 商家地址 */}
        <View style={styles.cardContainer}>
          <CardItem
            title="StoreAddress"
            data={
              !selectedStore
                ? storeList.length != 0
                  ? storeList[0].address + " " + storeList[0].storeName
                  : i18n.t("Please selecte store")
                : selectedStore.address + " " + selectedStore.storeName
            }
            link={"ChooseShop"}
            arrowShown={true}
          />
        </View>
        <Spacing height="medium" />

        {/*  配送时间 */}
        <View style={styles.cardContainer}>
          <ListItem
            title="DeliveryTime"
            data={
              deliveryTime && deliveryDate
                ? deliveryTime +
                  " " +
                  deliveryDate.substring(5, 7) +
                  "/" +
                  deliveryDate.substring(8, 10)
                : i18n.t("Please selecte delivery time")
            }
            lastItem={true}
            arrowShown={true}
            name={"DeliveryTime"}
            setDeliveryTimeModalVisible={setDeliveryTimeModalVisible}
          />
        </View>
        <Spacing height="medium" />

        {/* 支付方式 */}
        <View style={styles.cardContainer}>
          <ListItem
            title="Payment"
            lastItem={true}
            data={
              selectedPayMethod.includes("CreditCard")
                ? i18n.t("CreditCard") + selectedPayMethod.slice(10)
                : i18n.t(selectedPayMethod)
            }
            name={"PaymentOptions"}
            toggleOverlay={togglePaymentOverlay}
            setPaymentModal={setPaymentModal}
            arrowShown={true}
          />
        </View>

        <Spacing height="medium" />

        {/* 优惠卷 */}
        <View style={styles.cardContainer}>
          <ListItem
            title="Coupon"
            data={
              !selectedCoupon
                ? i18n.t('None') : selectedCoupon.couponType=="0" ? `${i18n.t('OrderOver')}$${selectedCoupon.couponRequiredPrice}${i18n.t('discount_start')}$${selectedCoupon.couponRate}${i18n.t('discount_end')}`
                : `满$${selectedCoupon.couponRequiredPrice}减${selectedCoupon.couponRate}%`
            }
            link={"Coupon"}
            lastItem={true}
            arrowShown={true}
            itemPrice={itemPrice}
            deliveryPrice={deliveryPrice}
            orderTax={orderTax}
          />
        </View>

        <Spacing height="medium" />

        {/* 备注  */}
        {/* <View style={styles.cardContainer}>
          <ListItem title="Remarks" data={addressComment} lastItem={true} />
        </View>
        <Spacing height="medium" /> */}

        <View style={styles.cardContainer}>
          {/* 合计 */}
          <ListItem title="Sum" data={"$" + itemPrice} />

          {/* 运费 */}
          {deliverTypeRedux!= "Self Pickup" ? (
            <ListItem title="DeliveryFee" data={"$" + deliveryPrice} />
          ) : null}
          {/* <ListItem title="DeliveryFee" data={"$" + deliveryPrice} /> */}

          {/* 优惠价格 */}
          <ListItem
            title="Discount"
            data={
              useCouponResultData
                ? "-$" + useCouponResultData.couponPrice
                : "-$0.00"
            }
          />

          {/* 税 */}
          <ListItem title="GST/PST" data={"$" + orderTax} />

          {/* 总价 */}
          <ListItem
            title="Total"
            data={
              useCouponResultData
                ? `$${useCouponResultData.totalPrice}`
                : `$${totalPrice}`
            }
            lastItem={true}
          />
        </View>
      </View>
    );
  };

  if (!getProductPriceCartResultData) {
    return <LoadingScreen />;
  } else {
    return (
      <View style={styles.container}>
        <Overlay
          isVisible={visible}
          onBackdropPress={() => {
            toggleOverlay();
            togglePaymentOverlay();
          }}
          overlayStyle={styles.paymentModalDeliveryModalOverlay}
        >
          {paymentModal ? (
            <PaymentModal
              togglePaymentOverlay={togglePaymentOverlay}
              setCreditCardSelected={setCreditCardSelected}
            />
          ) : (
            <DeliveryType
              toggleOverlay={toggleOverlay}
              // isPickUpSelected={isPickUpSelected}
              // setIsPickUpSelected={setIsPickUpSelected}
              // setDeliveryTypeSelected={setDeliveryTypeSelected}
            />
          )}
        </Overlay>

        {/* 选择配送时间 */}
        <Overlay
          isVisible={deliveryTimeModalVisible}
          onBackdropPress={() => {
            setDeliveryTimeModalVisible(false);
          }}
          overlayStyle={styles.overlystyleContainer}
        >
          <DeliveryTimeModal
            setDeliveryTimeModalVisible={setDeliveryTimeModalVisible}
            data={selectedStore ? selectedStore.storeOpenTime : ""}
          />
        </Overlay>

              {/* 微信loading */}
      <Overlay isVisible={thirPartyPayAlertLoading}>
        <View style={{  width:screenWidth*0.7,height:screenWidth*0.4}}>
         
          <View style={{justifyContent:"center", alignItems:"center", flex:0.4}}>
            <Text style={{fontSize:16, fontWeight:"bold"}}>{i18n.t("Warning")}</Text>
          </View>

          <View style={{flexDirection:"row", justifyContent:"space-around",alignItems:"center" ,paddingVertical:10, flex:0.6}}> 
            <TouchableOpacity onPress={() => {handleWechatPayAlertModal()} } >
              <Text>{i18n.t("Having Problems")}</Text>
              </TouchableOpacity>
            <TouchableOpacity onPress={() => {handleWechatPayAlertModal() }}><Text style={{fontSize:18,fontWeight:"bold",color:Colors.primary}}>{i18n.t("Finish Payment")}</Text></TouchableOpacity>
          </View>
          
        </View>
      </Overlay>

        {/* {isMakeOrderLoading ? <LoadingSpinner /> : null} */}

        {localMakeOrderLoading ? <LoadingSpinner /> : null}

        <FlatList
          keyExtractor={(item, index) => index.toString()}
          style={styles.layoutContainer}
          showsVerticalScrollIndicator={false}
          data={null}
          ListEmptyComponent={renderLayout}
        />
        {/* 购物车bar
            price：购物车总价
            number：物品数量 */}
        <View style={{ flex: 0.1 }}>
          <ReCheckOutCartPriceBar
            data={{
              buttonText: "Order",
              navigationPage: "",
              price: useCouponResultData
                ? useCouponResultData.totalPrice
                : totalPrice,
              number: getProductPriceCartResultData.totalQuantity,
              type: "order",
              orderData: {
                totalPrice: useCouponResultData
                  ? useCouponResultData.totalPrice
                  : totalPrice,
                orderTax: orderTax,
                couponPrice: useCouponResultData
                  ? useCouponResultData.couponPrice
                  : "0",
                deliverPrice: deliveryPrice,
                itemPrice: itemPrice,
                isPickUpSelected: deliverTypeRedux == 'Self Pickup' ? true : false,
                // isPickUpSelected: isPickUpSelected,
                couponNumber: selectedCoupon
                  ? selectedCoupon.couponNumber
                  : null,
                cardId: creditCardId,
                storeNumber: selectedStore.storeNumber,
                orderNumber: props.route.params?.orderNumber,
                itemList: itemList,
                orderNo: props.route.params?.orderNo
              },
            }}
            togglePaymentOverlay={togglePaymentOverlay}
            setLocalMakeOrderLoading={setLocalMakeOrderLoading}
          />
          {/* )} */}
        </View>
      </View>
    );
  }

  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  layoutContainer: {
    flex: 0.9,
  },
  layout: {
    flex: 0.9,
    backgroundColor: Colors.white,
  },
  cardContainer: {
    paddingHorizontal: 15,
    paddingBottom: 5,
  },
  titleContainer: {
    flexDirection: "row",
    paddingVertical: 18,
    borderBottomColor: Colors.midGrey,
    borderBottomWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomColor: Colors.midGrey,
    borderBottomWidth: 1,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 25,
  },
  cardItemTitleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  overlystyleContainer: {
    width: "100%",
    height: "50%",
    position: "absolute",
    bottom: 0,
  },
  listItemContainer: {
    flex: 0.68,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  paymentModalDeliveryModalOverlay: {
    width: "100%",
    height: "50%",
    position: "absolute",
    bottom: 0,
  },
});
