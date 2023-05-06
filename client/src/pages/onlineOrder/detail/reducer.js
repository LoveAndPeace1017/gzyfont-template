import {fromJS} from "immutable";

import {combineReducers} from "redux-immutable";
import * as constant from "./actionsTypes";

const onlineOrderListDetail = (
    state = fromJS({
        dataSource : []
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_LIST_BY_ID_REQUEST:
            return state.set('dataSource', action.data);
        default:
            return state;
    }
};

export default onlineOrderListDetail;