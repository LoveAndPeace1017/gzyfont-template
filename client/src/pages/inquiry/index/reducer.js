import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

// 询价列表
const inquiryList = (
    state = fromJS({
        isFetching: false,
        data: ""
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_INQUIRY_CONFIG_SUCCESS:
        return state.set('config',action.data);
    case constant.INQUIRY_LIST:
        return state.set('isFetching', true);
    case constant.INQUIRY_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.INQUIRY_LIST_FAILURE:
        return state.set('isFetching', false);
    case constant.GET_LOCAL_INQUIRY_INFO:
        const list = state.getIn(['data','list']);
        let inquiry = {};
        list.forEach(item=>{
            if(item.get('id') === action.id){
                inquiry = item;
                return
            }
        });
        return state.set('isFetching', false)
            .setIn(['data','inquiry'], inquiry);
    case constant.INQUIRY_CONFIRM_FETCHING_TRUE:
        return state.set('confirmFetching', true);
    case constant.INQUIRY_CONFIRM_FETCHING_FALSE:
        return state.set('confirmFetching', false);
    default:
        return state
    }
};

// 报价列表
const quoteList = (
    state = fromJS({
        isFetching: false,
        data: ""
    }),
    action
) => {
    switch (action.type) {
        case constant.QUOTE_LIST:
            return state.set('isFetching', true);
        case constant.QUOTE_LIST_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.QUOTE_LIST_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

const inquiryInfo = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_INQUIRY_DETAIL:
            return state.set('isFetching', true);
        case constant.FETCH_INQUIRY_DETAIL_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_INQUIRY_DETAIL_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

export default combineReducers({
    inquiryList,
    inquiryInfo,
    quoteList
})