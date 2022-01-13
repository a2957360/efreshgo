import { combineReducers } from "redux";
import dataReducer from "./data";
import paymentReducer from "./checkout";
import productReducer from "./product";
import accountReducer from "./account";
import recipeReducer from "./recipe";
import couponReducer from "./coupon";
import contactUsReducer from "./contactUs";
import savedItemReducer from "./savedItem";
import cartReducer from "./cart";
import addressReducer from "./address";
import orderReducer from "./order";
import homeReducer from "./home";
import searchReducer from "./search";
import reCheckOutReducer from "./reCheckOut";

export default combineReducers({
  pageData: dataReducer,
  paymentData: paymentReducer,
  productData: productReducer,
  accountData: accountReducer,
  recipeData: recipeReducer,
  couponData: couponReducer,
  contactUsData: contactUsReducer,
  savedItemData: savedItemReducer,
  cartData: cartReducer,
  addressData: addressReducer,
  orderData: orderReducer,
  homeData: homeReducer,
  searchData: searchReducer,
  reCheckOutData: reCheckOutReducer,
});
