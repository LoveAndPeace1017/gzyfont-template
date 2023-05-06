import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

/**
 * 获取采购明细报表信息
 **/
const fetchCooperatorList = () => ({
    type: constant.FETCH_COOPERATOR_LIST_DETAIL
});
const fetchCooperatorListSuccess = (data) => ({
    type: constant.FETCH_COOPERATOR_LIST_SUCCESS,
    data
});
const fetchCooperatorListFailure = (error) => ({
    type: constant.FETCH_COOPERATOR_LIST_FAILURE,
    error
});

const newDomain = 'https://hehuo.abiz.com/api';

export const asyncFetchCooperatorList = (params, callback) => dispatch => {
    dispatch(fetchCooperatorList());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${newDomain}/cooperator/detail`, params)
        .then(function (res) {
            if (res.data && res.data.retCode == 0) {
                console.log('zou');
                dispatch(fetchCooperatorListSuccess(fromJS(res.data)));
            } else {
                dispatch(fetchCooperatorListFailure(res.data.retMsg));
            }
            callback && callback(res.data);
        })
        .catch(error => {
            dispatch(fetchCooperatorListFailure(error));
        });
};

