import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';
import withBatchUpdateReducer from 'utils/HOR/reduxBatchUpdateConfig';

const saleGrossProfitForecastDetail = withBatchUpdateReducer(constant.TYPE,withAsyncReducer(constant.FETCH_SALE_GROSS_PROFIT_FORECAST, (state, action) => {
        return state;
}));


export default combineReducers({
    saleGrossProfitForecastDetail
})