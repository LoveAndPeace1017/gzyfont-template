import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

/**
 * 获取采购明细报表信息
 **/
const fetchSaleAndProductDetailReport = () => ({
    type: constant.FETCH_SALE_AND_PRODUCT_PROGRESS_REQUEST
});
const fetchSaleAndProductDetailReportSuccess = (data) => ({
    type: constant.FETCH_SALE_AND_PRODUCT_PROGRESS_SUCCESS,
    data
});
const fetchSaleAndProductDetailReportFailure = (error) => ({
    type: constant.FETCH_SALE_AND_PRODUCT_PROGRESS_FAILURE,
    error
});


export const asyncFetchSaleAndProductDetailReport = (params, callback) => dispatch => {
    dispatch(fetchSaleAndProductDetailReport());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/report/saleAndProductProgressReport/chart`, params)
        .then(function (res) {
            if (res.data && res.data.retCode == 0) {
                dispatch(fetchSaleAndProductDetailReportSuccess(fromJS(res.data)));
            } else {
                dispatch(fetchSaleAndProductDetailReportFailure(res.data.retMsg));
            }
            callback && callback(res.data);
        })
        .catch(error => {
            dispatch(fetchSaleAndProductDetailReportFailure(error));
        });
};

