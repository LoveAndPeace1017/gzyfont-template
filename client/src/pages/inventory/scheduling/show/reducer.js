import {fromJS} from "immutable";

import * as constant from './actionsTypes';
import {combineReducers} from "redux-immutable";

//取消销售订单
const cancelScheduling = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.CANCEL_SCHEDULING_REQUEST:
            return state.set('isFetching', true);
        case constant.CANCEL_SCHEDULING_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.CANCEL_SCHEDULING_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

const acceptScheduling = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.ACCEPT_SCHEDULING_REQUEST:
            return state.set('isFetching', true);
        case constant.ACCEPT_SCHEDULING_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.ACCEPT_SCHEDULING_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

export default combineReducers({
    cancelScheduling,
    acceptScheduling
})