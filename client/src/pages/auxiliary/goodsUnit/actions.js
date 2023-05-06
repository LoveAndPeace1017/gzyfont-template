import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';

/**
 * 获取物品单位列表
 **/
const fetchGoodsUnitListRequest = () => ({
    type: constant.FETCH_GOODS_UNIT_LIST_REQUEST
});

const fetchGoodsUnitListSuccess = (data) => ({
    type: constant.FETCH_GOODS_UNIT_LIST_SUCCESS,
    data
});

const fetchGoodsUnitListFailure = (error) => ({
    type: constant.FETCH_GOODS_UNIT_LIST_FAILURE,
    error
});

let hasCache = false;
export const asyncFetchGoodsUnitList = (addCache, callback) => dispatch => {
    const loadData = ()=>{
        dispatch(fetchGoodsUnitListRequest());
        axios.get(`${BASE_URL}/auxiliary/unit/list`).then(function(res) {
            if (res.data) {
                dispatch(fetchGoodsUnitListSuccess(fromJS(res.data)));
                callback && callback(fromJS(res.data));
            }
        }).catch(error => {
            dispatch(fetchGoodsUnitListFailure(error));
        });
    };
    if(addCache){
        if (addCache !== hasCache) {
            loadData();
            hasCache = addCache;
        }
    }else{
        loadData();
    }

};

export const emptyGoodsUnitListCache = () => ()=> {
    hasCache = false;
};

/**
 * 新增/修改/删除物品单位提交
 **/
const addGoodsUnitRequest = () => ({
    type: constant.ADD_GOODS_UNIT_REQUEST
});

const addGoodsUnitSuccess = (data) => ({
    type: constant.ADD_GOODS_UNIT_SUCCESS,
    data
});

const addGoodsUnitFailure = (error) => ({
    type: constant.ADD_GOODS_UNIT_FAILURE,
    error
});

export const asyncAddGoodsUnit = (type, values, callback) => dispatch => {
    dispatch(addGoodsUnitRequest());
    let url = `${BASE_URL}/auxiliary/goodsUnit/oprate/${type}`;
    axios.post(url, values).then(res => {
        dispatch(addGoodsUnitSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addGoodsUnitFailure(error));
    })
};
//
// export const asyncCheckName = (type, name, callback, errorCallback) => dispatch => {
//     axios.get(`${BASE_URL}/auxiliary/${type}/checkName`,{
//         params: {
//             name
//         }
//     }).then(res => {
//         callback && callback(res);
//     }).catch(error => {
//         errorCallback && errorCallback(error)
//     })
// };
