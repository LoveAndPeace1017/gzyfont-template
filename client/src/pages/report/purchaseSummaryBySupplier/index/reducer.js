import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';
import withBatchUpdateReducer from 'utils/HOR/reduxBatchUpdateConfig';

const purchaseSummaryBySupplierDetail = withBatchUpdateReducer(constant.TYPE,withAsyncReducer(constant.FETCH_PURCHASE_SUMMARY_BY_SUPPLIER, (state, action) => {
    return state;
}));


export default combineReducers({
    purchaseSummaryBySupplierDetail
})