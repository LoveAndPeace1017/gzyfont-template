/**
 * 通用的常量
 * @author qiumingsheng
 * @type {{COOKIE_MAX_AGE: string}}
 */

const TABLE_COL_WIDTH = {
    ADDRESS: 160,//地址
    DEFAULT: 150,//默认
    NO: 150,//编号
    PROD_PIC: 20, //产品图片图标
    DATE: 95,  //日期类，如采购日期、交付日期等
    PERSON: 85, //人名，如联系人、采购员等
    TEL: 100, //电话，如供应商电话、客户电话等
    UNIT: 30, //单位
    DISTRIBUTE_STATUS: 60, //分销状态
    CUSTOMER_LEVEL: 60, //客户级别
    BOUND_TYPE: 70, //入库类型、出库类型
    STATUS: 55, //状态
    ACCEPT_STATUS: 60, //状态
    PROD_BAR: 100, //商品条码
    EMAIL: 140, //电子邮箱
    BIND_ACCOUNT: 100, //绑定百卓账号
    CONTACT_RECORD: 60, //联系记录
    INCOME_TYPE: 80, //收入类型
    FUND_ACCOUNT: 180, //资金账户
    INVOICE_NO: 70, //发票号码
    PROCESS: 245, //来自百卓采购网报价
};

for (let key in TABLE_COL_WIDTH) {
    TABLE_COL_WIDTH[key] = TABLE_COL_WIDTH[key] + 20
}


