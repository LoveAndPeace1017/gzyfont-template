import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';
import withBatchUpdateReducer from 'utils/HOR/reduxBatchUpdateConfig';

// 工单列表
const productControlList = withBatchUpdateReducer(constant.TYPE, (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_PRODUCT_CONTROL_CONFIG_SUCCESS:
            return state.set('config',action.data);
        case constant.FETCH_PRODUCT_CONTROL_LIST_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_PRODUCT_CONTROL_LIST_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_PRODUCT_CONTROL_LIST_FAILURE:
            return state.set('isFetching', false);
        case constant.FILTER_CONFIG_LIST:
            return state.setIn(['data', 'filterConfigList'], fromJS(action.data));
        default:
            return state
    }
});


export default combineReducers({
    productControlList
})