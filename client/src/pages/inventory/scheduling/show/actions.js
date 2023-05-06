import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';

export const cancelScheduling = () => ({
    type: constant.CANCEL_SCHEDULING_REQUEST
});

const cancelSchedulingSuccess = (data) => ({
    type: constant.CANCEL_SCHEDULING_SUCCESS,
    data
});
const cancelSchedulingFailure = (error) => ({
    type: constant.CANCEL_SCHEDULING_FAILURE,
    error
});

export const asyncCancelScheduling = (id, params, callback) => dispatch => {
    dispatch(cancelScheduling());
    if(!params){
        params = {};
    }
    if(typeof params === 'function'){
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/scheduling/cancel/${id}`,params).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(cancelSchedulingSuccess(fromJS(res.data)));
        } else{
            dispatch(cancelSchedulingFailure(res.data.retMsg));
        }
        callback && callback(fromJS(res.data));
    }).catch(error => {
        dispatch(cancelSchedulingFailure(error));
    });
};

export const acceptScheduling = () => ({
    type: constant.ACCEPT_SCHEDULING_REQUEST
});

const acceptSchedulingSuccess = (data) => ({
    type: constant.ACCEPT_SCHEDULING_SUCCESS,
    data
});
const acceptSchedulingFailure = (error) => ({
    type: constant.ACCEPT_SCHEDULING_FAILURE,
    error
});

export const asyncAcceptScheduling = (billNo, callback) => dispatch => {
    dispatch(acceptScheduling());
    axios.post(`${BASE_URL}/scheduling/confirm/${billNo}`, {}).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(acceptSchedulingSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }else{
            dispatch(acceptSchedulingFailure(res.data.retMsg));
        }
    }).catch(error => {
        dispatch(acceptSchedulingFailure(error));
    });
};