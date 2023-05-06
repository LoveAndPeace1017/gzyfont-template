import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";


const cnGoodsList = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_CN_GOODS_LIST_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_CN_GOODS_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_CN_GOODS_LIST_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

const importCnGoods = (
    state = fromJS({
        isFetching: false,
        data: '',
        percent: 0
    }),
    action
) => {
    switch (action.type) {
    case constant.IMPORT_CN_GOODS_REQUEST:
        return state.set('isFetching', true);
    case constant.IMPORT_CN_GOODS_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.IMPORT_CN_GOODS_FAILURE:
        return state.set('isFetching', false);
    case constant.EMPTY_IMPORT_CN_GOODS:
        return state.set('data', '')
            .set('percent', 0);
    case constant.IMPORT_CN_GOODS_PERCENT:
        return state.set('percent', action.percent);
    default:
        return state
    }
};


export default combineReducers({
    cnGoodsList,
    importCnGoods
})