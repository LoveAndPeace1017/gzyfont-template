import {fromJS} from "immutable";

import * as constant from './actionsTypes';
import {combineReducers} from "redux-immutable";

const convertToLocalProd = (
    state = fromJS({
        isFetching: false
    }),
    action
) => {
    switch (action.type) {
        case constant.REQUEST_CONVERT_LOCAL_PROD:
            return state.set('isFetching', true);
        case constant.REQUEST_CONVERT_LOCAL_PROD_SUCCESS:
            return state.set('isFetching', false);
                // .set('data', action.data);
        case constant.REQUEST_CONVERT_LOCAL_PROD_FAILED:
            return state.set('isFetching', false);
        default:
            return state
    }
};

export default combineReducers({
    convertToLocalProd
})