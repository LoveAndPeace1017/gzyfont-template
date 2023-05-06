import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

//获取菜单列表
const menuList = (
    state = fromJS({
        isFetching: false,
        data: [],
        menuMap: {}
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_MENU_LIST_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_MENU_LIST_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data)
                .set('menuMap', action.menuMap);
        case constant.FETCH_MENU_LIST_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

export default combineReducers({
    menuList
})