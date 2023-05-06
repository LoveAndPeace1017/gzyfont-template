import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";

//子账号列表
const subAccountList = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_SUB_ACCOUNT_LIST_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_SUB_ACCOUNT_LIST_SUCCESS:
        const initSubAccountListData = action.data.getIn(['data', 'subAccountDetails']);
        const selectedRowKeys = [];
        initSubAccountListData && initSubAccountListData.forEach(item=>{
            if(item.get('isVisable')){
                selectedRowKeys.push(item.get('userIdEnc'))
            }
        });
        return state.set('isFetching', false)
            .set('data', action.data)
            .set('selectedRowKeys', selectedRowKeys);
    case constant.FETCH_SUB_ACCOUNT_LIST_FAILURE:
        return state.set('isFetching', false);
    case constant.EMPTY_SUB_ACCOUNT_LIST:
        return state.set('data', '');
    case constant.FETCH_USER_STATUS_REQUEST:
        const subAccountsList =  state.getIn(['data','data']);
        const curSubAccount = subAccountsList.map(item => {
            let newItem;
            if(item.get('userIdEnc') === action.userId){
                newItem = item.set('isFetching', true);
            }else{
                newItem = item;
            }
            return newItem;
        });
        return state.setIn(['data','data'], curSubAccount);
    case constant.FETCH_USER_STATUS_SUCCESS:
    case constant.FETCH_USER_STATUS_FAILURE:
        const subAccountsListSucc =  state.getIn(['data','data']);
        const curSubAccountSucc = subAccountsListSucc.map(item => {
            let newItem;
            if(item.get('userIdEnc') === action.userId){
                newItem = item.set('isFetching', false);
            }else{
                newItem = item;
            }
            return newItem;
        });
        return state.setIn(['data','data'], curSubAccountSucc);
    case constant.SUB_ACCOUNT_CHECK:
        return state.set('selectedRowKeys', action.selectedRowKeys);
    default:
        return state
    }
};

//切换账号列表
const switchAccountList = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_SWITCH_ACCOUNT_LIST_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_SWITCH_ACCOUNT_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_SWITCH_ACCOUNT_LIST_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};


//新增/修改提交部门
const assignToSubAccount = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.ASSIGN_TO_SUB_ACCOUNT_REQUEST:
        return state.set('isFetching', true);
    case constant.ASSIGN_TO_SUB_ACCOUNT_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.ASSIGN_TO_SUB_ACCOUNT_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    subAccountList,
    switchAccountList,
    assignToSubAccount
})