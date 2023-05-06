import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';

// 配件组合列表
const fittingList = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    let fittingList,newFittingList;
    switch (action.type) {
    case constant.FITTING_LIST:
        return state.set('isFetching', true);
    case constant.FITTING_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FITTING_LIST_FAILURE:
        return state.set('isFetching', false);
    case constant.SET_FITTING_LIST:
        let list = state.getIn(['data','list']);
        list = list.map(item=>{
            if(item.get('key') === action.data.get('key')){
                item = item.set('num',action.data.get('num'));
            }
            return item;
        });
        return state.setIn(['data','list'], list);
    case constant.SET_FITTING_INFO:
        return state.setIn(['data','fitting',action.key], action.data);
    case constant.GET_LOCAL_FITTING_INFO:
        return state.setIn(['data','fitting'], action.data);
    case constant.DEFAULT_FITTING_SUCCESS:
        fittingList = state.getIn(['data','list']);
        newFittingList = fittingList.map(item=>{
            let newItem = item.set('isCommon', item.get('id') === action.id?1:0);
            return newItem;
        });
        return state.setIn(['data','list'], newFittingList);
    case constant.FITTING_CONFIRM_FETCHING_TRUE:
        return state.set('confirmFetching', true);
    case constant.FITTING_CONFIRM_FETCHING_FALSE:
        return state.set('confirmFetching', false);
    default:
        return state
    }
};

// 通过编号查询具体bom组合的信息
const prodCombinationsList = withAsyncReducer(constant.FETCH_PROD_COMBINATIONS_LIST);

//判断是否属于成品 并返回符合的物品编号和数量
const rightBomList = withAsyncReducer(constant.JUDGE_IS_BELONG_BOM);

export default combineReducers({
    fittingList,
    prodCombinationsList,
    rightBomList
})