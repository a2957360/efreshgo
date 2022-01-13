import {
  SET_PAYMENT_METHOD_SUCCESS,
  SET_CREDIT_CARD_NUMBER,
  SET_CREDIT_CARD_ID_SUCCESS,
  SET_THIRD_PARTY_PAY_ALERT
} from "../constants/ActionTypes";

const INIT_STATE = {
  method: "",
  creditCardId: "",
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_PAYMENT_METHOD_SUCCESS: {
      return {
        ...state,
        method: action.payload,
      };
    }

    case SET_CREDIT_CARD_NUMBER: {
      return {
        ...state,
        creditCardNumber: action.payload,
      };
    }

    case SET_CREDIT_CARD_ID_SUCCESS: {
      return {
        ...state,
        creditCardId: action.payload,
      };
    }

    default:
      return state;
  }
};
