import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';

/**
 * 获取短信通知设置列表
 **/
const fetchSmsNotifyListRequest = () => ({
    type: constant.FETCH_SMS_NOTIFY_REQUEST
});

const fetchSmsNotifyListSuccess = (data) => ({
    type: constant.FETCH_SMS_NOTIFY_LIST_SUCCESS,
    data
});

const fetchSmsNotifyListFailure = (error) => ({
    type: constant.FETCH_SMS_NOTIFY_LIST_FAILURE,
    error
});

let hasCache = false;
export const asyncFetchSmsNotifyList = (addCache, callback) => dispatch => {
    const loadData = ()=>{
        dispatch(fetchSmsNotifyListRequest());
        axios.get(`${BASE_URL}/auxiliary/notification/lists`).then(function(res) {
            if (res.data) {
                dispatch(fetchSmsNotifyListSuccess(fromJS(res.data)));
                callback && callback(fromJS(res.data));
            }
        }).catch(error => {
            dispatch(fetchSmsNotifyListFailure(error));
        });
    };
    if(addCache){
        if (addCache !== hasCache) {
            loadData();
            hasCache = addCache;
        }
    }else{
        loadData();
    }

};

export const emptyGoodsUnitListCache = () => ()=> {
    hasCache = false;
};

/**
 * 新增/修改/删除短信通知设置
 **/
const addSmsNotifyRequest = () => ({
    type: constant.ADD_SMS_NOTIFY_REQUEST
});

const addSmsNotifySuccess = (data) => ({
    type: constant.ADD_SMS_NOTIFY_SUCCESS,
    data
});

const addSmsNotifyFailure = (error) => ({
    type: constant.ADD_SMS_NOTIFY_FAILURE,
    error
});

export const asyncAddSmsNotify = (type, values, callback) => dispatch => {
    dispatch(addSmsNotifyRequest());
    let url = `${BASE_URL}/auxiliary/notification/oprate/${type}`;
    axios.post(url, values).then(res => {
        dispatch(addSmsNotifySuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addSmsNotifyFailure(error));
    })
};

