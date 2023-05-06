import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';

import {asyncBaseBatchUpdateConfig} from 'utils/baseAction';


const setConfirmFetchingTrue = (data) => ({
    type: constant.GOODS_CONFIRM_FETCHING_TRUE,
    data
});
const setConfirmFetchingFalse = (error) => ({
    type: constant.GOODS_CONFIRM_FETCHING_FALSE,
    error
});

const fetchConfigSuccess = (data) => ({
    type: constant.FETCH_GOODS_CONFIG_SUCCESS,
    data
});

export const asyncFetchConfig = (callback) => dispatch => {
    axios.get(`api/goods/config/`).then(function (res) {
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
    axios.get(`${BASE_URL}/goods/listStatistics/`).then(function (res) {
        callback(res.data);
    }).catch(error => {
        callback({
            retCode: 1,
            retMsg: error
        });
    });
};


/**
 * 获取物品列表数据
 **/
const fetchGoodsList = () => ({
    type: constant.GOODS_LIST
});
const fetchGoodsListSuccess = (data) => ({
    type: constant.GOODS_LIST_SUCCESS,
    data
});
const fetchGoodsListFailure = (error) => ({
    type: constant.GOODS_LIST_FAILURE,
    error
});

const fetchPopGoodsList = () => ({
    type: constant.POP_GOODS_LIST
});
const fetchPopGoodsListSuccess = (data) => ({
    type: constant.POP_GOODS_LIST_SUCCESS,
    data
});
const fetchPopGoodsListFailure = (error) => ({
    type: constant.POP_GOODS_LIST_FAILURE,
    error
});
/**
 * 获取客户列表
 * @param params
 * @returns {Function}
 */
export const asyncFetchGoodsList = (params, callback) => dispatch => {
    if (params.scene && params.scene == "pop") {
        dispatch(fetchPopGoodsList());
    }else{
        dispatch(fetchGoodsList());
    }
    if (!params) {
        params = {};
    }
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    axios.get(`${BASE_URL}/goods/list`, {
        params: {
            page: 1,
            // perPage: 3,
            ...params
        }
    }).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            if (params.scene && params.scene == "pop") {
                dispatch(fetchPopGoodsListSuccess(fromJS(res.data)));
            } else {
                dispatch(fetchGoodsListSuccess(fromJS(res.data)));
            }
            if (callback) {
                callback(res.data);
            }
        } else {
            if (params.scene && params.scene == "pop") {
                dispatch(fetchPopGoodsListFailure(res.data.retMsg));
            }else{
                dispatch(fetchGoodsListFailure(res.data.retMsg));
            }

        }
    }).catch(error => {
        if (params.scene && params.scene == "pop") {
            dispatch(fetchPopGoodsListFailure(error));
        }else{
            dispatch(fetchGoodsListFailure(error));
        }

    });
};

export const setGoodsListForBom = (data) => ({
    type: constant.SET_GOODS_LIST_FOR_BOM,
    data
});

// 列表返回带回初始化数据
const filterConfigListSuccess = (data) => ({
    type: constant.FILTER_CONFIG_LIST,
    data
});

export const dealFilterConfigList = (data) => dispatch => {
    dispatch(filterConfigListSuccess(data))
};

const fetchLocalGoodsInfo = (id) => ({
    type: constant.GET_LOCAL_GOODS_INFO,
    id
});

export const getLocalGoodsInfo = (id) => dispatch => {
    dispatch(fetchLocalGoodsInfo(id))
};

/**
 * 修改物品信息
 * @param goods
 * @param callback
 * @returns {Function}
 */
