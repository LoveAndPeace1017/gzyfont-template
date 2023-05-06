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
    axios.get(`${BASE_URL}/produceOrder/record/pre/create`).then(function(res) {
        if (res.data) {
            dispatch(fetchPreDataSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchPreDataFailure(error));
    });
};


/**
 * 新增生产单
 **/
const addProduceOrderRecordRequest = () => ({
    type: constant.ADD_PRODUCE_ORDER_RECORD_REQUEST
});

const addProduceOrderRecordSuccess = (data) => ({
    type: constant.ADD_PRODUCE_ORDER_RECORD_SUCCESS,
    data
});

const addProduceOrderRecordFailure = (error) => ({
    type: constant.ADD_PRODUCE_ORDER_RECORD_FAILURE,
    error
});

export const asyncAddProduceOrderRecord = (values, callback) => dispatch => {
    dispatch(addProduceOrderRecordRequest());
    let url = `${BASE_URL}/produceOrder/record/add`;
    axios.post(url, {
        ...values
    }).then(res => {
        dispatch(addProduceOrderRecordSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addProduceOrderRecordFailure(error));
    })
};

export const emptyDetailData = () => ({
    type: constant.EMPTY_DETAIL_DATA
});







