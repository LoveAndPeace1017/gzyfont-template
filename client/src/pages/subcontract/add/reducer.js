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

//新增委外加工单提交
const addSubcontract = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.ADD_SUBCONTRACT_REQUEST:
            return state.set('isFetching', true);
        case constant.ADD_SUBCONTRACT_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.ADD_SUBCONTRACT_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};


//根据委外加工单id获取委外加工单信息
const subcontractInfo = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_SUBCONTRACT_BY_ID_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_SUBCONTRACT_BY_ID_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_SUBCONTRACT_BY_ID_FAILURE:
            return state.set('isFetching', false);
        case constant.EMPTY_DETAIL_DATA:
            return state.set('data', '');
        default:
            return state
    }
};



export default combineReducers({
    preData,
    addSubcontract,
    subcontractInfo
})