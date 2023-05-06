import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';

/**
 * 获取下载中心列表
 **/
const fetchDownloadCenterListRequest = () => ({
    type: constant.FETCH_DOWNLOAD_CENTER_REQUEST
});

const fetchDownloadCenterListSuccess = (data) => ({
    type: constant.FETCH_DOWNLOAD_CENTER_SUCCESS,
    data
});

const fetchDownloadCenterListFailure = (error) => ({
    type: constant.FETCH_DOWNLOAD_CENTER_FAILURE,
    error
});


export const asyncFetchDownloadCenter = (params, callback) => dispatch => {
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/downloadCenter/download`,params).then(function(res) {
        if (res.data) {
            callback && callback(res.data);
        }
    }).catch(error => {

    });
};



export const asyncFetchDownloadCenterList = (params, callback) => dispatch => {
    dispatch(fetchDownloadCenterListRequest());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/downloadCenter/list`,params).then(function(res) {
        if (res.data) {
            dispatch(fetchDownloadCenterListSuccess(fromJS(res.data)));
            callback && callback(fromJS(res.data));
        }
    }).catch(error => {
        dispatch(fetchDownloadCenterListFailure(error));
    });

};



