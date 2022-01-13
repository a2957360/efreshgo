import axios from "axios";

import { serverUrl } from "../config/settings";

import {
  GET_RECOMMEND_SEARCH_SUCCESS,
  GET_HISTORY_SEARCH_SUCCESS,
  SEARCH_PRODUCT_BY_TEXT_SUCCESS,
  SEARCH_RECIPE_BY_TEXT_SUCCESS,
} from "../constants/ActionTypes";

export const getRecommendSearch = (data) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${serverUrl}recommendModule.php`, data);
      if (res.status === 200) {
        dispatch({
          type: GET_RECOMMEND_SEARCH_SUCCESS,
          payload: res.data,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export const getHistorySearch = (data) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${serverUrl}recommendModule.php`, data);
      if (res.status === 200) {
        dispatch({
          type: GET_HISTORY_SEARCH_SUCCESS,
          payload: res.data,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export const searchProductByText = (data) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${serverUrl}stockModule.php`, data);
      if (res.status === 200) {
        dispatch({
          type: SEARCH_PRODUCT_BY_TEXT_SUCCESS,
          payload: res.data,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export const searchRecipeByText = (data) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${serverUrl}cookbookModule.php`, data);
      if (res.status === 200) {
        //console.log("search recipe result", res.data);
        dispatch({
          type: SEARCH_RECIPE_BY_TEXT_SUCCESS,
          payload: res.data,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
};
