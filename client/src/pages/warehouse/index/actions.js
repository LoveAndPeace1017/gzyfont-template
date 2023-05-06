import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";

const setConfirmFetchingTrue = (data) => ({
    type: constant.WAREHOUSE_CONFIRM_FETCHING_TRUE,
    data
});
const setConfirmFetchingFalse = (error) => ({
    type: constant.WAREHOUSE_CONFIRM_FETCHING_FALSE,
    error
});

/**
 * 获取仓库列表数据
 **/
const fetchWarehouseList = () => ({
    type: constant.WAREHOUSE_LIST
});
const fetchWarehouseListSuccess = (data) => ({
    type: constant.WAREHOUSE_LIST_SUCCESS,
    data
});
const fetchWarehouseListFailure = (error) => ({
    type: constant.WAREHOUSE_LIST_FAILURE,
    error
});

/**
 * 设置默认仓库
 **/

const setDefaultWarehouseSuccess = (id) => ({
    type: constant.DEFAULT_WAREHOUSE_SUCCESS,
    id
});
const setDefaultWarehouseFailure = (error) => ({
    type: constant.DEFAULT_WAREHOUSE_FAILURE,
    error
});

const fetchLocalWarehouseInfo = (id) => ({
    type: constant.GET_LOCAL_WAREHOUSE_INFO,
    id
});


export const asyncFetchWarehouseList = (callback) => dispatch => {
    dispatch(fetchWarehouseList());
    axios.get(`/api/warehouse/list`).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(fetchWarehouseListSuccess(fromJS(res.data)))
            callback && callback();
        }else{
            dispatch(fetchWarehouseListFailure(res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchWarehouseListFailure(error));
    });
};

/**
 * 设置默认仓库
 **/
export const asyncSetDefaultWarehouse = (id) => dispatch => {
    axios.post(`/api/warehouse/default`,{
        id:id
    }).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(setDefaultWarehouseSuccess(id))
        }else{
            dispatch(setDefaultWarehouseFailure(res.data.retMsg));
        }
    }).catch(error => {
        dispatch(setDefaultWarehouseFailure(error));
    });
};

export const getLocalWarehouseInfo = (id) => dispatch => {
    dispatch(fetchLocalWarehouseInfo(id))
};

/**
 * 修改仓库信息
 * @param warehouse
 * @param callback
 * @returns {Function}
 */
export const asyncModifyWarehouseInfo = (warehouse,callback) => dispatch => {
    dispatch(setConfirmFetchingTrue());
    axios.put(`/api/warehouse/modify`,warehouse).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(setConfirmFetchingFalse(fromJS(warehouse)))
        }else{
            dispatch(setConfirmFetchingFalse(res.data.retMsg));
        }
        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        dispatch(setConfirmFetchingFalse(error));
    });
};

/**
 * 新增仓库信息
 * @param warehouse
 * @param callback
 * @returns {Function}
 */
export const asyncInsertWarehouseInfo = (warehouse, callback) => dispatch => {
    dispatch(setConfirmFetchingTrue());
    axios.post(`/api/warehouse/insert`,warehouse).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(setConfirmFetchingFalse(fromJS(res.data)))
        }else{
            dispatch(setConfirmFetchingFalse(res.data.retMsg));
        }
        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        dispatch(setConfirmFetchingFalse(error));
    });
};

export const asyncDeleteWarehouseInfo = (id, callback) => dispatch => {
    axios.delete(`/api/warehouse/delete/${id}`).then(function(res) {
        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};


