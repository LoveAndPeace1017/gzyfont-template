import {combineReducers} from "redux-immutable";
import * as constant from "./actionsTypes";
import {fromJS} from "immutable";

//根据销售单id获取销售单信息
const saleInfo = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_SALE_BY_ID_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_SALE_BY_ID_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_SALE_BY_ID_FAILURE:
            return state.set('isFetching', false);
        // case constant.EMPTY_DETAIL_DATA:
        //     return state.set('data', '');

        default:
            return state
    }
};

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


const incomeRecord = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_INCOME_RECORD_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_INCOME_RECORD_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_INCOME_RECORD_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

const saleInvoiceRecord = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_SALEINVOICE_RECORD_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_SALEINVOICE_RECORD_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_SALEINVOICE_RECORD_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};


const produceRecord = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_PRODUCE_RECORD_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_PRODUCE_RECORD_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_PRODUCE_RECORD_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

export default combineReducers({
    saleInfo,
    outboundRecord,
    incomeRecord,
    saleInvoiceRecord,
    produceRecord
})