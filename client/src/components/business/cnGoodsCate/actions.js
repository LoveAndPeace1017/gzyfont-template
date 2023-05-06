import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';

/**
 * //获取内贸站物品分类
 **/
const fetchCnGoodsCateListRequest = () => ({
    type: constant.FETCH_CN_GOODS_CATE_LIST_REQUEST
});

const fetchCnGoodsCateListSuccess = (data) => ({
    type: constant.FETCH_CN_GOODS_CATE_LIST_SUCCESS,
    data
});

const fetchCnGoodsCateListFailure = (error) => ({
    type: constant.FETCH_CN_GOODS_CATE_LIST_FAILURE,
    error
});

export const asyncFetchCnGoodsCateList = (callback) => dispatch => {
    dispatch(fetchCnGoodsCateListRequest());
    axios.get(`${BASE_URL}/goods/prod/micGroups`).then(function(res) {
        if (res.data) {
            dispatch(fetchCnGoodsCateListSuccess(fromJS(res.data)));
        }
        callback && callback(res.data);
    }).catch(error => {
        dispatch(fetchCnGoodsCateListFailure(error));
    });
};
