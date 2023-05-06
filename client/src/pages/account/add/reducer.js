import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

//改变子账号的输入框输入
const changeSubAccount = (
    state = fromJS({
        userName: '',
        password: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.CHANGE_SUB_ACCOUNT_USER_NAME:
        return state.set('userName', action.value);
    case constant.CHANGE_SUB_ACCOUNT_PASSWORD:
        return state.set('password', action.value);
    case constant.EMPTY_SUB_ACCOUNT_INPUT:
        return state.set('userName', '')
            .set('password', '');
    default:
        return state
    }
};


//提交子账号数据
const addSubAccount = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.ADD_SUB_ACCOUNT_REQUEST:
        return state.set('isFetching', true);
    case constant.ADD_SUB_ACCOUNT_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.ADD_SUB_ACCOUNT_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

//获取子账号数据
const subAccount = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_SUB_ACCOUNT_BY_ID_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_SUB_ACCOUNT_BY_ID_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_SUB_ACCOUNT_BY_ID_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

//重置子账号密码
const resetSubAccountPwd = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.RESET_SUB_ACCOUNT_PWD_REQUEST:
        return state.set('isFetching', true);
    case constant.RESET_SUB_ACCOUNT_PWD_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.RESET_SUB_ACCOUNT_PWD_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    changeSubAccount,
    addSubAccount,
    subAccount,
    resetSubAccountPwd
})