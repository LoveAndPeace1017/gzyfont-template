import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';
import withBatchUpdateReducer from 'utils/HOR/reduxBatchUpdateConfig';

const saleSummaryBySellerDetail = withBatchUpdateReducer(constant.TYPE,withAsyncReducer(constant.FETCH_SALE_SUMMARY_BY_SELLER, (state, action) => {
        return state;
}));


export default combineReducers({
    saleSummaryBySellerDetail
})