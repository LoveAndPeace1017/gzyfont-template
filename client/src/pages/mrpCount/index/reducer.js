import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";


// 供应商列表
const mrpCountList = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_MRP_COUNT_LIST_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_MRP_COUNT_LIST_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_MRP_COUNT_LIST_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};


export default combineReducers({
    mrpCountList
})