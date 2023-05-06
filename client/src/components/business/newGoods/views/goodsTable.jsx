import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {fromJS, is} from 'immutable'
import {withRouter} from 'react-router-dom'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import { Input, Table, Spin, Form } from 'antd';
import 'url-search-params-polyfill';
import defaultOptions from 'utils/validateOptions';
import {formatCurrency, removeCurrency} from 'utils/format';
import {numberReg} from 'utils/reg';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import {AuthInput} from 'components/business/authMenu';
import Icon from 'components/widgets/icon';
import Tooltip from 'components/widgets/tooltip';
import {Auth} from 'utils/authComponent';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import {actions as addGoodsActions} from 'pages/goods/add';
import {actions as fieldConfigActions} from 'components/business/goodsTableFieldConfigMenu'
import {
    addGoodsItem,
    removeGoodsItem,
    initGoodsItem,
    initGoodsDefaultItem,
    setFieldReadonly,
    unsetFieldReadonly,
    asyncFetchStockByCode,
    asyncFetchSaleByBarcode,
    emptyDetailData,
} from "../actions";
import {actions as rateAction} from 'pages/auxiliary/rate';
import {actions as batchShelfActions} from "components/business/batchShelfLeft";
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import GoodsSuggest from 'components/business/goodsSuggest';
import {SerialNumQuerySearch} from 'pages/goods/serialNumQuery/index';
import Base from '../dependencies/base';
import DiscountInput from  '../dependencies/discountInput';
import withQuantityAmount from '../dependencies/withQuantityAmount';
import withGoodsPop from '../dependencies/withGoodsPop';
import withGoodsSuggest from '../dependencies/withGoodsSuggest';
import withScan from '../dependencies/withScan';
import withBatchLeft from '../dependencies/withBatchLeft';
import withMultiSpecGoods from  '../dependencies/withMultiSpecGoods';
import withMultiUnit from '../dependencies/withMultiUnit';
import {withFix} from 'components/business/goods';
import {PlusOutlined,MinusOutlined,EllipsisOutlined} from '@ant-design/icons';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");

