import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

//获取多币种列表
const multiCurrencyList = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_MULTI_CURRENCY_LIST_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_MULTI_CURRENCY_LIST_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_MULTI_CURRENCY_LIST_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

//新增/修改删除提交物品单位
const addMultiCurrency = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.ADD_MULTI_CURRENCY_REQUEST:
            return state.set('isFetching', true);
        case constant.ADD_MULTI_CURRENCY_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.ADD_MULTI_CURRENCY_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

export default combineReducers({
    multiCurrencyList,
    addMultiCurrency
})