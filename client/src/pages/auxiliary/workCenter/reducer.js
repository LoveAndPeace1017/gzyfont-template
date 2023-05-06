import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

//获取工作中心列表
const workCenterList = (
    state = fromJS({

    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_WORKCENTER_LIST_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_WORKCENTER_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_WORKCENTER_LIST_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};


//新增/修改工作中心
const addWorkCenter = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.ADD_WORKCENTER_REQUEST:
        return state.set('isFetching', true);
    case constant.ADD_WORKCENTER_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.ADD_WORKCENTER_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    workCenterList,
    addWorkCenter
})