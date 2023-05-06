import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

const onlineOrderCartList = (
    state = fromJS({
        isFetching: false,
        validProdList: [],
        invalidProdList: []
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_ONLINE_ORDER_CART_INIT_CART_LIST:
            return state.set('isFetching', true);
        case constant.FETCH_ONLINE_ORDER_CART_GET_INVALID_DATA_SUCCESS:
            return state.set('isFetching', false)
                .set('validProdList', action.data.get('groups'))
                .set('invalidProdList', action.data.get('disabled'));
        case constant.FETCH_ONLINE_ORDER_CART_CLICK_ONE_LIST:
            var newState = state.updateIn(['validProdList', action.comIndex, 'items', action.prodIndex, 'flag'], function (item) {
                return !item;
            })
            return newState
                .updateIn(['validProdList', action.comIndex, 'chooseAllFlag'], function (item) {
                    let choseCount = 0,
                        totalCount = newState.getIn(['validProdList', action.comIndex, 'items']).count();
                    newState.getIn(['validProdList', action.comIndex, 'items']).map((item) => item.get('flag') && choseCount++);

                    item = (choseCount === 0) ? 1 :
                        (choseCount === totalCount) ? 2 : 3;
                    return item;
                })
        case constant.FETCH_ONLINE_ORDER_CART_CLICK_All_LIST:
            let chooseAllFlag = state.getIn(['validProdList', action.comIndex, 'chooseAllFlag']),newState;

            if(chooseAllFlag !== 2){
                newState = state.setIn(['validProdList', action.comIndex, 'chooseAllFlag'], 2)
                    .updateIn(['validProdList', action.comIndex, 'items'], function (item) {
                        return item.map((itemList) => itemList.set('flag', true));
                    })
            } else {
                newState = state.setIn(['validProdList', action.comIndex, 'chooseAllFlag'], 1)
                    .updateIn(['validProdList', action.comIndex, 'items'], function (item) {
                        return item.map((itemList) => itemList.set('flag', false));
                    })
            }
            return newState;
        case constant.FETCH_ONLINE_ORDER_CART_CLICK_TOTAL_LIST:
            var newState,chooseAllCount = 0;

            state.get('validProdList').map((item) => item.get('chooseAllFlag') === 2 && chooseAllCount++);

            if(chooseAllCount === state.get('validProdList').count()){
                newState = state.update('validProdList', function (validProdList) {
                    return validProdList.map((itemList) =>{
                        return itemList.set('chooseAllFlag', 1)
                            .update('items', items=>{
                                return items.map(item=>{
                                    return item.set('flag', false)
                                })
                            })
                    });
                });
            } else {
                newState = state.update('validProdList', function (validProdList) {
                    return validProdList.map((itemList) =>{
                        return itemList.set('chooseAllFlag', 2)
                            .update('items', items=>{
                                return items.map(item=>{
                                    return item.set('flag', true)
                                })
                            })
                    });
                })
            }
            return newState;
        case constant.FETCH_ONLINE_ORDER_CART_CHANGE_AMOUNT:
            return state.setIn(['validProdList', action.comIndex, 'items', action.prodIndex, 'quantity'], action.val);
        default:
            return state;
    }
};

export default combineReducers({
    onlineOrderCartList
})