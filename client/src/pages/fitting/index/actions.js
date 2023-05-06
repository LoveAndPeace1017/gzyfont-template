import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";

const setConfirmFetchingTrue = (data) => ({
    type: constant.FITTING_CONFIRM_FETCHING_TRUE,
    data
});
const setConfirmFetchingFalse = (error) => ({
    type: constant.FITTING_CONFIRM_FETCHING_FALSE,
    error
});

/**
 * 获取配件组合列表数据
 **/
const fetchFittingList = () => ({
    type: constant.FITTING_LIST
});
const fetchFittingListSuccess = (data) => ({
    type: constant.FITTING_LIST_SUCCESS,
    data
});
const fetchFittingListFailure = (error) => ({
    type: constant.FITTING_LIST_FAILURE,
    error
});

/**
 * 设置默认配件组合
 **/

const setFittingInfo = (key,data) => ({
    type: constant.SET_FITTING_INFO,
    key,
    data
});
const setFittingNum = (data) => ({
    type: constant.SET_FITTING_LIST,
    data
});


const fetchLocalFittingInfo = (data) => ({
    type: constant.GET_LOCAL_FITTING_INFO,
    data
});


export const asyncFetchFittingList = (params, callback) => dispatch => {
    dispatch(fetchFittingList());
    axios.get(`/api/fitting/list`,{
        params
    }).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(fetchFittingListSuccess(fromJS(res.data)));
            callback&&callback();
        }else{
            dispatch(fetchFittingListFailure(res.data.retMsg));
        }
    }).catch(error => {
        dispatch(fetchFittingListFailure(error));
    });
};



export const getLocalFittingInfo = (params,callback) => dispatch => {
    const {prodNo,option} = params;
    if(option==="add"){
        dispatch(fetchLocalFittingInfo(fromJS({})))
    }else{
        axios.get(`/api/fitting/detail/${prodNo}`, {params: {customerNo: params.customerNo, isSellOutBound: params.isSellOutBound}}).then(function(res) {
            if (res.data && res.data.retCode==0) {
                let data = res.data.data;
                data.finishedProduct = option&&option=="copy"?null:[{
                    key:data.prodNo,
                    prodCustomNo:data.prodCustomNo,
                    prodNo:data.prodNo,
                    prodName:data.prodName,
                    descItem:data.descItem,
                    unit:data.unit,
                    estimatedCost:data.estimatedCost
                }];
                data.subProdList = data.subProdList.map((item,index)=>{
                    return {
                        ...item,
                        key:item.prodNo,
                        serial:index+1
                    }
                });
                dispatch(fetchLocalFittingInfo(fromJS(res.data.data)));
                callback&&callback(res.data.data);
            }else{
                dispatch(fetchFittingListFailure(res.data.retMsg));
                callback&&callback(null);
            }
        }).catch(error => {
            dispatch(fetchFittingListFailure(error));
        });
    }

};

// 通过编号查询具体bom组合的信息
export const asyncFetchProdCombinationsList = (params, callback) =>({
    actionTypePrefix: constant.FETCH_PROD_COMBINATIONS_LIST,
    request: axios.post(`${BASE_URL}/fitting/prodCombinations/list`,{...params}),
    callback
});

//判断是否属于成品 并返回符合的物品编号和数量
export const asyncJudgeIsBelongBom = (params, callback) =>({
    actionTypePrefix: constant.JUDGE_IS_BELONG_BOM,
    request: axios.post(`${BASE_URL}/fitting/prodCombinations/pre`,{...params}),
    callback
});


export const setCurrentFittingInfo = (key,value) => dispatch => {
    dispatch(setFittingInfo(key,fromJS(value)));
};
export const setFittingList = (value) => dispatch => {
    dispatch(setFittingNum(fromJS(value)));
};

/**
 * 修改配件组合信息
 * @param fitting
 * @param callback
 * @returns {Function}
 */
export const asyncModifyFittingInfo = (fitting,callback) => dispatch => {
    dispatch(setConfirmFetchingTrue());
    axios.put(`/api/fitting/modify`,fitting).then(function(res) {
        if (res.data && res.data.retCode==0) {
            dispatch(setConfirmFetchingFalse(fromJS(fitting)))
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
 * 新增配件组合信息
 * @param fitting
 * @param callback
 * @returns {Function}
 */
export const asyncInsertFittingInfo = (fitting, callback) => dispatch => {
    dispatch(setConfirmFetchingTrue());
    axios.post(`/api/fitting/insert`,fitting).then(function(res) {
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

export const asyncDeleteFittingInfo = (id, callback) => dispatch => {
    axios.delete(`/api/fitting/delete/${id}`).then(function(res) {
        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};



