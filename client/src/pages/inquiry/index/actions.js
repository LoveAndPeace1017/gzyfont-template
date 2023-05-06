import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';

const setConfirmFetchingTrue = (data) => ({
    type: constant.INQUIRY_CONFIRM_FETCHING_TRUE,
    data
});
const setConfirmFetchingFalse = (error) => ({
    type: constant.INQUIRY_CONFIRM_FETCHING_FALSE,
    error
});

const fetchConfigSuccess = (data) => ({
    type: constant.FETCH_INQUIRY_CONFIG_SUCCESS,
    data
});

export const asyncFetchConfig = (callback) => dispatch => {
    axios.get(`api/inquiry/config/`).then(function (res) {
        dispatch(fetchConfigSuccess(res.data));
        callback(res);
    }).catch(error => {
        callback({
            retCode: 1,
            retMsg: error
        });
    });
};

export const asyncFetchStatistic = (callback) => dispatch => {
    axios.get(`/api/inquiry/listStatistics/`).then(function (res) {
        callback(res.data);
    }).catch(error => {
        callback({
            retCode: 1,
            retMsg: error
        });
    });
};

// 询价单列表
const fetchInquiryList = () => ({
    type: constant.INQUIRY_LIST
});
const fetchInquiryListSuccess = (data) => ({
    type: constant.INQUIRY_LIST_SUCCESS,
    data
});
const fetchInquiryListFailure = (error) => ({
    type: constant.INQUIRY_LIST_FAILURE,
    error
});

// 报价单列表
const fetchQuoteList = () => ({
    type: constant.QUOTE_LIST
});
const fetchQuoteListSuccess = (data) => ({
    type: constant.QUOTE_LIST_SUCCESS,
    data
});
const fetchQuoteListFailure = (error) => ({
    type: constant.QUOTE_LIST_FAILURE,
    error
});
/**
 * 获取x询价列表
 * @param params
 * @returns {Function}
 */
export const asyncFetchInquiryList = (params, callback) => dispatch => {
    dispatch(fetchInquiryList());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.get(`/api/inquiry/list`, params).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(fetchInquiryListSuccess(res.data));
        } else {
            dispatch(fetchInquiryListFailure(res.data.retMsg));
        }
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchInquiryListFailure(error));
    });
};

/**
 * 获取x询价列表
 * @param params
 * @returns {Function}
 */
export const asyncFetchQuoteList = (inquiryId, callback) => dispatch => {
    dispatch(fetchQuoteList());
    axios.post(`/api/inquiry/quoteList`, {inquiryId: inquiryId}).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(fetchQuoteListSuccess(fromJS(res.data)));
        } else {
            dispatch(fetchQuoteListFailure(res.data.retMsg));
        }

        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchQuoteListFailure(error));
    });
};
/**
 * 对比报价
 * @param params
 * @returns {Function}
 */
export const asyncCompareQuotation = (params, callback) => dispatch => {
    axios.post(`${BASE_URL}/inquiry/compare`, params).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            if (callback) {
                callback(res.data);
            }
        } else {
            alert(res.data.retMsg);
        }
    }).catch(error => {
        dispatch(fetchQuoteListFailure(error));
    });
};

const fetchLocalInquiryInfo = (id) => ({
    type: constant.GET_LOCAL_INQUIRY_INFO,
    id
});

export const getLocalInquiryInfo = (id) => dispatch => {
    dispatch(fetchLocalInquiryInfo(id))
};

/**
 * 修改仓库信息
 * @param inquiry
 * @param callback
 * @returns {Function}
 */
export const asyncModifyInquiryInfo = (inquiry, callback) => dispatch => {
    dispatch(setConfirmFetchingTrue());
    axios.put(`/api/inquiry/modify`, inquiry).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(setConfirmFetchingFalse(fromJS(inquiry)))
        } else {
            dispatch(setConfirmFetchingFalse(res.data.retMsg));
        }
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        dispatch(setConfirmFetchingFalse(error));
    });
};

/**
 * 新增仓库信息
 * @param inquiry
 * @param callback
 * @returns {Function}
 */
export const asyncInsertInquiryInfo = (inquiry, callback) => dispatch => {
    dispatch(setConfirmFetchingTrue());
    axios.post(`/api/inquiry/insert`, inquiry).then(function (res) {
        if (res.data && res.data.retCode == 0) {

            dispatch(setConfirmFetchingFalse(fromJS(res.data)))
        } else {
            dispatch(setConfirmFetchingFalse(res.data.retMsg));
        }
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        dispatch(setConfirmFetchingFalse(error));
    });
};

export const asyncDeleteInquiryInfo = (ids, callback) => dispatch => {
    axios.post(`${BASE_URL}/inquiry/delete`, {
        ids: ids
    }).then(function (res) {
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};
export const asyncToggleInquiryInfo = (id, callback) => dispatch => {
    axios.post(`/api/inquiry/disable/${id}`).then(function (res) {
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};

// 询价单详情
const fetchInquiryDetail = () => ({
    type: constant.FETCH_INQUIRY_DETAIL
});
const fetchInquiryDetailSuccess = (data) => ({
    type: constant.FETCH_INQUIRY_DETAIL_SUCCESS,
    data
});
const fetchInquiryDetailFailure = (error) => ({
    type: constant.FETCH_INQUIRY_DETAIL_FAILURE,
    error
});


export const asyncFetchInquiryDetail = (inquiryId, callback) => dispatch => {
    dispatch(fetchInquiryDetail());
    axios.get(`${BASE_URL}/inquiry/detail/${inquiryId}`).then(function(res) {
        if (res.data) {
            dispatch(fetchInquiryDetailSuccess(res.data));
            if (callback) {
                callback(res.data);
            }
        } else {
            dispatch(fetchInquiryDetailFailure(res.data.retMsg));
        }
    }).catch(error => {
        alert(error);
    });
};
