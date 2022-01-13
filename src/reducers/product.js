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

const INIT_STATE = {
  getProductPrimaryCategoryResultData: "",
  getProductSecondaryCategoryResultData: "",
  getProductDetailResultData: "",
  getProductListResultData: "",
  getProductListResultMessage: "",
  getSuggestedProductResultData: "",
  selectedSecondaryCategoryData: "",
  addProductFavoriteResultMessage: "",
  getFavoriteProductResultData: "",
  getFavoriteProductResultMessage: "",
  removeFavoriteProductResultMessage: "",
  getProductDetailResultMessage: "",
  isGetProductSecondaryCategoryLoading: false,
  savedItemNumber: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PRODUCT_PRIMARY_CATEGORY_LIST_SUCCESS: {
      return {
        ...state,
        getProductPrimaryCategoryResultData: action.payload.data,
        getProductPrimaryCategoryResultMessage: action.payload.message,
      };
    }

    case GET_PRODUCT_SECONDARY_CATEGORY_LIST_SUCCESS: {
      return {
        ...state,
        getProductSecondaryCategoryResultData: action.payload.data,
        getProductSecondaryCategoryResultMessage: action.payload.message,
      };
    }

    case GET_PRODUCT_DETAIL_SUCCESS: {
      return {
        ...state,
        getProductDetailResultData: action.payload.data,
        getProductDetailResultMessage: action.payload.message,
        savedItemNumber: action.payload.data[0]["savedItemNumber"],
      };
    }

    case GET_PRODUCT_DETAIL_START: {
      return {
        ...state,
        getProductDetailResultData: "",
        getProductDetailResultMessage: "",
      };
    }

    case GET_PRODUCT_DETAIL_SUCCESS_END: {
      return {
        ...state,
        getProductDetailResultMessage: "",
      };
    }

    case GET_PRODUCT_LIST_SUCCESS: {
      return {
        ...state,
        getProductListResultData: action.payload.data,
        getProductListResultMessage: action.payload.message,
      };
    }

    case GET_PRODUCT_LIST_START: {
      return {
        ...state,
        getProductListResultData: null,
        getProductListResultMessage: null,
      };
    }

    case GET_PRODUCT_LIST_SUCCESS_END: {
      return {
        ...state,
        getProductListResultMessage: null,
      };
    }

    case ADD_PRODUCT_FAVORITE_SUCCESS: {
      return {
        ...state,
        addProductFavoriteResultMessage: action.payload.message,
      };
    }

    case GET_SUGGESTED_PRODUCT_SUCCESS: {
      return {
        ...state,
        getSuggestedProductResultData: action.payload.data,
        getSuggestedProductResultMessage: action.payload.message,
      };
    }

    case SET_SELECTED_SECONDARY_CATEGORY_SUCCESS: {
      return {
        ...state,
        selectedSecondaryCategoryData: action.payload,
      };
    }

    case GET_FAVORITE_PRODUCT_SUCCESS: {
      return {
        ...state,
        getFavoriteProductResultData: action.payload.data,
        getFavoriteProductResultMessage: action.payload.message,
      };
    }

    case REMOVE_FAVORITE_PRODUCT_SUCCESS: {
      return {
        ...state,
        removeFavoriteProductResultMessage: action.payload.message,
      };
    }

    case ADD_PRODUCT_FAVORITE_SUCCESS_END: {
      return {
        ...state,
        addProductFavoriteResultMessage: null,
      };
    }

    case REMOVE_FAVORITE_PRODUCT_SUCCESS_END: {
      return {
        ...state,
        removeFavoriteProductResultMessage: null,
      };
    }

    case GET_PRODUCT_SECONDARY_CATEGORY_LIST_SUCCESS_START: {
      return {
        ...state,
        isGetProductSecondaryCategoryLoading: action.payload,
      };
    }

    case MODIFY_RED_HEART_FLAG: {
      return {
        ...state,
        savedItemNumber: action.payload,
      };
    }

    default:
      return state;
  }
};
