import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';

/**
 * 获取员工列表
 **/
const fetchEmployeeListRequest = () => ({
    type: constant.FETCH_EMPLOYEE_LIST_REQUEST
});

const fetchEmployeeListSuccess = (data) => ({
    type: constant.FETCH_EMPLOYEE_LIST_SUCCESS,
    data
});

const fetchEmployeeListFailure = (error) => ({
    type: constant.FETCH_EMPLOYEE_LIST_FAILURE,
    error
});

export const asyncFetchEmployeeList = ({orderByType='asc', ...extParams}={}, callback) => dispatch => {
    dispatch(fetchEmployeeListRequest());
    axios.get(`${BASE_URL}/auxiliary/emp/list`,{
        params: {
            orderByType,
            ...extParams
        }
    }).then(function(res) {
        if (res.data) {
            dispatch(fetchEmployeeListSuccess(fromJS(res.data)));
        }
        callback && callback(res.data);
    }).catch(error => {
        dispatch(fetchEmployeeListFailure(error));
    });
};


/**
 * 新增/修改/删除员工提交
 **/
const addEmployeeRequest = () => ({
    type: constant.ADD_EMPLOYEE_REQUEST
});

const addEmployeeSuccess = (data) => ({
    type: constant.ADD_EMPLOYEE_SUCCESS,
    data
});

const addEmployeeFailure = (error) => ({
    type: constant.ADD_EMPLOYEE_FAILURE,
    error
});

export const asyncAddEmployee = (type, values, callback) => dispatch => {
    dispatch(addEmployeeRequest());
    let url = `${BASE_URL}/auxiliary/emp/oprate/${type}`;
    let body = {};
    if(type === 'del'){
        body = {id:values.id}
    }else{
        body = {
            department:values.dept.label,
            employeeName:values.employeeName,
            id:values.id,
            telNo:values.telNo};
    }
    axios.post(url,body).then(res => {
        dispatch(addEmployeeSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addEmployeeFailure(error));
    })
};

/**
 * 隐藏或显示项目
 **/
const visibleEmployeeRequest = () => ({
    type: constant.VISIBLE_EMPLOYEE_REQUEST
});

const visibleEmployeeSuccess = (data) => ({
    type: constant.VISIBLE_EMPLOYEE_SUCCESS,
    data
});

const visibleEmployeeFailure = (error) => ({
    type: constant.VISIBLE_EMPLOYEE_FAILURE,
    error
});

export const asyncVisibleEmployee = (params, callback) => dispatch => {
    dispatch(visibleEmployeeRequest());
    let url = `${BASE_URL}/auxiliary/employee/visible`;
    axios.post(url, params).then(res => {
        dispatch(visibleEmployeeSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(visibleEmployeeFailure(error));
    })
};

