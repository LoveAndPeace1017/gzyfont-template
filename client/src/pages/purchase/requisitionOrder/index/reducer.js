import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';
import withBatchUpdateReducer from 'utils/HOR/reduxBatchUpdateConfig';

// 请购单列表
const requisitionOrderList = withBatchUpdateReducer(constant.TYPE, (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_REQUISITION_ORDER_CONFIG_SUCCESS:
            return state.set('config',action.data);
        case constant.FETCH_REQUISITION_ORDER_LIST_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_REQUISITION_ORDER_LIST_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_REQUISITION_ORDER_LIST_FAILURE:
            return state.set('isFetching', false);
        case constant.FETCH_PROD_ABSTRACT_BY_BILL_REQUEST:
            return state.updateIn(['data', 'list'], list => {
                return list.map(item => {
                    if (item.get('billNo') === action.billNo) {
                        return item.set('prodAbstractIsFetching', true)
                    }
                    return item;
                })
            });
        case constant.FETCH_PROD_ABSTRACT_BY_BILL_SUCCESS:
            return state.updateIn(['data', 'list'], list => {
                return list.map(item => {
                    if (item.get('billNo') === action.billNo) {
                        return item.set('prodAbstractIsFetching', false)
                            .set('prodAbstractList', action.data)
                    }
                    return item;
                })
            });
        case constant.FETCH_PROD_ABSTRACT_BY_BILL_FAILURE:
            return state.updateIn(['data', 'list'], list => {
                return list.map(item => {
                    if (item.get('billNo') === action.billNo) {
                        return item.set('prodAbstractIsFetching', false)
                    }
                    return item;
                })
            });
        case constant.FILTER_CONFIG_LIST:
            return state.setIn(['data', 'filterConfigList'], fromJS(action.data));
        default:
            return state
    }
});


export default combineReducers({
    requisitionOrderList
})