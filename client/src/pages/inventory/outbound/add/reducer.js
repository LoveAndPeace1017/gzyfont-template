import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";


//获取页面初始数据
const preData = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_OUTBOUND_PRE_DATA_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_OUTBOUND_PRE_DATA_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_OUTBOUND_PRE_DATA_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

//新增销售单提交
const addSale = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.ADD_SALE_REQUEST:
        return state.set('isFetching', true);
    case constant.ADD_SALE_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.ADD_SALE_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};


//根据出库单id获取出库单信息
const orderInfo = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_DETAIL_BY_OUTBOUND_ID_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_DETAIL_BY_OUTBOUND_ID_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_DETAIL_BY_OUTBOUND_ID_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};


export default combineReducers({
    preData,
    addSale,
    orderInfo
})