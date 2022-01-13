import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

//package
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import i18n from "i18n-js";
import { Overlay } from "react-native-elements";

//config
import { screenWidth } from "../../../config/settings";

//style
import { Colors } from "../../../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

//component
import DeliveryTimeModal from "../../cart/components/DeliveryTimeModal";

export default function HomeHeader({ navigation, flag }) {
  const [visible, setVisible] = useState(false);
  const [storeOpenTime, setStoreOpenTime] = useState();
  const [storeOperatingTimeData, setStoreOperatingTimeData] = useState();
  const [storeNameLocal, setStoreNameLocal] = useState();

  const accountData = useSelector((state) => state.accountData);

  // const toggleOverlay = () => {
  //   setVisible(!visible);
  // };

  return (
    <View style={styles.mainContainer}>
      {/* app logo */}
      {/* <View style={styles.logoDeliveryInfoContainer}> */}
      {/* efreshgo logo */}
      {/* <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/header/headerLeft.png")}
            style={styles.logo}
          />
        </View> */}
      {/* store name & delivery date & time */}

      {/* <Overlay
        isVisible={visible}
        onBackdropPress={() => {
          toggleOverlay();
        }}
        overlayStyle={{
          width: "100%",
          height: "50%",
          position: "absolute",
          bottom: 0,
        }}
      >
        <DeliveryTimeModal
          toggleOverlay={toggleOverlay}
          data={storeOperatingTimeData}
        />
      </Overlay> */}

      {/* store name */}
      {/* {accountData && storeOperatingTimeData ? (
        <View style={styles.deliveryInfoContainer}>
          <View style={styles.storeNameDeliveryDateContainer}>
            <Text style={styles.deliveryInfoStoreName}>
              {storeNameLocal ? storeNameLocal : null}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              toggleOverlay();
              setStoreOpenTime(storeOperatingTimeData);
            }}
            style={styles.deliveryTimeArrowContainer}
          >
            <Text style={styles.deliveryInfo}>
              {deliveryDate.substring(5, 7) +
                "/" +
                deliveryDate.substring(8, 10)}
            </Text>
            <Text style={styles.deliveryInfo}>{deliveryTime}</Text>
            <Text style={styles.deliveryInfo}>{i18n.t("Delivery")}</Text>
            <Ionicons
              name="ios-arrow-forward"
              size={16}
              color={Colors.primary}
              style={{ alignSelf: "center" }}
            />
          </TouchableOpacity>
        </View>
      ) : null} */}

      {/* location and search bar */}
      <View style={styles.locationSearchBarContainer}>
        {/* location icon  todo pass flag to the params */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            navigation.navigate("Address", {
              homeFlag: true,
            });
          }}
        >
          <MaterialIcons
            name="location-on"
            size={28}
            color={Colors.primary}
            //style={{ width: 30 }}
          />
        </TouchableOpacity>

        {/* search box */}
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1 }}
          onPress={() => {
            navigation.navigate("Search");
          }}
        >
          <View style={styles.searchBoxContainer}>
            <View style={styles.searchIcon}>
              <AntDesign name="search1" size={16} color={Colors.darkGrey} />
            </View>

            {/* <View style={styles.textContainer}>
              <Text style={{ color: Colors.darkGrey }}>搜索最新美食</Text>
            </View> */}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoDeliveryInfoContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 10,
    //justifyContent: "space-between",
  },
  locationSearchBarContainer: {
    flexDirection: "row",
    marginLeft: 10,
    // marginVertical: 10,
    alignItems: "center",
  },
  searchBoxContainer: {
    backgroundColor: Colors.midGrey,
    marginHorizontal: 10,
    borderRadius: 20,
    flexDirection: "row",
  },
  searchIcon: {
    marginLeft: 10,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 15,
    justifyContent: "center",
  },
  logo: {
    height: screenWidth * 0.08,
    width: screenWidth * 0.2,
    resizeMode: "contain",
    //backgroundColor: "red",
  },
  deliveryInfo: {
    alignSelf: "center",
    color: Colors.primary,
    fontWeight: "bold",
    paddingHorizontal: 5,
    fontSize: 14,
  },
  deliveryInfoStoreName: {
    alignSelf: "center",
    color: Colors.primary,
    fontWeight: "bold",
    paddingHorizontal: 5,
    fontSize: 14,
  },
  mainContainer: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  logoContainer: {
    flex: 0.2,
  },
  deliveryInfoContainer: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 5,
  },
  storeNameDeliveryDateContainer: {
    flex: 0.4,
    flexDirection: "row",
  },
  deliveryTimeArrowContainer: {
    flex: 0.6,
    flexDirection: "row",
    justifyContent: "flex-end",
    //backgroundColor: "blue",
  },
});
