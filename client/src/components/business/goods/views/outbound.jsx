import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Input, Table, Form } from 'antd';
import {PlusOutlined,MinusOutlined,EllipsisOutlined} from '@ant-design/icons';
import 'url-search-params-polyfill';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import GoodsSuggest from 'components/business/goodsSuggest';
import {SerialNumQuerySearch} from 'pages/goods/serialNumQuery/index';
import Base from '../dependencies/base';
import withPreProcessProd from '../dependencies/withPreProcessProd';
import withFormOperate from '../dependencies/withFormOperate';
import withFooter from '../dependencies/withFooter';
import withMultiSpecGoods from '../dependencies/withMultiSpecGoods';
import withMultiUnit from '../dependencies/withMultiUnit';
import withGoodsPop from '../dependencies/withGoodsPop';
import withGoodsSuggest from '../dependencies/withGoodsSuggest';
import withQuantityAmount from '../dependencies/withQuantityAmount';
import withScan from '../dependencies/withScan';
import withBatchLeft from '../dependencies/withBatchLeft';
import withCustomFields from '../dependencies/withCustomFields';
import withFix from '../dependencies/withFix';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import _ from "lodash";
const cx = classNames.bind(styles);

/**
 *
 * @visibleName Outbound（出库列表）
 * @author jinb
 */
@withPreProcessProd
@withFix
@withCustomFields
@withFormOperate
@withFooter
@withMultiSpecGoods
@withMultiUnit
@withQuantityAmount
@withBatchLeft
@withScan
@withGoodsPop
@withGoodsSuggest
export default class Purchase extends Base {
    constructor(props) {
        super(props);
        this.state = {
            itemProdCustomFields: Base.getCustomFields({customKey: 'itemPropertyValue', customConfigKey: 'item_property_value', columnType: 'INPUT'})
        }
    }

    static propTypes = {
        /** 传递给选择物品弹层的参数 */
        goodsPopCondition: PropTypes.object,
        /** 字段的key前缀，一般会改成我们向后端提交数据时，后端需要的名称 */
        dataPrefix: PropTypes.string,
        /** 物品提示弹层只允许选择不允许输入 */
        goodsOnlySelect: PropTypes.bool,
        /** 添加行 */
        addOneRow: PropTypes.func,
        /** 删除行 */
        removeOneRow: PropTypes.func,
        /** 清除当前行 */
        clearOneRow: PropTypes.func,
        /** 获取表单数据 */
        getFormField: PropTypes.func,
        /** 填充当前行数据 */
        setFormField: PropTypes.func,
        /** 物品编号建议词 以及物品名称建议词 回填物品其它信息 */
        handleProdSuggestSelect: PropTypes.func,
        /** 物品编号建议词 以及物品名称建议词 发生变化时*/
        handleProdSuggestChange: PropTypes.func,
        /** 当某一行的数据发生改变时，通过改方法计算合计 */
        calcTotalForOneRow: PropTypes.func,
        /** 多规格对应的column */
        specColumn: PropTypes.object,
        /** 多单位对应的column */
        unitColumn: PropTypes.object,
        /** 与数量相关的columns */
        quantityColumns: PropTypes.array,
        /** 交付日期对应的column */
        deadlineDateColumn: PropTypes.object,
        /** 与批次号相关的columns */
        batchLeftColumns: PropTypes.array,
        /**  底部合计 */
        footer: PropTypes.func,
        /** 默认需要展示的物品信息 */
        defaultForm: PropTypes.object,
    };

    componentDidMount() {
        this.props.getRef && this.props.getRef(this);
    }

    /** 删除一行*/
    removeOneRow = (key) => {
        let {getFormField, removeOneRow, calcTotalForOneRow} = this.props;
        let {quantity=0, amount=0} = getFormField(key) || {};
        removeOneRow(key, () => {
            calcTotalForOneRow(_.divide(quantity, -1), _.divide(amount, -1)); // 计算合计
        })
    };

