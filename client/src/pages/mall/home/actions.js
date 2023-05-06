import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';


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
    axios.get(`${BASE_URL}/mall/baseInfo`).then(function (res) {
        if (res.data) {
            dispatch(fetchPreDataSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchPreDataFailure(error));
    });
};


const fetchSettingInfoRequest = () => ({
    type: constant.FETCH_SETTING_INFO_REQUEST
});

const fetchSettingInfoSuccess = (data) => ({
    type: constant.FETCH_SETTING_INFO_SUCCESS,
    data
});

const fetchSettingInfoFailure = (error) => ({
    type: constant.FETCH_SETTING_INFO_FAILURE,
    error
});

export const asyncFetchSettingInfo = (callback) => dispatch => {
    dispatch(fetchSettingInfoRequest());
    axios.get(`${BASE_URL}/mall/view/setting`).then(function (res) {
        if (res.data) {
            dispatch(fetchSettingInfoSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchSettingInfoFailure(error));
    });
};
/**
 * 设置商城
 * @param params
 * @param callback
 * @returns {Function}
 */

const fetchEditMallRequest = () => ({
    type: constant.FETCH_EDIT_MALL_REQUEST
});

const fetchEditMallSuccess = (data) => ({
    type: constant.FETCH_EDIT_MALL_SUCCESS,
    data
});

const fetchEditMallFailure = (error) => ({
    type: constant.FETCH_EDIT_MALL_FAILURE,
    error
});

export const asyncEditMallSetting = (params,callback) => dispatch => {
    dispatch(fetchEditMallRequest());
    axios.post(`${BASE_URL}/mall/edit/setting`,params).then(function (res) {
        if (res.data) {
            dispatch(fetchEditMallSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchEditMallFailure(error));
    });
};

/**
 * 开通小程序商城
 **/
const fetchOpenAppletsMallRequest = () => ({
    type: constant.FETCH_OPEN_APPLETS_MALL_REQUEST
});

const fetchOpenAppletsMallSuccess = (data) => ({
    type: constant.FETCH_OPEN_APPLETS_MALL_SUCCESS,
    data
});

const fetchOpenAppletsMallFailure = (error) => ({
    type: constant.FETCH_OPEN_APPLETS_MALL_FAILURE,
    error
});

export const asyncFetchOpenAppletsMall = (values, callback) => dispatch => {

    dispatch(fetchOpenAppletsMallRequest());
    axios.post(`${BASE_URL}/mall/openAppletsMall`, {
        ...values
    }).then(function (res) {
        if (res.data) {
            dispatch(fetchOpenAppletsMallSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchOpenAppletsMallFailure(error));
    });
};

/**
 * 记录引导出现
 **/
const recordGuideShowRequest = () => ({
    type: constant.RECORD_GUIDE_SHOW_REQUEST
});

const recordGuideShowSuccess = (data) => ({
    type: constant.RECORD_GUIDE_SHOW_SUCCESS,
    data
});

const recordGuideShowFailure = (error) => ({
    type: constant.RECORD_GUIDE_SHOW_FAILURE,
    error
});

export const asyncRecordGuideShow = (callback) => dispatch => {

    dispatch(recordGuideShowRequest());
    axios.post(`${BASE_URL}/common/popup`,{
        popupType: 'EXPLORING_MALL'
    }).then(function (res) {
        if (res.data) {
            dispatch(recordGuideShowSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(recordGuideShowFailure(error));
    });
};
