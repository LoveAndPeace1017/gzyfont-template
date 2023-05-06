import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

//获取收支列表
const levelApprovedList = (
    state = fromJS({

    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_LEVEL_APPROVED_LIST_REQUEST:
        return state.setIn(['isFetching'], true);
    case constant.FETCH_LEVEL_APPROVED_LIST_SUCCESS:
        return state.setIn(['data'],  action.data);
    case constant.FETCH_LEVEL_APPROVED_LIST_FAILURE:
        return state.setIn(['isFetching'], true);
    default:
        return state
    }
};


//新增/修改提交收支
const addLevelApproved = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.ADD_LEVEL_APPROVED_REQUEST:
        return state.set('isFetching', true);
    case constant.ADD_LEVEL_APPROVED_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.ADD_LEVEL_APPROVED_FAILURE:
        return state.set('isFetching', false);
    case constant.FETCH_LEVEL_APPROVED_LIST_EMPTY:
        return state.set('data', '');
    default:
        return state
    }
};

export default combineReducers({
    levelApprovedList,
    addLevelApproved
})