import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

// 仓库列表
const warehouseList = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    let warehouseList,newWarehouseList;
    switch (action.type) {
    case constant.WAREHOUSE_LIST:
        return state.set('isFetching', true);
    case constant.WAREHOUSE_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.WAREHOUSE_LIST_FAILURE:
        return state.set('isFetching', false);
    case constant.GET_LOCAL_WAREHOUSE_INFO:
        const list = state.getIn(['data','list']);
        let warehouse = {};
        list.forEach(item=>{
            if(item.get('id') === action.id){
                warehouse = item;
                return
            }
        });
        return state.set('isFetching', false)
            .setIn(['data','warehouse'], warehouse);
    case constant.DEFAULT_WAREHOUSE_SUCCESS:
        warehouseList = state.getIn(['data','list']);
        newWarehouseList = warehouseList.map(item=>{
            let newItem = item.set('isCommon', item.get('id') === action.id?1:0);
            return newItem;
        });
        return state.setIn(['data','list'], newWarehouseList);
    case constant.WAREHOUSE_CONFIRM_FETCHING_TRUE:
        return state.set('confirmFetching', true);
    case constant.WAREHOUSE_CONFIRM_FETCHING_FALSE:
        return state.set('confirmFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    warehouseList
})