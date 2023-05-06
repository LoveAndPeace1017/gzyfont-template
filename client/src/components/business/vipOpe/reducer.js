import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

//开通商城
const openMall = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_OPEN_MALL_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_OPEN_MALL_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_OPEN_MALL_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};


export default combineReducers({
    openMall
})