import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";


//获取页面初始数据
const preData = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_PRE_DATA_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_PRE_DATA_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_PRE_DATA_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

//获取商城设置信息
const settingInfo = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_SETTING_INFO_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_SETTING_INFO_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_SETTING_INFO_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

//设置商城提交
const editMall = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_EDIT_MALL_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_EDIT_MALL_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_EDIT_MALL_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};


//开通小程序商城
const openAppletsMall = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_OPEN_APPLETS_MALL_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_OPEN_APPLETS_MALL_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_OPEN_APPLETS_MALL_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

//开通小程序商城
const recordGuideShow = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.RECORD_GUIDE_SHOW_REQUEST:
        return state.set('isFetching', true);
    case constant.RECORD_GUIDE_SHOW_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.RECORD_GUIDE_SHOW_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};


export default combineReducers({
    preData,
    settingInfo,
    editMall,
    openAppletsMall,
    recordGuideShow
})