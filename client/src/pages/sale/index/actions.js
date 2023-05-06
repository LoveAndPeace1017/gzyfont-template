import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';

const setConfirmFetchingTrue = (data) => ({
    type: constant.SALE_CONFIRM_FETCHING_TRUE,
    data
});
const setConfirmFetchingFalse = (error) => ({
    type: constant.SALE_CONFIRM_FETCHING_FALSE,
    error
});

const fetchConfigSuccess = (data) => ({
    type: constant.FETCH_SALE_CONFIG_SUCCESS,
    data
});

export const asyncFetchConfig = (callback) => dispatch => {
    axios.get(`api/sale/config/`).then(function(res) {
        dispatch(fetchConfigSuccess(res.data));
        callback(res);
    }).catch(error => {
        callback({
            retCode:1,
            retMsg:error
        });
    });
};

export const asyncFetchStatistic = (callback) => dispatch => {
    axios.get(`${BASE_URL}/sale/listStatistics/`).then(function(res) {
        callback(res.data);
    }).catch(error => {
        callback({
            retCode:1,
            retMsg:error
        });
    });
};


/**
 * 获取物品列表数据
 **/
const fetchSaleList = () => ({
    type: constant.SALE_LIST
});
const fetchSaleListSuccess = (data) => ({
    type: constant.SALE_LIST_SUCCESS,
    data
});
const fetchSaleListFailure = (error) => ({
    type: constant.SALE_LIST_FAILURE,
    error
});
/**
 * 获取销售列表
 * @param params
 * @returns {Function}
 */
export const asyncFetchSaleList = (params,callback) => dispatch => {
    dispatch(fetchSaleList());
    if(!params){
        params = {};
    }
    if(typeof params === 'function'){
        callback = params;
        params = {};
    }
    axios.get(`${BASE_URL}/sale/list`,{
        params:{
            page: 1,
            // perPage: 3,
            ...params
        }
    }).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(fetchSaleListSuccess(fromJS(res.data)));
            if(callback){
                callback(res.data);
            }
        }else{
            dispatch(fetchSaleListFailure(res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchSaleListFailure(error));
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

const fetchLocalSaleInfo = (id) => ({
    type: constant.GET_LOCAL_SALE_INFO,
    id
});

export const getLocalSaleInfo = (id) => dispatch => {
    dispatch(fetchLocalSaleInfo(id))
};

/**
 * 修改物品信息
 * @param sale
 * @param callback
 * @returns {Function}
 */
export const asyncModifySaleInfo = (sale,callback) => dispatch => {
    dispatch(setConfirmFetchingTrue());
    axios.put(`${BASE_URL}/sale/modify`,sale).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(setConfirmFetchingFalse(fromJS(sale)))
        }else{
            dispatch(setConfirmFetchingFalse(res.data.retMsg));
        }
        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        dispatch(setConfirmFetchingFalse(error));
    });
};

/**
 * 新增物品信息
 * @param sale
 * @param callback
 * @returns {Function}
 */
export const asyncInsertSaleInfo = (sale, callback) => dispatch => {
    dispatch(setConfirmFetchingTrue());
    axios.post(`${BASE_URL}/sale/insert`,sale).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(setConfirmFetchingFalse(fromJS(res.data)))
        }else{
            dispatch(setConfirmFetchingFalse(res.data.retMsg));
        }
        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        dispatch(setConfirmFetchingFalse(error));
    });
};

