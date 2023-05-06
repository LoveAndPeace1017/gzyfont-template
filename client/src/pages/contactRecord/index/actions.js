import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";

const setConfirmFetchingTrue = (data) => ({
    type: constant.CONTACT_RECORD_CONFIRM_FETCHING_TRUE,
    data
});
const setConfirmFetchingFalse = (error) => ({
    type: constant.CONTACT_RECORD_CONFIRM_FETCHING_FALSE,
    error
});

/**
 * 获取联系记录列表数据
 **/
const fetchContactRecordList = () => ({
    type: constant.CONTACT_RECORD_LIST
});
const fetchContactRecordListSuccess = (data) => ({
    type: constant.CONTACT_RECORD_LIST_SUCCESS,
    data
});
const fetchContactRecordListFailure = (error) => ({
    type: constant.CONTACT_RECORD_LIST_FAILURE,
    error
});

const fetchLocalContactRecordInfo = (id) => ({
    type: constant.GET_LOCAL_CONTACT_RECORD_INFO,
    id
});

/**
 * 获取客户联系记录列表
 * @param params
 * @returns {Function}
 */
export const asyncFetchContactRecordList = (params) => dispatch => {
    dispatch(fetchContactRecordList());
    axios.get(`/api/customer/contactRecord/list`,{
        params
    }).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(fetchContactRecordListSuccess(fromJS(res.data)))
        }else{
            dispatch(fetchContactRecordListFailure(res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchContactRecordListFailure(error));
    });
};

export const getLocalContactRecordInfo = (id) => dispatch => {
    dispatch(fetchLocalContactRecordInfo(id))
};

/**
 * 修改联系记录信息
 * @param contactRecord
 * @param callback
 * @returns {Function}
 */
export const asyncModifyContactRecordInfo = (contactRecord,callback) => dispatch => {
    dispatch(setConfirmFetchingTrue());
    axios.post(`/api/customer/contactRecord/modify/`,contactRecord).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(setConfirmFetchingFalse(fromJS(contactRecord)))
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
 * 新增联系记录信息
 * @param contactRecord
 * @param callback
 * @returns {Function}
 */
export const asyncInsertContactRecordInfo = (contactRecord, callback) => dispatch => {
    dispatch(setConfirmFetchingTrue());
    axios.post(`/api/customer/contactRecord/insert`,contactRecord).then(function(res) {
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
/**
 * 删除联系记录
 * @param id
 * @param callback
 * @returns {Function}
 */
export const asyncDeleteContactRecordInfo = (id, callback) => dispatch => {
    axios.delete(`/api/customer/contactRecord/delete/${id}`).then(function(res) {
        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};



