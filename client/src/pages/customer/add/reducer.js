import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

// 仓库列表
const customerInfo = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
    case constant.CUSTOMER_DETAIL:
        return state.set('data', action.data);
    case constant.CUSTOMER_INSERT:
        return state.set('isFetching', true);
    case constant.CUSTOMER_INSERT_END:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    customerInfo
})