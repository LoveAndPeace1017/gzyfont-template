import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import withBatchUpdateReducer from 'utils/HOR/reduxBatchUpdateConfig';

// 获取销售记录列表
const saleTraceList = withBatchUpdateReducer(constant.TYPE,(
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
    case constant.TRACE_SALE_LIST:
        return state.set('isFetching', true);
    case constant.TRACE_SALE_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.TRACE_SALE_LIST_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
});


export default combineReducers({
    saleTraceList
})