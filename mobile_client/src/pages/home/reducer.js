import {combineReducers} from 'redux-immutable';
import {fromJS} from "immutable";
import * as constant from './actionsTypes';

//销售订单动态
const saleOrder = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_SALE_ORDER_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_SALE_ORDER_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_SALE_ORDER_FAILURE:
        return state.set('isFetching', false);
    case constant.SET_SALE_ORDER_READ_REQUEST:
        return state.updateIn(['data', 'data'], data=>{
            return data.map(item=>{
                if(item.get('recId') === action.recId){
                    return item.set('setReadIsFetching', true)
                }
                return item;
            })
        });
    case constant.SET_SALE_ORDER_READ_SUCCESS:
        return state.updateIn(['data', 'data'], data=>{
            return data.map(item=>{
                if(item.get('recId') === action.recId){
                    return item.set('setReadIsFetching', false)
                        .set('isRead', true)
                }
                return item;
            })
        });
    case constant.SET_SALE_ORDER_READ_FAILURE:
        return state.updateIn(['data', 'data'], data=>{
            return data.map(item=>{
                if(item.get('recId') === action.recId){
                    return item.set('setReadIsFetching', false)
                }
                return item;
            })
        });
    default:
        return state
    }
};

//采购订单动态
const purchaseOrder = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_PURCHASE_ORDER_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_PURCHASE_ORDER_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_PURCHASE_ORDER_FAILURE:
        return state.set('isFetching', false);
    case constant.SET_PURCHASE_ORDER_READ_REQUEST:
        return state.updateIn(['data', 'data'], data=>{
            return data.map(item=>{
                if(item.get('recId') === action.recId){
                    return item.set('setReadIsFetching', true)
                }
                return item;
            })
        });
    case constant.SET_PURCHASE_ORDER_READ_SUCCESS:
        return state.updateIn(['data', 'data'], data=>{
            return data.map(item=>{
                if(item.get('recId') === action.recId){
                    return item.set('setReadIsFetching', false)
                        .set('isRead', true)
                }
                return item;
            })
        });
    case constant.SET_PURCHASE_ORDER_READ_FAILURE:
        return state.updateIn(['data', 'data'], data=>{
            return data.map(item=>{
                if(item.get('recId') === action.recId){
                    return item.set('setReadIsFetching', false)
                }
                return item;
            })
        });
    default:
        return state
    }
};


//邀请加好友
const inviteFriend = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_INVITE_FRIEND_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_INVITE_FRIEND_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_INVITE_FRIEND_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

//通知公告
const notice = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_NOTICE_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_NOTICE_SUCCESS:
        return state.set('isFetching', false)
               .set('data', action.data);
    case constant.FETCH_NOTICE_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

//采购支出统计
const orderStatistics = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_ORDER_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_ORDER_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_ORDER_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

//采购支出统计
const saleStatistics = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_SALE_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_SALE_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_SALE_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

//物品数据
const storeGoods = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_STORE_GOODS_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_STORE_GOODS_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_STORE_GOODS_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

//分销物品数据
const storeDistributionGoods = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_STORE_DISTRIBUTION_GOODS_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_STORE_DISTRIBUTION_GOODS_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_STORE_DISTRIBUTION_GOODS_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    saleOrder,
    purchaseOrder,
    inviteFriend,
    notice,
    orderStatistics,
    saleStatistics,
    storeGoods,
    storeDistributionGoods
})

