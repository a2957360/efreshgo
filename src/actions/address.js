import axios from "axios";
import { serverUrl } from "../config/settings";

import {
  ADD_ADDRESS_SUCCESS,
  ADD_ADDRESS_SUCCESS_END,
  GET_ADDRESS_SUCCESS,
  DELETE_ADDRESS_SUCCESS,
  DELETE_ADDRESS_SUCCESS_END,
  SET_ADDRESS_DEFAULT_SUCCESS,
  SET_ADDRESS_GEOMETRY_SUCCESS,
  SET_SELECTED_ADDRESS_SUCCESS,
} from "../constants/ActionTypes";

export const addAddress = (data) => {
  console.log("add address input", data);
  return (dispatch) => {
    axios
      .post(`${serverUrl}addressModule.php`, data)
      .then((res) => {
        console.log("add address result", res.data);

        dispatch({
          type: ADD_ADDRESS_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const getAddress = (data) => {
  return (dispatch) => {
    axios
      .post(`${serverUrl}addressModule.php`, data)
      .then((res) => {
        dispatch({
          type: GET_ADDRESS_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const deleteAddress = (data) => {
  return (dispatch) => {
    axios
      .post(`${serverUrl}addressModule.php`, data)
      .then((res) => {
        dispatch({
          type: DELETE_ADDRESS_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const setAddressDefault = (data) => {
  return (dispatch) => {
    axios
      .post(`${serverUrl}addressModule.php`, data)
      .then((res) => {
        dispatch({
          type: SET_ADDRESS_DEFAULT_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const setAddressGeometry = (data) => {
  return (dispatch) => {
    dispatch({ type: SET_ADDRESS_GEOMETRY_SUCCESS, payload: data });
  };
};

export const setSelectedAddress = (data) => {
  return (dispatch) => {
    dispatch({ type: SET_SELECTED_ADDRESS_SUCCESS, payload: data });
  };
};

export const resetAddAddressResultMessage = () => {
  return (dispatch) => {
    dispatch({ type: ADD_ADDRESS_SUCCESS_END });
  };
};

export const resetDeleteAddressResultMessage = () => {
  return (dispatch) => {
    dispatch({ type: DELETE_ADDRESS_SUCCESS_END });
  };
};
