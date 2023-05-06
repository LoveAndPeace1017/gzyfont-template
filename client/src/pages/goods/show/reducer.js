import {fromJS} from "immutable";
import * as constant from './actionsTypes';
import {combineReducers} from "redux-immutable";


const supplierQuotationRecord = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_SUPPLIER_QUOTATION_RECORD_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_SUPPLIER_QUOTATION_RECORD_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_SUPPLIER_QUOTATION_RECORD_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

export default combineReducers({
    supplierQuotationRecord
})