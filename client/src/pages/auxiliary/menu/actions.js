import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {fromJS} from 'immutable';

/**
 * 获取菜单列表
 **/
const fetchMenuListRequest = (isBackLoading) => ({
    type: constant.FETCH_MENU_LIST_REQUEST,
    isBackLoading
});

const fetchMenuListSuccess = (data, menuMap) => ({
    type: constant.FETCH_MENU_LIST_SUCCESS,
    data,
    menuMap
});

const fetchMenuListFailure = (error) => ({
    type: constant.FETCH_MENU_LIST_FAILURE,
    error
});
/**
 * 获取菜单列表
 **/
export const asyncFetchMenuList = (callback) => dispatch => {
    dispatch(fetchMenuListRequest());
    axios.get(`${BASE_URL}/auxiliary/menu/lists`).then(function(res) {
        let data = res.data.data;
        let menuMap = {};
        data && data.forEach((item) => {
            let status = (item.status === 1) ? true : false;
            menuMap[item.configValue] = status;
        });
        dispatch(fetchMenuListSuccess(fromJS(data), fromJS(menuMap)));
        callback && callback(res.data);
    }).catch(error => {
        dispatch(fetchMenuListFailure(error));
        alert(error);
    });
};

/**
 *  更新菜单配置
 **/
export const asyncUpdateMenu = (menuList, callback) => dispatch => {
    axios.post(`${BASE_URL}/auxiliary/menu/lists`,{
        json: menuList
    }).then(res => {
        callback && callback(res.data);
    }).catch(error => {
        alert(error);
    })
};






