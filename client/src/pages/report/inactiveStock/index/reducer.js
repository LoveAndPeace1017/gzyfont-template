import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';
import withBatchUpdateReducer from 'utils/HOR/reduxBatchUpdateConfig';

const inactiveStockDetail = withBatchUpdateReducer(constant.TYPE,withAsyncReducer(constant.FETCH_INACTIVE_STOCK, (state, action) => {
        return state;
}));


export default combineReducers({
    inactiveStockDetail
})