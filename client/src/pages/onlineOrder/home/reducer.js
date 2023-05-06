import {combineReducers} from 'redux-immutable';
import {fromJS} from "immutable";
import * as constant from './actionsTypes';

const onlineOrderHomeListOrderList = (
    state = fromJS({
        isFetching: false,
        cartAmount: 0
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_ONLINE_ORDER_HOME_LIST_INIT_DATA:
            return state.set('isFetching', true);
        case constant.FETCH_ONLINE_ORDER_HOME_LIST_GET_LIST_DATA_SUCCESS:
            return state.set('isFetching', false)
                .set('listData', action.data)
        case constant.FETCH_ONLINE_ORDER_HOME_LIST_GET_COUNT:
            return state.set('cartAmount', action.count);
        default:
            return state;
    }
};

export default combineReducers({
    onlineOrderHomeListOrderList
});


