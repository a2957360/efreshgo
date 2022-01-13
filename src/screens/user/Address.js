import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

//import { addressList } from "../../config/data";

//style
import { Colors } from "../../styles";

//const
import { screenHeight, screenWidth } from "../../config/settings";

//package
import i18n from "i18n-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  getAddress,
  deleteAddress,
  resetDeleteAddressResultMessage,
  setSelectedAddress,
} from "../../actions/address";
import {
  setStore,
  getStore,
  getUserInfomation,
  setDeliveryDate,
  setDeliveryTime,
} from "../../actions/account";
import { getProductPriceCart } from "../../actions/cart";

//component
import LoadingSpinner from "../../components/LoadingSpinner";

//import { setDeliverAddress } from "../../actions/account";

export default function Address({ route }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [selectedAddressLocalState, setSelectedAddressLocalState] = useState();

  const userDataRedux = useSelector((state) => state.accountData.userInfo);

  const addressList = useSelector(
    (state) => state.addressData.getAddressResultData
  );
  const deleteAddressMessage = useSelector(
    (state) => state.addressData.deleteAddressResultMessage
  );
  const languageCode = useSelector((state) => state.accountData.language);
  const storeList = useSelector((state) => state.accountData.storeList);

  const selectedAddress = useSelector(
    (state) => state.addressData.selectedAddress
  );
  const deliverTypeRedux = useSelector(
    (state) => state.cartData.deliverTypeRedux
  );

  // const deliveryDate = useSelector((state) => state.accountData.deliveryDate);
  // const deliveryTime = useSelector((state) => state.accountData.deliveryTime);

  //每次进来都获取自己的地址
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      const data = {
        isGet: "1",
        userNumber: userDataRedux.userNumber,
      };

      dispatch(getAddress(data));
    });
    return unsubscribe;
  }, [navigation]);

  //当选中地址后，存local state，callback调取店铺列表
  useEffect(() => {
    if (selectedAddressLocalState != undefined) {
      if (selectedAddressLocalState) {
        dispatch(
          getStore({
            isGet: "1",
            userLocation: {
              lat: selectedAddressLocalState.addressGeometry.lat,
              lng: selectedAddressLocalState.addressGeometry.lng,
            },
            language: languageCode,
          })
        );
      } else {
        console.log("choose addres failed", selectedAddressLocalState);
      }
    }
  }, [selectedAddressLocalState]);

  //获取店铺之后，自动选择第一个店铺存入redux
  useEffect(() => {
    if (storeList && storeList.length > 0) {
      if (route.params?.checkOutFlag) {
        dispatch(setStore(storeList[0]));

        // first store
        const firstStore = storeList[0];
        const firstStoreOpenTime = firstStore["storeOpenTime"];

        const availableTimeDate = firstStoreOpenTime.find(
          (element) => element.time.length > 0
        );
        //存配送时间到redux
        dispatch(setDeliveryDate(availableTimeDate.date));
        dispatch(setDeliveryTime(availableTimeDate.time[0]));

        // //获取一次运费价格
        const data = {
          deliverType: deliverTypeRedux == "Store Delivery" ? "1" : "0",
          isGetPrice: "1",
          userNumber: userDataRedux.userNumber,
          storeNumber: storeList[0].storeNumber,
          language: languageCode,
          userGeometry: selectedAddress ? selectedAddress.addressGeometry : "",
          storeGeometry: storeList[0].storeLocation,
          expectDeliverTime:
            availableTimeDate.date +
            " " +
            availableTimeDate.time[0].slice(8) +
            ":00",
        };
        dispatch(getProductPriceCart(data));
      }
    }
  }, [storeList]);

  useEffect(() => {
    if (deleteAddressMessage == "success") {
      const data = {
        isGet: "1",
        userNumber: userDataRedux.userNumber,
      };

      dispatch(getAddress(data));
      dispatch(resetDeleteAddressResultMessage());
    }
  }, [deleteAddressMessage]);

  const handleDeleteAddress = (addressNumber) => {
    const data = {
      addressNumber: [addressNumber],
      isDelete: "1",
    };

    dispatch(deleteAddress(data));
  };

  //如果是从userSetting进来，点进去修改地址页面
  const handleSetDeliverAddress = (data) => {
    if (route.params?.userSettingFlag || route.params?.homeFlag) {
      navigation.navigate("AddressSettingUserAddress", { prevAddress: data });
    } else {
      setSelectedAddressLocalState(data);
      dispatch(setSelectedAddress(data));
      navigation.goBack();
    }
  };

  const handleAddAddressNavigation = () => {
    if (route.params?.homeFlag) {
      navigation.navigate("AddressSetting", {
        homeFlag: true,
      });
    } else if (route.params?.checkOutFlag) {
      navigation.navigate("AddressSetting", {
        checkOutFlag: true,
      });
    } else if (route.params?.userSettingFlag) {
      navigation.navigate("AddressSetting", {
        userSettingFlag: true,
      });
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.addressListContainer}>
        {/* address box */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handleSetDeliverAddress(item)}
          key={item.id}
          style={styles.addressContainer}
        >
          <Text>{item.addressStreet} </Text>
        </TouchableOpacity>

        {/* button box */}
        <View style={styles.buttonsContainer}>
          {/* default button  */}
          {item.addressDefault == "1" ? (
            <View
              style={
                item.addressDefault
                  ? styles.defaultButton
                  : styles.notDefaultButton
              }
            >
              <Text
                style={
                  item.addressDefault
                    ? styles.buttonText
                    : styles.buttonDefaultText
                }
              >
                {i18n.t("Default Address")}
              </Text>
            </View>
          ) : (
            //空白间隙
            <View style={styles.notDefaultButton}>
              <Text style={styles.buttonDefaultText}></Text>
            </View>
          )}

          {/* delete button  */}
          <TouchableOpacity
          activeOpacity={1}
            onPress={() => handleDeleteAddress(item.addressNumber)}
          >
            <View style={styles.deleteButton}>
              <Text style={styles.buttonText}>{i18n.t("Delete")}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (!addressList) {
    return <LoadingSpinner />;
  } else {
    return (
      <ScrollView style={{ flex: 1 }}>
        {/* addressList */}
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={addressList}
          numColumns={1}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          ListEmptyComponent={null}
        />

        {/* add new address */}
        <TouchableOpacity
          onPress={() => handleAddAddressNavigation()}
          activeOpacity={1}
          style={styles.addAddressContainer}
        >
          <View>
            <Text style={styles.AddressText}>{i18n.t("Add New Address")}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  AddressText: {
    fontSize: 13,
    textAlign: "left",
  },
  defaultButton: {
    width: screenWidth * 0.15,
    height: screenHeight * 0.03,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notDefaultButton: {
    //borderColor: Colors.primary,
    //borderWidth: 1,
    width: screenWidth * 0.15,
    height: screenHeight * 0.03,
    backgroundColor: Colors.white,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
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
    justifyContent: "space-evenly",
    width: screenWidth * 0.38,
    height: 50,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 12,
  },
  buttonDefaultText: {
    color: Colors.primary,
    fontSize: 12,
  },
  addAddressContainer: {
    height: 50,
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: 5,
    borderBottomWidth: screenWidth * 0.0006,
    borderBottomColor: Colors.darkGrey,
    backgroundColor: Colors.white,
  },
  addressContainer: {
    width: screenWidth * 0.65,
    paddingHorizontal: 5,
    justifyContent: "center",
    backgroundColor: Colors.white,
    // backgroundColor: "yellow",
  },
  buttonsContainer: {
    width: screenWidth * 0.35,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  addressListContainer: {
    height: 50,
    width: screenWidth,
    flexDirection: "row",
    borderBottomWidth: screenWidth * 0.0006,
    borderBottomColor: Colors.darkGrey,
  },
});
