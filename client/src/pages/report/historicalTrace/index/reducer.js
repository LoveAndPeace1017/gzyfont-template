import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';
import withBatchUpdateReducer from 'utils/HOR/reduxBatchUpdateConfig';

const historicalTraceDetail = withBatchUpdateReducer(constant.TYPE,withAsyncReducer(constant.FETCH_HISTORICAL_TRACE, (state, action) => {
        return state;
}));


export default combineReducers({
    historicalTraceDetail
})