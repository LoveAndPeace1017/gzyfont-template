import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';

const auxiliaryPriceLimitList = withAsyncReducer(constant.FETCH_PRICE_LIMIT_LIST);

export default combineReducers({
    auxiliaryPriceLimitList
})