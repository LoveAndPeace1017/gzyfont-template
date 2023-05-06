import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";


const defaultNum = 3; //默认展示行数
const initData = [];
let key = defaultNum;

const readOnlyItems = {
    displayBillNoReadOnly: true,
    aggregateAmountReadOnly: true,
    payAmountReadOnly: true
};
for (let i = 0; i < defaultNum; i++) {
    initData.push({
        key: i,
        ...readOnlyItems
    })
}
const ordersInfo = (
    state = fromJS({
        isFetching: false,
        data: fromJS(initData)
    }),
    action
) => {
    switch (action.type) {
    case constant.ADD_GOODS_ITEM:
        return state.update('data', ordersData => {
            let items = [];
            if(action.orders){
                items = action.orders.map(item=>{
                    return fromJS({
                        key: ++key,
                        ope: item.billNo,
                        ...readOnlyItems,
                        ...item
                    })
                })
            }else{
                items = [fromJS({
                    key: ++key, //必须指定唯一的key，不然会有问题的欧,
                    ...readOnlyItems
                })]
            }
            return ordersData.splice(action.index, action.num, ...items);
        });
    case constant.REMOVE_GOODS_ITEM:
        return state.update('data', ordersData => {
            return ordersData.delete(action.index, 1);
        });
    case constant.INIT_GOODS_ITEM:
        return state.set('data', action.data.map(item => {
            return item.set('key', ++key)
                .set('ope', item.get('billNo'))
                .set('displayBillNoReadOnly', true)
                .set('aggregateAmountReadOnly', true)
                .set('payAmountReadOnly', true);
        }));
    case constant.EMPTY_DETAIL_DATA:
        return state.set('data', fromJS(initData));
    default:
        return state
    }
};

export default combineReducers({
    ordersInfo
})