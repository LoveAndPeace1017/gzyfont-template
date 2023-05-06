import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import withBatchUpdateReducer from 'utils/HOR/reduxBatchUpdateConfig';

const workChartDetail = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_WORK_ORDER_CHART_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_WORK_ORDER_CHART_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_WORK_ORDER_CHART_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    workChartDetail
})