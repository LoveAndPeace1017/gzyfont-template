import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";


const workProcedureList = (
    state = fromJS({

    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_WORKPROCEDURE_LIST_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_WORKPROCEDURE_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_WORKPROCEDURE_LIST_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};


const addWorkProcedure = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.ADD_WORKPROCEDURE_REQUEST:
        return state.set('isFetching', true);
    case constant.ADD_WORKPROCEDURE_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.ADD_WORKPROCEDURE_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    workProcedureList,
    addWorkProcedure
})