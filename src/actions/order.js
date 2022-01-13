import axios from "axios";
import { serverUrl } from "../config/settings";
import i18n from "i18n-js";

import {
  GET_ORDERS_SUCCESS,
  GET_ORDERS_SUCCESS_START,
  CHANGE_ORDERS_STATE_SUCCESS_START,
  CHANGE_ORDERS_STATE_SUCCESS,
  CHANGE_ORDERS_STATE_SUCCESS_END,
  ADD_REVIEW_SUCCESS_START,
  ADD_REVIEW_SUCCESS,
  GET_STORE_INFO_SUCCESS,
  GET_STORE_INFO_SUCCESS_START,
  GET_DRIVER_INFO_SUCCESS,
  GET_DRIVER_INFO_SUCCESS_START,
  ADD_REVIEW_SUCCESS_END,
} from "../constants/ActionTypes";

export const getOrders = (data) => {
  return (dispatch) => {
    dispatch({ type: GET_ORDERS_SUCCESS_START });
    axios
      .post(`${serverUrl}orderModule.php`, data)
      .then((res) => {
        dispatch({
          type: GET_ORDERS_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const getStoreInfo = (data) => {
  return (dispatch) => {
    dispatch({ type: GET_STORE_INFO_SUCCESS_START });
    axios
      .post(`${serverUrl}storeModule.php`, data)
      .then((res) => {
        dispatch({
          type: GET_STORE_INFO_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const getDriverInfo = (data) => {
  return (dispatch) => {
    dispatch({ type: GET_DRIVER_INFO_SUCCESS_START });
    axios
      .post(`${serverUrl}userModule.php`, data)
      .then((res) => {
        dispatch({
          type: GET_DRIVER_INFO_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const changeOrderState = (data) => {
  return (dispatch) => {
    dispatch({ type: CHANGE_ORDERS_STATE_SUCCESS_START, payload: true });
    console.log("change order state input", data);
    axios
      .post(`${serverUrl}userOrderManage.php`, data)
      .then((res) => {
        console.log("change order state result", res.data);
        dispatch({ type: CHANGE_ORDERS_STATE_SUCCESS_START, payload: false });
        dispatch({
          type: CHANGE_ORDERS_STATE_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};


export const receiveDelivery = (data) => {
  return (dispatch) => {
    dispatch({ type: CHANGE_ORDERS_STATE_SUCCESS_START, payload: true });
    console.log("change order state input", data);
    axios
      .post(`${serverUrl}userOrderManage.php`, data)
      .then((res) => {
        console.log("change order state result", res.data);
        //收获后的弹窗
        if(res.data.message == "success"){
          alert( i18n.t("receiveDeliveryMessage"))  
        }else{
          alert( i18n.t("System Error, please try again later!"))  
        }
        dispatch({ type: CHANGE_ORDERS_STATE_SUCCESS_START, payload: false });
        dispatch({
          type: CHANGE_ORDERS_STATE_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};


export const addReview = (data) => {
  console.log('add revivew input', data)
  return (dispatch) => {
    dispatch({ type: ADD_REVIEW_SUCCESS_START, payload: true });
    axios
      .post(`${serverUrl}userOrderManage.php`, data)
      .then((res) => {
      console.log('add revivew input', res.data)
        dispatch({ type: ADD_REVIEW_SUCCESS_START, payload: false });
        dispatch({
          type: ADD_REVIEW_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const resetChangeOrderState = () => {
  return (dispatch) => {
    dispatch({ type: CHANGE_ORDERS_STATE_SUCCESS_END });
  };
};

export const resetAddReviewResultMessage = () => {
  return (dispatch) => {
    dispatch({ type: ADD_REVIEW_SUCCESS_END });
  };
};
