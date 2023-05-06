import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import withBatchUpdateReducer from 'utils/HOR/reduxBatchUpdateConfig';
// 供应商列表
const outboundOrderList = withBatchUpdateReducer(constant.TYPE, (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_OUTBOUND_ORDER_CONFIG_SUCCESS:
        return state.set('config',action.data);
    case constant.OUTBOUND_ORDER_LIST:
        return state.set('isFetching', true);
    case constant.OUTBOUND_ORDER_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.OUTBOUND_ORDER_LIST_FAILURE:
        return state.set('isFetching', false);
    case constant.OUTBOUND_ORDER_CONFIRM_FETCHING_TRUE:
        return state.set('confirmFetching', true);
    case constant.OUTBOUND_ORDER_CONFIRM_FETCHING_FALSE:
        return state.set('confirmFetching', false);
    case constant.FETCH_PROD_ABSTRACT_BY_BILL_NO_REQUEST:
        return state.updateIn(['data', 'list'], list => {
            return list.map(item => {
                if (item.get('billNo') === action.billNo) {
                    return item.set('prodAbstractIsFetching', true)
                }
                return item;
            })
        });
    case constant.FETCH_PROD_ABSTRACT_BY_BILL_NO_SUCCESS:
        return state.updateIn(['data', 'list'], list => {
            return list.map(item => {
                if (item.get('billNo') === action.billNo) {
                    return item.set('prodAbstractIsFetching', false)
                        .set('prodAbstractList', action.data)
                }
                return item;
            })
        });
    case constant.FETCH_PROD_ABSTRACT_BY_BILL_NO_FAILURE:
        return state.updateIn(['data', 'list'], list => {
            return list.map(item => {
                if (item.get('billNo') === action.billNo) {
                    return item.set('prodAbstractIsFetching', false)
                }
                return item;
            })
        });
    case constant.FILTER_CONFIG_LIST:
        return state.setIn(['data', 'filterConfigList'], fromJS(action.data));
    default:
        return state
    }
});

// 获取出库记录
const outboundRecord = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_OUTBOUND_RECORD_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_OUTBOUND_RECORD_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_OUTBOUND_RECORD_FAILURE:
        return state.set('isFetching', false);
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
        case constant.ASYNC_OPERATION_LOGS_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        default:
            return state
    }
};

export default combineReducers({
    outboundOrderList,
    outboundRecord,
    fetchLogInfo
})