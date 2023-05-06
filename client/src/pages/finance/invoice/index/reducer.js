import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import withBatchUpdateReducer from 'utils/HOR/reduxBatchUpdateConfig'

//  收入列表
const invoiceList = withBatchUpdateReducer(constant.TYPE,(
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_INVOICE_CONFIG_SUCCESS:
        return state.set('config',action.data);
    case constant.INVOICE_LIST:
        return state.set('isFetching', true);
    case constant.INVOICE_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.INVOICE_LIST_FAILURE:
        return state.set('isFetching', false);
    case constant.INVOICE_CONFIRM_FETCHING_TRUE:
        return state.set('confirmFetching', true);
    case constant.INVOICE_CONFIRM_FETCHING_FALSE:
        return state.set('confirmFetching', false);
    case constant.FILTER_CONFIG_LIST:
        return state.setIn(['data', 'filterConfigList'], fromJS(action.data));
    default:
        return state
    }
});

const invoiceRecord = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_INVOICE_RECORD_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_INVOICE_RECORD_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_INVOICE_RECORD_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

export default combineReducers({
    invoiceList,
    invoiceRecord
})