import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

const goodsTableConfig = (
    state = fromJS({
        isFetching: false,
        data: '',
        produceData: '',
        materialData: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.ADD_FIELD_CONFIG:
        if(action.module === 'produce'){
            return state.set('produceData', action.data);
        } else if(action.module === 'material'){
            return state.set('materialData', action.data);
        } else {
            return state.set('data', action.data);
        }
    case constant.UPDATE_FIELD_CONFIG:
        const {index, propName, value} = action.data;
        if(action.module === 'produce'){
            return state.setIn(['produceData', index, propName], value);
        } else if(action.module === 'material'){
            return state.setIn(['materialData', index, propName], value);
        } else {
            return state.setIn(['data', index, propName], value);
        }
    case constant.EMPTY_FIELD_CONFIG:
        return state.set('data', '')
            .set('produceData', '')
            .set('materialData', '');
    default:
        return state
    }
};

export default combineReducers({
    goodsTableConfig
})