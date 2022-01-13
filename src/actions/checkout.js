import {
  SET_PAYMENT_METHOD_SUCCESS,
  SET_CREDIT_CARD_NUMBER_SUCCESS,
  SET_DELIVERY_TIME_SUCCESS,
  SET_CREDIT_CARD_ID_SUCCESS,
  SET_THIRD_PARTY_PAY_ALERT
} from "../constants/ActionTypes";

export const setPayMethod = (data) => {
  return (dispatch) => {
    dispatch({ type: SET_PAYMENT_METHOD_SUCCESS, payload: data });
  };
};

export const setCreditCardNumber = (data) => {
  return (dispatch) => {
    dispatch({ type: SET_CREDIT_CARD_NUMBER_SUCCESS, payload: data });
  };
};

export const setCreditCardId = (data) => {
  return (dispatch) => {
    dispatch({ type: SET_CREDIT_CARD_ID_SUCCESS, payload: data });
  };
};


