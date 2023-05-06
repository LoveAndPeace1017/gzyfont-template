import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";


//发送给供应商
const send2supplier = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.SEND_TO_SUPPLIER_REQUEST:
        return state.set('isFetching', true);
    case constant.SEND_TO_SUPPLIER_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.SEND_TO_SUPPLIER_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

//发送给供应商
const sendEmail = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.SEND_EMAIL_REQUEST:
        return state.set('isFetching', true);
    case constant.SEND_EMAIL_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.SEND_EMAIL_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

//获取物流信息
const expressInfo = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.EXPRESS_INFO_REQUEST:
        return state.set('isFetching', true);
    case constant.EXPRESS_INFO_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.EXPRESS_INFO_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};


export default combineReducers({
    send2supplier,
    sendEmail,
    expressInfo
})