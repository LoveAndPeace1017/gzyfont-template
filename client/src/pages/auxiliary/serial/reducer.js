import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";


//新增/修改提交单据编号
const addSerial = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.ADD_SERIAL_REQUEST:
        return state.set('isFetching', true);
    case constant.ADD_SERIAL_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.ADD_SERIAL_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    addSerial
})