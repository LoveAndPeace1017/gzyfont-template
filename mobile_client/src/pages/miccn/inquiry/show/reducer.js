import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';

const inquiryDetail = withAsyncReducer(constant.FETCH_INQUIRY_DETAIL);

export default combineReducers({
    inquiryDetail
});
