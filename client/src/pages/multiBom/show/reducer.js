import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";


// 生产Bom详情
const multiBomDetail = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_MULTI_BOM_DETAIL_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_MULTI_BOM_DETAIL_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_MULTI_BOM_DETAIL_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};


export default combineReducers({
    multiBomDetail
})