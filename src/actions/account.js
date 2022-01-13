import axios from "axios";
import { serverUrl } from "../config/settings";

import {
  SET_LANGUAGE_SUCCESS,
  SET_DELIVERY_TIME_SUCCESS,
  SET_DELIVERY_DATE_SUCCESS,
  GET_VERIFICATION_CODE_SUCCESS,
  CHECK_VERIFICATION_CODE_SUCCESS,
  SET_STORE_SUCCESS,
  GET_STORE_SUCCESS,
  SET_CURRENT_LOCATION_SUCCESS,
  FETCH_VERIFICATIONCODE_RESULT_DATA_START,
  FETCH_CHECK_VERIFICATIONCODE_RESULT_DATA_START,
  FETCH_GET_VERIFICATIONCODE_RESULT_DATA_END,
  FETCH_CHECK_VERIFICATIONCODE_RESULT_DATA_END,
  GET_USER_INFO_SUCCESS,
  UPDATE_USER_INFO_SUCCESS,
  UPDATE_USER_INFO_SUCCESS_END,
  SET_DELIVER_ADDRESS,
  CLEAR_USER_INFO,
  SET_STORE_SUCCESS_LOADING,
  THIRDPARTY_LOGIN,
  CLEAR_REDUX_DELIVERY_TIME_DATE,
  SET_LOGIN_LOADING
} from "../constants/ActionTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const setLanguageCode = (data) => {
  return (dispatch) => {
    dispatch({ type: SET_LANGUAGE_SUCCESS, payload: data });
  };
};

export const setCurrentLocation = (data) => {
  return (dispatch) => {
    dispatch({ type: SET_CURRENT_LOCATION_SUCCESS, payload: data });
  };
};

export const setStore = (data) => {
  return (dispatch) => {
    dispatch({ type: SET_STORE_SUCCESS_LOADING, payload: true });
    dispatch({ type: SET_STORE_SUCCESS, payload: data });
    dispatch({ type: SET_STORE_SUCCESS_LOADING, payload: false });
  };
};

export const setDeliveryTime = (data) => {
  return (dispatch) => {
    dispatch({ type: SET_DELIVERY_TIME_SUCCESS, payload: data });
  };
};

export const setDeliveryDate = (data) => {
  return (dispatch) => {
    dispatch({ type: SET_DELIVERY_DATE_SUCCESS, payload: data });
  };
};

export const setDeliverAddress = (data) => {
  return (dispatch) => {
    dispatch({ type: SET_DELIVER_ADDRESS, payload: data });
  };
};

export const setLoginLoading = (data) => {
  return (dispatch) => {
    dispatch({ type: SET_LOGIN_LOADING, payload: data });
  };
};

export const getVerificationCode = (data) => {
  console.log('get verification input',data)
  return (dispatch) => {
    dispatch({ type: FETCH_VERIFICATIONCODE_RESULT_DATA_START });
    axios
      .post(`${serverUrl}getVerificationCode.php`, data)
      .then((res) => {
  console.log('get verification result',res.data)
        dispatch({
          type: GET_VERIFICATION_CODE_SUCCESS,
          payload: res.data.message,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const checkVerificationCode = (data) => {
  console.log('check verification input',data)
  return (dispatch) => {
    dispatch({ type: FETCH_CHECK_VERIFICATIONCODE_RESULT_DATA_START });
    axios
      .post(`${serverUrl}checkVerificationCode.php`, data)
      .then((res) => {
        console.log('check verification result',res.data)

        if (res.data.message == "success") {
          AsyncStorage.setItem(
            "currentUser",
            JSON.stringify(res.data.data.userNumber)
          );
        }

        dispatch({
          type: CHECK_VERIFICATION_CODE_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const getStore = (data) => {
  return (dispatch) => {
    axios
      .post(`${serverUrl}storeModule.php`, data)
      .then((res) => {
        dispatch({
          type: GET_STORE_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const getUserInfomation = (data) => {
  return (dispatch) => {
    axios
      .post(`${serverUrl}userModule.php`, data)
      .then((res) => {
        dispatch({
          type: GET_USER_INFO_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const updateUserInfo = (data) => {
  return (dispatch) => {
    axios
      .post(`${serverUrl}userModule.php`, data)
      .then((res) => {
        dispatch({
          type: UPDATE_USER_INFO_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const resetGetVerificationResult = () => {
  return (dispatch) => {
    dispatch({ type: FETCH_GET_VERIFICATIONCODE_RESULT_DATA_END });
    dispatch({ type: FETCH_CHECK_VERIFICATIONCODE_RESULT_DATA_END });
  };
};

export const clearReduxDeliveryTimeDate = () => {
  return (dispatch) => {
    dispatch({ type: CLEAR_REDUX_DELIVERY_TIME_DATE });
  };
};

export const resetUpdateUserInfoResultMessage = () => {
  return (dispatch) => {
    dispatch({ type: UPDATE_USER_INFO_SUCCESS_END });
  };
};

export const resetUserInfo = () => {
  return (dispatch) => {
    dispatch({ type: CLEAR_USER_INFO });
  };
};

export const thirdPartyLogin = (userData) => {
  return (dispatch) => {
    axios
      .post(`${serverUrl}thirdPartyLoginModule.php`, userData)
      .then((res) => {
        AsyncStorage.setItem(
          "currentUser",
          JSON.stringify(res.data.data.userNumber)
        );
        //cancel loading
        dispatch(setLoginLoading(false))
        dispatch({
          type: THIRDPARTY_LOGIN,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};
