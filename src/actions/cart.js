import axios from "axios";
import { serverUrl } from "../config/settings";

import {
  GET_PAYMENT_METHOD_SUCCESS,
  ADD_PAYMENT_METHOD_SUCCESS,
  ADD_PRODUCT_TO_CART_SUCCESS,
  ADD_PRODUCT_TO_CART_SUCCESS_END,
  GET_PRODUCT_FROM_CART_SUCCESS,
  GET_PRODUCT_PRICE_CART_SUCCESS,
  MAKE_ORDER_SUCCESS,
  MAKE_ORDER_SUCCESS_END,
  ADD_PAYMENT_METHOD_SUCCESS_END,
  USE_COUPON_SUCCESS,
  USE_COUPON_SUCCESS_END,
  SET_SELECTED_COUPON_INFO,
  MAKE_ORDER_LOADING,
  GET_PRODUCT_FROM_CART_START,
  DELETE_PAYMENT_METHOD_END,
  RESET_DELETE_PAYMENT_METHOD,
  DELETE_PAYMENT_METHOD_START,
  ADD_PRODUCT_TO_CART_SUCCESS_LOADING,
  MAKE_ORDER_PAY_BY_CREDITCARD_SUCCESS,
  RESET_MAKE_ORDER_PAY_BY_CREDITCARD_MESSAGE,
  ADD_PAYMENT_METHOD_SUCCESS_LOADING,
  SET_DELIVER_TYPE,
  GET_PRODUCT_PRICE_CART_START
} from "../constants/ActionTypes";

