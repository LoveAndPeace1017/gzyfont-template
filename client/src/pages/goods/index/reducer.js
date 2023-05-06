import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import withBatchUpdateReducer from 'utils/HOR/reduxBatchUpdateConfig';

// 物品列表
const goodsList = withBatchUpdateReducer(constant.TYPE, (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_GOODS_CONFIG_SUCCESS:
        return state.set('config',action.data);
    case constant.GOODS_LIST:
        return state.set('isFetching', true);
    case constant.GOODS_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.GOODS_LIST_FAILURE:
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
    case constant.GET_LOCAL_GOODS_INFO:
        const list = state.getIn(['data','list']);
        let goods = {};
        list.forEach(item=>{
            if(item.get('id') === action.id){
                goods = item;
                return
            }
        });
        return state.set('isFetching', false)
            .setIn(['data','goods'], goods);
    case constant.GOODS_CONFIRM_FETCHING_TRUE:
        return state.set('confirmFetching', true);
    case constant.GOODS_CONFIRM_FETCHING_FALSE:
        return state.set('confirmFetching', false);
    case constant.FILTER_CONFIG_LIST:
        return state.setIn(['data', 'filterConfigList'], fromJS(action.data));
    default:
        return state
    }
});
// 物品列表-弹层
const goodsPopList = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
    case constant.POP_GOODS_LIST:
        return state.set('isFetching', true);
    case constant.POP_GOODS_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.POP_GOODS_LIST_FAILURE:
        return state.set('isFetching', false);
    case constant.POP_FETCH_WARE_BY_CODE_REQUEST:
        return state.updateIn(['data', 'list'], list=>{
            return list.map(item=>{
                if(item.get('code') === action.code){
                    return item.set('wareIsFetching', true)
                }
                return item;
            })
        });
    case constant.POP_FETCH_WARE_BY_CODE_SUCCESS:
        return state.updateIn(['data', 'list'], list=>{
            return list.map(item=>{
                if(item.get('code') === action.code){
                    return item.set('wareIsFetching', false)
                        .set('wareList', action.data)
                }
                return item;
            })
        });
    case constant.POP_FETCH_WARE_BY_CODE_FAILURE:
        return state.updateIn(['data', 'list'], list=>{
            return list.map(item=>{
                if(item.get('code') === action.code){
                    return item.set('wareIsFetching', false)
                }
                return item;
            })
        });
    case constant.SET_GOODS_LIST_FOR_BOM:
        return state.updateIn(['data', 'list'], list =>{
            return list.map(item=>{
                if(item.get('code') === action.data.code){
                    return item.set('bomCode', action.data.bomCode)
                        .set('level', action.data.level)
                        .set('quantity', action.data.quantity);
                }
                return item;
            });
            return item;
        });
    default:
        return state
    }
};

// 新增销售价格
const addSalePrice = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
    case constant.ADD_SALE_PRICE_REQUEST:
        return state.set('isFetching', true);
    case constant.ADD_SALE_PRICE_SUCCESS:
        return state.set('isFetching', false);
    case constant.ADD_SALE_PRICE_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    goodsList,
    goodsPopList,
    addSalePrice
})