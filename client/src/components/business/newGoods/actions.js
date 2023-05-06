import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";


//新增物品条目
export const addGoodsItem = (index, num, goods, defaultMap) => ({
    type:constant.ADD_GOODS_ITEM,
    index,
    num,
    goods,
    defaultMap
});

//删除物品条目
export const removeGoodsItem = (keys) => ({
    type:constant.REMOVE_GOODS_ITEM,
    keys
});

//设置字段为只读
export const setFieldReadonly = (fieldName, key) => ({
    type:constant.SET_FIELD_READONLY,
    fieldName,
    key
});

//取消设置字段为只读
export const unsetFieldReadonly = (fieldName, key) => ({
    type:constant.UNSET_FIELD_READONLY,
    fieldName,
    key
});

//初始化物品条目
export const initGoodsItem = (data) => ({
    type: constant.INIT_GOODS_ITEM,
    data
});

// 初始化物品默认值
export const initGoodsDefaultItem = (data) => ({
    type: constant.INIT_GOODS_DEFAULT_ITEM,
    data
});

/**
 * 扫码录单（根据物品条码获取物品信息）
 **/
export const fetchSaleByBarcodeRequest = () => ({
    type: constant.FETCH_SALE_BY_BARCODE_REQUEST
});

export const fetchSaleByBarcodeSuccess = (data) => ({
    type: constant.FETCH_SALE_BY_BARCODE_SUCCESS,
    data
});

export const fetchSaleByBarcodeFailure = (error) => ({
    type: constant.FETCH_SALE_BY_BARCODE_FAILURE,
    error
});

export const asyncFetchSaleByBarcode = (barCode, callback) => dispatch => {

    dispatch(fetchSaleByBarcodeRequest());
    axios.get(`${BASE_URL}/goods/scan/${barCode}`).then(function(res) {
        if (res.data) {
            dispatch(fetchSaleByBarcodeSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchSaleByBarcodeFailure(error));
    });
};

/**
 * 根据物品code获取物品库存信息
 **/
const fetchStockByCodeRequest = (key) => ({
    type: constant.FETCH_STOCK_BY_CODE_REQUEST,
    key
});
const fetchStockByCodeSuccess = (key, data) => ({
    type: constant.FETCH_STOCK_BY_CODE_SUCCESS,
    key,
    data
});
const fetchStockByCodeFailure = (key, error) => ({
    type: constant.FETCH_STOCK_BY_CODE_FAILURE,
    key,
    error
});
export const asyncFetchStockByCode = (code, key, callback) => dispatch => {
    dispatch(fetchStockByCodeRequest(key));
    axios.get(`${BASE_URL}/goods/search/by/field`,{
        params: {
            field: 'prodNo',
            searchType: 'equal',
            key: code
        }
    }).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(fetchStockByCodeSuccess(key, fromJS(res.data.data)));
            if (callback) {
                callback(res.data);
            }
        } else {
            dispatch(fetchStockByCodeFailure(key, res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchStockByCodeFailure(error));
    });
};


export const emptyDetailData = () => ({
    type: constant.EMPTY_DETAIL_DATA
});