    /** 添加序列号 */
    handleChangeSerialNumber = (record, serialNumber, num) => {
        let {getFormField, setFormField, calcTotalForOneRow} = this.props;
        let {key, unitConverter=1} = record;
        let quantityDecimalNum = getCookie("quantityDecimalNum");
        let taxRate = getFormField(key, 'taxRate');
        let unitPrice = getFormField(key, 'unitPrice');
        let amount = getFormField(key, 'amount');
        let quantity = getFormField(key, 'quantity');
        let recQuantity = fixedDecimal(_.divide(num, unitConverter), quantityDecimalNum);
        let obj = this.inverseCalc(num, taxRate, unitPrice, amount);
        setFormField(key, {serialNumber, recQuantity, quantity: num});
        obj && setFormField(key, {
            untaxedPrice: obj.untaxedPrice,
            tax: obj.tax,
            unitPrice: obj.unitPrice,
            amount: obj.amount,
            untaxedAmount: obj.untaxedAmount
        });
        // 计算合计
        let q = _.subtract(num||0, quantity||0);
        let a = obj ? _.subtract(obj.amount||0, amount||0) : 0;
        calcTotalForOneRow(q, a);
    };

    render() {
        let { dataPrefix, formData, goodsTableConfig, defaultForm, renderFixIcon, fixed=false, // 是否固定前几列
            specColumn, unitColumn, quantityColumns, batchLeftColumns, footer, prodFields, billFields, renderCustomFields, renderProdCustomFields} = this.props;
        //处理字段配置
        const configFields = goodsTableConfig.get('data') && goodsTableConfig.get('data').toJS();
        // 物品自定义的columns
        let prodCustomFields = _.cloneDeep(prodFields && prodFields.toJS());
        // let billCustomFields = _.cloneDeep(billFields && billFields.toJS());
        let itemProdCustomFields =  _.cloneDeep(this.state.itemProdCustomFields);

        let columns = [
            {
                title: '',
                key: 'ope',
                dataIndex: 'ope',
                width: 60,
                fixed: "left",
                render: (value, record, index) => {
                    return (
                        <React.Fragment>
                            <a href="#!" className={cx('add-item')} onClick={() => this.props.addOneRow(index, defaultForm)}>
                                <PlusOutlined style={{fontSize: "16px"}}/>
                            </a>
                            {
                                formData.length > 1 ? (
                                    <a href="#!" className={cx('delete-item')} onClick={() => this.removeOneRow(record.key)}>
                                        <MinusOutlined style={{fontSize: "16px"}}/>
                                    </a>
                                ) : null
                            }
                        </React.Fragment>
                    )
                }
            }, {
                title: '序号',
                dataIndex: 'serial',
                key: 'serial',
                width: 50,
                align: 'center',
                fixed,
                render: (text, record, index) => index + 1
            }, {
                title: '物品编号',
                required: true,
                key: 'prodCustomNo',
                width: 300,
                fixed,
                render: (text, record, index) => (
                    <Form.Item name={[dataPrefix, record.key, 'prodCustomNo']}>
                        <GoodsSuggest
                            type="displayCode"
                            id={dataPrefix+"_"+record.key+"_prodCustomNo"}
                            goodsPopCondition={this.props.goodsPopCondition}
                            placeholder={"物品编号"}
                            onChange={(value, goods) => {
                                value ? this.props.handleProdSuggestSelect(index, record.key, value, goods) : this.props.clearOneRow(index, record.key)
                            }}
                            onSearch={() => this.props.handleProdSuggestChange(index, record.key)}
                            onlySelect={this.props.goodsOnlySelect}
                        />
                    </Form.Item>
                )
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
                key: 'prodName',
                required: true,
                maxLength: 100,
                width: 300,
                fixed,
                placeholder: '物品名称',
                render: (text, record, index) => (
                    <Form.Item name={[dataPrefix, record.key, 'prodName']}
                               rules={[{ required: true,message: "该项为必填项"}]}
                    >
                        <GoodsSuggest
                            type="name"
                            id={dataPrefix+"_"+record.key+"_prodName"}
                            goodsPopCondition={this.props.goodsPopCondition}
                            placeholder={'物品名称'}
                            onChange={(value, goods) => {
                                value ? this.props.handleProdSuggestSelect(index, record.key, value, goods) : this.props.clearOneRow(index, record.key)
                            }}
                            onSearch={() => this.props.handleProdSuggestChange(index, record.key)}
                            onlySelect={this.props.goodsOnlySelect}
                            suffixIcon={
                                <div
                                    className={cx("select-goods-trigger")}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        return false;
                                    }}>
                                    <a onClick={() => this.props.selectGoods(record.key)}><EllipsisOutlined style={{fontSize: "16px"}}/></a>
                                </div>
                            }
                        />
                    </Form.Item>
                )
            },
            {...specColumn}, // 规格型号
            {...unitColumn} , // 单位
            {
                title: '品牌',
                dataIndex: 'brand',
                key: 'brand',
                columnName: 'brand',
                width: 250,
                render: (text, record)=> {
                    let {key, productCode} = record;
                    return (
                        <React.Fragment>
                            {
                                (productCode) ? (
                                    <span className="txt-clip" title={text}>{text}</span>
                                ) : (
                                    <Form.Item
                                        name={[dataPrefix, key, 'brand']}
                                    >
                                        <Input />
                                    </Form.Item>
                                )
                            }
                        </React.Fragment>
                    )
                }
            }, {
                title: '制造商型号',
                dataIndex: 'produceModel',
                key: 'produceModel',
                columnName: 'produceModel',
                width: 250,
                render: (text, record)=> {
                    let {key, productCode} = record;
                    return (
                        <React.Fragment>
                            {
                                (productCode) ? (
                                    <span className="txt-clip" title={text}>{text}</span>
                                ) : (
                                    <Form.Item
                                        name={[dataPrefix, key, 'produceModel']}
                                    >
                                        <Input />
                                    </Form.Item>
                                )
                            }
                        </React.Fragment>
                    )
                }
            },
            {
                title: "序列号",
                key: 'serialNumber',
                dataIndex: 'serialNumber',
                columnName: 'serialNumber',
                render: (text, record, index) =>
                    <Form.Item
                        name={[dataPrefix, record.key, 'serialNumber']}
                    >
                        <SerialNumQuerySearch
                            {...this.props}
                            onChange={(serialNumber, quantity) => this.handleChangeSerialNumber(record, serialNumber, quantity)}
                        />
                    </Form.Item>
            },
            ...batchLeftColumns,
            ...quantityColumns,
            {
                title: '一级目录',
                dataIndex: 'firstCatName',
                key: 'firstCatName',
                columnName: 'firstCatName',
                width: 150
            },
            {
                title: '二级目录',
                dataIndex: 'secondCatName',
                key: 'secondCatName',
                columnName: 'secondCatName',
                width: 150
            },
            {
                title: '三级目录',
                dataIndex: 'thirdCatName',
                key: 'thirdCatName',
                columnName: 'thirdCatName',
                width: 150
            },
            {
                title: '商品条码',
                dataIndex: 'proBarCode',
                key: 'proBarCode',
                columnName: 'proBarCode',
                width: 300
            },
            ...renderProdCustomFields(prodCustomFields),
            ...itemProdCustomFields,
            {
                title: '备注',
                dataIndex: 'remarks',
                key: 'remarks',
                maxLength: 2000,
                width: 300,
                type: 'INPUT'
            }
        ];

        columns = this.getVisibleColumns(configFields, columns);

        columns = columns.map(item => {
            return {
                ...item,
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
                align: item.align || 'left',
                render: (text, record, index) => {
                    if(item.render){
                        return (
                            <React.Fragment>
                                {
                                    //  校验价格权限 & 没有对应的价格权限
                                    (item.isValidatePriceAuth && !item.priceAuthFlag) ? PRICE_NO_AUTH_RENDER : (
                                        <Form.Item>
                                            {item.render(text, record, index)}
                                        </Form.Item>
                                    )
                                }
                            </React.Fragment>
                        )
                    } else if(item.type === 'INPUT') {
                        let inputProps = {
                            maxLength: item.maxLength,
                            placeholder: item.placeholder
                        };
                        if (item.readOnly) {
                            inputProps = {
                                className: cx("readOnly"),
                                readOnly: true,
                                title: text,
                                style: {"textAlign": item.align}
                            }
                        }
                        return (
                            <React.Fragment>
                                {
                                    //  校验价格权限 & 没有对应的价格权限
                                    (item.isValidatePriceAuth && !item.priceAuthFlag) ? PRICE_NO_AUTH_RENDER : (
                                        <Form.Item name={[dataPrefix, record.key, item.key]}>
                                            <Input {...inputProps}/>
                                        </Form.Item>
                                    )
                                }
                            </React.Fragment>
                        )
                    } else {
                        return <span className="txt-clip" title={text}>{text}</span>
                    }
                }
            };
        });

        const tableWidth = columns.reduce(function(width, item) {
            return width + (item.width !== undefined ? item.width : 200) / 1;
        }, 0);


        return (
            <React.Fragment>
                <Table
                    bordered
                    dataSource={formData}
                    pagination={false}
                    columns={columns}
                    footer={() => footer}
                    className={cx(["goods-table", "sheet-table"])}
                    scroll={{x: tableWidth}}
                />
            </React.Fragment>
        )
    }
}

