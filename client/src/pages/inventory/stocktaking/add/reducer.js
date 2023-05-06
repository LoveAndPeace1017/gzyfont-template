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

//新增销售单提交
const addStocktaking = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.ADD_STOCKTAKING_REQUEST:
        return state.set('isFetching', true);
    case constant.ADD_STOCKTAKING_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.ADD_STOCKTAKING_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};


//根据销售单id获取销售单信息
const stocktakingInfo = (
    state = fromJS({
        isFetching: false,
        data: '',
        copyFlag: false
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_STOCKTAKING_BY_ID_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_STOCKTAKING_BY_ID_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_STOCKTAKING_BY_ID_FAILURE:
        return state.set('isFetching', false);
    case constant.MODIFY_STOCKTAKING_PROD_DATA:
        return state.setIn(['data', 'data', 'prodList'], fromJS(action.data))
            .set('copyFlag', true);
    case constant.EMPTY_DETAIL_DATA:
        return state.set('data', '')
            .set('copyFlag', false);
    default:
        return state
    }
};


//取消销售订单
const cancelStocktaking = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.CANCEL_STOCKTAKING_REQUEST:
        return state.set('isFetching', true);
    case constant.CANCEL_STOCKTAKING_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.CANCEL_STOCKTAKING_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};



export default combineReducers({
    preData,
    addStocktaking,
    stocktakingInfo,
    cancelStocktaking
})