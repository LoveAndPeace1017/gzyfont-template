import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";


/**
 * 获取cn物品列表
 **/
export const fetchCnGoodsListRequest = () => ({
    type: constant.FETCH_CN_GOODS_LIST_REQUEST
});

export const fetchCnGoodsListSuccess = (data) => ({
    type: constant.FETCH_CN_GOODS_LIST_SUCCESS,
    data
});

export const fetchCnGoodsListFailure = (error) => ({
    type: constant.FETCH_CN_GOODS_LIST_FAILURE,
    error
});


export const asyncFetchCnGoodsList = ({...params}, callback) => dispatch => {

    dispatch(fetchCnGoodsListRequest());
    axios.get(`${BASE_URL}/goods/prod/list`, {
        params: {
            ...params
        }
    }).then(function(res) {
        if (res.data) {
            dispatch(fetchCnGoodsListSuccess(fromJS(res.data)));
            callback && callback(fromJS(res.data.data));
        }
    }).catch(error => {
        dispatch(fetchCnGoodsListFailure(error));
    });

};

/**
 * 手动导入物品
 **/
export const importCnGoodsRequest = () => ({
    type: constant.IMPORT_CN_GOODS_REQUEST
});

export const importCnGoodsSuccess = (data) => ({
    type: constant.IMPORT_CN_GOODS_SUCCESS,
    data
});

export const importCnGoodsFailure = (error) => ({
    type: constant.IMPORT_CN_GOODS_FAILURE,
    error
});


export const asyncImportCnGoods = (prodIds, callback) => dispatch => {

    dispatch(importCnGoodsRequest());
    axios.post(`${BASE_URL}/goods/prod/manual`, {
        prodIds
    }).then(function(res) {
        if (res.data) {
            dispatch(importCnGoodsSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(importCnGoodsFailure(error));
    });

};

export const importCnGoodsPercent=(percent)=>({
    type: constant.IMPORT_CN_GOODS_PERCENT,
    percent
});

export const emptyImportCnGoods=()=>({
   type: constant.EMPTY_IMPORT_CN_GOODS
});










