import {fromJS} from "immutable";

import * as constant from './actionsTypes';
import {combineReducers} from "redux-immutable";

//取消销售订单
const cancelOrder = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.CANCEL_ORDER_REQUEST:
            return state.set('isFetching', true);
        case constant.CANCEL_ORDER_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.CANCEL_ORDER_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

const acceptOrder = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.ACCEPT_ORDER_REQUEST:
            return state.set('isFetching', true);
        case constant.ACCEPT_ORDER_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.ACCEPT_ORDER_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

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
    cancelOrder,
    acceptOrder,
    convertToLocalProd
})