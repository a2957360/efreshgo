import {
  RECHECKOUT_UPDATE_CART,
  RECHECKOUT_MAKE_ORDER,
  RECHECKOUT_MAKE_ORDER_END,
} from "../constants/ActionTypes";

const INIT_STATE = {
  reCheckOutUpdateCartResultData: "",
  reCheckOutUpdateCartResultMessage: "",
  reCheckOutMakeOrderResultData: "",
  reCheckOutMakeOrderResultMessage: "",
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case RECHECKOUT_UPDATE_CART: {
      return {
        ...state,
        reCheckOutUpdateCartResultData: action.payload.data,
        reCheckOutUpdateCartResultMessage: action.payload.message,
      };
    }

    case RECHECKOUT_MAKE_ORDER: {
      return {
        ...state,
        reCheckOutMakeOrderResultData: action.payload.data,
        reCheckOutMakeOrderResultMessage: action.payload.message,
      };
    }

    case RECHECKOUT_MAKE_ORDER_END: {
      return {
        ...state,
        reCheckOutMakeOrderResultData: "",
        reCheckOutMakeOrderResultMessage: "",
      };
    }

    default:
      return state;
  }
};
