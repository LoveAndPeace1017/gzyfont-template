import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";


//获取员工列表
const employeeList = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_EMPLOYEE_LIST_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_EMPLOYEE_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_EMPLOYEE_LIST_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

//新增/修改提交员工
const addEmployee = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
    case constant.ADD_EMPLOYEE_REQUEST:
        return state.set('isFetching', true);
    case constant.ADD_EMPLOYEE_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.ADD_EMPLOYEE_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    employeeList,
    addEmployee
})