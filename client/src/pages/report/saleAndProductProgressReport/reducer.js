import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import withBatchUpdateReducer from 'utils/HOR/reduxBatchUpdateConfig';

const saleAndProductDetail = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_SALE_AND_PRODUCT_PROGRESS_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_SALE_AND_PRODUCT_PROGRESS_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_SALE_AND_PRODUCT_PROGRESS_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    saleAndProductDetail
})