export const asyncModifyGoodsInfo = (goods, callback) => dispatch => {
    dispatch(setConfirmFetchingTrue());
    axios.put(`${BASE_URL}/goods/modify`, goods).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(setConfirmFetchingFalse(fromJS(goods)))
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
 * 新增物品信息
 * @param goods
 * @param callback
 * @returns {Function}
 */
export const asyncInsertGoodsInfo = (goods, callback) => dispatch => {
    dispatch(setConfirmFetchingTrue());
    axios.post(`${BASE_URL}/goods/insert`, goods).then(function (res) {
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

export const asyncDeleteGoodsInfo = (ids, callback) => dispatch => {
    axios.post(`${BASE_URL}/goods/delete`, {
        ids
    }).then(function (res) {
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};
export const asyncToggleGoodsInfo = (ids, disableFlag, callback) => dispatch => {
    let url = disableFlag ? `${BASE_URL}/goods/status/enable` : `${BASE_URL}/goods/status/hideAndDisableDistribute`;
    axios.post(url, {
        ids
    }).then(function (res) {
        if (callback) {
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

export const asyncUpdateConfig = (type, fieldName, propName, index, value) => dispatch => {
    dispatch(updateConfig({
        type, fieldName, propName, index, value
    }));
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
export const asyncFetchWareByCode = (code, callback) => dispatch => {
    dispatch(fetchWareByCodeRequest(code));
    axios.get(`${BASE_URL}/goods/${code}/inventories`).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(fetchWareByCodeSuccess(code, fromJS(res.data.data)));
            if (callback) {
                callback(res.data);
            }
        } else {
            dispatch(fetchWareByCodeFailure(code, res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchWareByCodeFailure(error));
    });
};

/**
 * 物品弹层根据物品code获取物品仓库数量
 **/
const popFetchWareByCodeRequest = (code) => ({
    type: constant.POP_FETCH_WARE_BY_CODE_REQUEST,
    code
});
const popFetchWareByCodeSuccess = (code, data) => ({
    type: constant.POP_FETCH_WARE_BY_CODE_SUCCESS,
    code,
    data
});
const popFetchWareByCodeFailure = (code, error) => ({
    type: constant.POP_FETCH_WARE_BY_CODE_FAILURE,
    code,
    error
});

export const asyncPopFetchWareByCode = (code, callback) => dispatch => {
    dispatch(popFetchWareByCodeRequest(code));
    axios.get(`${BASE_URL}/goods/${code}/inventories`).then(function (res) {
        if (res.data && res.data.retCode == 0) {
            dispatch(popFetchWareByCodeSuccess(code, fromJS(res.data.data)));
            if (callback) {
                callback(res.data);
            }
        } else {
            dispatch(popFetchWareByCodeFailure(code, res.data.retMsg));
        }
    }).catch(error => {
        dispatch(popFetchWareByCodeFailure(error));
    });
};

/**
 * 设置分销物品
 * @param ids
 * @param callback
 * @returns {Function}
 */
export const asyncSetDistribute = (ids, optionFlag, callback) => dispatch => {
    axios.post(`${BASE_URL}/goods/setDistribute`, {
        ids,
        optionFlag
    }).then(function (res) {
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};


/**
 * 新增销售价
 **/
const addSalePriceRequest = () => ({
    type: constant.ADD_SALE_PRICE_REQUEST,
});
const addSalePriceSuccess = () => ({
    type: constant.ADD_SALE_PRICE_SUCCESS,
});
const addSalePriceFailure = (error) => ({
    type: constant.ADD_SALE_PRICE_FAILURE,
    error
});
export const asyncAddSalePrice = (arr, callback) => dispatch => {
    dispatch(addSalePriceRequest());
    axios.post(`${BASE_URL}/goods/addPrice`,{
        list:arr
    }).then(function (res) {
        dispatch(addSalePriceSuccess());
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        dispatch(addSalePriceFailure(error));
    });
};



/**
 * 扫码录单（根据物品条码获取物品信息）
 **/
export const fetchBarcodeRequest = () => ({
    type: constant.FETCH_BARCODE_REQUEST
});

export const fetchBarcodeSuccess = (data) => ({
    type: constant.FETCH_BARCODE_SUCCESS,
    data
});

export const fetchBarcodeFailure = (error) => ({
    type: constant.FETCH_BARCODE_FAILURE,
    error
});

export const asyncFetchBarcode = (barCode, callback) => dispatch => {
    dispatch(fetchBarcodeRequest());
    axios.get(`${BASE_URL}/goods/scan/${barCode}`).then(function(res) {
        if (res.data) {
            dispatch(fetchBarcodeSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchBarcodeFailure(error));
    });
};