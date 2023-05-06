import {combineReducers} from 'redux-immutable';
import {fromJS} from "immutable";
import * as constant from './actionsTypes';

//订单通知
const orderNotice = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_ORDER_NOTICE_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_ORDER_NOTICE_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_ORDER_NOTICE_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

//好友通知
const friendNotice = (
    state = fromJS({
        isFetching: false,
        data: {
            data:[]
        }
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_FRIEND_NOTICE_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_FRIEND_NOTICE_SUCCESS:
        if(action.page === 1){
            return state.set('isFetching', false)
                .set('data', action.data);
        }else{
            return state.set('isFetching', false)
                .updateIn(['data', 'data'], data=>{
                    return data.concat(action.data.get('data'))
                });
        }
    case constant.FETCH_FRIEND_NOTICE_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    orderNotice,
    friendNotice
})

