import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';

//初始化一键重发列表
const repeatProductListInfo = withAsyncReducer(constant.FETCH_REPEAT_PRODUCT);

export default combineReducers({
    repeatProductListInfo
});
