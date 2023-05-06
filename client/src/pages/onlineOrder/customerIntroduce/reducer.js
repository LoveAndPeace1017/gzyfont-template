import {combineReducers} from 'redux-immutable';
import {fromJS} from "immutable";
import * as constant from './actionsTypes';

const onlineOrderCustomerIntroduce = (
    state = fromJS({
        isFetching: false,
        cartAmount: 0
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_ONLINE_ORDER_CUSTOMER_INIT_DATA:
            return state.set('isFetching', true);
        case constant.FETCH_ONLINE_ORDER_CUSTOMER_GET_LIST_DATA_SUCCESS:
            return state.set('isFetching', false)
                .set('listData', action.data.data)
        case constant.FETCH_ONLINE_ORDER_CUSTOMER_GET_COUNT:
            return state.set('cartAmount', action.count);
        default:
            return state;
    }
};

export default combineReducers({
    onlineOrderCustomerIntroduce
});


