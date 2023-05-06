import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

//获取收支列表
const rateList = (
    state = fromJS({

    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_RATE_LIST_REQUEST:
        return state.setIn([action.incomeType, 'isFetching'], true);
    case constant.FETCH_RATE_LIST_SUCCESS:
        //console.log('succe', action.incomeType, action.data);
        return state.setIn([action.incomeType, 'data'],  action.data).
                updateIn([action.incomeType, 'defaultValue'],  ()=>{
                    let commonItem = action.data.get('data').filter((item)=> {
                        return item.get('isCommon')===1;
                    });
                    console.log(commonItem.getIn([0, 'paramName']), 'asdasd');
                    return commonItem.getIn([0, 'paramName']) || 0;
                });
    case constant.FETCH_RATE_LIST_FAILURE:
        return state.setIn([action.incomeType, 'isFetching'], true);
    default:
        return state
    }
};


//新增/修改提交收支
const addRate = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.ADD_RATE_REQUEST:
        return state.set('isFetching', true);
    case constant.ADD_RATE_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.ADD_RATE_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    rateList,
    addRate
})