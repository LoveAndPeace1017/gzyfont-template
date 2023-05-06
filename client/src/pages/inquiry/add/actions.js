import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";
import jsonp from 'jsonp';


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
    axios.get(`${BASE_URL}/inquiry/pre/create`).then(function (res) {
        if (res.data) {
            dispatch(fetchPreDataSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchPreDataFailure(error));
    });
};

/**
 * 根据物品名称获取匹配百卓目录
 **/
export const fetchCateByNameRequest = () => ({
    type: constant.FETCH_CATE_BY_NAME_REQUEST
});

export const fetchCateByNameSuccess = (data, insertLineKey) => ({
    type: constant.FETCH_CATE_BY_NAME_SUCCESS,
    data,
    insertLineKey
});

export const fetchCateByNameFailure = (error) => ({
    type: constant.FETCH_CATE_BY_NAME_FAILURE,
    error
});



export const asyncFetchCateByName = (name, insertLineKey, callback) => dispatch => {

    dispatch(fetchCateByNameRequest());
    // axios.get(`/to_abiz/catalog/demands/miccn.json`,{
    //     params:{
    //         keyword: 'led灯具',
    //         _: new Date().getTime()
    //     }
    // })
    /*axios.get(`${BASE_URL}/inquiry/catalog/demands`,{
        params:{
            keyword: 'led灯具',
            _: new Date().getTime()
        }
    }).then(function (res) {
        if (res.data) {
            dispatch(fetchCateByNameSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchCateByNameFailure(error));
    });*/


    jsonp(`http://www.abiz.com/catalog/demands/miccn.json?keyword=${name}&_=${new Date().getTime()}`,{
        param: 'jsoncallback'
    }, (err, res) => {
        if (err) {
            dispatch(fetchCateByNameFailure(error));
        } else {
            if (res.recommendation && Object.keys(res.recommendation).length>0) {
                dispatch(fetchCateByNameSuccess(fromJS(res.recommendation), insertLineKey));
                callback && callback(res.recommendation);
            }
        }
    });
};

/**
 * 新增询价单提交
 **/
const addInquiryRequest = () => ({
    type: constant.ADD_INQUIRY_REQUEST
});

const addInquirySuccess = (data) => ({
    type: constant.ADD_INQUIRY_SUCCESS,
    data
});

const addInquiryFailure = (error) => ({
    type: constant.ADD_INQUIRY_FAILURE,
    error
});

export const asyncAddInquiry = (values, callback) => dispatch => {
    dispatch(addInquiryRequest());
    axios.post(`${BASE_URL}/inquiry/insert`, {
        ...values
    }).then(res => {
        dispatch(addInquirySuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addInquiryFailure(error));
    })
};


/**
 * 根据询价单id获取询价单信息
 **/
export const fetchInquiryByIdRequest = () => ({
    type: constant.FETCH_INQUIRY_BY_ID_REQUEST
});

export const fetchInquiryByIdSuccess = (data) => ({
    type: constant.FETCH_INQUIRY_BY_ID_SUCCESS,
    data
});

export const fetchInquiryByIdFailure = (error) => ({
    type: constant.FETCH_INQUIRY_BY_ID_FAILURE,
    error
});

export const asyncFetchInquiryById = (id, callback) => dispatch => {

    dispatch(fetchInquiryByIdRequest());
    axios.get(`${BASE_URL}/inquiry/detail/${id}`).then(function (res) {
        if (res.data) {
            dispatch(fetchInquiryByIdSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchInquiryByIdFailure(error));
    });

};


export const emptyDetailData = () => ({
    type: constant.EMPTY_DETAIL_DATA
});











