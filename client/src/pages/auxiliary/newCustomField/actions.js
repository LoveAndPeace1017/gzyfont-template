import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';


const fetchNewCustomFieldListRequest = () => ({
    type: constant.FETCH_NEW_CUSTOM_FIELD_LIST_REQUEST
});

const fetchNewCustomFieldListSuccess = (moduleName,data) => ({
    type: constant.FETCH_NEW_CUSTOM_FIELD_LIST_SUCCESS,
    data,
    moduleName
});

const fetchNewCustomFieldListFailure = (error) => ({
    type: constant.FETCH_NEW_CUSTOM_FIELD_LIST_FAILURE,
    error
});

export const asyncFetchNewCustomFieldList = (type,callback) => dispatch => {
    dispatch(fetchNewCustomFieldListRequest());
    axios.get(`${BASE_URL}/auxiliary/newCustomField/list`,{
        params: {
            type
        }
    }).then(function(res) {
        if (res.data) {
            dispatch(fetchNewCustomFieldListSuccess(type,fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchNewCustomFieldListFailure(error));
    });
};


const addNewCustomFieldRequest = () => ({
    type: constant.ADD_NEW_CUSTOM_FIELD_REQUEST
});

const addNewCustomFieldSuccess = (data) => ({
    type: constant.ADD_NEW_CUSTOM_FIELD_SUCCESS,
    data
});

const addNewCustomFieldFailure = (error) => ({
    type: constant.ADD_NEW_CUSTOM_FIELD_FAILURE,
    error
});

export const asyncAddNewCustomField = (operType,values, callback) => dispatch => {
    dispatch(addNewCustomFieldRequest());
    let url = `${BASE_URL}/auxiliary/newCustomField/oprate/${operType}`;
    axios.post(url,values).then(res => {
        dispatch(addNewCustomFieldSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addNewCustomFieldFailure(error));
    })
};