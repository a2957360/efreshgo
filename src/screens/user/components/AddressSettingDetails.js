import React, { useState, useEffect } from "react";

//react navigation
import { useNavigation } from "@react-navigation/native";

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  KeyboardAvoidingView,
} from "react-native";

//const
import { screenHeight, screenWidth } from "../../../config/settings";

//component
import Spacing from "../../../components/Spacing";
import { Colors } from "../../../styles";

//package
import { Ionicons } from "@expo/vector-icons";
import i18n from "i18n-js";
// import { TextInputMask } from "react-native-masked-text";

//translation data
import { languageData } from "../../../i18n/i18n";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  addAddress,
  resetAddAddressResultMessage,
  setSelectedAddress,
} from "../../../actions/address";
import {
  setStore,
  getStore,
  getUserInfomation,
  setDeliveryDate,
  setDeliveryTime,
} from "../../../actions/account";
import { getProductPriceCart } from "../../../actions/cart";

export default function AddressSettingDetails(props) {
  i18n.translations = languageData;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { setVisible, addressInfo, setAddressInfo, flag } = props;

  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedAddressLocalState, setSelectedAddressLocalState] = useState();
  // const [phoneInputRef, setPhoneInputRef] = useState();

  const userDataRedux = useSelector((state) => state.accountData.userInfo);

  const addAddressResultMessage = useSelector(
    (state) => state.addressData.addAddressResultMessage
  );
  // const addAddressResultData = useSelector(
  //   (state) => state.addressData.addAddressResultData
  // );
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

  const toggleSwitch = (newValue) => {
    if (newValue) {
      setAddressInfo({
        ...addressInfo,
        addressDefault: "1",
      });
    }
    setIsEnabled((previousState) => !previousState);
  };

  const handleSubmit = () => {
    if(addressInfo.addressUsername && addressInfo.addressPhone && addressInfo.addressUsername!="" && addressInfo.addressUsername!=""){
         //set local state
       setSelectedAddressLocalState(addressInfo);
        //store redux
        dispatch(setSelectedAddress(addressInfo));
        dispatch(addAddress(addressInfo));
        
    }else{
      Alert.alert(i18n.t("Error Message"), i18n.t("AddAddressErrorMessage"), [
        {
          text: "Confirm",
          onPress: () => {
            return
          },
          style: "ok",
        },
      ]);
    }
   
  };

  //添加地址成功的导航
  useEffect(() => {
    if (addAddressResultMessage == "success") {
      dispatch(resetAddAddressResultMessage());
      if (flag) {
        if (flag.homeFlag) {
          navigation.navigate("Home");
        } else if (flag.checkOutFlag) {
          navigation.navigate("Checkout");
        } else if (flag.userSettingFlag) {
          // navigation.navigate("User");
          navigation.goBack();
        }
      }
    }
  }, [dispatch, addAddressResultMessage]);

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
      // if (flag?.checkOutFlag) {
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

        // console.log("first store opent ime", availableTimeDate);

        //获取一次运费价格
        const data = {
          deliverType: deliverTypeRedux == "Store Delivery" ? "1" : "0",
          isGetPrice: "1",
          userNumber: userDataRedux.userNumber,
          storeNumber: storeList[0].storeNumber,
          language: languageCode,
          userGeometry: selectedAddress.addressGeometry,
          storeGeometry: storeList[0].storeLocation,
          expectDeliverTime:
            availableTimeDate.date +
            " " +
            availableTimeDate.time[0].slice(8) +
            ":00",
        };
        dispatch(getProductPriceCart(data));
      // }
    }
  }, [storeList]);

  return (
    <KeyboardAvoidingView behavior={"position"} style={{ flex: 1 }}>
      <ScrollView keyboardDismissMode={"on-drag"}>
        {/* address */}
        <View style={styles.addressContainer}>
          <View style={styles.containerTitle}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {i18n.t("Address")}
            </Text>
          </View>

          {/* go back to search addres */}
          <TouchableOpacity
            onPress={() => {
              setVisible(true);
            }}
          >
            <View style={styles.selectedAddressContainer}>
              <View style={{ flex: 0.95 }}>
                <Text style={{ fontSize: 16 }}>
                  {addressInfo.addressStreet}
                </Text>
              </View>
              <View style={styles.arrowContainer}>
                <Ionicons name="ios-arrow-forward" size={20} color="grey" />
              </View>
            </View>
          </TouchableOpacity>

          {/* roomNumber input */}
          <View style={styles.inputContainer}>
            <TextInput
              maxLength={6}
              value={addressInfo.addressRoomNo}
              onChangeText={(text) =>
                setAddressInfo({
                  ...addressInfo,
                  addressRoomNo: text,
                })
              }
              placeholder={i18n.t("House/room number")}
              returnKeyType={"done"}
              keyboardType={"numbers-and-punctuation"}
              style={{ flex: 1, fontSize: 16 }}
            />
          </View>

          {/* notes input */}
          <View style={styles.inputContainer}>
            <TextInput
              maxLength={55}
              value={addressInfo.addressComment}
              onChangeText={(text) =>
                setAddressInfo({
                  ...addressInfo,
                  addressComment: text,
                })
              }
              placeholder={i18n.t("Notes")}
              returnKeyType={"done"}
              style={{ flex: 1, fontSize: 16 }}
            />
          </View>

          {/* set to default address */}
          <View style={styles.selectedAddressContainer}>
            <Text style={{ fontSize: 16 }}>
              {i18n.t("Set default address")}
            </Text>
            <Switch
              trackColor={{ false: Colors.lightGrey, true: Colors.primary }}
              thumbColor={isEnabled ? Colors.white : Colors.white}
              ios_backgroundColor={Colors.lightGrey}
              onValueChange={(newValue) => toggleSwitch(newValue)}
              value={isEnabled}
            />
          </View>
        </View>

        <Spacing height="large" />

        {/* user info */}
        <View style={styles.userInfoCotainer}>
          <View style={styles.userInfoContainerTitle}>
            <Text style={{ fontSize: 16, fontWeight: "bold"}}>
              {i18n.t("User Information")}
            </Text>
            <Text style={{ fontSize: 9,paddingHorizontal:5 }}>
              {i18n.t("UserInformationMessage")}
            </Text>
          </View>

          {/* name input */}
          <View style={styles.inputContainer}>
            <TextInput
              maxLength={30}
              value={addressInfo.addressUsername}
              onChangeText={(text) =>
                setAddressInfo({
                  ...addressInfo,
                  addressUsername: text,
                })
              }
              placeholder={i18n.t("NameRequired")}
              returnKeyType={"done"}
              style={{ flex: 1, fontSize: 16 }}
            />
          </View>

          {/* phone number input */}
          <View style={styles.inputContainerLast}>
            <TextInput
              maxLength={10}
              value={addressInfo.addressPhone}
              onChangeText={(text) =>
                setAddressInfo({
                  ...addressInfo,
                  addressPhone: text,
                })
              }
              keyboardType={"numeric"}
              placeholder={i18n.t("PhoneNumberRequired")}
              returnKeyType={"done"}
              style={{ flex: 1, fontSize: 16 }}
            />

            {/* <TextInputMask
              type={"custom"}
              options={{
                mask: "999 999 9999",
              }}
              value={addressInfo.addressPhone}
              onChangeText={(text) => handlePhoneInputChange(text)}
              ref={(ref) => setPhoneInputRef(ref)}
              style={{ flex: 1, fontSize: 18 }}
              placeholder={i18n.t("PhoneNumber")}
              maxLength={12}
              keyboardType={"phone-pad"}
              returnKeyType={"done"}
            /> */}
          </View>
        </View>

        <Spacing height="large" />

        {/* submit button */}
        <View style={styles.submitButtonBox}>
          <TouchableOpacity
            style={styles.submitButtonContainer}
            activeOpacity={1}
            onPress={() => handleSubmit()}
          >
            <Text style={styles.text}>{i18n.t("Submit")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  addressContainer: {
    width: screenWidth,
    height: screenHeight * 0.325,
    backgroundColor: Colors.white,
    
  },
  containerTitle: {
    height: screenHeight * 0.065,
    width: "100%",
    borderBottomColor: Colors.darkGrey,
    borderBottomWidth: 0.2,
    justifyContent: "center",
    paddingHorizontal: 20,
   
  },
  userInfoContainerTitle: {
    height: screenHeight * 0.065,
    width: "100%",
    borderBottomColor: Colors.darkGrey,
    borderBottomWidth: 0.2,
    //justifyContent: "center",
    paddingHorizontal: 20,
    flexDirection:'row',
    alignItems:"center",
    
  },
  inputContainer: {
    height: screenHeight * 0.065,
    width: "100%",
    borderBottomColor: Colors.darkGrey,
    borderBottomWidth: 0.2,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  selectedAddressContainer: {
    height: screenHeight * 0.065,
    width: "100%",
    borderBottomColor: Colors.darkGrey,
    borderBottomWidth: 0.2,
    alignItems: "center",
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainerLast: {
    height: screenHeight * 0.065,
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  noteContainer: {
    width: screenWidth,
    height: screenHeight * 0.13,
    backgroundColor: Colors.white,
  },
  submitButtonContainer: {
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
  userInfoCotainer: {
    width: screenWidth,
    height: screenHeight * 0.2,
    backgroundColor: Colors.white,
  },
  submitButtonBox: {
    width: screenWidth,
    height: screenHeight * 0.1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  arrowContainer: {
    flex: 0.05,
    justifyContent: "center",
    alignItems: "center",
  },
});

{
  /* notes */
}
{
  /* <View style={styles.noteContainer}>
        <View style={styles.containerTitle}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>备注</Text>
        </View>

        <View style={styles.inputContainerLast}>
          <TextInput
            value={inputValue}
            onChangeText={(text) => setInputValue(text)}
            placeholder="备注"
            style={{ flex: 1, fontSize: 18 }}
          />
        </View>
      </View> */
}
