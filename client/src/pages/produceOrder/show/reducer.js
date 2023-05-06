import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';

//根据id获取信息
const produceOrderInfo = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_PRODUCE_ORDER_BY_ID_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_PRODUCE_ORDER_BY_ID_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_PRODUCE_ORDER_BY_ID_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};

const gainMaterialRecord = withAsyncReducer(constant.ASYNC_FETCH_GAIN_MATERIAL_RECORD,  (state, action) => {
    switch (action.type) {
        case constant.FETCH_PROD_ABSTRACT_FOR_GAIN_MATERIAL_RECORD:
            return state.updateIn(['data', 'list'], list => {
                return list.map(item => {
                    if (item.get('billNo') === action.billNo) {
                        return item.set('prodAbstractIsFetching', true)
                    }
                    return item;
                })
            });
        case constant.FETCH_PROD_ABSTRACT_FOR_GAIN_MATERIAL_SUCCESS:
            return state.updateIn(['data', 'list'], list => {
                return list.map(item => {
                    if (item.get('billNo') === action.billNo) {
                        return item.set('prodAbstractIsFetching', false)
                            .set('prodAbstractList', action.data)
                    }
                    return item;
                })
            });
        case constant.FETCH_PROD_ABSTRACT_FOR_GAIN_MATERIAL_FAILURE:
            return state.updateIn(['data', 'list'], list => {
                return list.map(item => {
                    if (item.get('billNo') === action.billNo) {
                        return item.set('prodAbstractIsFetching', false)
                    }
                    return item;
                })
            });
        default:
            return state
    }
});
const quitMaterialRecord = withAsyncReducer(constant.ASYNC_FETCH_QUIT_MATERIAL_RECORD,  (state, action) => {
    switch (action.type) {
        case constant.FETCH_PROD_ABSTRACT_FOR_QUIT_MATERIAL_RECORD:
            return state.updateIn(['data', 'list'], list => {
                return list.map(item => {
                    if (item.get('billNo') === action.billNo) {
                        return item.set('prodAbstractIsFetching', true)
                    }
                    return item;
                })
            });
        case constant.FETCH_PROD_ABSTRACT_FOR_QUIT_MATERIAL_SUCCESS:
            return state.updateIn(['data', 'list'], list => {
                return list.map(item => {
                    if (item.get('billNo') === action.billNo) {
                        return item.set('prodAbstractIsFetching', false)
                            .set('prodAbstractList', action.data)
                    }
                    return item;
                })
            });
        case constant.FETCH_PROD_ABSTRACT_FOR_QUIT_MATERIAL_FAILURE:
            return state.updateIn(['data', 'list'], list => {
                return list.map(item => {
                    if (item.get('billNo') === action.billNo) {
                        return item.set('prodAbstractIsFetching', false)
                    }
                    return item;
                })
            });
        default:
            return state
    }
});
const productInboundRecord = withAsyncReducer(constant.ASYNC_FETCH_PRODUCT_ENTER_RECORD,  (state, action) => {
    switch (action.type) {
        case constant.FETCH_PROD_ABSTRACT_FOR_PRODUCT_INBOUND_RECORD:
            return state.updateIn(['data', 'list'], list => {
                return list.map(item => {
                    if (item.get('billNo') === action.billNo) {
                        return item.set('prodAbstractIsFetching', true)
                    }
                    return item;
                })
            });
        case constant.FETCH_PROD_ABSTRACT_FOR_PRODUCT_INBOUND_SUCCESS:
            return state.updateIn(['data', 'list'], list => {
                return list.map(item => {
                    if (item.get('billNo') === action.billNo) {
                        return item.set('prodAbstractIsFetching', false)
                            .set('prodAbstractList', action.data)
                    }
                    return item;
                })
            });
        case constant.FETCH_PROD_ABSTRACT_FOR_PRODUCT_INBOUND_FAILURE:
            return state.updateIn(['data', 'list'], list => {
                return list.map(item => {
                    if (item.get('billNo') === action.billNo) {
                        return item.set('prodAbstractIsFetching', false)
                    }
                    return item;
                })
            });
        default:
            return state
    }
});
const workSheetRecord = withAsyncReducer(constant.ASYNC_FETCH_WORK_SHEET_RECORD);


export default combineReducers({
    produceOrderInfo,
    gainMaterialRecord,
    quitMaterialRecord,
    productInboundRecord,
    workSheetRecord
})