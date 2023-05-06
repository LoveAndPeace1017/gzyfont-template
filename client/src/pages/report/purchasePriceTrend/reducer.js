import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import withBatchUpdateReducer from 'utils/HOR/reduxBatchUpdateConfig';

const purchasePriceTrendDetail = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_REPORT_PURCHASE_PRICE_TREND_DETAIL:
        return state.set('isFetching', true);
    case constant.FETCH_REPORT_PURCHASE_PRICE_TREND_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_REPORT_PURCHASE_PRICE_TREND_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    purchasePriceTrendDetail
})