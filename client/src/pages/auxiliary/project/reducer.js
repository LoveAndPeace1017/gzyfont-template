import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

//获取项目列表
const projectList = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_PROJECT_LIST_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_PROJECT_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_PROJECT_LIST_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

//新增/修改删除提交部门
const addProject = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.ADD_PROJECT_REQUEST:
        return state.set('isFetching', true);
    case constant.ADD_PROJECT_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.ADD_PROJECT_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    projectList,
    addProject
})