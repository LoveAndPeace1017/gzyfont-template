import {combineReducers} from 'redux-immutable';
import {fromJS} from "immutable";
import * as constant from './actionsTypes';

//销售订单动态
const vipService = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_VIP_SERVICE_SUCCESS:
            return state.set('vipData', action.data);
        default:
            return state;
    }
};

export default combineReducers({
    vipService
});

