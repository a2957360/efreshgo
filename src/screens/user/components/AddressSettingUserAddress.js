import React, { useState, useEffect } from "react";

//react navigation
import { useNavigation } from "@react-navigation/native";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Keyboard,
  ScrollView,
} from "react-native";

//style
import { Colors } from "../../../styles";

//package
import i18n from "i18n-js";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

//config
import { screenHeight, screenWidth } from "../../../config/settings";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  addAddress,
  resetAddAddressResultMessage,
  setAddressGeometry,
} from "../../../actions/address";

//component
import AddressSettingDetailsUserAddress from "./AddressSettingDetailsUserAddress";
//import AddressSettingDetails from "./AddressSettingDetails";

export default function AddressSettingUserAddress({ route }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState();
  const [addressInfo, setAddressInfo] = useState({
    addressStreet: "",
    addressRoomNo: "",
    addressPhone: "",
    addressUsername: "",
    addressComment: "",
    userNumber: "",
    addressGeometry: "",
    addressNumber: "",
  });

  //when page load, setAddress street,geolocation from params
  useEffect(() => {
    if (route.params?.prevAddress != undefined) {
      setAddressInfo({
        ...addressInfo,
        addressStreet: route.params.prevAddress.addressStreet,
        addressComment: route.params.prevAddress.addressComment,
        addressDefault: route.params.prevAddress.addressDefault,
        addressEmail: route.params.prevAddress.addressEmail,
        addressPhone: route.params.prevAddress.addressPhone,
        addressRoomNo: route.params.prevAddress.addressRoomNo,
        addressUsername: route.params.prevAddress.addressUsername,
        userNumber: route.params.prevAddress.userNumber,
        addressGeometry: route.params.prevAddress.addressGeometry,
        addressNumber: route.params.prevAddress.addressNumber,
      });
      if (route.params.prevAddress.addressDefault == "1") {
        setIsEnabled(true);
      } else {
        setIsEnabled(false);
      }
    }
  }, []);

  const userDataRedux = useSelector((state) => state.accountData.userInfo);

  return (
    <ScrollView keyboardShouldPersistTaps="always" style={{ margin: 6 }}>
      <View>
        {visible ? (
          <GooglePlacesAutocomplete
            placeholder="Search for delivery address"
            enablePoweredByContainer={false}
            returnKeyType={"next"}
            fetchDetails={true}
            onPress={(data, details = null) => {
              //dispatch(setAddressGeometry());
              const splitAddress = details.formatted_address.split(",");
              setAddressInfo({
                ...addressInfo,
                addressStreet:
                  splitAddress[0] + splitAddress[1] + splitAddress[2],
                userNumber: userDataRedux.userNumber,
                addressGeometry: details.geometry.location,
              });
              setVisible(false);
            }}
            query={{
              key: "AIzaSyDCmwMYRg9mGJDZ_ttRz9LVqaNTwcbtsyw",
              language: "en",
              region: "CA",
            }}
          />
        ) : (
          <AddressSettingDetailsUserAddress
            setVisible={setVisible}
            addressInfo={addressInfo}
            setAddressInfo={setAddressInfo}
            flag={route.params}
            isEnabled={isEnabled}
            setIsEnabled={setIsEnabled}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
