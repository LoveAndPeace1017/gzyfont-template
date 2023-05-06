import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';


const getMrpCountListRequest = () => ({
    type: constant.FETCH_MRP_COUNT_LIST_REQUEST
});

const getMrpCountListSuccess = (data) => ({
    type: constant.FETCH_MRP_COUNT_LIST_SUCCESS,
    data
});

const getMrpCountListFailure = (error) => ({
    type: constant.FETCH_MRP_COUNT_LIST_FAILURE,
    error
});



/**
 * 获取Mrp列表
 * @param params
 * @returns {Function}
 */
export const asyncFetchMrpCountList = (params,callback) => dispatch => {
    dispatch(getMrpCountListRequest());
    if(!params){
        params = {};
    }
    if(typeof params === 'function'){
        callback = params;
        params = {};
    }
    axios.get(`/api/productControl/mrp/list`,{params}).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(getMrpCountListSuccess(fromJS(res.data)));
            if(callback){
                callback(res.data);
            }
        }else{
            dispatch(getMrpCountListFailure(res.data.retMsg));
        }
    }).catch(error => {
        dispatch(getMrpCountListFailure(error));
    });
};

//删除Mrp列表信息
export const asyncDeleteMrpCountInfo = (ids, callback) => dispatch => {
    axios.post(`/api/productControl/mrp/delete`,{
        ids:ids
    }).then(function(res) {
        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        console.log(error);
    });
};





