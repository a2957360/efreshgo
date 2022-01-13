import {
  GET_RECOMMEND_SEARCH_SUCCESS,
  GET_HISTORY_SEARCH_SUCCESS,
  SEARCH_PRODUCT_BY_TEXT_SUCCESS,
  SEARCH_RECIPE_BY_TEXT_SUCCESS,
} from "../constants/ActionTypes";

const INIT_STATE = {
  getRecommendSearchResultData: "",
  getRecommendSearchResultMessage: "",
  getHistorySearchResultData: "",
  getHistorySearchResultMessage: "",
  searchProductByTextResultData: "",
  searchProductByTextResultMessage: "",
  searchRecipeByTextResultData: "",
  searchRecipeByTextResultMessage: "",
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_RECOMMEND_SEARCH_SUCCESS: {
      return {
        ...state,
        getRecommendSearchResultData: action.payload.data,
        getRecommendSearchResultMessage: action.payload.message,
      };
    }

    case GET_HISTORY_SEARCH_SUCCESS: {
      return {
        ...state,
        getHistorySearchResultData: action.payload.data,
        getHistorySearchResultMessage: action.payload.message,
      };
    }

    case SEARCH_PRODUCT_BY_TEXT_SUCCESS: {
      return {
        ...state,
        searchProductByTextResultData: action.payload.data,
        searchProductByTextResultMessage: action.payload.message,
      };
    }

    case SEARCH_RECIPE_BY_TEXT_SUCCESS: {
      return {
        ...state,
        searchRecipeByTextResultData: action.payload.data,
        searchRecipeByTextResultMessage: action.payload.message,
      };
    }

    default:
      return state;
  }
};
