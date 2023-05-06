import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";


const groupList = (
    state = fromJS({
        supply: {
            isFetching: false,
            data: ''
        },
        custom: {
            isFetching: false,
            data: ''
        }
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_GROUP_LIST_REQUEST:
        return state.setIn([action.groupType, 'isFetching'], true);
    case constant.FETCH_GROUP_LIST_SUCCESS:
        return state.setIn([action.groupType, 'data'],  action.data);
    case constant.FETCH_GROUP_LIST_FAILURE:
        return state.setIn([action.groupType, 'isFetching'], true);
    default:
        return state
    }
};


//新增/修改提交收支
const addGroup = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.ADD_GROUP_REQUEST:
        return state.set('isFetching', true);
    case constant.ADD_GROUP_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.ADD_GROUP_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    groupList,
    addGroup
})