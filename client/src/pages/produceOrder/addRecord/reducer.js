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
const addProduceOrderRecord = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.ADD_PRODUCE_ORDER_RECORD_REQUEST:
            return state.set('isFetching', true);
        case constant.ADD_PRODUCE_ORDER_RECORD_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.ADD_PRODUCE_ORDER_RECORD_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};


export default combineReducers({
    preData,
    addProduceOrderRecord
})