export const asyncDeleteSaleInfo = (ids, callback) => dispatch => {
    axios.post(`${BASE_URL}/sale/delete`,{
        ids
    }).then(function(res) {
        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};
//删除确认
export const asyncBeforeDeleteSaleInfo = (ids, callback) => dispatch => {
    axios.post(`${BASE_URL}/sale/beforeDelete`,{
        ids
    }).then(function(res) {
        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};
export const asyncToggleSaleInfo = (id, disableFlag, callback) => dispatch => {
    let url = disableFlag? `${BASE_URL}/sale/status/enable/${id}`: `${BASE_URL}/sale/status/disable/${id}`;
    axios.post(url).then(function(res) {
        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};

/**
 * 更新配置项
 */
const updateConfig = (data) => ({
    type: constant.TYPE + '_' + 'COMMON_UPDATE_TEMP_CONFIG',
    data
});
const updateConfigByFieldName = (data) => ({
    type: constant.SALE_UPDATE_CONFIG_FIELD_NAME,
    data
});

export const asyncUpdateConfig = (type, fieldName,propName,index,value) => dispatch => {
    if(index === null){
        dispatch(updateConfigByFieldName({
            type1:type,
            fieldName,
            propName1:propName,
            value1:value
        }));
    }else{
        dispatch(updateConfig({
            type, fieldName,propName,index,value
        }));
    }
};

export const asyncBatchUpdateConfig = (arr, callback)=>asyncBaseBatchUpdateConfig(constant.TYPE, arr, callback);

/**
* 根据物品code获取物品仓库数量
**/
const fetchWareByCodeRequest = (code) => ({
    type: constant.FETCH_WARE_BY_CODE_REQUEST,
    code
});
const fetchWareByCodeSuccess = (code, data) => ({
    type: constant.FETCH_WARE_BY_CODE_SUCCESS,
    code,
    data
});
const fetchWareByCodeFailure = (code, error) => ({
    type: constant.FETCH_WARE_BY_CODE_FAILURE,
    code,
    error
});
export const asyncFetchWareByCode = (code,callback) => dispatch => {
    dispatch(fetchWareByCodeRequest(code));
    axios.get(`${BASE_URL}/sale/${code}/inventories`).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(fetchWareByCodeSuccess(code, fromJS(res.data.data)));
            if(callback){
                callback(res.data);
            }
        }else{
            dispatch(fetchWareByCodeFailure(code, res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchWareByCodeFailure(error));
    });
};

/**
 * 取消分销物品
 * @param ids
 * @param callback
 * @returns {Function}
 */
export const asyncCancelDistribute = (ids, callback) => dispatch => {
    axios.post(`${BASE_URL}/sale/delete`,{
        ids
    }).then(function(res) {
        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};
/**
 * 设置分销物品
 * @param ids
 * @param callback
 * @returns {Function}
 */
export const asyncSetDistribute = (ids, callback) => dispatch => {
    axios.post(`${BASE_URL}/sale/delete`,{
        ids
    }).then(function(res) {
        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};

/**
 * 获取销售记录
 **/
const fetchSaleRecordRequest = () => ({
    type: constant.FETCH_SALE_RECORD_REQUEST
});
const fetchSaleRecordSuccess = (data) => ({
    type: constant.FETCH_SALE_RECORD_SUCCESS,
    data
});
const fetchSaleRecordFailure = () => ({
    type: constant.FETCH_SALE_RECORD_FAILURE
});
export const asyncFetchSaleRecord = ({recordFor, type, page = 1, perPage = 20}, callback) => dispatch => {
    dispatch(fetchSaleRecordRequest());
    axios.get(`${BASE_URL}/sale/record/for/${recordFor}`,{
        params: {
            type,
            page,
            perPage
        }
    }).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(fetchSaleRecordSuccess(fromJS(res.data)));
            if(callback){
                callback(res.data);
            }
        }else{
            dispatch(fetchSaleRecordFailure());
        }
    }).catch(error => {
        dispatch(fetchSaleRecordFailure(error));
    });
};



/**
 * 获取销售批量出库信息
 **/
const fetchBatchOutInfoRequest = () => ({
    type: constant.FETCH_SALE_BATCH_OUT_INFO_REQUEST
});
const fetchBatchOutInfoSuccess = (data) => ({
    type: constant.FETCH_SALE_BATCH_OUT_INFO_SUCCESS,
    data
});
const fetchBatchOutInfoFailure = () => ({
    type: constant.FETCH_SALE_BATCH_OUT_INFO_FAILURE
});
export const asyncBatchOutInfo = (ids, callback) => dispatch => {
    dispatch(fetchBatchOutInfoRequest());
    axios.post(`${BASE_URL}/sale/outs/batch/pre/create`, {
        ids
    }).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(fetchBatchOutInfoSuccess(fromJS(res.data)));
        } else {
            dispatch(fetchBatchOutInfoFailure());
        }
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchBatchOutInfoFailure(error));
    });
};

export const asyncBatchWareOut = ({dataList, warehouseName}, callback) => dispatch => {
    axios.post(`${BASE_URL}/sale/outs/batch`, {
        dataList,
        warehouseName
    }).then(function (res) {
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};


/**
 * 获取销售批量收款信息
 **/
const fetchBatchIncomeInfoRequest = () => ({
    type: constant.FETCH_SALE_BATCH_PRE_INCOME_REQUEST
});
const fetchBatchIncomeInfoSuccess = (data) => ({
    type: constant.FETCH_SALE_BATCH_PRE_INCOME_SUCCESS,
    data
});
const fetchBatchIncomeInfoFailure = () => ({
    type: constant.FETCH_SALE_BATCH_PRE_INCOME_FAILURE
});
export const asyncBatchIncomePre = (ids, callback) => dispatch => {
    dispatch(fetchBatchIncomeInfoRequest());
    axios.post(`${BASE_URL}/sale/payments/batch/pre/create`, {
        ids
    }).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(fetchBatchIncomeInfoSuccess(fromJS(res.data)));
        } else {
            dispatch(fetchBatchIncomeInfoFailure());
        }
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchBatchIncomeInfoFailure(error));
    });
};

