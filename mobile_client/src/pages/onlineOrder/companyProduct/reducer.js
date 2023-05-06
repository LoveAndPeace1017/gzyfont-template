import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

const onlineOrderCompanyList = (
    state = fromJS({
        isFetching: false
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_ONLINE_ORDER_COMPANY_LIST_DATA_SUCCESS:
            return state.set('isFetching', false)
                .set('listData', action.data.data);
        default:
            return state;
    }
};

export default combineReducers({
    onlineOrderCompanyList
});
