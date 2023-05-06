import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';


/**
 * 销售订单动态
 **/
const fetchSaleOrderRequest = () => ({
    type: constant.FETCH_SALE_ORDER_REQUEST
});

const fetchSaleOrderSuccess = (data) => ({
    type: constant.FETCH_SALE_ORDER_SUCCESS,
    data
});

const fetchSaleOrderFailure = (error) => ({
    type: constant.FETCH_SALE_ORDER_FAILURE,
    error
});

export const asyncFetchSaleOrder = () => dispatch => {
    dispatch(fetchSaleOrderRequest());
    axios.get(`${BASE_URL}/home/saleRecord`).then(function(res) {
        if (res.data) {
            dispatch(fetchSaleOrderSuccess(fromJS(res.data)))
        }
    }).catch(error => {
        dispatch(fetchSaleOrderFailure(error));
    });
};


/**
 * 设置销售订单动态已读
 **/
const setSaleOrderReadRequest = () => ({
    type: constant.SET_SALE_ORDER_READ_REQUEST
});

const setSaleOrderReadSuccess = (recId) => ({
    type: constant.SET_SALE_ORDER_READ_SUCCESS,
    recId
});

const setSaleOrderReadFailure = (error) => ({
    type: constant.SET_SALE_ORDER_READ_FAILURE,
    error
});

export const asyncSetSaleOrderRead = (recId, callback) => dispatch => {
    dispatch(setSaleOrderReadRequest());
    axios.get(`${BASE_URL}/home/record/read/${recId}`).then(function(res) {
        if (res.data && res.data.retCode === '0') {
            dispatch(setSaleOrderReadSuccess(recId))
            callback && callback();
        }else{
            dispatch(setSaleOrderReadFailure(recId));
        }
    }).catch(error => {
        dispatch(setSaleOrderReadFailure(error));
    });
};

/**
 * 采购订单动态
 **/
const fetchPurchaseOrderRequest = () => ({
    type: constant.FETCH_PURCHASE_ORDER_REQUEST
});

const fetchPurchaseOrderSuccess = (data) => ({
    type: constant.FETCH_PURCHASE_ORDER_SUCCESS,
    data
});

const fetchPurchaseOrderFailure = (error) => ({
    type: constant.FETCH_PURCHASE_ORDER_FAILURE,
    error
});

export const asyncFetchPurchaseOrder = () => dispatch => {
    dispatch(fetchPurchaseOrderRequest());
    axios.get(`${BASE_URL}/home/purchaseRecord`).then(function(res) {
        if (res.data) {
            dispatch(fetchPurchaseOrderSuccess(fromJS(res.data)))
        }
    }).catch(error => {
        dispatch(fetchPurchaseOrderFailure(error));
    });
};

/**
 * 设置销售订单动态已读
 **/
const setPurchaseOrderReadRequest = () => ({
    type: constant.SET_PURCHASE_ORDER_READ_REQUEST
});

const setPurchaseOrderReadSuccess = (recId) => ({
    type: constant.SET_PURCHASE_ORDER_READ_SUCCESS,
    recId
});

const setPurchaseOrderReadFailure = (error) => ({
    type: constant.SET_PURCHASE_ORDER_READ_FAILURE,
    error
});

export const asyncSetPurchaseOrderRead = (recId, callback) => dispatch => {
    dispatch(setPurchaseOrderReadRequest());
    axios.get(`${BASE_URL}/home/record/read/${recId}`).then(function(res) {
        if (res.data && res.data.retCode === '0') {
            dispatch(setPurchaseOrderReadSuccess(recId));
            callback && callback();
        }else{
            dispatch(setPurchaseOrderReadFailure(recId));
        }
    }).catch(error => {
        dispatch(setPurchaseOrderReadFailure(error));
    });
};


/**
 * 邀请加好友
 **/
