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


//获取消息数量
const noticeCount = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_NOTICE_COUNT_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_NOTICE_COUNT_SUCCESS:
        let newState = state;
        if(state.getIn(['data', 'data']) < action.data.get('data')){
            newState = state.set('countIncreased', true)
        }
        return newState.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_NOTICE_COUNT_FAILURE:
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
                .updateIn(['data', 'data', 'list'], data=>{
                    return data.concat(action.data.getIn(['data', 'list']))
                });
        }
    case constant.FETCH_FRIEND_NOTICE_FAILURE:
        return state.set('isFetching', false);
    case constant.SET_NOTICE_READ_REQUEST:
        if(action.id){
            return state.updateIn(['data', 'data', 'list'], list=>{
                return list.map(item=>{
                    if(item.get('recId') === action.id){
                        return item.set('isFetching', true);
                    }
                    return item;
                })
            });
        }else{
            return state.set('isReadFetching', true)
        }
    case constant.SET_NOTICE_READ_SUCCESS:
        if(action.id){
            return state.updateIn(['data', 'data', 'list'], list=>{
                return list.map(item=>{
                    if(item.get('recId') === action.id){
                        return item.set('isFetching', false)
                            .set('readStatus', 1)
                    }
                    return item;
                })
            });
        }else{
            return state.set('isReadFetching', false)
        }
    case constant.SET_NOTICE_READ_FAILURE:
        if(action.id){
            return state.updateIn(['data', 'data', 'list'], list=>{
                return list.map(item=>{
                    if(item.get('recId') === action.id){
                        return item.set('isFetching', false)
                    }
                    return item;
                })
            });
        }else{
            return state.set('isReadFetching', false)
        }
    default:
        return state
    }
};

export default combineReducers({
    orderNotice,
    noticeCount,
    friendNotice
})

