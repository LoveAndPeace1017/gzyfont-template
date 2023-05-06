import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';

/**
 * 获取类目列表
 **/
const fetchCateListRequest = () => ({
    type: constant.FETCH_CATE_LIST_REQUEST
});

const fetchCateListSuccess = (data) => ({
    type: constant.FETCH_CATE_LIST_SUCCESS,
    data
});

const fetchCateListFailure = (error) => ({
    type: constant.FETCH_CATE_LIST_FAILURE,
    error
});

export const asyncFetchCateList = (orderByType = 'asc') => dispatch => {
    dispatch(fetchCateListRequest());
    axios.get(`${BASE_URL}/auxiliary/category/list`,{
        params: {
            orderByType
        }
    }).then(function(res) {
        if (res.data) {
            dispatch(fetchCateListSuccess(fromJS(res.data)));
        }
    }).catch(error => {
        dispatch(fetchCateListFailure(error));
    });
};


/**
 * 新增类目提交
 **/
const addCateRequest = () => ({
    type: constant.ADD_CATE_REQUEST
});

const addCateSuccess = (data) => ({
    type: constant.ADD_CATE_SUCCESS,
    data
});

const addCateFailure = (error) => ({
    type: constant.ADD_CATE_FAILURE,
    error
});

export const asyncAddCate = (values, callback) => dispatch => {
    dispatch(addCateRequest());
    let url = `${BASE_URL}/auxiliary/category/add`;
    axios.post(url, values).then(res => {
        dispatch(addCateSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addCateFailure(error));
    })
};

/**
 * 修改类目提交
 **/
const editCateSuccess = (code,name) => ({
    type: constant.EDIT_CATE_SUCCESS,
    code,name
});

export const asyncEditCate = (values, callback) => dispatch => {
    dispatch(addCateRequest());
    let url = `${BASE_URL}/auxiliary/category/edit`;
    axios.post(url, values).then(res => {
        dispatch(addCateSuccess());
        dispatch(editCateSuccess(values.code,values.name));
        callback && callback(res);
    }).catch(error => {
        dispatch(addCateFailure(error));
    })
};

/**
 * 删除类目提交
 **/
const delCateSuccess = (code) => ({
    type: constant.DEL_CATE_SUCCESS,
    code
});


export const asyncDelCate = (code, callback) => dispatch => {
    dispatch(addCateRequest());
    let url = `${BASE_URL}/auxiliary/category/del`;
    axios.post(url, {code:code}).then(res => {
        dispatch(addCateSuccess());
        dispatch(delCateSuccess(code));
        callback && callback(res);
    }).catch(error => {
        dispatch(addCateFailure(error));
    })
};

export const asyncCheckName = (type, name, callback, errorCallback) => dispatch => {
    axios.get(`${BASE_URL}/auxiliary/${type}/checkName`,{
        params: {
            name
        }
    }).then(res => {
        callback && callback(res);
    }).catch(error => {
        errorCallback && errorCallback(error)
    })
};