export const asyncBatchIncome = (dataList, callback) => dispatch => {
    axios.post(`${BASE_URL}/sale/payments/batch`, {
        dataList
    }).then(function (res) {
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};

/**
 * 获取销售批量开票信息
 **/
const fetchBatchSaleInvoiceInfoRequest = () => ({
    type: constant.FETCH_SALE_BATCH_PRE_SALEINVOICE_REQUEST
});
const fetchBatchSaleInvoiceInfoSuccess = (data) => ({
    type: constant.FETCH_SALE_BATCH_PRE_SALEINVOICE_SUCCESS,
    data
});
const fetchBatchSaleInvoiceInfoFailure = () => ({
    type: constant.FETCH_SALE_BATCH_PRE_SALEINVOICE_FAILURE
});
export const asyncBatchSaleInvoicePre = (ids, callback) => dispatch => {
    dispatch(fetchBatchSaleInvoiceInfoRequest());
    axios.post(`${BASE_URL}/sale/invoices/batch/pre/create`, {
        ids
    }).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(fetchBatchSaleInvoiceInfoSuccess(fromJS(res.data)));
        } else {
            dispatch(fetchBatchSaleInvoiceInfoFailure());
        }
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchBatchSaleInvoiceInfoFailure(error));
    });
};

export const asyncBatchSaleInvoice = (dataList, callback) => dispatch => {
    axios.post(`${BASE_URL}/sale/invoices/batch`, {
        dataList
    }).then(function (res) {
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};

/**
 * 根据单号获取物品概要的总类
 **/
const fetchProdAbstractByBillNoRequest = (billNo) => ({
    type: constant.FETCH_PROD_ABSTRACT_BY_BILL_NO_REQUEST,
    billNo
});
const fetchProdAbstractByBillNoSuccess = (billNo, data) => ({
    type: constant.FETCH_PROD_ABSTRACT_BY_BILL_NO_SUCCESS,
    billNo,
    data
});
const fetchProdAbstractByBillNoFailure = (billNo, error) => ({
    type: constant.FETCH_PROD_ABSTRACT_BY_BILL_NO_FAILURE,
    billNo,
    error
});

export const asyncFetchProdAbstractByBillNo = (billNo, callback) => dispatch => {
    dispatch(fetchProdAbstractByBillNoRequest(billNo));
    axios.get(`${BASE_URL}/sale/listSale`, {params: {billNo: billNo}}).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(fetchProdAbstractByBillNoSuccess(billNo, fromJS(res.data.data)));
            if (callback) {
                callback(res.data);
            }
        } else {
            dispatch(fetchProdAbstractByBillNoFailure(billNo, res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchProdAbstractByBillNoFailure(error));
    });
};

//批量审批&反审
export const asyncBatchApproved = ({type, ...params}, callback) => dispatch => {
    // type 0 审批  1 反审
    let uri = (type == 0) ? `${BASE_URL}/sale/approve/list` : `${BASE_URL}/sale/approve/counter/list`;
    axios.post(uri, params).then(function(res) {
        if(res.data){
            callback && callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};
