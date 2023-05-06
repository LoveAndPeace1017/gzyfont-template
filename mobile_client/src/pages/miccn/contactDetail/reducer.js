import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';

//初始化推荐供应商列表数据
const contactInfor = withAsyncReducer(constant.FETCH_CONTACT_DETAIL_INFOR);

export default combineReducers({
    contactInfor
});
