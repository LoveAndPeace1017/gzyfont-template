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

//新增询价单提交
const addInquiry = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.ADD_INQUIRY_REQUEST:
            return state.set('isFetching', true);
        case constant.ADD_INQUIRY_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.ADD_INQUIRY_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};


//根据询价单id获取询价单信息
const inquiryInfo = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_INQUIRY_BY_ID_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_INQUIRY_BY_ID_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_INQUIRY_BY_ID_FAILURE:
            return state.set('isFetching', false);
        case constant.EMPTY_DETAIL_DATA:
            return state.set('data', '');

        default:
            return state
    }
};


//根据询价单id获取询价单信息
const matchAbizCate = (
    state = fromJS({
        isFetching: false,
        data: {}
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_CATE_BY_NAME_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_CATE_BY_NAME_SUCCESS:
        return state.set('isFetching', false)
            .setIn(['data', action.insertLineKey], action.data);
    case constant.FETCH_CATE_BY_NAME_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};


export default combineReducers({
    preData,
    addInquiry,
    inquiryInfo,
    matchAbizCate
})