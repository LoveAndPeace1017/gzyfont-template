import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

//子账号权限
const subAccountAuth = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_SUB_ACCOUNT_AUTH_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_SUB_ACCOUNT_AUTH_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_SUB_ACCOUNT_AUTH_FAILURE:
        return state.set('isFetching', false);
    case constant.EMPTY_SUB_ACCOUNT_AUTH:
        return state.set('data', '');
    default:
        return state
    }
};


//提交子账号权限
const submitSubAccountAuth = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.SUBMIT_SUB_ACCOUNT_AUTH_REQUEST:
        return state.set('isFetching', true);
    case constant.SUBMIT_SUB_ACCOUNT_AUTH_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.SUBMIT_SUB_ACCOUNT_AUTH_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    subAccountAuth,
    submitSubAccountAuth
})