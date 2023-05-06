import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';


const getMultiBomListRequest = () => ({
    type: constant.FETCH_MULTI_BOM_LIST_REQUEST
});

const getMultiBomListSuccess = (data) => ({
    type: constant.FETCH_MULTI_BOM_LIST_SUCCESS,
    data
});

const getMultiBomListFailure = (error) => ({
    type: constant.FETCH_MULTI_BOM_LIST_FAILURE,
    error
});



/**
 * 获取多级Bom列表
 * @param params
 * @returns {Function}
 */
export const asyncFetchMultiBomList = (params,callback) => dispatch => {
    dispatch(getMultiBomListRequest());
    if(!params){
        params = {};
    }
    if(typeof params === 'function'){
        callback = params;
        params = {};
    }
    axios.get(`/api/multiBom/list`,{params}).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(getMultiBomListSuccess(fromJS(res.data)));
            if(callback){
                callback(res.data);
            }
        }else{
            dispatch(getMultiBomListFailure(res.data.retMsg));
        }
    }).catch(error => {
        dispatch(getMultiBomListFailure(error));
    });
};

//删除多级Bom信息
export const asyncDeleteMultiBomInfo = (ids, callback) => dispatch => {
    axios.post(`/api/multiBom/delete`,{
        ids:ids
    }).then(function(res) {
        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        console.log(error);
    });
};


const setMultiBomQuantity = (data) => ({
    type: constant.SET_MULTI_BOM_QUANTITY,
    data
});

export const asyncSetMultiBomQuantity = (data) => dispatch => {
    dispatch(setMultiBomQuantity(fromJS(data)));
};


const setMultiBomLevel = (data) => ({
    type: constant.SET_MULTI_BOM_LEVEL,
    data
});

export const asyncSetMultiBomLevel = (data) => dispatch => {
    dispatch(setMultiBomLevel(fromJS(data)));
};

