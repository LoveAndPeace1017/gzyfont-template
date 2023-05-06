import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {withRouter} from 'react-router-dom'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import { Input, Table, Spin, Form, Button } from 'antd';
import 'url-search-params-polyfill';
import defaultOptions from 'utils/validateOptions';
import {formatCurrency, removeCurrency} from 'utils/format';
import {numberReg} from 'utils/reg';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import {AuthInput} from 'components/business/authMenu';
import {SelectUnit} from 'pages/auxiliary/goodsUnit'
import {Auth} from 'utils/authComponent';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import {actions as addGoodsActions} from 'pages/goods/add';
import {actions as fieldConfigActions} from 'components/business/goodsTableFieldConfigMenu';
import * as goodsActions from "../actions";
import * as outGoodsActions from '../outActions';
import {actions as batchShelfActions} from "components/business/batchShelfLeft";
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import GoodsSuggest from 'components/business/goodsSuggest';
import Base from '../dependencies/base';
import withQuantityAmount from '../dependencies/withQuantityAmount';
import withGoodsPop from '../dependencies/withGoodsPop';
import withGoodsSuggest from '../dependencies/withGoodsSuggest';
import withBatchLeft from '../dependencies/withBatchLeft';
import withAllocateCost from '../dependencies/withAllocateCost';
import {PlusOutlined,MinusOutlined,EllipsisOutlined} from '@ant-design/icons';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import moment from 'moment-timezone';
import {fromJS} from "immutable";
moment.tz.setDefault("Asia/Shanghai");

const cx = classNames.bind(styles);

const mapStateToProps = (state, props) => ({
    goodsInfo: props.prodType==='consume' ? state.getIn(['outSubcontractGoods', 'goodsInfo']) : state.getIn(['subcontractGoods', 'goodsInfo']),
    goodsTableConfig: state.getIn(['goodsTableFieldConfigMenu', 'goodsTableConfig']),
    vipService: state.getIn(['vipHome', 'vipService'])
});

