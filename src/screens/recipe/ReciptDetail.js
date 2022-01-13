//react
import React, { useState, useEffect } from "react";

//react navigation
import { useNavigation } from "@react-navigation/native";

//react native
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";

//components
import Banner from "../../components/Banner";
import SingleColumnItemListRecipe from "../../components/SingleColumnItemListRecipe";
import Spacing from "../../components/Spacing";
import ReciptInfo from "./components/ReciptInfo";
import ReciptDescription from "./components/ReciptDescription";
import CartPriceBar from "../../components/CartPriceBar";
import LoadingScreen from "../../components/LoadingScreen";

//packages
import { TabView, TabBar } from "react-native-tab-view";
import { Overlay } from "react-native-elements";
import i18n from "i18n-js";

//config
import { homeBanners, reciptList, productList } from "../../config/data";

//style
import { Colors } from "../../styles";
import { screenHeight, screenWidth } from "../../config/settings";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  getRecipeDetail,
  clearRecipeDetailNavigationParams,
} from "../../../src/actions/recipe";
import {
  addProductToCart,
  getProductPriceCart,
  resetAddProductToCartResultMessage,
} from "../../actions/cart";

export default function ReciptDetail(props) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { cookBookNumber } = props;

  const [loadingVisible, setLoadingVisible] = useState(false);

  //language code from api
  const languageCode = useSelector((state) => state.accountData.language);

  //user number
  const userNumber = useSelector(
    (state) => state.accountData.userInfo.userNumber
  );

  const distance = useSelector(
    (state) => state.accountData.deliveryStore.distance
  );

  //recipe detail
  const getRecipeDetailData = useSelector(
    (state) => state.recipeData.getRecipeDetailData
  );

  //cart data
  const cartTotalPrice = useSelector((state) => state.cartData.cartTotalPrice);

  const isAddProductToCartLoading = useSelector(
    (state) => state.cartData.isAddProductToCartLoading
  );

  const getRecipeDetailMessage = useSelector(
    (state) => state.recipeData.getRecipeDetailMessage
  );

  const addProductToCartResultMessage = useSelector(
    (state) => state.cartData.addProductToCartResultMessage
  );

  const recipeDetailNavigationParams = useSelector(
    (state) => state.recipeData.recipeDetailNavigationParams
  );

  useEffect(() => {
    //从外面进来
    if (recipeDetailNavigationParams || recipeDetailNavigationParams != "") {
      const data = {
        isGet: "1",
        cookbookNumber: recipeDetailNavigationParams,
        offset: "0",
        language: languageCode,
        userNumber: userNumber,
      };
      dispatch(getRecipeDetail(data));
    }
    //从正常recipeCategory进来
    else {
      const data = {
        isGet: "1",
        cookbookNumber: props.route.params.cookBookNumber,
        offset: "0",
        language: languageCode,
        userNumber: userNumber,
      };
      dispatch(getRecipeDetail(data));
    }
  }, []);

  useEffect(() => {
    if (getRecipeDetailMessage == "success") {
      dispatch(clearRecipeDetailNavigationParams());
    }
  }, [getRecipeDetailMessage]);

  useEffect(() => {
    if (addProductToCartResultMessage == "success") {
      const data = {
        isGetPrice: "1",
        userNumber: userNumber,
        language: languageCode,
      };
      dispatch(getProductPriceCart(data));
      dispatch(resetAddProductToCartResultMessage());
    }
  }, [addProductToCartResultMessage]);

  const handleAddAll = () => {
    if (getRecipeDetailData) {
      const itemNumberList = getRecipeDetailData[0].itemList.map(
        (element) => element.itemNumber
      );

      const itemQuantityList = getRecipeDetailData[0].itemList.map(
        (element) => element.itemQuantity + 1
      );

      const data = {
        userNumber: userNumber,
        itemNumber: itemNumberList,
        itemQuantity: itemQuantityList,
      };
      dispatch(addProductToCart(data));
    }
  };

  const renderLayout = () => {
    return (
      <View style={styles.container}>
        <>
          <View style={styles.swiperContainer}>
            <Banner data={getRecipeDetailData[0].cookbookImages} />
          </View>

          <ReciptInfo
            title={getRecipeDetailData[0].cookbookTitle}
            subTitle={getRecipeDetailData[0].cookbookSubTitle}
          />

          <Spacing height="medium" />

          <ReciptDescription
            description={getRecipeDetailData[0].cookbookDescription}
          />

          <Spacing height="medium" />

          <View style={styles.recommandContainer}>
            <Text style={styles.recommandTitle}>
              {i18n.t("Related Recipe")}
            </Text>

            <TouchableOpacity activeOpacity={1} onPress={() => handleAddAll()}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>{i18n.t("Add All")}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <SingleColumnItemListRecipe data={getRecipeDetailData[0].itemList} />

          <Spacing height="medium" />
        </>
      </View>
    );
  };

  if (!getRecipeDetailData) {
    return <LoadingScreen />;
  } else {
    return (
      <View style={styles.container}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          style={styles.layoutContainer}
          showsVerticalScrollIndicator={false}
          data={null}
          ListEmptyComponent={renderLayout}
        />

        <View style={styles.priceBarContainer}>
          <CartPriceBar
            data={{
              buttonText: "GoCheckout",
              // number: getProductPriceCartResultData.totalQuantity,
              navigationPage: "Checkout",
              price: cartTotalPrice ? cartTotalPrice : "0",
              //isEmpty: !getProductPriceCartResultData.itemList ? true : false,
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  layoutContainer: {
    flex: 0.9,
  },
  priceBarContainer: {
    flex: 0.1,
  },
  swiperContainer: {
    height: screenHeight * 0.3,
  },
  recommandContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderBottomColor: Colors.midGrey,
    borderBottomWidth: 1,
  },
  recommandTitle: {
    fontSize: 20,
    padding: 15,
  },
  button: {
    borderRadius: 20,
    height: 30,
    marginRight: 20,
    paddingVertical: 3,
    paddingHorizontal: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
  },
  buttonText: {
    color: Colors.white,
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 16,
    textAlign: "center",
  },
});
