import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";


const newCustomFieldList = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_NEW_CUSTOM_FIELD_LIST_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_NEW_CUSTOM_FIELD_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set(action.moduleName,action.data);
    case constant.FETCH_NEW_CUSTOM_FIELD_LIST_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};


//新增/修改提交部门
const addNewCustomField = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.ADD_NEW_CUSTOM_FIELD_REQUEST:
        return state.set('isFetching', true);
    case constant.ADD_NEW_CUSTOM_FIELD_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.ADD_NEW_CUSTOM_FIELD_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    newCustomFieldList,
    addNewCustomField
})