import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

const onlineOrderCompanyInfor = (
    state = fromJS({
        isFetching: false
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_ONLINE_ORDER_CUSTOMER_DATA_SUCCESS:
            return state.set('isFetching', false)
                .set('listData', action.data);
        default:
            return state;
    }
};

export default combineReducers({
    onlineOrderCompanyInfor
});
