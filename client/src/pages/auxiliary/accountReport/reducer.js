import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

//获取报工账号列表
const accountReportList = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_ACCOUNT_REPORT_LIST_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_ACCOUNT_REPORT_LIST_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_ACCOUNT_REPORT_LIST_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};


//新增/修改报工账号
const addAccountReport = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.ADD_ACCOUNT_REPORT_REQUEST:
        return state.set('isFetching', true);
    case constant.ADD_ACCOUNT_REPORT_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.ADD_ACCOUNT_REPORT_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    accountReportList,
    addAccountReport
})