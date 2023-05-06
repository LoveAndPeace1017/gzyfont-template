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
        case constant.FETCH_PRE_DATA_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_PRE_DATA_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_PRE_DATA_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};


//请购单提交
const addRequisitionOrder = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.ADD_REQUISITION_ORDER_REQUEST:
            return state.set('isFetching', true);
        case constant.ADD_REQUISITION_ORDER_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.ADD_REQUISITION_ORDER_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};


//根据请购单id获取请购单信息
const requisitionOrderInfo = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_REQUISITION_ORDER_BY_ID_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_REQUISITION_ORDER_BY_ID_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_REQUISITION_ORDER_BY_ID_FAILURE:
            return state.set('isFetching', false);
        case constant.EMPTY_DETAIL_DATA:
            return state.set('data', '');
        default:
            return state
    }
};


export default combineReducers({
    preData,
    addRequisitionOrder,
    requisitionOrderInfo
})