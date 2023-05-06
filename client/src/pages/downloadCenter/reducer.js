import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

//获取下载中心列表
const downloadCenterList = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_DOWNLOAD_CENTER_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_DOWNLOAD_CENTER_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_DOWNLOAD_CENTER_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};


export default combineReducers({
    downloadCenterList
})