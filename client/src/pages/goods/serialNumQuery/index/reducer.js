import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';

const serialNumQueryDetail = withAsyncReducer(constant.FETCH_SERIAL_NUM_QUERY_LIST);

export default combineReducers({
    serialNumQueryDetail
})