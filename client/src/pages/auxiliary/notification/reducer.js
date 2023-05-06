import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";


const smsNotifyList = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_SMS_NOTIFY_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_SMS_NOTIFY_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_SMS_NOTIFY_LIST_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

const addSmsNotify = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.ADD_SMS_NOTIFY_REQUEST:
        return state.set('isFetching', true);
    case constant.ADD_SMS_NOTIFY_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.ADD_SMS_NOTIFY_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    smsNotifyList,
    addSmsNotify
})