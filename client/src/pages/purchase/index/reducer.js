import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';
import withBatchUpdateReducer from 'utils/HOR/reduxBatchUpdateConfig';

// 物品列表
const purchaseList = withBatchUpdateReducer(constant.TYPE,withAsyncReducer('PURCHASE_LIST', (state, action) => {
    switch (action.type) {
    case constant.FETCH_PURCHASE_CONFIG_SUCCESS:
        return state.set('config', action.data);
    case constant.FETCH_WARE_BY_CODE_REQUEST:
        return state.updateIn(['data', 'list'], list => {
            return list.map(item => {
                if (item.get('code') === action.code) {
                    return item.set('wareIsFetching', true)
                }
                return item;
            })
        });
    case constant.FETCH_WARE_BY_CODE_SUCCESS:
        return state.updateIn(['data', 'list'], list => {
            return list.map(item => {
                if (item.get('code') === action.code) {
                    return item.set('wareIsFetching', false)
                        .set('wareList', action.data)
                }
                return item;
            })
        });
    case constant.FETCH_WARE_BY_CODE_FAILURE:
        return state.updateIn(['data', 'list'], list => {
            return list.map(item => {
                if (item.get('code') === action.code) {
                    return item.set('wareIsFetching', false)
                }
                return item;
            })
        });
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
    case constant.GET_LOCAL_PURCHASE_INFO:
        const list = state.getIn(['data', 'list']);
        let purchase = {};
        list.forEach(item => {
            if (item.get('id') === action.id) {
                purchase = item;
                return
            }
        });
        return state.set('isFetching', false)
            .setIn(['data', 'purchase'], purchase);
    case constant.PURCHASE_CONFIRM_FETCHING_TRUE:
        return state.set('confirmFetching', true);
    case constant.PURCHASE_CONFIRM_FETCHING_FALSE:
        return state.set('confirmFetching', false);
    case constant.FILTER_CONFIG_LIST:
        return state.setIn(['data', 'filterConfigList'], fromJS(action.data));
    default:
        return state
    }
}));

// 获取采购记录
const purchaseRecord = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_PURCHASE_RECORD_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_PURCHASE_RECORD_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_PURCHASE_RECORD_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

// 获取采购批量入库信息
const batchEnterPre = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_PURCHASE_BATCH_ENTER_INFO_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_PURCHASE_BATCH_ENTER_INFO_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_PURCHASE_BATCH_ENTER_INFO_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

// 获取采购付款信息
const batchExpandPre = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_PURCHASE_BATCH_PRE_EXPEND_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_PURCHASE_BATCH_PRE_EXPEND_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_PURCHASE_BATCH_PRE_EXPEND_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

// 获取采购到票信息
const batchInvoicePre = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_PURCHASE_BATCH_PRE_INVOICE_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_PURCHASE_BATCH_PRE_INVOICE_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_PURCHASE_BATCH_PRE_INVOICE_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

export default combineReducers({
    purchaseList,
    purchaseRecord,
    batchEnterPre,
    batchExpandPre,
    batchInvoicePre
})