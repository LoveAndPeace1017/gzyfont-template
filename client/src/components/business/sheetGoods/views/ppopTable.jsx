import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from "lodash";
import { Input, Table, Form } from 'antd';
import {PlusOutlined,MinusOutlined,EllipsisOutlined} from '@ant-design/icons';
import 'url-search-params-polyfill';
import {formatCurrency, removeCurrency} from 'utils/format';
import {getCookie} from 'utils/cookie';
import GoodsSuggest from 'components/business/goodsSuggest';
import Base from '../dependencies/base';
import withFormOperate from '../dependencies/withFormOperate';
import withGoodsPop from '../dependencies/withGoodsPop';
import withGoodsSuggest from '../dependencies/withGoodsSuggest';
import withCustomFields from '../dependencies/withCustomFields';
import {withFix} from 'components/business/goods';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");

/**
 *
 * @visibleName PpopTable（计划生产列表）
 * @author jinb
 */
@withCustomFields
@withFix
@withFormOperate
@withGoodsPop
@withGoodsSuggest
export default class PpopTable extends Base {
    constructor(props) {
        super(props);
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
        /** 填充当前行数据 */
        setFormField: PropTypes.func,
        /** 物品编号建议词 以及物品名称建议词 回填物品其它信息 */
        handleProdSuggestSelect: PropTypes.func,
        /** 物品编号建议词 以及物品名称建议词 发生变化时*/
        handleProdSuggestChange: PropTypes.func,
        /** 计算总数量 */
        calculateTotalQuantity: PropTypes.func,
    };


