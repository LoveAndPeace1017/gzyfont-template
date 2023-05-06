import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

const onlineOrderNewList = (
    state = fromJS({
        isFetching: false
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_NEW_ONLINE_ORDER_CART_LIST_GET_LIST_DATA_SUCCESS:
            return state.set('isFetching', false)
                .set('listData', action.data);
        case constant.FETCH_MOBILE_CART_NUM:
            return state.set('cartAmount', action.count);
        default:
            return state;
    }
};

export default combineReducers({
    onlineOrderNewList
});
