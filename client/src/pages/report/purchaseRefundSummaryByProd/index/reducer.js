import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';
import withBatchUpdateReducer from 'utils/HOR/reduxBatchUpdateConfig';

const purchaseRefundReportSummaryByProdDetail = withBatchUpdateReducer(constant.TYPE,withAsyncReducer(constant.FETCH_PURCHASE_REFUND_SUMMARY_BY_PROD, (state, action) => {
        return state;
}));


export default combineReducers({
    purchaseRefundReportSummaryByProdDetail
})