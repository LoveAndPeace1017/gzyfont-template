import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";


//获取部门人员下拉数据
const deptEmployee = (
    state = fromJS({
        isFetching: false,
        data: '',
        employeeList: [],
        deptId: '',
        employeeId: '',
        department: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_DEPT_EMP_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_DEPT_EMP_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_DEPT_EMP_FAILURE:
        return state.set('isFetching', false);
    case constant.GET_EMPLOYEES_BY_DEPT_ID:
        const resList = state.getIn(['data', 'data']);
        const newResList = resList.filter(item => {
            return item.get('deptId') == action.deptId
        });
        const employeeList = newResList.getIn([0, 'employeeList']);
        const employeeId = employeeList.getIn([0, 'id']);
        return state.set('deptId', action.deptId)
            .set('employeeId', employeeId)
            .set('employeeList', employeeList);
    case constant.GET_EMPLOYEES_BY_DEPT_ID_TYPE1:
        const resList1 = state.getIn(['data', 'data']);
        const newResList1 = resList1.filter(item => {
            return item.get('deptId') == action.deptId
        });
        const employeeList1 = newResList1.getIn([0, 'employeeList']);
        return state.set('deptId', action.deptId)
            .set('employeeId', action.employeeId)
            .set('employeeList', employeeList1);
    case constant.GET_DEPT_AND_EMPLOYEES_BY_EMPLOYEE_ID:
        const resList2 = state.getIn(['data', 'data']);

        const newResList2 = resList2.filter(item => {
            let isCur = false;
            const employeeList = item.get('employeeList');
            employeeList && employeeList.forEach(val => {
                if (val.get('id') === action.employeeId) {
                    isCur = true;
                    return false;
                }
            });
            return isCur;
        });
        const deptId = newResList2.getIn([0, 'deptId']);
        const department = newResList2.getIn([0, 'deptName']);
        const newEmployeeList = newResList2.getIn([0, 'employeeList']);
        return state.set('deptId', deptId)
            .set('department', department)
            .set('employeeId', action.employeeId)
            .set('employeeList', newEmployeeList);
    case constant.EMPTY_DEPT_EMPLOYEE:
        return state.set('deptId', '')
            .set('employeeId', '')
            .set('data', []);
    default:
        return state
    }
};

//获取部门列表
const deptList = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_DEPT_LIST_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_DEPT_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_DEPT_LIST_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};


//新增/修改提交部门
const addDept = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.ADD_DEPT_REQUEST:
        return state.set('isFetching', true);
    case constant.ADD_DEPT_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.ADD_DEPT_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    deptEmployee,
    deptList,
    addDept
})