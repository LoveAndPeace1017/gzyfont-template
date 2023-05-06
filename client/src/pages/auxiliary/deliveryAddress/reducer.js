import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

//获取收支列表
const addressList = (
    state = fromJS({

    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_ADDRESS_LIST_REQUEST:
        return state.setIn([action.incomeType, 'isFetching'], true);
    case constant.FETCH_ADDRESS_LIST_SUCCESS:
        return state.setIn([action.incomeType, 'data'],  action.data);
    case constant.FETCH_ADDRESS_LIST_FAILURE:
        return state.setIn([action.incomeType, 'isFetching'], true);
    default:
        return state
    }
};


//新增/修改提交收支
const addAddress = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.ADD_ADDRESS_REQUEST:
        return state.set('isFetching', true);
    case constant.ADD_ADDRESS_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.ADD_ADDRESS_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    addressList,
    addAddress
})