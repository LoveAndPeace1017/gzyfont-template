import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";


// 供应商列表
const multiBomList = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_MULTI_BOM_LIST_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_MULTI_BOM_LIST_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_MULTI_BOM_LIST_FAILURE:
            return state.set('isFetching', false);
        case constant.SET_MULTI_BOM_QUANTITY:
            let list = state.getIn(['data','list']);
            list = list.map(item=>{
                if(item.get('key') === action.data.get('key')){
                    item = item.set('quantity',action.data.get('quantity'));
                }
                return item;
            });
            return state.setIn(['data','list'], list);
        case constant.SET_MULTI_BOM_LEVEL:
            let newList = state.getIn(['data','list']);
            newList = newList.map(item=>{
                if(item.get('key') === action.data.get('key')){
                    item = item.set('level',action.data.get('level'));
                }
                return item;
            });
            return state.setIn(['data','list'], newList);
        default:
            return state
    }
};


export default combineReducers({
    multiBomList
})