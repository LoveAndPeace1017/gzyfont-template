import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";


const initialCateData = [
    {key: '1', title: '第一部分', parentId: '-1'},
    {key: '1-1', title: '一、二级标题', parentId: '1'},
    {key: '1-2', title: '二、二级标题', parentId: '1'},
    {key: '1-3', title: '三、二级标题', parentId: '1'},
    {key: '1-4', title: '四、二级标题', parentId: '1'},
    {key: '2', title: '第二部分', parentId: '-1'},
    {key: '2-1', title: '一、二级标题', parentId: '2'},
    {key: '2-1-1', title: '（一）三级标题', parentId: '2-1'},
    {key: '2-1-2', title: '（二）三级标题', parentId: '2-1'},
    {key: '2-1-3', title: '（三）三级标题', parentId: '2-1'},
    {key: '2-2', title: '二、二级标题', parentId: '2'},
    {key: '2-2-1', title: '（一）三级标题', parentId: '2-2'},
    {key: '2-2-2', title: '（二）三级标题', parentId: '2-2'},
    {key: '2-3', title: '三、二级标题', parentId: '2'},
    {key: '2-3-1', title: '（一）三级标题', parentId: '2-3'},
    {key: '2-3-2', title: '（二）三级标题', parentId: '2-3'},
    {key: '2-4', title: '四、二级标题', parentId: '2'},
    {key: '2-4-1', title: '（一）三级标题', parentId: '2-4'},
    {key: '2-4-2', title: '（二）三级标题', parentId: '2-4'},
    {key: '2-5', title: '五、二级标题', parentId: '2'},
    {key: '2-5-1', title: '（一）三级标题', parentId: '2-5'},
    {key: '2-5-2', title: '（二）三级标题', parentId: '2-5'},
    {key: '3', title: '第三部分', parentId: '-1'},
    {key: '3-1', title: '一、二级标题', parentId: '3'},
    {key: '3-1-1', title: '（一）三级标题', parentId: '3-1'},
    {key: '3-1-2', title: '（二）三级标题', parentId: '3-1'},
    {key: '3-2', title: '二、二级标题', parentId: '3'},
    {key: '3-2-1', title: '（一）三级标题', parentId: '3-2'},
    {key: '3-2-2', title: '（二）三级标题', parentId: '3-2'},
    {key: '3-3', title: '三、二级标题', parentId: '3'},
    {key: '3-3-1', title: '（一）三级标题', parentId: '3-3'},
    {key: '3-3-2', title: '（二）三级标题', parentId: '3-3'},
    {key: '3-4', title: '四、二级标题', parentId: '3'},
    {key: '3-4-1', title: '（一）三级标题', parentId: '3-4'},
    {key: '3-4-2', title: '（二）三级标题', parentId: '3-4'},
];
//获取类目列表
const cateList = (
    state = fromJS({
        isFetching: false,
        data: []
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_CATE_LIST_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_CATE_LIST_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.EDIT_CATE_SUCCESS:
        const tempEditData = state.getIn(['data', 'catTree']);
        const editData = tempEditData.map(item =>{
            if(item.get('code') === action.code){
                return item.set('name', action.name)
            }
            return item;
        });
        return state.setIn(['data', 'data'], editData);
    case constant.DEL_CATE_SUCCESS:
        const tempDelData = state.getIn(['data', 'catTree']);
        const delData = tempDelData.filter(item =>{
           return item.get('code') !== action.code
        });
        return state.setIn(['data', 'data'], delData);
    case constant.FETCH_CATE_LIST_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};


//新增/修改提交类目
const addCate = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.ADD_CATE_REQUEST:
        return state.set('isFetching', true);
    case constant.ADD_CATE_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.ADD_CATE_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

export default combineReducers({
    cateList,
    addCate
})