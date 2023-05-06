import axios from 'utils/axios';
import * as constant from "./actionsTypes";
import {fromJS} from "immutable";

export const asyncResetConfig = (type, callback) => dispatch => {
    axios.post(`/api/common/field/default`, {
        type
    }).then(function (res) {
        if (res.data.retCode === '0') {
            callback()
        } else {
            alert(res.data.retMsg);
        }
    }).catch(error => {
        alert(error);
    });
};

export const asyncAddFriend = (params, callback) => dispatch => {
    axios.post(`/api/common/addFriend`, params).then(function (res) {
        callback(res.data);
    }).catch(error => {
        alert(error);
    });
};

const fetchComInfo = () => ({
    type: constant.FETCH_ACCOUT_INFO
});

const fetchComInfoSuccess = (data) => ({
    type: constant.FETCH_ACCOUT_INFO_SUCCESS,
    data
});

const fetchComInfoFailure = (error) => ({
    type: constant.FETCH_ACCOUT_INFO_FAILURE,
    error
});

export let comInfoPromise;
export const asyncGetComInfo = (callback) => dispatch => {
    dispatch(fetchComInfo());
    comInfoPromise = new Promise((resolve, reject) => {
        axios.get(`/api/common/comInfo`).then(function (res) {
            dispatch(fetchComInfoSuccess(fromJS(res.data)));
            callback && callback(res.data);
            resolve(res.data);
        }).catch(error => {
            dispatch(fetchComInfoFailure());
            reject();
        });
    });
    return comInfoPromise;
    /*axios.get(`/api/common/comInfo`).then(function(res) {
        dispatch(fetchComInfoSuccess(fromJS(res.data)));
        callback&&callback(res.data);
    }).catch(error => {
        dispatch(fetchComInfoFailure);
        alert(error);
    });*/
};

export const asyncGetAppLoginQrCode = (callback) => dispatch => {
    axios.get(`/api/common/getAppQrcode`).then(function (res) {
        callback(res.data);
    }).catch(error => {
        alert(error);
    });
};

export const asyncInintInfor = () => dispatch => {
    //初始化数据
    axios.get(`/api/common/inintInfor`).then(function (res) {

    }).catch(error => {
        alert(error);
    });
};

export const asyncSwitchAccount = (changeUserIdEnc, callback) => dispatch => {
    axios.get(`/login/changeAccount`, {
        params: {
            changeUserIdEnc
        }
    }).then(function (res) {
        callback(res.data);
    }).catch(error => {
        alert(error);
    });
};

export const asyncBatchUpdateConfig = (arr, callback) => dispatch => {
    axios.post(`/api/common/field/edit`, {
        voList: arr
    }).then(function (res) {
        callback && callback();
    }).catch(error => {
        alert(error);
    });
};

export const asyncPostFeedback = (feedback, callback) => dispatch => {
    axios.post(`/api/common/feedback`, feedback)
        .then(function (res) {
            callback && callback(res.data);
        })
        .catch(error => {
            alert(error);
        });
};

export const asyncCompleteComInfo = (params, callback) => dispatch => {

    dispatch(fetchComInfo());
    axios.post(`${BASE_URL}/common/completeComInfo`,params).then(function(res) {
        if (res.data) {
            // 只是为了置loading的状态，并非失败
            dispatch(fetchComInfoFailure({}));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchComInfoFailure(error));
    });
};

//是否显示首页引导
export const asyncShowIndexLeader = (params,callback) => dispatch => {
    axios.post(`${BASE_URL}/common/showIndexleader`,params).then(function(res) {
            callback && callback(res);
    }).catch(error => {
        alert(error)
    });
};

//显示出现弹层，及更新弹层点击状态
export const isPopShow = (params,callback) => dispatch => {
    axios.get(`${BASE_URL}/common/isPopShow`,{params}).then(function(res) {
        callback && callback(res);
    }).catch(error => {
        alert(error)
    });
};


const fetchOnlineMallSuccess = (data) => ({
    type: constant.FETCH_ONLINE_MALL_SUCCESS,
    data
});
//获取vip在线商城状态
export const asyncFetchOnlineMall = (callback) => dispatch => {
    axios.get(`${BASE_URL}/common/onlineMall`).then(function(res) {
        dispatch(fetchOnlineMallSuccess(fromJS(res.data)));
        callback && callback(res.data);
    }).catch(error => {
        alert(error)
    });
};

//获取列表页初始化筛选数据
const fetchInitListConditionSuccess = (data) => ({
    type: constant.FETCH_INIT_LIST_CONDITION_SUCCESS,
    data
});

export const asyncFetchInitListCondition = (params) => dispatch => {
    dispatch(fetchInitListConditionSuccess(params))
};

//获取当前类型连续新建状态
export const asyncFetchGetContinueCreate = (config,callback) => dispatch => {
    axios.post(`${BASE_URL}/common/get/continueCreate`,{config}).then(function(res) {
        callback && callback(res.data);
    }).catch(error => {
        alert(error)
    });
};

//设置当前类型连续新建状态
export const asyncFetchSetContinueCreate = (config,state,callback) => dispatch => {
    axios.post(`${BASE_URL}/common/set/continueCreate`,{config,state}).then(function(res) {
        callback && callback(res.data);
    }).catch(error => {
        alert(error)
    });
};


// 获取当前账号部门员工
export const asyncFetchAccountRelation = (params, callback) => dispatch => {
    axios.get(`${BASE_URL}/common/account/relation`).then(function(res) {
        callback && callback(res.data);
    }).catch(error => {
        alert(error)
    });
};

//更新打印状态
export const asyncUpdatePrintStatus = (billNo,callback) => dispatch => {
    axios.get(`${BASE_URL}/common/printStatus`, {
        params: {
            billNo
        }
    }).then(function (res) {
        callback && callback(res.data);
    }).catch(error => {
        alert(error);
    });
};

// 获取发送短信提醒操作日志
export const asyncFetchMessageRecommendLog =(params, callback)=>({
    actionTypePrefix: constant.ASYNC_FETCH_MESSAGE_RECOMMEND_LOG,
    request: axios.get(`${BASE_URL}/common/sms_notify`, {params}),
    callback
});

// 发送短信提醒
export const asyncMessageRecommend =(params, callback)=>({
    actionTypePrefix: constant.ASYNC_MESSAGE_RECOMMEND,
    request: axios.post(`${BASE_URL}/common/sms_notify`, params),
    callback
});