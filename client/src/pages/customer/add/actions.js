import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';

const insertCustomer = () => ({
    type: constant.CUSTOMER_INSERT,
});
const insertCustomerEnd = () => ({
    type: constant.CUSTOMER_INSERT_END,
});




export const asyncInsertCustomer = (customer,callback) => dispatch => {
    dispatch(insertCustomer());
    axios.post(`/api/customer/insert`,customer).then(function(res) {
        dispatch(insertCustomerEnd());
        callback(res.data);

    }).catch(error => {
        alert(error);
    });
};
export const asyncModifyCustomer = (customer,callback) => dispatch => {
    dispatch(insertCustomer());
    axios.post(`/api/customer/modify`,customer).then(function(res) {
        dispatch(insertCustomerEnd());
        callback(res.data);
    }).catch(error => {
        alert(error);
    });
};

export const asyncInsertMallCustomer = (customer,callback) => dispatch => {
    dispatch(insertCustomer());
    axios.post(`/api/customer/mall/creat`,customer).then(function(res) {
        dispatch(insertCustomerEnd());
        callback(res.data);

    }).catch(error => {
        alert(error);
    });
};

export const asyncBindMallCustomer = (customer,callback) => dispatch => {
    dispatch(insertCustomer());
    axios.post(`/api/customer/mall/bind`,customer).then(function(res) {
        dispatch(insertCustomerEnd());
        callback(res.data);

    }).catch(error => {
        alert(error);
    });
};

const fetchCustomerDetailSuccess = (data) => ({
    type: constant.CUSTOMER_DETAIL,
    data
});


export const asyncShowCustomer = (customerNo,callback) => dispatch => {
    axios.get(`/api/customer/detail/${customerNo}`).then(function(res) {
        if(res.data.retCode==0){
            dispatch(fetchCustomerDetailSuccess(fromJS(res.data)));
            callback&&callback(res.data);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        alert(error);
    });
};

export const asyncShowCustomerForSelect = (customerNo,callback) => dispatch => {
    axios.get(`/api/customer/relevancy/${customerNo}`).then(function(res) {
        if(res.data.retCode==0){
            callback&&callback(res.data);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        alert(error);
    });
};

export const asyncFetchCustomerPre = (callback) => dispatch => {
    axios.get(`/api/customer/pre`).then(function(res) {
        if(res.data.retCode==0){
            callback(res.data);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        alert(error);
    });
};
/**
 * 未绑定的客户
 * @param callback
 * @returns {Function}
 */
export const asyncFetchUnbindCustomerPre = (callback) => dispatch => {
    axios.get(`/api/customer/unbind/list`).then(function(res) {
        if(res.data.retCode==0){
            callback(res.data);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        alert(error);
    });
};

/**
 * 未绑定的客户
 * @param callback
 * @returns {Function}
 */
export const asyncFetchOneCustomerByName = (params,callback) => dispatch => {
    axios.get(`/api/customer/searchOneByName`,{params}).then(function(res) {
        if(res.data.retCode==0){
            callback(res.data);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        alert(error);
    });
};

/**
 * 详情页修改跟进信息
 */
export const asyncFetchFollowStatus = (params,callback) => dispatch => {
    axios.get(`/api/customer/changeFollowStatus`,{params}).then(function(res) {
        if(res.data.retCode==0){
            callback(res.data);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        alert(error);
    });
};

