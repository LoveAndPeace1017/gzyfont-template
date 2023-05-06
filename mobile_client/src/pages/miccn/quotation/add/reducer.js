import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';

//初始化报价单新增页面数据
const initQuotationDetail = withAsyncReducer(constant.FETCH_INIT_QUOTATION_DETAIL);

//提交报价单
const quotationAddBackInfo = withAsyncReducer(constant.FETCH_ADD_QUOTATION);

//提交报价单
const uploadPicInfo = withAsyncReducer(constant.FETCH_APP_UPLOAD_PIC);

export default combineReducers({
    initQuotationDetail,
    quotationAddBackInfo,
    uploadPicInfo
});
