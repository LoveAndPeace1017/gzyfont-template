import {fromJS} from "immutable";
import * as constant from '../add/actionsTypes';
import {RESET_GOODS_INFO} from './actionsTypes';
import {combineReducers} from "redux-immutable";

//根据物品id获取物品信息
const goodsInfo = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_GOODS_BY_ID_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_GOODS_BY_ID_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_GOODS_BY_ID_FAILURE:
            return state.set('isFetching', false);
        case RESET_GOODS_INFO:
            return state.set('isFetching', false)
                .set('data', '');
        default:
            return state
    }
};

export default combineReducers({
    goodsInfo
})