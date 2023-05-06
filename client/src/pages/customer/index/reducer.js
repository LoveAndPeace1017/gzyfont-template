import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import withBatchUpdateReducer from 'utils/HOR/reduxBatchUpdateConfig';

// 仓库列表
const customerList = withBatchUpdateReducer(constant.TYPE,(
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_CUSTOMER_CONFIG_SUCCESS:
        return state.set('config',action.data);
    case constant.CUSTOMER_LIST:
        return state.set('isFetching', true);
    case constant.CUSTOMER_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.CUSTOMER_LIST_FAILURE:
        return state.set('isFetching', false);
    case constant.CUSTOMER_APPLY_LIST:
        return state.set('isFetching', true);
    case constant.CUSTOMER_APPLY_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.CUSTOMER_APPLY_LIST_FAILURE:
        return state.set('isFetching', false);
    case constant.GET_LOCAL_CUSTOMER_INFO:
        const list = state.getIn(['data','list']);
        let customer = {};
        list.forEach(item=>{
            if(item.get('id') === action.id){
                customer = item;
                return
            }
        });
        return state.set('isFetching', false)
            .setIn(['data','customer'], customer);
    case constant.CUSTOMER_CONFIRM_FETCHING_TRUE:
        return state.set('confirmFetching', true);
    case constant.CUSTOMER_CONFIRM_FETCHING_FALSE:
        return state.set('confirmFetching', false);
    case constant.FILTER_CONFIG_LIST:
        return state.setIn(['data', 'filterConfigList'], fromJS(action.data));
    default:
        return state
    }
});

const suggestCustomer = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_CUSTOMER_BY_VAL_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_CUSTOMER_BY_VAL_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_CUSTOMER_BY_VAL_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

const customerPriceList = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_CUSTOMER_PRICE_RECORD_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_CUSTOMER_PRICE_RECORD_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_CUSTOMER_PRICE_RECORD_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

export default combineReducers({
    customerList,
    suggestCustomer,
    customerPriceList
})