import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';



/**
 * 获取销售列表数据
 **/
const fetchTraceSaleList = () => ({
    type: constant.TRACE_SALE_LIST
});
const fetchTraceSaleListSuccess = (data) => ({
    type: constant.TRACE_SALE_LIST_SUCCESS,
    data
});
const fetchTraceSaleListFailure = (error) => ({
    type: constant.TRACE_SALE_LIST_FAILURE,
    error
});


const newDomain = '//order.abiz.com/api';


/**
 * 获取销售列表
 * @param params
 * @returns {Function}
 */
export const asyncFetchTraceSaleList = (params,callback) => dispatch => {
    dispatch(fetchTraceSaleList());
    if(!params){
        params = {};
    }
    if(typeof params === 'function'){
        callback = params;
        params = {};
    }
    axios.get(`${newDomain}/orderTrack/sale/list`,{
        params:{
            page: 1,
            // perPage: 3,
            ...params
        }
    }).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(fetchTraceSaleListSuccess(fromJS(res.data)));
            if(callback){
                callback(res.data);
            }
        }else{
            dispatch(fetchTraceSaleListFailure(res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchTraceSaleListFailure(error));
    });
}

export const asyncUpdateConfig = (type, fieldName,propName,index,value) => dispatch => {
    if(index === null){
        dispatch(updateConfigByFieldName({
            type1:type,
            fieldName,
            propName1:propName,
            value1:value
        }));
    }else{
        dispatch(updateConfig({
            type, fieldName,propName,index,value
        }));
    }
};

export const asyncBatchUpdateConfig = (arr, callback)=>asyncBaseBatchUpdateConfig(constant.TYPE, arr, callback);

/**
 * 更新配置项
 */
const updateConfig = (data) => ({
    type: constant.TYPE + '_' + 'COMMON_UPDATE_TEMP_CONFIG',
    data
});

const updateConfigByFieldName = (data) => ({
    type: constant.TRACE_SALE_UPDATE_CONFIG_FIELD_NAME,
    data
});
















