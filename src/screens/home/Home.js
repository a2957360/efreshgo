//react
import React, { useState, useEffect, useLayoutEffect } from "react";

//react navigation
import { useNavigation } from "@react-navigation/native";

//react native components
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
  RefreshControl,
} from "react-native";

//components
import Broadcast from "./components/Broadcast";
import Transformer from "./components/Transformer";
import DoubleAdvertisement from "./components/DoubleAdvertisement";
import SingleRowItemList from "../../components/SingleRowItemList";
import SingleAdvertisement from "../../components/SingleAdvertisement";
import TripleColumnItemList from "../../components/TripleColumnItemList";
import BannerProductList from "../../components/BannerProductList";
import LoadingScreen from "../../components/LoadingScreen";
import HomeHeader from "./components/HomeHeader";

//packages
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";
import axios from "axios";
import { serverUrl } from "../../config/settings";

//translation data
import { languageData } from "../../i18n/i18n";

//styles
import { Colors } from "../../styles";

//redux
import { useDispatch, useSelector } from "react-redux";
import { getHomePageLayout, setSendNotificationFlag } from "../../actions/home";
// import { resetGetVerificationResult } from "../../actions/account";
import { reGetProductFromCart } from "../../actions/cart";

//expo notification
import * as Notifications from "expo-notifications";
import * as Permissions from 'expo-permissions';
import Constants from "expo-constants";

function Home() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  i18n.translations = languageData;

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);

  //langauge code
  const languageCode = useSelector((state) => state.accountData.language);
  const userInfo = useSelector((state) => state.accountData.userInfo);

  const getProductFromCartResultData = useSelector(
    (state) => state.cartData.getProductFromCartResultData
  );

  const makeOrderResultMessage = useSelector(
    (state) => state.cartData.makeOrderResultMessage
  );

  const homePageLayoutData = useSelector(
    (state) => state.homeData.getHomePageLayoutResultData
  );

  const isFirstTimeSendNotificationToken = useSelector(
    (state) => state.homeData.isFirstTimeSendNotificationToken
  );

  //push notification
  useEffect(() => {
    if(isFirstTimeSendNotificationToken){
      registerForPushNotificationsAsync();
    }
    Notifications.addNotificationReceivedListener(handleNotification);
    // Notifications.addNotificationResponseReceivedListener(
    //   handleNotificationResponse
    // );
  }, []);

  //push notification
  const registerForPushNotificationsAsync = async () => {
    //only for bare project
    let experienceId = '@finestudioapp/eFreshGo';

    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync({experienceId})).data;

      //store pushNotification to asyncStorage
      await AsyncStorage.setItem("notificationToken", JSON.stringify(token));

      //send the token to backend, set flag to false
      const tokenData = {
        "setExpoToken":"1",
        "userNumber": userInfo.userNumber,
        "userExpoToken": token,
      }    
      const result = await axios.post(`${serverUrl}userModule.php`, tokenData);
      // console.log('this is result', result.data)
      dispatch(setSendNotificationFlag(false))
      console.log('this is token',token);

    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
};
  

  //push notification
  const handleNotification = (notification) => {
    if (notification) {
      const navigationPage = notification.request.content.data.pageName;
      const message = notification.request.content.body;
      Alert.alert("You have new message", message, [
        {
          text: "Confirm",
          onPress: () => {
            // navigation.navigate(navigationPage);
            console.log('this is navigation page', navigationPage)
          },
          style: "ok",
        },
      ]);
    }
  };

  // const handleNotificationResponse = (response) => {
  //   console.log(response);
  // };

  //获取首页layout数据
  useEffect(() => {
    getHomePageData();
  }, []);

  //为SingleRowItemList获取购物车数据
  useEffect(() => {
    if (userInfo || makeOrderResultMessage) {
      getSingleRowItemListData();
    }
  }, [userInfo, makeOrderResultMessage]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: ({ navigation }) => {
        return (
          <SafeAreaView style={styles.homeHeaderContainer}>
            <HomeHeader navigation={navigation} flag={true} />
          </SafeAreaView>
        );
      },
    });
  });

  const getHomePageData = () => {
    const data = {
      isGet: "1",
      language: languageCode,
    };
    dispatch(getHomePageLayout(data));
  };

  const getSingleRowItemListData = () => {
    const getProductDataInput = {
      isGet: "1",
      userNumber: userInfo.userNumber,
    };
    dispatch(reGetProductFromCart(getProductDataInput));
  };

  //handle refresh event
  const handleRefresh = async (index) => {
    if (!refreshing) {
      getHomePageData();
      getSingleRowItemListData();
      setRefreshing(false);
    }
  };

  if (!homePageLayoutData || !getProductFromCartResultData || !userInfo) {
    return <LoadingScreen />;
  } else {
    return (
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        style={styles.container}
        showsVerticalScrollIndicator={false}
        data={null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => handleRefresh()}
          />
        }
        ListEmptyComponent={
          <>
            {homePageLayoutData.map((layout) => {
              switch (layout.componentTitle) {
                case "homeBanner":
                  return (
                    <BannerProductList
                      key="homeBanner"
                      data={layout.componentContent}
                    />
                  );
                case "homeBoardCast":
                  return (
                    <Broadcast
                      key="homeBoardCast"
                      data={layout.componentContent}
                    />
                  );
                case "homeTransformer":
                  return (
                    <Transformer
                      key="homeTransformer"
                      data={layout.componentContent}
                    />
                  );
                case "homeAdvertisement":
                  return (
                    <DoubleAdvertisement
                      key="homeAdvertisement"
                      data={layout.componentContent}
                    />
                  );
                case "productCarousels":
                  return (
                    <SingleRowItemList
                      key="productCarousels"
                      data={layout.componentContent}
                      productFromCartData={getProductFromCartResultData}
                    />
                  );
                case "cookAdvertisement":
                  return (
                    <SingleAdvertisement
                      key="cookAdvertisement"
                      data={layout.componentContent}
                    />
                  );
                case "sectionAdvertisement":
                  return (
                    <SingleAdvertisement
                      key="sectionAdvertisement"
                      data={layout.componentContent}
                    />
                  );
                case "productGrid":
                  return (
                    <TripleColumnItemList
                      key="productGrid"
                      data={layout.componentContent}
                    />
                  );
                default:
                  return null;
              }
            })}
          </>
        }
      />
    );
  }
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midGrey,
  },
  homeHeaderContainer: {
    height: 88,
    backgroundColor: Colors.white,
  },
});




  // const registerForPushNotificationsAsync = async () => {
  //   if (Constants.isDevice) {
  //     const {
  //       status: existingStatus,
  //     } = await Notifications.getPermissionsAsync();
  //     let finalStatus = existingStatus;

  //     if (existingStatus !== "granted") {
  //       console.log(1)
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       finalStatus = status;
  //     }
  //     if (finalStatus !== "granted") {
  //       console.log(2, finalStatus);
  //       return;
  //     }
  //     const token = (await Notifications.getExpoPushTokenAsync()).data;
  //     console.log("here 123", token);
  //     await AsyncStorage.setItem("notificationToken", JSON.stringify(token));
  //   }

  //   if (Platform.OS === "android") {
  //     Notifications.setNotificationChannelAsync("default", {
  //       name: "default",
  //       importance: Notifications.AndroidImportance.MAX,
  //       vibrationPattern: [0, 250, 250, 250],
  //       lightColor: "#FF231F7C",
  //     });
  //   }
  // };