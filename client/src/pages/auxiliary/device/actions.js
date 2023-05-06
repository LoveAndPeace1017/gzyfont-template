import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';


const fetchDeviceManageRequest = (incomeType) => ({
    type: constant.FETCH_DEVICE_MANAGE_LIST_REQUEST,
    incomeType
});

const fetchDeviceManageSuccess = (data, incomeType) => ({
    type: constant.FETCH_DEVICE_MANAGE_LIST_SUCCESS,
    data,
    incomeType
});

const fetchDeviceManageFailure = (error, incomeType) => ({
    type: constant.FETCH_DEVICE_MANAGE_LIST_FAILURE,
    incomeType,
    error
});

export const asyncFetchDeviceManageList = (callback) => dispatch => {
    dispatch(fetchDeviceManageRequest());
    axios.get(`${BASE_URL}/auxiliary/device/lists`).then(function(res) {
        if (res.data) {
            dispatch(fetchDeviceManageSuccess(fromJS(res.data)));
            callback && callback();
        }
    }).catch(error => {
        dispatch(fetchDeviceManageFailure(error));
    });
};



const addDeviceManageRequest = () => ({
    type: constant.ADD_DEVICE_MANAGE_REQUEST
});

const addDeviceManageSuccess = (data) => ({
    type: constant.ADD_DEVICE_MANAGE_SUCCESS,
    data
});

const addDeviceManageFailure = (error) => ({
    type: constant.ADD_DEVICE_MANAGE_FAILURE,
    error
});

export const asyncAddDeviceManage = (operType, values, callback) => dispatch => {
    dispatch(addDeviceManageRequest());
    let url = `${BASE_URL}/auxiliary/device/${operType}`;
    axios.post(url,values).then(res => {
        dispatch(addDeviceManageSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addDeviceManageFailure(error));
    })
};