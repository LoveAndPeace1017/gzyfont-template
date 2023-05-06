import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";


//获取页面初始数据
const preData = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_PRE_DATA_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_PRE_DATA_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_PRE_DATA_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

//新增生产单提交
const addProduceOrder = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.ADD_PRODUCE_ORDER_REQUEST:
            return state.set('isFetching', true);
        case constant.ADD_PRODUCE_ORDER_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.ADD_PRODUCE_ORDER_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};


//根据工单id获取生产单信息
const produceOrderInfo = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_PRODUCE_ORDER_BY_ID_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_PRODUCE_ORDER_BY_ID_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_PRODUCE_ORDER_BY_ID_FAILURE:
            return state.set('isFetching', false);
        case constant.EMPTY_DETAIL_DATA:
            return state.set('data', '');
        default:
            return state
    }
};

// 新建生产单-选择销售物品
const saleOrderPopList = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_SALE_ORDER_POP_LIST_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_SALE_ORDER_POP_LIST_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_SALE_ORDER_POP_LIST_FAILURE:
            return state.set('isFetching', false);
        case constant.SET_SALE_ORDER_POP:
            let list = state.getIn(['data','list']);
            list = list.map(item=>{
                if(item.get('key') === action.data.key){
                    item = item.set('bomCode', action.data.bomCode)
                        .set('level', action.data.level)
                        .set('quantity', action.data.quantity);
                }
                return item;
            });
            return state.setIn(['data','list'], list);
        default:
            return state
    }
};


export default combineReducers({
    preData,
    addProduceOrder,
    produceOrderInfo,
    saleOrderPopList
})