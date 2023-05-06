import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

//获取物品单位列表
const goodsUnitList = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_GOODS_UNIT_LIST_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_GOODS_UNIT_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_GOODS_UNIT_LIST_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

//新增/修改删除提交物品单位
const addGoodsUnit = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.ADD_GOODS_UNIT_REQUEST:
        return state.set('isFetching', true);
    case constant.ADD_GOODS_UNIT_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.ADD_GOODS_UNIT_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    goodsUnitList,
    addGoodsUnit
})