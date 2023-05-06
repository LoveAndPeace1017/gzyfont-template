import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';


const fetchWorkProcedureRequest = (incomeType) => ({
    type: constant.FETCH_WORKPROCEDURE_LIST_REQUEST,
    incomeType
});

const fetchWorkProcedureSuccess = (data, incomeType) => ({
    type: constant.FETCH_WORKPROCEDURE_LIST_SUCCESS,
    data,
    incomeType
});

const fetchWorkProcedureFailure = (error, incomeType) => ({
    type: constant.FETCH_WORKPROCEDURE_LIST_FAILURE,
    incomeType,
    error
});

export const asyncFetchWorkProcedureList = (callback) => dispatch => {
    dispatch(fetchWorkProcedureRequest());
    axios.get(`${BASE_URL}/auxiliary/workprocess/lists`).then(function(res) {
        if (res.data) {
            dispatch(fetchWorkProcedureSuccess(fromJS(res.data)));
            callback && callback();
        }
    }).catch(error => {
        dispatch(fetchWorkProcedureFailure(error));
    });
};



const addWorkProcedureRequest = () => ({
    type: constant.ADD_WORKPROCEDURE_REQUEST
});

const addWorkProcedureSuccess = (data) => ({
    type: constant.ADD_WORKPROCEDURE_SUCCESS,
    data
});

const addWorkProcedureFailure = (error) => ({
    type: constant.ADD_WORKPROCEDURE_FAILURE,
    error
});

export const asyncAddWorkProcedure = (operType, values, callback) => dispatch => {
    dispatch(addWorkProcedureRequest());
    let url = `${BASE_URL}/auxiliary/workprocess/${operType}`;
    axios.post(url,values).then(res => {
        dispatch(addWorkProcedureSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addWorkProcedureFailure(error));
    })
};