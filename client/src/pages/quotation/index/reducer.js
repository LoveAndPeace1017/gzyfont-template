import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import withBatchUpdateReducer from 'utils/HOR/reduxBatchUpdateConfig';

// 物品列表
const quotationList = withBatchUpdateReducer(constant.TYPE,(
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_QUOTATION_CONFIG_SUCCESS:
        return state.set('config',action.data);
    case constant.QUOTATION_LIST:
        return state.set('isFetching', true);
    case constant.QUOTATION_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.QUOTATION_LIST_FAILURE:
        return state.set('isFetching', false);
    case constant.FETCH_WARE_BY_CODE_REQUEST:
        return state.updateIn(['data', 'list'], list=>{
            return list.map(item=>{
                if(item.get('code') === action.code){
                    return item.set('wareIsFetching', true)
                }
                return item;
            })
        });
    case constant.FETCH_WARE_BY_CODE_SUCCESS:
        return state.updateIn(['data', 'list'], list=>{
            return list.map(item=>{
                if(item.get('code') === action.code){
                    return item.set('wareIsFetching', false)
                        .set('wareList', action.data)
                }
                return item;
            })
        });
    case constant.FETCH_WARE_BY_CODE_FAILURE:
        return state.updateIn(['data', 'list'], list=>{
            return list.map(item=>{
                if(item.get('code') === action.code){
                    return item.set('wareIsFetching', false)
                }
                return item;
            })
        });
    case constant.FETCH_PROD_ABSTRACT_BY_BILL_NO_REQUEST:
        return state.updateIn(['data', 'list'], list => {
            return list.map(item => {
                if (item.get('billNo') === action.billNo) {
                    return item.set('prodAbstractIsFetching', true)
                }
                return item;
            })
        });
    case constant.FETCH_PROD_ABSTRACT_BY_BILL_NO_SUCCESS:
        return state.updateIn(['data', 'list'], list => {
            return list.map(item => {
                if (item.get('billNo') === action.billNo) {
                    return item.set('prodAbstractIsFetching', false)
                        .set('prodAbstractList', action.data)
                }
                return item;
            })
        });
    case constant.FETCH_PROD_ABSTRACT_BY_BILL_NO_FAILURE:
        return state.updateIn(['data', 'list'], list => {
            return list.map(item => {
                if (item.get('billNo') === action.billNo) {
                    return item.set('prodAbstractIsFetching', false)
                }
                return item;
            })
        });
    case constant.GET_LOCAL_QUOTATION_INFO:
        const list = state.getIn(['data','list']);
        let sale = {};
        list.forEach(item=>{
            if(item.get('id') === action.id){
                sale = item;
                return
            }
        });
        return state.set('isFetching', false)
            .setIn(['data','sale'], sale);
    case constant.QUOTATION_CONFIRM_FETCHING_TRUE:
        return state.set('confirmFetching', true);
    case constant.QUOTATION_CONFIRM_FETCHING_FALSE:
        return state.set('confirmFetching', false);
    case constant.QUOTATION_UPDATE_CONFIG_FIELD_NAME:
        let {fieldName,propName1,value1,type1} = action.data;
        return state.updateIn(['data',type1],(list)=>{
            return list.map(item=>{
                if(item.get('fieldName') === fieldName){
                    return item.set(propName1, value1);
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
    quotationList
})