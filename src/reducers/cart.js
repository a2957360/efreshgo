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

const INIT_STATE = {
  getPaymentMethodData: "",
  addProductToCartResultData: "",
  addProductToCartResultMessage: "",
  getProductFromCartResultData: "",
  getProductFromCartResultMessage: "",
  getProductPriceCartResultData: "",
  makeOrderResultData: "",
  makeOrderResultMessage: "",
  addPaymentMethodResultMessage: "",
  useCouponSuccessData: "",
  useCouponSuccessMessage: "",
  setSelectedCouponInfoData: "",
  isMakeOrderLoading: false,
  deletePaymentMethodResultMessage: "",
  deletePaymentMethodStart: false,
  isAddProductToCartLoading: false,
  cartTotalPrice: "",
  makeOrderPayByCreditCardResultData: "",
  makeOrderPayByCreditCardResultMessage: "",
  isAddPaymentMethodLoading: false,
  deliverTypeRedux: "Store Delivery",
  getProductPriceCartResultMessage:""
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PAYMENT_METHOD_SUCCESS: {
      return {
        ...state,
        getPaymentMethodData: action.payload,
        //getPaymentMethodDataMessage: action.payload.message,
      };
    }

    case ADD_PAYMENT_METHOD_SUCCESS: {
      return {
        ...state,
        addPaymentMethodResult: action.payload.data,
        addPaymentMethodResultMessage: action.payload.message,
      };
    }

    case ADD_PRODUCT_TO_CART_SUCCESS: {
      return {
        ...state,
        getProductFromCartResultData: action.payload.data,
        addProductToCartResultMessage: action.payload.message,
        cartTotalPrice: action.payload.price,
      };
    }

    case ADD_PRODUCT_TO_CART_SUCCESS_END: {
      return {
        ...state,
        addProductToCartResultMessage: null,
      };
    }

    case GET_PRODUCT_FROM_CART_SUCCESS: {
      return {
        ...state,
        getProductFromCartResultData: action.payload.data,
        getProductFromCartResultMessage: action.payload.message,
        cartTotalPrice: action.payload.price,
      };
    }

    case ADD_PRODUCT_TO_CART_SUCCESS_LOADING: {
      return {
        ...state,
        isAddProductToCartLoading: action.payload,
      };
    }
    case GET_PRODUCT_FROM_CART_START: {
      return {
        ...state,
        getProductFromCartResultData: "",
        getProductFromCartResultMessage: "",
      };
    }

    case GET_PRODUCT_PRICE_CART_SUCCESS: {
      return {
        ...state,
        getProductPriceCartResultData: action.payload.data,
        getProductPriceCartResultMessage: action.payload.message,
      };
    }
    case MAKE_ORDER_SUCCESS: {
      return {
        ...state,
        makeOrderResultData: action.payload.data,
        makeOrderResultMessage: action.payload.message,
      };
    }

    case MAKE_ORDER_PAY_BY_CREDITCARD_SUCCESS: {
      return {
        ...state,
        makeOrderPayByCreditCardResultData: action.payload.data,
        makeOrderPayByCreditCardResultMessage: action.payload.message,
      };
    }

    case MAKE_ORDER_SUCCESS_END: {
      return {
        ...state,
        makeOrderResultMessage: null,
      };
    }

    case ADD_PAYMENT_METHOD_SUCCESS_END: {
      return {
        ...state,
        addPaymentMethodResultMessage: null,
      };
    }

    case DELETE_PAYMENT_METHOD_END: {
      return {
        ...state,
        deletePaymentMethodResultMessage: action.payload.message,
      };
    }

    case RESET_DELETE_PAYMENT_METHOD: {
      return {
        ...state,
        deletePaymentMethodResultMessage: "",
      };
    }

    case USE_COUPON_SUCCESS: {
      return {
        ...state,
        useCouponSuccessData: action.payload.data,
        useCouponSuccessMessage: action.payload.message,
      };
    }

    case USE_COUPON_SUCCESS_END: {
      return {
        ...state,
        useCouponSuccessMessage: null,
      };
    }

    case SET_SELECTED_COUPON_INFO: {
      return {
        ...state,
        setSelectedCouponInfoData: action.payload,
      };
    }

    case MAKE_ORDER_LOADING: {
      return {
        ...state,
        isMakeOrderLoading: action.payload,
      };
    }

    case DELETE_PAYMENT_METHOD_START: {
      return {
        ...state,
        deletePaymentMethodStart: action.payload,
      };
    }

    case RESET_MAKE_ORDER_PAY_BY_CREDITCARD_MESSAGE: {
      return {
        ...state,
        makeOrderPayByCreditCardResultMessage: "",
      };
    }

    case ADD_PAYMENT_METHOD_SUCCESS_LOADING: {
      return {
        ...state,
        isAddPaymentMethodLoading: action.payload,
      };
    }

    case SET_DELIVER_TYPE: {
      return {
        ...state,
        deliverTypeRedux: action.payload,
      };
    }

    case GET_PRODUCT_PRICE_CART_START: {
      return {
        ...state,
        getProductPriceCartResultData: "",
        getProductPriceCartResultMessage: "",
      };
    }

    default:
      return state;
  }
};