const mapDispatchToProps = (dispatch, ownProps) => {
    let actions = ownProps.prodType==='consume' ? outGoodsActions : goodsActions;
    let {addGoodsItem, removeGoodsItem, initGoodsItem, initGoodsDefaultItem, setFieldReadonly, unsetFieldReadonly, asyncFetchStockByCode, emptyDetailData} = actions;
    return bindActionCreators({
        addGoodsItem,
        removeGoodsItem,
        initGoodsItem,
        initGoodsDefaultItem,
        setFieldReadonly,
        unsetFieldReadonly,
        asyncFetchStockByCode,
        emptyDetailData,
        asyncFetchBatchShelfList: batchShelfActions.asyncFetchBatchShelfList,
        emptyFieldConfig: fieldConfigActions.emptyFieldConfig,
        asyncSaveFieldConfig: fieldConfigActions.asyncSaveFieldConfig,
        asyncFetchGoodsById: addGoodsActions.asyncFetchGoodsById,
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
@withQuantityAmount
@withGoodsPop
@withGoodsSuggest
@withBatchLeft
@withAllocateCost
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
            unit: 'unit',
            brand: 'brand',
            produceModel: 'produceModel',
            quantity: 'quantity',
            untaxedPrice: 'untaxedPrice',
            unitPrice: 'unitPrice',
            untaxedAmount: 'untaxedAmount',
            tax: 'tax',
            amount: 'amount',
            remarks: 'remarks',
        }
         **/
        dataName: PropTypes.object,
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
         *   把某个字段带入物品表格中的对于字段， 如goodsPopCarryFields = {{'currentQuantity': 'systemNum'}}  //key为弹层中的字段名称， value为表格中的字段名称
         **/
        goodsPopCarryFields: PropTypes.object,
        /**
         *   物品只能选择不能输入
         **/
        goodsOnlySelect: PropTypes.bool,
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
         *   当前物品列表的类型
         **/
        prodType: PropTypes.string,
    };

    static defaultProps = {
        defaultAuthType: 'show',
        defaultNoAuthRender: PRICE_NO_AUTH_RENDER
    };

    handleRemoveItem = (key) => {
        let {getFieldValue, setFieldsValue} = this.props.formRef.current;
        let formData = getFieldValue(this.dataPrefix);
        delete formData[key];
        setFieldsValue({[this.dataPrefix]: formData});
        this.props.removeGoodsItem([key]);
    };

    clearAllGoods = () => {
        const {goodsInfo} = this.props;
        let {setFieldsValue} = this.props.formRef.current;
        const dataSource = goodsInfo.get('data').toJS();

        dataSource.forEach((item) => {
            setFieldsValue({[this.dataPrefix]: {[item.key]: {}}});
            this.props.onClearAllGoods && this.props.onClearAllGoods(item.key);
            this.setFieldReadOnlyStatus(false, item.key);
        });
    };

    allocateCost = () => {
        let {getFieldValue} = this.props.formRef.current;
        let list = [];
        let formData = getFieldValue(this.dataPrefix);

        for(let key in formData){
            if(formData[key] && formData[key][this.dataName.productCode]){
                list.push({key, ...formData[key]});
            }
        }
        this.props.openAllocateCost && this.props.openAllocateCost(list);
    };

    componentDidMount() {
        if(this.props.fillGoodsCallback){
            this.props.fillGoodsCallback(this.fillGoods);
        }
        this.props.asyncFetchVipService(); // 获取Vip信息
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const hasProdCode = nextProps.goodsInfo.get('data').some(item => {
            return item.get('ope')
        });
        let quantityDecimalNum = getCookie("quantityDecimalNum");
        let priceDecimalNum = getCookie("priceDecimalNum");
        //没有物品编号就说明没有物品，则加载初始物品数据
        if ((this.props.match.params.id || this.props.match.params.copyId) && nextProps.initGoodsTableData && nextProps.initGoodsTableData.size > 0 && !hasProdCode) {
            //修改页赋初始值，后端给的字段名称转成组件里统一的字段名称(如果是自己定义的dataName，那么传进来的字段名称就要和自己定义的名称相同才能赋值，否则我们会用把外面传进来的名称统一转换成我们内部自己的名称)
            let totalQuantity=0, totalCost=0, processCost=0, totalAmount=0;
            const initGoodsTableData = nextProps.initGoodsTableData.map(item => {
                totalQuantity += item.get(this.dataName.quantity);  // 总数量
                totalCost += item.get(this.dataName.amount);  // 原料成本
                if(this.props.prodType==='preform'){
                    processCost += item.get(this.dataName.allocatedAmount) - item.get(this.dataName.amount); // 加工费
                    totalAmount += item.get(this.dataName.allocatedAmount);  // 总金额
                }
                return item.set('productCode', item.get(this.dataName.productCode))
                    .set('prodName', item.get(this.dataName.prodName))
                    .set('descItem', item.get(this.dataName.descItem))
                    .set('unit', item.get(this.dataName.unit))
                    .set('brand', item.get(this.dataName.brand))
                    .set('produceModel', item.get(this.dataName.produceModel))
                    .set('batchNo', item.get(this.dataName.batchNo))
                    .set('productionDate', item.get(this.dataName.productionDate))
                    .set('expirationDate', item.get(this.dataName.expirationDate))
                    .set('unitCost', item.get(this.dataName.unitCost))
                    .set('quantity', fixedDecimal(item.get(this.dataName.quantity), quantityDecimalNum))
                    .set('unit', item.get(this.dataName.unit))
                    .set('amount', item.get(this.dataName.amount))
                    .set('allocatedPrice', item.get(this.dataName.allocatedPrice))
                    .set('allocatedAmount', item.get(this.dataName.allocatedAmount))
            });
            this.props.initGoodsItem(initGoodsTableData);
            this.props.setTotalQuantity(totalQuantity);   // 初始化总数量
            this.props.setTotalCost(totalCost);   // 初始化原料成本
            if(this.props.prodType==='preform'){
                this.props.setProcessCost(processCost);   // 初始化加工费
                this.props.setTotalAmount(totalAmount);   // 初始化总金额
            }
            this.initProdForm(initGoodsTableData.toJS());
        }
    }

    componentWillUnmount() {
        if (this.props.fieldConfigType) {
            this.props.asyncSaveFieldConfig(this.props.fieldConfigType);
            this.props.emptyFieldConfig();
        }
        this.props.emptyDetailData();
    }

    // 初始化表单数据
    initProdForm = (info) => {
        if(!this.props.formRef || !this.props.formRef.current){
            return false;
        }
        let quantityDecimalNum = getCookie("quantityDecimalNum");
        let priceDecimalNum = getCookie("priceDecimalNum");

        let {setFieldsValue} = this.props.formRef.current;
        if(!info || info.length===0) return;
        //处理单价和金额格式化
        for(let i = 0; i < info.length; i++){
            let item = info[i];
            for(let key in this.dataName){
                let initialValue = item[this.dataName[key]];
                if (key === this.dataName.unitCost) {
                    fixedDecimal(initialValue, priceDecimalNum)
                }else if(key === this.dataName.quantity){
                    initialValue = fixedDecimal(initialValue, quantityDecimalNum)
                }  else if (key === this.dataName.amount) {
                    initialValue = removeCurrency(formatCurrency(initialValue, 2, true))
                }else if (key === this.dataName.productionDate || key === this.dataName.expirationDate){
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

    render() {

        const {goodsInfo, vipService, prodType} = this.props;
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
                           onClick={() => this.props.addGoodsItem(index + 1, 0, null, {})}><PlusOutlined style={{fontSize: "16px"}}/></a>
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
                                name={[this.dataPrefix, record.key, this.dataName.id]}
                                initialValue={record.id}
                            >
                                <Input type="hidden"/>
                            </Form.Item>
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

                        </div>
                    </React.Fragment>
                )
            }
        }, {
            // fixed: 'left',
            title: intl.get("components.goods.goodsTable.serial"),
            dataIndex: 'serial',
            key: 'serial',
            width: 50,
            align: 'center',
            render: (text, record, index) => index + 1
        }];

        //物品固定字段
        let goodsColumns = [
            {
                title: intl.get("components.goods.goodsTable.prodCustomNo"),
                key: this.dataName.prodCustomNo,
                originalKey: 'prodCustomNo',
                maxLength: 50,
                placeholder: intl.get("components.goods.goodsTable.prodCustomNo"),
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
                title: intl.get("components.goods.goodsTable.prodName"),
                key: this.dataName.prodName,
                originalKey: 'prodName',
                required: true,
                maxLength: 100,
                width: 300,
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
            {
                title: intl.get("components.goods.goodsTable.descItem"),
                key: this.dataName.descItem,
                originalKey: 'descItem',
                columnName: 'descItem',
                maxLength: 1000,
                width: 235
            },

            {
                title: intl.get("components.goods.goodsTable.unit"),
                key: this.dataName.unit,
                originalKey: 'unit',
                required: true,
                maxLength: 50,
                width: 101,
                render: (text, record, index, dataSource, validConfig, requiredFlag, onKeyDown) =>
                    <SelectUnit minWidth="" showEdit
                                id={this.dataPrefix+"_"+record.key+"_unit"} onKeyDown={onKeyDown}
                                disabled={record['unitReadOnly']}/* minWidth={'100%'}*//>
            }
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

        // 批次号有关字段
        if (batchShelfLifeVipFlag && this.props.batchLeftColumns && this.props.batchLeftColumns.length > 0) {
            goodsColumns = goodsColumns.concat(this.props.batchLeftColumns);
        }

        //数量、单价、金额字段
        if (this.props.quaColumns && this.props.quaColumns.length > 0) {
            goodsColumns = goodsColumns.concat(this.props.quaColumns)
        }

        const allFieldsColumns = goodsColumns;

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
                            {item.title}
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
                        message: `${item.title} ${intl.get("components.goods.goodsTable.message1")}`
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
                    } else if (item.key === this.dataName.quantity) {
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

        let visibleColumns = configFields && allResolvedColumns.map(column => {
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

        //计算宽度
        const tableWidth = columns.reduce(function(width, item) {
            return width + (item.width !== undefined ? item.width : 200) / 1;
        }, 0);

        footerStr = (
            <div className={cx("tb-footer-wrap") + " cf"}>
                <div className={cx('total')}>
                    <span>总数量: <b><React.Fragment>
                                <Form.Item name={prodType+"TotalQuantity"}
                                           {...formItemLayout}
                                           initialValue={formatCurrency(0, 3)}
                                           className={'form-x'}
                                           style={{display: 'inline-block'}}
                                >
                                    <Input style={{color:"#e53e3e",width: "100px",position: "relative",top: "2px"}} bordered={false} disabled/>
                                </Form.Item>
                    </React.Fragment></b></span>

                    <span>原料成本: <b><React.Fragment>
                                <Form.Item name={prodType+"TotalCost"}
                                           {...formItemLayout}
                                           initialValue={formatCurrency(0, 3)}
                                           className={'form-x'}
                                           style={{display: 'inline-block'}}
                                >
                                    <Input style={{color:"#e53e3e",width: "100px",position: "relative",top: "2px"}} bordered={false} disabled/>
                                </Form.Item>
                    </React.Fragment></b></span>

                    {
                        prodType === 'preform' && (
                            <React.Fragment>
                                <span className={cx("span-t")}>加工费: <b><React.Fragment>
                                    <Form.Item name={prodType+"ProcessCost"}
                                               {...formItemLayout}
                                               initialValue={formatCurrency(0, 3)}
                                               className={'form-x'}
                                               style={{display: 'inline-block'}}
                                    >
                                        <Input style={{color:"#e53e3e",width: "100px",position: "relative",top: "2px"}} bordered={false} disabled/>
                                    </Form.Item>
                                </React.Fragment></b></span>

                                <span className={cx("span-t")}>总金额: <b><React.Fragment>
                                            <Form.Item name={prodType+"TotalAmount"}
                                                       {...formItemLayout}
                                                       initialValue={formatCurrency(0, 3)}
                                                       className={'form-x'}
                                                       style={{display: 'inline-block'}}
                                            >
                                                <Input style={{color:"#e53e3e",width: "100px",position: "relative",top: "2px"}} bordered={false} disabled/>
                                            </Form.Item>
                                </React.Fragment></b></span>

                                <Button type="primary" onClick={this.allocateCost}>成本分摊</Button>
                            </React.Fragment>
                        )
                    }
                </div>
            </div>
        );

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

