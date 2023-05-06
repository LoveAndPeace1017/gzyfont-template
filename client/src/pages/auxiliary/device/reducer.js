import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";


const deviceManageList = (
    state = fromJS({

    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_DEVICE_MANAGE_LIST_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_DEVICE_MANAGE_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_DEVICE_MANAGE_LIST_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};


const addDeviceManage = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.ADD_DEVICE_MANAGE_REQUEST:
        return state.set('isFetching', true);
    case constant.ADD_DEVICE_MANAGE_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.ADD_DEVICE_MANAGE_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    deviceManageList,
    addDeviceManage
})