/*const fetchInviteFriendRequest = () => ({
    type: constant.FETCH_INVITE_FRIEND_REQUEST
});

const fetchInviteFriendSuccess = (data) => ({
    type: constant.FETCH_INVITE_FRIEND_SUCCESS,
    data
});

const fetchInviteFriendFailure = (error) => ({
    type: constant.FETCH_INVITE_FRIEND_FAILURE,
    error
});

export const asyncFetchInviteFriend = () => dispatch => {
    dispatch(fetchInviteFriendRequest());
    axios.get(`${BASE_URL}/home/findFriend/order`).then(function(res) {
        if (res.data) {
            dispatch(fetchInviteFriendSuccess(fromJS(res.data)))
        }
    }).catch(error => {
        dispatch(fetchInviteFriendFailure(error));
    });
};*/


export const asyncFetchInviteFriend=()=>({
    actionTypePrefix: constant.FETCH_INVITE_FRIEND,
    request: axios.get(`${BASE_URL}/home/findFriend/order`)
});

/**
 * 通知公告
 **/
/*const fetchNoticeRequest = () => ({
    type: constant.FETCH_NOTICE_REQUEST
});

const fetchNoticeSuccess = (data) => ({
    type: constant.FETCH_NOTICE_SUCCESS,
    data
});

const fetchNoticeFailure = (error) => ({
    type: constant.FETCH_NOTICE_FAILURE,
    error
});

export const asyncFetchNotice = () => dispatch => {
    dispatch(fetchNoticeRequest());
    axios.get(`${BASE_URL}/home/ads/2`).then(function(res) {
        if (res.data) {
            dispatch(fetchNoticeSuccess(fromJS(res.data)))
        }
    }).catch(error => {
        dispatch(fetchNoticeFailure(error));
    });
};*/

export const asyncFetchNotice=()=>({
    actionTypePrefix: constant.FETCH_NOTICE,
    request: axios.get(`${BASE_URL}/home/ads/2`)
});

/**
 * 采购支出统计
 **/
const fetchOrderRequest = () => ({
    type: constant.FETCH_ORDER_REQUEST
});

const fetchOrderSuccess = (data) => ({
    type: constant.FETCH_ORDER_SUCCESS,
    data
});

const fetchOrderFailure = (error) => ({
    type: constant.FETCH_ORDER_FAILURE,
    error
});

export const asyncFetchOrder = (timeType = 'month') => dispatch => {
    dispatch(fetchOrderRequest());
    axios.get(`${BASE_URL}/home/purchases/pay/${timeType}`).then(function(res) {
        if (res.data) {
            dispatch(fetchOrderSuccess(fromJS(res.data)))
        }
    }).catch(error => {
        dispatch(fetchOrderFailure(error));
    });
};

/**
 * 销售收入统计
 **/
const fetchSaleRequest = () => ({
    type: constant.FETCH_SALE_REQUEST
});

const fetchSaleSuccess = (data) => ({
    type: constant.FETCH_SALE_SUCCESS,
    data
});

const fetchSaleFailure = (error) => ({
    type: constant.FETCH_SALE_FAILURE,
    error
});

export const asyncFetchSale = (timeType = 'month') => dispatch => {
    dispatch(fetchSaleRequest());
    axios.get(`${BASE_URL}/home/sales/revenue/${timeType}`).then(function(res) {
        if (res.data) {
            dispatch(fetchSaleSuccess(fromJS(res.data)))
        }
    }).catch(error => {
        dispatch(fetchSaleFailure(error));
    });
};

/**
 * 库存数据
 **/
