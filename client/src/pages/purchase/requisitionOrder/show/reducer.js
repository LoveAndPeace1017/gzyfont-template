import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

//请购单详情
const requisitionOrderDetail = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
    case constant.REQUISITION_ORDER_SHOW_GET_LIST:
        return state.set('data', action.data);
    default:
        return state
    }
};


//获取操作日志
const fetchLogInfo = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.ASYNC_OPERATION_LOG_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        default:
            return state
    }
};

export default combineReducers({
    requisitionOrderDetail,
    fetchLogInfo
})