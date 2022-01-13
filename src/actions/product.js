import axios from "axios";

import { serverUrl } from "../config/settings";

import {
  GET_PRODUCT_PRIMARY_CATEGORY_LIST_SUCCESS,
  GET_PRODUCT_SECONDARY_CATEGORY_LIST_SUCCESS,
  GET_PRODUCT_DETAIL_SUCCESS,
  GET_PRODUCT_LIST_SUCCESS,
  GET_PRODUCT_LIST_SUCCESS_END,
  ADD_PRODUCT_FAVORITE_SUCCESS,
  GET_SUGGESTED_PRODUCT_SUCCESS,
  SET_SELECTED_SECONDARY_CATEGORY_SUCCESS,
  GET_FAVORITE_PRODUCT_SUCCESS,
  REMOVE_FAVORITE_PRODUCT_SUCCESS,
  ADD_PRODUCT_FAVORITE_SUCCESS_END,
  REMOVE_FAVORITE_PRODUCT_SUCCESS_END,
  GET_PRODUCT_DETAIL_SUCCESS_END,
  GET_PRODUCT_LIST_START,
  GET_PRODUCT_DETAIL_START,
  GET_PRODUCT_SECONDARY_CATEGORY_LIST_SUCCESS_START,
  MODIFY_RED_HEART_FLAG,
} from "../constants/ActionTypes";

export const getProductPrimaryCategoryList = (data) => {
  return (dispatch) => {
    axios
      .post(`${serverUrl}categoryModule.php`, data)
      .then((res) => {
        dispatch({
          type: GET_PRODUCT_PRIMARY_CATEGORY_LIST_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const getProductSecondaryCategoryList = (data) => {
  return (dispatch) => {
    dispatch({
      type: GET_PRODUCT_SECONDARY_CATEGORY_LIST_SUCCESS_START,
      payload: true,
    });
    axios
      .post(`${serverUrl}categoryModule.php`, data)
      .then((res) => {
        dispatch({
          type: GET_PRODUCT_SECONDARY_CATEGORY_LIST_SUCCESS,
          payload: res.data,
        });
        dispatch({
          type: GET_PRODUCT_SECONDARY_CATEGORY_LIST_SUCCESS_START,
          payload: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const getProductDetail = (data) => {
  //console.log("get product detail input", data);
  return (dispatch) => {
    dispatch({ type: GET_PRODUCT_DETAIL_START });
    axios
      .post(`${serverUrl}stockModule.php`, data)
      .then((res) => {
        //console.log("get product detail result", res.data);
        //添加减少商品数量时，重新获取商品详情，让他慢点走
        setTimeout(() => {
          dispatch({
            type: GET_PRODUCT_DETAIL_SUCCESS,
            payload: res.data,
          });
        }, 300);
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const modifyQuantityGetProductDetail = (data) => {
  //console.log("get product detail input", data);
  return (dispatch) => {
    axios
      .post(`${serverUrl}stockModule.php`, data)
      .then((res) => {
        //console.log("get product detail result", res.data);
        //添加减少商品数量时，重新获取商品详情，让他慢点走
        // setTimeout(() => {
        dispatch({
          type: GET_PRODUCT_DETAIL_SUCCESS,
          payload: res.data,
        });
        // }, 300);
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const getProductList = (data) => {
  return (dispatch) => {
    // console.log("get product list input ", data);
    dispatch({ type: GET_PRODUCT_LIST_START });
    axios
      .post(`${serverUrl}stockModule.php`, data)
      .then((res) => {
        // console.log("get product list result", res.data);
        dispatch({
          type: GET_PRODUCT_LIST_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const reGetProductList = (data) => {
  return (dispatch) => {
    // console.log("get product list input ", data);
    axios
      .post(`${serverUrl}stockModule.php`, data)
      .then((res) => {
        // console.log("get product list result", res.data);
        dispatch({
          type: GET_PRODUCT_LIST_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const addFavorite = (data) => {
  //console.log("add product to favorite input", data);
  return (dispatch) => {
    axios
      .post(`${serverUrl}savedItemModule.php`, data)
      .then((res) => {
        //console.log("add product to favorite result", res.data);
        dispatch({ type: MODIFY_RED_HEART_FLAG, payload: true });
        dispatch({
          type: ADD_PRODUCT_FAVORITE_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const getFavoriteProduct = (data) => {
  return (dispatch) => {
    axios
      .post(`${serverUrl}savedItemModule.php`, data)
      .then((res) => {
        dispatch({
          type: GET_FAVORITE_PRODUCT_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const removeFavoriteProduct = (data) => {
  //console.log("remove favorite product", data);
  return (dispatch) => {
    axios
      .post(`${serverUrl}savedItemModule.php`, data)
      .then((res) => {
        // console.log("remove favorite product result", res.data.message);
        dispatch({
          type: MODIFY_RED_HEART_FLAG,
          payload: null,
        });
        dispatch({
          type: REMOVE_FAVORITE_PRODUCT_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const getSuggestedProducts = (data) => {
  return (dispatch) => {
    axios
      .post(`${serverUrl}stockModule.php`, data)
      .then((res) => {
        dispatch({
          type: GET_SUGGESTED_PRODUCT_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const resetGetProductListResultMessage = () => {
  return (dispatch) => {
    dispatch({ type: GET_PRODUCT_LIST_SUCCESS_END });
  };
};

export const setSelectedSecondaryCategory = (data) => {
  return (dispatch) => {
    dispatch({
      type: SET_SELECTED_SECONDARY_CATEGORY_SUCCESS,
      payload: data,
    });
  };
};

export const resetAddFavoriteMessage = () => {
  return (dispatch) => {
    dispatch({ type: ADD_PRODUCT_FAVORITE_SUCCESS_END });
  };
};

export const resetRemoveFavoriteMessage = () => {
  return (dispatch) => {
    dispatch({ type: REMOVE_FAVORITE_PRODUCT_SUCCESS_END });
  };
};

export const resetGetProductDetailResultMessage = () => {
  return (dispatch) => {
    dispatch({ type: GET_PRODUCT_DETAIL_SUCCESS_END });
  };
};
