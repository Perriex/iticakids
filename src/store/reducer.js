import axios from 'axios'
import {Toast} from "../config/ToastConfig/Toast.config";

const initialState = {
    isIran: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_IS_IRAN":
            return {
                ...state,
                isIran: action.value
            };
        default:
            return state;
    }
};

export default reducer;
