import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

// 仓库列表
const supplierInfo = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
    case constant.SUPPLIER_DETAIL:
        return state.set('data', action.data);
    case constant.SUPPLIER_INSERT:
        return state.set('isFetching', true);
    case constant.SUPPLIER_INSERT_END:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    supplierInfo
})