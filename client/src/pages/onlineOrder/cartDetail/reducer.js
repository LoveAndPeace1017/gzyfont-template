import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

const onlineOrderCartDetailList = (
    state = fromJS({
        isFetching: false,
        prodList: [],
        supplier: []
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_ONLINE_ORDER_CART_DETAIL_INIT_CART_DATA:
            return state.set('isFetching', true);
        case constant.FETCH_ONLINE_ORDER_CART_DETAIL_GET_DATA_SUCCESS:
            return state.set('isFetching', false)
                .set('prodList', action.data.get('data'))
                .set('supplier', action.data.get('supplier'))
                .set('companyInfor', action.data.get('dataMallConfigBo'))
                .set('count',action.data.get('count'));
        default:
            return state;
    }
};

export default combineReducers({
    onlineOrderCartDetailList
})