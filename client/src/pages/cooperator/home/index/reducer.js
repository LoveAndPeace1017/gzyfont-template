import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

const cooperatorList = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_COOPERATOR_LIST_DETAIL:
            return state.set('isFetching', true);
        case constant.FETCH_COOPERATOR_LIST_SUCCESS:
            console.log(action.data,'data');
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_COOPERATOR_LIST_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

export default combineReducers({
    cooperatorList
})