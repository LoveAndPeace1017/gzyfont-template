import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";


/**
 * 获取页面初始数据
 **/
const fetchPreDataRequest = () => ({
    type: constant.FETCH_PRE_DATA_REQUEST
});

const fetchPreDataSuccess = (data) => ({
    type: constant.FETCH_PRE_DATA_SUCCESS,
    data
});

const fetchPreDataFailure = (error) => ({
    type: constant.FETCH_PRE_DATA_FAILURE,
    error
});

export const asyncFetchPreData = (callback) => dispatch => {

    dispatch(fetchPreDataRequest());
    axios.get(`${BASE_URL}/goods/pre/create`).then(function(res) {
        if (res.data) {
            dispatch(fetchPreDataSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchPreDataFailure(error));
    });
};


/**
 * 新增物品提交
 **/
const addGoodsRequest = () => ({
    type: constant.ADD_GOODS_REQUEST
});

const addGoodsSuccess = (data) => ({
    type: constant.ADD_GOODS_SUCCESS,
    data
});

const addGoodsFailure = (error) => ({
    type: constant.ADD_GOODS_FAILURE,
    error
});

export const asyncAddGoods = (code, values, callback) => dispatch => {
    dispatch(addGoodsRequest());
    let url = code?`${BASE_URL}/goods/modify/${code}`:`${BASE_URL}/goods/add`;
    axios.post(url, {
        ...values
    }).then(res => {
        dispatch(addGoodsSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addGoodsFailure(error));
    })
};


export const asyncAddQuotationGoods = (code, values, callback) => dispatch => {
    let url = code?`${BASE_URL}/goods/quotation/modify/${code}`:`${BASE_URL}/goods/quotation/add`;
    axios.post(url, {
        ...values
    }).then(res => {
        callback && callback(res);
    }).catch(error => {
        console.log(error);
    })
};


/**
 * 根据物品id获取物品信息

 **/
export const fetchGoodsByIdRequest = () => ({
    type: constant.FETCH_GOODS_BY_ID_REQUEST
});

export const fetchGoodsByIdSuccess = (data) => ({
    type: constant.FETCH_GOODS_BY_ID_SUCCESS,
    data
});

export const fetchGoodsByIdFailure = (error) => ({
    type: constant.FETCH_GOODS_BY_ID_FAILURE,
    error
});

export const asyncFetchGoodsById = (id, callback) => dispatch => {

    dispatch(fetchGoodsByIdRequest());
    axios.get(`${BASE_URL}/goods/detail/${id}`).then(function(res) {
        if (res.data) {
            dispatch(fetchGoodsByIdSuccess(fromJS(res.data)));
            callback && callback(fromJS(res.data));
        }
    }).catch(error => {
        dispatch(fetchGoodsByIdFailure(error));
    });
};

export const asyncFetchCheckName = (name, callback) => dispatch => {
    axios.get(`${BASE_URL}/goods/check/name`,{params:{name}}).then(function(res) {
        if (res.data) {
            callback && callback(res.data);
        }
    }).catch(error => {
        alert(error)
    });
};


export const uploadPicChange = (pid, file) => ({
    type:constant.UPLOAD_PIC_CHANGE,
    pid,
    file: fromJS(file)
});

export const deletePicChange = (pid) => ({
    type:constant.DELETE_PIC_CHANGE,
    pid
});

export const emptyUploadPicData = () => ({
    type: constant.EMPTY_UPLOAD_PIC_DATA
});



export const asyncFetchUnits = (productCode, callback) => dispatch => {
    axios.get(`${BASE_URL}/goods/units/${productCode}`,{}).then(function(res) {
        if (res.data) {
            callback && callback(res.data);
        }
    }).catch(error => {
        alert(error)
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




