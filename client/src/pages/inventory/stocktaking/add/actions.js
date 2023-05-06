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
    axios.get(`${BASE_URL}/inventory/stocktaking/pre/create`).then(function(res) {
        if (res.data) {
            dispatch(fetchPreDataSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchPreDataFailure(error));
    });
};


/**
 * 新增销售单提交
 **/
const addStocktakingRequest = () => ({
    type: constant.ADD_STOCKTAKING_REQUEST
});

const addStocktakingSuccess = (data) => ({
    type: constant.ADD_STOCKTAKING_SUCCESS,
    data
});

const addStocktakingFailure = (error) => ({
    type: constant.ADD_STOCKTAKING_FAILURE,
    error
});

export const asyncAddStocktaking = (id, values, callback) => dispatch => {
    dispatch(addStocktakingRequest());
    let url = `${BASE_URL}/inventory/stocktaking/add`;
    if(id){
        url = `${BASE_URL}/inventory/stocktaking/modify`;
    }
    axios.post(url, {
        ...values
    }).then(res => {
        dispatch(addStocktakingSuccess());
        callback && callback(res.data);
    }).catch(error => {
        dispatch(addStocktakingFailure(error));
    })
};

/**
 * 根据销售单id获取销售单信息
 **/
export const fetchStocktakingByIdRequest = () => ({
    type: constant.FETCH_STOCKTAKING_BY_ID_REQUEST
});

export const fetchStocktakingByIdSuccess = (data) => ({
    type: constant.FETCH_STOCKTAKING_BY_ID_SUCCESS,
    data
});

export const fetchStocktakingByIdFailure = (error) => ({
    type: constant.FETCH_STOCKTAKING_BY_ID_FAILURE,
    error
});

export const asyncFetchStocktakingById = (id, callback) => dispatch => {

    dispatch(fetchStocktakingByIdRequest());
    axios.get(`${BASE_URL}/inventory/stocktaking/detail/${id}`).then(function(res) {
        if (res.data) {
            if(res.data.retCode==0){
                let prodList =  res.data.data.prodList||[];
                prodList.forEach((item)=>{
                    let offset = (item.actualNum || 0) - item.systemNum;
                   item.offsetQuantity = offset;
                   item.result = offset>0?"盘盈":offset==0?"正常":"盘亏";
                });
                res.data.data.prodList = prodList;
            }
            dispatch(fetchStocktakingByIdSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchStocktakingByIdFailure(error));
    });
};


export const emptyDetailData = () => ({
    type: constant.EMPTY_DETAIL_DATA
});


export const cancelStocktaking = () => ({
    type: constant.CANCEL_STOCKTAKING_REQUEST
});

const cancelStocktakingSuccess = (data) => ({
    type: constant.CANCEL_STOCKTAKING_SUCCESS,
    data
});
const cancelStocktakingFailure = (error) => ({
    type: constant.CANCEL_STOCKTAKING_FAILURE,
    error
});

export const asyncCancelStocktaking = (id, params, callback) => dispatch => {
    dispatch(cancelStocktaking());
    if(!params){
        params = {};
    }
    if(typeof params === 'function'){
        callback = params;
        params = {};
    }
    let url = id?`${BASE_URL}/inventory/stocktaking/finish/${id}`
        :`${BASE_URL}/inventory/stocktaking/finish/withoutId`
    axios.post(url,params).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(cancelStocktakingSuccess(fromJS(res.data)));
        } else{
            dispatch(cancelStocktakingFailure(res.data.retMsg));
        }
        callback && callback(res.data);
    }).catch(error => {
        dispatch(cancelStocktakingFailure(error));
    });
};

const modifyStockProdData = (data) => ({
    type: constant.MODIFY_STOCKTAKING_PROD_DATA,
    data
});

export const asyncFetchStockProdData = (params, callback) => dispatch => {
    let url = `${BASE_URL}/inventory/stocktaking/prod`;
    axios.post(url,params).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(modifyStockProdData(res.data.data));
        }
        callback && callback(res.data);
    })
};









