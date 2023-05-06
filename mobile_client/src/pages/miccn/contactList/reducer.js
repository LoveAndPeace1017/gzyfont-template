import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

const contactList = (
    state = fromJS({
        isFetching: false,
        groupData: [],
        listData: [],
        supplierCode: '',
        pagination: {},
        totalCount: 0,
        cartAmount: 0,
        suggestData: []
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_CONTACT_LIST_SUCCESS:
            return state.set('contactList', action.data)
        default:
            return state;
    }
};

export default combineReducers({
    contactList
});
