import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

const onlineOrderCartListOrderList = (
    state = fromJS({
        isFetching: false,
        groupData: [],
        listData: [],
        supplierCode: '',
        pagination: {},
        totalCount: 0,
        cartAmount: 0,
        suggestData: []
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_ONLINE_ORDER_CART_LIST_INIT_DATA:
            return state.set('isFetching', true);
        case constant.FETCH_ONLINE_ORDER_CART_LIST_GET_GROUP_DATA_SUCCESS:
            return state.set('isFetching', false)
                .set('groupData', action.data.get('data'))
                .set('totalCount', action.data.get('totalCount'));
        case constant.FETCH_ONLINE_ORDER_CART_LIST_GET_LIST_DATA_SUCCESS:
            return state.set('isFetching', false)
                .set('listData', action.data.get('list'))
                .set('pagination', action.data.get('pagination'));
        case constant.FETCH_ONLINE_ORDER_CART_LIST_GET_COUNT:
            return state.set('totalCount', action.count);
        case constant.FETCH_ONLINE_ORDER_CART_LIST_GET_CART_AMOUNT:
            return state.set('cartAmount', action.amount);
        case constant.FETCH_ONLINE_ORDER_SUGGESTS_BY_KEY_SUCCESS:
            return state.set('isFetching', false)
                .set('suggestData', action.data);
        default:
            return state;
    }
};

export default combineReducers({
    onlineOrderCartListOrderList
});
