import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';
import withBatchUpdateReducer from 'utils/HOR/reduxBatchUpdateConfig';

const wareOutSummaryByEmployeeDetail = withBatchUpdateReducer(constant.TYPE,withAsyncReducer(constant.FETCH_COLLECTION_DELIVERY, (state, action) => {
        return state;
}));


export default combineReducers({
    wareOutSummaryByEmployeeDetail
})