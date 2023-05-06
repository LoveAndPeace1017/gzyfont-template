import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import withBatchUpdateReducer from 'utils/HOR/reduxBatchUpdateConfig'

//  支出列表
const expendList = withBatchUpdateReducer(constant.TYPE,(
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
    case constant.EXPAND_LIST:
        return state.set('isFetching', true);
    case constant.EXPAND_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.EXPAND_LIST_FAILURE:
        return state.set('isFetching', false);
    case constant.FILTER_CONFIG_LIST:
        return state.setIn(['data', 'filterConfigList'], fromJS(action.data));
    default:
        return state
    }
});

// 支出记录
const expendRecord = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_EXPEND_RECORD_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_EXPEND_RECORD_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_EXPEND_RECORD_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

export default combineReducers({
    expendList,
    expendRecord
})