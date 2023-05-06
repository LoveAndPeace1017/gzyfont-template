import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

//获取内贸站物品分类
const cnGoodsCateList = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_CN_GOODS_CATE_LIST_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_CN_GOODS_CATE_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_CN_GOODS_CATE_LIST_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    cnGoodsCateList
})