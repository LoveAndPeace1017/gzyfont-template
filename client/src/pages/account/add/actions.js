import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';
import {actions as auxiliaryDeptActions} from 'pages/auxiliary/dept';

/**
 * 新增/修改子账号数据
 **/

const addSubAccountRequest = () => ({
    type: constant.ADD_SUB_ACCOUNT_REQUEST
});

const addSubAccountSuccess = (data) => ({
    type: constant.ADD_SUB_ACCOUNT_SUCCESS,
    data
});

const addSubAccountFailure = (error) => ({
    type: constant.ADD_SUB_ACCOUNT_FAILURE,
    error
});

//新增子账号
export const asyncAddSubAccount = (values) => dispatch => {
    dispatch(addSubAccountRequest());
    let url = `${BASE_URL}/subAccount/add`;
    return new Promise((resolve, reject) => {
        axios.post(url, {
            logonUserName: values.userName,
            password: values.password,
            employeeId: values.employeeId
        }).then(res => {
            dispatch(addSubAccountSuccess());
            resolve(res);
        }).catch(error => {
            dispatch(addSubAccountFailure());
            reject(error);
        })
    })
};

export const changeSubAccountUserName = (value) => ({
    type: constant.CHANGE_SUB_ACCOUNT_USER_NAME,
    value
});

export const changeSubAccountPassword = (value) => ({
    type: constant.CHANGE_SUB_ACCOUNT_PASSWORD,
    value
});


export const EmptySubAccountInput = () => ({
    type: constant.EMPTY_SUB_ACCOUNT_INPUT
});


//修改子账号
export const asyncEditSubAccount = (values) => dispatch => {
    dispatch(addSubAccountRequest());
    const subUserId = values.userId
    let url = `${BASE_URL}/subAccount/relationEmployee/${subUserId}`;
    return new Promise((resolve, reject) => {
        axios.post(url, {
            employeeId: values.employeeId,
            deptId: values.deptId
        }).then(res => {
            dispatch(addSubAccountSuccess());
            resolve(res);
        }).catch(error => {
            dispatch(addSubAccountFailure());
            reject(error);
        })
    })
};


/**
 * 重置子账号密码
 **/
const resetSubAccountPwdRequest = () => ({
    type: constant.RESET_SUB_ACCOUNT_PWD_REQUEST
});

const resetSubAccountPwdSuccess = (data) => ({
    type: constant.RESET_SUB_ACCOUNT_PWD_SUCCESS,
    data
});

const resetSubAccountPwdFailure = (error) => ({
    type: constant.RESET_SUB_ACCOUNT_PWD_FAILURE,
    error
});

export const asyncResetSubAccountPwd = (values) => dispatch => {
    dispatch(resetSubAccountPwdRequest());
    const subUserId = values.userId;
    let url = `${BASE_URL}/subAccount/resetpwd/${subUserId}`;
    return new Promise((resolve, reject) => {
        axios.post(url, {
            password: values.newPassword
        }).then(res => {
            dispatch(resetSubAccountPwdSuccess());
            resolve(res);
        }).catch(error => {
            dispatch(resetSubAccountPwdFailure());
            reject(error);
        })
    })
};

/**
 * 根据子账号id获取子账号数据
 **/
const fetchSubAccountByIdRequest = () => ({
    type: constant.FETCH_SUB_ACCOUNT_BY_ID_REQUEST
});

const fetchSubAccountByIdSuccess = (data) => ({
    type: constant.FETCH_SUB_ACCOUNT_BY_ID_SUCCESS,
    data
});

const fetchSubAccountByIdFailure = (error) => ({
    type: constant.FETCH_SUB_ACCOUNT_BY_ID_FAILURE,
    error
});

let subAccountPromise;
export const asyncFetchSubAccountById = (subUserId) => dispatch => {
    dispatch(fetchSubAccountByIdRequest());
    subAccountPromise = new Promise((resolve, reject) => {
        axios.get(`${BASE_URL}/subAccount/getSubDetail/${subUserId}`).then(function(res) {
            if (res.data) {
                dispatch(fetchSubAccountByIdSuccess(fromJS(res.data)));
                const employeeId = res.data.data.employeeId;
                resolve(employeeId);
            }
        }).catch(error => {
            dispatch(fetchSubAccountByIdFailure(error));
            reject();
        });
    });

    //回填部门员工数据，必须等待部门下拉列表和回填数据都加载完成才能进行
    const deptPromise = auxiliaryDeptActions.deptPromise;
    Promise.all([deptPromise, subAccountPromise]).then(res => {
        dispatch(auxiliaryDeptActions.getDeptAndEmployeesByEmployeeId(res[1]));
    }).catch(err => {
        console.log(err);
    });

};



