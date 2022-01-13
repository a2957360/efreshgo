import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

//data

//config
import { screenWidth, screenHeight } from "../../config/settings";

//style
import { Colors } from "../../styles";

//package
import { Overlay } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import i18n from "i18n-js";

//react navigation
import { useNavigation } from "@react-navigation/native";

//components
import DeliveryTimeModal from "../cart/components/DeliveryTimeModal";
import LoadingScreen from "../../components/LoadingScreen";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  setStore,
  getStore,
  getUserInfomation,
  setDeliveryDate,
  setDeliveryTime,
} from "../../actions/account";
import { getProductPriceCart } from "../../actions/cart";

//components
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyCart from "../cart/components/EmptyCart";

export default function ChooseShop() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [visible, setVisible] = useState(false);

  const language = useSelector((state) => state.accountData.language);

  const userDataRedux = useSelector((state) => state.accountData.userInfo);

  const selectedAddress = useSelector(
    (state) => state.addressData.selectedAddress
  );
  const isSetStoreSuccessLoading = useSelector(
    (state) => state.accountData.isSetStoreSuccessLoading
  );
  const deliverTypeRedux = useSelector(
    (state) => state.cartData.deliverTypeRedux
  );

  const storeList = useSelector((state) => state.accountData.storeList);
  // const deliveryDate = useSelector((state) => state.accountData.deliveryDate);
  // const deliveryTime = useSelector((state) => state.accountData.deliveryTime);

  const onPageLoaded = () => {
    if (selectedAddress || selectedAddress != "") {
      dispatch(
        getStore({
          isGet: "1",
          userLocation: {
            lat: selectedAddress.addressGeometry.lat,
            lng: selectedAddress.addressGeometry.lng,
          },
          language: language,
        })
      );
    } else {
      Alert.alert(
        i18n.t("Error Message"),
        i18n.t("Please select your address before choose shop!"),
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
  };

  useEffect(() => {
    onPageLoaded();
  }, []);

  const handlePress = (item) => {
    dispatch(setStore(item));

    const storeOpenTime = item.storeOpenTime;

    const availableTimeDate = storeOpenTime.find(
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
      storeNumber: item.storeNumber,
      language: language,
      userGeometry: selectedAddress.addressGeometry,
      storeGeometry: item.storeLocation,
      expectDeliverTime:
        availableTimeDate.date +
        " " +
        availableTimeDate.time[0].slice(8) +
        ":00",
    };

    dispatch(getProductPriceCart(data));
    navigation.goBack();
  };

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const loadingIndicator = () => {
    return (
      <View style={{ flex: 1 }}>
        <LoadingSpinner />
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={item.storeNumber}
        activeOpacity={1}
        style={styles.shopContainer}
        onPress={() => handlePress(item)}
      >
        {/* shop avatar */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.storeImages }} style={styles.shopAvatar} />
        </View>

        {/* shop name & address */}
        <View style={styles.shopInfoContainer}>
          <Text style={styles.shopTitle}>{item.storeName}</Text>
          <Text style={styles.addressText}>{item.address}</Text>
          <Text style={styles.cityPostalText}>
            {item.city + " " + item.postal}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (!storeList) {
    return <LoadingScreen />;
  } else if (isSetStoreSuccessLoading) {
    return <LoadingScreen />;
  } else {
    return (
      <View style={styles.container}>
        {/* <Overlay
          isVisible={visible}
          onBackdropPress={() => {
            toggleOverlay();
          }}
          overlayStyle={styles.overlystyleContainer}
        >
          <DeliveryTimeModal
            toggleOverlay={toggleOverlay}
            data={storeOpenTime}
          />
        </Overlay> */}

        {/* store list */}
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={storeList}
          numColumns={1}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          ListEmptyComponent={
            <EmptyCart emptyMessage={"Currently there is no store available"} />
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  shopContainer: {
    width: screenWidth,
    height: screenHeight * 0.15,
    backgroundColor: Colors.white,
    flexDirection: "row",
    marginRight: 1,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    paddingRight: 10,
    justifyContent: "center",
  },
  shopAvatar: {
    width: screenWidth * 0.22,
    height: screenWidth * 0.22,
    resizeMode: "contain",
  },
  shopInfoContainer: {
    justifyContent: "center",
  },
  shopTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addressText: {
    fontSize: 12,
    paddingTop: 10,
  },
  cityPostalText: {
    fontSize: 12,
    paddingTop: 3,
  },
  overlystyleContainer: {
    width: "100%",
    height: "50%",
    position: "absolute",
    bottom: 0,
  },
});
