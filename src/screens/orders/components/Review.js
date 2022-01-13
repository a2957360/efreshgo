import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  TextInput,
  Image,
} from "react-native";

//config
import { screenHeight, screenWidth } from "../../../config/settings";
import { Colors } from "../../../styles";
import i18n from "i18n-js";
import Spacing from "../../../components/Spacing";

//component
import ReviewSection from "./ReviewSection";

//react navigation
import { useNavigation } from "@react-navigation/native";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  addReview,
  getStoreInfo,
  getDriverInfo,
  resetAddReviewResultMessage,
  changeOrderState
} from "../../../actions/order";


//package
import { Rating, AirbnbRating } from "react-native-ratings";
import InputScrollView from "react-native-input-scroll-view";

export default function Review(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { route } = props;

  const [storeReviewInput, setStoreReviewInput] = useState("");
  const [driverReviewInput, setDriverReviewInput] = useState("");
  const [storeRating, setStoreRating] = useState();
  const [driverRating, setDriverRating] = useState();
  // const [isDelivery, setIsDelivery] = useState();

  const userNumber = useSelector(
    (state) => state.accountData.userInfo.userNumber
  );
  // const languageCode = useSelector((state) => state.accountData.language);
  const addReviewResultMessage = useSelector(
    (state) => state.orderData.addReviewResultMessage
  );
  // const getStoreInfoResultData = useSelector(
  //   (state) => state.orderData.getStoreInfoResultData
  // );
  // const getDriverInfoResultData = useSelector(
  //   (state) => state.orderData.getDriverInfoResultData
  // );

  //获取商店和司机信息
  useEffect(() => {
    if (route.params?.orderInfo == undefined) {
      Alert.alert(
        i18n.t("Error Message"),
        i18n.t("System Error, please try again later!"),
        [
          {
            text: i18n.t("Confirm"),
            onPress: () => {
              navigation.goBack();
            },
            style: "ok",
          },
        ]
      );
    }
  }, []);

  useEffect(() => {
    if (addReviewResultMessage == "success") {
      Alert.alert(
        i18n.t("Success"),
        i18n.t("You have successfully made reviews!"),
        [
          {
            text: i18n.t("Confirm"),
            onPress: () => {
              dispatch(resetAddReviewResultMessage());
              navigation.goBack();
            },
            style: "ok",
          },
        ]
      );
    } else if (addReviewResultMessage == "fail") {
      Alert.alert(
        i18n.t("Error Message"),
        i18n.t("System Error, please try again later!"),
        [
          {
            text: i18n.t("Confirm"),
            onPress: () => {
              dispatch(resetAddReviewResultMessage());
              navigation.goBack();
            },
            style: "ok",
          },
        ]
      );
    }
  }, [addReviewResultMessage]);

  const handleSubmitPress = () => {
    const data = {
      userNumber: userNumber,
      orderNumber: route.params.orderInfo.orderNumber,
      storeRate: storeRating ? storeRating : "5",
      storeReview: storeReviewInput ? storeReviewInput : "",
      driverRate: driverRating ? driverRating : "5",
      driverReview: driverReviewInput ? driverReviewInput : "",
      orderState: "8",
    };

    dispatch(addReview(data));
  };


  if (route.params?.orderInfo != undefined) {
    return (
      <InputScrollView keyboardOffset={140}>
        <ScrollView style={{ flex: 1 }} keyboardDismissMode={"on-drag"}>
          {/* food review */}
          <ReviewSection
            storeName={route.params.orderInfo.storeName}
            phone={route.params.orderInfo.storePhone}
            reviewInput={storeReviewInput}
            setReviewInput={setStoreReviewInput}
            setRating={setStoreRating}
            type={"store"}
          />
          {/* driver review */}
          {route.params.orderInfo.deliverType == "0" ? null : (
            <ReviewSection
              driverName={
                route.params.orderInfo.driverName
                  ? route.params.orderInfo.driverName
                  : ""
              }
              phone={route.params.orderInfo.drvierPhone}
              reviewInput={driverReviewInput}
              setReviewInput={setDriverReviewInput}
              setRating={setDriverRating}
              type={"driver"}
            />
          )}

          {/* submit button */}
          <View style={styles.submitButtonContainer}>
            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={1}
              onPress={() => handleSubmitPress()}
            >
              <Text style={styles.text}>{i18n.t("Submit")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </InputScrollView>
    );
  }
}

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    width: screenWidth * 0.8,
    height: screenWidth * 0.1,
    borderRadius: 30,
  },
  text: {
    color: Colors.white,
    fontSize: 16,
  },
  submitButtonContainer: {
    paddingTop: 70,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.midGrey,
  },
});




      // 待评价变已完成(申请退款)
      // const data = {
      //   userNumber: userNumber,
      //   orderNumber: route.params.orderInfo.orderNumber,
      //   orderState: "8",
      // };
      // dispatch(changeOrderState(data));