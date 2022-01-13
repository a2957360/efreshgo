//react
import React, { useState, useEffect, useLayoutEffect } from "react";

//react native
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";

//react navigation
import { useNavigation } from "@react-navigation/native";

//components
import LoadingScreen from "../../components/LoadingScreen";

//package
import i18n from "i18n-js";

//config
// import { productList } from "../../config/data";
import { screenHeight, screenWidth } from "../../config/settings";

//style
import { Colors } from "../../styles";

//redux
import { useDispatch, useSelector } from "react-redux";
import { getCoupon } from "../../actions/coupon";
import {
  useCoupon,
  resetUseCouponMessage,
  setSelectedCouponInfo,
} from "../../actions/cart";


export default function Coupon(props) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false)

  // const { itemPrice, deliverPrice, orderTax } = props.route.params;

  const userDataRedux = useSelector((state) => state.accountData.userInfo);
  const couponList = useSelector((state) => state.couponData.getCouponResultData);

  const useCouponSuccessMessage = useSelector(
    (state) => state.cartData.useCouponSuccessMessage
  );

  //一进来获取拥有的优惠卷
  useEffect(() => {
    const data = {
      isGet: "1",
      userNumber: userDataRedux.userNumber,
    };
    setLoading(true)
    dispatch(getCoupon(data));
  }, []);

  //获取到优惠卷后，取消loading
  useEffect(() => {
    if(couponList){
      setLoading(false)
    }
  },[couponList])

  //使用优惠卷后的结果弹窗
  useEffect(() => {
    if (useCouponSuccessMessage == "success") {
      Alert.alert(
        i18n.t("Success"),
        i18n.t("You have successfully select the valid coupon"),
        [
          {
            text: i18n.t("Confirm"),
            onPress: () => {
              dispatch(resetUseCouponMessage());
              navigation.goBack();
            },
            style: "ok",
          },
        ],
        { cancelable: false }
      );
    }
    if (
      useCouponSuccessMessage == "not enough" ||
      useCouponSuccessMessage == "user not match"
    ) {
      Alert.alert(
        i18n.t("Error Message"),
        useCouponSuccessMessage,
        [
          {
            text: i18n.t("Cancel"),
            onPress: () => {
              dispatch(resetUseCouponMessage());
              console.log("Cancel Pressed");
            },
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
  }, [useCouponSuccessMessage]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 20 }}
          onPress={() => navigation.navigate("RedeemCoupon")}
        >
          <Text style={{ color: Colors.black }}>{i18n.t("Redeem")}</Text>
        </TouchableOpacity>
      ),
    });
  });

  const handleCouponSelector = (item) => {
    if (item.couponState == "0" && props.route.params) {
      dispatch(resetUseCouponMessage());

      const data = {
        isApplyCoupon: "1",
        userNumber: userDataRedux.userNumber,
        couponNumber: item.couponNumber,
        itemPrice: props.route.params.itemPrice,
        deliverPrice: props.route.params.deliverPrice,
        orderTax: props.route.params.orderTax,
      };
      dispatch(setSelectedCouponInfo(item));
      dispatch(useCoupon(data));
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity activeOpacity={1} onPress={() => handleCouponSelector(item)}>
          <ImageBackground
            resizeMode="contain"
            source={
              item.couponState === "0"
                ? require("../../assets/user/cuponValid.png")
                : item.couponState === "1"
                ? require("../../assets/user/couponUsed.png")
                : require("../../assets/user/couponInvalid.png")
            }
            style={styles.imageBackGroundContainer}
          >
            <View style={styles.couponContainer}>
              <Text style={styles.moneySign}>
                {item.couponType === "0" ? "$" : null}
                <Text style={{ fontSize: 56 }}>{item.couponRate}</Text>
                {item.couponType === "1" ? "%" : null}
              </Text>
              <View style={styles.couponMessage}>
                <Text style={styles.couponMessageText}>
                  {i18n.t("Before tax, not including deliver fee")}
                </Text>
              </View>
            </View>
            
            <View style={styles.couponSubTitleContainer}>
              <Text style={{color: item.couponState === "0" ? Colors.primary : "#707070",fontSize: 24}}>
                {i18n.t("couponRequirementStart")}{item.couponRequiredPrice}{i18n.t("couponRequirementEnd")}
              </Text>
              <Text style={{color: item.couponState === "0" ? Colors.primary : "#707070",fontSize: 10}}>
                {i18n.t("Event Time")} {item.couponStartDate}~{item.couponEndDate}
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };


  const renderLayout = () => {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={{ marginTop: 25 }}>{i18n.t("No Coupon")}</Text>
      </View>
    );
  };

  if(loading){
    return <LoadingScreen />;
  }else{
    return (
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        style={styles.container}
        showsVerticalScrollIndicator={false}
        data={couponList}
        renderItem={renderItem}
        ListEmptyComponent={renderLayout}
      />
    );
  }
 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    backgroundColor: Colors.midGrey,
  },
  imageBackGroundContainer:{
    height: screenHeight * 0.125,
    marginBottom: 5,
    width: screenWidth * 0.95,
    alignSelf: "center",
    resizeMode: "contain",
    justifyContent: "center",
    flexDirection: "row",
  },
  couponContainer:{
    width: "31%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  moneySign:{ color: "#ffffff", fontSize: 16 },
  couponMessage:{
    borderRadius: 20,
    borderColor: "#ffffff",
    borderWidth: 0.5,
  },
  couponMessageText:{
    color: "#ffffff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 6,
  },
  couponSubTitleContainer:{
    flex: 1,
    height: "100%",
    paddingVertical: 10,
    paddingLeft: 40,
    justifyContent: "space-around",
  },
});

// <View style={{ alignItems: "center" }}>
//   {/* spacing */}
//   <Spacing height="extraLarge" />

//   {/* 可使用 */}
//   <CouponSection type={"unusedImgURL"} num={3} />

//   {/* 已使用 */}
//   <CouponSection type={"usedImgURL"} num={1} />

//   {/* 已过期 */}
//   <CouponSection type={"expiredImgURL"} num={1} />
// </View>;
