import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";

export const asyncFetchMockLogin=(params, callback)=>({
    actionTypePrefix: constant.FETCH_MOCK_LOGIN,
    request: axios.post(`${BASE_URL}/mobile/miccn/inquiry/login`, params),
    callback
});

//初始化供应商列表数据
export const asyncFetchInquiryList=(params, callback)=>({
    actionTypePrefix: constant.FETCH_INQUIRY_LIST,
    request: axios.get(`${BASE_URL}/mobile/miccn/inquiry/list`, {params}),
    callback
});

//初始化推荐供应商列表数据
export const asyncFetchRecommendInquiryList=(params, callback)=>({
    actionTypePrefix: constant.FETCH_RECOMMEND_INQUIRY_LIST,
    request: axios.get(`${BASE_URL}/mobile/miccn/inquiry/quotation/list`, {params: {tag: 0, orderByField:'inquiryEffectiveTimeOrder', ...params}}),
    callback
});

//初始化我的报价列表数据
export const asyncFetchQuotationList=(params, callback)=>({
    actionTypePrefix: constant.FETCH_QUOTATION_LIST,
    request: axios.get(`${BASE_URL}/mobile/miccn/inquiry/quotation/list`, {params}),
    callback
});
