import React, { useState, useEffect } from "react";

//react navigation
import { useNavigation } from "@react-navigation/native";

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  ScrollView,
} from "react-native";

//components
import Spacing from "../../components/Spacing";
import InputScrollView from "react-native-input-scroll-view";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import axios from "axios";

//package
import i18n from "i18n-js";
import { screenHeight, screenWidth } from "../../config/settings";
import { useActionSheet } from "@expo/react-native-action-sheet";
import ImageUpload from "../../components/ImageUpload";
import { serverUrl } from "../../config/settings";

//style
import { Colors } from "../../styles";

//redux
import { useSelector } from "react-redux";
import {changeOrderState} from "../../actions/order"

export default function Refund({ route }) {
  const { orderNumber, userNumber } = route.params;
  const [orderDetail, setOrderDetail] = useState();
  const [refundForm, setRefundForm] = useState({});
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { showActionSheetWithOptions } = useActionSheet();

  const getOrdersResultData = useSelector(
    (state) => state.orderData.getOrdersResultData
  );

  useEffect(() => {
    initRefund();
  }, [orderNumber]);

  const initRefund = () => {
    setOrderDetail(
      getOrdersResultData.filter(
        (order) => order.orderNumber === orderNumber
      )[0]
    );
    setRefundForm({
      userNumber: userNumber,
      orderNumber: orderNumber,
      refundImage: [],
      refundReview: "",
      orderState: "",
    });
  };

  const renderRefundImages = ({ item, index }) => {
    return (
      <>
        <View style={{ marginLeft: 5, paddingVertical: 5 }}>
          <TouchableOpacity
            activeOpacity={1}
            style={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}
            onPress={() => deleteImg(item)}
          >
            <Entypo name="squared-cross" size={24} color="red" />
          </TouchableOpacity>
          <Image
            style={{
              marginHorizontal: 5,
              height: 100,
              width: 100,
              borderRadius: 10,
            }}
            source={{ uri: item }}
            resizeMode="cover"
          />
        </View>
        {index === refundForm.refundImage.length - 1 ? (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => showUploadOption()}
            style={{
              margin: 5,
              height: 100,
              width: 100,
              backgroundColor: Colors.white,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AntDesign name="plus" size={24} color="black" />
          </TouchableOpacity>
        ) : null}
      </>
    );
  };

  const showUploadOption = () => {
    const actionOptions = [i18n.t("Camera"), i18n.t("Album"), i18n.t("Cancel")];
    showActionSheetWithOptions(
      {
        title: i18n.t("uploadImage"),
        options: actionOptions,
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          default:
            break;
          case 0:
            takePhoto();
            break;
          case 1:
            pickPhoto();
            break;
        }
      }
    );
  };

  const takePhoto = async () => {
    const imageObj = await ImageUpload.takeAvatarPhoto();
    if (!imageObj) {
      return;
    }
    const formData = new FormData();
    formData.append("uploadImages", {
      uri: imageObj.uri,
      type: "image/jpeg",
      name: `refundImages.${imageObj.uri.split(".")[1]}`,
    });
    formData.append("isUploadImage", "1");
    const result = await axios.post(`${serverUrl}imageModule.php`, formData);
    const imageURL = result.data.data[0];
    setRefundForm({
      ...refundForm,
      refundImage: [...refundForm.refundImage, imageURL],
    });
  };

  const pickPhoto = async () => {
    const imageObj = await ImageUpload.pickAvatarPhoto();
    if (!imageObj) {
      return;
    }
    const formData = new FormData();
    formData.append("uploadImages", {
      uri: imageObj.uri,
      type: "image/jpeg",
      name: `refundImages.${imageObj.uri.split(".")[1]}`,
    });
    formData.append("isUploadImage", "1");
    const result = await axios.post(`${serverUrl}imageModule.php`, formData);
    const imageURL = result.data.data[0];
    setRefundForm({
      ...refundForm,
      refundImage: [...refundForm.refundImage, imageURL],
    });
  };

  const deleteImg = async (img) => {
    const query = {
      deleteImages: [img],
    };
    const { data } = await axios.post(`${serverUrl}imageModule.php`, query);
    if (data.message === "success") {
      setRefundForm({
        ...refundForm,
        refundImage: [...refundForm.refundImage].filter((uri) => uri !== img),
      });
    }
  };

  const handleSubmit = async () => {
    if (refundForm.refundImage.length === 0) {
      Alert.alert(i18n.t("cannotSubmit"), i18n.t("refundNoImage"));
      return;
    }
    if (refundForm.refundReview === "") {
      Alert.alert(i18n.t("cannotSubmit"), i18n.t("refundNoReview"));
      return;
    }
    const submitForm = { ...refundForm, orderState: 9 };
    setLoading(true);

    console.log('this is submitForm',submitForm)
    const result = await axios.post(`${serverUrl}userOrderManage.php`, submitForm);
    if (result.data.message === "success") {
      Alert.alert(
        i18n.t("RefundApplicationSubmitted"),
        i18n.t("SubmitSuccessMsg")
      )
      setLoading(false);
      navigation.goBack();
    } else {
      Alert.alert(
        i18n.t("RefundApplicationSubmittedFail"),
        i18n.t("SubmitFailMsg")
      );
      setLoading(false);
      return;
    }
  };

  if (!orderDetail || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <InputScrollView
        keyboardOffset={140}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          style={{ flex: 1 }}
          keyboardDismissMode={"on-drag"}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.orderDetailContainer}>
              <View style={styles.cardContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.titleText}>
                    {i18n.t("OrderNumber")}: {orderDetail.orderNo}
                  </Text>
                  <Text style={{ fontSize: 14 }}>
                    {orderDetail.orderCreateTime.split(" ")[0]}
                  </Text>
                </View>
                <View style={styles.titleContainer}>
                  <Text style={styles.titleText}>
                    {i18n.t("ProductDetail")}
                  </Text>
                </View>
                {/* itemList */}
                <View style={styles.titleContainer}>
                  <Text style={{ fontSize: 14 }}>{i18n.t("Sum")}</Text>
                  <Text style={{ fontSize: 14 }}>
                    $ {orderDetail.itemPrice}
                  </Text>
                </View>
                <View style={styles.titleContainer}>
                  <Text style={{ fontSize: 14 }}>{i18n.t("DeliveryFee")}</Text>
                  <Text style={{ fontSize: 14 }}>
                    $ {orderDetail.deliverPrice}
                  </Text>
                </View>
                <View style={styles.titleContainer}>
                  <Text style={{ fontSize: 14 }}>{i18n.t("GST/PST")}</Text>
                  <Text style={{ fontSize: 14 }}>$ {orderDetail.orderTax}</Text>
                </View>
                <View style={styles.titleContainer}>
                  <Text style={{ fontSize: 14 }}>{i18n.t("Total")}</Text>
                  <Text style={{ fontSize: 14 }}>
                    $ {orderDetail.itemPrice}
                  </Text>
                </View>
                <View style={styles.titleContainer}>
                  <Text style={styles.titleText}>
                    {i18n.t("DeliveryMethod")}:{" "}
                    {orderDetail.deliverType == "1" ? i18n.t("Store Delivery") : i18n.t("Self Pickup")}
                  </Text>
                </View>
                <View style={styles.titleContainer}>
                  <Text style={styles.titleText}>
                    {i18n.t("DeliveryTime")}: {orderDetail.expectDeliverTime}
                  </Text>
                </View>
                <View style={styles.titleContainer}>
                  <Text style={styles.titleText}>{i18n.t("uploadImage")}</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    backgroundColor: Colors.white,
                  }}
                >
                  <FlatList
                    keyExtractor={(item, index) =>
                      `refundImages_${index.toString()}`
                    }
                    data={refundForm.refundImage}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderRefundImages}
                    ListEmptyComponent={
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => showUploadOption()}
                        style={{
                          margin: 5,
                          height: 100,
                          width: 100,
                          backgroundColor: Colors.midGrey,
                          borderRadius: 10,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <AntDesign name="plus" size={24} color="black" />
                      </TouchableOpacity>
                    }
                  />
                </View>
              </View>
              <Spacing height="large" />

              <Spacing height="large" />
              <TextInput
                style={styles.reviewInputContainer}
                multiline
                // numberOfLines={3}
                // maxLength={120}
                placeholder={i18n.t("RefundReason")}
                onChangeText={(text) =>
                  setRefundForm({ ...refundForm, refundReview: text })
                }
                value={refundForm.refundReview}
              />
            </View>
          </View>
          {/* submit button */}
          <View style={styles.submitButtonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              activeOpacity={1}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.submitButtonTitle}>{i18n.t("Submit")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </InputScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midGrey,
  },
  orderDetailContainer: {
    backgroundColor: Colors.white,
    width: screenWidth,
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
  imageContainer: {},
  reviewInputContainer: {
    height: 100,
    width: "100%",
    backgroundColor: Colors.white,
    paddingHorizontal: 15,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    width: screenWidth * 0.8,
    height: screenWidth * 0.1,
    borderRadius: 30,
  },
  submitButtonTitle: {
    color: Colors.white,
    fontSize: 16,
  },
  submitButtonContainer: {
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.midGrey,
  },
});



    // //申请退款变等待退款审核  
    // const changeOrderStateInput = {
    //   userNumber: userNumber,
    //   orderNumber: orderNumber,
    //   orderState: "9",
    // };
     // dispatch(changeOrderState(changeOrderStateInput));