/*const fetchStoreGoodsRequest = () => ({
    type: constant.FETCH_STORE_GOODS_REQUEST
});

const fetchStoreGoodsSuccess = (data) => ({
    type: constant.FETCH_STORE_GOODS_SUCCESS,
    data
});

const fetchStoreGoodsFailure = (error) => ({
    type: constant.FETCH_STORE_GOODS_FAILURE,
    error
});

export const asyncFetchStoreGoods = () => dispatch => {
    dispatch(fetchStoreGoodsRequest());
    axios.get(`${BASE_URL}/home/prodCount`).then(function(res) {
        if (res.data) {
            dispatch(fetchStoreGoodsSuccess(fromJS(res.data)))
        }
    }).catch(error => {
        dispatch(fetchStoreGoodsFailure(error));
    });
};

const fetchStoreDistributionGoodsRequest = () => ({
    type: constant.FETCH_STORE_DISTRIBUTION_GOODS_REQUEST
});

const fetchStoreDistributionGoodsSuccess = (data) => ({
    type: constant.FETCH_STORE_DISTRIBUTION_GOODS_SUCCESS,
    data
});

const fetchStoreDistributionGoodsFailure = (error) => ({
    type: constant.FETCH_STORE_DISTRIBUTION_GOODS_FAILURE,
    error
});

export const asyncFetchStoreDistributionGoods = () => dispatch => {
    dispatch(fetchStoreDistributionGoodsRequest());
    axios.get(`${BASE_URL}/home/distribution/prodCount`).then(function(res) {
        if (res.data) {
            dispatch(fetchStoreDistributionGoodsSuccess(fromJS(res.data)))
        }
    }).catch(error => {
        dispatch(fetchStoreDistributionGoodsFailure(error));
    });
};*/

//获取待审批单据
const fetchPendingApprovalRequest = (isBackLoading) => ({
    type: constant.FETCH_PENDING_APPROVAL_REQUEST,
    isBackLoading
});

const fetchPendingApprovalSuccess = (data) => ({
    type: constant.FETCH_PENDING_APPROVAL_SUCCESS,
    data
});

const fetchPendingApprovalFailure = (error) => ({
    type: constant.FETCH_PENDING_APPROVAL_FAILURE,
    error
});

export const asyncFetchPendingApproval = (isBackLoading=false) => dispatch => {
    dispatch(fetchPendingApprovalRequest(isBackLoading));
    axios.get(`${BASE_URL}/home/approval`).then(function(res) {
        if (res.data) {
            dispatch(fetchPendingApprovalSuccess(fromJS(res.data)))
        }
    }).catch(error => {
        dispatch(fetchPendingApprovalFailure(error));
    });
};


//获取当前模块的单据数量是否达到上限
export const asyncCheckModuleHasArriveUpperLimit=(module, callback)=>({
    actionTypePrefix: constant.FETCH_CHECK_MODULE_HAS_ARRIVE_UPPER_LIMIT,
    request: axios.get(`${BASE_URL}/common/checkModuleHasArriveUpperLimit`,  {
        params: {
            module
        }
    }),
    callback
});

//获得本月或本日的销售简报
export const asyncFetchSaleKit = (params, callback) => dispatch => {
    axios.get(`${BASE_URL}/home/saleKit`,{params}).then(function(res) {
        if (res.data) {
            callback && callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};

//获得vip日期数据
export const asyncFetchVipData = (callback) => dispatch => {
    axios.get(`${BASE_URL}/home/vipDate`).then(function(res) {
        if (res.data) {
            callback && callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};

//获取首页批次物品信息
export const asyncFetchHomeBatchData = (callback,params) => dispatch => {
    axios.post(`${BASE_URL}/batchQuery/home/batchnumber`,params).then(function(res) {
        console.log(res,'batchData');
        if (res.data) {
            callback && callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};

// 获取提醒列表数据
export const asyncFetchTipList = (params, callback) => dispatch => {
    axios.get(`${BASE_URL}/home/tip/list`, {params}).then(function(res) {
        if (res.data) {
            callback && callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};



// 忽略操作
export const asyncIgnore = (params, callback) => dispatch => {
    axios.post(`${BASE_URL}/home/tip/ignore`,params).then(function(res) {
        if (res.data) {
            callback && callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};
