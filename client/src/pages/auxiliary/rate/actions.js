import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';

/**
 * 获取收支列表
 **/
const fetchIncomeListRequest = (incomeType) => ({
    type: constant.FETCH_RATE_LIST_REQUEST,
    incomeType
});

const fetchIncomeListSuccess = (data, incomeType) => ({
    type: constant.FETCH_RATE_LIST_SUCCESS,
    data,
    incomeType
});

const fetchIncomeListFailure = (error, incomeType) => ({
    type: constant.FETCH_RATE_LIST_FAILURE,
    incomeType,
    error
});

/*export const asyncFetchExpressList = (type, callback) => dispatch => {
    dispatch(fetchIncomeListRequest(type));
    axios.get(`${BASE_URL}/auxiliary/${type}/lists`).then(function(res) {
        if (res.data) {
            dispatch(fetchIncomeListSuccess(fromJS(res.data), type));
            callback && callback();
        }
    }).catch(error => {
        dispatch(fetchIncomeListFailure(error, type));
    });
};*/

let hasCache = false;
export const asyncFetchExpressList = (type, callback, addCache) => dispatch => {
    const loadData = ()=>{
        dispatch(fetchIncomeListRequest(type));
        axios.get(`${BASE_URL}/auxiliary/${type}/lists`).then(function(res) {
            if (res.data) {
                dispatch(fetchIncomeListSuccess(fromJS(res.data), type));
                callback && callback(fromJS(res.data));
            }
        }).catch(error => {
            dispatch(fetchIncomeListFailure(error, type));
        });
    };
    if(addCache){
        if (addCache !== hasCache) {
            loadData();
            hasCache = addCache;
        }
    }else{
        loadData();
    }

};

export const emptyRateListCache = () => ()=> {
    hasCache = false;
};

/**
 * 更改税率常用项
 **/
export const asyncEditCommon = (id, callback) => dispatch => {
    axios.get(`${BASE_URL}/auxiliary/rate/editCommon?id=${id}`).then(function(res) {
        console.log(res);
        if (res.data) {
            callback && callback(res);
        }
    }).catch(error => {

    });
}

/**
 * 新增/修改/删除收支提交
 **/
const addIncomeRequest = () => ({
    type: constant.ADD_RATE_REQUEST
});

const addIncomeSuccess = (data) => ({
    type: constant.ADD_RATE_SUCCESS,
    data
});

const addIncomeFailure = (error) => ({
    type: constant.ADD_RATE_FAILURE,
    error
});

export const asyncAddExpress = (operType, values, callback) => dispatch => {
    dispatch(addIncomeRequest());
    let url = `${BASE_URL}/auxiliary/rate/${operType}`;
    axios.post(url,values).then(res => {
        dispatch(addIncomeSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addIncomeFailure(error));
    })
};