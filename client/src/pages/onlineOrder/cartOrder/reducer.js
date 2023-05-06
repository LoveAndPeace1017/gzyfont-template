import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

const onlineOrderCartOrderList = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_ONLINE_ORDER_CART_GET_DETAIL_DATA:
            return state.set('isFetching', true);
        case constant.FETCH_ONLINE_ORDER_CART_DETAIL_GET_DATA_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_ONLINE_ORDER_CART_DETAIL_GET_DATA_FAILURE:
            return state.set('isFetching', false);
        default:
            return state;
    }
};

export default combineReducers({
    onlineOrderCartOrderList
})