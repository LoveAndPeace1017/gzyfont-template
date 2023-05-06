import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';
import withBatchUpdateReducer from 'utils/HOR/reduxBatchUpdateConfig';

const saleRefundReportSummaryByProdDetail = withBatchUpdateReducer(constant.TYPE,withAsyncReducer(constant.FETCH_SALE_REFUND_SUMMARY_BY_PROD, (state, action) => {
        return state;
}));


export default combineReducers({
    saleRefundReportSummaryByProdDetail
})