import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

//获取收支列表
const approveList = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_APPROVE_LIST_REQUEST:
        return state.set('isFetching', !action.isBackLoading);
    case constant.FETCH_APPROVE_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_APPROVE_LIST_FAILURE:
        return state.set('isFetching', false);
    case constant.TOGGLE_ENABLE_REQUEST:
        return state.updateIn(['data', 'data'], (data)=>{
            return data.map(item=>{
                if(item.get('configValue') === action.key){
                    return item.set('isEnableFetching', true);
                }
                return item;
            })
        });
    case constant.TOGGLE_ENABLE_SUCCESS:
        return state.updateIn(['data', 'data'], (data)=>{
            return data.map(item=>{
                if(item.get('configValue') === action.key){
                    return item.set('isEnableFetching', false);
                }
                return item;
            })
        });
    case constant.TOGGLE_ENABLE_FAILURE:
        return state.updateIn(['data', 'data'], (data)=>{
            return data.map(item=>{
                if(item.get('configValue') === action.key){
                    return item.set('isEnableFetching', false);
                }
                return item;
            })
        });
    case constant.CHECK_APPROVE_REQUEST:
        return state.updateIn(['data', 'data'], (data)=>{
            return data.map(item=>{
                if(item.get('configValue') === action.key){
                    return item.set('isCheckFetching', true);
                }
                return item;
            })
        });
    case constant.CHECK_APPROVE_SUCCESS:
        return state.updateIn(['data', 'data'], (data)=>{
            return data.map(item=>{
                if(item.get('configValue') === action.key){
                    return item.set('isCheckFetching', false);
                }
                return item;
            })
        });
    case constant.CHECK_APPROVE_FAILURE:
        return state.updateIn(['data', 'data'], (data)=>{
            return data.map(item=>{
                if(item.get('configValue') === action.key){
                    return item.set('isCheckFetching', false);
                }
                return item;
            })
        });
    default:
        return state
    }
};

export default combineReducers({
    approveList
})