import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";


//根据委外加工单id获取信息
const subcontractInfo = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_SUBCONTRACT_DETAIL_BY_ID_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_SUBCONTRACT_DETAIL_BY_ID_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_SUBCONTRACT_DETAIL_BY_ID_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

export default combineReducers({
    subcontractInfo
})