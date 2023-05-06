import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';

const quotationDetail = withAsyncReducer(constant.FETCH_QUOTATION_DETAIL);

export default combineReducers({
    quotationDetail
});
