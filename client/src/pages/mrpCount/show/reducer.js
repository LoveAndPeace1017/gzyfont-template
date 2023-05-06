import {fromJS} from "immutable";
import * as constant from './actionsTypes';
import {RESET_GOODS_INFO} from './actionsTypes';
import {combineReducers} from "redux-immutable";

//获取Mrp详情数据
const mrpContDetail = (
    state = fromJS({

    }),
    action
) => {
    switch (action.type) {
        case constant.Mrp_COUNT_DETAIL_REQUEST:
            return state.setIn([action.mrpType, 'isFetching'], true);
        case constant.Mrp_COUNT_DETAIL_SUCCESS:
            return state.setIn([action.mrpType,'data'],action.data).setIn([action.mrpType, 'isFetching'], false);
        case constant.Mrp_COUNT_DETAIL_FAILURE:
            return state.setIn([action.mrpType, 'isFetching'], true);
        default:
            return state
    }
};

export default combineReducers({
    mrpContDetail
})