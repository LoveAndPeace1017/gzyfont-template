import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";


//根据收入id获取收入记录信息
const invoiceInfo = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_INVOICE_BY_ID_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_INVOICE_BY_ID_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_INVOICE_BY_ID_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

//新增开票记录提交
const addInvoice = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.ADD_INVOICE_REQUEST:
            return state.set('isFetching', true);
        case constant.ADD_INVOICE_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.ADD_INVOICE_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

export default combineReducers({
    addInvoice,
    invoiceInfo
})