export const TYPE = 'GOODS';
// 获取字段配置
export const FETCH_GOODS_CONFIG_SUCCESS = "FETCH_GOODS_CONFIG_SUCCESS";

// 获取物品列表
export const GOODS_LIST = 'GOODS_LIST';
export const GOODS_LIST_SUCCESS = 'GOODS_LIST_SUCCESS';
export const GOODS_LIST_FAILURE = 'GOODS_LIST_FAILURE';
export const SET_GOODS_LIST_FOR_BOM = 'PAGES/GOODS/INDEX/SET_GOODS_LIST_FOR_BOM';

export const POP_GOODS_LIST = 'POP_GOODS_LIST';
export const POP_GOODS_LIST_SUCCESS = 'POP_GOODS_LIST_SUCCESS';
export const POP_GOODS_LIST_FAILURE = 'POP_GOODS_LIST_FAILURE';

export const GET_LOCAL_GOODS_INFO = 'GET_LOCAL_GOODS_INFO';

export const GOODS_CONFIRM_FETCHING_TRUE = 'GOODS_CONFIRM_FETCHING_TRUE';
export const GOODS_CONFIRM_FETCHING_FALSE = 'GOODS_CONFIRM_FETCHING_FALSE';

// 更新配置字段
export const GOODS_UPDATE_CONFIG = 'GOODS_UPDATE_CONFIG';
export const BATCH_GOODS_UPDATE_CONFIG = 'GOODS_BATCH_UPDATE_CONFIG';


// 根据物品code获取物品仓库数量
export const FETCH_WARE_BY_CODE_REQUEST = 'PAGES/GOODS/INDEX/FETCH_WARE_BY_CODE_REQUEST';
export const FETCH_WARE_BY_CODE_SUCCESS = 'PAGES/GOODS/INDEX/FETCH_WARE_BY_CODE_SUCCESS';
export const FETCH_WARE_BY_CODE_FAILURE = 'PAGES/GOODS/INDEX/FETCH_WARE_BY_CODE_FAILURE';

// 选择物品弹框根据物品code获取物品仓库数量
export const POP_FETCH_WARE_BY_CODE_REQUEST = 'PAGES/GOODS/INDEX/POP_FETCH_WARE_BY_CODE_REQUEST';
export const POP_FETCH_WARE_BY_CODE_SUCCESS = 'PAGES/GOODS/INDEX/POP_FETCH_WARE_BY_CODE_SUCCESS';
export const POP_FETCH_WARE_BY_CODE_FAILURE = 'PAGES/GOODS/INDEX/POP_FETCH_WARE_BY_CODE_FAILURE';

// 新增销售价
export const ADD_SALE_PRICE_REQUEST = 'PAGES/GOODS/INDEX/ADD_SALE_PRICE_REQUEST';
export const ADD_SALE_PRICE_SUCCESS = 'PAGES/GOODS/INDEX/ADD_SALE_PRICE_SUCCESS';
export const ADD_SALE_PRICE_FAILURE = 'PAGES/GOODS/INDEX/ADD_SALE_PRICE_FAILURE';

// 列表返回带回初始化数据
export const FILTER_CONFIG_LIST = 'PAGES/GOODS/INDEX/FILTER_CONFIG_LIST';


export const FETCH_BARCODE_REQUEST = 'PAGES/GOODS/INDEX/FETCH_BARCODE_REQUEST';
export const FETCH_BARCODE_SUCCESS = 'PAGES/GOODS/INDEX/FETCH_BARCODE_SUCCESS';
export const FETCH_BARCODE_FAILURE = 'PAGES/GOODS/INDEX/FETCH_BARCODE_FAILURE';