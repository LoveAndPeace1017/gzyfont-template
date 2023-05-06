import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

// 供应商详情
const inboundOrderShow = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
    case constant.INBOUND_ORDER_SHOW_GET_LIST:
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
    inboundOrderShow,
    fetchLogInfo
})