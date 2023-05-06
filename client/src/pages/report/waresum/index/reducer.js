import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import withBatchUpdateReducer from 'utils/HOR/reduxBatchUpdateConfig';

const wareSummary = withBatchUpdateReducer(constant.TYPE,(
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_REPORT_WARE_SUMMARY:
        return state.set('isFetching', true);
    case constant.FETCH_REPORT_WARE_SUMMARY_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_REPORT_WARE_SUMMARY_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
});

export default combineReducers({
    wareSummary
})