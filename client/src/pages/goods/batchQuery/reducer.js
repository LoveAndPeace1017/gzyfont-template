import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import withBatchUpdateReducer from 'utils/HOR/reduxBatchUpdateConfig';

const batchQuery = withBatchUpdateReducer(constant.TYPE,(
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_REPORT_BATCH_QUERY:
        return state.set('isFetching', true);
    case constant.FETCH_REPORT_BATCH_QUERY_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_REPORT_BATCH_QUERY_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
});


const batchRecordList = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_BATCH_MODIFY_LIST_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_BATCH_MODIFY_LIST_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_BATCH_MODIFY_LIST_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

export default combineReducers({
    batchQuery,
    batchRecordList
})