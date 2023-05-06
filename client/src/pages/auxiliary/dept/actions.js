import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';


/**
 * 获取部门人员下拉数据
 **/
const fetchDeptEmpRequest = () => ({
    type: constant.FETCH_DEPT_EMP_REQUEST
});

const fetchDeptEmpSuccess = (data) => ({
    type: constant.FETCH_DEPT_EMP_SUCCESS,
    data
});

const fetchDeptEmpFailure = (error) => ({
    type: constant.FETCH_DEPT_EMP_FAILURE,
    error
});

//根据部门id获取员工列表
export const getEmployeesByDeptId = (deptId) => ({
    type: constant.GET_EMPLOYEES_BY_DEPT_ID,
    deptId
});

export const getEmployeesByDeptId1 = (deptId,employeeId) => ({
    type: constant.GET_EMPLOYEES_BY_DEPT_ID_TYPE1,
    deptId,
    employeeId
});

//根据员工id获取部门id以及员工列表
export const getDeptAndEmployeesByEmployeeId = (employeeId) => ({
    type: constant.GET_DEPT_AND_EMPLOYEES_BY_EMPLOYEE_ID,
    employeeId
});

//清空数据，防止state从修改页带入到新增页
export const emptyDeptEmployee = () => ({
   type: constant.EMPTY_DEPT_EMPLOYEE
});

export let deptPromise;

export const asyncFetchDeptEmp = (params) => dispatch => {
    dispatch(fetchDeptEmpRequest());
    deptPromise = new Promise((resolve, reject) => {
        axios.get(`${BASE_URL}/auxiliary/dept/list/employee`, {params}).then(function(res) {
            if (res.data) {
                dispatch(fetchDeptEmpSuccess(fromJS(res.data)));
                resolve();
            }
        }).catch(error => {
            dispatch(fetchDeptEmpFailure(error));
            reject();
        });
    });

    return deptPromise;

};

/**
 * 获取部门列表
 **/
const fetchDeptListRequest = () => ({
    type: constant.FETCH_DEPT_LIST_REQUEST
});

const fetchDeptListSuccess = (data) => ({
    type: constant.FETCH_DEPT_LIST_SUCCESS,
    data
});

const fetchDeptListFailure = (error) => ({
    type: constant.FETCH_DEPT_LIST_FAILURE,
    error
});

export const asyncFetchDeptList = (orderByType = 'asc', callback) => dispatch => {
    dispatch(fetchDeptListRequest());
    axios.get(`${BASE_URL}/auxiliary/dept/list`,{
        params: {
            orderByType
        }
    }).then(function(res) {
        if (res.data) {
            dispatch(fetchDeptListSuccess(fromJS(res.data)));
            callback && callback();
        }
    }).catch(error => {
        dispatch(fetchDeptListFailure(error));
    });
};


/**
 * 新增/修改/删除部门提交
 **/
const addDeptRequest = () => ({
    type: constant.ADD_DEPT_REQUEST
});

const addDeptSuccess = (data) => ({
    type: constant.ADD_DEPT_SUCCESS,
    data
});

const addDeptFailure = (error) => ({
    type: constant.ADD_DEPT_FAILURE,
    error
});

export const asyncAddDept = (type, values, callback) => dispatch => {
    dispatch(addDeptRequest());
    let url = `${BASE_URL}/auxiliary/dept/oprate/${type}`;
    axios.post(url, values).then(res => {
        dispatch(addDeptSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addDeptFailure(error));
    })
};

export const asyncCheckName = (params, callback) => dispatch => {
    axios.get(`${BASE_URL}/auxiliary/checkName/`, params).then(res => {
        callback && callback(res);
    }).catch(error => {
        errorCallback && errorCallback(error)
    })
};