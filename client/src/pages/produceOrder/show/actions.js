import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";

/**
 * 根据id获取生产单详情
 **/
export const fetchProduceOrderByIdRequest = () => ({
    type: constant.FETCH_PRODUCE_ORDER_BY_ID_REQUEST
});

export const fetchProduceOrderByIdSuccess = (data) => ({
    type: constant.FETCH_PRODUCE_ORDER_BY_ID_SUCCESS,
    data
});

export const fetchProduceOrderByIdFailure = (error) => ({
    type: constant.FETCH_PRODUCE_ORDER_BY_ID_FAILURE,
    error
});

export const asyncFetchProduceOrderById = (id, params, callback) => dispatch => {
    dispatch(fetchProduceOrderByIdRequest());
    axios.get(`${BASE_URL}/produceOrder/detail/${id}`).then(function(res) {
        if (res.data) {
            dispatch(fetchProduceOrderByIdSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchProduceOrderByIdFailure(error));
    });
};

// 生产单详情-领料记录
export const asyncFetchGainMaterialRecord =(id, params)=>({
    actionTypePrefix: constant.ASYNC_FETCH_GAIN_MATERIAL_RECORD,
    request: axios.get(`${BASE_URL}/produceOrder/gain/material/${id}`, params),
});

// 生产单详情-退料记录
export const asyncFetchQuitMaterialRecord =(id, params)=>({
    actionTypePrefix: constant.ASYNC_FETCH_QUIT_MATERIAL_RECORD,
    request: axios.get(`${BASE_URL}/produceOrder/quit/material/${id}`, params),
});

// 生产单详情-成品入库记录
export const asyncFetchProductEnterRecord =(id, params)=>({
    actionTypePrefix: constant.ASYNC_FETCH_PRODUCT_ENTER_RECORD,
    request: axios.get(`${BASE_URL}/produceOrder/product/enter/${id}`, params),
});

// 报工记录列表
export const asyncFetchWorkSheetRecord =(id, params)=>({
    actionTypePrefix: constant.ASYNC_FETCH_WORK_SHEET_RECORD,
    request: axios.get(`${BASE_URL}/produceOrder/worksheet/${id}`, params),
});


// 生产单详情-完成按钮
export const asyncCompleteOperate =(id, callback)=>({
    actionTypePrefix: constant.ASYNC_COMPLETE_OPERATE,
    request: axios.get(`${BASE_URL}/produceOrder/complete/${id}`),
    callback
});

// 生产单详情-撤回按钮
export const asyncRevertOperate =(id, callback)=>({
    actionTypePrefix: constant.ASYNC_REVERT_OPERATE,
    request: axios.get(`${BASE_URL}/produceOrder/repeal/${id}`),
    callback
});



/**
 * 根据单号获取物品概要的总类
 **/
const fetchProdAbstractRequestForGainMaterial = (billNo) => ({
    type: constant.FETCH_PROD_ABSTRACT_FOR_GAIN_MATERIAL_RECORD,
    billNo,
});
const fetchProdAbstractSuccessForGainMaterial = (billNo, data) => ({
    type: constant.FETCH_PROD_ABSTRACT_FOR_GAIN_MATERIAL_SUCCESS,
    billNo,
    data
});
const fetchProdAbstractFailureForGainMaterial = (billNo, error) => ({
    type: constant.FETCH_PROD_ABSTRACT_FOR_GAIN_MATERIAL_FAILURE,
    billNo,
    error
});

export const asyncFetchProdAbstractForGainMaterial = (billNo, callback) => dispatch => {
    dispatch(fetchProdAbstractRequestForGainMaterial(billNo));
    axios.get(`${BASE_URL}/inventory/out/listOut`, {params: {billNo: billNo}}).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(fetchProdAbstractSuccessForGainMaterial(billNo, fromJS(res.data.data)));
            if (callback) {
                callback(res.data);
            }
        } else {
            dispatch(fetchProdAbstractFailureForGainMaterial(billNo, res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchProdAbstractFailureForGainMaterial(error));
    });
};

/**
 * 根据单号获取物品概要的总类
 **/
const fetchProdAbstractRequestForQuitMaterial = (billNo) => ({
    type: constant.FETCH_PROD_ABSTRACT_FOR_QUIT_MATERIAL_RECORD,
    billNo,
});
const fetchProdAbstractSuccessForQuitMaterial = (billNo, data) => ({
    type: constant.FETCH_PROD_ABSTRACT_FOR_QUIT_MATERIAL_SUCCESS,
    billNo,
    data
});
const fetchProdAbstractFailureForQuitMaterial = (billNo, error) => ({
    type: constant.FETCH_PROD_ABSTRACT_FOR_QUIT_MATERIAL_FAILURE,
    billNo,
    error
});

export const asyncFetchProdAbstractForQuitMaterial = (billNo, callback) => dispatch => {
    dispatch(fetchProdAbstractRequestForQuitMaterial(billNo));
    axios.get(`${BASE_URL}/inventory/in/listEnter`, {params: {billNo: billNo}}).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(fetchProdAbstractSuccessForQuitMaterial(billNo, fromJS(res.data.data)));
            if (callback) {
                callback(res.data);
            }
        } else {
            dispatch(fetchProdAbstractFailureForQuitMaterial(billNo, res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchProdAbstractFailureForQuitMaterial(error));
    });
};

/**
 * 根据单号获取物品概要的总类
 **/
const fetchProdAbstractRequestForProductInbound = (billNo) => ({
    type: constant.FETCH_PROD_ABSTRACT_FOR_PRODUCT_INBOUND_RECORD,
    billNo,
});
const fetchProdAbstractSuccessForProductInbound = (billNo, data) => ({
    type: constant.FETCH_PROD_ABSTRACT_FOR_PRODUCT_INBOUND_SUCCESS,
    billNo,
    data
});
const fetchProdAbstractFailureForProductInbound = (billNo, error) => ({
    type: constant.FETCH_PROD_ABSTRACT_FOR_PRODUCT_INBOUND_FAILURE,
    billNo,
    error
});

export const asyncFetchProdAbstractForProductInbound = (billNo, callback) => dispatch => {
    dispatch(fetchProdAbstractRequestForProductInbound(billNo));
    axios.get(`${BASE_URL}/inventory/in/listEnter`, {params: {billNo: billNo}}).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(fetchProdAbstractSuccessForProductInbound(billNo, fromJS(res.data.data)));
            if (callback) {
                callback(res.data);
            }
        } else {
            dispatch(fetchProdAbstractFailureForProductInbound(billNo, res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchProdAbstractFailureForProductInbound(error));
    });
};