export const getPaymentMethod = (data) => {
  return (dispatch) => {
    dispatch({ type: DELETE_PAYMENT_METHOD_START, payload: true });
    axios
      .post(`${serverUrl}cardModule.php`, data)
      .then((res) => {
        dispatch({
          type: GET_PAYMENT_METHOD_SUCCESS,
          payload: res.data,
        });
        dispatch({ type: DELETE_PAYMENT_METHOD_START, payload: false });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const addPaymentMethod = (data) => {
  return (dispatch) => {
    dispatch({ type: ADD_PAYMENT_METHOD_SUCCESS_LOADING, payload: true });
    axios
      .post(`${serverUrl}cardModule.php`, data)
      .then((res) => {
        dispatch({ type: ADD_PAYMENT_METHOD_SUCCESS_LOADING, payload: false });
        dispatch({
          type: ADD_PAYMENT_METHOD_SUCCESS,
          payload: res.data,
        });
        const body = {
          isGet: "1",
          userNumber: data.userNumber,
        };
        dispatch(getPaymentMethod(body));
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const deletePaymentMethod = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: DELETE_PAYMENT_METHOD_START, payload: true });
      const res = await axios.post(`${serverUrl}cardModule.php`, data);
      dispatch({ type: DELETE_PAYMENT_METHOD_END, payload: res.data });
      dispatch({ type: DELETE_PAYMENT_METHOD_START, payload: false });
      // if (res.status === 200) {
      //   const body = {
      //     isGet: "1",
      //     userNumber: data.userNumber,
      //   };
      //   dispatch(getPaymentMethod(body));
      // }
    } catch (err) {
      console.log(err);
    }
  };
};

export const addProductToCart = (data) => {
  return (dispatch) => {
    //console.log("adding quantity input", data);
    //dispatch({ type: ADD_PRODUCT_TO_CART_SUCCESS_LOADING, payload: true });
    axios
      .post(`${serverUrl}cartModule.php`, data)
      .then((res) => {
        //dispatch({ type: ADD_PRODUCT_TO_CART_SUCCESS_LOADING, payload: false });
        //console.log("adding quantity result", res.data);
        dispatch({
          type: ADD_PRODUCT_TO_CART_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};
export const getProductFromCart = (data) => {
  //console.log("get product from cart input", data);
  return (dispatch) => {
    dispatch({ type: GET_PRODUCT_FROM_CART_START });
    axios
      .post(`${serverUrl}cartModule.php`, data)
      .then((res) => {
        //console.log("get product from cart result", res.data);
        dispatch({
          type: GET_PRODUCT_FROM_CART_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const reGetProductFromCart = (data) => {
  //  console.log("re get product from cart input", data);
  return (dispatch) => {
    axios
      .post(`${serverUrl}cartModule.php`, data)
      .then((res) => {
        // console.log("re get product from cart result", res.data);
        dispatch({
          type: GET_PRODUCT_FROM_CART_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const recipeDetailGetProductFromCart = (data) => {
  return (dispatch) => {
    axios
      .post(`${serverUrl}cartModule.php`, data)
      .then((res) => {
        dispatch({
          type: GET_PRODUCT_FROM_CART_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const getProductPriceCart = (data) => {
  // console.log("get product price from cart input data", data);
  return (dispatch) => {
    dispatch({type: GET_PRODUCT_PRICE_CART_START})
    axios
      .post(`${serverUrl}orderModule.php`, data)
      .then((res) => {
        // console.log("get product price from cart result", res.data);
        dispatch({
          type: GET_PRODUCT_PRICE_CART_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const makeOrder = (data) => {
  console.log("make order input", data);
  return async (dispatch) => {
    try {
      const res = await axios.post(`${serverUrl}orderModule.php`, data);
      if (res.status === 200) {
        console.log("make orde rresult", res.data);
        if (res.data.data.paymentType == "CreditCard") {
          dispatch(makeOrderPayByCreditCard(res.data.data));
        } else {
          dispatch({ type: MAKE_ORDER_SUCCESS, payload: res.data });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const makeOrderPayByCreditCard = (data) => {
  console.log("make order pay by creditcard input", data);
  return async (dispatch) => {
    try {
      const res = await axios.post(`${serverUrl}creditPayment.php`, data);
      if (res.status === 200) {
        console.log("make order pay by creditcard result", res.data);
        dispatch({
          type: MAKE_ORDER_PAY_BY_CREDITCARD_SUCCESS,
          payload: res.data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const useCoupon = (data) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${serverUrl}orderModule.php`, data);
      if (res.status === 200) {
        dispatch({
          type: USE_COUPON_SUCCESS,
          payload: res.data,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export const setDeliverType = (data) => {
  return (dispatch) => {
    dispatch({ type: SET_DELIVER_TYPE, payload: data });
  };
};

export const setSelectedCouponInfo = (data) => {
  return (dispatch) => {
    dispatch({ type: SET_SELECTED_COUPON_INFO, payload: data });
  };
};

export const resetAddProductToCartResultMessage = () => {
  return (dispatch) => {
    dispatch({ type: ADD_PRODUCT_TO_CART_SUCCESS_END });
  };
};

export const resetMakeOrderResultMessage = () => {
  return (dispatch) => {
    dispatch({ type: MAKE_ORDER_SUCCESS_END });
  };
};

export const resetAddPaymentMethodMessage = () => {
  return (dispatch) => {
    dispatch({ type: ADD_PAYMENT_METHOD_SUCCESS_END });
  };
};

export const resetUseCouponMessage = () => {
  return (dispatch) => {
    dispatch({ type: USE_COUPON_SUCCESS_END });
  };
};

export const setMakeOrderLoading = (data) => {
  return (dispatch) => {
    dispatch({ type: MAKE_ORDER_LOADING, payload: data });
  };
};

export const resetDeletePaymentMethod = () => {
  return (dispatch) => {
    dispatch({ type: RESET_DELETE_PAYMENT_METHOD });
  };
};

export const resetMakeOrderPayByCreditCardResultMessage = () => {
  return (dispatch) => {
    dispatch({ type: RESET_MAKE_ORDER_PAY_BY_CREDITCARD_MESSAGE });
  };
};
