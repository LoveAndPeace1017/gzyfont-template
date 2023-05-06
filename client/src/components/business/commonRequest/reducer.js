import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

//获取物品单位列表
const currentAccountInfo = (
    state = fromJS({
        isFetching: false,
        data: {}
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_ACCOUT_INFO:
        return state.set('isFetching', true);
    case constant.FETCH_ACCOUT_INFO_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_ACCOUT_INFO_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

//获取物品单位列表
const onlineMallInfo = (
    state = fromJS({
        data: {}
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_ONLINE_MALL_SUCCESS:
        return state.set('data', action.data);
    default:
        return state
    }
};

//获取列表页初始化筛选数据
const initListCondition = (
    state = fromJS({
        data: {}
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_INIT_LIST_CONDITION_SUCCESS:
            return state.set('data', action.data);
        default:
            return state
    }
};

export default combineReducers({
    currentAccountInfo,
    onlineMallInfo,
    initListCondition,
})