import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";


/**
 * 获取页面初始数据
 **/
const fetchPreDataRequest = () => ({
    type: constant.FETCH_PRE_DATA_REQUEST
});

const fetchPreDataSuccess = (data) => ({
    type: constant.FETCH_PRE_DATA_SUCCESS,
    data
});

const fetchPreDataFailure = (error) => ({
    type: constant.FETCH_PRE_DATA_FAILURE,
    error
});

export const asyncFetchPreData = (callback) => dispatch => {

    dispatch(fetchPreDataRequest());
    axios.get(`${BASE_URL}/subcontract/pre/create`).then(function(res) {
        if (res.data) {
            dispatch(fetchPreDataSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchPreDataFailure(error));
    });
};


/**
 * 新增委外加工提交
 **/
const addSubcontractRequest = () => ({
    type: constant.ADD_SUBCONTRACT_REQUEST
});

const addSubcontractSuccess = (data) => ({
    type: constant.ADD_SUBCONTRACT_SUCCESS,
    data
});

const addSubcontractFailure = (error) => ({
    type: constant.ADD_SUBCONTRACT_FAILURE,
    error
});

export const asyncAddSubcontract = (billNo, values, callback) => dispatch => {
    dispatch(addSubcontractRequest());
    let url = billNo?`${BASE_URL}/subcontract/modify/${billNo}`:`${BASE_URL}/subcontract/add`;
    axios.post(url, {
        ...values
    }).then(res => {
        dispatch(addSubcontractSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addSubcontractFailure(error));
    })
};


/**
 * 根据销售单id获取委外加工信息
 **/
export const fetchSubcontractByIdRequest = () => ({
    type: constant.FETCH_SUBCONTRACT_BY_ID_REQUEST
});

export const fetchSubcontractByIdSuccess = (data) => ({
    type: constant.FETCH_SUBCONTRACT_BY_ID_SUCCESS,
    data
});

export const fetchSubcontractByIdFailure = (error) => ({
    type: constant.FETCH_SUBCONTRACT_BY_ID_FAILURE,
    error
});

export const asyncFetchSubcontractById = (id, callback) => dispatch => {
    dispatch(fetchSubcontractByIdRequest());
    axios.get(`${BASE_URL}/subcontract/detail/${id}`).then(function(res) {
        if (res.data) {
            dispatch(fetchSubcontractByIdSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchSubcontractByIdFailure(error));
    });
};


export const emptyDetailData = () => ({
    type: constant.EMPTY_DETAIL_DATA
});










