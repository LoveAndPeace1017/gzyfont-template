import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

//获取百卓所有类目列表
const abizAllCate = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_ABIZ_ALL_CATE_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_ABIZ_ALL_CATE_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_ABIZ_ALL_CATE_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    abizAllCate
})