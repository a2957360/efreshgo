import {
  GET_SAVED_ITEM_SUCCESS,
  GET_SAVED_ITEM_SUCCESS_END,
} from "../constants/ActionTypes";

const INIT_STATE = {
  getSavedItemResultData: "",
  getSavedItemResultMessage: "",
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SAVED_ITEM_SUCCESS: {
      return {
        ...state,
        getSavedItemResultData: action.payload.data,
        getSavedItemResultMessage: action.payload.message,
      };
    }
    case GET_SAVED_ITEM_SUCCESS_END: {
      return {
        ...state,
        getSavedItemResultMessage: null,
      };
    }

    default:
      return state;
  }
};
