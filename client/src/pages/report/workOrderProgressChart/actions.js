import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

/**
 * 获取采购明细报表信息
 **/
const fetchWorkChartDetailReport = () => ({
    type: constant.FETCH_WORK_ORDER_CHART_REQUEST
});
const fetchWorkChartDetailReportSuccess = (data) => ({
    type: constant.FETCH_WORK_ORDER_CHART_SUCCESS,
    data
});
const fetchWorkChartDetailReportFailure = (error) => ({
    type: constant.FETCH_WORK_ORDER_CHART_FAILURE,
    error
});


export const asyncFetchWorkChartDetailReport = (params, callback) => dispatch => {
    dispatch(fetchWorkChartDetailReport());
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.post(`${BASE_URL}/auxiliary/work/chart`, params)
        .then(function (res) {
            if (res.data && res.data.retCode == 0) {
                dispatch(fetchWorkChartDetailReportSuccess(fromJS(res.data)));
            } else {
                dispatch(fetchWorkChartDetailReportFailure(res.data.retMsg));
            }
            callback && callback(res.data);
        })
        .catch(error => {
            dispatch(fetchWorkChartDetailReportFailure(error));
        });
};

