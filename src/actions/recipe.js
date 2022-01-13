import {
  GET_RECIPE_CATEGORY_SUCCESS,
  GET_RECIPE_SUCCESS,
  FETCH_RECIPE_LOADING_START,
  FETCH_RECIPE_LOADING_END,
  GET_RECIPE_DETAIL_SUCCESS,
  GET_RECIPE_CATEGORY_SUCCESS_END,
  GET_RECIPE_DETAIL_SUCCESS_START,
  SET_RECIPE_NAVIGATION_PARAMS,
  SET_RECIPE_NAVIGATION_PARAMS_END,
  SET_RECIPE_DETAIL_NAVIGATION_PARAMS,
  SET_RECIPE_DETAIL_NAVIGATION_PARAMS_END,
  GET_ALL_RECIPE_SUCCESS,
} from "../constants/ActionTypes";

import axios from "axios";
import { serverUrl } from "../config/settings";

export const getRecipeCategory = (data) => {
  //console.log("get recipe input", data);
  return (dispatch) => {
    axios
      .post(`${serverUrl}categoryModule.php`, data)
      .then((res) => {
        //console.log("get recipecategory data", res.data);
        dispatch({ type: GET_RECIPE_CATEGORY_SUCCESS, payload: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const getAllRecipe = (data) => {
  //console.log("get all recipe input", data);
  return (dispatch) => {
    axios
      .post(`${serverUrl}cookbookModule.php`, data)
      .then((res) => {
        //console.log("get all recipe data", res.data);
        dispatch({ type: GET_ALL_RECIPE_SUCCESS, payload: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const getRecipe = (data) => {
  return (dispatch) => {
    dispatch({ type: FETCH_RECIPE_LOADING_START, payload: true });
    axios
      .post(`${serverUrl}cookbookModule.php`, data)
      .then((res) => {
        setTimeout(() => {
          dispatch({ type: FETCH_RECIPE_LOADING_END, payload: false });
        }, 300);
        dispatch({ type: GET_RECIPE_SUCCESS, payload: res.data.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const getRecipeDetail = (data) => {
  return async (dispatch) => {
    console.log("get recipe input", data);
    try {
      dispatch({ type: GET_RECIPE_DETAIL_SUCCESS_START });
      const res = await axios.post(`${serverUrl}cookbookModule.php`, data);
      if (res.status === 200) {
        // console.log("get recipe detail result", res.data);
        dispatch({ type: GET_RECIPE_DETAIL_SUCCESS_START });
        dispatch({ type: GET_RECIPE_DETAIL_SUCCESS, payload: res.data });
      }
    } catch (err) {
      console.log(err);
    }
  };
};

// export const fetchRecipeLoadingStart = () => {
//   return (dispatch) => {
//     dispatch({ type: FETCH_RECIPE_LOADING_START, payload: true });
//   };
// };

// export const fetchRecipeLoadingEnd = () => {
//   return (dispatch) => {
//     dispatch({ type: FETCH_RECIPE_LOADING_END, payload: false });
//   };
// };

export const setRecipeNavigationParams = (data) => {
  return (dispatch) => {
    dispatch({ type: SET_RECIPE_NAVIGATION_PARAMS, payload: data });
  };
};

export const setRecipeDetailNavigationParams = (data) => {
  return (dispatch) => {
    dispatch({ type: SET_RECIPE_DETAIL_NAVIGATION_PARAMS, payload: data });
  };
};

export const clearRecipeNavigationParams = () => {
  return (dispatch) => {
    dispatch({ type: SET_RECIPE_NAVIGATION_PARAMS_END });
  };
};

export const clearRecipeDetailNavigationParams = () => {
  return (dispatch) => {
    dispatch({ type: SET_RECIPE_DETAIL_NAVIGATION_PARAMS_END });
  };
};

export const resetGetRecipeCategoryResultMessage = () => {
  return (dispatch) => {
    dispatch({ type: GET_RECIPE_CATEGORY_SUCCESS_END });
  };
};
