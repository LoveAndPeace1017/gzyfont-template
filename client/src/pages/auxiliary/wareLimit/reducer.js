import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';

const auxiliaryWareLimitList = withAsyncReducer(constant.FETCH_WARE_LIMIT_LIST);

export default combineReducers({
    auxiliaryWareLimitList
})