const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({
    rateList: state.getIn(['auxiliaryRate', 'rateList']),
    goodsInfo: state.getIn(['goods', 'goodsInfo']),
    goodsTableConfig: state.getIn(['goodsTableFieldConfigMenu', 'goodsTableConfig']),
    vipService: state.getIn(['vipHome', 'vipService'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        addGoodsItem,
        removeGoodsItem,
        initGoodsItem,
        initGoodsDefaultItem,
        setFieldReadonly,
        unsetFieldReadonly,
        asyncFetchStockByCode,
        asyncFetchSaleByBarcode,
        emptyDetailData,
        asyncFetchBatchShelfList: batchShelfActions.asyncFetchBatchShelfList,
        emptyFieldConfig: fieldConfigActions.emptyFieldConfig,
        asyncSaveFieldConfig: fieldConfigActions.asyncSaveFieldConfig,
        asyncFetchGoodsById: addGoodsActions.asyncFetchGoodsById,
        asyncFetchUnits: addGoodsActions.asyncFetchUnits,
        asyncFetchExpressList: rateAction.asyncFetchExpressList,
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService
    }, dispatch)
};

/**
 * 单据新增页物品表格
 *
 * @visibleName GoodsTable（新增页物品表格）
 * @author guozhaodong
 */
@withRouter
@connect(mapStateToProps, mapDispatchToProps)
@withFix
@withQuantityAmount
@withGoodsPop
@withGoodsSuggest
@withBatchLeft
@withMultiSpecGoods
@withMultiUnit
@withScan
export default class GoodsTable extends Base {

    static propTypes = {
        /**
         *   单据类型，主要针对销售单会有单独的选择物品接口
         **/
        billType: PropTypes.string,
        /**
         *   传递给选择物品弹层的参数
         **/
        goodsPopCondition: PropTypes.object,
        /**
         *   字段的key前缀，一般会改成我们向后端提交数据时，后端需要的名称，
         *   但是由于我们的数据提交时候都会重新转换一下，所有这边设置或不设置都无所谓，所以这个参数使用的意义不大.
         *   默认值'prod'
         **/
        dataPrefix: PropTypes.string,
        /**
         *   字段的key，如果传入则会覆盖默认的key
         *   默认值{
            productCode: 'productCode',
            prodCustomNo: 'prodCustomNo',
            prodName: 'prodName',
            descItem: 'descItem',
            proBarCode: 'proBarCode',
            firstCatName: 'firstCatName',
            secondCatName: 'secondCatName',
            thirdCatName: 'thirdCatName',
            unit: 'unit',
            brand: 'brand',
            produceModel: 'produceModel',
            propertyValue1: 'propertyValue1',
            propertyValue2: 'propertyValue2',
            propertyValue3: 'propertyValue3',
            propertyValue4: 'propertyValue4',
            propertyValue5: 'propertyValue5',
            quantity: 'quantity',
            recQuantity: 'recQuantity',
            untaxedPrice: 'untaxedPrice',
            unitPrice: 'unitPrice',
            untaxedAmount: 'untaxedAmount',
            taxRate: 'taxRate',
            tax: 'tax',
            amount: 'amount',
            remarks: 'remarks',
        }
         **/
        dataName: PropTypes.object,
        /**
         *   是否隐藏物品其它字段（品牌和制造商型号，因为有些单据还没有添加这两个字段）
         **/
        hideOtherGoodsColumns: PropTypes.bool,
        /**
         *   是否隐藏物品自定义字段（品牌和制造商型号，因为有些单据还没有添加这些字段）
         **/
        hideCustomGoodsColumns: PropTypes.bool,
        /**
         *   是否隐藏数量字段
         **/
        hideRecQuantityColumn: PropTypes.bool,
        /**
         *   是否隐藏未税单价字段
         **/
        hideUntaxedPriceColumn: PropTypes.bool,
        /**
         *   是否隐藏含税单价字段
         **/
        hideUnitPriceColumn: PropTypes.bool,
        /**
         *   是否隐藏未税金额字段
         **/
        hideUntaxedAmountColumn: PropTypes.bool,
        /**
         *   是否隐藏税率字段
         **/
        hideTaxRateColumn: PropTypes.bool,
        /**
         *   是否隐藏税额字段
         **/
        hideTaxColumn: PropTypes.bool,
        /**
         *   是否隐藏价税合计字段
         **/
        hideAmountColumn: PropTypes.bool,
        /**
         *   是否隐藏总数量字段
         **/
        hideTotalQuantity: PropTypes.bool,
        /**
         *   是否隐藏含税总金额字段
         **/
        hideTotalAmount: PropTypes.bool,
        /**
         *   是否隐藏备注字段
         **/
        hideRemarks: PropTypes.bool,
        /**
         *   是否隐藏序列号
         **/
        showSerialNumberColumns: PropTypes.bool,
        /**
         *   数量字段，可以覆盖默认的数量字段参数
         **/
        quantityColumns: PropTypes.object,
        /**
         *   未税单价字段，可以覆盖默认的未税单价字段参数
         **/
        unTaxedPriceColumns: PropTypes.object,
        /**
         *   含税单价字段，可以覆盖默认的含税单价字段参数
         **/
        unitPriceColumns: PropTypes.object,
        /**
         *   价税合计字段，可以覆盖默认的金额字段参数
         **/
        amountColumns: PropTypes.object,
        /**
         *   和单据业务相关的字段栏目，即我们可以通过它传递字段进入物品表格，字段会插在备注前面
         **/
        receiptColumns: PropTypes.array,
        /**
         *   插入单条物品后回调
         **/
        onInsertGoods: PropTypes.func,
        /**
         *   清除单条物品后回调
         **/
        onClearAllGoods: PropTypes.func,
        /**
         *   物品编号联想选择物品后回调
         **/
        prodCodeSuggestSelect: PropTypes.func,
        /**
         *   物品名称联想选择物品后回调
         **/
        prodNameSuggestSelect: PropTypes.func,
        /**
         *   物品编号联想值改变后回调
         **/
        prodCodeSuggestChange: PropTypes.func,
        /**
         *   物品名称联想值改变后回调
         **/
        prodNameSuggestChange: PropTypes.func,
        /**
         *   是否把采购单价带入到物品表格的单价中
         **/
        carryOrderPriceToUnitPrice: PropTypes.bool,
        /**
         *   是否把销售单价带入到物品表格的单价中
         **/
        carrySalePriceToUnitPrice: PropTypes.bool,
        /**
         *   是否在鼠标移入数量字段上显示库存信息
         **/
        showStockInfo: PropTypes.bool,
        /**
         *   把某个字段带入物品表格中的对于字段， 如goodsPopCarryFields = {{'currentQuantity': 'systemNum'}}  //key为弹层中的字段名称， value为表格中的字段名称
         **/
        goodsPopCarryFields: PropTypes.object,
        /**
         *   物品只能选择不能输入
         **/
        goodsOnlySelect: PropTypes.bool,
        /**
         *   单价权限对应模块
         **/
        unitPriceAuthModule: PropTypes.string,
        /**
         *   金额权限对应模块
         **/
        amountAuthModule: PropTypes.string,
        /**
         *   优惠金额权限对应模块
         **/
        discountAuthModule: PropTypes.string,
        /**
         *   默认权限类型
         **/
        defaultAuthType: PropTypes.string,
        /**
         *   默认无权限渲染的内容
         **/
        defaultNoAuthRender: PropTypes.string,
        /**
         *   保存配置字段的模块类型，需要和后端确认，如采购'purchase_order'
         **/
        fieldConfigType: PropTypes.string,
        /**
         *   是否展示额外的自定义字段
         **/
        showExtraCustomField: PropTypes.bool,
        /**
         *   是否展示基本单位数量
         **/
        showQuantityColumn: PropTypes.bool,
        /**
         *   是否展示批次查询
         **/
        showBatchLeftColumns: PropTypes.bool,
    };

    static defaultProps = {
        defaultAuthType: 'show',
        defaultNoAuthRender: PRICE_NO_AUTH_RENDER
    };

    handleRemoveItem = (key) => {
        this.props.removeGoodsItem([key]);
        this.props.calcTotalQuantity([0], [key]);
        this.props.calTotalAmount([0], [key], [0])
    };

    clearAllGoods = () => {
        const {goodsInfo} = this.props;
        let {setFieldsValue} = this.props.formRef.current;
        const dataSource = goodsInfo.get('data').toJS();

        dataSource.forEach((item, index) => {
            setFieldsValue({
                [this.dataPrefix]: {
                    [item.key]: {
                        [this.dataName.productCode] : '',
                        [this.dataName.prodCustomNo] : '',
                        [this.dataName.prodName] : '',
                        [this.dataName.descItem] : '',
                        [this.dataName.proBarCode] : '',
                        [this.dataName.firstCatName] : '',
                        [this.dataName.secondCatName] : '',
                        [this.dataName.thirdCatName] : '',
                        [this.dataName.unit] : '',
                        [this.dataName.brand] : '',
                        [this.dataName.produceModel] : '',
                        [this.dataName.propertyValue1] : '',
                        [this.dataName.propertyValue2] : '',
                        [this.dataName.propertyValue3] : '',
                        [this.dataName.propertyValue4] : '',
                        [this.dataName.propertyValue5] : '',
                        [this.dataName.remarks] : '',
                        [this.dataName.specGroup] : '',
                        [this.dataName.unitFlag] : '',
                        [this.dataName.recQuantity] : '',
                        [this.dataName.unitConverter] : '',

                    }
                }
            });
            if(!this.props.hideRecQuantityColumn)  setFieldsValue({[this.dataPrefix]: {[item.key]: {[[this.dataName.recQuantity]]: ''}}});
            if(!!this.props.showQuantityColumn)  setFieldsValue({[this.dataPrefix]: {[item.key]: {[[this.dataName.quantity]]: ''}}});
            if(!this.props.hideUnitPriceColumn) setFieldsValue({[this.dataPrefix]: {[item.key]: {[[this.dataName.unitPrice]]: ''}}});
            if(!this.props.hideAmountColumn) setFieldsValue({[this.dataPrefix]: {[item.key]: {[[this.dataName.amount]]: ''}}});
            if(!this.props.showBatchLeftColumns) {
                setFieldsValue({[this.dataPrefix]: {[item.key]: {[[this.dataName.batchNo]]: ''}}});
                setFieldsValue({[this.dataPrefix]: {[item.key]: {[[this.dataName.expirationFlag]]: ''}}});
                setFieldsValue({[this.dataPrefix]: {[item.key]: {[[this.dataName.expirationDay]]: ''}}});
                setFieldsValue({[this.dataPrefix]: {[item.key]: {[[this.dataName.productionDate]]: ''}}});
                setFieldsValue({[this.dataPrefix]: {[item.key]: {[[this.dataName.expirationDate]]: ''}}});
                setFieldsValue({[this.dataPrefix]: {[item.key]: {[[this.dataName.batchnoFlag]]: ''}}});
            }

            this.props.onClearAllGoods && this.props.onClearAllGoods(item.key);
            this.setFieldReadOnlyStatus(false, item.key);
            this.props.calcTotalQuantity([0], [item.key]);
            this.props.calTotalAmount([0], [item.key], [0])
        });
    };

    componentDidMount() {
        //将子组件的this提供给父组件
        this.props.goodsRef && this.props.goodsRef(this);
        // 获取Vip信息
        this.props.asyncFetchVipService();
        //从物品详情页进入单据新增页，通过物品code带入物品信息
        let params = new URLSearchParams(this.props.location.search);
        const productCode = params && params.get('productCode');
        const outType = params && params.get('outType');
        const batchNo = params && params.get('batchNo');
        const expirationDate = params && params.get('expirationDate');
        const productionDate = params && params.get('productionDate');
        const quantity = params && params.get('quantity');
        if (productCode) {
            this.props.asyncFetchGoodsById(productCode, res => {
                if (res.get('retCode') === '0') {
                    const goodsInfoData = res.get('data');
                    let newGoodsInfo = goodsInfoData
                        .set([this.dataName.productCode], goodsInfoData.get('code'))
                        .set('prodCustomNo', goodsInfoData.get('displayCode'))
                        .set('prodName', goodsInfoData.get('name'))
                        .set('descItem', goodsInfoData.get('description'))
                        .set('proBarCode', goodsInfoData.get('proBarCode'))
                        .set('brand', goodsInfoData.get('brand'))
                        .set('produceModel', goodsInfoData.get('produceModel'))
                        .set('propertyValue1', goodsInfoData.get('propertyValue1'))
                        .set('propertyValue2', goodsInfoData.get('propertyValue2'))
                        .set('propertyValue3', goodsInfoData.get('propertyValue3'))
                        .set('propertyValue4', goodsInfoData.get('propertyValue4'))
                        .set('propertyValue5', goodsInfoData.get('propertyValue5'))
                        .set('expirationFlag', goodsInfoData.get('expirationFlag'))  // 批次号是否启用
                        .set('expirationDay', goodsInfoData.get('expirationDay'))  // 批次号是否启用
                        .set('specGroup', goodsInfoData.get('specGroup'))  // 规格id
                        .set('recUnit', goodsInfoData.get('unit'))
                        .set('unitFlag', goodsInfoData.get('unitFlag'))  // 判断是否为多单位物品

                    if(batchNo && expirationDate && productionDate){  // 批次产品
                        newGoodsInfo = newGoodsInfo
                            .set([this.dataName.quantity], quantity)
                            .set([this.dataName.recQuantity], quantity)
                            .set([this.dataName.batchNo], batchNo)
                            .set([this.dataName.expirationDate], Number(expirationDate))
                            .set([this.dataName.productionDate], Number(productionDate));
                    }
                    if(outType==='sell'){
                        newGoodsInfo = newGoodsInfo.set('unitPrice', goodsInfoData.get('salePrice'))
                    } else {
                        if (this.props.carryOrderPriceToUnitPrice) {
                            newGoodsInfo = newGoodsInfo.set('unitPrice', goodsInfoData.get('orderPrice'))
                        }
                        else if (this.props.carrySalePriceToUnitPrice) {
                            newGoodsInfo = newGoodsInfo.set('unitPrice', goodsInfoData.get('salePrice'))
                        }
                    }
                    this.props.initGoodsItem(fromJS([newGoodsInfo]));
                    this.initProdForm([newGoodsInfo.toJS()]);
                }
                else {
                    alert(res.get('resMsg'))
                }
            })
        }
        // 缺料查询带入物品
        const isLackMaterial = params && params.get('isLackMaterial');
        if(isLackMaterial){
            let lackMaterialProdList = fromJS(JSON.parse(localStorage.getItem("lackMaterialProdList")));
            let initGoodsTableData = lackMaterialProdList.map(item => {
                return item.set('productCode', item.get('prodNo'))
                    .set('prodCustomNo', item.get('displayCode'))
                    .set('prodName', item.get('prodName'))
                    .set('descItem', item.get('description'))
                    .set('unit', item.get('unit'))
                    .set('brand', item.get('brand'))
                    .set('produceModel', item.get('produceModel'))
                    .set('recQuantity', item.get('componentQuantity'))
                    .set('quantity', item.get('componentQuantity'))
                    .set('propertyValue1', item.get('propertyValue1'))
                    .set('propertyValue2', item.get('propertyValue2'))
                    .set('propertyValue3', item.get('propertyValue3'))
                    .set('propertyValue4', item.get('propertyValue4'))
                    .set('propertyValue5', item.get('propertyValue5'))
                    .set('expirationFlag', item.get('expirationFlag'))  // 批次号是否启用
                    .set('expirationDay', item.get('expirationDay'))   // 批次号是否启用
                    .set('specGroup', item.get('specGroup'))  // 规格id
                    .set('recUnit', item.get('unit'))
                    .set('unitFlag', item.get('unitFlag'))
            });
            if(this.props.carryOrderPriceToUnitPrice){
                initGoodsTableData = initGoodsTableData.map(item => item.set('unitPrice', item.get('orderPrice')));
            }
            this.props.initGoodsItem(initGoodsTableData);
            setTimeout(()=>this.initProdForm(initGoodsTableData.toJS()));
        }
        //带入Mrp运算采购建议的数据
        /*const type = params && params.get('type');
        if(type === 'mrpToPurchaseData'){
            let mrpToPurchaseData = fromJS(JSON.parse(localStorage.getItem("mrpToPurchaseData")).prodList);
            this.props.initGoodsItem(mrpToPurchaseData);
            setTimeout(()=>this.initProdForm(mrpToPurchaseData.toJS()));
        }*/
    }

    //初始化页面数据
    //data需要FromJs
    initGoodsTableDataFn = (data) =>{
        this.props.initGoodsItem(fromJS(data));
        //处理数据还需要对数据进行反算操作带入
        //获取默认税率
        const {rateList} = this.props;
        let defaultRateValue = rateList && rateList.getIn(['rate', 'defaultValue']);
        let _this = this;
        setTimeout(()=>{
            this.initProdForm(data)
        });
        setTimeout(()=>{
            for(let i=0;i<data.length;i++){
                _this.props.inverseCalc(i+4, data[i].quantity, defaultRateValue, data[i].unitPrice,undefined);
            }
        },500);

    }


    // 初始化表单数据
    initProdForm = (info) => {
        let quantityDecimalNum = getCookie("quantityDecimalNum");
        let priceDecimalNum = getCookie("priceDecimalNum");
        if(!this.props.formRef || !this.props.formRef.current){
            return false;
        }
        let {setFieldsValue} = this.props.formRef.current;
        if(!info || info.length===0) return;
        //处理单价和金额格式化
        for(let i = 0; i < info.length; i++){
            let item = info[i];
            for(let key in this.dataName){
                let initialValue = item[this.dataName[key]];
                if (key === this.dataName.unitPrice || key === this.dataName.untaxedPrice) {
                    initialValue = fixedDecimal(initialValue, priceDecimalNum)
                } else if(key === this.dataName.quantity || key === this.dataName.recQuantity){
                    initialValue = fixedDecimal(initialValue, quantityDecimalNum)
                }else if (key === this.dataName.amount) {
                    initialValue = removeCurrency(formatCurrency(initialValue, 2, true))
                } else if (key === this.dataName.productionDate || key === this.dataName.expirationDate){
                    initialValue = initialValue && moment(initialValue);
                }
                setFieldsValue({
                    [this.dataPrefix]: {
                        [i+4]: {  // 与 reduce的key保持一致，没法搞
                            [this.dataName[key]]: initialValue
                        }
                    }
                });
            }
        }
    };

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        const hasProdCode = nextProps.goodsInfo.get('data').some(item => {
            return item.get('ope')
        });
        //没有物品编号就说明没有物品，则加载初始物品数据
        if ((this.props.match.params.id || this.props.match.params.copyId || this.props.location.search.indexOf('billNo') !== -1 || this.props.location.search.indexOf('fkBillNo') !== -1 || this.props.currentInBoundType === 7 || this.props.outType === 7) && nextProps.initGoodsTableData && nextProps.initGoodsTableData.size > 0 && /*!is(nextProps.initGoodsTableData, this.props.initGoodsTableData)*/ !hasProdCode) {
            //修改页赋初始值，后端给的字段名称转成组件里统一的字段名称(如果是自己定义的dataName，那么传进来的字段名称就要和自己定义的名称相同才能赋值，否则我们会用把外面传进来的名称统一转换成我们内部自己的名称)
            const initGoodsTableData = nextProps.initGoodsTableData.map(item => {
                let unitConverterText = `1${item.get(this.dataName.unit)}=${item.get(this.dataName.unitConverter)}${item.get(this.dataName.recUnit)}`;
                return item.set('productCode', item.get(this.dataName.productCode))
                    .set('prodCustomNo', item.get(this.dataName.prodCustomNo))
                    .set('prodName', item.get(this.dataName.prodName))
                    .set('descItem', item.get(this.dataName.descItem))
                    .set('proBarCode', item.get(this.dataName.proBarCode))
                    .set('unit', item.get(this.dataName.unit))
                    .set('brand', item.get(this.dataName.brand))
                    .set('produceModel', item.get(this.dataName.produceModel))
                    .set('propertyValue1', item.get(this.dataName.propertyValue1))
                    .set('propertyValue2', item.get(this.dataName.propertyValue2))
                    .set('propertyValue3', item.get(this.dataName.propertyValue3))
                    .set('propertyValue4', item.get(this.dataName.propertyValue4))
                    .set('propertyValue5', item.get(this.dataName.propertyValue5))
                    .set('expirationFlag', item.get(this.dataName.expirationFlag))
                    .set('expirationDay', item.get(this.dataName.expirationDay))
                    .set('specGroup', item.get(this.dataName.specGroup))  // 规格id
                    .set('recUnit', item.get(this.dataName.recUnit) || item.get(this.dataName.unit))
                    .set('unitFlag', item.get(this.dataName.unitFlag))
                    .set('unitConverter', item.get(this.dataName.unitConverter))
                    .set('unitConverterText', unitConverterText)
            });
            this.props.initGoodsItem(initGoodsTableData);
            this.initProdForm(initGoodsTableData.toJS());

            if (!('initTotalQuantity' in nextProps)) {
                //计算总数量：
                // 先把数量放到一个数组里
                const quantities = initGoodsTableData.map(item => {
                    return item.get(this.dataName.recQuantity) ? item.get(this.dataName.recQuantity) : 0
                });
                this.props.calcTotalQuantity(quantities);
            }
        }
        //初始化总数量
        if ('initTotalQuantity' in nextProps && nextProps.initTotalQuantity && !this.props.totalQuantity) {
            this.props.setTotalQuantity(nextProps.initTotalQuantity)
        }
        //初始化总金额
        if ('initTotalAmount' in nextProps && nextProps.initTotalAmount && !this.props.totalAmount) {
            this.props.setTotalAmount(nextProps.initTotalAmount)
        }
        // 初始化订单优惠后总金额
        if('initAggregateAmount' in nextProps && nextProps.initAggregateAmount && !this.props.aggregateAmount){
            this.props.setAggregateAmount(nextProps.initAggregateAmount)
        }
        // 初始化优惠金额
        if('initDiscountAmount' in nextProps && nextProps.initDiscountAmount && !this.props.discountAmount){
            this.props.setDiscountAmount(nextProps.initDiscountAmount, true)
        }
    }

    componentWillUnmount() {
        if (this.props.fieldConfigType) {
            this.props.asyncSaveFieldConfig(this.props.fieldConfigType);
            this.props.emptyFieldConfig();
        }
        this.props.emptyDetailData();
    }

    render() {

        const {goodsInfo, rateList, vipService, source, renderFixIcon, fixed=false} = this.props;
        let defaultRateValue = rateList && rateList.getIn(['rate', 'defaultValue']);
        let {getFieldValue, setFieldsValue} = this.props.formRef.current;
        const dataSource = goodsInfo.get('data').toJS();

        let vipSource = vipService.getIn(['vipData','data']);
        vipSource = vipSource ? vipSource.toJS() : [];
        let batchShelfLife = vipSource.BATCH_SHELF_LIFE || {};  //增值包数据
        let batchShelfLifeVipFlag = batchShelfLife.vipState === 'TRY' || batchShelfLife.vipState === 'OPENED';

        let quantityDecimalNum = getCookie("quantityDecimalNum");
        let priceDecimalNum = getCookie("priceDecimalNum");

        const prefixColumn = [{
            // fixed: 'left',
            title: '',
            dataIndex: 'ope',
            key: 'ope',
            width: 60,
            align: 'center',
            fixed: "left",
            render: (productCode, record, index) => {
                return (
                    <React.Fragment>
                        <a href="#!" className={cx('add-item')}
                           onClick={() => this.props.addGoodsItem(index + 1, 0, null, {taxRate: defaultRateValue})}><PlusOutlined style={{fontSize: "16px"}}/></a>
                        {
                            dataSource.length > 1 ? (
                                <a href="#!" className={cx('delete-item')}
                                   onClick={() => this.handleRemoveItem(record.key)}><MinusOutlined style={{fontSize: "16px"}}/></a>
                            ) : null
                        }
                        <div style={{display:"none"}}>
                            <Form.Item
                                name={[this.dataPrefix, record.key, this.dataName.productCode]}
                                initialValue={productCode}
                            >
                                <Input type="hidden"/>
                            </Form.Item>
                            <Form.Item
                                name={[this.dataPrefix, record.key, this.dataName.recId]}
                                initialValue={record.recId}
                            >
                                <Input type="hidden"/>
                            </Form.Item>
                            {
                                this.props.showBatchLeftColumns && (
                                    <React.Fragment>
                                        <Form.Item
                                            name={[this.dataPrefix, record.key, this.dataName.expirationFlag]} // 当前单据的批次号是非开启
                                            initialValue={record.expirationFlag || false}
                                        >
                                            <Input type="hidden"/>
                                        </Form.Item>
                                        <Form.Item
                                            name={[this.dataPrefix, record.key, this.dataName.expirationDay]}
                                            initialValue={record.expirationDay || 0}
                                        >
                                            <Input type="hidden"/>
                                        </Form.Item>
                                        <Form.Item
                                            name={[this.dataPrefix, record.key, this.dataName.batchnoFlag]} // 批次号是否存在
                                            initialValue={record.batchnoFlag || false}
                                        >
                                            <Input type="hidden"/>
                                        </Form.Item>
                                    </React.Fragment>
                                )
                            }
                            <Form.Item
                                name={[this.dataPrefix, record.key, this.dataName.unitFlag]}  // 判断是否为多单位物品
                                initialValue={record.unitFlag}
                            >
                                <Input type="hidden"/>
                            </Form.Item>
                            <Form.Item
                                name={[this.dataPrefix, record.key, this.dataName.unit]}  // 判断是否为多单位物品
                                initialValue={record.unit}
                            >
                                <Input type="hidden"/>
                            </Form.Item>
                            {
                                !!this.props.showUnitConverterColumn && (
                                    <Form.Item
                                        name={[this.dataPrefix, record.key, this.dataName.unitConverter]}  // 单位关系
                                        initialValue={record.unitConverter}
                                    >
                                        <Input type="hidden"/>
                                    </Form.Item>
                                )
                            }

                            <Form.Item
                                name={[this.dataPrefix, record.key, this.dataName.specGroup]}
                                initialValue={record.specGroup}
                            >
                                <Input type="hidden"/>
                            </Form.Item>
                        </div>
                    </React.Fragment>
                )
            }
        }, {
            title: intl.get("components.goods.goodsTable.serial"),
            dataIndex: 'serial',
            key: 'serial',
            width: 50,
            align: 'center',
            fixed,
            render: (text, record, index) => index + 1
        }];

        //物品固定字段
        let goodsColumns = [
            {
                title: intl.get("components.goods.goodsTable.prodCustomNo"),
                key: this.dataName.prodCustomNo,
                originalKey: 'prodCustomNo',
                maxLength: 50,
                // width: 200,
                fixed,
                placeholder: intl.get("components.goods.goodsTable.prodCustomNo"),
                rules: [
                    {
                        validator: (rules, value, callback) => {
                            if (this.props.source==='stock' && this.validateSameProdCustomNo(this.filterExistArrayByKey(this.dataName.prodCustomNo), value)) {
                                callback(intl.get("components.goods.goodsTable.prodCustomNoMessage"));
                            }
                            callback();
                        }
                    }
                ],
                render: (text, record, index, dataSource, mergeValidConfig, requiredFlag, onKeyDown) => <GoodsSuggest
                    type="displayCode"
                    id={this.dataPrefix+"_"+record.key+"_prodCustomNo"}
                    onKeyDown={onKeyDown}
                    goodsPopCondition={this.props.goodsPopCondition}
                    placeholder={intl.get("components.goods.goodsTable.prodCustomNo")}
                    onChange={(value, goods) => {
                        value ? this.props.handleProdCodeSuggestSelect(value, goods, record.key) : this.props.emptyFieldVal(record.key)
                    }}
                    onSearch={() => this.props.handleProdCodeSuggestChange(record.key)}
                    onlySelect={this.props.goodsOnlySelect}
                />
            },
            {
                title: () => {
                    return (
                        <React.Fragment>
                            物品名称
                            { renderFixIcon() }
                        </React.Fragment>
                    )
                },
                nTitle: "物品名称",
                key: this.dataName.prodName,
                originalKey: 'prodName',
                required: true,
                maxLength: 100,
                width: 300,
                fixed,
                placeholder: intl.get("components.goods.goodsTable.prodName"),
                render: (text, record, index, dataSource, mergeValidConfig, requiredFlag, onKeyDown) => <GoodsSuggest type="name"
                                                               id={this.dataPrefix+"_"+record.key+"_prodName"}
                                                               onKeyDown={onKeyDown}
                                                               goodsPopCondition={this.props.goodsPopCondition}
                                                               placeholder={intl.get("components.goods.goodsTable.prodName")}
                                                               onChange={(value, goods) => {
                                                                   value ? this.props.handleProdNameSuggestSelect(value, goods, record.key) : this.props.emptyFieldVal(record.key)
                                                               }}
                                                               onSearch={() => this.props.handleProdNameSuggestChange(record.key)}
                                                               onlySelect={this.props.goodsOnlySelect}
                                                               suffixIcon={
                                                                   <div
                                                                       className={cx("select-goods-trigger")}
                                                                       onClick={(e) => {
                                                                           e.preventDefault();
                                                                           return false;
                                                                       }}
                                                                   >
                                                                       <a onClick={() => this.props.selectGoods(record.key)}><EllipsisOutlined style={{fontSize: "16px"}}/></a>
                                                                   </div>}
                />
            },
            {...this.props.specColumns}, // 规格型号
            {...this.props.unitColumn}  // 单位
        ];

        //品牌和制造商型号
        const otherGoodsColumns = this.props.hideOtherGoodsColumns ? [] : [{
            title: intl.get("components.goods.goodsTable.brand"),
            key: this.dataName.brand,
            originalKey: 'brand',
            columnName: 'brand',
            maxLength: 30,
            width: 150
        }, {
            title: intl.get("components.goods.goodsTable.produceModel"),
            key: this.dataName.produceModel,
            originalKey: 'produceModel',
            columnName: 'produceModel',
            maxLength: 100,
            width: 150
        }];

        if (otherGoodsColumns.length > 0) {
            goodsColumns = goodsColumns.concat(otherGoodsColumns);
        }

        this.props.showSerialNumberColumns  && (
            goodsColumns = goodsColumns.concat([
                {
                    title: intl.get("components.goods.goodsTable.serialNumber"),
                    key: this.dataName.serialNumber,
                    originalKey: 'serialNumber',
                    columnName: 'serialNumber',
                    // maxLength: 100,
                    render: (text, record, index) =>
                        <SerialNumQuerySearch
                            {...this.props}
                            onChange={(serialNumber, quantity) => {
                                setFieldsValue({
                                    [this.dataPrefix]: {
                                        [record.key]: {
                                            [this.dataName.serialNumber]: serialNumber,
                                            [this.dataName.recQuantity]: quantity
                                        }
                                    }
                                });
                                this.props.handleRecQuantityChange(record.key, quantity);
                            }}
                        />
                }
            ])
        );

        // 批次号有关字段
        if (batchShelfLifeVipFlag && this.props.batchLeftColumns && this.props.batchLeftColumns.length > 0) {
            goodsColumns = goodsColumns.concat(this.props.batchLeftColumns);
        }

        //数量、单价、金额字段
        if (this.props.quaColumns && this.props.quaColumns.length > 0) {
            goodsColumns = goodsColumns.concat(this.props.quaColumns)
        }

        //其它自己设置的字段
        const receiptColumns = this.props.receiptColumns ? this.props.receiptColumns : [];

        //备注
        const expandColumns = [
            {
                title: intl.get("components.goods.goodsTable.firstCatName"),
                key: this.dataName.firstCatName,
                originalKey: 'firstCatName',
                columnName: 'firstCatName',
                maxLength: 100,
                readOnly: true,
                width: 150
            },
            {
                title: intl.get("components.goods.goodsTable.secondCatName"),
                key: this.dataName.secondCatName,
                originalKey: 'secondCatName',
                columnName: 'secondCatName',
                readOnly: true,
                maxLength: 20,
                width: 150
            },
            {
                title: intl.get("components.goods.goodsTable.thirdCatName"),
                key: this.dataName.thirdCatName,
                originalKey: 'thirdCatName',
                columnName: 'thirdCatName',
                readOnly: true,
                maxLength: 20,
                width: 150
            },
            {
                title: intl.get("components.goods.goodsTable.proBarCode"),
                key: this.dataName.proBarCode,
                originalKey: 'proBarCode',
                columnName: 'proBarCode',
                maxLength: 50,
                readOnly: true,
                width: 300
            },
        ];
        goodsColumns = goodsColumns.concat(expandColumns);
        const customGoodsArr = [],extraCustomGoodsArr=[];
        for(let i =1;i<=5;i++){
            if(source === 'stock'){
                customGoodsArr.push({
                    key: this.dataName[`propertyValue${i}`],
                    columnName: `prod_property_value${i}`,
                    width: 150,
                    readOnly: true,
                    isCustomField: false
                })
            } else {
                customGoodsArr.push({
                    key: this.dataName[`propertyValue${i}`],
                    originalKey: `propertyValue${i}`,
                    columnName: `property_value${i}`,
                    width: 150,
                    readOnly: true,
                    isCustomField: false
                })
            }
        }
        //物品自定义字段
        const customGoodsColumns = this.props.hideCustomGoodsColumns ? [] : customGoodsArr;

        if (customGoodsColumns.length > 0) {
            goodsColumns = goodsColumns.concat(customGoodsColumns);
        }
        //各单据的物品自定义字段
        for(let i =1;i<=5;i++){
            extraCustomGoodsArr.push({
                key: this.dataName[`itemPropertyValue${i}`],
                originalKey: `itemPropertyValue${i}`,
                columnName: `item_property_value${i}`,
                width: 150,
                isCustomField: false
            })
        }
        //物品自定义字段
        const extraCustomGoodsColumns = !this.props.showExtraCustomField ? [] : extraCustomGoodsArr;

        if (extraCustomGoodsArr.length > 0) {
            goodsColumns = goodsColumns.concat(extraCustomGoodsColumns);
        }

        const remarksColumns = this.props.hideRemarks ? [] : [{
            title: intl.get("components.goods.goodsTable.remarks"),
            key: this.dataName.remarks,
            originalKey: 'remarks',
            columnName: 'remarks',
            maxLength: 2000,
            // width: 300
        }];

        const allFieldsColumns = goodsColumns.concat(receiptColumns, remarksColumns);

        //处理字段配置
        const configFields = this.props.goodsTableConfig.get('data');

        const allResolvedColumns = allFieldsColumns.map(item => {

            return {
                title: () => {
                    return (
                        <React.Fragment>
                            {
                                item.required ? (<span className="required">*</span>) : null
                            }
                            {typeof item.title === 'function' ? item.title() : item.title}
                        </React.Fragment>
                    )
                },
                dataIndex: item.key,
                key: item.key,
                columnName: item.columnName,
                width: item.width,
                align: item.align || 'left',
                isCustomField: item.isCustomField,
                className: item.className,
                fixed: item.fixed,
                render: (text, record, index) => {
                    //（有必填项 && （当前行不为空行则校验 || 如果全部为空行，则第一行校验））
                    const requiredFlag = item.required && (!this.isEmptyLine(record.key) || (this.findKeyWithEmptyLine(dataSource).length === dataSource.length && index === 0))

                    let validConfig = [],
                        customValidConfig = [],
                        mergeValidConfig;
                    if (item.rules && item.rules.length > 0) {
                        item.rules.forEach(item => {
                            if (item.rule && item.message) {
                                if (!item.required || (item.required && requiredFlag)) {
                                    customValidConfig.push(item);
                                }
                            }
                            else {
                                validConfig.push(item)
                            }
                        });
                    }

                    validConfig.push({
                        required: requiredFlag,
                        message: `${item.nTitle ? item.nTitle : item.title} ${intl.get("components.goods.goodsTable.message1")}`
                    });

                    if (item.maxLength) {
                        customValidConfig.push({
                            rule: function(val) {
                                return val && val.length > item.maxLength;
                            },
                            message: `${item.title}${intl.get("components.goods.goodsTable.message2")}${item.maxLength} ${intl.get("components.goods.goodsTable.message3")}`
                        });
                    }

                    mergeValidConfig = [
                        ...validConfig,
                        {
                            validator: (rules, val, callback) => {
                                let flag = false;
                                for (let i = 0; i < customValidConfig.length; i++) {
                                    if (flag = customValidConfig[i].rule(val, record)) {
                                        callback(customValidConfig[i].message);
                                        break;
                                    }
                                }
                                if (!flag) {
                                    callback();
                                }
                            }
                        }
                    ];

                    let str = null;
                    let onKeyDown = (e) => this.tabMove(e.keyCode, index, item.key, allFieldsColumns);
                    //直接有render方法的
                    let componentStr;
                    if (item.render) {
                        if (this.props[`${item.originalKey}AuthModule`]){
                            componentStr = <Auth
                                module={this.props[`${item.originalKey}AuthModule`]}
                                option="show"
                            >
                                {(isAuthed) => isAuthed ? item.render(text, record, index, dataSource, mergeValidConfig, requiredFlag, onKeyDown) : PRICE_NO_AUTH_RENDER}
                            </Auth>
                        } else {
                            componentStr = item.render(text, record, index, dataSource, mergeValidConfig, requiredFlag, onKeyDown);
                        }
                    }
                    else {
                        let inputProps = {
                            placeholder: item.placeholder,
                            maxLength: item.maxLength,
                            disabled: record[item.originalKey + 'ReadOnly'],
                            style: {"textAlign": item.align},
                            onKeyDown: onKeyDown,
                            onChange: item.onChange ? (e) => item.onChange(e, record.key, dataSource) : null
                        };

                        if (item.readOnly) {
                            inputProps = {
                                className: cx("readOnly"),
                                readOnly: true,
                                title: text,
                                style: {"textAlign": item.align}
                            }
                        }

                        if (this.props[`${item.originalKey}AuthModule`]) {
                            componentStr = <AuthInput {...inputProps}
                                                      module={this.props[`${item.originalKey}AuthModule`]}
                                                      option={this.props[`${item.originalKey}AuthType`] ? this.props[`${item.originalKey}AuthType`] : this.props.defaultAuthType}
                                                      noAuthRender={this.props[`${item.originalKey}NoAuthRender`] ? this.props[`${item.originalKey}NoAuthRender`] : this.props.defaultNoAuthRender}
                            />
                        } else if(item.hidden){
                            componentStr = <Input {...inputProps} stype={{"display": "none"}}/>
                        } else {
                            componentStr = <Input {...inputProps}/>
                        }

                    }
                    //处理单价和金额格式化
                    let initialValue = text;
                    if (item.key === this.dataName.unitPrice || item.key === this.dataName.untaxedPrice) {
                        initialValue = fixedDecimal(text, priceDecimalNum)
                    } else if (item.key === this.dataName.quantity || item.key === this.dataName.recQuantity || item.key === 'systemNum') {
                        initialValue = fixedDecimal(text, quantityDecimalNum)
                    } else if (item.key === this.dataName.amount) {
                        initialValue = removeCurrency(formatCurrency(text, 2, true))
                    }
                    return (
                        <React.Fragment>
                            {
                                item.getFieldDecoratored ? (
                                    <Form.Item>
                                        {componentStr}
                                    </Form.Item>
                                ) : (
                                    <Form.Item
                                        {...defaultOptions}
                                        initialValue={initialValue}
                                        name={[this.dataPrefix, record.key, item.key]}
                                        rules={mergeValidConfig}
                                    >
                                        {componentStr}
                                    </Form.Item>
                                )
                            }
                        </React.Fragment>
                    )
                }
            }
        });

        const visibleColumns = configFields && allResolvedColumns.map(column => {
            configFields.forEach(field => {
                //修改字段的title
                if (field.get('columnName') === column.columnName) {
                    column.title = (column.columnName.indexOf('property_value') == -1 && column.columnName.indexOf('orderPropertyValue') == -1 && column.columnName.indexOf('supplierPropertyValue') == -1 && column.columnName.indexOf('salePropertyValue') == -1 && column.columnName.indexOf('prodPropertyValue') == -1 && column.columnName.indexOf('SupplierPropValue') == -1 && column.columnName.indexOf('propertyValue') == -1 && column.columnName.indexOf('customerPropValue') == -1 && column.columnName.indexOf("enterPropertyValue") == -1 && column.columnName.indexOf("outPropertyValue") == -1 && column.columnName.indexOf("warehouse-") == -1)?intl.get(field.get('label')):field.get('label');
                    //后端返回的字段表示该字段可配置，同时如果字段是自定义字段，那么把exist置为true
                    column.isCustomField = column.isCustomField === undefined ? void 0 : true;
                    if (field.get('visibleFlag') !== 1) {
                        column.visibleFlag = 'hide';
                        column.width = 0;
                        column.className = column.className ? cx('col-hide') + ' ' + column.className : cx('col-hide')
                    }
                }
            });
            return column;
        }).filter(item => item.isCustomField === undefined || item.isCustomField); //过滤掉isCustomField为false的字段（表示没有这个自定义字段）

        const columns = prefixColumn.concat(visibleColumns || allResolvedColumns);

        let footerStr = null;

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 0},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 24},
            }
        };

        if (!(this.props.hideTotalQuantity && this.props.hideTotalAmount)) {
            footerStr = (
                <div className={cx("tb-footer-wrap") + " cf"}>
                    {/*<div>合计</div>*/}
                    <div className={cx('total')}>
                        {
                            this.props.hideTotalQuantity ? null : (
                                <span>{intl.get("components.goods.goodsTable.allAmount")}: <b>
                                    <React.Fragment>
                                        <Form.Item name="totalQuantity"
                                                   {...formItemLayout}
                                                   initialValue={formatCurrency(0, 3)}
                                                   className={'form-x'}
                                                   style={{display: 'inline-block'}}
                                        >
                                            <Input style={{color:"#e53e3e",width: "140px",position: "relative",top: "2px"}} bordered={false}
                                                   disabled
                                            />
                                        </Form.Item>
                                    </React.Fragment></b></span>
                            )
                        }
                        {
                            this.props.hideTotalAmount ? null : (
                                <span>{intl.get("components.goods.goodsTable.totalAmount")}: <b>
                                            <Auth module={this.props.amountAuthModule}
                                                  option={this.props.defaultAuthType}>{
                                                (isAuthed) => isAuthed ?
                                                    <React.Fragment>
                                                        <Form.Item name="totalAmount"
                                                                   {...formItemLayout}
                                                                   initialValue={removeCurrency(formatCurrency(0))}
                                                                   style={{display: 'inline-block'}}
                                                        >
                                                            <Input style={{color:"#e53e3e",width: "170px",position: "relative",top: "2px"}} bordered={false}
                                                                   disabled
                                                            />
                                                        </Form.Item>
                                                    </React.Fragment> : this.props.defaultNoAuthRender
                                            }</Auth>
                                        </b>{intl.get("components.goods.goodsTable.yuan")}</span>
                            )
                        }
                        {
                            // 是否隐藏优惠金额字段
                            this.props.hideDiscountAmount ? null : (
                                <React.Fragment>
                                    <Auth module={this.props.amountAuthModule}
                                          option={this.props.defaultAuthType}>{
                                        (isAuthed) => isAuthed ? (
                                            <React.Fragment>
                                                <span style={{display: 'inline-block'}}>
                                                    <DiscountInput
                                                        {...this.props}
                                                        title={intl.get("components.goods.goodsTable.discountAmount")}
                                                        totalAmount={getFieldValue('totalAmount')}
                                                        onChange={(val) => this.props.setDiscountAmount(val, false)}
                                                    />
                                                </span>
                                                <span style={{margin: '0 10px 0 -30px'}}>
                                                    {intl.get("components.goods.goodsTable.yuan")}
                                                    <Tooltip
                                                        title={intl.get("components.goods.goodsTable.tooltipContent")}>
                                                            <Icon type="question-circle" className={cx("discount-tip")}
                                                                  theme="filled"/>
                                                    </Tooltip>
                                                </span>
                                            </React.Fragment>) : (
                                            <React.Fragment>
                                                    <span>{intl.get("components.goods.goodsTable.discountAmount")}: <b>
                                                        {this.props.defaultNoAuthRender}</b>
                                                        {intl.get("components.goods.goodsTable.yuan")}
                                                    </span>
                                            </React.Fragment>)
                                    }
                                    </Auth>

                                    <span>{intl.get("components.goods.goodsTable.aggregateAmount")}: <b>
                                            <Auth module={this.props.amountAuthModule}
                                                  option={this.props.defaultAuthType}>{
                                                (isAuthed) => isAuthed ?
                                                    <React.Fragment>
                                                        <Form.Item name="aggregateAmount"
                                                                   {...formItemLayout}
                                                                   initialValue={removeCurrency(formatCurrency(0))}
                                                                   style={{display: 'inline-block'}}
                                                        >
                                                            <Input style={{color:"#e53e3e",width: "170px",position: "relative",top: "2px"}} bordered={false}
                                                                   disabled
                                                            />
                                                        </Form.Item>
                                                    </React.Fragment>: this.props.defaultNoAuthRender
                                            }</Auth>
                                        </b>{intl.get("components.goods.goodsTable.yuan")}</span>
                                </React.Fragment>
                            )
                        }

                    </div>
                </div>
            )
        }
        //计算宽度
        const tableWidth = columns.reduce(function(width, item) {
            return width + (item.width !== undefined ? item.width : 200) / 1;
        }, 0);

        const allProps = {
            ...this.props,
            dataPrefix: this.dataPrefix,
            dataName: this.dataName,
            getExistIds: this.getExistIds,
            fillGoods: this.fillGoods,
            clearAllGoods: this.clearAllGoods
        };

        return (
            <React.Fragment>
                <Spin
                    spinning={goodsInfo.get('isFetching')}
                >
                    <Table
                        bordered
                        dataSource={dataSource}
                        pagination={false}
                        footer={footerStr ? () => footerStr : null}
                        columns={columns}
                        className={cx("goods-table")}
                        scroll={{x: tableWidth}}
                    />
                    {
                        this.props.children ? this.props.children(allProps) : null
                    }
                </Spin>
            </React.Fragment>
        )
    }
}

