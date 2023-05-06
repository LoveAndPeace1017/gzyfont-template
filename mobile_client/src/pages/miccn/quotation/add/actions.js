import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";

//初始化报价单新增页面数据
export const asyncFetchInitQuotationDetail=(params, callback)=>({
    actionTypePrefix: constant.FETCH_INIT_QUOTATION_DETAIL,
    request: axios.get(`${BASE_URL}/mobile/miccn/quotation/init`, {params}),
    callback
});

//提交报价单
export const asyncAddQuotation =(inquiryId, params, callback)=>({
    actionTypePrefix: constant.FETCH_ADD_QUOTATION,
    request: axios.post(`${BASE_URL}/mobile/miccn/quotation/add/${inquiryId}`, {...params}),
    callback
});

//上传图片
export const asyncAppUploadPic = (params, callback) => ({
    actionTypePrefix: constant.FETCH_APP_UPLOAD_PIC,
    request: axios.post(`${BASE_URL}/mobile/miccn/quotation/app_temp_attachs`, params),
    callback
});
