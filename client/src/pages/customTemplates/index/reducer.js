import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';

const customTemplateList = withAsyncReducer(constant.FETCH_CUSTOMER_TEMPLATES_lIST);

export default combineReducers({
    customTemplateList
})