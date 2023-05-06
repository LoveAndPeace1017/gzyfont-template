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

//新增报价单提交
const addQuotation = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.ADD_QUOTATION_REQUEST:
            return state.set('isFetching', true);
        case constant.ADD_QUOTATION_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.ADD_QUOTATION_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};


//根据报价单id获取销售单信息
const quotationInfo = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_QUOTATION_BY_ID_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_QUOTATION_BY_ID_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_QUOTATION_BY_ID_FAILURE:
            return state.set('isFetching', false);
        case constant.EMPTY_DETAIL_DATA:
            return state.set('data', '');

        case constant.REQUEST_BIND_PRODUCT:
        case constant.REQUEST_BIND_PRODUCT_SUCCESS:
        case constant.REQUEST_BIND_PRODUCT_FAILED:
            return state.updateIn(['data', 'data', 'prodList'], prodList=>{
                return prodList.map(item=>{
                    if (item.get('customerProductCode') === action.data.customerProdNo) {
                        return item.set('isFetching', constant.REQUEST_BIND_PRODUCT === action.type)
                    }
                    return item;
                })
            });
        case constant.UPDATE_BIND_PRODUCT_INFO:
            return state.updateIn(['data', 'data', 'prodList'], prodList=>{
                return prodList.map(item=>{
                    if (item.get('customerProductCode') === action.data.customerProdNo) {
                        return item.set('productCode', action.data.prodNo)
                    }
                    return item;
                })
            });

        default:
            return state
    }
};

//获取操作日志
const fetchLogInfo = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.ASYNC_FETCH_OPERATION_LOG_REQUEST:
            return state.set('isFetching', true);
        case constant.ASYNC_FETCH_OPERATION_LOG_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.ASYNC_FETCH_OPERATION_LOG_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

export default combineReducers({
    preData,
    addQuotation,
    quotationInfo,
    fetchLogInfo
})