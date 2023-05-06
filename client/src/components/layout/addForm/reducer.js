//新增物品提交
import {fromJS} from "immutable";
import * as constant from "./actionsTypes";

const addForm = (
    state = fromJS({
        fieldsChanged: false,
        initFinished: false
    }),
    action
) => {
    switch (action.type) {
    case constant.FIELD_CHANGE:
        return state.set('fieldsChanged', true);
    case constant.EMPTY_FIELD_CHANGE:
        return state.set('fieldsChanged', false);
    case constant.SET_INIT_FINISHED:
        return state.set('initFinished', true);
    case constant.RESET_INIT_FINISHED:
        return state.set('initFinished', false);
    default:
        return state
    }
};

export default addForm;