    render() {
        let { dataPrefix, formData, goodsTableConfig, renderFixIcon, fixed=false, // 是否固定前几列
            prodFields, renderProdCustomFields } = this.props;
        let quantityDecimalNum = getCookie("quantityDecimalNum");
        //处理字段配置
        const configFields = goodsTableConfig.get('produceData') && goodsTableConfig.get('produceData').toJS();
        // 物品自定义的columns
        let prodCustomFields = _.cloneDeep(prodFields && prodFields.toJS());


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
                            <a href="#!" className={cx('add-item')} onClick={() => this.props.addOneRow(index)}>
                                <PlusOutlined style={{fontSize: "16px"}}/>
                            </a>
                            {
                                formData.length > 1 ? (
                                    <a href="#!" className={cx('delete-item')} onClick={() => this.props.removeOneRow(record.key)}>
                                        <MinusOutlined style={{fontSize: "16px"}}/>
                                    </a>
                                ) : null
                            }
                            <div style={{display:"none"}}>
                                <Form.Item name={[dataPrefix, record.key, 'prodNo']}>
                                    <Input type="hidden"/>
                                </Form.Item>
                                <Form.Item name={[dataPrefix, record.key, 'saleBillNo']}>
                                    <Input type="hidden"/>
                                </Form.Item>
                            </div>
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
                    <Form.Item name={[dataPrefix, record.key, 'prodCustomNo']}
                               rules={[{ required: true,message: "该项为必填项"}]}
                    >
                        <GoodsSuggest
                            type="displayCode"
                            id={dataPrefix+"_"+record.key+"_prodCustomNo"}
                            goodsPopCondition={this.props.goodsPopCondition}
                            placeholder={"物品编号"}
                            onChange={(value, goods) => {
                                value ? this.props.handleProdSuggestSelect(value, goods, record.key) : this.props.setFormField(record.key, null)
                            }}
                            onSearch={() => this.props.handleProdSuggestChange(record.key)}
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
                            onChange={(value, goods) => this.props.handleProdSuggestSelect(value, goods, record.key)}
                            onSearch={() => this.props.handleProdSuggestChange(record.key)}
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
            },{
                title: '规格型号',
                dataIndex: 'descItem',
                key: 'descItem',
                columnName: 'descItem',
                width: 250,
                readOnly: true
            }, {
                title: '单位',
                dataIndex: 'unit',
                key: 'unit',
                columnName: 'unit',
                width: 100,
                readOnly: true
            }, {
                title: '品牌',
                dataIndex: 'brand',
                key: 'brand',
                columnName: 'brand',
                width: 250,
                readOnly: true
            },{
                title: '制造商型号',
                dataIndex: 'produceModel',
                key: 'produceModel',
                columnName: 'produceModel',
                width: 250,
                readOnly: true
            },
            ...renderProdCustomFields(prodCustomFields),
            {
                title: 'BOM',
                dataIndex: 'bomCode',
                key: 'bomCode',
                columnName: 'bomcode',
                width: 250,
                readOnly: true,
            }, {
                title: '销售单号',
                dataIndex: 'saleDisplayBillNo',
                key: 'saleDisplayBillNo',
                columnName: 'saleDisplayBillNo',
                width: 250,
                readOnly: true
            }, {
                title: '客户订单号',
                dataIndex: 'saleCustomerOrderNo',
                key: 'saleCustomerOrderNo',
                columnName: 'customerOrderNo',
                width: 250,
                readOnly: true
            },{
                title: '销售数量',
                dataIndex: 'saleQuantity',
                key: 'saleQuantity',
                columnName: 'saleQuantity',
                width: 150,
                readOnly: true
            },{
                title: '交付日期',
                dataIndex: 'saleDeliveryDeadlineDate',
                key: 'saleDeliveryDeadlineDate',
                columnName: 'deliveryDeadlineDate',
                width: 250,
                readOnly: true
            },{
                title: '计划生产数量',
                dataIndex: 'quantity',
                key: 'quantity',
                width: 250,
                required: true,
                render: (text, record)=> {
                    return (
                        <Form.Item
                            name={[dataPrefix, record.key, 'quantity']}
                            rules={[
                                { required: true,message: "该项为必填项"},
                                {
                                    validator: (rules, val, callback) => {
                                        if (val) {
                                            let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
                                            if (val && !reg.test(val)) {
                                                callback(`整数部分不能超过10位，小数点后不能超过${quantityDecimalNum}位`);
                                            }
                                            callback();
                                        } else {
                                            callback();
                                        }
                                    }
                                }
                            ]}
                        >
                            <Input maxLength={14} onBlur={this.props.calculateTotalQuantity}/>
                        </Form.Item>
                    )
                }
            },{
                title: '备注',
                dataIndex: 'remarks',
                key: 'remarks',
                maxLength: 2000
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
                    let componentStr, inputProps;
                    if (item.render) {
                        componentStr = item.render(text, record, index);
                    } else {
                        if (item.readOnly) {
                            inputProps = {
                                className: cx("readOnly"),
                                readOnly: true,
                                title: text,
                                style: {"textAlign": item.align}
                            }
                        } else {
                            inputProps = {
                                placeholder: item.placeholder,
                                maxLength: item.maxLength,
                                style: {"textAlign": item.align}
                            };
                        }
                        componentStr = <Input {...inputProps}/>
                    }
                    return (
                        <React.Fragment>
                            <Form.Item name={[dataPrefix, record.key, item.key]}>
                                {componentStr}
                            </Form.Item>
                        </React.Fragment>
                    )
                }
            };
        });

        const tableWidth = columns.reduce(function(width, item) {
            return width + (item.width !== undefined ? item.width : 200) / 1;
        }, 0);


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

        footerStr = (
            <div className={cx("tb-footer-wrap") + " cf"}>
                <div className={cx('total')}>
                    <span>总数量: <b><React.Fragment>
                                <Form.Item name={dataPrefix+"TotalQuantity"}
                                           {...formItemLayout}
                                           initialValue={formatCurrency(0, 3)}
                                           className={'form-x'}
                                           style={{display: 'inline-block'}}
                                >
                                    <Input style={{color:"#e53e3e",width: "100px",position: "relative",top: "2px"}} bordered={false} disabled/>
                                </Form.Item>
                    </React.Fragment></b></span>
                </div>
            </div>
        );

        return (
            <React.Fragment>
                <Table
                    bordered
                    dataSource={formData}
                    pagination={false}
                    columns={columns}
                    footer={footerStr ? () => footerStr : null}
                    className={cx(["goods-table", "sheet-table"])}
                    scroll={{x: tableWidth}}
                />
            </React.Fragment>
        )
    }
}

