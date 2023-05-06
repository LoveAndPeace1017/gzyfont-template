import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";


const tbOffsetTop = (
    state = fromJS({
        offsetTop: 0
    }),
    action
) => {
    switch (action.type) {
    case constant.SET_TB_OFFSET_TOP:
        return state.set('offsetTop', action.top);
    default:
        return state
    }
};

export default combineReducers({
    tbOffsetTop
})