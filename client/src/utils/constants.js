
/**
 * 其它元素的尺寸
 **/
export const HEADER_HEIGHT = 60;  //页面头部高度

export const PAGINATION_HEIGHT = 52;  //分页高度

export const TABLE_PADDING = 20;   //表格单元格左右间距之和

export const MODAL_MARGIN = 100; //弹框上下边距之和

export const MODAL_MARGIN_NARROW = 10; //窄屏弹框上下边距之和

export const MODAL_BODY_PADDING_TOP =  10; //弹框上边距

export const MODAL_BODY_PADDING_BOTTOM =  10; //弹框下边距

export const MODAL_HEADER_HEIGHT = 55; //弹框头部高度

export const MODAL_FOOTER_HEIGHT = 53; //弹框底部高度

export const MODAL_PAGINATION_HEIGHT = 34; //分页及其上下边距高度之和

export const TABLE_HEADER_HEIGHT = 50; //表格头部高度

export const TABLE_HEADER_HEIGHT_NARROW = 42; //窄屏表格头部高度

export const MODAL_TABS_HEGIHT = 54; //TABS高度及其边距高度

export const MODAL_FILTER_BAR_HEIGHT = 42; //筛选等操作栏高度及其边距高度

/**
 * 表格固定单元格宽度
 **/
export const TABLE_COL_WIDTH = {

    SELECTION: 16, //选择单选框或复选框
    SERIAL: 40, //序号
    OPERATION: 58, //操作
    PROD_PIC: 20, //产品图片图标
    DATE: 95,  //日期类，如采购日期、交付日期等
    PERSON: 85, //人名，如联系人、采购员等
    TEL: 100, //电话，如供应商电话、客户电话等
    UNIT: 40, //单位
    DISTRIBUTE_STATUS: 60, //分销状态
    CUSTOMER_LEVEL: 60, //客户级别
    BOUND_TYPE: 70, //入库类型、出库类型
    STATUS: 55, //状态
    PROD_BAR: 100, //商品条码
    EMAIL: 140, //电子邮箱
    BIND_ACCOUNT: 100, //绑定百卓账号
    CONTACT_RECORD: 60, //联系记录
    INCOME_TYPE: 80, //收入类型
    FUND_ACCOUNT: 180, //资金账户
    INVOICE_NO: 70, //发票号码
    FROM_ABIZ_QUOTATION: 130, //来自百卓采购网报价,
    TAX_RATE: 60 //税率
};

for(let key in TABLE_COL_WIDTH){
    TABLE_COL_WIDTH[key] = TABLE_COL_WIDTH[key] + TABLE_PADDING
}


/**
* 表格固定单元格宽度
**/
/*export const TABLE_COL_MIN_WIDTH = {
    PROD_NO: 100,
    PROD_NAME: 100,
    DESC_ITEM: 80,
    BRAND: 80,
    PRODUCE_MODEL: 100,
    QUANTITY: 100,
    PRICE: 100,
    AMOUNT: 120,
    TAX: 100
};

for(let key in TABLE_COL_MIN_WIDTH){
    TABLE_COL_MIN_WIDTH[key] = TABLE_COL_MIN_WIDTH[key] + TABLE_PADDING
}*/

/**
 * 价格无权限渲染
 **/
export const PRICE_NO_AUTH_RENDER = '**';

