import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';


/**
 * 获取采购申请明细列表数据
 **/
const fetchRequisitionApplyOrderList = () => ({
    type: constant.FETCH_REQUISITION_APPLY_ORDER_LIST_REQUEST
});
const fetchRequisitionApplyOrderListSuccess = (data) => ({
    type: constant.FETCH_REQUISITION_APPLY_ORDER_LIST_SUCCESS,
    data
});
const fetchRequisitionApplyOrderListFailure = (error) => ({
    type: constant.FETCH_REQUISITION_APPLY_ORDER_LIST_FAILURE,
    error
});

/**
 * 获取采购申请明细列表
 * @param params
 * @returns {Function}
 */
export const asyncFetchRequisitionApplyOrderList = (params, callback) => dispatch => {
    dispatch(fetchRequisitionApplyOrderList());

    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.get(`${BASE_URL}/requisitionOrder/apply/list`, {
        params: {
            page: 1,
            ...params
        }
    }).then(function (res) {
        dispatch(fetchRequisitionApplyOrderListSuccess(fromJS(res.data)));
        callback && callback(res);
    }).catch(error => {
        dispatch(fetchRequisitionApplyOrderListFailure(error));
    });
};


// 列表返回带回初始化数据
const filterConfigListSuccess = (data) => ({
    type: constant.FILTER_CONFIG_LIST,
    data
});

export const dealFilterConfigList = (data) => dispatch => {
    dispatch(filterConfigListSuccess(data))
};



/**
 * 更新配置项
 */
const updateConfig = (data) => ({
    type: constant.TYPE + '_' + 'COMMON_UPDATE_TEMP_CONFIG',
    data
});

export const asyncUpdateConfig = (type, fieldName, propName, index, value) => dispatch => {
    dispatch(updateConfig({
        type, fieldName, propName, index, value
    }));
};

export const asyncBatchUpdateConfig = (arr, callback)=>asyncBaseBatchUpdateConfig(constant.TYPE, arr, callback);



