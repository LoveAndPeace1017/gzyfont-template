import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';

//根据工单id获取工单信息
const productControlInfo = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_PRODUCT_CONTROL_BY_ID_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_PRODUCT_CONTROL_BY_ID_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_PRODUCT_CONTROL_BY_ID_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

const workSheetReport = withAsyncReducer(constant.ASYNC_FETCH_WORK_SHEET_REPORT);

const fetchLogInfo = withAsyncReducer(constant.ASYNC_FETCH_OPERATION_LOG_REQUEST);

export default combineReducers({
    productControlInfo,
    workSheetReport,
    fetchLogInfo
})