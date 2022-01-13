import React, { useState, useEffect } from "react";

import { StyleSheet, Text, TextInput, View } from "react-native";
//redux
import { useDispatch, useSelector } from "react-redux";

//react navigation
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//packages
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n from "i18n-js";
import { Ionicons } from "@expo/vector-icons";

//components
import LoadingScreen from "./components/LoadingScreen";

//screens
import Home from "./screens/home/Home";

import Category from "./screens/category/Category";

import Recipe from "./screens/recipe/Recipe";
import RecipeTwo from "./screens/recipe/RecipeTwo";
import RecipeDetail from "./screens/recipe/ReciptDetail";

import Cart from "./screens/cart/Cart";
import Checkout from "./screens/cart/Checkout";
import CheckOutFromUnpaidOrder from "./screens/cart/components/CheckOutFromUnpaidOrder";

import User from "./screens/user/User";
import Coupon from "./screens/user/Coupon";
import Favorite from "./screens/user/Favorite";
import AddressSetting from "./screens/user/components/AddressSetting";
import AddressSettingDetails from "./screens/user/components/AddressSettingDetails";
import AddressSettingUserAddress from "./screens/user/components/AddressSettingUserAddress";
import AddressSettingDetailsUserAddress from "./screens/user/components/AddressSettingDetailsUserAddress";
import Payment from "./screens/user/Payment";
import Account from "./screens/user/Account";
import Contact from "./screens/user/Contact";
import Balance from "./screens/user/components/Balance";
import RedeemCoupon from "./screens/user/RedeemCoupon";
import SettingList from "./screens/user/components/SettingList";

import ProductList from "./screens/product/ProductList";
import ProductDetail from "./screens/product/ProductDetail";

import OrderDetail from "./screens/orders/OrderDetail";
import ChangePhone from "./screens/user/components/ChangePhone";
import Address from "./screens/user/Address";
import PaymentSetting from "./screens/user/components/PaymentSetting";
import Refund from "./screens/user/Refund";
import Login from "./screens/login/Login";
import Search from "./screens/search/Search";
import HomeHeader from "./screens/home/components/HomeHeader";
import ChooseShop from "./screens/login/ChooseShop";
import Review from "./screens/orders/components/Review";
import Paypal from "./components/Paypal";

//styles
import { Colors } from "./styles";
import { setLanguageCode } from "./actions/account";

//disable text&testinput setting of system
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

//define stack and tabs
const Stack = createStackNavigator();
const BottomTabs = createBottomTabNavigator();

