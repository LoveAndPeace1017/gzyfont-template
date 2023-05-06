import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import withBatchUpdateReducer from 'utils/HOR/reduxBatchUpdateConfig';

const inventoryPriceUntaxDetail = withBatchUpdateReducer(constant.TYPE,(
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_REPORT_INVENTORY_PRICE_DETAIL_UN_TAX:
        return state.set('isFetching', true);
    case constant.FETCH_REPORT_INVENTORY_PRICE_DETAIL_UN_TAX_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_REPORT_INVENTORY_PRICE_DETAIL_UN_TAX_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
});

export default combineReducers({
    inventoryPriceUntaxDetail
})