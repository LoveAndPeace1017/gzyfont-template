import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

// 联系记录列表
const contactRecordList = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    let contactRecordList,newContactRecordList;
    switch (action.type) {
    case constant.CONTACT_RECORD_LIST:
        return state.set('isFetching', true);
    case constant.CONTACT_RECORD_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.CONTACT_RECORD_LIST_FAILURE:
        return state.set('isFetching', false);
    case constant.GET_LOCAL_CONTACT_RECORD_INFO:
        const list = state.getIn(['data','list']);
        let contactRecord = {};
        list.forEach(item=>{
            if(item.get('id') === action.id){
                contactRecord = item;
                return
            }
        });
        return state.set('isFetching', false)
            .setIn(['data','contactRecord'], contactRecord);
    case constant.DEFAULT_CONTACT_RECORD_SUCCESS:
        contactRecordList = state.getIn(['data','list']);
        newContactRecordList = contactRecordList.map(item=>{
            let newItem = item.set('isCommon', item.get('id') === action.id?1:0);
            return newItem;
        });
        return state.setIn(['data','list'], newContactRecordList);
    case constant.CONTACT_RECORD_CONFIRM_FETCHING_TRUE:
        return state.set('confirmFetching', true);
    case constant.CONTACT_RECORD_CONFIRM_FETCHING_FALSE:
        return state.set('confirmFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    contactRecordList
})