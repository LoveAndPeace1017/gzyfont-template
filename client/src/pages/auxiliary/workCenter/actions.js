import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';


const fetchWorkCenterRequest = (incomeType) => ({
    type: constant.FETCH_WORKCENTER_LIST_REQUEST,
    incomeType
});

const fetchWorkCenterSuccess = (data, incomeType) => ({
    type: constant.FETCH_WORKCENTER_LIST_SUCCESS,
    data,
    incomeType
});

const fetchWorkCenterFailure = (error, incomeType) => ({
    type: constant.FETCH_WORKCENTER_LIST_FAILURE,
    incomeType,
    error
});

export const asyncFetchWorkCenterList = (callback) => dispatch => {
    dispatch(fetchWorkCenterRequest());
    axios.get(`${BASE_URL}/auxiliary/workcenter/lists`).then(function(res) {
        if (res.data) {
            dispatch(fetchWorkCenterSuccess(fromJS(res.data)));
            callback && callback();
        }
    }).catch(error => {
        dispatch(fetchWorkCenterFailure(error));
    });
};



const addWorkCenterRequest = () => ({
    type: constant.ADD_WORKCENTER_REQUEST
});

const addWorkCenterSuccess = (data) => ({
    type: constant.ADD_WORKCENTER_SUCCESS,
    data
});

const addWorkCenterFailure = (error) => ({
    type: constant.ADD_WORKCENTER_FAILURE,
    error
});

export const asyncAddWorkCenter = (operType, values, callback) => dispatch => {
    dispatch(addWorkCenterRequest());
    let url = `${BASE_URL}/auxiliary/workcenter/${operType}`;
    axios.post(url,values).then(res => {
        dispatch(addWorkCenterSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addWorkCenterFailure(error));
    })
};


// 工作中心详情
export const asyncFetchWorkCenterDetail = (caCode, callback)=>({
    actionTypePrefix: constant.ASYNC_FETCH_WORK_CENTER_DETAIL,
    request: axios.get(`${BASE_URL}/auxiliary/workcenter/detail/${caCode}`),
    callback
});