export default function MainApp() {
  const dispatch = useDispatch();
  //const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const clearLocalStorage = async () => {
    await AsyncStorage.clear();
  };

  useEffect(() => {
    async function getAppSetting() {
      await setLoading(true);
      await getLanguage();
      await setLoading(false);
    }

    // clearLocalStorage();
    getAppSetting();
  }, []);

  const getLanguage = async () => {
    //get language code from local storage
    const languageCode = await AsyncStorage.getItem("language");

    if (languageCode !== null) {
      //set language code equal to localstorage value if code exist
      i18n.locale = languageCode;
      if (languageCode.includes("zh")) {
        dispatch(setLanguageCode("Zh"));
      } else {
        dispatch(setLanguageCode("En"));
      }
    } else {
      //set language code equal to localization value if code does not exist
      i18n.locale = Localization.locale;
      await AsyncStorage.setItem("language", Localization.locale);
      if (Localization.locale.includes("zh")) {
        dispatch(setLanguageCode("Zh"));
      } else {
        dispatch(setLanguageCode("En"));
      }
    }

    // When a value is missing from a language it'll fallback to another language with the key present.
    i18n.fallbacks = true;
  };

  const MainStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Auth"
          component={AuthStack}
          options={{
            headerShown: false,
            //title: i18n.t("home"),
          }}
        />

        <Stack.Screen
          name="Home"
          component={MainBottomTabs}
          options={{
            headerShown: false,
            title: i18n.t("home"),
          }}
        />

        <Stack.Screen
          name="CategoryStack"
          component={Category}
          options={{
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
            title: i18n.t("category"),
          }}
        />

        <Stack.Screen
          name="Paypal"
          component={Paypal}
          options={{
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
            title: "",
          }}
        />

        {/* <Stack.Screen
          name="RecipeStackOne"
          component={Recipe}
          options={{
            title: i18n.t("recipe"),
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
          }}
        /> */}

        {/* <Stack.Screen
          name="RecipeTwo"
          component={RecipeTwo}
          options={{
            title: "1",
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
          }}
        /> */}

        <Stack.Screen
          name="ProductList"
          component={ProductList}
          options={{
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
            title: i18n.t("ProductList"),
          }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetail}
          options={{
            title: i18n.t("ProductDetail"),
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
          }}
        />
        <Stack.Screen
          name="RecipeDetail"
          component={RecipeDetail}
          options={{
            title: i18n.t("RecipeDetail"),
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
          }}
        />

        <Stack.Screen
          name="Checkout"
          component={Checkout}
          options={{
            title: i18n.t("Checkout"),
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
          }}
        />

        <Stack.Screen
          name="CheckOutFromUnpaidOrder"
          component={CheckOutFromUnpaidOrder}
          options={{
            title: i18n.t("Checkout"),
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
          }}
        />

        {/* address  */}
        <Stack.Screen
          name="Address"
          component={Address}
          options={{
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
            title: i18n.t("Choose Address"),
          }}
        />

        {/* address setting */}
        <Stack.Screen
          name="AddressSetting"
          component={AddressSetting}
          options={{
            title: i18n.t("Add Address"),
            headerLeft: null,
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
          }}
        />

        {/* address setting details */}
        <Stack.Screen
          name="AddressSettingDetails"
          component={AddressSettingDetails}
          options={{
            title: i18n.t("Address"),
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
          }}
        />

        {/* address setting user */}
        <Stack.Screen
          name="AddressSettingUserAddress"
          component={AddressSettingUserAddress}
          options={{
            title: i18n.t("Address"),
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
          }}
        />

        {/* address setting user detail */}
        <Stack.Screen
          name="AddressSettingDetailsUserAddress"
          component={AddressSettingDetailsUserAddress}
          options={{
            title: i18n.t("Address"),
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
          }}
        />

        <Stack.Screen
          name="ChooseShop"
          component={ChooseShopStack}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="OrderDetail"
          component={OrderDetail}
          options={{
            title: i18n.t("OrderDetail"),
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
          }}
        />

        <Stack.Screen
          name="Refund"
          component={Refund}
          options={{
            title: i18n.t("Refund"),
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
          }}
        />

        {/* ChangePhone */}
        <Stack.Screen
          name="ChangePhone"
          component={ChangePhone}
          options={{
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
            title: "",
          }}
        />

        {/* Balance */}
        <Stack.Screen
          name="Balance"
          component={Balance}
          options={{
            title: i18n.t("MyBalance"),
            //title: "余额",
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
          }}
        />
        {/* coupon */}
        <Stack.Screen
          name="Coupon"
          component={Coupon}
          options={{
            title: i18n.t("MyCoupon"),
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
          }}
        />
        <Stack.Screen
          name="Favorite"
          component={Favorite}
          options={{
            title: i18n.t("MyFavorite"),
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
          }}
        />
        <Stack.Screen
          name="Payment"
          component={Payment}
          options={{
            title: i18n.t("MyPayment"),
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
          }}
        />
        {/* payment setting */}
        <Stack.Screen
          name="PaymentSetting"
          component={PaymentSetting}
          options={{
            title: i18n.t("MyPayment"),
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
          }}
        />
        <Stack.Screen
          name="Account"
          component={Account}
          options={{
            title: i18n.t("MyAccount"),
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
          }}
        />
        <Stack.Screen
          name="Contact"
          component={Contact}
          options={{
            title: i18n.t("Contact"),
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
          }}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="RedeemCoupon"
          component={RedeemCoupon}
          options={{
            title: i18n.t("Coupon"),
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
          }}
        />

        <Stack.Screen
          name="UserStack"
          component={User}
          options={{
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
            title: i18n.t("category"),
          }}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Review"
          component={Review}
          options={{
            title: i18n.t("Review"),
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
          }}
        />
      </Stack.Navigator>
    );
  };

  const MainBottomTabs = () => {
    return (
      <BottomTabs.Navigator
        tabBarOptions={{
          activeTintColor: Colors.primary,
          inactiveTintColor: Colors.secondary,
          style: {
            paddingVertical: 5,
            height: 80,
          },
          tabStyle: {
            height: 50,
          },
          labelStyle: {
            fontSize: 12,
          },
        }}
        headerStyle={null}
      >
        <BottomTabs.Screen
          name="Home"
          component={HomeStack}
          options={{
            title: i18n.t("home"),
            tabBarIcon: ({ color }) => (
              <Feather name="home" color={color} size={25} />
            ),
          }}
        />

        <BottomTabs.Screen
          name="Category"
          component={CategoryStack}
          options={{
            title: i18n.t("category"),
            tabBarIcon: ({ color }) => (
              <Feather name="grid" color={color} size={25} />
            ),
          }}
        />

        <BottomTabs.Screen
          name="Recipe"
          component={RecipeStack}
          options={{
            title: i18n.t("recipe"),
            tabBarIcon: ({ color }) => (
              <Feather name="clipboard" color={color} size={25} />
            ),
          }}
        />

        <BottomTabs.Screen
          name="Cart"
          component={CartStack}
          options={{
            title: i18n.t("cart"),
            tabBarIcon: ({ color }) => (
              <Feather name="shopping-cart" color={color} size={25} />
            ),
          }}
        />

        <BottomTabs.Screen
          name="User"
          component={UserStack}
          options={{
            title: i18n.t("user"),
            tabBarIcon: ({ color }) => (
              <Feather name="user" color={color} size={25} />
            ),
          }}
        />
      </BottomTabs.Navigator>
    );
  };

  const HomeStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    );
  };

  const CategoryStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Category"
          component={Category}
          options={{
            title: i18n.t("category"),
          }}
        />
      </Stack.Navigator>
    );
  };

  const RecipeStack = (props) => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Recipe"
          component={Recipe}
          options={{
            title: i18n.t("recipe"),
          }}
        />
      </Stack.Navigator>
    );
  };

  const CartStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Cart"
          component={Cart}
          options={{
            title: i18n.t("cart"),
          }}
        />
      </Stack.Navigator>
    );
  };

  const UserStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="User"
          component={User}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
  };

  const ChooseShopStack = () => {
    return (
      <Stack.Navigator>
        {/* choose shop */}
        <Stack.Screen
          name="ChooseShop"
          component={ChooseShop}
          options={{
            title: i18n.t("ChooseShop"),
            headerBackTitleVisible: false,
            headerTintColor: Colors.black,
          }}
        />
      </Stack.Navigator>
    );
  };

  const AuthStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
  };

  if (loading === true) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <>{MainStack()}</>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
