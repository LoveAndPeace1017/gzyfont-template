import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import withBatchUpdateReducer from 'utils/HOR/reduxBatchUpdateConfig';
// 供应商列表
const supplierList = withBatchUpdateReducer(constant.TYPE,(
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_SUPPLIER_CONFIG_SUCCESS:
        return state.set('config',action.data);
    case constant.SUPPLIER_LIST:
        return state.set('isFetching', true);
    case constant.SUPPLIER_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.SUPPLIER_LIST_FAILURE:
        return state.set('isFetching', false);
    case constant.GET_LOCAL_SUPPLIER_INFO:
        const list = state.getIn(['data','list']);
        let supplier = {};
        list.forEach(item=>{
            if(item.get('id') === action.id){
                supplier = item;
                return
            }
        });
        return state.set('isFetching', false)
            .setIn(['data','supplier'], supplier);
    case constant.SUPPLIER_CONFIRM_FETCHING_TRUE:
        return state.set('confirmFetching', true);
    case constant.SUPPLIER_CONFIRM_FETCHING_FALSE:
        return state.set('confirmFetching', false);
    case constant.FILTER_CONFIG_LIST:
        return state.setIn(['data', 'filterConfigList'], fromJS(action.data));
    default:
        return state
    }
});

const suggestSupplier = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_SUPPLIER_BY_VAL_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_SUPPLIER_BY_VAL_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_SUPPLIER_BY_VAL_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    supplierList,
    suggestSupplier
})