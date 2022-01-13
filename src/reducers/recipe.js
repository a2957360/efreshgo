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

const INIT_STATE = {
  recipe: "",
  recipeCategory: "",
  recipeCategoryMessage: "",
  recipeLoading: false,
  getRecipeDetailData: "",
  getRecipeDetailMessage: "",
  recipeNavigationParams: "",
  recipeDetailNavigationParams: "",
  allRecipe: "",
  allRecipeMessage: "",
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_RECIPE_CATEGORY_SUCCESS: {
      return {
        ...state,
        recipeCategory: action.payload.data,
        recipeCategoryMessage: action.payload.message,
      };
    }

    case GET_ALL_RECIPE_SUCCESS: {
      return {
        ...state,
        allRecipe: action.payload.data,
        allRecipeMessage: action.payload.message,
      };
    }

    case GET_RECIPE_CATEGORY_SUCCESS_END: {
      return {
        ...state,

        recipeCategoryMessage: "",
      };
    }

    case GET_RECIPE_SUCCESS: {
      return {
        ...state,
        recipe: action.payload,
      };
    }

    case GET_RECIPE_DETAIL_SUCCESS: {
      return {
        ...state,
        getRecipeDetailData: action.payload.data,
        getRecipeDetailMessage: action.payload.message,
      };
    }

    case GET_RECIPE_DETAIL_SUCCESS_START: {
      return {
        ...state,
        getRecipeDetailData: "",
        getRecipeDetailMessage: "",
      };
    }

    case FETCH_RECIPE_LOADING_START: {
      return {
        ...state,
        recipeLoading: action.payload,
      };
    }

    case FETCH_RECIPE_LOADING_END: {
      return {
        ...state,
        recipeLoading: action.payload,
      };
    }

    case SET_RECIPE_NAVIGATION_PARAMS: {
      return {
        ...state,
        recipeNavigationParams: action.payload,
      };
    }

    case SET_RECIPE_NAVIGATION_PARAMS_END: {
      return {
        ...state,
        recipeNavigationParams: "",
      };
    }

    case SET_RECIPE_DETAIL_NAVIGATION_PARAMS: {
      return {
        ...state,
        recipeDetailNavigationParams: action.payload,
      };
    }

    case SET_RECIPE_DETAIL_NAVIGATION_PARAMS_END: {
      return {
        ...state,
        recipeDetailNavigationParams: "",
      };
    }

    default:
      return state;
  }
};
