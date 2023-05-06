import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";


const defaultNum = 3; //默认展示行数
const initData = [];
let key = defaultNum;
for (let i = 0; i < defaultNum; i++) {
    initData.push({
        key: i
    })
}
const goodsInfo = (
    state = fromJS({
        isFetching: false,
        data: fromJS(initData)
    }),
    action
) => {
    switch (action.type) {
    case constant.ADD_GOODS_ITEM:
        return state.update('data', goodsData => {
            let items = [];
            if(action.goods){
                items = action.goods.map(item=>{
                    return fromJS({
                        key: ++key,
                        ope: item.productCode,
                        descItemReadOnly: true,
                        unitReadOnly: true,
                        brandReadOnly: true,
                        produceModelReadOnly: true,
                        taxRate: 0,
                        ...action.defaultMap,
                        ...item
                    })
                })
            }else{
                items = [fromJS({
                    ...action.defaultMap,
                    key: ++key //必须指定唯一的key，不然会有问题的欧
                })]
            }
            return goodsData.splice(action.index, action.num, ...items);
        });
    case constant.REMOVE_GOODS_ITEM:
        return state.update('data', goodsData => {
            return goodsData.filter(item=> !action.keys.includes(item.get('key')));
            // return goodsData.delete(action.index, 1);
        });
    case constant.INIT_GOODS_DEFAULT_ITEM:
        return state.update('data', goodsData => {
            let goodsInfo = goodsData.toJS();
            goodsInfo = goodsInfo.map(item=>{
               return {...item, ...action.data}
            });
            return fromJS(goodsInfo);
        });
    case constant.INIT_GOODS_ITEM:
        return state.set('data', action.data.map(item => {
            return item.set('key', ++key)
                .set('ope', item.get('productCode'))
                .set(`descItemReadOnly`, true)
                // .set(`proBarCodeReadOnly`, true)
                .set(`unitReadOnly`, true)
                .set(`brandReadOnly`, true)
                .set(`produceModelReadOnly`, true)
                .set('taxRate', item.get('taxRate')?item.get('taxRate')+'':0); //如果修改页存在税率就设置不存在就设为0
        }));
    case constant.SET_FIELD_READONLY:
        return state.update('data', goodsData => {
            return goodsData.map(goods => {
                if (goods.get('key') === action.key) {
                    return goods.set(`${action.fieldName}ReadOnly`, true);
                }
                return goods;
            })
        });
    case constant.UNSET_FIELD_READONLY:
        return state.update('data', goodsData => {
            return goodsData.map(goods => {
                if (goods.get('key') === action.key) {
                    return goods.set(`${action.fieldName}ReadOnly`, false);
                }
                return goods;
            })
        });
    case constant.FETCH_STOCK_BY_CODE_REQUEST:
        return state.update('data', goodsData => {
            return goodsData.map(goods => {
                if (goods.get('key') === action.key) {
                    return goods.set('stockIsFetching', true)
                }
                return goods;
            })
        });
    case constant.FETCH_STOCK_BY_CODE_SUCCESS:
        return state.update('data', goodsData => {
            return goodsData.map(goods => {
                if (goods.get('key') === action.key) {
                    return goods.set('stockIsFetching', false)
                        .set('stockInfo', action.data);
                }
                return goods;
            })
        });
    case constant.FETCH_STOCK_BY_CODE_FAILURE:
        return state.update('data', goodsData => {
            return goodsData.map(goods => {
                if (goods.get('key') === action.key) {
                    return goods.set('stockIsFetching', false)
                }
                return goods;
            })
        });
    case constant.EMPTY_DETAIL_DATA:
        key = defaultNum;
        return state.set('data', fromJS(initData));
    default:
        return state
    }
};

export default combineReducers({
    goodsInfo
})