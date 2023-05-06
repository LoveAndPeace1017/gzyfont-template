import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';

const loginInfo = withAsyncReducer(constant.FETCH_MOCK_LOGIN);

//初始化供应商列表数据
const inquiryListInfo = withAsyncReducer(constant.FETCH_INQUIRY_LIST);

//初始化推荐供应商列表数据
const recommendInquiryListInfo = withAsyncReducer(constant.FETCH_RECOMMEND_INQUIRY_LIST);

//初始化推荐供应商列表数据
const quotationListInfo = withAsyncReducer(constant.FETCH_QUOTATION_LIST);

export default combineReducers({
    loginInfo,
    inquiryListInfo,
    recommendInquiryListInfo,
    quotationListInfo
});