module.exports = {
    COOKIE_MAX_AGE: "1800000",

    EXCLUDES_PATH: [
        /^\/login\/?.*$/,
        /^\/logout\/?.*$/,
        /^\/register\/?.*$/,
        /^\/r\/?.*$/,
        /^\/dls\/?.*$/,
        /^\/ad\/?.*$/,
        /^\/dz\/?.*$/,
        /^\/lajifenlei\/?.*$/,
        /^\/wxRequest\/?.*$/,
        /^\/sso\/?.*$/,
        /^\/info\/?.*$/,
        /^\/api\/mobile\/?.*$/,
        /^\/mobile\/?.*$/,
        /^\/images\/?.*$/,
        /^\/css\/?.*$/,
        /^\/js\/?.*$/
    ],

    PAGINATION_PER_PAGE: 20,

    TABLE_COL_WIDTH: TABLE_COL_WIDTH,

    GOODS_TABLE_FIELD_MAP: {
        prodCustomNo: 'node.report.purchase.prodCustomNo',
        prodName: 'node.report.purchase.prodName',
        unit: 'node.report.purchase.recUnit',
        firstCatName: 'node.report.purchase.firstCatName',
        secondCatName: 'node.report.purchase.secondCatName',
        thirdCatName: 'node.report.purchase.thirdCatName',
        proBarCode: 'node.report.purchase.proBarCode',
        descItem: 'node.report.purchase.descItem',
        brand: 'node.report.purchase.brand',
        produceModel: 'node.report.purchase.produceModel',
        untaxedPrice: 'node.report.purchase.untaxedPrice',
        untaxedAmount: 'node.report.purchase.untaxedAmount',
        taxRate: 'node.report.purchase.taxRate',
        tax: 'node.report.purchase.tax',
        remarks: 'node.report.purchaseInvoice.remarks',
        serialNumber: 'node.serialNumQuery.serialNumber', // 入库出库使用
        systemNum: 'node.inventory.stocktaking.systemNum',
        offsetQuantity: 'node.inventory.stocktaking.offsetQuantity',
        result: 'node.inventory.stocktaking.result',
        unitConverter: "node.purchase.unitConverter",
        quantity: "node.purchase.quantity",
        currencyUnitPrice: "node.report.sale.currencyUnitPrice",
        currencyAmount: "node.report.sale.currencyAmount"
    },

    txH5Map: {
        '001': {
            title: '客户收款对账神器',
            keywords: '',
            description: '',
            uri: 'register/txInviteRegister'
        },
        '003': {
            title: '生意管理神器',
            keywords: '',
            description: '',
            uri: 'register/txInviteRegister'
        },
        '004': {
            title: '远程办公神器',
            keywords: '',
            description: '',
            uri: 'register/txInviteRegister'
        },
        '086': {
            title: '客户收款对账神器',
            keywords: '',
            description: '',
            uri: 'register/txInviteRegister'
        },
        '005': {
            title: '快速复工指南',
            keywords: '百卓优采云进销存，生意管理软件',
            description: '百卓优采云进销存全面助力企业复工复产，湖北企业2020全年免VIP子账号年费！',
            uri: 'register/txInviteRegister_5'
        },
        '006': {
            title: '湖北企业，优厚福利',
            keywords: '百卓优采云进销存，生意管理软件',
            description: '百卓优采云进销存全面助力企业生意管理，湖北企业2020全年免VIP子账号年费！',
            uri: 'register/txInviteRegister_5'
        },
        '007': {
            title: '百卓优采云进销存仓库管理软件',
            keywords: '百卓优采云进销存，仓库管理软件',
            description: '百卓优采云进销存让仓库管理更轻松，10分钟上手、基础功能免费、手机电脑同步，解决99%仓管问题，立即领取15天免费试用！',
            uri: 'register/txInviteRegister_warehouse',
            ajaxSubmit: true
        },
        '010': {
            title: '百卓优采云进销存仓库管理软件',
            keywords: '百卓优采云进销存，仓库管理软件',
            description: '百卓优采云进销存让仓库管理更轻松，10分钟上手、基础功能免费、手机电脑同步，解决99%仓管问题，立即领取15天免费试用！',
            uri: 'register/txInviteRegister_warehouse',
            ajaxSubmit: true
        },
        '011': {
            title: '百卓优采云进销存仓库管理软件',
            keywords: '百卓优采云进销存，仓库管理软件',
            description: '百卓优采云进销存让仓库管理更轻松，10分钟上手、基础功能免费、手机电脑同步，解决99%仓管问题，立即领取15天免费试用！',
            uri: 'register/txInviteRegister_011',
            appUploadUri: 'https://apps.bytesfield.com/download/basic/cur/f7dd6a23629a28cf51fdc9549cdac742b72a6a78',
            ajaxSubmit: true,
            toSuccessUrl: 'douyin/invite/success'
        },
        '012': {
            title: '百卓优采云进销存仓库管理软件',
            keywords: '百卓优采云进销存，仓库管理软件',
            description: '百卓优采云进销存让仓库管理更轻松，10分钟上手、基础功能免费、手机电脑同步，解决99%仓管问题，立即领取15天免费试用！',
            uri: 'register/txInviteRegister_warehouse',
            ajaxSubmit: true
        },
        '022': {
            title: '百卓优采云进销存仓库管理软件',
            keywords: '百卓优采云进销存，仓库管理软件',
            description: '百卓优采云进销存让仓库管理更轻松，10分钟上手、基础功能免费、手机电脑同步，解决99%仓管问题，立即领取15天免费试用！',
            uri: 'register/txInviteRegister_warehouse',
            ajaxSubmit: true
        },
        '043': {
            title: '百卓优采云进销存仓库管理软件',
            keywords: '百卓优采云进销存，仓库管理软件',
            description: '百卓优采云进销存让仓库管理更轻松，10分钟上手、基础功能免费、手机电脑同步，解决99%仓管问题，立即领取15天免费试用！',
            uri: 'register/txInviteRegister_warehouse',
            ajaxSubmit: true
        },
        '060': {
            title: '百卓优采云进销存仓库管理软件',
            keywords: '百卓优采云进销存，仓库管理软件',
            description: '百卓优采云进销存让仓库管理更轻松，10分钟上手、基础功能免费、手机电脑同步，解决99%仓管问题，立即领取15天免费试用！',
            uri: 'register/txInviteRegister_warehouse',
            ajaxSubmit: true
        },
        '080': {
            title: '百卓轻云ERP免费试用',
            keywords: '百卓优采云进销存，仓库管理软件',
            description: '百卓优采云进销存让仓库管理更轻松，10分钟上手、基础功能免费、手机电脑同步，解决99%仓管问题，立即领取15天免费试用！',
            uri: 'register/txInviteRegister_009',
            appUploadUri: 'https://apps.bytesfield.com/download/basic/cur/f7dd6a23629a28cf51fdc9549cdac742b72a6a78',
            ajaxSubmit: true,
            toSuccessUrl: 'douyin/invite/success',
            isJwexin: true
        },
        '002': {
            title: '百卓优采云进销存生意管理软件',
            keywords: '百卓优采云进销存，生意管理，采购管理，仓库管理，销售管理，财务管理，进销存软件',
            description: '百卓优采云进销存，小工具大价值，一站式解决采购销售仓储管理难题，助力企业高效管理，让老板轻松挣钱，立即免费体验',
            uri: 'register/txInviteRegister_002',
            appUploadUri: 'https://apps.bytesfield.com/download/basic/cur/f7dd6a23629a28cf51fdc9549cdac742b72a6a78',
            ajaxSubmit: true,
            toSuccessUrl: 'douyin/invite/success'
        },
        '009': {
            title: '百卓优采云进销存生意管理软件',
            keywords: '百卓优采云进销存，生意管理，采购管理，仓库管理，销售管理，财务管理，进销存软件',
            description: '百卓优采云进销存，小工具大价值，一站式解决采购销售仓储管理难题，助力企业高效管理，让老板轻松挣钱，立即免费体验',
            uri: 'register/txInviteRegister_009',
            appUploadUri: 'https://apps.bytesfield.com/download/basic/cur/f7dd6a23629a28cf51fdc9549cdac742b72a6a78',
            ajaxSubmit: true,
            toSuccessUrl: 'douyin/invite/success'
        },
        '020': {
            title: '百卓优采云进销存生意管理软件',
            keywords: '百卓优采云进销存，生意管理，采购管理，仓库管理，销售管理，财务管理，进销存软件',
            description: '百卓优采云进销存，小工具大价值，一站式解决采购销售仓储管理难题，助力企业高效管理，让老板轻松挣钱，立即免费体验',
            uri: 'register/txInviteRegister_boss',
            ajaxSubmit: true
        },
        '021': {
            title: '百卓优采云进销存生意管理软件',
            keywords: '百卓优采云进销存，生意管理，采购管理，仓库管理，销售管理，财务管理，进销存软件',
            description: '百卓优采云进销存，小工具大价值，一站式解决采购销售仓储管理难题，助力企业高效管理，让老板轻松挣钱，立即免费体验',
            uri: 'register/txInviteRegister_boss',
            ajaxSubmit: true
        },
        '040': {
            title: '百卓优采云进销存生意管理软件',
            keywords: '百卓优采云进销存，生意管理，采购管理，仓库管理，销售管理，财务管理，进销存软件',
            description: '百卓优采云进销存，小工具大价值，一站式解决采购销售仓储管理难题，助力企业高效管理，让老板轻松挣钱，立即免费体验',
            uri: 'register/txInviteRegister_boss',
            ajaxSubmit: true
        },
        '041': {
            title: '百卓优采云进销存生意管理软件',
            keywords: '百卓优采云进销存，生意管理，采购管理，仓库管理，销售管理，财务管理，进销存软件',
            description: '百卓优采云进销存，小工具大价值，一站式解决采购销售仓储管理难题，助力企业高效管理，让老板轻松挣钱，立即免费体验',
            uri: 'register/txInviteRegister_boss',
            ajaxSubmit: true
        },
        '061': {
            title: '百卓优采云进销存生意管理软件',
            keywords: '百卓优采云进销存，生意管理，采购管理，仓库管理，销售管理，财务管理，进销存软件',
            description: '百卓优采云进销存，小工具大价值，一站式解决采购销售仓储管理难题，助力企业高效管理，让老板轻松挣钱，立即免费体验',
            uri: 'register/txInviteRegister_boss',
            ajaxSubmit: true
        },
        '081': {
            title: '百卓优采云进销存生意管理软件',
            keywords: '百卓优采云进销存，生意管理，采购管理，仓库管理，销售管理，财务管理，进销存软件',
            description: '百卓优采云进销存，小工具大价值，一站式解决采购销售仓储管理难题，助力企业高效管理，让老板轻松挣钱，立即免费体验',
            uri: 'register/txInviteRegister_boss',
            ajaxSubmit: true,
            isVivo: true,
            toSuccessUrl: 'vivo/invite/success'
        },
        '070': {
            title: '百卓优采云进销存仓库管理软件',
            keywords: '百卓优采云进销存，仓库管理软件',
            description: '百卓优采云进销存让仓库管理更轻松，10分钟上手、基础功能免费、手机电脑同步，解决99%仓管问题，立即领取15天免费试用！',
            uri: 'register/txInviteRegister_070',
            ajaxSubmit: true
        },
        '071': {
            title: '百卓优采云进销存生意管理软件',
            keywords: '百卓优采云进销存，生意管理，采购管理，仓库管理，销售管理，财务管理，进销存软件',
            description: '百卓优采云进销存，小工具大价值，一站式解决采购销售仓储管理难题，助力企业高效管理，让老板轻松挣钱，立即免费体验',
            uri: 'register/txInviteRegister_071',
            ajaxSubmit: true
        },
        '045': {
            title: '百卓优采云进销存生意管理软件',
            keywords: '百卓优采云进销存，生意管理，采购管理，仓库管理，销售管理，财务管理，进销存软件',
            description: '百卓优采云进销存，小工具大价值，一站式解决采购销售仓储管理难题，助力企业高效管理，让老板轻松挣钱，立即免费体验',
            uri: 'register/sougouInviteRegister',
        },
        '055': {
            title: '百卓优采云进销存生意管理软件',
            keywords: '百卓优采云进销存，生意管理，采购管理，仓库管理，销售管理，财务管理，进销存软件',
            description: '百卓优采云进销存，小工具大价值，一站式解决采购销售仓储管理难题，助力企业高效管理，让老板轻松挣钱，立即免费体验',
            uri: 'register/sougouInviteRegister',
        }
    },

    erpAds: {
        'key045': {
            title: '生产管理系统_工单管理_百卓轻云ERP软件_无需部署即买即用_全业务流程数字化管理与协同',
            keywords: '生产管理软件，生产工序管理、ERP软件，MES系统，wms，进销存软件，采购管理软件，仓库管理软件，销售管理软件，crm软件，生产看板，工单管理软件',
            description: '百卓轻云ERP专注工贸企业数字化管理与协同，打造进销存+生产管理一体化的ERP管理软件，生产进度看板、委外加工、BOM等功能助力企业优化生产管理模式，提升生产效益。',
            uri: 'ads/erpAds_045'
        }
    },

    defaultMenuConfigList: [  // 默认表单配置列表
        {
            configKey: "MODULE",
            configValue: "sale",
            status: 1
        }, {
            configKey: "MODULE",
            configValue: "purchase",
            status: 1
        }, {
            configKey: "MODULE",
            configValue: "store",
            status: 1
        }, {
            configKey: "MODULE",
            configValue: "productControl",
            status: 1
        }, {
            configKey: "MODULE",
            configValue: "goods",
            status: 1
        }, {
            configKey: "MODULE",
            configValue: "basic",
            status: 1
        }, {
            configKey: "MODULE",
            configValue: "finance",
            status: 1
        }, {
            configKey: "MODULE",
            configValue: "report",
            status: 1
        }, {
            configKey: "MODULE",
            configValue: "downloadCenter",
            status: 1
        }
    ],
    /**
     * 推荐模板json数据
     **/
   RECOMMEND_TEMPLATE_JSON:{
        "recommend-001": {
            "data": {
                "billType": "PurchaseOrder",
                "content": "<h3 style=\"text-align: center;\"><span style=\"font-weight: bold;\">________公司采购订单订单标题</span></h3>\n<div>&nbsp;</div>\n<p>&nbsp;</p>\n<table id=\"template-tables\" style=\"table-layout: fixed; word-wrap: break-word;\" border=\"1\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\n<tbody>\n<tr>\n<th id=\"ts1-serialNumber\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">序号</th>\n<th id=\"ts1-prodCustomNo\" style=\"text-align: center; font-weight: normal; width: 13.8614%;\">\n<p>物品编号</p>\n<p>&nbsp;</p>\n<p>&nbsp;</p>\n<p>&nbsp;</p>\n<p>&nbsp;</p>\n<p>&nbsp;</p>\n</th>\n<th id=\"ts1-prodName\" style=\"font-weight: normal; width: 8.31682%; text-align: left;\">物品名称</th>\n<th id=\"ts1-firstCatName\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">一级类目</th>\n<th id=\"ts1-secondCatName\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">二级类目</th>\n<th id=\"ts1-thirdCatName\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">三级类目</th>\n<th id=\"ts1-batchNo\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">批次号</th>\n<th id=\"ts1-productionDate\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">生产日期</th>\n<th id=\"ts1-expirationDate\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">到期日期</th>\n<th id=\"ts1-descItem\" style=\"font-weight: normal; width: 11.0891%; text-align: left;\">规格型号</th>\n<th id=\"ts1-brand\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">品牌</th>\n<th id=\"ts1-thumbnailUri\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">物品图片</th>\n<th id=\"ts1-produceModel\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">制造商型号</th>\n<th id=\"ts1-minQuantity\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">库存下限</th>\n<th id=\"ts1-maxQuantity\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">库存上限</th>\n<th id=\"ts1-proBarCode\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">商品条码</th>\n<th id=\"ts1-propertyValue1\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">自定义字段1</th>\n<th id=\"ts1-propertyValue2\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">自定义字段2</th>\n<th id=\"ts1-propertyValue3\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">自定义字段3</th>\n<th id=\"ts1-propertyValue4\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">自定义字段4</th>\n<th id=\"ts1-propertyValue5\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">自定义字段5</th>\n<th id=\"ts1-property_value1\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">单据物品自定义字段1</th>\n<th id=\"ts1-property_value2\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">单据物品自定义字段2</th>\n<th id=\"ts1-property_value3\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">单据物品自定义字段3</th>\n<th id=\"ts1-property_value4\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">单据物品自定义字段4</th>\n<th id=\"ts1-property_value5\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">单据物品自定义字段5</th>\n<th id=\"ts1-unit\" style=\"text-align: center; font-weight: normal; width: 11.0891%;\">单位</th>\n<th id=\"ts1-quantity\" style=\"text-align: center; font-weight: normal; width: 11.1881%;\">采购数量</th>\n<th id=\"ts1-recUnit\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">辅助单位</th>\n<th id=\"ts1-recQuantity\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">辅助采购数量</th>\n<th id=\"ts1-unitConverter\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">单位关系</th>\n<th id=\"ts1-tax\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">税额</th>\n<th id=\"ts1-untaxedPrice\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">未税单价</th>\n<th id=\"ts1-untaxedAmount\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">未税金额</th>\n<th id=\"ts1-taxRate\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">税率</th>\n<th id=\"ts1-unitPrice\" style=\"text-align: center; font-weight: normal; width: 11.0891%;\">含税单价</th>\n<th id=\"ts1-amount\" style=\"text-align: center; font-weight: normal; width: 11.0891%;\">价税合计</th>\n<th id=\"ts1-remarks\" style=\"text-align: center; font-weight: normal; width: 11.0891%;\">备注</th>\n<th id=\"ts1-saleBillNo\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">上游单号</th>\n<th id=\"ts1-deliveryDeadlineDate\" style=\"text-align: center; font-weight: normal; width: 11.0891%;\">交付日期</th>\n</tr>\n<tr style=\"height: 60px;\">\n<th id=\"ts2-serialNumber\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{序号}</th>\n<th id=\"ts2-prodCustomNo\" style=\"font-weight: normal; text-align: right; width: 13.8614%;\">{物品编号}</th>\n<th id=\"ts2-prodName\" style=\"text-align: center; font-weight: normal; width: 8.31682%;\">{物品名称}</th>\n<th id=\"ts2-firstCatName\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{一级类目}</th>\n<th id=\"ts2-secondCatName\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{二级类目}</th>\n<th id=\"ts2-thirdCatName\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{三级类目}</th>\n<th id=\"ts2-batchNo\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{批次号}</th>\n<th id=\"ts2-productionDate\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{生产日期}</th>\n<th id=\"ts2-expirationDate\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{到期日期}</th>\n<th id=\"ts2-descItem\" style=\"text-align: center; font-weight: normal; width: 11.0891%;\">\n<p>{规格型号}</p>\n<p>&nbsp;</p>\n<p>&nbsp;</p>\n<p>&nbsp;</p>\n</th>\n<th id=\"ts2-brand\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{品牌}</th>\n<th id=\"ts2-thumbnailUri\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{物品图片}</th>\n<th id=\"ts2-produceModel\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{制造商型号}</th>\n<th id=\"ts2-minQuantity\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{库存下限}</th>\n<th id=\"ts2-maxQuantity\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{库存上限}</th>\n<th id=\"ts2-proBarCode\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{商品条码}</th>\n<th id=\"ts2-propertyValue1\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{自定义字段1}</th>\n<th id=\"ts2-propertyValue2\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{自定义字段2}</th>\n<th id=\"ts2-propertyValue3\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{自定义字段3}</th>\n<th id=\"ts2-propertyValue4\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{自定义字段4}</th>\n<th id=\"ts2-propertyValue5\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{自定义字段5}</th>\n<th id=\"ts2-property_value1\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{单据物品自定义字段1}</th>\n<th id=\"ts2-property_value2\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{单据物品自定义字段2}</th>\n<th id=\"ts2-property_value3\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{单据物品自定义字段3}</th>\n<th id=\"ts2-property_value4\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{单据物品自定义字段4}</th>\n<th id=\"ts2-property_value5\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{单据物品自定义字段5}</th>\n<th id=\"ts2-unit\" style=\"text-align: center; font-weight: normal; width: 11.0891%;\">{单位}</th>\n<th id=\"ts2-quantity\" style=\"text-align: center; font-weight: normal; width: 11.1881%;\">{采购数量}</th>\n<th id=\"ts2-recUnit\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{辅助单位}</th>\n<th id=\"ts2-recQuantity\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{辅助采购数量}</th>\n<th id=\"ts2-unitConverter\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{单位关系}</th>\n<th id=\"ts2-tax\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{税额}</th>\n<th id=\"ts2-untaxedPrice\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{未税单价}</th>\n<th id=\"ts2-untaxedAmount\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{未税金额}</th>\n<th id=\"ts2-taxRate\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{税率}</th>\n<th id=\"ts2-unitPrice\" style=\"text-align: center; font-weight: normal; width: 11.0891%;\">{含税单价}</th>\n<th id=\"ts2-amount\" style=\"text-align: center; font-weight: normal; width: 11.0891%;\">{价税合计}</th>\n<th id=\"ts2-remarks\" style=\"text-align: center; font-weight: normal; width: 11.0891%;\">{备注}</th>\n<th id=\"ts2-saleBillNo\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{上游单号}</th>\n<th id=\"ts2-deliveryDeadlineDate\" style=\"text-align: center; font-weight: normal; width: 11.0891%;\">{交付日期}</th>\n</tr>\n</tbody>\n</table>\n<p>&nbsp;</p>\n<div>&nbsp;</div>",
                "dateFormat": "1",
                "fieldList": [],
                "isDefault": 0,
                "materialFieldList": [],
                "maxRow": 5,
                "paperSize": "a4_h",
                "prodFieldList": [
                    {
                        "addedLoginName": "18713000021",
                        "addedTime": 1640830820000,
                        "displayOrder": 0,
                        "fieldName": "prodCustomNo",
                        "fieldType": "prodField",
                        "recId": 11799,
                        "templateId": 413
                    },
                    {
                        "addedLoginName": "18713000021",
                        "addedTime": 1640830820000,
                        "displayOrder": 1,
                        "fieldName": "prodName",
                        "fieldType": "prodField",
                        "recId": 11800,
                        "templateId": 413
                    },
                    {
                        "addedLoginName": "18713000021",
                        "addedTime": 1640830820000,
                        "displayOrder": 2,
                        "fieldName": "descItem",
                        "fieldType": "prodField",
                        "recId": 11801,
                        "templateId": 413
                    },
                    {
                        "addedLoginName": "18713000021",
                        "addedTime": 1640830820000,
                        "displayOrder": 3,
                        "fieldName": "unit",
                        "fieldType": "prodField",
                        "recId": 11802,
                        "templateId": 413
                    },
                    {
                        "addedLoginName": "18713000021",
                        "addedTime": 1640830820000,
                        "displayOrder": 4,
                        "fieldName": "quantity",
                        "fieldType": "prodField",
                        "recId": 11803,
                        "templateId": 413
                    },
                    {
                        "addedLoginName": "18713000021",
                        "addedTime": 1640830820000,
                        "displayOrder": 5,
                        "fieldName": "unitPrice",
                        "fieldType": "prodField",
                        "recId": 11804,
                        "templateId": 413
                    },
                    {
                        "addedLoginName": "18713000021",
                        "addedTime": 1640830820000,
                        "displayOrder": 6,
                        "fieldName": "amount",
                        "fieldType": "prodField",
                        "recId": 11805,
                        "templateId": 413
                    },
                    {
                        "addedLoginName": "18713000021",
                        "addedTime": 1640830820000,
                        "displayOrder": 7,
                        "fieldName": "remarks",
                        "fieldType": "prodField",
                        "recId": 11806,
                        "templateId": 413
                    },
                    {
                        "addedLoginName": "18713000021",
                        "addedTime": 1640830820000,
                        "displayOrder": 8,
                        "fieldName": "deliveryDeadlineDate",
                        "fieldType": "prodField",
                        "recId": 11807,
                        "templateId": 413
                    }
                ],
                "sortAryStr": "【序号】-serialNumber,【物品编号】-prodCustomNo,【物品名称】-prodName,【一级类目】-firstCatName,【二级类目】-secondCatName,【三级类目】-thirdCatName,【批次号】-batchNo,【生产日期】-productionDate,【到期日期】-expirationDate,【规格型号】-descItem,【品牌】-brand,【物品图片】-thumbnailUri,【制造商型号】-produceModel,【库存下限】-minQuantity,【库存上限】-maxQuantity,【商品条码】-proBarCode,【自定义字段1】-propertyValue1,【自定义字段2】-propertyValue2,【自定义字段3】-propertyValue3,【自定义字段4】-propertyValue4,【自定义字段5】-propertyValue5,【单据物品自定义字段1】-property_value1,【单据物品自定义字段2】-property_value2,【单据物品自定义字段3】-property_value3,【单据物品自定义字段4】-property_value4,【单据物品自定义字段5】-property_value5,【单位】-unit,【采购数量】-quantity,【辅助单位】-recUnit,【辅助采购数量】-recQuantity,【单位关系】-unitConverter,【税额】-tax,【未税单价】-untaxedPrice,【未税金额】-untaxedAmount,【税率】-taxRate,【含税单价】-unitPrice,【价税合计】-amount,【备注】-remarks,【上游单号】-saleBillNo,【交付日期】-deliveryDeadlineDate",
                "templateName": "小高测试一下111",
                "wordSize": "14"
            },
            "retCode": "0"
        },
        "recommend-002": {
            "data": {
                "billType": "EnterWarehouse_0",
                "content": "<h3 style=\"text-align: center;\"><strong><span style=\"font-size: 24px;\">XXXXXXX采购入库</span></strong></h3>\n<table style=\"border-collapse: collapse; width: 100%;\" border=\"1\">\n<tbody>\n<tr>\n<td style=\"width: 12.5303%;\">单据编号：</td>\n<td style=\"width: 36.8673%;\">【入库单号】</td>\n<td style=\"width: 12.5301%;\">制单日期：</td>\n<td style=\"width: 38.0723%;\">【入库日期】</td>\n</tr>\n<tr>\n<td style=\"width: 12.5303%;\">供应商：</td>\n<td style=\"width: 36.8673%;\">【供应商】</td>\n<td style=\"width: 12.5301%;\">客户电话：</td>\n<td style=\"width: 38.0723%;\">【供应商-联系电话】</td>\n</tr>\n</tbody>\n</table>\n<table id=\"template-tables\" style=\"table-layout: fixed; word-wrap: break-word;\" border=\"1\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\n<tbody>\n<tr>\n<th id=\"ts1-serialNumber\" style=\"text-align: center; font-weight: bold; display: none;\">序号</th>\n<th id=\"ts1-prodCustomNo\" style=\"text-align: center; font-weight: bold;\">物品编号</th>\n<th id=\"ts1-prodName\" style=\"text-align: center; font-weight: bold;\">物品名称</th>\n<th id=\"ts1-firstCatName\" style=\"text-align: center; font-weight: bold; display: none;\">一级类目</th>\n<th id=\"ts1-secondCatName\" style=\"text-align: center; font-weight: bold; display: none;\">二级类目</th>\n<th id=\"ts1-thirdCatName\" style=\"text-align: center; font-weight: bold; display: none;\">三级类目</th>\n<th id=\"ts1-batchNo\" style=\"text-align: center; font-weight: bold; display: none;\">批次号</th>\n<th id=\"ts1-productionDate\" style=\"text-align: center; font-weight: bold; display: none;\">生产日期</th>\n<th id=\"ts1-expirationDate\" style=\"text-align: center; font-weight: bold; display: none;\">到期日期</th>\n<th id=\"ts1-descItem\" style=\"text-align: center; font-weight: bold;\">规格型号</th>\n<th id=\"ts1-brand\" style=\"text-align: center; font-weight: bold; display: none;\">品牌</th>\n<th id=\"ts1-thumbnailUri\" style=\"text-align: center; font-weight: bold; display: none;\">物品图片</th>\n<th id=\"ts1-produceModel\" style=\"text-align: center; font-weight: bold; display: none;\">制造商型号</th>\n<th id=\"ts1-minQuantity\" style=\"text-align: center; font-weight: bold; display: none;\">库存下限</th>\n<th id=\"ts1-maxQuantity\" style=\"text-align: center; font-weight: bold; display: none;\">库存上限</th>\n<th id=\"ts1-proBarCode\" style=\"text-align: center; font-weight: bold; display: none;\">商品条码</th>\n<th id=\"ts1-propertyValue1\" style=\"text-align: center; font-weight: bold; display: none;\">自定义字段1</th>\n<th id=\"ts1-propertyValue2\" style=\"text-align: center; font-weight: bold; display: none;\">自定义字段2</th>\n<th id=\"ts1-propertyValue3\" style=\"text-align: center; font-weight: bold; display: none;\">自定义字段3</th>\n<th id=\"ts1-propertyValue4\" style=\"text-align: center; font-weight: bold; display: none;\">自定义字段4</th>\n<th id=\"ts1-propertyValue5\" style=\"text-align: center; font-weight: bold; display: none;\">自定义字段5</th>\n<th id=\"ts1-property_value1\" style=\"text-align: center; font-weight: bold; display: none;\">单据物品自定义字段1</th>\n<th id=\"ts1-property_value2\" style=\"text-align: center; font-weight: bold; display: none;\">单据物品自定义字段2</th>\n<th id=\"ts1-property_value3\" style=\"text-align: center; font-weight: bold; display: none;\">单据物品自定义字段3</th>\n<th id=\"ts1-property_value4\" style=\"text-align: center; font-weight: bold; display: none;\">单据物品自定义字段4</th>\n<th id=\"ts1-property_value5\" style=\"text-align: center; font-weight: bold; display: none;\">单据物品自定义字段5</th>\n<th id=\"ts1-unit\" style=\"text-align: center; font-weight: bold;\">单位</th>\n<th id=\"ts1-quantity\" style=\"text-align: center; font-weight: bold;\">入库数量</th>\n<th id=\"ts1-recUnit\" style=\"text-align: center; font-weight: bold; display: none;\">辅助单位</th>\n<th id=\"ts1-recQuantity\" style=\"text-align: center; font-weight: bold; display: none;\">辅助入库数量</th>\n<th id=\"ts1-unitConverter\" style=\"text-align: center; font-weight: bold; display: none;\">单位关系</th>\n<th id=\"ts1-tax\" style=\"text-align: center; font-weight: bold; display: none;\">税额</th>\n<th id=\"ts1-untaxedPrice\" style=\"text-align: center; font-weight: bold; display: none;\">未税单价</th>\n<th id=\"ts1-untaxedAmount\" style=\"text-align: center; font-weight: bold; display: none;\">未税金额</th>\n<th id=\"ts1-taxRate\" style=\"text-align: center; font-weight: bold; display: none;\">税率</th>\n<th id=\"ts1-unitPrice\" style=\"text-align: center; font-weight: bold;\">含税单价</th>\n<th id=\"ts1-amount\" style=\"text-align: center; font-weight: bold;\">价税合计</th>\n<th id=\"ts1-remarks\" style=\"text-align: center; font-weight: bold;\">备注</th>\n</tr>\n<tr>\n<th id=\"ts2-serialNumber\" style=\"text-align: center; display: none;\">{序号}</th>\n<th id=\"ts2-prodCustomNo\" style=\"text-align: center;\">{物品编号}</th>\n<th id=\"ts2-prodName\" style=\"text-align: center;\">{物品名称}</th>\n<th id=\"ts2-firstCatName\" style=\"text-align: center; display: none;\">{一级类目}</th>\n<th id=\"ts2-secondCatName\" style=\"text-align: center; display: none;\">{二级类目}</th>\n<th id=\"ts2-thirdCatName\" style=\"text-align: center; display: none;\">{三级类目}</th>\n<th id=\"ts2-batchNo\" style=\"text-align: center; display: none;\">{批次号}</th>\n<th id=\"ts2-productionDate\" style=\"text-align: center; display: none;\">{生产日期}</th>\n<th id=\"ts2-expirationDate\" style=\"text-align: center; display: none;\">{到期日期}</th>\n<th id=\"ts2-descItem\" style=\"text-align: center;\">{规格型号}</th>\n<th id=\"ts2-brand\" style=\"text-align: center; display: none;\">{品牌}</th>\n<th id=\"ts2-thumbnailUri\" style=\"text-align: center; display: none;\">{物品图片}</th>\n<th id=\"ts2-produceModel\" style=\"text-align: center; display: none;\">{制造商型号}</th>\n<th id=\"ts2-minQuantity\" style=\"text-align: center; display: none;\">{库存下限}</th>\n<th id=\"ts2-maxQuantity\" style=\"text-align: center; display: none;\">{库存上限}</th>\n<th id=\"ts2-proBarCode\" style=\"text-align: center; display: none;\">{商品条码}</th>\n<th id=\"ts2-propertyValue1\" style=\"text-align: center; display: none;\">{自定义字段1}</th>\n<th id=\"ts2-propertyValue2\" style=\"text-align: center; display: none;\">{自定义字段2}</th>\n<th id=\"ts2-propertyValue3\" style=\"text-align: center; display: none;\">{自定义字段3}</th>\n<th id=\"ts2-propertyValue4\" style=\"text-align: center; display: none;\">{自定义字段4}</th>\n<th id=\"ts2-propertyValue5\" style=\"text-align: center; display: none;\">{自定义字段5}</th>\n<th id=\"ts2-property_value1\" style=\"text-align: center; display: none;\">{单据物品自定义字段1}</th>\n<th id=\"ts2-property_value2\" style=\"text-align: center; display: none;\">{单据物品自定义字段2}</th>\n<th id=\"ts2-property_value3\" style=\"text-align: center; display: none;\">{单据物品自定义字段3}</th>\n<th id=\"ts2-property_value4\" style=\"text-align: center; display: none;\">{单据物品自定义字段4}</th>\n<th id=\"ts2-property_value5\" style=\"text-align: center; display: none;\">{单据物品自定义字段5}</th>\n<th id=\"ts2-unit\" style=\"text-align: center;\">{单位}</th>\n<th id=\"ts2-quantity\" style=\"text-align: center;\">{入库数量}</th>\n<th id=\"ts2-recUnit\" style=\"text-align: center; display: none;\">{辅助单位}</th>\n<th id=\"ts2-recQuantity\" style=\"text-align: center; display: none;\">{辅助入库数量}</th>\n<th id=\"ts2-unitConverter\" style=\"text-align: center; display: none;\">{单位关系}</th>\n<th id=\"ts2-tax\" style=\"text-align: center; display: none;\">{税额}</th>\n<th id=\"ts2-untaxedPrice\" style=\"text-align: center; display: none;\">{未税单价}</th>\n<th id=\"ts2-untaxedAmount\" style=\"text-align: center; display: none;\">{未税金额}</th>\n<th id=\"ts2-taxRate\" style=\"text-align: center; display: none;\">{税率}</th>\n<th id=\"ts2-unitPrice\" style=\"text-align: center;\">{含税单价}</th>\n<th id=\"ts2-amount\" style=\"text-align: center;\">{价税合计}</th>\n<th id=\"ts2-remarks\" style=\"text-align: center;\">{备注}</th>\n</tr>\n</tbody>\n</table>\n<table style=\"border-collapse: collapse; width: 100%;\" border=\"1\">\n<tbody>\n<tr>\n<td style=\"width: 13.3738%;\">总金额大写：</td>\n<td style=\"width: 26.1443%;\">【优惠后金额大写】</td>\n<td style=\"width: 9.87952%;\">&nbsp;</td>\n<td style=\"width: 10.1205%;\">总重量：</td>\n<td style=\"width: 15.5422%;\">【总数量】</td>\n<td style=\"width: 24.9398%;\">&nbsp;</td>\n</tr>\n<tr>\n<td style=\"width: 13.3738%;\">公司地址：</td>\n<td style=\"width: 26.1443%;\">XXXXXXXX公司&nbsp;</td>\n<td style=\"width: 20%;\" colspan=\"2\">&nbsp;电话：</td>\n<td style=\"width: 15.5422%;\">&nbsp;</td>\n<td style=\"width: 24.9398%;\">&nbsp;</td>\n</tr>\n</tbody>\n</table>\n<table style=\"border-collapse: collapse; width: 100%; height: 112.344px;\" border=\"1\">\n<tbody>\n<tr style=\"height: 22.3906px;\">\n<td style=\"height: 22.3906px; width: 100%;\" rowspan=\"3\">合同说明：<br /><span style=\"font-size: 14px;\">&nbsp; &nbsp; &nbsp; 1、产品的价格以需要方购买产品入库价格为准，产品的价格不含税（如需税票另行协商）</span><br /><span style=\"font-size: 14px;\">&nbsp; &nbsp; &nbsp; 2、供方供货后，需方自货物检验合格、合同约定时间内相应货款，双方另有约定除外。</span><br /><span style=\"font-size: 14px;\">&nbsp; &nbsp; &nbsp; 3、需方逾期不付清款，供方有权收取需方违约金（每逾期一天，按货款金额0.3%计算），并向需方收取欠款</span><span style=\"font-size: 14px;\">&nbsp; &nbsp; &nbsp; 4、一方需要终止履行，需要提前十天以书面形式通知对方，需方应于合同终止履行后的（经双方协定具体多少天）天内将应付货款全部付清。<br /></span></td>\n</tr>\n<tr style=\"height: 67.1719px;\"></tr>\n<tr style=\"height: 22.7812px;\"></tr>\n<tr>\n<td style=\"width: 100%;\"><span style=\"font-size: 14px;\">&nbsp;第一联：收款 （白）&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 第二联：客户（红）&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;第三联：存根（黄）&nbsp; &nbsp;&nbsp;<br /></span></td>\n</tr>\n</tbody>\n</table>\n<div>&nbsp;</div>",
                "dateFormat": "1",
                "fieldList": [
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361792000,
                        "displayOrder": 0,
                        "fieldName": "displayBillNo",
                        "fieldType": "field",
                        "recId": 337150,
                        "templateId": 4543
                    },
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361792000,
                        "displayOrder": 1,
                        "fieldName": "enterDate",
                        "fieldType": "field",
                        "recId": 337151,
                        "templateId": 4543
                    },
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361792000,
                        "displayOrder": 2,
                        "fieldName": "supplierName",
                        "fieldType": "field",
                        "recId": 337152,
                        "templateId": 4543
                    },
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361792000,
                        "displayOrder": 3,
                        "fieldName": "supplierMobile",
                        "fieldType": "field",
                        "recId": 337153,
                        "templateId": 4543
                    },
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361792000,
                        "displayOrder": 4,
                        "fieldName": "aggregateAmountUp",
                        "fieldType": "field",
                        "recId": 337154,
                        "templateId": 4543
                    },
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361792000,
                        "displayOrder": 5,
                        "fieldName": "totalQuantity",
                        "fieldType": "field",
                        "recId": 337155,
                        "templateId": 4543
                    }
                ],
                "isDefault": 0,
                "materialFieldList": [],
                "maxRow": 5,
                "paperSize": "t3_2",
                "prodFieldList": [
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361792000,
                        "displayOrder": 0,
                        "fieldName": "prodCustomNo",
                        "fieldType": "prodField",
                        "recId": 337156,
                        "templateId": 4543
                    },
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361792000,
                        "displayOrder": 1,
                        "fieldName": "prodName",
                        "fieldType": "prodField",
                        "recId": 337157,
                        "templateId": 4543
                    },
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361793000,
                        "displayOrder": 2,
                        "fieldName": "descItem",
                        "fieldType": "prodField",
                        "recId": 337158,
                        "templateId": 4543
                    },
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361793000,
                        "displayOrder": 3,
                        "fieldName": "unit",
                        "fieldType": "prodField",
                        "recId": 337159,
                        "templateId": 4543
                    },
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361793000,
                        "displayOrder": 4,
                        "fieldName": "quantity",
                        "fieldType": "prodField",
                        "recId": 337160,
                        "templateId": 4543
                    },
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361793000,
                        "displayOrder": 5,
                        "fieldName": "unitPrice",
                        "fieldType": "prodField",
                        "recId": 337161,
                        "templateId": 4543
                    },
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361793000,
                        "displayOrder": 6,
                        "fieldName": "amount",
                        "fieldType": "prodField",
                        "recId": 337162,
                        "templateId": 4543
                    },
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361793000,
                        "displayOrder": 7,
                        "fieldName": "remarks",
                        "fieldType": "prodField",
                        "recId": 337163,
                        "templateId": 4543
                    }
                ],
                "sortAryStr": "【序号】-serialNumber,【物品编号】-prodCustomNo,【物品名称】-prodName,【一级类目】-firstCatName,【二级类目】-secondCatName,【三级类目】-thirdCatName,【批次号】-batchNo,【生产日期】-productionDate,【到期日期】-expirationDate,【规格型号】-descItem,【品牌】-brand,【物品图片】-thumbnailUri,【制造商型号】-produceModel,【库存下限】-minQuantity,【库存上限】-maxQuantity,【商品条码】-proBarCode,【自定义字段1】-propertyValue1,【自定义字段2】-propertyValue2,【自定义字段3】-propertyValue3,【自定义字段4】-propertyValue4,【自定义字段5】-propertyValue5,【单据物品自定义字段1】-property_value1,【单据物品自定义字段2】-property_value2,【单据物品自定义字段3】-property_value3,【单据物品自定义字段4】-property_value4,【单据物品自定义字段5】-property_value5,【单位】-unit,【入库数量】-quantity,【辅助单位】-recUnit,【辅助入库数量】-recQuantity,【单位关系】-unitConverter,【税额】-tax,【未税单价】-untaxedPrice,【未税金额】-untaxedAmount,【税率】-taxRate,【含税单价】-unitPrice,【价税合计】-amount,【备注】-remarks",
                "templateName": "采购入库单模板",
                "updatedTime": 1654384400000,
                "wordSize": "14"
            },
            "retCode": "0"
        },
        "recommend-003": {
            "data": {
                "billType": "ProduceOrder",
                "content": "<h3 style=\"text-align: center; line-height: 1;\"><span style=\"font-weight: bold;\">XXXXXX公司</span></h3>\n<p style=\"text-align: center; line-height: 1;\"><span style=\"font-weight: bold;\">生产加工单</span></p>\n<table style=\"border-collapse: collapse; width: 99.9012%; height: 54px;\" border=\"1\">\n<tbody>\n<tr style=\"height: 10px;\">\n<td style=\"width: 8.57856%; height: 10px;\"><span style=\"font-size: 12px;\">系统单号：</span></td>\n<td style=\"width: 29.9554%; height: 10px;\" colspan=\"3\"><span style=\"font-size: 12px;\">【生产单号】</span></td>\n<td style=\"width: 8.57856%; height: 10px;\">&nbsp;</td>\n<td style=\"width: 4.91156%; height: 10px;\">&nbsp;</td>\n<td style=\"width: 12.2456%; height: 10px;\"><span style=\"font-size: 12px;\">单据日期：</span></td>\n<td style=\"width: 17.1571%; height: 10px;\" colspan=\"2\"><span style=\"font-size: 12px;\">【单据日期】</span></td>\n<td style=\"width: 8.59092%; height: 10px;\">&nbsp;</td>\n</tr>\n<tr style=\"height: 22px;\">\n<td style=\"width: 8.57856%; height: 22px;\"><span style=\"font-size: 12px;\">客户单号</span></td>\n<td style=\"width: 29.9554%; height: 22px;\" colspan=\"3\"><span style=\"font-size: 12px;\">【自定义字段1】</span></td>\n<td style=\"width: 8.57856%; height: 22px;\">&nbsp;</td>\n<td style=\"width: 4.91156%; height: 22px;\">&nbsp;</td>\n<td style=\"width: 12.2456%; height: 22px;\"><span style=\"font-size: 12px;\">仓库发料人：</span></td>\n<td style=\"width: 17.1571%; height: 22px;\" colspan=\"2\">&nbsp;</td>\n<td style=\"width: 8.59092%; height: 22px;\">&nbsp;</td>\n</tr>\n<tr style=\"height: 22px;\">\n<td style=\"width: 8.57856%; height: 22px;\"><span style=\"font-size: 12px;\">生产部门</span></td>\n<td style=\"width: 29.9554%; height: 22px;\" colspan=\"3\"><span style=\"font-size: 12px;\">【生产部门】</span></td>\n<td style=\"width: 8.57856%; height: 22px;\">&nbsp;</td>\n<td style=\"width: 4.91156%; height: 22px;\">&nbsp;</td>\n<td style=\"width: 12.2456%; height: 22px;\"><span style=\"font-size: 12px;\">生产人：</span></td>\n<td style=\"width: 8.57856%; height: 22px;\">&nbsp;</td>\n<td style=\"width: 8.57856%; height: 22px;\">&nbsp;</td>\n<td style=\"width: 8.59092%; height: 22px;\">&nbsp;</td>\n</tr>\n</tbody>\n</table>\n<p style=\"line-height: 1;\"><span style=\"font-size: 12px;\">成品项目：</span></p>\n<table id=\"template-tables\" style=\"table-layout: fixed; word-wrap: break-word;\" border=\"1\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\n<tbody>\n<tr>\n<th id=\"ts1-serialNumber\" style=\"text-align: center;font-weight: normal;display:&quot;&quot;\"><span style=\"font-size: 12px;\">序号</span></th>\n<th id=\"ts1-prodCustomNo\" style=\"text-align: center;font-weight: normal;display:&quot;&quot;\"><span style=\"font-size: 12px;\">物品编号</span></th>\n<th id=\"ts1-prodName\" style=\"text-align: center;font-weight: normal;display:&quot;&quot;\"><span style=\"font-size: 12px;\">物品名称</span></th>\n<th id=\"ts1-descItem\" style=\"text-align: center;font-weight: normal;display:&quot;&quot;\"><span style=\"font-size: 12px;\">规格型号</span></th>\n<th id=\"ts1-bomCode\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\"><span style=\"font-size: 12px;\">BOM</span></th>\n<th id=\"ts1-unit\"><span style=\"font-size: 12px;\">单位</span></th>\n<th id=\"ts1-quantity\" style=\"text-align: center; font-weight: normal; border-style: solid;\"><span style=\"font-size: 12px;\">计划生产数量</span></th>\n<th id=\"ts1-remarks\" style=\"text-align: center; font-weight: normal; border-style: solid;\"><span style=\"font-size: 12px;\">备注</span></th>\n</tr>\n<tr>\n<th id=\"ts2-serialNumber\" style=\"text-align: center;font-weight: normal;display:&quot;&quot;\">{序号}</th>\n<th id=\"ts2-prodCustomNo\" style=\"text-align: center;font-weight: normal;display:&quot;&quot;\">{物品编号}</th>\n<th id=\"ts2-prodName\" style=\"text-align: center;font-weight: normal;display:&quot;&quot;\">{物品名称}</th>\n<th id=\"ts2-descItem\" style=\"text-align: center;font-weight: normal;display:&quot;&quot;\">{规格型号}</th>\n<th id=\"ts2-bomCode\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\">{BOM}</th>\n<th id=\"ts2-unit\">{单位}</th>\n<th id=\"ts2-quantity\" style=\"text-align: center; font-weight: normal; border-style: solid;\">{计划生产数量}</th>\n<th id=\"ts2-remarks\" style=\"text-align: center; font-weight: normal; border-style: solid;\">{备注}</th>\n</tr>\n</tbody>\n</table>\n<p style=\"line-height: 1;\"><span style=\"font-size: 12px;\">消耗原料 ：</span></p>\n<table id=\"template-tables1\" style=\"table-layout: fixed; word-wrap: break-word; margin-top: 40px;\" border=\"1\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\n<tbody>\n<tr>\n<th id=\"ts11-serialNumber\" style=\"text-align: center; font-weight: normal; border-style: solid;\"><span style=\"font-size: 12px;\">序号</span></th>\n<th id=\"ts11-prodCustomNo\" style=\"text-align: center; font-weight: normal; border-style: solid;\"><span style=\"font-size: 12px;\">物品编号</span></th>\n<th id=\"ts11-prodName\" style=\"text-align: center; font-weight: normal; border-style: solid;\"><span style=\"font-size: 12px;\">物品名称</span></th>\n<th id=\"ts11-descItem\" style=\"text-align: center; font-weight: normal; border-style: solid;\"><span style=\"font-size: 12px;\">规格型号</span></th>\n<th id=\"ts11-unit\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\"><span style=\"font-size: 12px;\">单位</span></th>\n<th id=\"ts11-brand\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\"><span style=\"font-size: 12px;\">品牌</span></th>\n<th id=\"ts11-produceModel\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\"><span style=\"font-size: 12px;\">制造商型号</span></th>\n<th id=\"ts11-propertyValue1\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\"><span style=\"font-size: 12px;\">单据物品自定义字段1</span></th>\n<th id=\"ts11-propertyValue2\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\"><span style=\"font-size: 12px;\">单据物品自定义字段2</span></th>\n<th id=\"ts11-propertyValue3\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\"><span style=\"font-size: 12px;\">单据物品自定义字段3</span></th>\n<th id=\"ts11-propertyValue4\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\"><span style=\"font-size: 12px;\">单据物品自定义字段4</span></th>\n<th id=\"ts11-propertyValue5\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\"><span style=\"font-size: 12px;\">单据物品自定义字段5</span></th>\n<th id=\"ts11-warehouseName\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\"><span style=\"font-size: 12px;\">仓库</span></th>\n<th id=\"ts11-supplierName\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\"><span style=\"font-size: 12px;\">供应商</span></th>\n<th id=\"ts11-unitConsump\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\"><span style=\"font-size: 12px;\">单位用量</span></th>\n<th id=\"ts11-quantity\" style=\"text-align: center; font-weight: normal; border-style: solid;\"><span style=\"font-size: 12px;\">计划消耗数量</span></th>\n<th id=\"ts11-receiveCount\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\"><span style=\"font-size: 12px;\">领用数量</span></th>\n<th id=\"ts11-rejectCount\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\"><span style=\"font-size: 12px;\">退料数量</span></th>\n<th id=\"ts11-totalReceiveCount\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\"><span style=\"font-size: 12px;\">累计领用量</span></th>\n<th id=\"ts11-remarks\" style=\"text-align: center; font-weight: normal; border-style: solid;\"><span style=\"font-size: 12px;\">备注</span></th>\n</tr>\n<tr>\n<th id=\"ts22-serialNumber\" style=\"text-align: center; font-weight: normal; border-style: solid;\">{序号}</th>\n<th id=\"ts22-prodCustomNo\" style=\"text-align: center; font-weight: normal; border-style: solid;\">{物品编号}</th>\n<th id=\"ts22-prodName\" style=\"text-align: center; font-weight: normal; border-style: solid;\">{物品名称}</th>\n<th id=\"ts22-descItem\" style=\"text-align: center; font-weight: normal; border-style: solid;\">{规格型号}</th>\n<th id=\"ts22-unit\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\">{单位}</th>\n<th id=\"ts22-brand\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\">{品牌}</th>\n<th id=\"ts22-produceModel\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\">{制造商型号}</th>\n<th id=\"ts22-propertyValue1\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\">{单据物品自定义字段1}</th>\n<th id=\"ts22-propertyValue2\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\">{单据物品自定义字段2}</th>\n<th id=\"ts22-propertyValue3\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\">{单据物品自定义字段3}</th>\n<th id=\"ts22-propertyValue4\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\">{单据物品自定义字段4}</th>\n<th id=\"ts22-propertyValue5\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\">{单据物品自定义字段5}</th>\n<th id=\"ts22-warehouseName\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\">{仓库}</th>\n<th id=\"ts22-supplierName\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\">{供应商}</th>\n<th id=\"ts22-unitConsump\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\">{单位用量}</th>\n<th id=\"ts22-quantity\" style=\"text-align: center; font-weight: normal; border-style: solid;\">{计划消耗数量}</th>\n<th id=\"ts22-receiveCount\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\">{领用数量}</th>\n<th id=\"ts22-rejectCount\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\">{退料数量}</th>\n<th id=\"ts22-totalReceiveCount\" style=\"text-align: center; font-weight: normal; display: none; border-style: solid;\">{累计领用量}</th>\n<th id=\"ts22-remarks\" style=\"text-align: center; font-weight: normal; border-style: solid;\">{备注}</th>\n</tr>\n</tbody>\n</table>\n<p style=\"line-height: 1;\"><span style=\"font-size: 12px;\">备注：【自定义字段2】</span></p>\n<table style=\"border-collapse: collapse; width: 99.9012%; height: 185px;\" border=\"1\">\n<tbody>\n<tr style=\"height: 17px;\">\n<td style=\"width: 11.074%; height: 17px;\"><span style=\"font-size: 12px;\">注意事项</span></td>\n<td style=\"height: 17px; width: 88.6912%;\" colspan=\"7\"><span style=\"font-size: 12px;\">1、所有产品外观（轻微缺陷）不能超过2%，致命缺陷不能超过1%（参照我司品质检验标准）</span></td>\n</tr>\n<tr style=\"height: 21px;\">\n<td style=\"width: 11.074%; height: 21px;\">&nbsp;</td>\n<td style=\"height: 21px; width: 88.6912%;\" colspan=\"7\"><span style=\"font-size: 12px;\">2、所有产品电性功能不良不能超过0.3%,</span></td>\n</tr>\n<tr style=\"height: 21px;\">\n<td style=\"width: 11.074%; height: 21px;\">&nbsp;</td>\n<td style=\"height: 21px; width: 88.6912%;\" colspan=\"7\"><span style=\"font-size: 12px;\">3、所有产品必须达到我司环保要求，所有加工材料必须环保。</span></td>\n</tr>\n<tr style=\"height: 21px;\">\n<td style=\"width: 11.074%; height: 21px;\">&nbsp;</td>\n<td style=\"height: 21px; width: 88.6912%;\" colspan=\"7\"><span style=\"font-size: 12px;\">4、外观功能超过我司标准退货（或者派人返工），如没有及时处理影响我司出货需承担我司因此单延误带来的所有损失，环保问题需承担我司所有损失。</span></td>\n</tr>\n<tr style=\"height: 21px;\">\n<td style=\"width: 11.074%; height: 21px;\"><span style=\"font-size: 12px;\">包装：</span></td>\n<td style=\"height: 21px; width: 88.6912%;\" colspan=\"7\"><span style=\"font-size: 12px;\">根据我司实际标准</span></td>\n</tr>\n<tr style=\"height: 21px;\">\n<td style=\"width: 11.074%; height: 21px;\"><span style=\"font-size: 12px;\">运输方式</span></td>\n<td style=\"height: 21px; width: 88.6912%;\" colspan=\"7\"><span style=\"font-size: 12px;\">所有外发加工货物送至我司指定仓库由仓库负责人签收</span></td>\n</tr>\n<tr style=\"height: 21px;\">\n<td style=\"width: 11.074%; height: 21px;\"><span style=\"font-size: 12px;\">结款方式：</span></td>\n<td style=\"height: 21px; width: 88.6912%;\" colspan=\"7\"><span style=\"font-size: 12px;\">月结30天</span></td>\n</tr>\n<tr style=\"height: 21px;\">\n<td style=\"width: 23.7495%; height: 21px;\" colspan=\"2\"><span style=\"font-size: 12px;\">生产负责人签字：</span></td>\n<td style=\"width: 12.6858%; height: 21px;\">&nbsp;</td>\n<td style=\"width: 12.6858%; height: 21px;\">&nbsp;</td>\n<td style=\"width: 12.6858%; height: 21px;\"><span style=\"font-size: 12px;\">审核人签字：</span></td>\n<td style=\"width: 12.6858%; height: 21px;\">&nbsp;</td>\n<td style=\"width: 12.5867%; height: 21px;\">&nbsp;</td>\n<td style=\"width: 12.6858%; height: 21px;\">&nbsp;</td>\n</tr>\n</tbody>\n</table>\n<div>&nbsp;</div>",
                "dateFormat": "1",
                "fieldList": [
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263601000,
                        "displayOrder": 0,
                        "fieldName": "billNo",
                        "fieldType": "field",
                        "recId": 335507,
                        "templateId": 4513
                    },
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263601000,
                        "displayOrder": 1,
                        "fieldName": "orderDate",
                        "fieldType": "field",
                        "recId": 335508,
                        "templateId": 4513
                    },
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263601000,
                        "displayOrder": 2,
                        "fieldName": "property_value1",
                        "fieldType": "field",
                        "recId": 335509,
                        "templateId": 4513
                    },
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263601000,
                        "displayOrder": 3,
                        "fieldName": "departmentName",
                        "fieldType": "field",
                        "recId": 335510,
                        "templateId": 4513
                    },
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263601000,
                        "displayOrder": 4,
                        "fieldName": "property_value2",
                        "fieldType": "field",
                        "recId": 335511,
                        "templateId": 4513
                    }
                ],
                "isDefault": 0,
                "materialFieldList": [
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263601000,
                        "displayOrder": 0,
                        "fieldName": "serialNumber",
                        "fieldType": "materialProdField",
                        "recId": 335519,
                        "templateId": 4513
                    },
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263601000,
                        "displayOrder": 1,
                        "fieldName": "prodCustomNo",
                        "fieldType": "materialProdField",
                        "recId": 335520,
                        "templateId": 4513
                    },
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263601000,
                        "displayOrder": 2,
                        "fieldName": "prodName",
                        "fieldType": "materialProdField",
                        "recId": 335521,
                        "templateId": 4513
                    },
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263601000,
                        "displayOrder": 3,
                        "fieldName": "descItem",
                        "fieldType": "materialProdField",
                        "recId": 335522,
                        "templateId": 4513
                    },
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263601000,
                        "displayOrder": 4,
                        "fieldName": "quantity",
                        "fieldType": "materialProdField",
                        "recId": 335523,
                        "templateId": 4513
                    },
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263601000,
                        "displayOrder": 5,
                        "fieldName": "remarks",
                        "fieldType": "materialProdField",
                        "recId": 335524,
                        "templateId": 4513
                    }
                ],
                "maxRow": 5,
                "paperSize": "a4_h",
                "prodFieldList": [
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263601000,
                        "displayOrder": 0,
                        "fieldName": "serialNumber",
                        "fieldType": "prodField",
                        "recId": 335512,
                        "templateId": 4513
                    },
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263601000,
                        "displayOrder": 1,
                        "fieldName": "prodCustomNo",
                        "fieldType": "prodField",
                        "recId": 335513,
                        "templateId": 4513
                    },
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263601000,
                        "displayOrder": 2,
                        "fieldName": "prodName",
                        "fieldType": "prodField",
                        "recId": 335514,
                        "templateId": 4513
                    },
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263601000,
                        "displayOrder": 3,
                        "fieldName": "descItem",
                        "fieldType": "prodField",
                        "recId": 335515,
                        "templateId": 4513
                    },
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263601000,
                        "displayOrder": 4,
                        "fieldName": "unit",
                        "fieldType": "prodField",
                        "recId": 335516,
                        "templateId": 4513
                    },
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263601000,
                        "displayOrder": 5,
                        "fieldName": "quantity",
                        "fieldType": "prodField",
                        "recId": 335517,
                        "templateId": 4513
                    },
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263601000,
                        "displayOrder": 6,
                        "fieldName": "remarks",
                        "fieldType": "prodField",
                        "recId": 335518,
                        "templateId": 4513
                    }
                ],
                "sortAryStr": "【序号】-serialNumber,【物品编号】-prodCustomNo,【物品名称】-prodName,【规格型号】-descItem,【单位】-unit,【品牌】-brand,【制造商型号】-produceModel,【单据物品自定义字段1】-propertyValue1,【单据物品自定义字段2】-propertyValue2,【单据物品自定义字段3】-propertyValue3,【单据物品自定义字段4】-propertyValue4,【单据物品自定义字段5】-propertyValue5,【BOM】-bomCode,【销售单号】-saleDisplayBillNo,【客户订单号】-customerOrderNo,【销售数量】-saleQuantity,【交付日期】-saleDeliveryDeadlineDate,【计划生产数量】-quantity,【投产数量】-expectCount,【已生产数量】-finishCount,【已入库数量】-enterCount,【待入库数量】-unEnterCount,【备注】-remarks",
                "sortmAryStr": "【序号】-serialNumber,【物品编号】-prodCustomNo,【物品名称】-prodName,【规格型号】-descItem,【单位】-unit,【品牌】-brand,【制造商型号】-produceModel,【单据物品自定义字段1】-propertyValue1,【单据物品自定义字段2】-propertyValue2,【单据物品自定义字段3】-propertyValue3,【单据物品自定义字段4】-propertyValue4,【单据物品自定义字段5】-propertyValue5,【仓库】-warehouseName,【供应商】-supplierName,【单位用量】-unitConsump,【计划消耗数量】-quantity,【领用数量】-receiveCount,【退料数量】-rejectCount,【累计领用量】-totalReceiveCount,【备注】-remarks",
                "templateName": "生产单模板（电子行业）",
                "updatedTime": 1654384400000,
                "wordSize": "12"
            },
            "retCode": "0"
        },
        "recommend-004": {
            "data": {
                "billType": "OutWarehouse_6",
                "content": "<h3 style=\"text-align: center;\"><span style=\"font-weight: bold;\">XXXXXX公司<br />外协加工合同</span></h3>\n<table style=\"border-collapse: collapse; width: 99.9511%; background-color: #ffffff; border-color: #ffffff; border-style: solid;\" border=\"1\">\n<tbody>\n<tr>\n<td style=\"width: 12.5184%; line-height: 1;\"><span style=\"font-size: 14px;\">加工厂商</span></td>\n<td style=\"width: 23.7113%; line-height: 1;\" colspan=\"2\"><span style=\"font-size: 14px;\">【供应商】</span></td>\n<td style=\"width: 9.13108%; line-height: 1;\"><span style=\"font-size: 14px;\">项目</span></td>\n<td style=\"width: 18.9706%; line-height: 1;\" colspan=\"2\"><span style=\"font-size: 14px;\">【项目】</span></td>\n<td style=\"width: 12.6657%; line-height: 1;\"><span style=\"font-size: 14px;\">计划排单</span></td>\n<td style=\"width: 22.975%; line-height: 1;\" colspan=\"2\">&nbsp;</td>\n</tr>\n<tr>\n<td style=\"width: 12.5184%; line-height: 1;\"><span style=\"font-size: 14px;\">联系人</span></td>\n<td style=\"width: 22.2408%; line-height: 1;\"><span style=\"font-size: 14px;\">【供应商-联系人】</span></td>\n<td style=\"width: 1.47059%; line-height: 1;\">&nbsp;</td>\n<td style=\"width: 9.13108%; line-height: 1;\"><span style=\"font-size: 14px;\">电话</span></td>\n<td style=\"width: 18.9706%; line-height: 1;\" colspan=\"2\"><span style=\"font-size: 14px;\">【供应商-联系电话】</span></td>\n<td style=\"width: 12.6657%; line-height: 1;\"><span style=\"font-size: 14px;\">日期</span></td>\n<td style=\"width: 19.5876%; line-height: 1;\"><span style=\"font-size: 14px;\">【出库日期】</span></td>\n<td style=\"width: 3.38733%; line-height: 1;\">&nbsp;</td>\n</tr>\n</tbody>\n</table>\n<div>\n<table id=\"template-tables\" style=\"table-layout: fixed; overflow-wrap: break-word; height: 44px; width: 99.0704%;\" border=\"1\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\n<tbody>\n<tr>\n<th id=\"ts1-prodName\" style=\"font-weight: bold; height: 22px; width: 13.7982%; text-align: center;\"><span style=\"font-size: 12px; font-family: 'book antiqua', palatino, serif;\">物品名称</span></th>\n<th id=\"ts1-prodCustomNo\" style=\"text-align: center; font-weight: bold; height: 22px; width: 15.4303%;\"><span style=\"font-size: 12px; font-family: 'book antiqua', palatino, serif;\">物品编号</span></th>\n<th id=\"ts1-firstCatName\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\"><span style=\"font-size: 12px;\">一级类目</span></th>\n<th id=\"ts1-descItem\" style=\"font-weight: bold; height: 22px; width: 44.6566%; text-align: center;\"><span style=\"font-size: 12px; font-family: 'book antiqua', palatino, serif;\">规格型号</span></th>\n<th id=\"ts1-unit\" style=\"font-weight: bold; height: 22px; width: 9.79228%; text-align: center;\"><span style=\"font-size: 12px; font-family: 'book antiqua', palatino, serif;\">单位</span></th>\n<th id=\"ts1-quantity\" style=\"text-align: center; font-weight: bold; height: 22px; width: 9.19881%;\"><span style=\"font-size: 12px; font-family: 'book antiqua', palatino, serif;\">出库数量</span></th>\n<th id=\"ts1-unitPrice\" style=\"text-align: center; font-weight: bold; display: none; height: 22px; width: 0%;\"><span style=\"font-size: 12px; font-family: 'book antiqua', palatino, serif;\">含税单价</span></th>\n<th id=\"ts1-amount\" style=\"text-align: center; font-weight: bold; display: none; height: 22px; width: 0.271136%;\"><span style=\"font-size: 12px; font-family: 'book antiqua', palatino, serif;\">价税合计</span></th>\n<th id=\"ts1-remarks\" style=\"text-align: center; font-weight: bold; height: 22px; width: 8.75371%;\"><span style=\"font-size: 12px; font-family: 'book antiqua', palatino, serif;\">备注</span></th>\n</tr>\n<tr>\n<th id=\"ts2-prodName\" style=\"text-align: center; height: 22px; width: 13.7982%;\"><span style=\"font-size: 16px; font-family: 'book antiqua', palatino, serif;\">{物品名称}</span></th>\n<th id=\"ts2-prodCustomNo\" style=\"text-align: center; height: 22px; width: 15.4303%;\"><span style=\"font-size: 16px; font-family: 'book antiqua', palatino, serif;\">{物品编号}</span></th>\n<th id=\"ts2-firstCatName\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\">{一级类目}</th>\n<th id=\"ts2-descItem\" style=\"height: 22px; width: 44.6566%; text-align: left;\"><span style=\"font-size: 16px; font-family: 'book antiqua', palatino, serif;\">{规格型号}</span></th>\n<th id=\"ts2-unit\" style=\"text-align: center; height: 22px; width: 9.79228%;\"><span style=\"font-size: 16px; font-family: 'book antiqua', palatino, serif;\">{单位}</span></th>\n<th id=\"ts2-quantity\" style=\"text-align: center; height: 22px; width: 9.19881%;\"><span style=\"font-size: 16px; font-family: 'book antiqua', palatino, serif;\">{出库数量}</span></th>\n<th id=\"ts2-unitPrice\" style=\"text-align: center; font-weight: bold; display: none; height: 22px; width: 0%;\"><span style=\"font-size: 16px; font-family: 'book antiqua', palatino, serif;\">{含税单价}</span></th>\n<th id=\"ts2-amount\" style=\"text-align: center; font-weight: bold; display: none; height: 22px; width: 0.271136%;\"><span style=\"font-size: 16px; font-family: 'book antiqua', palatino, serif;\">{价税合计}</span></th>\n<th id=\"ts2-remarks\" style=\"text-align: center; height: 22px; width: 8.75371%;\"><span style=\"font-size: 16px; font-family: 'book antiqua', palatino, serif;\">{备注}</span></th>\n</tr>\n</tbody>\n</table>\n</div>\n<table style=\"border-collapse: collapse; width: 98.9721%; height: 200px;\" border=\"1\">\n<tbody>\n<tr style=\"height: 21.2188px;\">\n<td style=\"width: 11.4331%; height: 20px; line-height: 1;\"><span style=\"font-size: 12px;\">注意事项：</span></td>\n<td style=\"width: 88.5529%; height: 20px; line-height: 1;\" colspan=\"9\"><span style=\"font-size: 12px;\">1、所有产品外观(轻微缺陷)不能超过2%,致命缺陷不能超过1%(参照我司品质检验标准)</span></td>\n</tr>\n<tr style=\"height: 21.2188px;\">\n<td style=\"width: 11.4331%; height: 20px; line-height: 1;\">&nbsp;</td>\n<td style=\"width: 88.5529%; height: 20px; line-height: 1;\" colspan=\"9\"><span style=\"font-size: 12px;\">2、所有产品电性功能不良不能超过0.3%</span></td>\n</tr>\n<tr style=\"height: 21.2188px;\">\n<td style=\"width: 11.4331%; height: 20px; line-height: 1;\">&nbsp;</td>\n<td style=\"width: 88.5529%; height: 20px; line-height: 1;\" colspan=\"9\"><span style=\"font-size: 12px;\">3、所有产品必须达到我司环保要求,所有加工材料必须环保。</span></td>\n</tr>\n<tr style=\"height: 21.2188px;\">\n<td style=\"width: 11.4331%; height: 20px; line-height: 1;\">&nbsp;</td>\n<td style=\"width: 88.5529%; height: 20px; line-height: 1;\" colspan=\"9\"><span style=\"font-size: 12px;\">4、外观功能超过我司标准退货(或者派人返工),如没有及时处理影响我可出货需承担我司因此单&nbsp;</span></td>\n</tr>\n<tr style=\"height: 21.2188px;\">\n<td style=\"width: 11.4331%; height: 20px; line-height: 1;\">&nbsp;</td>\n<td style=\"width: 88.5529%; height: 20px; line-height: 1;\" colspan=\"9\"><span style=\"font-size: 12px;\">适误带来的所有损失,环保问题需承担我司所有损失。</span></td>\n</tr>\n<tr style=\"height: 21.2188px;\">\n<td style=\"width: 11.4331%; height: 20px; line-height: 1;\"><span style=\"font-size: 12px;\">包装</span></td>\n<td style=\"width: 88.5529%; height: 20px; line-height: 1;\" colspan=\"9\"><span style=\"font-size: 12px;\">根据我司实际标准</span></td>\n</tr>\n<tr style=\"height: 21.2188px;\">\n<td style=\"width: 11.4331%; height: 20px; line-height: 1;\"><span style=\"font-size: 12px;\">运输方式</span></td>\n<td style=\"height: 20px; width: 88.5529%; line-height: 1;\" colspan=\"9\"><span style=\"font-size: 12px;\">所开有外发加工货物送至我司指定仓库由仓库负责人签收&nbsp;</span></td>\n</tr>\n<tr style=\"height: 21.2188px;\">\n<td style=\"width: 11.4331%; height: 20px; line-height: 1;\"><span style=\"font-size: 12px;\">结算方式：</span></td>\n<td style=\"height: 20px; width: 88.5529%; line-height: 1;\" colspan=\"9\"><span style=\"font-size: 12px;\">月结30天</span></td>\n</tr>\n<tr style=\"height: 21.2188px;\">\n<td style=\"width: 11.4331%; height: 20px; line-height: 1;\"><span style=\"font-size: 12px;\">其他备注</span></td>\n<td style=\"height: 20px; width: 88.5529%; line-height: 1;\" colspan=\"9\"><span style=\"font-size: 12px;\">【备注】</span></td>\n</tr>\n<tr style=\"height: 21.2188px;\">\n<td style=\"height: 20px; width: 15.14%; line-height: 1;\" colspan=\"2\"><span style=\"font-size: 12px;\">加工商负责人</span></td>\n<td style=\"width: 13.2264%; height: 20px; line-height: 1;\">&nbsp;</td>\n<td style=\"width: 9.95542%; height: 20px; line-height: 1;\">&nbsp;</td>\n<td style=\"width: 14.7103%; height: 20px; line-height: 1;\"><span style=\"font-size: 12px;\">外发负责人：</span></td>\n<td style=\"width: 4.75483%; height: 20px; line-height: 1;\">&nbsp;</td>\n<td style=\"width: 9.36107%; height: 20px; line-height: 1;\">&nbsp;</td>\n<td style=\"width: 15.156%; height: 20px; line-height: 1;\"><span style=\"font-size: 12px;\">仓库发料人：</span></td>\n<td style=\"width: 5.34918%; height: 20px; line-height: 1;\">&nbsp;</td>\n<td style=\"width: 12.3328%; height: 20px; line-height: 1;\">&nbsp;</td>\n</tr>\n</tbody>\n</table>\n<div>&nbsp;</div>",
                "dateFormat": "1",
                "fieldList": [
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263826000,
                        "displayOrder": 0,
                        "fieldName": "supplierName",
                        "fieldType": "field",
                        "recId": 335525,
                        "templateId": 4514
                    },
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263826000,
                        "displayOrder": 1,
                        "fieldName": "projectName",
                        "fieldType": "field",
                        "recId": 335526,
                        "templateId": 4514
                    },
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263826000,
                        "displayOrder": 2,
                        "fieldName": "supplierContacterName",
                        "fieldType": "field",
                        "recId": 335527,
                        "templateId": 4514
                    },
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263826000,
                        "displayOrder": 3,
                        "fieldName": "supplierTelNo",
                        "fieldType": "field",
                        "recId": 335528,
                        "templateId": 4514
                    },
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263826000,
                        "displayOrder": 4,
                        "fieldName": "outDate",
                        "fieldType": "field",
                        "recId": 335529,
                        "templateId": 4514
                    },
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263826000,
                        "displayOrder": 5,
                        "fieldName": "remarks",
                        "fieldType": "field",
                        "recId": 335530,
                        "templateId": 4514
                    }
                ],
                "isDefault": 0,
                "materialFieldList": [],
                "maxRow": 15,
                "paperSize": "a4_z",
                "prodFieldList": [
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263826000,
                        "displayOrder": 0,
                        "fieldName": "prodName",
                        "fieldType": "prodField",
                        "recId": 335531,
                        "templateId": 4514
                    },
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263826000,
                        "displayOrder": 1,
                        "fieldName": "prodCustomNo",
                        "fieldType": "prodField",
                        "recId": 335532,
                        "templateId": 4514
                    },
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263826000,
                        "displayOrder": 2,
                        "fieldName": "descItem",
                        "fieldType": "prodField",
                        "recId": 335533,
                        "templateId": 4514
                    },
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263826000,
                        "displayOrder": 3,
                        "fieldName": "unit",
                        "fieldType": "prodField",
                        "recId": 335534,
                        "templateId": 4514
                    },
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263826000,
                        "displayOrder": 4,
                        "fieldName": "quantity",
                        "fieldType": "prodField",
                        "recId": 335535,
                        "templateId": 4514
                    },
                    {
                        "addedLoginName": "18123781935",
                        "addedTime": 1641263826000,
                        "displayOrder": 5,
                        "fieldName": "remarks",
                        "fieldType": "prodField",
                        "recId": 335536,
                        "templateId": 4514
                    }
                ],
                "sortAryStr": "【序号】-serialNumber,【物品名称】-prodName,【物品编号】-prodCustomNo,【一级类目】-firstCatName,【二级类目】-secondCatName,【三级类目】-thirdCatName,【批次号】-batchNo,【生产日期】-productionDate,【到期日期】-expirationDate,【规格型号】-descItem,【品牌】-brand,【制造商型号】-produceModel,【物品图片】-thumbnailUri,【库存下限】-minQuantity,【库存上限】-maxQuantity,【商品条码】-proBarCode,【自定义字段1】-propertyValue1,【自定义字段2】-propertyValue2,【自定义字段3】-propertyValue3,【自定义字段4】-propertyValue4,【自定义字段5】-propertyValue5,【单据物品自定义字段1】-property_value1,【单据物品自定义字段2】-property_value2,【单据物品自定义字段3】-property_value3,【单据物品自定义字段4】-property_value4,【单据物品自定义字段5】-property_value5,【单位】-unit,【出库数量】-quantity,【辅助单位】-recUnit,【辅助出库数量】-recQuantity,【单位关系】-unitConverter,【税额】-tax,【未税单价】-untaxedPrice,【未税金额】-untaxedAmount,【税率】-taxRate,【含税单价】-unitPrice,【价税合计】-amount,【备注】-remarks",
                "templateName": "委外领料出库单模板",
                "updatedTime": 1654384400000,
                "wordSize": "12"
            },
            "retCode": "0"
        },
        "recommend-005": {
            "data": {
                "billType": "OutWarehouse_2",
                "content": "<h3 style=\"text-align: center;\"><span style=\"font-size: 18.72px;\">XXXXXXXXXXXXXXXXXXXXXXXXXXXXX公司</span></h3>\n<h3 style=\"text-align: center;\"><span style=\"font-size: 18.72px;\">物料送货单</span></h3>\n<table style=\"border-collapse: collapse; width: 100%; border-color: #000000; border-style: solid;\" border=\"1\">\n<tbody>\n<tr>\n<td style=\"width: 21.7591%;\"><span style=\"font-size: 8px;\">项目名称（含项目编码）</span></td>\n<td style=\"width: 32.3603%;\"><span style=\"font-size: 8px;\">【项目】</span></td>\n<td style=\"width: 10.2942%;\"><span style=\"font-size: 8px;\">合同编号</span></td>\n<td style=\"width: 27.3356%;\"><span style=\"font-size: 8px;\">【上游单号】</span></td>\n</tr>\n<tr>\n<td style=\"width: 21.7591%;\"><span style=\"font-size: 8px;\">合同签署人</span></td>\n<td style=\"width: 32.3603%;\">&nbsp;</td>\n<td style=\"width: 10.2942%;\"><span style=\"font-size: 8px;\">送货日期</span></td>\n<td style=\"width: 27.3356%;\"><span style=\"font-size: 8px;\">【出库日期】</span></td>\n</tr>\n<tr>\n<td style=\"width: 21.7591%;\"><span style=\"font-size: 8px;\">采购申请单编号（可多个）</span></td>\n<td style=\"width: 32.3603%;\">&nbsp;</td>\n<td style=\"width: 10.2942%;\"><span style=\"font-size: 8px;\">送货单位</span></td>\n<td style=\"width: 27.3356%;\"><span style=\"font-size: 8px;\">XXXXXXXXXXXXXXXXXX公司</span></td>\n</tr>\n</tbody>\n</table>\n<table id=\"template-tables\" style=\"border-collapse: collapse; width: 100%; height: 32px; border-color: #000000; border-style: solid;\" border=\"1\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\n<tbody>\n<tr style=\"height: 10px;\">\n<th id=\"ts1-serialNumber\" style=\"text-align: center; font-weight: normal; height: 10px; width: 0.99108%;\">\n<p><span style=\"font-size: 12px;\">编码</span></p>\n</th>\n<th id=\"ts1-prodName\" style=\"text-align: center; font-weight: normal; height: 10px; width: 0.99108%;\"><span style=\"font-size: 12px;\">物品名称</span></th>\n<th id=\"ts1-descItem\" style=\"text-align: center; font-weight: normal; height: 10px; width: 2.28434%;\"><span style=\"font-size: 12px;\">规格型号</span></th>\n<th id=\"ts1-brand\" style=\"text-align: center; font-weight: normal; height: 10px; width: 2.77546%;\">\n<p><span style=\"font-size: 12px;\">品牌</span></p>\n</th>\n<th id=\"ts1-unit\" style=\"text-align: center; font-weight: normal; height: 10px; width: 2.64318%;\">\n<p><span style=\"font-size: 12px;\">计量单位</span></p>\n</th>\n<th id=\"ts1-quantity\" style=\"text-align: center; font-weight: normal; height: 10px; width: 2.57327%;\">\n<p><span style=\"font-size: 12px;\">送货数量</span></p>\n</th>\n<th id=\"ts1-property_value1\" style=\"text-align: center; font-weight: normal; height: 10px; width: 5.13948%; display: none;\">\n<p><span style=\"font-size: 8px;\">名称</span></p>\n</th>\n<th id=\"ts1-property_value2\" style=\"text-align: center; font-weight: normal; height: 10px; width: 12.493%; display: none;\">\n<p><span style=\"font-size: 8px;\">规格</span></p>\n<p><span style=\"font-size: 8px;\">型号</span></p>\n</th>\n<th id=\"ts1-property_value3\" style=\"text-align: center; font-weight: normal; height: 10px; width: 3.03028%; display: none;\">\n<p><span style=\"font-size: 8px;\">原始</span></p>\n<p><span style=\"font-size: 8px;\">数量</span></p>\n</th>\n<th id=\"ts1-property_value4\" style=\"text-align: center; font-weight: normal; height: 10px; width: 2.20264%; display: none;\">\n<p><span style=\"font-size: 8px;\">累计送<br />货数量</span></p>\n</th>\n<th id=\"ts1-propertyValue2\" style=\"text-align: center; font-weight: normal; display: none; width: 9.98531%; height: 10px;\">\n<pre><span style=\"font-size: 8px;\">规格</span></pre>\n</th>\n<th id=\"ts1-propertyValue1\" style=\"text-align: center; font-weight: normal; height: 10px; width: 17.9921%; display: none;\">\n<pre><span style=\"font-size: 8px;\">名称</span></pre>\n</th>\n<th id=\"ts1-propertyValue3\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 10px;\">\n<pre><span style=\"font-size: 8px;\">原始数量</span></pre>\n</th>\n<th id=\"ts1-propertyValue4\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 10px;\">\n<pre><span style=\"font-size: 8px;\">累计送</span></pre>\n<pre><span style=\"font-size: 8px;\">货数量</span></pre>\n</th>\n<th id=\"ts1-prodCustomNo\" style=\"text-align: center; font-weight: normal; display: none; height: 10px; width: 0%;\">物品编号</th>\n<th id=\"ts1-firstCatName\" style=\"text-align: center; font-weight: normal; display: none; height: 10px; width: 0%;\">一级类目</th>\n<th id=\"ts1-secondCatName\" style=\"text-align: center; font-weight: normal; display: none; height: 10px; width: 0%;\">二级类目</th>\n<th id=\"ts1-thirdCatName\" style=\"text-align: center; font-weight: normal; display: none; height: 10px; width: 0%;\">三级类目</th>\n<th id=\"ts1-batchNo\" style=\"text-align: center; font-weight: normal; display: none; height: 10px; width: 0%;\">批次号</th>\n<th id=\"ts1-productionDate\" style=\"text-align: center; font-weight: normal; display: none; height: 10px; width: 0%;\">生产日期</th>\n<th id=\"ts1-expirationDate\" style=\"text-align: center; font-weight: normal; display: none; height: 10px; width: 0%;\">到期日期</th>\n<th id=\"ts1-produceModel\" style=\"text-align: center; font-weight: normal; display: none; height: 10px; width: 0%;\">制造商型号</th>\n<th id=\"ts1-thumbnailUri\" style=\"text-align: center; font-weight: normal; display: none; height: 10px; width: 0%;\">物品图片</th>\n<th id=\"ts1-minQuantity\" style=\"text-align: center; font-weight: normal; display: none; height: 10px; width: 0%;\">库存下限</th>\n<th id=\"ts1-maxQuantity\" style=\"text-align: center; font-weight: normal; display: none; height: 10px; width: 0%;\">库存上限</th>\n<th id=\"ts1-proBarCode\" style=\"text-align: center; font-weight: normal; display: none; height: 10px; width: 0%;\">商品条码</th>\n<th id=\"ts1-propertyValue5\" style=\"text-align: center; font-weight: normal; display: none; height: 10px; width: 0%;\">自定义字段5</th>\n<th id=\"ts1-property_value5\" style=\"text-align: center; font-weight: normal; display: none; height: 10px; width: 0%;\">单据物品自定义字段5</th>\n<th id=\"ts1-recUnit\" style=\"text-align: center; font-weight: normal; display: none; height: 10px; width: 0%;\">辅助单位</th>\n<th id=\"ts1-recQuantity\" style=\"text-align: center; font-weight: normal; display: none; height: 10px; width: 0%;\">辅助出库数量</th>\n<th id=\"ts1-unitConverter\" style=\"text-align: center; font-weight: normal; display: none; height: 10px; width: 0%;\">单位关系</th>\n<th id=\"ts1-tax\" style=\"text-align: center; font-weight: normal; display: none; height: 10px; width: 0%;\">税额</th>\n<th id=\"ts1-untaxedPrice\" style=\"text-align: center; font-weight: normal; display: none; height: 10px; width: 0%;\">未税单价</th>\n<th id=\"ts1-untaxedAmount\" style=\"text-align: center; font-weight: normal; display: none; height: 10px; width: 0%;\">未税金额</th>\n<th id=\"ts1-taxRate\" style=\"text-align: center; font-weight: normal; display: none; height: 10px; width: 0%;\">税率</th>\n<th id=\"ts1-unitPrice\" style=\"text-align: center; font-weight: normal; display: none; height: 10px; width: 0%;\">含税单价</th>\n<th id=\"ts1-amount\" style=\"text-align: center; font-weight: normal; display: none; height: 10px; width: 0%;\">价税合计</th>\n<th id=\"ts1-remarks\" style=\"text-align: center; font-weight: normal; display: none; height: 10px; width: 0%;\">备注</th>\n</tr>\n<tr style=\"height: 22px;\">\n<th id=\"ts2-serialNumber\" style=\"text-align: center; font-weight: normal; height: 22px; width: 0.99108%;\">\n<p><span style=\"font-size: 12px;\">{序号}</span></p>\n</th>\n<th id=\"ts2-prodName\" style=\"text-align: center; font-weight: normal; height: 22px; width: 0.99108%;\"><span style=\"font-size: 12px;\">{物品名称}</span></th>\n<th id=\"ts2-descItem\" style=\"text-align: center; font-weight: normal; height: 22px; width: 2.28434%;\"><span style=\"font-size: 12px;\">{规格型号}</span></th>\n<th id=\"ts2-brand\" style=\"text-align: center; font-weight: normal; height: 22px; width: 2.77546%;\">\n<p><span style=\"font-size: 12px;\">{品牌}</span></p>\n</th>\n<th id=\"ts2-unit\" style=\"text-align: center; font-weight: normal; height: 22px; width: 2.64318%;\">\n<p><span style=\"font-size: 12px;\">{单位}</span></p>\n</th>\n<th id=\"ts2-quantity\" style=\"text-align: center; font-weight: normal; height: 22px; width: 2.57327%;\">\n<p><span style=\"font-size: 12px;\">{出库数量}</span></p>\n</th>\n<th id=\"ts2-property_value1\" style=\"text-align: center; font-weight: normal; height: 22px; width: 5.13948%; display: none;\">\n<p><span style=\"font-size: 8px;\">{单据物品自定义字段1}</span></p>\n</th>\n<th id=\"ts2-property_value2\" style=\"text-align: center; font-weight: normal; height: 22px; width: 12.493%; display: none;\">\n<p><span style=\"font-size: 8px;\">{单据物品自定义字段2}</span></p>\n</th>\n<th id=\"ts2-property_value3\" style=\"text-align: center; font-weight: normal; height: 22px; width: 3.03028%; display: none;\">\n<p><span style=\"font-size: 8px;\">{单据物品自定义字段3}</span></p>\n</th>\n<th id=\"ts2-property_value4\" style=\"text-align: center; font-weight: normal; height: 22px; width: 2.20264%; display: none;\">\n<p><span style=\"font-size: 8px;\">{单据物品自定义字段4}</span></p>\n</th>\n<th id=\"ts2-propertyValue2\" style=\"text-align: center; font-weight: normal; display: none; width: 9.98531%; height: 22px;\">\n<pre><span style=\"font-size: 8px;\">{自定义字段2}</span></pre>\n</th>\n<th id=\"ts2-propertyValue1\" style=\"text-align: center; font-weight: normal; height: 22px; width: 17.9921%; display: none;\">\n<pre><span style=\"font-size: 8px;\">{自定义字段1}</span></pre>\n</th>\n<th id=\"ts2-propertyValue3\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">\n<pre><span style=\"font-size: 8px;\">{自定义字段3}</span></pre>\n</th>\n<th id=\"ts2-propertyValue4\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">\n<pre><span style=\"font-size: 8px;\">{自定义字段4}</span></pre>\n</th>\n<th id=\"ts2-prodCustomNo\" style=\"text-align: center; font-weight: normal; display: none; height: 22px; width: 0%;\">{物品编号}</th>\n<th id=\"ts2-firstCatName\" style=\"text-align: center; font-weight: normal; display: none; height: 22px; width: 0%;\">{一级类目}</th>\n<th id=\"ts2-secondCatName\" style=\"text-align: center; font-weight: normal; display: none; height: 22px; width: 0%;\">{二级类目}</th>\n<th id=\"ts2-thirdCatName\" style=\"text-align: center; font-weight: normal; display: none; height: 22px; width: 0%;\">{三级类目}</th>\n<th id=\"ts2-batchNo\" style=\"text-align: center; font-weight: normal; display: none; height: 22px; width: 0%;\">{批次号}</th>\n<th id=\"ts2-productionDate\" style=\"text-align: center; font-weight: normal; display: none; height: 22px; width: 0%;\">{生产日期}</th>\n<th id=\"ts2-expirationDate\" style=\"text-align: center; font-weight: normal; display: none; height: 22px; width: 0%;\">{到期日期}</th>\n<th id=\"ts2-produceModel\" style=\"text-align: center; font-weight: normal; display: none; height: 22px; width: 0%;\">{制造商型号}</th>\n<th id=\"ts2-thumbnailUri\" style=\"text-align: center; font-weight: normal; display: none; height: 22px; width: 0%;\">{物品图片}</th>\n<th id=\"ts2-minQuantity\" style=\"text-align: center; font-weight: normal; display: none; height: 22px; width: 0%;\">{库存下限}</th>\n<th id=\"ts2-maxQuantity\" style=\"text-align: center; font-weight: normal; display: none; height: 22px; width: 0%;\">{库存上限}</th>\n<th id=\"ts2-proBarCode\" style=\"text-align: center; font-weight: normal; display: none; height: 22px; width: 0%;\">{商品条码}</th>\n<th id=\"ts2-propertyValue5\" style=\"text-align: center; font-weight: normal; display: none; height: 22px; width: 0%;\">{自定义字段5}</th>\n<th id=\"ts2-property_value5\" style=\"text-align: center; font-weight: normal; display: none; height: 22px; width: 0%;\">{单据物品自定义字段5}</th>\n<th id=\"ts2-recUnit\" style=\"text-align: center; font-weight: normal; display: none; height: 22px; width: 0%;\">{辅助单位}</th>\n<th id=\"ts2-recQuantity\" style=\"text-align: center; font-weight: normal; display: none; height: 22px; width: 0%;\">{辅助出库数量}</th>\n<th id=\"ts2-unitConverter\" style=\"text-align: center; font-weight: normal; display: none; height: 22px; width: 0%;\">{单位关系}</th>\n<th id=\"ts2-tax\" style=\"text-align: center; font-weight: normal; display: none; height: 22px; width: 0%;\">{税额}</th>\n<th id=\"ts2-untaxedPrice\" style=\"text-align: center; font-weight: normal; display: none; height: 22px; width: 0%;\">{未税单价}</th>\n<th id=\"ts2-untaxedAmount\" style=\"text-align: center; font-weight: normal; display: none; height: 22px; width: 0%;\">{未税金额}</th>\n<th id=\"ts2-taxRate\" style=\"text-align: center; font-weight: normal; display: none; height: 22px; width: 0%;\">{税率}</th>\n<th id=\"ts2-unitPrice\" style=\"text-align: center; font-weight: normal; display: none; height: 22px; width: 0%;\">{含税单价}</th>\n<th id=\"ts2-amount\" style=\"text-align: center; font-weight: normal; display: none; height: 22px; width: 0%;\">{价税合计}</th>\n<th id=\"ts2-remarks\" style=\"text-align: center; font-weight: normal; display: none; height: 22px; width: 0%;\">{备注}</th>\n</tr>\n</tbody>\n</table>\n<table style=\"border-collapse: collapse; width: 100%; height: 114px; border-color: #000000; border-style: solid;\" border=\"1\">\n<tbody>\n<tr style=\"height: 22px;\">\n<td style=\"width: 89.8218%; text-align: center; height: 22px;\" colspan=\"6\"><span style=\"font-size: 8px;\">以下是签收及送货单位信息</span></td>\n</tr>\n<tr style=\"height: 18px;\">\n<td style=\"width: 14.6154%; height: 19px;\"><span style=\"font-size: 8px;\">物资管理员：</span></td>\n<td style=\"width: 14.6154%; height: 19px;\">&nbsp;</td>\n<td style=\"height: 60px; width: 14.6843%;\" rowspan=\"3\">&nbsp;</td>\n<td style=\"height: 38px; width: 16.6712%;\" rowspan=\"2\"><span style=\"font-size: 8px;\">送货单位（盖章）：</span></td>\n<td style=\"height: 38px; width: 29.2355%; text-align: center;\" colspan=\"2\" rowspan=\"2\"><span style=\"font-size: 8px;\">XXXXXXXXXXXXXXXXXXXX公司</span></td>\n</tr>\n<tr style=\"height: 19px;\">\n<td style=\"width: 14.6154%; height: 19px;\"><span style=\"font-size: 8px;\">专业技术员：</span></td>\n<td style=\"width: 14.6154%; height: 19px;\">&nbsp;</td>\n</tr>\n<tr style=\"height: 22px;\">\n<td style=\"width: 14.6154%; height: 22px;\"><span style=\"font-size: 8px;\">质量员 ：</span></td>\n<td style=\"width: 14.6154%; height: 22px;\">&nbsp;</td>\n<td style=\"width: 16.6712%; height: 22px;\"><span style=\"font-size: 8px;\">送货时间：</span></td>\n<td style=\"height: 22px; width: 29.2355%; text-align: center;\" colspan=\"2\"><span style=\"font-size: 8px;\">【出库日期】</span></td>\n</tr>\n<tr style=\"height: 22px;\">\n<td style=\"height: 22px; width: 14.6154%;\"><span style=\"font-size: 8px;\">备注：</span></td>\n<td style=\"width: 45.9709%; height: 22px;\" colspan=\"3\"><span style=\"font-size: 8px;\"><span style=\"font-size: 8px;\">【交货地址】</span><br /></span></td>\n<td style=\"width: 16.3775%; height: 22px;\"><span style=\"font-size: 8px;\"><span style=\"font-size: 8px;\">【客户-联系人】</span><br /></span></td>\n<td style=\"width: 12.858%; height: 22px;\"><span style=\"font-size: 8px;\"><span style=\"font-size: 8px;\">【客户-联系电话】</span><br /></span></td>\n</tr>\n<tr style=\"height: 10px;\">\n<td style=\"height: 10px; width: 89.8218%;\" colspan=\"6\">\n<pre><span style=\"font-size: 8px;\">说明：</span><br /><span style=\"font-size: 8px;\">1，XXX部分区域，必须按照合同清单描述</span><br /><span style=\"font-size: 8px;\">2，所有行编码数必须与合同或订单清单序号数保持一致；</span><br /><span style=\"font-size: 8px;\">3，如若本次未送货，可不列入；</span><br /><span style=\"font-size: 8px;\">4，若供应商是根据本公司系统出具的送货单，须再根据模板编制一份送货单。</span><br /><span style=\"font-size: 8px;\">5，框架合同中框架外清单统一集中列项，备注为框架外项。</span><br /><span style=\"font-size: 8px;\">6，签收人员至少两个人员签字，其中物资管理员必须签字。</span></pre>\n</td>\n</tr>\n</tbody>\n</table>\n<div>&nbsp;</div>",
                "dateFormat": "2",
                "fieldList": [
                    {
                        "addedLoginName": "15295522511",
                        "addedTime": 1641274579000,
                        "displayOrder": 0,
                        "fieldName": "projectName",
                        "fieldType": "field",
                        "recId": 335715,
                        "templateId": 4521
                    },
                    {
                        "addedLoginName": "15295522511",
                        "addedTime": 1641274579000,
                        "displayOrder": 1,
                        "fieldName": "displaySaleOrderNo",
                        "fieldType": "field",
                        "recId": 335716,
                        "templateId": 4521
                    },
                    {
                        "addedLoginName": "15295522511",
                        "addedTime": 1641274579000,
                        "displayOrder": 2,
                        "fieldName": "outDate",
                        "fieldType": "field",
                        "recId": 335717,
                        "templateId": 4521
                    },
                    {
                        "addedLoginName": "15295522511",
                        "addedTime": 1641274579000,
                        "displayOrder": 3,
                        "fieldName": "outDate",
                        "fieldType": "field",
                        "recId": 335718,
                        "templateId": 4521
                    },
                    {
                        "addedLoginName": "15295522511",
                        "addedTime": 1641274579000,
                        "displayOrder": 4,
                        "fieldName": "deliveryAddress",
                        "fieldType": "field",
                        "recId": 335719,
                        "templateId": 4521
                    },
                    {
                        "addedLoginName": "15295522511",
                        "addedTime": 1641274579000,
                        "displayOrder": 5,
                        "fieldName": "customerContacterName",
                        "fieldType": "field",
                        "recId": 335720,
                        "templateId": 4521
                    },
                    {
                        "addedLoginName": "15295522511",
                        "addedTime": 1641274579000,
                        "displayOrder": 6,
                        "fieldName": "customerTelNo",
                        "fieldType": "field",
                        "recId": 335721,
                        "templateId": 4521
                    }
                ],
                "isDefault": 0,
                "materialFieldList": [],
                "maxRow": 50,
                "paperSize": "a4_z",
                "prodFieldList": [
                    {
                        "addedLoginName": "15295522511",
                        "addedTime": 1641274579000,
                        "displayOrder": 0,
                        "fieldName": "serialNumber",
                        "fieldType": "prodField",
                        "recId": 335722,
                        "templateId": 4521
                    },
                    {
                        "addedLoginName": "15295522511",
                        "addedTime": 1641274579000,
                        "displayOrder": 1,
                        "fieldName": "prodName",
                        "fieldType": "prodField",
                        "recId": 335723,
                        "templateId": 4521
                    },
                    {
                        "addedLoginName": "15295522511",
                        "addedTime": 1641274579000,
                        "displayOrder": 2,
                        "fieldName": "descItem",
                        "fieldType": "prodField",
                        "recId": 335724,
                        "templateId": 4521
                    },
                    {
                        "addedLoginName": "15295522511",
                        "addedTime": 1641274579000,
                        "displayOrder": 3,
                        "fieldName": "brand",
                        "fieldType": "prodField",
                        "recId": 335725,
                        "templateId": 4521
                    },
                    {
                        "addedLoginName": "15295522511",
                        "addedTime": 1641274579000,
                        "displayOrder": 4,
                        "fieldName": "unit",
                        "fieldType": "prodField",
                        "recId": 335726,
                        "templateId": 4521
                    },
                    {
                        "addedLoginName": "15295522511",
                        "addedTime": 1641274579000,
                        "displayOrder": 5,
                        "fieldName": "quantity",
                        "fieldType": "prodField",
                        "recId": 335727,
                        "templateId": 4521
                    }
                ],
                "sortAryStr": "【序号】-serialNumber,【物品名称】-prodName,【规格型号】-descItem,【品牌】-brand,【单位】-unit,【出库数量】-quantity,【单据物品自定义字段1】-property_value1,【单据物品自定义字段2】-property_value2,【单据物品自定义字段3】-property_value3,【单据物品自定义字段4】-property_value4,【自定义字段2】-propertyValue2,【自定义字段1】-propertyValue1,【自定义字段3】-propertyValue3,【自定义字段4】-propertyValue4,【物品编号】-prodCustomNo,【一级类目】-firstCatName,【二级类目】-secondCatName,【三级类目】-thirdCatName,【批次号】-batchNo,【生产日期】-productionDate,【到期日期】-expirationDate,【制造商型号】-produceModel,【物品图片】-thumbnailUri,【库存下限】-minQuantity,【库存上限】-maxQuantity,【商品条码】-proBarCode,【自定义字段5】-propertyValue5,【单据物品自定义字段5】-property_value5,【辅助单位】-recUnit,【辅助出库数量】-recQuantity,【单位关系】-unitConverter,【税额】-tax,【未税单价】-untaxedPrice,【未税金额】-untaxedAmount,【税率】-taxRate,【含税单价】-unitPrice,【价税合计】-amount,【备注】-remarks",
                "templateName": "销售出库单（通用）",
                "updatedTime": 1654384400000,
                "wordSize": "8"
            },
            "retCode": "0"
        },
        "recommend-006": {
            "data": {
                "billType": "OutWarehouse_2",
                "content": "<h3 style=\"text-align: center;\"><span style=\"font-weight: bold; font-size: 24px;\">XXXXXXXXXXX公司&nbsp;</span></h3>\n<table style=\"border-collapse: collapse; width: 99.1081%; height: 27px; border-color: #ffffff; border-style: none;\" border=\"1\">\n<tbody>\n<tr style=\"height: 32px;\">\n<td style=\"width: 100%; text-align: center; height: 27px;\"><span style=\"font-size: 18px;\">销售出库单</span></td>\n</tr>\n</tbody>\n</table>\n<div>\n<table style=\"border-collapse: collapse; width: 99.108%; height: 30px; border-color: #ffffff; border-style: none;\" border=\"1\">\n<tbody>\n<tr style=\"height: 21px;\">\n<td style=\"width: 27.4425%; height: 30px;\"><span style=\"font-size: 14px; font-family: 'arial black', sans-serif;\"><strong>单据日期： 【出库日期】</strong></span></td>\n<td style=\"width: 24.68%; height: 30px;\"><span style=\"font-size: 14px; font-family: 'arial black', sans-serif;\"><strong>单据编号： 【出库单号】</strong></span></td>\n<td style=\"width: 19.2306%; height: 30px;\"><span style=\"font-size: 14px; font-family: 'arial black', sans-serif;\"><strong>&nbsp;储存条件：常温&nbsp;</strong></span></td>\n<td style=\"width: 23.0899%; height: 30px;\"><span style=\"font-size: 14px; font-family: 'arial black', sans-serif;\"><strong>&nbsp;质量：合格</strong></span></td>\n</tr>\n</tbody>\n</table>\n</div>\n<table style=\"border-collapse: collapse; width: 99.108%; height: 31px; border-color: #ffffff; border-style: none;\" border=\"1\">\n<tbody>\n<tr style=\"height: 20px;\">\n<td style=\"width: 27.8361%; height: 31px;\"><span style=\"font-size: 14px; font-family: 'arial black', sans-serif;\"><strong>购货单位：&nbsp;&nbsp;【客户】</strong></span></td>\n<td style=\"width: 44.5099%; height: 31px;\"><span style=\"font-size: 14px; font-family: 'arial black', sans-serif;\"><strong>收货地址：【客户-注册地址】</strong></span></td>\n<td style=\"width: 23.4617%; height: 31px;\"><span style=\"font-size: 14px; font-family: 'arial black', sans-serif;\"><strong>&nbsp;收货联系人：【客户-联系人】</strong></span></td>\n</tr>\n</tbody>\n</table>\n<table id=\"template-tables\" style=\"border-collapse: collapse; width: 99.1089%; height: 159px; border-color: #000000; border-style: solid;\" border=\"1\" width=\"99.8018%\" cellspacing=\"0\" cellpadding=\"0\">\n<tbody>\n<tr>\n<th id=\"ts1-serialNumber\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\"><span style=\"font-family: 'arial black', sans-serif;\">序号</span></th>\n<th id=\"ts1-prodCustomNo\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\"><span style=\"font-family: 'arial black', sans-serif;\">物品编号</span></th>\n<th id=\"ts1-proBarCode\" style=\"text-align: center; font-weight: bold; width: 6.43683%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">条形码</span></th>\n<th id=\"ts1-prodName\" style=\"text-align: center; font-weight: bold; width: 9.70195%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">品 名</span></th>\n<th id=\"ts1-firstCatName\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">一级类目</span></th>\n<th id=\"ts1-secondCatName\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">二级类目</span></th>\n<th id=\"ts1-thirdCatName\" style=\"text-align: center; font-weight: bold; display: none; width: 1.5022%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">三级类目</span></th>\n<th id=\"ts1-descItem\" style=\"text-align: center; font-weight: bold; width: 10.8839%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">规格</span></th>\n<th id=\"ts1-propertyValue5\" style=\"text-align: center; font-weight: bold; width: 1.36964%; display: none;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">生产厂家</span></th>\n<th id=\"ts1-property_value1\" style=\"text-align: center; font-weight: bold; width: 10.8377%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">生产厂家</span></th>\n<th id=\"ts1-property_value2\" style=\"text-align: center; font-weight: bold; width: 9.61571%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">生产许可证号</span></th>\n<th id=\"ts1-brand\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">品牌</span></th>\n<th id=\"ts1-produceModel\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">制造商型号</span></th>\n<th id=\"ts1-thumbnailUri\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">物品图片</span></th>\n<th id=\"ts1-minQuantity\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">库存下限</span></th>\n<th id=\"ts1-maxQuantity\" style=\"text-align: center; font-weight: bold; display: none; width: 23.6634%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">库存上限</span></th>\n<th id=\"ts1-propertyValue2\" style=\"text-align: center; font-weight: bold; width: 23.3886%; display: none;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">生产许可证号</span></th>\n<th id=\"ts1-unit\" style=\"text-align: center; font-weight: bold; width: 1.88273%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">单位</span></th>\n<th id=\"ts1-quantity\" style=\"text-align: center; font-weight: bold; width: 2.97118%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">发货数量</span></th>\n<th id=\"ts1-unitPrice\" style=\"text-align: center; font-weight: bold; width: 3.35252%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">单价</span></th>\n<th id=\"ts1-amount\" style=\"text-align: center; font-weight: bold; width: 7.52424%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">金额</span></th>\n<th id=\"ts1-property_value3\" style=\"text-align: center;font-weight: normal;display: none;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">发货箱数</span></th>\n<th id=\"ts1-propertyValue1\" style=\"text-align: center; font-weight: bold; width: 36.1858%; display: none;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">发货箱数</span></th>\n<th id=\"ts1-batchNo\" style=\"text-align: center; font-weight: bold; width: 4.3372%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">批号</span></th>\n<th id=\"ts1-productionDate\" style=\"text-align: center; font-weight: bold; width: 6.0327%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">生产日期</span></th>\n<th id=\"ts1-expirationDate\" style=\"text-align: center; font-weight: bold; width: 4.82896%;\"><span style=\"font-family: arial black, sans-serif;\"><span style=\"font-size: 8px;\">有效期</span></span></th>\n<th id=\"ts1-propertyValue3\" style=\"text-align: center; font-weight: bold; display: none; width: 5.47136%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">批准文号</span></th>\n<th id=\"ts1-property_value5\" style=\"text-align: center; font-weight: bold; width: 6.40982%;\"><span style=\"font-size: 12px;\">批准文号</span></th>\n<th id=\"ts1-propertyValue4\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">自定义字段4</span></th>\n<th id=\"ts1-tax\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">税额</span></th>\n<th id=\"ts1-untaxedPrice\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">未税单价</span></th>\n<th id=\"ts1-untaxedAmount\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">未税金额</span></th>\n<th id=\"ts1-taxRate\" style=\"text-align: center; font-weight: bold; display: none; width: 0.198023%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">税率</span></th>\n<th id=\"ts1-property_value4\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">批号</span></th>\n<th id=\"ts1-remarks\" style=\"text-align: center; font-weight: bold; width: 16.6337%; display: none;\"><span style=\"font-family: 'arial black', sans-serif;\">备注</span></th>\n</tr>\n<tr>\n<th id=\"ts2-serialNumber\" style=\"text-align: center; display: none; width: 0%;\"><span style=\"font-family: 'arial black', sans-serif;\">{序号}</span></th>\n<th id=\"ts2-prodCustomNo\" style=\"text-align: center; display: none; width: 0%;\"><span style=\"font-family: 'arial black', sans-serif;\">{物品编号}</span></th>\n<th id=\"ts2-proBarCode\" style=\"text-align: center; width: 6.43683%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{商品条码}</span></th>\n<th id=\"ts2-prodName\" style=\"text-align: center; width: 9.70195%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{物品名称}</span></th>\n<th id=\"ts2-firstCatName\" style=\"text-align: center; display: none; width: 0%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{一级类目}</span></th>\n<th id=\"ts2-secondCatName\" style=\"text-align: center; display: none; width: 0%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{二级类目}</span></th>\n<th id=\"ts2-thirdCatName\" style=\"text-align: center; display: none; width: 1.5022%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{三级类目}</span></th>\n<th id=\"ts2-descItem\" style=\"text-align: center; width: 10.8839%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{规格型号}</span></th>\n<th id=\"ts2-propertyValue5\" style=\"text-align: center; font-weight: bold; width: 1.36964%; display: none;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{自定义字段5}</span></th>\n<th id=\"ts2-property_value1\" style=\"text-align: center; width: 10.8377%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{单据物品自定义字段1}</span></th>\n<th id=\"ts2-property_value2\" style=\"text-align: center; width: 9.61571%;\">\n<p><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{单据物品</span></p>\n<p><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">自定义字段2}</span></p>\n</th>\n<th id=\"ts2-brand\" style=\"text-align: center; display: none; width: 0%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{品牌}</span></th>\n<th id=\"ts2-produceModel\" style=\"text-align: center; display: none; width: 0%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{制造商型号}</span></th>\n<th id=\"ts2-thumbnailUri\" style=\"text-align: center; display: none; width: 0%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{物品图片}</span></th>\n<th id=\"ts2-minQuantity\" style=\"text-align: center; display: none; width: 0%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{库存下限}</span></th>\n<th id=\"ts2-maxQuantity\" style=\"text-align: center; display: none; width: 23.6634%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{库存上限}</span></th>\n<th id=\"ts2-propertyValue2\" style=\"text-align: center; width: 23.3886%; display: none;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{自定义字段2}</span></th>\n<th id=\"ts2-unit\" style=\"text-align: center; width: 1.88273%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{单位}</span></th>\n<th id=\"ts2-quantity\" style=\"text-align: center; width: 2.97118%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{出库数量}</span></th>\n<th id=\"ts2-unitPrice\" style=\"text-align: center; width: 3.35252%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{含税单价}</span></th>\n<th id=\"ts2-amount\" style=\"text-align: center; width: 7.52424%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{价税合计}</span></th>\n<th id=\"ts2-property_value3\" style=\"text-align: center;font-weight: normal;display: none;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{单据物品自定义字段3}</span></th>\n<th id=\"ts2-propertyValue1\" style=\"text-align: center; width: 36.1858%; display: none;\"></th>\n<th id=\"ts2-batchNo\" style=\"text-align: center; width: 4.3372%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{批次号}</span></th>\n<th id=\"ts2-productionDate\" style=\"text-align: center; width: 6.0327%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{生产日期}</span></th>\n<th id=\"ts2-expirationDate\" style=\"text-align: center; width: 4.82896%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{到期日期}</span></th>\n<th id=\"ts2-propertyValue3\" style=\"text-align: center; font-weight: bold; display: none; width: 5.47136%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{自定义字段3}</span></th>\n<th id=\"ts2-property_value5\" style=\"text-align: center; font-weight: bold; width: 6.40982%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{单据物品自定义字段5}</span></th>\n<th id=\"ts2-propertyValue4\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{自定义字段4}</span></th>\n<th id=\"ts2-tax\" style=\"text-align: center; display: none; width: 0%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{税额}</span></th>\n<th id=\"ts2-untaxedPrice\" style=\"text-align: center; display: none; width: 0%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{未税单价}</span></th>\n<th id=\"ts2-untaxedAmount\" style=\"text-align: center; display: none; width: 0%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{未税金额}</span></th>\n<th id=\"ts2-taxRate\" style=\"text-align: center; display: none; width: 0.198023%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{税率}</span></th>\n<th id=\"ts2-property_value4\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\"><span style=\"font-size: 8px; font-family: 'arial black', sans-serif;\">{单据物品自定义字段4}</span></th>\n<th id=\"ts2-remarks\" style=\"text-align: center; width: 16.6337%; display: none;\"><span style=\"font-family: 'arial black', sans-serif;\">{备注}</span></th>\n</tr>\n</tbody>\n</table>\n<div>\n<table style=\"border-collapse: collapse; width: 99.1098%; height: 10px; border-color: #000000; border-style: solid;\" border=\"1\">\n<tbody>\n<tr style=\"height: 65px;\">\n<td style=\"width: 65.8054%; height: 10px; line-height: 1;\" colspan=\"5\"><span style=\"font-family: 'arial black', sans-serif;\">&nbsp; &nbsp;<span style=\"font-size: 14px;\"> <strong>&nbsp; &nbsp;<span style=\"font-family: 'arial black', sans-serif;\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;合&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 计</span></strong></span></span></td>\n<td style=\"width: 8.8204%; height: 10px; text-align: center;\"><strong><span style=\"font-size: 12px;\"><span style=\"font-family: 'arial black', sans-serif;\">【优惠后金额】</span></span></strong></td>\n<td style=\"width: 10.6971%; height: 10px; text-align: center;\"><span style=\"font-size: 12px;\"><strong>【自定义字段4】</strong></span></td>\n<td style=\"width: 14.8199%; height: 10px;\">&nbsp;</td>\n</tr>\n</tbody>\n</table>\n<table style=\"border-collapse: collapse; width: 99.1081%; height: 27px; border-color: #000000; border-style: solid;\" border=\"1\">\n<tbody>\n<tr style=\"height: 32px;\">\n<td style=\"width: 22.9919%; height: 27px;\"><strong><span style=\"font-size: 14px; font-family: 'arial black', sans-serif;\">本页合计金额（大写）：</span></strong></td>\n<td style=\"width: 74.1801%; height: 27px;\"><strong><span style=\"font-size: 14px; font-family: 'arial black', sans-serif;\">【优惠后金额大写】</span></strong></td>\n</tr>\n</tbody>\n</table>\n<table style=\"border-collapse: collapse; width: 99.1081%; height: 24px; border-color: #000000; border-style: solid;\" border=\"1\">\n<tbody>\n<tr style=\"height: 41px;\">\n<td style=\"width: 23.586%; height: 24px;\"><strong><span style=\"font-size: 14px; font-family: 'arial black', sans-serif;\">开票员：</span></strong></td>\n<td style=\"width: 51.4031%; height: 24px;\" colspan=\"2\"><strong><span style=\"font-size: 14px; font-family: 'arial black', sans-serif;\">出库员:&nbsp;&nbsp;</span></strong></td>\n<td style=\"width: 24.957%; height: 24px;\"><strong><span style=\"font-size: 14px; font-family: 'arial black', sans-serif;\">业务员：</span></strong></td>\n</tr>\n</tbody>\n</table>\n<table style=\"border-collapse: collapse; width: 99.108%; height: 33px; border-color: #000000; border-style: solid;\" border=\"1\">\n<tbody>\n<tr style=\"height: 40px;\">\n<td style=\"width: 22.3989%; height: 33px;\"><strong><span style=\"font-size: 14px; font-family: 'arial black', sans-serif;\">收货人：&nbsp; &nbsp;&nbsp;</span></strong></td>\n<td style=\"width: 24.7731%; height: 33px;\"><strong><span style=\"font-size: 14px; font-family: 'arial black', sans-serif;\">（收货单位盖章）&nbsp;</span></strong></td>\n<td style=\"width: 23.7837%; height: 33px;\"><strong><span style=\"font-size: 14px; font-family: 'arial black', sans-serif;\">签收箱数:</span></strong></td>\n<td style=\"width: 23.4873%; height: 33px;\"><strong><span style=\"font-size: 14px; font-family: 'arial black', sans-serif;\">收货日期：&nbsp; &nbsp; &nbsp; 年&nbsp; &nbsp; &nbsp; &nbsp;月&nbsp; &nbsp; &nbsp; &nbsp; 日</span></strong></td>\n</tr>\n</tbody>\n</table>\n<p>&nbsp;</p>\n</div>",
                "dateFormat": "3",
                "fieldList": [
                    {
                        "addedLoginName": "15968825125",
                        "addedTime": 1641266421000,
                        "displayOrder": 0,
                        "fieldName": "outDate",
                        "fieldType": "field",
                        "recId": 335589,
                        "templateId": 4516
                    },
                    {
                        "addedLoginName": "15968825125",
                        "addedTime": 1641266421000,
                        "displayOrder": 1,
                        "fieldName": "displayBillNo",
                        "fieldType": "field",
                        "recId": 335590,
                        "templateId": 4516
                    },
                    {
                        "addedLoginName": "15968825125",
                        "addedTime": 1641266421000,
                        "displayOrder": 2,
                        "fieldName": "customerName",
                        "fieldType": "field",
                        "recId": 335591,
                        "templateId": 4516
                    },
                    {
                        "addedLoginName": "15968825125",
                        "addedTime": 1641266421000,
                        "displayOrder": 3,
                        "fieldName": "customerRegisteredAddress",
                        "fieldType": "field",
                        "recId": 335592,
                        "templateId": 4516
                    },
                    {
                        "addedLoginName": "15968825125",
                        "addedTime": 1641266421000,
                        "displayOrder": 4,
                        "fieldName": "customerContacterName",
                        "fieldType": "field",
                        "recId": 335593,
                        "templateId": 4516
                    },
                    {
                        "addedLoginName": "15968825125",
                        "addedTime": 1641266421000,
                        "displayOrder": 5,
                        "fieldName": "aggregateAmount",
                        "fieldType": "field",
                        "recId": 335594,
                        "templateId": 4516
                    },
                    {
                        "addedLoginName": "15968825125",
                        "addedTime": 1641266421000,
                        "displayOrder": 6,
                        "fieldName": "propertyValue4",
                        "fieldType": "field",
                        "recId": 335595,
                        "templateId": 4516
                    },
                    {
                        "addedLoginName": "15968825125",
                        "addedTime": 1641266421000,
                        "displayOrder": 7,
                        "fieldName": "aggregateAmountUp",
                        "fieldType": "field",
                        "recId": 335596,
                        "templateId": 4516
                    }
                ],
                "isDefault": 0,
                "materialFieldList": [],
                "maxRow": 15,
                "paperSize": "a4_h",
                "prodFieldList": [
                    {
                        "addedLoginName": "15968825125",
                        "addedTime": 1641266421000,
                        "displayOrder": 0,
                        "fieldName": "proBarCode",
                        "fieldType": "prodField",
                        "recId": 335597,
                        "templateId": 4516
                    },
                    {
                        "addedLoginName": "15968825125",
                        "addedTime": 1641266421000,
                        "displayOrder": 1,
                        "fieldName": "prodName",
                        "fieldType": "prodField",
                        "recId": 335598,
                        "templateId": 4516
                    },
                    {
                        "addedLoginName": "15968825125",
                        "addedTime": 1641266421000,
                        "displayOrder": 2,
                        "fieldName": "descItem",
                        "fieldType": "prodField",
                        "recId": 335599,
                        "templateId": 4516
                    },
                    {
                        "addedLoginName": "15968825125",
                        "addedTime": 1641266421000,
                        "displayOrder": 3,
                        "fieldName": "property_value1",
                        "fieldType": "prodField",
                        "recId": 335600,
                        "templateId": 4516
                    },
                    {
                        "addedLoginName": "15968825125",
                        "addedTime": 1641266421000,
                        "displayOrder": 4,
                        "fieldName": "property_value2",
                        "fieldType": "prodField",
                        "recId": 335601,
                        "templateId": 4516
                    },
                    {
                        "addedLoginName": "15968825125",
                        "addedTime": 1641266421000,
                        "displayOrder": 5,
                        "fieldName": "unit",
                        "fieldType": "prodField",
                        "recId": 335602,
                        "templateId": 4516
                    },
                    {
                        "addedLoginName": "15968825125",
                        "addedTime": 1641266421000,
                        "displayOrder": 6,
                        "fieldName": "quantity",
                        "fieldType": "prodField",
                        "recId": 335603,
                        "templateId": 4516
                    },
                    {
                        "addedLoginName": "15968825125",
                        "addedTime": 1641266421000,
                        "displayOrder": 7,
                        "fieldName": "unitPrice",
                        "fieldType": "prodField",
                        "recId": 335604,
                        "templateId": 4516
                    },
                    {
                        "addedLoginName": "15968825125",
                        "addedTime": 1641266421000,
                        "displayOrder": 8,
                        "fieldName": "amount",
                        "fieldType": "prodField",
                        "recId": 335605,
                        "templateId": 4516
                    },
                    {
                        "addedLoginName": "15968825125",
                        "addedTime": 1641266421000,
                        "displayOrder": 9,
                        "fieldName": "batchNo",
                        "fieldType": "prodField",
                        "recId": 335606,
                        "templateId": 4516
                    },
                    {
                        "addedLoginName": "15968825125",
                        "addedTime": 1641266421000,
                        "displayOrder": 10,
                        "fieldName": "productionDate",
                        "fieldType": "prodField",
                        "recId": 335607,
                        "templateId": 4516
                    },
                    {
                        "addedLoginName": "15968825125",
                        "addedTime": 1641266421000,
                        "displayOrder": 11,
                        "fieldName": "expirationDate",
                        "fieldType": "prodField",
                        "recId": 335608,
                        "templateId": 4516
                    },
                    {
                        "addedLoginName": "15968825125",
                        "addedTime": 1641266421000,
                        "displayOrder": 12,
                        "fieldName": "property_value5",
                        "fieldType": "prodField",
                        "recId": 335609,
                        "templateId": 4516
                    }
                ],
                "sortAryStr": "【序号】-serialNumber,【物品编号】-prodCustomNo,【商品条码】-proBarCode,【物品名称】-prodName,【一级类目】-firstCatName,【二级类目】-secondCatName,【三级类目】-thirdCatName,【规格型号】-descItem,【自定义字段5】-propertyValue5,【单据物品自定义字段1】-property_value1,【单据物品自定义字段2】-property_value2,【品牌】-brand,【制造商型号】-produceModel,【物品图片】-thumbnailUri,【库存下限】-minQuantity,【库存上限】-maxQuantity,【自定义字段2】-propertyValue2,【单位】-unit,【出库数量】-quantity,【含税单价】-unitPrice,【价税合计】-amount,【单据物品自定义字段3】-property_value3,【自定义字段1】-propertyValue1,【批次号】-batchNo,【生产日期】-productionDate,【到期日期】-expirationDate,【自定义字段3】-propertyValue3,【单据物品自定义字段5】-property_value5,【自定义字段4】-propertyValue4,【税额】-tax,【未税单价】-untaxedPrice,【未税金额】-untaxedAmount,【税率】-taxRate,【单据物品自定义字段4】-property_value4,【备注】-remarks",
                "templateName": "销售出库单模板（医疗行业）",
                "updatedTime": 1654384400000,
                "wordSize": "8"
            },
            "retCode": "0"
        },
        "recommend-007": {
            "data": {
                "billType": "SaleOrder",
                "content": "<h3 style=\"text-align: center;\"><strong><span style=\"font-size: 24px;\">XXXXXXXXX销售订单</span></strong></h3>\n<table style=\"border-collapse: collapse; width: 100%;\" border=\"1\">\n<tbody>\n<tr>\n<td style=\"width: 11.3974%; line-height: 1.1;\">单据编号：</td>\n<td style=\"width: 38.0575%; line-height: 1.1;\">【销售单号】</td>\n<td style=\"width: 11.4964%; line-height: 1.1;\">制单日期：</td>\n<td style=\"width: 39.0487%; line-height: 1.1;\">【销售日期】</td>\n</tr>\n<tr>\n<td style=\"width: 11.3974%; line-height: 1.1;\">客&nbsp; &nbsp; &nbsp; &nbsp;户：</td>\n<td style=\"width: 38.0575%; line-height: 1.1;\">【客户】</td>\n<td style=\"width: 11.4964%; line-height: 1.1;\">客户电话：</td>\n<td style=\"width: 39.0487%; line-height: 1.1;\">【客户-联系电话】</td>\n</tr>\n</tbody>\n</table>\n<table id=\"template-tables\" style=\"table-layout: fixed; word-wrap: break-word;\" border=\"1\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\n<tbody>\n<tr>\n<th id=\"ts1-serialNumber\" style=\"text-align: center; font-weight: bold; width: 5.54217%;\">序号</th>\n<th id=\"ts1-prodCustomNo\" style=\"text-align: center; font-weight: bold; width: 10.1205%;\">物品编号</th>\n<th id=\"ts1-prodName\" style=\"text-align: center; font-weight: bold; width: 17.7108%;\">物品名称</th>\n<th id=\"ts1-firstCatName\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\">一级类目</th>\n<th id=\"ts1-secondCatName\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\">二级类目</th>\n<th id=\"ts1-thirdCatName\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\">三级类目</th>\n<th id=\"ts1-batchNo\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\">批次号</th>\n<th id=\"ts1-productionDate\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\">生产日期</th>\n<th id=\"ts1-expirationDate\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\">到期日期</th>\n<th id=\"ts1-descItem\" style=\"text-align: center; font-weight: bold; width: 0%; display: none;\">规格型号</th>\n<th id=\"ts1-brand\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\">品牌</th>\n<th id=\"ts1-thumbnailUri\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\">物品图片</th>\n<th id=\"ts1-produceModel\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\">制造商型号</th>\n<th id=\"ts1-minQuantity\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\">库存下限</th>\n<th id=\"ts1-maxQuantity\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\">库存上限</th>\n<th id=\"ts1-proBarCode\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\">商品条码</th>\n<th id=\"ts1-propertyValue1\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\">自定义字段1</th>\n<th id=\"ts1-propertyValue2\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\">自定义字段2</th>\n<th id=\"ts1-propertyValue3\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\">自定义字段3</th>\n<th id=\"ts1-propertyValue4\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\">自定义字段4</th>\n<th id=\"ts1-propertyValue5\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\">自定义字段5</th>\n<th id=\"ts1-property_value1\" style=\"text-align: center;font-weight: normal;display: none;\">数量（桶）</th>\n<th id=\"ts1-property_value2\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\">单据物品自定义字段2</th>\n<th id=\"ts1-property_value3\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\">单据物品自定义字段3</th>\n<th id=\"ts1-property_value4\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\">单据物品自定义字段4</th>\n<th id=\"ts1-property_value5\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\">单据物品自定义字段5</th>\n<th id=\"ts1-unit\" style=\"text-align: center; font-weight: bold; width: 6.26521%;\">单位</th>\n<th id=\"ts1-quantity\" style=\"text-align: center; font-weight: bold; width: 12.4095%;\">数量</th>\n<th id=\"ts1-unitPrice\" style=\"text-align: center; font-weight: bold; width: 10.1205%;\">单价（元）</th>\n<th id=\"ts1-amount\" style=\"text-align: center; font-weight: bold; width: 9.87952%;\">金额（元）</th>\n<th id=\"ts1-remarks\" style=\"text-align: center; font-weight: bold; width: 6.62651%;\">备注</th>\n<th id=\"ts1-deliveryDeadlineDate\" style=\"text-align: center; font-weight: bold; display: none; width: 0%;\">交货日期</th>\n</tr>\n<tr>\n<th id=\"ts2-serialNumber\" style=\"text-align: center; width: 5.54217%;\">{序号}</th>\n<th id=\"ts2-prodCustomNo\" style=\"text-align: center; width: 10.1205%;\">{物品编号}</th>\n<th id=\"ts2-prodName\" style=\"text-align: center; width: 17.7108%;\">{物品名称}</th>\n<th id=\"ts2-firstCatName\" style=\"text-align: center; display: none; width: 0%;\">{一级类目}</th>\n<th id=\"ts2-secondCatName\" style=\"text-align: center; display: none; width: 0%;\">{二级类目}</th>\n<th id=\"ts2-thirdCatName\" style=\"text-align: center; display: none; width: 0%;\">{三级类目}</th>\n<th id=\"ts2-batchNo\" style=\"text-align: center; display: none; width: 0%;\">{批次号}</th>\n<th id=\"ts2-productionDate\" style=\"text-align: center; display: none; width: 0%;\">{生产日期}</th>\n<th id=\"ts2-expirationDate\" style=\"text-align: center; display: none; width: 0%;\">{到期日期}</th>\n<th id=\"ts2-descItem\" style=\"text-align: center; width: 0%; display: none;\">{规格型号}</th>\n<th id=\"ts2-brand\" style=\"text-align: center; display: none; width: 0%;\">{品牌}</th>\n<th id=\"ts2-thumbnailUri\" style=\"text-align: center; display: none; width: 0%;\">{物品图片}</th>\n<th id=\"ts2-produceModel\" style=\"text-align: center; display: none; width: 0%;\">{制造商型号}</th>\n<th id=\"ts2-minQuantity\" style=\"text-align: center; display: none; width: 0%;\">{库存下限}</th>\n<th id=\"ts2-maxQuantity\" style=\"text-align: center; display: none; width: 0%;\">{库存上限}</th>\n<th id=\"ts2-proBarCode\" style=\"text-align: center; display: none; width: 0%;\">{商品条码}</th>\n<th id=\"ts2-propertyValue1\" style=\"text-align: center; display: none; width: 0%;\">{自定义字段1}</th>\n<th id=\"ts2-propertyValue2\" style=\"text-align: center; display: none; width: 0%;\">{自定义字段2}</th>\n<th id=\"ts2-propertyValue3\" style=\"text-align: center; display: none; width: 0%;\">{自定义字段3}</th>\n<th id=\"ts2-propertyValue4\" style=\"text-align: center; display: none; width: 0%;\">{自定义字段4}</th>\n<th id=\"ts2-propertyValue5\" style=\"text-align: center; display: none; width: 0%;\">{自定义字段5}</th>\n<th id=\"ts2-property_value1\" style=\"text-align: center;font-weight: normal;display: none;\">{单据物品自定义字段1}</th>\n<th id=\"ts2-property_value2\" style=\"text-align: center; display: none; width: 0%;\">{单据物品自定义字段2}</th>\n<th id=\"ts2-property_value3\" style=\"text-align: center; display: none; width: 0%;\">{单据物品自定义字段3}</th>\n<th id=\"ts2-property_value4\" style=\"text-align: center; display: none; width: 0%;\">{单据物品自定义字段4}</th>\n<th id=\"ts2-property_value5\" style=\"text-align: center; display: none; width: 0%;\">{单据物品自定义字段5}</th>\n<th id=\"ts2-unit\" style=\"text-align: center; width: 6.26521%;\">{单位}</th>\n<th id=\"ts2-quantity\" style=\"text-align: center; width: 12.4095%;\">{销售数量}</th>\n<th id=\"ts2-recUnit\" style=\"text-align: center; display: none; width: 0%;\">{辅助单位}</th>\n<th id=\"ts2-recQuantity\" style=\"text-align: center; display: none; width: 0%;\">{辅助销售数量}</th>\n<th id=\"ts2-unitConverter\" style=\"text-align: center; display: none; width: 0%;\">{单位关系}</th>\n<th id=\"ts2-tax\" style=\"text-align: center; display: none; width: 0%;\">{税额}</th>\n<th id=\"ts2-untaxedPrice\" style=\"text-align: center; display: none; width: 0%;\">{未税单价}</th>\n<th id=\"ts2-untaxedAmount\" style=\"text-align: center; display: none; width: 0%;\">{未税金额}</th>\n<th id=\"ts2-taxRate\" style=\"text-align: center; display: none; width: 0.000340552%;\">{税率}</th>\n<th id=\"ts2-unitPrice\" style=\"text-align: center; width: 10.1205%;\">{含税单价}</th>\n<th id=\"ts2-amount\" style=\"text-align: center; width: 9.87952%;\">{价税合计}</th>\n<th id=\"ts2-remarks\" style=\"text-align: center; width: 6.62651%;\">{备注}</th>\n<th id=\"ts2-deliveryDeadlineDate\" style=\"text-align: center; display: none; width: 0%;\">{交货日期}</th>\n</tr>\n</tbody>\n</table>\n<table style=\"border-collapse: collapse; width: 100%; height: 44.75px;\" border=\"1\">\n<tbody>\n<tr style=\"height: 22.3906px;\">\n<td style=\"width: 13.2805%; height: 22.375px; line-height: 1.1;\">总金额大写：</td>\n<td style=\"width: 20.1189%; height: 22.375px; line-height: 1.1;\">【总金额大写】</td>\n<td style=\"width: 18.8305%; height: 22.375px; line-height: 1.1;\">【备注】</td>\n<td style=\"width: 8.72151%; height: 22.375px; line-height: 1.1;\">总重量：</td>\n<td style=\"width: 9.31557%; height: 22.375px; line-height: 1.1;\">【总数量】</td>\n<td style=\"width: 3.07294%; line-height: 1.1; height: 22.375px;\">&nbsp;</td>\n<td style=\"width: 26.6601%; height: 22.375px; line-height: 1.1;\">【总金额】</td>\n</tr>\n<tr style=\"height: 22.3906px;\">\n<td style=\"width: 13.2805%; height: 22.375px; line-height: 1.1;\">公司地址：</td>\n<td style=\"height: 22.375px; line-height: 1.1; width: 86.7195%;\" colspan=\"6\">XXXXXXXXXXX公司&nbsp; &nbsp; &nbsp; &nbsp; 电话：&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</td>\n</tr>\n</tbody>\n</table>\n<div>\n<table style=\"border-collapse: collapse; width: 100%;\" border=\"1\">\n<tbody>\n<tr>\n<td style=\"width: 100%;\" rowspan=\"2\">合同说明：<br /><span style=\"font-size: 14px;\">&nbsp; &nbsp; &nbsp; 1、产品的价格以需要方购买产品入库价格为准，产品的价格不含税。（如需税票另行协商）</span><br /><span style=\"font-size: 14px;\">&nbsp; &nbsp; &nbsp; 2、供方供货后，需方自货物检验合格、合同约定时间内相应货款，双方另有约定除外。</span><br /><span style=\"font-size: 14px;\">&nbsp; &nbsp; &nbsp; 3、需方逾期不付清款，供方有权收取需方违约金（每逾期一天，按货款金额1%计算），并向需方收取欠款</span><span style=\"font-size: 14px;\"> 。&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 4、一方需要终止履行，需要提前十天以书面形式通知对方，需方应于合同终止履行后的（经双方协定具体多少天）天内将应付货款全部付清。<br /></span></td>\n</tr>\n<tr></tr>\n<tr>\n<td style=\"width: 100%;\"><span style=\"font-size: 14px;\">&nbsp; 第一联：收款 （白）&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 第二联：客户（红）&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;第三联：存根（黄）</span></td>\n</tr>\n<tr>\n<td style=\"width: 100%;\"><span style=\"font-size: 14px;\">&nbsp; 制单：&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 客户签字（盖章）：</span></td>\n</tr>\n</tbody>\n</table>\n</div>",
                "dateFormat": "1",
                "fieldList": [
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361736000,
                        "displayOrder": 0,
                        "fieldName": "displayBillNo",
                        "fieldType": "field",
                        "recId": 337134,
                        "templateId": 4542
                    },
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361736000,
                        "displayOrder": 1,
                        "fieldName": "saleOrderDate",
                        "fieldType": "field",
                        "recId": 337135,
                        "templateId": 4542
                    },
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361736000,
                        "displayOrder": 2,
                        "fieldName": "customerName",
                        "fieldType": "field",
                        "recId": 337136,
                        "templateId": 4542
                    },
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361736000,
                        "displayOrder": 3,
                        "fieldName": "customerTelNo",
                        "fieldType": "field",
                        "recId": 337137,
                        "templateId": 4542
                    },
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361736000,
                        "displayOrder": 4,
                        "fieldName": "taxAllAmountUp",
                        "fieldType": "field",
                        "recId": 337138,
                        "templateId": 4542
                    },
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361736000,
                        "displayOrder": 5,
                        "fieldName": "remarks",
                        "fieldType": "field",
                        "recId": 337139,
                        "templateId": 4542
                    },
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361736000,
                        "displayOrder": 6,
                        "fieldName": "totalQuantity",
                        "fieldType": "field",
                        "recId": 337140,
                        "templateId": 4542
                    },
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361736000,
                        "displayOrder": 7,
                        "fieldName": "taxAllAmount",
                        "fieldType": "field",
                        "recId": 337141,
                        "templateId": 4542
                    }
                ],
                "isDefault": 0,
                "materialFieldList": [],
                "maxRow": 12,
                "paperSize": "t3_2",
                "prodFieldList": [
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361736000,
                        "displayOrder": 0,
                        "fieldName": "serialNumber",
                        "fieldType": "prodField",
                        "recId": 337142,
                        "templateId": 4542
                    },
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361736000,
                        "displayOrder": 1,
                        "fieldName": "prodCustomNo",
                        "fieldType": "prodField",
                        "recId": 337143,
                        "templateId": 4542
                    },
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361737000,
                        "displayOrder": 2,
                        "fieldName": "prodName",
                        "fieldType": "prodField",
                        "recId": 337144,
                        "templateId": 4542
                    },
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361737000,
                        "displayOrder": 3,
                        "fieldName": "unit",
                        "fieldType": "prodField",
                        "recId": 337145,
                        "templateId": 4542
                    },
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361737000,
                        "displayOrder": 4,
                        "fieldName": "quantity",
                        "fieldType": "prodField",
                        "recId": 337146,
                        "templateId": 4542
                    },
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361737000,
                        "displayOrder": 5,
                        "fieldName": "unitPrice",
                        "fieldType": "prodField",
                        "recId": 337147,
                        "templateId": 4542
                    },
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361737000,
                        "displayOrder": 6,
                        "fieldName": "amount",
                        "fieldType": "prodField",
                        "recId": 337148,
                        "templateId": 4542
                    },
                    {
                        "addedLoginName": "songchensailors",
                        "addedTime": 1641361737000,
                        "displayOrder": 7,
                        "fieldName": "remarks",
                        "fieldType": "prodField",
                        "recId": 337149,
                        "templateId": 4542
                    }
                ],
                "sortAryStr": "【序号】-serialNumber,【物品编号】-prodCustomNo,【物品名称】-prodName,【一级类目】-firstCatName,【二级类目】-secondCatName,【三级类目】-thirdCatName,【批次号】-batchNo,【生产日期】-productionDate,【到期日期】-expirationDate,【规格型号】-descItem,【品牌】-brand,【物品图片】-thumbnailUri,【制造商型号】-produceModel,【库存下限】-minQuantity,【库存上限】-maxQuantity,【商品条码】-proBarCode,【自定义字段1】-propertyValue1,【自定义字段2】-propertyValue2,【自定义字段3】-propertyValue3,【自定义字段4】-propertyValue4,【自定义字段5】-propertyValue5,【单据物品自定义字段1】-property_value1,【单据物品自定义字段2】-property_value2,【单据物品自定义字段3】-property_value3,【单据物品自定义字段4】-property_value4,【单据物品自定义字段5】-property_value5,【单位】-unit,【销售数量】-quantity,【辅助单位】-recUnit,【辅助销售数量】-recQuantity,【单位关系】-unitConverter,【税额】-tax,【未税单价】-untaxedPrice,【未税金额】-untaxedAmount,【税率】-taxRate,【含税单价】-unitPrice,【价税合计】-amount,【备注】-remarks,【交货日期】-deliveryDeadlineDate",
                "templateName": "销售订单模板",
                "updatedTime": 1654384400000,
                "wordSize": "14"
            },
            "retCode": "0"
        },
        "recommend-008": {
            "data": {
                "billType": "PurchaseOrder",
                "content": "<table style=\"border-collapse: collapse; width: 99.7599%; height: 64px; border-style: hidden;\" border=\"1\">\n<tbody>\n<tr style=\"height: 34px;\">\n<td style=\"width: 69.2707%; height: 34px; border-style: hidden;\">\n<h3 style=\"text-align: center;\"><strong><span style=\"font-size: 24px;\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;XXXXXXXXX采购订单</span></strong></h3>\n</td>\n<td style=\"width: 27.2923%; height: 34px; border-style: hidden;\">\n<p style=\"text-align: right;\"><span style=\"font-size: 14px;\">单据编号：【采购单号】</span></p>\n<p style=\"text-align: right;\"><span style=\"font-size: 14px;\">制单日期：【制单时间】</span></p>\n</td>\n</tr>\n</tbody>\n</table>\n<div>&nbsp;</div>\n<table style=\"border-collapse: collapse; width: 100.001%; height: 66px;\" border=\"1\">\n<tbody>\n<tr style=\"height: 22px;\">\n<td style=\"width: 12.5885%; height: 22px;\"><strong>采购方：</strong></td>\n<td style=\"width: 35.175%; text-align: left; height: 22px;\">【采购方】</td>\n<td style=\"width: 13.9958%; height: 22px; text-align: left;\"><strong>供货方：</strong></td>\n<td style=\"width: 34.8038%; height: 22px; text-align: left;\">【供应商】</td>\n</tr>\n<tr style=\"height: 22px;\">\n<td style=\"width: 12.5885%; height: 22px;\">联系人：</td>\n<td style=\"width: 35.175%; text-align: left; height: 22px;\">【采购方-联系人】</td>\n<td style=\"width: 13.9958%; height: 22px;\">联系人：</td>\n<td style=\"width: 34.8038%; height: 22px;\">【供应商-联系人】</td>\n</tr>\n<tr style=\"height: 22px;\">\n<td style=\"width: 12.5885%; height: 22px;\">联系电话：</td>\n<td style=\"width: 35.175%; text-align: left; height: 22px;\">【供应商-联系电话】</td>\n<td style=\"width: 13.9958%; height: 22px;\">联系电话：</td>\n<td style=\"width: 34.8038%; height: 22px;\">【供应商-联系电话】</td>\n</tr>\n</tbody>\n</table>\n<table id=\"template-tables\" style=\"table-layout: fixed; overflow-wrap: break-word; height: 44px;\" border=\"1\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\n<tbody>\n<tr style=\"height: 22px;\">\n<th id=\"ts1-serialNumber\" style=\"text-align: center; font-weight: normal; width: 3%; height: 22px;\">序号</th>\n<th id=\"ts1-prodCustomNo\" style=\"text-align: center; font-weight: normal; display: none; width: 6.37786%; height: 22px;\">物品编号</th>\n<th id=\"ts1-prodName\" style=\"text-align: center; font-weight: normal; width: 5.77617%; height: 22px;\">物品名称</th>\n<th id=\"ts1-firstCatName\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">一级类目</th>\n<th id=\"ts1-secondCatName\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">二级类目</th>\n<th id=\"ts1-thirdCatName\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">三级类目</th>\n<th id=\"ts1-batchNo\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">批次号</th>\n<th id=\"ts1-productionDate\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">生产日期</th>\n<th id=\"ts1-expirationDate\" style=\"text-align: center; font-weight: normal; display: none; width: 6.25752%; height: 22px;\">到期日期</th>\n<th id=\"ts1-descItem\" style=\"text-align: center; font-weight: normal; width: 5.89648%; height: 22px;\">规格型号</th>\n<th id=\"ts1-brand\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">品牌</th>\n<th id=\"ts1-thumbnailUri\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">物品图片</th>\n<th id=\"ts1-produceModel\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">制造商型号</th>\n<th id=\"ts1-minQuantity\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">库存下限</th>\n<th id=\"ts1-maxQuantity\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">库存上限</th>\n<th id=\"ts1-proBarCode\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">商品条码</th>\n<th id=\"ts1-propertyValue1\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">自定义字段1</th>\n<th id=\"ts1-propertyValue2\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">自定义字段2</th>\n<th id=\"ts1-propertyValue3\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">自定义字段3</th>\n<th id=\"ts1-propertyValue4\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">自定义字段4</th>\n<th id=\"ts1-propertyValue5\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">自定义字段5</th>\n<th id=\"ts1-property_value1\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">单据物品自定义字段1</th>\n<th id=\"ts1-property_value2\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">单据物品自定义字段2</th>\n<th id=\"ts1-property_value3\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">单据物品自定义字段3</th>\n<th id=\"ts1-property_value4\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">单据物品自定义字段4</th>\n<th id=\"ts1-property_value5\" style=\"text-align: center; font-weight: normal; display: none; width: 15.6438%; height: 22px;\">单据物品自定义字段5</th>\n<th id=\"ts1-unit\" style=\"text-align: center; font-weight: normal; width: 3.85071%; height: 22px;\">单位</th>\n<th id=\"ts1-quantity\" style=\"text-align: center; font-weight: normal; width: 4.81345%; height: 22px;\">数量</th>\n<th id=\"ts1-recUnit\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">辅助单位</th>\n<th id=\"ts1-recQuantity\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">辅助采购数量</th>\n<th id=\"ts1-unitConverter\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">单位关系</th>\n<th id=\"ts1-tax\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">税额</th>\n<th id=\"ts1-untaxedPrice\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">未税单价</th>\n<th id=\"ts1-untaxedAmount\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">未税金额</th>\n<th id=\"ts1-taxRate\" style=\"text-align: center; font-weight: normal; display: none; width: 12.7557%; height: 22px;\">税率</th>\n<th id=\"ts1-unitPrice\" style=\"text-align: center; font-weight: normal; width: 6.25748%; height: 22px;\">单价</th>\n<th id=\"ts1-amount\" style=\"text-align: center; font-weight: normal; width: 6.9795%; height: 22px;\">金额</th>\n<th id=\"ts1-deliveryDeadlineDate\" style=\"text-align: center; font-weight: normal; width: 5.88809%; height: 22px;\">交付日期</th>\n<th id=\"ts1-remarks\" style=\"text-align: center; font-weight: normal; width: 7.5812%; height: 22px;\">备注</th>\n<th id=\"ts1-saleBillNo\" style=\"text-align: center; font-weight: normal; display: none; width: 3.24909%; height: 22px;\">上游单号</th>\n<th id=\"ts1-entNum\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">已入库数量</th>\n<th id=\"ts1-returnNum\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">退货数量</th>\n<th id=\"ts1-actualNum\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">实际入库数量</th>\n<th id=\"ts1-unEntNum\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">未入库数量</th>\n</tr>\n<tr style=\"height: 22px;\">\n<th id=\"ts2-serialNumber\" style=\"text-align: center; font-weight: normal; width: 3%; height: 22px;\">{序号}</th>\n<th id=\"ts2-prodCustomNo\" style=\"text-align: center; font-weight: normal; display: none; width: 6.37786%; height: 22px;\">{物品编号}</th>\n<th id=\"ts2-prodName\" style=\"text-align: center; font-weight: normal; width: 5.77617%; height: 22px;\">{物品名称}</th>\n<th id=\"ts2-firstCatName\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{一级类目}</th>\n<th id=\"ts2-secondCatName\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{二级类目}</th>\n<th id=\"ts2-thirdCatName\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{三级类目}</th>\n<th id=\"ts2-batchNo\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{批次号}</th>\n<th id=\"ts2-productionDate\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{生产日期}</th>\n<th id=\"ts2-expirationDate\" style=\"text-align: center; font-weight: normal; display: none; width: 6.25752%; height: 22px;\">{到期日期}</th>\n<th id=\"ts2-descItem\" style=\"text-align: center; font-weight: normal; width: 5.89648%; height: 22px;\">{规格型号}</th>\n<th id=\"ts2-brand\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{品牌}</th>\n<th id=\"ts2-thumbnailUri\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{物品图片}</th>\n<th id=\"ts2-produceModel\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{制造商型号}</th>\n<th id=\"ts2-minQuantity\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{库存下限}</th>\n<th id=\"ts2-maxQuantity\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{库存上限}</th>\n<th id=\"ts2-proBarCode\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{商品条码}</th>\n<th id=\"ts2-propertyValue1\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{自定义字段1}</th>\n<th id=\"ts2-propertyValue2\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{自定义字段2}</th>\n<th id=\"ts2-propertyValue3\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{自定义字段3}</th>\n<th id=\"ts2-propertyValue4\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{自定义字段4}</th>\n<th id=\"ts2-propertyValue5\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{自定义字段5}</th>\n<th id=\"ts2-property_value1\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{单据物品自定义字段1}</th>\n<th id=\"ts2-property_value2\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{单据物品自定义字段2}</th>\n<th id=\"ts2-property_value3\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{单据物品自定义字段3}</th>\n<th id=\"ts2-property_value4\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{单据物品自定义字段4}</th>\n<th id=\"ts2-property_value5\" style=\"text-align: center; font-weight: normal; display: none; width: 15.6438%; height: 22px;\">{单据物品自定义字段5}</th>\n<th id=\"ts2-unit\" style=\"text-align: center; font-weight: normal; width: 3.85071%; height: 22px;\">{单位}</th>\n<th id=\"ts2-quantity\" style=\"text-align: center; font-weight: normal; width: 4.81345%; height: 22px;\">{采购数量}</th>\n<th id=\"ts2-recUnit\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{辅助单位}</th>\n<th id=\"ts2-recQuantity\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{辅助采购数量}</th>\n<th id=\"ts2-unitConverter\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{单位关系}</th>\n<th id=\"ts2-tax\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{税额}</th>\n<th id=\"ts2-untaxedPrice\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{未税单价}</th>\n<th id=\"ts2-untaxedAmount\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{未税金额}</th>\n<th id=\"ts2-taxRate\" style=\"text-align: center; font-weight: normal; display: none; width: 12.7557%; height: 22px;\">{税率}</th>\n<th id=\"ts2-unitPrice\" style=\"text-align: center; font-weight: normal; width: 6.25748%; height: 22px;\">{含税单价}</th>\n<th id=\"ts2-amount\" style=\"text-align: center; font-weight: normal; width: 6.9795%; height: 22px;\">{价税合计}</th>\n<th id=\"ts2-deliveryDeadlineDate\" style=\"text-align: center; font-weight: normal; width: 5.88809%; height: 22px;\">{交付日期}</th>\n<th id=\"ts2-remarks\" style=\"text-align: center; font-weight: normal; width: 7.5812%; height: 22px;\">{备注}</th>\n<th id=\"ts2-saleBillNo\" style=\"text-align: center; font-weight: normal; display: none; width: 3.24909%; height: 22px;\">{上游单号}</th>\n<th id=\"ts2-entNum\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{已入库数量}</th>\n<th id=\"ts2-returnNum\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{退货数量}</th>\n<th id=\"ts2-actualNum\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{实际入库数量}</th>\n<th id=\"ts2-unEntNum\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; height: 22px;\">{未入库数量}</th>\n</tr>\n</tbody>\n</table>\n<table style=\"border-collapse: collapse; width: 100.001%; height: 44px;\" border=\"1\">\n<tbody>\n<tr style=\"height: 22px;\">\n<td style=\"width: 10.6264%; height: 22px;\">总金额大写：</td>\n<td style=\"width: 28.6768%; height: 22px;\">【总金额大写】</td>\n<td style=\"width: 11.8665%; height: 22px;\">总数量</td>\n<td style=\"width: 27.5102%; height: 22px;\">【总数量】</td>\n</tr>\n<tr style=\"height: 22px;\">\n<td style=\"width: 10.6264%; height: 22px;\">送货地址：</td>\n<td style=\"width: 28.6768%; height: 22px;\">【交付地址】</td>\n<td style=\"width: 11.8665%; height: 22px;\">结算方式：</td>\n<td style=\"width: 27.5102%; height: 22px;\">【结算方式】</td>\n</tr>\n</tbody>\n</table>\n<div>\n<table style=\"border-collapse: collapse; width: 100.001%; height: 102px;\" border=\"1\">\n<tbody>\n<tr style=\"height: 80px;\">\n<td style=\"width: 100%; height: 80px;\"><span style=\"font-size: 14px;\"><strong>采购说明：</strong></span><br /><span style=\"font-size: 14px;\">&nbsp; &nbsp; &nbsp; 1、厂商如无法准时交货时需书页通知协商确认，否则采购方有权取消订单。</span><br /><span style=\"font-size: 14px;\">&nbsp; &nbsp; &nbsp; 2、厂商保证产品与服务需完全条全符合订单要求，如有品质问题采购方有权要求更换或退货。</span><br /><span style=\"font-size: 14px;\">&nbsp; &nbsp; &nbsp; 3、如因产品质量不符合订单规格而造成采购方损失，厂商需负责承担所需费用。</span></td>\n</tr>\n<tr style=\"height: 22px;\">\n<td style=\"width: 100%; height: 22px;\"><span style=\"font-size: 14px;\">&nbsp;第一联：收款 （白）&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 第二联：客户（红）&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;第三联：存根（黄）&nbsp; &nbsp;&nbsp;</span></td>\n</tr>\n</tbody>\n</table>\n</div>",
                "dateFormat": "1",
                "fieldList": [
                    {
                        "addedLoginName": "jiao1234",
                        "addedTime": 1657261508000,
                        "displayOrder": 0,
                        "fieldName": "displayBillNo",
                        "fieldType": "field",
                        "recId": 458109,
                        "templateId": 5834
                    },
                    {
                        "addedLoginName": "jiao1234",
                        "addedTime": 1657261508000,
                        "displayOrder": 1,
                        "fieldName": "addedTime",
                        "fieldType": "field",
                        "recId": 458110,
                        "templateId": 5834
                    },
                    {
                        "addedLoginName": "jiao1234",
                        "addedTime": 1657261508000,
                        "displayOrder": 2,
                        "fieldName": "ourName",
                        "fieldType": "field",
                        "recId": 458111,
                        "templateId": 5834
                    },
                    {
                        "addedLoginName": "jiao1234",
                        "addedTime": 1657261508000,
                        "displayOrder": 3,
                        "fieldName": "supplierName",
                        "fieldType": "field",
                        "recId": 458112,
                        "templateId": 5834
                    },
                    {
                        "addedLoginName": "jiao1234",
                        "addedTime": 1657261508000,
                        "displayOrder": 4,
                        "fieldName": "ourContacterName",
                        "fieldType": "field",
                        "recId": 458113,
                        "templateId": 5834
                    },
                    {
                        "addedLoginName": "jiao1234",
                        "addedTime": 1657261508000,
                        "displayOrder": 5,
                        "fieldName": "supplierContacterName",
                        "fieldType": "field",
                        "recId": 458114,
                        "templateId": 5834
                    },
                    {
                        "addedLoginName": "jiao1234",
                        "addedTime": 1657261508000,
                        "displayOrder": 6,
                        "fieldName": "supplierMobile",
                        "fieldType": "field",
                        "recId": 458115,
                        "templateId": 5834
                    },
                    {
                        "addedLoginName": "jiao1234",
                        "addedTime": 1657261508000,
                        "displayOrder": 7,
                        "fieldName": "supplierMobile",
                        "fieldType": "field",
                        "recId": 458116,
                        "templateId": 5834
                    },
                    {
                        "addedLoginName": "jiao1234",
                        "addedTime": 1657261508000,
                        "displayOrder": 8,
                        "fieldName": "taxAllAmountUp",
                        "fieldType": "field",
                        "recId": 458117,
                        "templateId": 5834
                    },
                    {
                        "addedLoginName": "jiao1234",
                        "addedTime": 1657261508000,
                        "displayOrder": 9,
                        "fieldName": "totalQuantity",
                        "fieldType": "field",
                        "recId": 458118,
                        "templateId": 5834
                    },
                    {
                        "addedLoginName": "jiao1234",
                        "addedTime": 1657261508000,
                        "displayOrder": 10,
                        "fieldName": "deliveryProvinceText",
                        "fieldType": "field",
                        "recId": 458119,
                        "templateId": 5834
                    },
                    {
                        "addedLoginName": "jiao1234",
                        "addedTime": 1657261508000,
                        "displayOrder": 11,
                        "fieldName": "settlement",
                        "fieldType": "field",
                        "recId": 458120,
                        "templateId": 5834
                    }
                ],
                "isDefault": 0,
                "materialFieldList": [],
                "maxRow": 12,
                "paperSize": "t3_2",
                "prodFieldList": [
                    {
                        "addedLoginName": "jiao1234",
                        "addedTime": 1657261508000,
                        "displayOrder": 0,
                        "fieldName": "serialNumber",
                        "fieldType": "prodField",
                        "recId": 458121,
                        "templateId": 5834
                    },
                    {
                        "addedLoginName": "jiao1234",
                        "addedTime": 1657261508000,
                        "displayOrder": 1,
                        "fieldName": "prodName",
                        "fieldType": "prodField",
                        "recId": 458122,
                        "templateId": 5834
                    },
                    {
                        "addedLoginName": "jiao1234",
                        "addedTime": 1657261508000,
                        "displayOrder": 2,
                        "fieldName": "descItem",
                        "fieldType": "prodField",
                        "recId": 458123,
                        "templateId": 5834
                    },
                    {
                        "addedLoginName": "jiao1234",
                        "addedTime": 1657261508000,
                        "displayOrder": 3,
                        "fieldName": "unit",
                        "fieldType": "prodField",
                        "recId": 458124,
                        "templateId": 5834
                    },
                    {
                        "addedLoginName": "jiao1234",
                        "addedTime": 1657261508000,
                        "displayOrder": 4,
                        "fieldName": "quantity",
                        "fieldType": "prodField",
                        "recId": 458125,
                        "templateId": 5834
                    },
                    {
                        "addedLoginName": "jiao1234",
                        "addedTime": 1657261508000,
                        "displayOrder": 5,
                        "fieldName": "unitPrice",
                        "fieldType": "prodField",
                        "recId": 458126,
                        "templateId": 5834
                    },
                    {
                        "addedLoginName": "jiao1234",
                        "addedTime": 1657261508000,
                        "displayOrder": 6,
                        "fieldName": "amount",
                        "fieldType": "prodField",
                        "recId": 458127,
                        "templateId": 5834
                    },
                    {
                        "addedLoginName": "jiao1234",
                        "addedTime": 1657261508000,
                        "displayOrder": 7,
                        "fieldName": "deliveryDeadlineDate",
                        "fieldType": "prodField",
                        "recId": 458128,
                        "templateId": 5834
                    },
                    {
                        "addedLoginName": "jiao1234",
                        "addedTime": 1657261508000,
                        "displayOrder": 8,
                        "fieldName": "remarks",
                        "fieldType": "prodField",
                        "recId": 458129,
                        "templateId": 5834
                    }
                ],
                "sortAryStr": "【序号】-serialNumber,【物品编号】-prodCustomNo,【物品名称】-prodName,【一级类目】-firstCatName,【二级类目】-secondCatName,【三级类目】-thirdCatName,【批次号】-batchNo,【生产日期】-productionDate,【到期日期】-expirationDate,【规格型号】-descItem,【品牌】-brand,【物品图片】-thumbnailUri,【制造商型号】-produceModel,【库存下限】-minQuantity,【库存上限】-maxQuantity,【商品条码】-proBarCode,【自定义字段1】-propertyValue1,【自定义字段2】-propertyValue2,【自定义字段3】-propertyValue3,【自定义字段4】-propertyValue4,【自定义字段5】-propertyValue5,【单据物品自定义字段1】-property_value1,【单据物品自定义字段2】-property_value2,【单据物品自定义字段3】-property_value3,【单据物品自定义字段4】-property_value4,【单据物品自定义字段5】-property_value5,【单位】-unit,【采购数量】-quantity,【辅助单位】-recUnit,【辅助采购数量】-recQuantity,【单位关系】-unitConverter,【税额】-tax,【未税单价】-untaxedPrice,【未税金额】-untaxedAmount,【税率】-taxRate,【含税单价】-unitPrice,【价税合计】-amount,【交付日期】-deliveryDeadlineDate,【备注】-remarks,【上游单号】-saleBillNo,【已入库数量】-entNum,【退货数量】-returnNum,【实际入库数量】-actualNum,【未入库数量】-unEntNum",
                "templateName": "采购订单模板",
                "updatedTime": 1654384400000,
                "wordSize": "14"
            },
            "retCode": "0"
        },
        "recommend-009": {
            "data": {
                "billType": "PurchaseOrder",
                "content": "<table style=\"border-collapse: collapse; width: 100.147%; height: 30px; border-style: none;\" border=\"1\">\n<tbody>\n<tr style=\"height: 10px;\">\n<td style=\"width: 18.7232%; height: 30px; border-style: none;\" rowspan=\"3\"><img src=\"https://appserver.abiz.com/api/pic/ABIZBEST_PIC_2331514_2d8abb23ab7747b480dbd5c37046b534.jpg\" alt=\"\" width=\"98\" height=\"98\" /></td>\n<td style=\"width: 79.1062%; height: 10px; border-style: none;\"><span style=\"font-size: 24px;\"><strong>&nbsp; &nbsp;XXXXXXXXXXXXXXXXXX&nbsp; 有&nbsp; &nbsp;限&nbsp; &nbsp;公&nbsp; &nbsp;司</strong></span></td>\n</tr>\n<tr style=\"height: 10px;\">\n<td style=\"width: 79.1062%; height: 10px; border-style: none;\"><span style=\"font-size: 14px;\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 地址：XX市XXXXXX路XXX号XXXX</span></td>\n</tr>\n<tr style=\"height: 10px;\">\n<td style=\"width: 79.1062%; height: 10px; border-style: none;\"><span style=\"font-size: 14px;\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 电话：XXXXXXXXXXX&nbsp; 传真：XXXX-XXXXXXX </span>网址：www.XXXX.com</td>\n</tr>\n</tbody>\n</table>\n<table style=\"border-collapse: collapse; width: 100%; height: 16px; border-style: none;\" border=\"1\">\n<tbody>\n<tr style=\"height: 16px;\">\n<td style=\"width: 100%; height: 16px; line-height: 1; border-style: none;\"><strong><span style=\"font-size: 24px;\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;采&nbsp; &nbsp; 购&nbsp; &nbsp; 单</span></strong></td>\n</tr>\n</tbody>\n</table>\n<table style=\"border-collapse: collapse; width: 100%; height: 40px; border-style: none;\" border=\"1\">\n<tbody>\n<tr style=\"height: 10px;\">\n<td style=\"width: 58.237%; height: 10px; border-style: none; line-height: 1;\" colspan=\"2\"><span style=\"font-size: 14px;\">供应商名称：【供应商】</span></td>\n<td style=\"width: 41.7034%; height: 10px; border-style: none; line-height: 1;\" colspan=\"2\"><span style=\"font-size: 14px;\">采购单号：【采购单号】</span></td>\n</tr>\n<tr style=\"height: 10px;\">\n<td style=\"width: 58.237%; height: 10px; border-style: none; line-height: 1;\" colspan=\"2\"><span style=\"font-size: 14px;\">联 系 人：【供应商-联系人】</span></td>\n<td style=\"height: 10px; border-style: none; line-height: 1; width: 41.7034%;\" colspan=\"2\"><span style=\"font-size: 14px;\">币&nbsp; &nbsp; 别：</span></td>\n</tr>\n<tr style=\"height: 10px;\">\n<td style=\"width: 58.237%; height: 10px; border-style: none; line-height: 1;\" colspan=\"2\"><span style=\"font-size: 14px;\">电&nbsp; &nbsp; 话：【供应商-联系电话】</span></td>\n<td style=\"width: 41.7034%; height: 10px; border-style: none; line-height: 1;\" colspan=\"2\"><span style=\"font-size: 14px;\">结款方式：【结算方式】</span></td>\n</tr>\n<tr style=\"height: 10px;\">\n<td style=\"width: 99.9403%; height: 10px; border-style: none; line-height: 1;\" colspan=\"4\"><span style=\"font-size: 14px;\">地&nbsp; &nbsp; 址：【供应商-注册地址】</span></td>\n</tr>\n</tbody>\n</table>\n<table id=\"template-tables\" style=\"table-layout: fixed; overflow-wrap: break-word; width: 100%; height: 66px;\" border=\"1\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\n<tbody>\n<tr style=\"height: 22px;\">\n<th id=\"ts1-serialNumber\" style=\"text-align: center; font-weight: normal; width: 4.02791%; height: 22px;\">序号</th>\n<th id=\"ts1-prodCustomNo\" style=\"text-align: center; font-weight: normal; width: 7.48898%; height: 22px;\">物品编号</th>\n<th id=\"ts1-firstCatName\" style=\"text-align: center; font-weight: normal; width: 6.37739%; height: 22px;\">物品类别</th>\n<th id=\"ts1-prodName\" style=\"text-align: center; font-weight: normal; width: 10.7195%; height: 22px;\">物品名称</th>\n<th id=\"ts1-descItem\" style=\"text-align: center; font-weight: normal; width: 7.78264%; height: 22px;\">规格型号</th>\n<th id=\"ts1-unit\" style=\"text-align: center; font-weight: normal; width: 3.96469%; height: 22px;\">单位</th>\n<th id=\"ts1-quantity\" style=\"text-align: center; font-weight: normal; width: 7.34211%; height: 22px;\">采购数量</th>\n<th id=\"ts1-unitPrice\" style=\"text-align: center; font-weight: normal; width: 5.57984%; height: 22px;\">单价</th>\n<th id=\"ts1-amount\" style=\"text-align: center; font-weight: normal; width: 6.90158%; height: 22px;\">金额</th>\n<th id=\"ts1-deliveryDeadlineDate\" style=\"text-align: center; font-weight: normal; width: 6.90151%; height: 22px;\">交付日期</th>\n<th id=\"ts1-remarks\" style=\"text-align: center; font-weight: normal; width: 4.69894%; height: 22px;\">备注</th>\n</tr>\n<tr style=\"height: 44px;\">\n<th id=\"ts2-serialNumber\" style=\"text-align: center; font-weight: normal; width: 4.02791%; height: 44px;\">{序号}</th>\n<th id=\"ts2-prodCustomNo\" style=\"text-align: center; font-weight: normal; width: 7.48898%; height: 44px;\">{物品编号}</th>\n<th id=\"ts2-firstCatName\" style=\"text-align: center; font-weight: normal; width: 6.37739%; height: 44px;\">{一级类目}</th>\n<th id=\"ts2-prodName\" style=\"text-align: center; font-weight: normal; width: 10.7195%; height: 44px;\">{物品名称}</th>\n<th id=\"ts2-descItem\" style=\"text-align: center; font-weight: normal; width: 7.78264%; height: 44px;\">{规格型号}</th>\n<th id=\"ts2-unit\" style=\"text-align: center; font-weight: normal; width: 3.96469%; height: 44px;\">{单位}</th>\n<th id=\"ts2-quantity\" style=\"text-align: center; font-weight: normal; width: 7.34211%; height: 44px;\">{采购数量}</th>\n<th id=\"ts2-unitPrice\" style=\"text-align: center; font-weight: normal; width: 5.57984%; height: 44px;\">{含税单价}</th>\n<th id=\"ts2-amount\" style=\"text-align: center; font-weight: normal; width: 6.90158%; height: 44px;\">{价税合计}</th>\n<th id=\"ts2-deliveryDeadlineDate\" style=\"text-align: center; font-weight: normal; width: 6.90151%; height: 44px;\">{交付日期}</th>\n<th id=\"ts2-remarks\" style=\"text-align: center; font-weight: normal; width: 4.69894%; height: 44px;\">{备注}</th>\n</tr>\n</tbody>\n</table>\n<table style=\"border-collapse: collapse; width: 100%;\" border=\"1\">\n<tbody>\n<tr>\n<td style=\"width: 44.3671%;\">合计：【总金额大写】</td>\n<td style=\"width: 15.7951%;\">【总数量】</td>\n<td style=\"width: 33.6198%;\">【总金额】</td>\n</tr>\n</tbody>\n</table>\n<ol>\n<li>请卖方严守交货日期,逾期交货每逾X日罚采购总价X%;</li>\n<li>如因交货逾期,质量不良,规格不符而造成本公司损失,卖方应负全部责任;</li>\n<li>货品之检验系根据本公司所订的检验标准，并需与所承认样品相符;</li>\n<li>本公司结账日为每月XX号，XX号前需将对账单传至我司，逾期视为下月货款;</li>\n<li>所交材料需符合最新X标准;</li>\n<li>收到订单后请于X小时内签回,否则视为确认。</li>\n</ol>\n<div>\n<table style=\"border-collapse: collapse; width: 100%; border-style: none; height: 10px;\" border=\"1\">\n<tbody>\n<tr style=\"height: 10px;\">\n<td style=\"width: 8.57951%; border-style: none; height: 10px;\">采购：</td>\n<td style=\"width: 20.6561%; border-style: none; height: 10px;\">【采购方-联系人】</td>\n<td style=\"width: 8.43223%; border-style: none; height: 10px;\">审核：</td>\n<td style=\"width: 20.8034%; border-style: none; height: 10px;\">【审批人】</td>\n<td style=\"width: 14.6178%; border-style: none; line-height: 1; height: 10px;\">供应商确认：</td>\n<td style=\"width: 14.6223%; border-style: none; height: 10px;\">&nbsp;</td>\n</tr>\n</tbody>\n</table>\n</div>",
                "dateFormat": "1",
                "fieldList": [
                    {
                        "addedLoginName": "xrelec",
                        "addedTime": 1663568071000,
                        "displayOrder": 0,
                        "fieldName": "supplierName",
                        "fieldType": "field",
                        "recId": 491782,
                        "templateId": 6199
                    },
                    {
                        "addedLoginName": "xrelec",
                        "addedTime": 1663568071000,
                        "displayOrder": 1,
                        "fieldName": "displayBillNo",
                        "fieldType": "field",
                        "recId": 491783,
                        "templateId": 6199
                    },
                    {
                        "addedLoginName": "xrelec",
                        "addedTime": 1663568071000,
                        "displayOrder": 2,
                        "fieldName": "supplierContacterName",
                        "fieldType": "field",
                        "recId": 491784,
                        "templateId": 6199
                    },
                    {
                        "addedLoginName": "xrelec",
                        "addedTime": 1663568071000,
                        "displayOrder": 3,
                        "fieldName": "supplierMobile",
                        "fieldType": "field",
                        "recId": 491785,
                        "templateId": 6199
                    },
                    {
                        "addedLoginName": "xrelec",
                        "addedTime": 1663568071000,
                        "displayOrder": 4,
                        "fieldName": "settlement",
                        "fieldType": "field",
                        "recId": 491786,
                        "templateId": 6199
                    },
                    {
                        "addedLoginName": "xrelec",
                        "addedTime": 1663568071000,
                        "displayOrder": 5,
                        "fieldName": "supplierRegisteredAddress",
                        "fieldType": "field",
                        "recId": 491787,
                        "templateId": 6199
                    },
                    {
                        "addedLoginName": "xrelec",
                        "addedTime": 1663568071000,
                        "displayOrder": 6,
                        "fieldName": "taxAllAmountUp",
                        "fieldType": "field",
                        "recId": 491788,
                        "templateId": 6199
                    },
                    {
                        "addedLoginName": "xrelec",
                        "addedTime": 1663568071000,
                        "displayOrder": 7,
                        "fieldName": "totalQuantity",
                        "fieldType": "field",
                        "recId": 491789,
                        "templateId": 6199
                    },
                    {
                        "addedLoginName": "xrelec",
                        "addedTime": 1663568071000,
                        "displayOrder": 8,
                        "fieldName": "taxAllAmount",
                        "fieldType": "field",
                        "recId": 491790,
                        "templateId": 6199
                    },
                    {
                        "addedLoginName": "xrelec",
                        "addedTime": 1663568071000,
                        "displayOrder": 9,
                        "fieldName": "ourContacterName",
                        "fieldType": "field",
                        "recId": 491791,
                        "templateId": 6199
                    },
                    {
                        "addedLoginName": "xrelec",
                        "addedTime": 1663568071000,
                        "displayOrder": 10,
                        "fieldName": "approvedLoginName",
                        "fieldType": "field",
                        "recId": 491792,
                        "templateId": 6199
                    }
                ],
                "isDefault": 0,
                "materialFieldList": [],
                "maxRow": 10,
                "paperSize": "a4_z",
                "prodFieldList": [
                    {
                        "addedLoginName": "xrelec",
                        "addedTime": 1663568071000,
                        "displayOrder": 0,
                        "fieldName": "serialNumber",
                        "fieldType": "prodField",
                        "recId": 491793,
                        "templateId": 6199
                    },
                    {
                        "addedLoginName": "xrelec",
                        "addedTime": 1663568071000,
                        "displayOrder": 1,
                        "fieldName": "prodCustomNo",
                        "fieldType": "prodField",
                        "recId": 491794,
                        "templateId": 6199
                    },
                    {
                        "addedLoginName": "xrelec",
                        "addedTime": 1663568071000,
                        "displayOrder": 2,
                        "fieldName": "firstCatName",
                        "fieldType": "prodField",
                        "recId": 491795,
                        "templateId": 6199
                    },
                    {
                        "addedLoginName": "xrelec",
                        "addedTime": 1663568071000,
                        "displayOrder": 3,
                        "fieldName": "prodName",
                        "fieldType": "prodField",
                        "recId": 491796,
                        "templateId": 6199
                    },
                    {
                        "addedLoginName": "xrelec",
                        "addedTime": 1663568071000,
                        "displayOrder": 4,
                        "fieldName": "descItem",
                        "fieldType": "prodField",
                        "recId": 491797,
                        "templateId": 6199
                    },
                    {
                        "addedLoginName": "xrelec",
                        "addedTime": 1663568071000,
                        "displayOrder": 5,
                        "fieldName": "unit",
                        "fieldType": "prodField",
                        "recId": 491798,
                        "templateId": 6199
                    },
                    {
                        "addedLoginName": "xrelec",
                        "addedTime": 1663568071000,
                        "displayOrder": 6,
                        "fieldName": "quantity",
                        "fieldType": "prodField",
                        "recId": 491799,
                        "templateId": 6199
                    },
                    {
                        "addedLoginName": "xrelec",
                        "addedTime": 1663568071000,
                        "displayOrder": 7,
                        "fieldName": "unitPrice",
                        "fieldType": "prodField",
                        "recId": 491800,
                        "templateId": 6199
                    },
                    {
                        "addedLoginName": "xrelec",
                        "addedTime": 1663568071000,
                        "displayOrder": 8,
                        "fieldName": "amount",
                        "fieldType": "prodField",
                        "recId": 491801,
                        "templateId": 6199
                    },
                    {
                        "addedLoginName": "xrelec",
                        "addedTime": 1663568071000,
                        "displayOrder": 9,
                        "fieldName": "deliveryDeadlineDate",
                        "fieldType": "prodField",
                        "recId": 491802,
                        "templateId": 6199
                    },
                    {
                        "addedLoginName": "xrelec",
                        "addedTime": 1663568071000,
                        "displayOrder": 10,
                        "fieldName": "remarks",
                        "fieldType": "prodField",
                        "recId": 491803,
                        "templateId": 6199
                    }
                ],
                "sortAryStr": "【序号】-serialNumber,【物品编号】-prodCustomNo,【一级类目】-firstCatName,【物品名称】-prodName,【二级类目】-secondCatName,【三级类目】-thirdCatName,【批次号】-batchNo,【生产日期】-productionDate,【到期日期】-expirationDate,【规格型号】-descItem,【品牌】-brand,【物品图片】-thumbnailUri,【制造商型号】-produceModel,【库存下限】-minQuantity,【库存上限】-maxQuantity,【商品条码】-proBarCode,【自定义字段1】-propertyValue1,【自定义字段2】-propertyValue2,【自定义字段3】-propertyValue3,【自定义字段4】-propertyValue4,【自定义字段5】-propertyValue5,【单据物品自定义字段1】-property_value1,【单据物品自定义字段2】-property_value2,【单据物品自定义字段3】-property_value3,【单据物品自定义字段4】-property_value4,【单据物品自定义字段5】-property_value5,【单位】-unit,【采购数量】-quantity,【辅助单位】-recUnit,【辅助采购数量】-recQuantity,【单位关系】-unitConverter,【税额】-tax,【未税单价】-untaxedPrice,【未税金额】-untaxedAmount,【税率】-taxRate,【含税单价】-unitPrice,【价税合计】-amount,【交付日期】-deliveryDeadlineDate,【备注】-remarks,【上游单号】-saleBillNo,【已入库数量】-entNum,【退货数量】-returnNum,【实际入库数量】-actualNum,【未入库数量】-unEntNum,【品牌】-prod_property_value1,【芯片尺寸】-prod_property_value2",
                "templateName": "采购单2",
                "updatedTime": 1654384400000,
                "wordSize": "14"
            },
            "retCode": "0"
        },
        "recommend-010": {
            "data": {
                "billType": "SaleOrder",
                "content": "<p>&nbsp;</p>\n<table style=\"border-collapse: collapse; width: 100%; height: 164px; border-style: none;\" border=\"1\">\n<tbody>\n<tr style=\"height: 48px;\">\n<td style=\"width: 98.5365%; height: 10px; border-style: none;\">\n<h1 style=\"text-align: center;\"><span style=\"font-size: 18px;\">XXXXXXXXXXXXX CO.,LTD</span></h1>\n</td>\n</tr>\n<tr style=\"height: 22px;\">\n<td style=\"width: 98.5365%; height: 22px; text-align: center; border-style: none;\"><strong><span style=\"font-size: 14px;\">M:0086-XXX XXXX XXXX&nbsp; Tel:+86-XXX-XXXXXXX</span></strong></td>\n</tr>\n<tr style=\"height: 22px;\">\n<td style=\"width: 98.5365%; height: 22px; text-align: center; border-style: none;\"><strong><span style=\"font-size: 14px;\">Web: www.XXXX.com&nbsp; &nbsp; &nbsp; &nbsp; Email: XXXX@XXXX.com</span></strong></td>\n</tr>\n<tr style=\"height: 22px;\">\n<td style=\"width: 98.5365%; height: 22px; text-align: center; border-style: none;\"><strong><span style=\"font-size: 18px;\">PROFORMA INVOICE</span></strong></td>\n</tr>\n<tr style=\"height: 22px;\">\n<td style=\"width: 98.5365%; height: 22px; border-style: none;\"><strong>To:【客户】</strong></td>\n</tr>\n<tr style=\"height: 22px;\">\n<td style=\"width: 98.5365%; height: 22px; border-style: none;\"><strong>Add:【交付地址】</strong></td>\n</tr>\n<tr style=\"height: 22px;\">\n<td style=\"width: 98.5365%; height: 22px; border-style: none;\"><strong>Attn:【客户-联系人】</strong></td>\n</tr>\n<tr style=\"height: 22px;\">\n<td style=\"width: 98.5365%; height: 22px; border-style: none;\"><strong>Tel:【客户-联系电话】</strong></td>\n</tr>\n</tbody>\n</table>\n<table style=\"border-collapse: collapse; width: 99.7072%;\" border=\"1\">\n<tbody>\n<tr>\n<td style=\"width: 68.8877%; border-color: #ced4d9; border-style: solid;\"><span style=\"font-size: 12px;\">The Seller and Buyer have agreed to close the following&nbsp; transactions,</span></td>\n<td style=\"width: 26.9181%; border-color: #ced4d9; border-style: solid;\"><span style=\"font-size: 14px;\">NO. :【销售单号】</span></td>\n</tr>\n<tr>\n<td style=\"width: 68.8877%; border-color: #ced4d9; border-style: solid;\"><span style=\"font-size: 12px;\">according to the terms and conditions stipulated below:</span></td>\n<td style=\"width: 26.9181%; border-color: #ced4d9; border-style: solid;\"><span style=\"font-size: 14px;\">Date :【销售日期】</span></td>\n</tr>\n</tbody>\n</table>\n<table id=\"template-tables\" style=\"table-layout: fixed; word-wrap: break-word;\" border=\"1\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\n<tbody>\n<tr>\n<th id=\"ts1-serialNumber\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">序号</th>\n<th id=\"ts1-prodCustomNo\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\"></th>\n<th id=\"ts1-prodName\" style=\"text-align: center; font-weight: normal; width: 8.51684%; border-color: #ced4d9; border-style: solid;\">Item Name</th>\n<th id=\"ts1-propertyValue1\" style=\"text-align: center; font-weight: normal; width: 8.96476%; border-color: #ced4d9; border-style: solid;\">Oem PN/Area</th>\n<th id=\"ts1-firstCatName\" style=\"text-align: center; font-weight: normal; width: 5%; border-color: #ced4d9; border-style: solid;\">Type</th>\n<th id=\"ts1-secondCatName\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">二级类目</th>\n<th id=\"ts1-thirdCatName\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">三级类目</th>\n<th id=\"ts1-batchNo\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">批次号</th>\n<th id=\"ts1-productionDate\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">生产日期</th>\n<th id=\"ts1-expirationDate\" style=\"text-align: center; font-weight: normal; display: none; width: 3.52423%; border-color: #ced4d9; border-style: solid;\">到期日期</th>\n<th id=\"ts1-descItem\" style=\"text-align: center; font-weight: normal; width: 8.95737%; border-color: #ced4d9; border-style: solid;\">Use For</th>\n<th id=\"ts1-brand\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">品牌</th>\n<th id=\"ts1-thumbnailUri\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">物品图片</th>\n<th id=\"ts1-produceModel\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">制造商型号</th>\n<th id=\"ts1-minQuantity\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">库存下限</th>\n<th id=\"ts1-maxQuantity\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">库存上限</th>\n<th id=\"ts1-proBarCode\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">商品条码</th>\n<th id=\"ts1-propertyValue2\" style=\"text-align: center; font-weight: normal; display: none; width: 3.0837%; border-color: #ced4d9; border-style: solid;\">自定义字段2</th>\n<th id=\"ts1-propertyValue3\" style=\"text-align: center; font-weight: normal; width: 3.23789%; border-color: #ced4d9; border-style: solid;\">Color</th>\n<th id=\"ts1-propertyValue4\" style=\"text-align: center; font-weight: normal; width: 3.67841%; border-color: #ced4d9; border-style: solid;\">Yield</th>\n<th id=\"ts1-propertyValue5\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">自定义字段5</th>\n<th id=\"ts1-unit\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">单位</th>\n<th id=\"ts1-recUnit\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">辅助单位</th>\n<th id=\"ts1-recQuantity\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">辅助销售数量</th>\n<th id=\"ts1-unitConverter\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">单位关系</th>\n<th id=\"ts1-tax\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">税额</th>\n<th id=\"ts1-untaxedPrice\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">未税单价</th>\n<th id=\"ts1-untaxedAmount\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">未税金额</th>\n<th id=\"ts1-taxRate\" style=\"text-align: center; font-weight: normal; display: none; width: 18.3554%; border-color: #ced4d9; border-style: solid;\">税率</th>\n<th id=\"ts1-unitPrice\" style=\"text-align: center; font-weight: normal; width: 3.5242%; border-color: #ced4d9; border-style: solid;\">Price (USD)</th>\n<th id=\"ts1-quantity\" style=\"text-align: center; font-weight: normal; width: 3.08366%; border-color: #ced4d9; border-style: solid;\">Qty (PCS)</th>\n<th id=\"ts1-currencyUnitPrice\" style=\"text-align: center; font-weight: normal; display: none; width: 10.5727%; border-color: #ced4d9; border-style: solid;\">本币单价</th>\n<th id=\"ts1-amount\" style=\"text-align: center; font-weight: normal; width: 3.3774%; border-color: #ced4d9; border-style: solid;\">Total (USD)</th>\n<th id=\"ts1-currencyAmount\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">本币金额</th>\n<th id=\"ts1-remarks\" style=\"text-align: center; font-weight: normal; width: 5%; border-color: #ced4d9; border-style: solid;\">Remarks</th>\n<th id=\"ts1-deliveryDeadlineDate\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">交货日期</th>\n<th id=\"ts1-outNum\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">已出库数量</th>\n<th id=\"ts1-returnNum\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">退货数量</th>\n<th id=\"ts1-actualNum\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">实际出库数量</th>\n<th id=\"ts1-unOutNum\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">未出库数量</th>\n</tr>\n<tr>\n<th id=\"ts2-serialNumber\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{序号}</th>\n<th id=\"ts2-prodCustomNo\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{物品编号}</th>\n<th id=\"ts2-prodName\" style=\"text-align: center; font-weight: normal; width: 8.51684%; border-color: #ced4d9; border-style: solid;\">{物品名称}</th>\n<th id=\"ts2-propertyValue1\" style=\"text-align: center; font-weight: normal; width: 8.96476%; border-color: #ced4d9; border-style: solid;\">{自定义字段1}</th>\n<th id=\"ts2-firstCatName\" style=\"text-align: center; font-weight: normal; width: 5%; border-color: #ced4d9; border-style: solid;\">{一级类目}</th>\n<th id=\"ts2-secondCatName\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">{二级类目}</th>\n<th id=\"ts2-thirdCatName\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">{三级类目}</th>\n<th id=\"ts2-batchNo\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">{批次号}</th>\n<th id=\"ts2-productionDate\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">{生产日期}</th>\n<th id=\"ts2-expirationDate\" style=\"text-align: center; font-weight: normal; display: none; width: 3.52423%; border-color: #ced4d9; border-style: solid;\">{到期日期}</th>\n<th id=\"ts2-descItem\" style=\"text-align: center; font-weight: normal; width: 8.95737%; border-color: #ced4d9; border-style: solid;\">{规格型号}</th>\n<th id=\"ts2-brand\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">{品牌}</th>\n<th id=\"ts2-thumbnailUri\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">{物品图片}</th>\n<th id=\"ts2-produceModel\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">{制造商型号}</th>\n<th id=\"ts2-minQuantity\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">{库存下限}</th>\n<th id=\"ts2-maxQuantity\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">{库存上限}</th>\n<th id=\"ts2-proBarCode\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">{商品条码}</th>\n<th id=\"ts2-propertyValue2\" style=\"text-align: center; font-weight: normal; display: none; width: 3.0837%; border-color: #ced4d9; border-style: solid;\">{自定义字段2}</th>\n<th id=\"ts2-propertyValue3\" style=\"text-align: center; font-weight: normal; width: 3.23789%; border-color: #ced4d9; border-style: solid;\">{自定义字段3}</th>\n<th id=\"ts2-propertyValue4\" style=\"text-align: center; font-weight: normal; width: 3.67841%; border-color: #ced4d9; border-style: solid;\">{自定义字段4}</th>\n<th id=\"ts2-propertyValue5\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">{自定义字段5}</th>\n<th id=\"ts2-unit\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">{单位}</th>\n<th id=\"ts2-recUnit\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">{辅助单位}</th>\n<th id=\"ts2-recQuantity\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">{辅助销售数量}</th>\n<th id=\"ts2-unitConverter\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">{单位关系}</th>\n<th id=\"ts2-tax\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">{税额}</th>\n<th id=\"ts2-untaxedPrice\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">{未税单价}</th>\n<th id=\"ts2-untaxedAmount\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">{未税金额}</th>\n<th id=\"ts2-taxRate\" style=\"text-align: center; font-weight: normal; display: none; width: 18.3554%; border-color: #ced4d9; border-style: solid;\">{税率}</th>\n<th id=\"ts2-unitPrice\" style=\"text-align: center; font-weight: normal; width: 3.5242%; border-color: #ced4d9; border-style: solid;\">{单价}</th>\n<th id=\"ts2-quantity\" style=\"text-align: center; font-weight: normal; width: 3.08366%; border-color: #ced4d9; border-style: solid;\">{销售数量}</th>\n<th id=\"ts2-currencyUnitPrice\" style=\"text-align: center; font-weight: normal; display: none; width: 10.5727%; border-color: #ced4d9; border-style: solid;\">{本币单价}</th>\n<th id=\"ts2-amount\" style=\"text-align: center; font-weight: normal; width: 3.3774%; border-color: #ced4d9; border-style: solid;\">{金额}</th>\n<th id=\"ts2-currencyAmount\" style=\"text-align: center; font-weight: normal; display: none; width: 0%; border-color: #ced4d9; border-style: solid;\">{本币金额}</th>\n<th id=\"ts2-remarks\" style=\"text-align: center; font-weight: normal; width: 5%; border-color: #ced4d9; border-style: solid;\">{备注}</th>\n<th id=\"ts2-deliveryDeadlineDate\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{交货日期}</th>\n<th id=\"ts2-outNum\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{已出库数量}</th>\n<th id=\"ts2-returnNum\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{退货数量}</th>\n<th id=\"ts2-actualNum\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{实际出库数量}</th>\n<th id=\"ts2-unOutNum\" style=\"text-align: center; font-weight: normal; display: none; width: 0%;\">{未出库数量}</th>\n</tr>\n</tbody>\n</table>\n<table style=\"border-collapse: collapse; width: 100%; height: 44px;\" border=\"1\">\n<tbody>\n<tr style=\"height: 22px;\">\n<td style=\"width: 14.6922%; border-color: #ced4d9; border-style: solid; height: 22px;\"><span style=\"font-size: 14px;\">Delivery cost</span></td>\n<td style=\"width: 57.2338%; text-align: right; border-color: #ced4d9; border-style: solid; height: 22px;\" colspan=\"2\"><span style=\"font-size: 14px;\">Fast express door to door service</span></td>\n<td style=\"width: 19.8324%; text-align: right; border-color: #ced4d9; border-style: solid; height: 22px;\">&nbsp;</td>\n</tr>\n<tr style=\"height: 22px;\">\n<td style=\"width: 14.6922%; border-color: #ced4d9; border-style: solid; height: 22px;\"><span style=\"font-size: 14px;\">TOTAL</span></td>\n<td style=\"width: 31.187%; text-align: right; border-color: #ced4d9; border-style: solid; height: 22px;\">&nbsp;</td>\n<td style=\"width: 26.0468%; text-align: right; border-color: #ced4d9; border-style: solid; height: 22px;\"><span style=\"font-size: 14px;\">【总数量】</span></td>\n<td style=\"width: 19.8324%; text-align: right; border-color: #ced4d9; border-style: solid; height: 22px;\"><span style=\"font-size: 14px;\">【总金额】</span></td>\n</tr>\n</tbody>\n</table>\n<table style=\"border-collapse: collapse; width: 100%; height: 110px; border-style: none;\" border=\"1\">\n<tbody>\n<tr style=\"height: 22px;\">\n<td style=\"height: 22px; width: 97.8294%; line-height: 1; border-style: none;\" colspan=\"2\">\n<div><span style=\"font-size: 14px;\">1.Quality : A++</span></div>\n</td>\n</tr>\n<tr style=\"height: 22px;\">\n<td style=\"height: 22px; width: 97.8294%; line-height: 1; border-style: none;\" colspan=\"2\">\n<div><span style=\"font-size: 14px;\">2.Payment:【结算方式】</span></div>\n</td>\n</tr>\n<tr style=\"height: 22px;\">\n<td style=\"height: 22px; width: 97.8294%; line-height: 1; border-style: none;\" colspan=\"2\">\n<div><span style=\"font-size: 14px;\">3. Shipping Date:</span></div>\n</td>\n</tr>\n<tr style=\"height: 22px;\">\n<td style=\"height: 22px; width: 97.8294%; line-height: 1; border-style: none;\" colspan=\"2\">\n<div><span style=\"font-size: 14px;\">4. Quality Guarantee:12 months. One by one replacement for defective one.</span></div>\n</td>\n</tr>\n<tr style=\"height: 22px;\">\n<td style=\"height: 22px; width: 97.8294%; line-height: 1; border-style: none;\" colspan=\"2\">\n<div><span style=\"font-size: 14px;\">Paypal ID:&nbsp;</span></div>\n</td>\n</tr>\n</tbody>\n</table>\n<div style=\"line-height: 1.4;\">&nbsp;</div>\n<div style=\"line-height: 1.4;\"><span style=\"font-size: 14px;\">BANK:</span></div>\n<div style=\"line-height: 1.4;\"><span style=\"font-size: 14px;\">BENEFICIARY:</span></div>\n<div style=\"line-height: 1.4;\"><span style=\"font-size: 14px;\">ACCOUNT:</span></div>\n<div style=\"line-height: 1.4;\"><span style=\"font-size: 14px;\">INFORM NO.:</span></div>\n<div>&nbsp;</div>\n<div style=\"line-height: 1.4;\"><span style=\"font-size: 14px;\"><span style=\"font-size: 14px;\">Western Union Payment details:</span></span></div>\n<div style=\"line-height: 1.4;\"><span style=\"font-size: 14px;\"><span style=\"font-size: 14px;\">First/Given Name:</span></span></div>\n<div style=\"line-height: 1.4;\"><span style=\"font-size: 14px;\"><span style=\"font-size: 14px;\">Last/Family Name:</span></span></div>\n<div style=\"line-height: 1.4;\"><span style=\"font-size: 14px;\"><span style=\"font-size: 14px;\">ID NO.:</span></span></div>\n<div style=\"line-height: 1.4;\"><span style=\"font-size: 14px;\"><span style=\"font-size: 14px;\">Phone:</span></span></div>\n<div style=\"line-height: 1.4;\"><span style=\"font-size: 14px;\"><span style=\"font-size: 14px;\">Address:</span></span></div>\n<div style=\"line-height: 1.4;\"><span style=\"font-size: 14px;\"><span style=\"font-size: 14px;\">Postcode:&nbsp;</span></span></div>\n<div style=\"line-height: 1.4;\">&nbsp;</div>\n<div>\n<table style=\"border-collapse: collapse; width: 100%; border-style: none;\" border=\"1\">\n<tbody>\n<tr>\n<td style=\"width: 47.9029%; border-style: none;\"><span style=\"font-size: 14px;\">Seller Signature:</span></td>\n<td style=\"width: 47.9029%; border-style: none;\"><span style=\"font-size: 14px;\">Buyer Signature:</span></td>\n</tr>\n</tbody>\n</table>\n<p>&nbsp;</p>\n</div>",
                "dateFormat": "1",
                "fieldList": [
                    {
                        "addedLoginName": "13924320703",
                        "addedTime": 1663569760000,
                        "displayOrder": 0,
                        "fieldName": "customerName",
                        "fieldType": "field",
                        "recId": 491819,
                        "templateId": 6201
                    },
                    {
                        "addedLoginName": "13924320703",
                        "addedTime": 1663569760000,
                        "displayOrder": 1,
                        "fieldName": "deliveryProvinceText",
                        "fieldType": "field",
                        "recId": 491820,
                        "templateId": 6201
                    },
                    {
                        "addedLoginName": "13924320703",
                        "addedTime": 1663569760000,
                        "displayOrder": 2,
                        "fieldName": "customerContacterName",
                        "fieldType": "field",
                        "recId": 491821,
                        "templateId": 6201
                    },
                    {
                        "addedLoginName": "13924320703",
                        "addedTime": 1663569760000,
                        "displayOrder": 3,
                        "fieldName": "customerTelNo",
                        "fieldType": "field",
                        "recId": 491822,
                        "templateId": 6201
                    },
                    {
                        "addedLoginName": "13924320703",
                        "addedTime": 1663569760000,
                        "displayOrder": 4,
                        "fieldName": "displayBillNo",
                        "fieldType": "field",
                        "recId": 491823,
                        "templateId": 6201
                    },
                    {
                        "addedLoginName": "13924320703",
                        "addedTime": 1663569760000,
                        "displayOrder": 5,
                        "fieldName": "saleOrderDate",
                        "fieldType": "field",
                        "recId": 491824,
                        "templateId": 6201
                    },
                    {
                        "addedLoginName": "13924320703",
                        "addedTime": 1663569760000,
                        "displayOrder": 6,
                        "fieldName": "totalQuantity",
                        "fieldType": "field",
                        "recId": 491825,
                        "templateId": 6201
                    },
                    {
                        "addedLoginName": "13924320703",
                        "addedTime": 1663569760000,
                        "displayOrder": 7,
                        "fieldName": "taxAllAmount",
                        "fieldType": "field",
                        "recId": 491826,
                        "templateId": 6201
                    },
                    {
                        "addedLoginName": "13924320703",
                        "addedTime": 1663569760000,
                        "displayOrder": 8,
                        "fieldName": "settlement",
                        "fieldType": "field",
                        "recId": 491827,
                        "templateId": 6201
                    }
                ],
                "isDefault": 0,
                "materialFieldList": [],
                "maxRow": 30,
                "paperSize": "t3_4",
                "prodFieldList": [
                    {
                        "addedLoginName": "13924320703",
                        "addedTime": 1663569760000,
                        "displayOrder": 0,
                        "fieldName": "prodName",
                        "fieldType": "prodField",
                        "recId": 491828,
                        "templateId": 6201
                    },
                    {
                        "addedLoginName": "13924320703",
                        "addedTime": 1663569760000,
                        "displayOrder": 1,
                        "fieldName": "propertyValue1",
                        "fieldType": "prodField",
                        "recId": 491829,
                        "templateId": 6201
                    },
                    {
                        "addedLoginName": "13924320703",
                        "addedTime": 1663569760000,
                        "displayOrder": 2,
                        "fieldName": "firstCatName",
                        "fieldType": "prodField",
                        "recId": 491830,
                        "templateId": 6201
                    },
                    {
                        "addedLoginName": "13924320703",
                        "addedTime": 1663569760000,
                        "displayOrder": 3,
                        "fieldName": "descItem",
                        "fieldType": "prodField",
                        "recId": 491831,
                        "templateId": 6201
                    },
                    {
                        "addedLoginName": "13924320703",
                        "addedTime": 1663569760000,
                        "displayOrder": 4,
                        "fieldName": "propertyValue3",
                        "fieldType": "prodField",
                        "recId": 491832,
                        "templateId": 6201
                    },
                    {
                        "addedLoginName": "13924320703",
                        "addedTime": 1663569760000,
                        "displayOrder": 5,
                        "fieldName": "propertyValue4",
                        "fieldType": "prodField",
                        "recId": 491833,
                        "templateId": 6201
                    },
                    {
                        "addedLoginName": "13924320703",
                        "addedTime": 1663569760000,
                        "displayOrder": 6,
                        "fieldName": "unitPrice",
                        "fieldType": "prodField",
                        "recId": 491834,
                        "templateId": 6201
                    },
                    {
                        "addedLoginName": "13924320703",
                        "addedTime": 1663569760000,
                        "displayOrder": 7,
                        "fieldName": "quantity",
                        "fieldType": "prodField",
                        "recId": 491835,
                        "templateId": 6201
                    },
                    {
                        "addedLoginName": "13924320703",
                        "addedTime": 1663569760000,
                        "displayOrder": 8,
                        "fieldName": "amount",
                        "fieldType": "prodField",
                        "recId": 491836,
                        "templateId": 6201
                    },
                    {
                        "addedLoginName": "13924320703",
                        "addedTime": 1663569760000,
                        "displayOrder": 9,
                        "fieldName": "remarks",
                        "fieldType": "prodField",
                        "recId": 491837,
                        "templateId": 6201
                    }
                ],
                "sortAryStr": "【序号】-serialNumber,【物品编号】-prodCustomNo,【物品名称】-prodName,【自定义字段1】-propertyValue1,【一级类目】-firstCatName,【二级类目】-secondCatName,【三级类目】-thirdCatName,【批次号】-batchNo,【生产日期】-productionDate,【到期日期】-expirationDate,【规格型号】-descItem,【品牌】-brand,【物品图片】-thumbnailUri,【制造商型号】-produceModel,【库存下限】-minQuantity,【库存上限】-maxQuantity,【商品条码】-proBarCode,【自定义字段2】-propertyValue2,【自定义字段3】-propertyValue3,【自定义字段4】-propertyValue4,【自定义字段5】-propertyValue5,【单位】-unit,【辅助单位】-recUnit,【辅助销售数量】-recQuantity,【单位关系】-unitConverter,【税额】-tax,【未税单价】-untaxedPrice,【未税金额】-untaxedAmount,【税率】-taxRate,【单价】-unitPrice,【销售数量】-quantity,【本币单价】-currencyUnitPrice,【金额】-amount,【本币金额】-currencyAmount,【备注】-remarks,【交货日期】-deliveryDeadlineDate,【已出库数量】-outNum,【退货数量】-returnNum,【实际出库数量】-actualNum,【未出库数量】-unOutNum,【OEM 代码】-prod_property_value1,【灌粉量1】-prod_property_value2,【颜色】-prod_property_value3,【页产量】-prod_property_value4,【产品长 CM】-prod_property_value5,【产品宽 CM】-prod_property_value6,【产品高 CM】-prod_property_value7,【产品净重  KG】-prod_property_value8,【产品毛重 KG】-prod_property_value9,【装箱长 CM】-prod_property_value10,【装箱宽 CM】-prod_property_value11,【装箱高 CM】-prod_property_value12,【装箱数量 PCS】-prod_property_value14,【装箱净重 KG】-prod_property_value15,【装箱毛重 KG】-prod_property_value16",
                "templateName": "XXXXXXXXXXXXXXXXXXXX",
                "updatedTime": 1654384400000,
                "wordSize": "14"
            },
            "retCode": "0"
        }
    }
};