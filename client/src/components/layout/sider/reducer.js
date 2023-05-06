import {TOGGLE} from "./actionsTypes";
import {fromJS} from 'immutable';

const sider = (state = fromJS({}), action) => {
    switch(action.type){
        case TOGGLE:
            return state.update('collapsed', val => !val);
        default:
            return state;
    }
};

export default sider;