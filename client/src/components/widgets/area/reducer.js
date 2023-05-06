import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

// 省市信息
const proviceAndCityInfo = (
    state = fromJS({
        isFetching: false,
        list: []
    }),
    action
) => {
    switch (action.type) {
    case constant.GET_PROVINCE_LIST_SUCCESS:
        return state.set('areaList', action.list);
    case constant.GET_PROVINCE_LIST_FAILURE:
        return state.set('error', action.error);
    case constant.GET_CITY_LIST_SUCCESS:
        return state.set('cityList', action.list);
    case constant.GET_CITY_LIST_FAILURE:
        return state.set('error', action.error);
    default:
        return state
    }
};

export default combineReducers({
    proviceAndCityInfo
})