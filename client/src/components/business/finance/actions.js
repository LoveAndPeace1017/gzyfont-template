import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";


//新增物品条目
export const addGoodsItem = (index, num, orders) => ({
    type:constant.ADD_GOODS_ITEM,
    index,
    num,
    orders
});

//删除物品条目
export const removeGoodsItem = (index) => ({
    type:constant.REMOVE_GOODS_ITEM,
    index
});


//初始化物品条目
export const initGoodsItem = (data) => ({
    type: constant.INIT_GOODS_ITEM,
    data
});

export const emptyDetailData = () => ({
    type: constant.EMPTY_DETAIL_DATA
});













