import {combineReducers} from 'redux-immutable';
import {fromJS} from "immutable";
import * as constant from './actionsTypes';

const onlineOrderAllProdList = (
    state = fromJS({
        isFetching: false,
        cartAmount: 0,
        //-1正常排序，0升序，1降序
        orderByTime: -1,
        orderByPrice: -1
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_ONLINE_ORDER_ALLPROD_LIST_INIT_DATA:
            return state.set('isFetching', true);
        case constant.FETCH_ONLINE_ORDER_ALLPROD_LIST_GET_LIST_DATA_SUCCESS:
            return state.set('isFetching', false)
                .set('orderByTime',action.params.orderByTime)
                .set('orderByPrice',action.params.orderByPrice)
                .set('listData', action.data.data)
        case constant.FETCH_ONLINE_ORDER_ALLPROD_LIST_GET_COUNT:
            return state.set('cartAmount', action.count);
        default:
            return state;
    }
};

export default combineReducers({
    onlineOrderAllProdList
});


