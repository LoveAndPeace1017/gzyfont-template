import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";


//根据收入id获取收入记录信息
const incomeInfo = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_INCOME_BY_ID_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_INCOME_BY_ID_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_INCOME_BY_ID_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

//新增财务收入记录提交
const addIncome = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.ADD_INCOME_REQUEST:
            return state.set('isFetching', true);
        case constant.ADD_INCOME_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.ADD_INCOME_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

export default combineReducers({
    addIncome,
    incomeInfo
})