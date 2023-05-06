import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";

/**
 * 委外加工详情
 **/
const fetchSubcontractByIdRequest = () => ({
    type: constant.FETCH_SUBCONTRACT_DETAIL_BY_ID_REQUEST
});

const fetchSubcontractByIdSuccess = (data) => ({
    type: constant.FETCH_SUBCONTRACT_DETAIL_BY_ID_SUCCESS,
    data
});

const fetchSubcontractByIdFailure = (error) => ({
    type: constant.FETCH_SUBCONTRACT_DETAIL_BY_ID_FAILURE,
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

const fetchGenerateOutRequest = () => ({
    type: constant.FETCH_GENERATE_OUT_REQUEST
});

const fetchGenerateOutSuccess = (data) => ({
    type: constant.FETCH_GENERATE_OUT_SUCCESS,
    data
});

const fetchGenerateOutFailure = (error) => ({
    type: constant.FETCH_GENERATE_OUT_FAILURE,
    error
});


export const asyncGenerateOut = (billNo, callback) => dispatch => {
    dispatch(fetchGenerateOutRequest());
    axios.post(`${BASE_URL}/subcontract/generateOut/${billNo}`).then(function(res) {
        if (res.data) {
            dispatch(fetchGenerateOutSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchGenerateOutFailure(error));
    });
};


const fetchGenerateInRequest = () => ({
    type: constant.FETCH_GENERATE_IN_REQUEST
});

const fetchGenerateInSuccess = (data) => ({
    type: constant.FETCH_GENERATE_IN_SUCCESS,
    data
});

const fetchGenerateInFailure = (error) => ({
    type: constant.FETCH_GENERATE_IN_FAILURE,
    error
});


export const asyncGenerateIn = (billNo, callback) => dispatch => {
    dispatch(fetchGenerateInRequest());
    axios.post(`${BASE_URL}/subcontract/generateIn/${billNo}`).then(function(res) {
        if (res.data) {
            dispatch(fetchGenerateInSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchGenerateInFailure(error));
    });
};
