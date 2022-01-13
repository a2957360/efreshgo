import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";

import { Colors } from "../../styles";

import {
  getPaymentMethod,
  deletePaymentMethod,
  resetAddPaymentMethodMessage,
  resetDeletePaymentMethod,
} from "../../actions/cart";

//components
import LoadingScreen from "../../components/LoadingScreen";
import LoadingSpinner from "../../components/LoadingSpinner";

//const
import { screenHeight, screenWidth } from "../../config/settings";

import { useNavigation } from "@react-navigation/native";

//package
import i18n from "i18n-js";

export default function Payment() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [requestLoading, setRequestLoading] = useState(false);

  const userDataRedux = useSelector((state) => state.accountData.userInfo);
  const cardList = useSelector((state) => state.cartData.getPaymentMethodData);
  const addPaymentMethodResultMessage = useSelector(
    (state) => state.cartData.addPaymentMethodResultMessage
  );
  const deletePaymentMethodResultMessage = useSelector(
    (state) => state.cartData.deletePaymentMethodResultMessage
  );
  const deletePaymentMethodStart = useSelector(
    (state) => state.cartData.deletePaymentMethodStart
  );

  useEffect(() => {
    const data = {
      isGet: "1",
      userNumber: userDataRedux.userNumber,
    };
    dispatch(getPaymentMethod(data));
  }, []);

  useEffect(() => {
    setRequestLoading(false);
    if (addPaymentMethodResultMessage === "fail") {
      Alert.alert("Error", "Can not add payment method!", [
        {
          text: i18n.t("Confirm"),
          onPress: () => dispatch(resetAddPaymentMethodMessage()),
          style: "ok",
        },
      ]);
    }
  }, [addPaymentMethodResultMessage]);

  useEffect(() => {
    async function popupResult() {
      await setRequestLoading(false);
      setTimeout(() => {
        if (deletePaymentMethodResultMessage === "success") {
          Alert.alert("Success", "Successfully delete a payment method!", [
            {
              text: i18n.t("Confirm"),
              onPress: () => {
                dispatch(resetDeletePaymentMethod());
                const data = {
                  isGet: "1",
                  userNumber: userDataRedux.userNumber,
                };
                dispatch(getPaymentMethod(data));
              },
              style: "ok",
            },
          ]);
        }

        if (deletePaymentMethodResultMessage == "fail") {
          Alert.alert("Error", "cant not delete a payment method!", [
            {
              text: i18n.t("Confirm"),
              onPress: () => dispatch(resetDeletePaymentMethod()),
              style: "ok",
            },
          ]);
        }
      }, 100);
    }

    popupResult();
  }, [deletePaymentMethodResultMessage]);

  const handleDeleteItem = async (item) => {
    Alert.alert(i18n.t("Warning"), i18n.t("deleteCreditCardWarning"), [
      {
        text: i18n.t("Confirm"),
        onPress: () => {
          deleteCreditCard(item);
        },
        style: "ok",
      },
      {
        text: i18n.t("Cancel"),
        onPress: () => {
          return;
        },
        style: "cancel",
      },
    ]);
  };

  const deleteCreditCard = async (item) => {
    await setRequestLoading(true);
    const data = {
      isDelete: "1",
      userNumber: userDataRedux.userNumber,
      cardNumber: item.id,
    };
    await dispatch(deletePaymentMethod(data));
  };

  const renderItem = ({ item, index }) => {
    return (
      <>
        <View key={item.id} style={styles.mainContainer}>
          <View style={{ flexDirection: "row" }}>
            <Image
              style={styles.creditCardImage}
              source={require("../../assets/user/creditCard.png")}
            />
            <Text style={styles.AddressText}>{item.value}</Text>
          </View>

          {/* default & delete buttons */}
          <View style={styles.buttonContainer}>
            {/* delete button */}
            <TouchableOpacity
              onPress={() => handleDeleteItem(item)}
              style={styles.deleteButton}
            >
              <Text style={styles.buttonText}>{i18n.t("Delete")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  const renderLayout = () => {
    return null;
  };

  const renderFooter = () => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("PaymentSetting")}
        activeOpacity={1}
      >
        <View style={styles.mainContainer}>
          <Text style={styles.AddressText}>
            {i18n.t("Add New Payment Method")}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // if (!cardList.data) {
  //   return <LoadingScreen />;
  // } else {
    return (
      <>
        <LoadingSpinner isVisible={requestLoading} />

        <FlatList
          keyExtractor={(item, index) => index.toString()}
          style={styles.flatListContainer}
          showsVerticalScrollIndicator={false}
          data={cardList.data ? cardList.data.slice(0, -1) : null}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderLayout}
        />
      </>
    );
  // }
}

const styles = StyleSheet.create({
  flatListContainer: {
    flex: 1,
    backgroundColor: Colors.midGrey,
  },
  mainContainer: {
    height: screenHeight * 0.05,
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    borderBottomWidth: screenWidth * 0.0006,
    borderBottomColor: Colors.darkGrey,
    backgroundColor: Colors.white,
  },

  AddressText: {
    fontSize: 15,
    alignSelf: "center",
    paddingHorizontal: 5,
  },

  deleteButton: {
    width: screenWidth * 0.15,
    height: screenHeight * 0.03,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: Colors.white,
  },
  creditCardImage: {
    height: 30,
    width: 30,
    resizeMode: "contain",
    alignSelf: "center",
  },
});
