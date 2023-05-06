import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';

/**
 * 获取物品单位列表
 **/
const fetchAbizAllCateRequest = () => ({
    type: constant.FETCH_ABIZ_ALL_CATE_REQUEST
});

const fetchAbizAllCateSuccess = (data) => ({
    type: constant.FETCH_ABIZ_ALL_CATE_SUCCESS,
    data
});

const fetchAbizAllCateFailure = (error) => ({
    type: constant.FETCH_ABIZ_ALL_CATE_FAILURE,
    error
});

export const asyncFetchAbizAllCate = (callback) => dispatch => {
    dispatch(fetchAbizAllCateRequest());
    axios.get(`${BASE_URL}/goods/catalog/loadAll`).then(function(res) {
        if (res.data) {
            dispatch(fetchAbizAllCateSuccess(fromJS(res.data)));
        }
        callback && callback(res.data);
    }).catch(error => {
        dispatch(fetchAbizAllCateFailure(error));
    });
};
