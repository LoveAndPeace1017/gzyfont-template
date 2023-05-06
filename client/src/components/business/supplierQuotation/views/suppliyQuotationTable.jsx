import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Input, Table, Form, DatePicker} from 'antd';
import {PlusOutlined,MinusOutlined,EllipsisOutlined} from '@ant-design/icons';
import 'url-search-params-polyfill';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import {getCookie} from 'utils/cookie';
import Base from '../dependencies/base';
import withFormOperate from '../dependencies/withFormOperate';
import withMultiUnit from '../dependencies/withMultiUnit';
import withQuantityAmount from '../dependencies/withQuantityAmount';
import withFix from '../dependencies/withFix';
import styles from "../styles/index.scss";
import {SelectSupplier} from 'pages/supplier/index';
import {SelectRate} from 'pages/auxiliary/rate';
import classNames from "classnames/bind";
import _ from "lodash";
const cx = classNames.bind(styles);

/**
 *
 * @visibleName Sale
 * @author jinb
 */

@withFix
@withFormOperate
@withMultiUnit
@withQuantityAmount
export default class SupplierQuotation extends Base {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getRef && this.props.getRef(this);
    }

    /** 删除一行*/
    removeOneRow = (key) => {
        let {removeOneRow} = this.props;
        removeOneRow(key)
    };

    //根据供应商带入联系人和联系电话
    handleSelectSupplier = (supplierCode, key)=>{
        let {getFormField, setFormField} = this.props;
        this.props.asyncShowSupplier(supplierCode, data => {
            if (data.retCode === '0') {

                //带入客户联系人和联系电话
                const contacterName = data.data.contacterName;
                const mobile = data.data.mobile;

                setFormField(key, {
                    supplierContacterName: contacterName,
                    supplierMobile: mobile
                });
            }
        });
    }

    /** 处理含税单价和数量变化 */
    handleUnitPriceChange = (value, idx, key, type) => {
        let {getFormField, setFormField} = this.props;
        let quantity = getFormField(key, 'quantity') || 0;
        let unitPrice = getFormField(key, 'unitPrice') || 0;

        value = value || 0;

        if(type === 'unitPrice'){
            setFormField(key, {
                amount: (value*quantity).toFixed(2)
            });
        }else{
            setFormField(key, {
                amount: (value*unitPrice).toFixed(2)
            });
        }

    };

    initInfo = ()=>{
        let {setFormField, defaultForm} = this.props;
        setFormField(0, {
            taxRate: defaultForm.taxRate,
            unit: defaultForm.unit,
        });
    }

    initSupplier = ()=>{
        let {setFormField} = this.props;
        setFormField(0, {
            supplierCode: {
                key: '',
                label: ''
            }
        });
    }

    render() {
        let { dataPrefix, formData, defaultForm, fixed=false, // 是否固定前几列
             unitColumn, footer} = this.props;

        let quantityDecimalNum = getCookie("quantityDecimalNum");
        let priceDecimalNum = getCookie("priceDecimalNum");

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
                            {
                                formData.length < 10 ? (
                                    <a href="#!" className={cx('add-item')} onClick={() => this.props.addOneRow(index, defaultForm)}>
                                     <PlusOutlined style={{fontSize: "16px"}}/>
                                    </a>):
                                 null
                            }

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
                title: '供应商',
                dataIndex: 'supplierCode',
                key: 'supplierCode',
                columnName: 'supplierCode',
                required: true,
                width: 250,
                render: (text, record)=> {
                    let {key, productCode} = record;
                    return (
                        <React.Fragment>
                            <Form.Item
                                name={[dataPrefix, key, 'supplierCode']}
                                rules={[{ required: true,message: "该项为必填项"}]}
                            >
                                <SelectSupplier  onSelect={(value)=>this.handleSelectSupplier(value.key,key)}
                                                 onBlur={(existSupplier)=>this.handleSelectSupplier(existSupplier.key,key)}/>
                            </Form.Item>
                        </React.Fragment>
                    )
                }
            }, {
                title: '联系人',
                dataIndex: 'supplierContacterName',
                key: 'supplierContacterName',
                columnName: 'supplierContacterName',
                width: 200,
                render: (text, record)=> {
                    let {key, productCode} = record;
                    return (
                        <React.Fragment>
                            <Form.Item
                                name={[dataPrefix, key, 'supplierContacterName']}
                            >
                                <Input />
                            </Form.Item>
                        </React.Fragment>
                    )
                }
            }, {
                title: '联系电话',
                dataIndex: 'supplierMobile',
                key: 'supplierMobile',
                columnName: 'supplierMobile',
                width: 200,
                render: (text, record)=> {
                    let {key, productCode} = record;
                    return (
                        <React.Fragment>
                            <Form.Item
                                name={[dataPrefix, key, 'supplierMobile']}
                            >
                                <Input />
                            </Form.Item>
                        </React.Fragment>
                    )
                }
            },
            {
                title: '报价日期',
                dataIndex: 'quotationDate',
                key: 'quotationDate',
                columnName: 'quotationDate',
                required: true,
                width: 200,
                render: (text, record)=> {
                    let {key, productCode} = record;
                    return (
                        <React.Fragment>
                            <Form.Item
                                name={[dataPrefix, key, 'quotationDate']}
                                rules={[{ required: true,message: "该项为必填项"}]}
                            >
                                <DatePicker className={"gb-datepicker"}/>
                            </Form.Item>
                        </React.Fragment>
                    )
                }
            },
            {
                title: '报价数量',
                dataIndex: 'quantity',
                key: 'quantity',
                columnName: 'quantity',
                width: 150,
                render: (text, record, index)=> {
                    return (
                        <React.Fragment>
                            <Form.Item
                                name={[dataPrefix, record.key, 'quantity']}
                                rules={[
                                    {
                                        validator: (rules, value, callback) => {
                                            let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
                                            if(!value){
                                                callback();
                                            }else{
                                               if (!reg.test(value)) {
                                                    callback(`整数部分不能超过10位，小数点后不能超过${quantityDecimalNum}位`);
                                                } else if(value === 0 || value === '0'){
                                                    callback(`数量不能为0！`);
                                                }else {
                                                    callback();
                                               }
                                            }

                                        }
                                    }
                                ]}
                            >
                                <Input maxLength={11+Number(quantityDecimalNum)} onBlur={(e)=>{this.handleUnitPriceChange(e.target.value, index, record.key, 'quantity')}}/>
                            </Form.Item>
                        </React.Fragment>
                    )
                }
            },
            {...unitColumn} , // 单位
            {
                title: '含税单价',
                dataIndex: 'unitPrice',
                key: 'unitPrice',
                columnName: 'unitPrice',
                required: true,
                width: 200,
                render: (text, record, index)=> {
                    let {key} = record;
                    return (
                        <React.Fragment>
                            <Form.Item
                                name={[dataPrefix, key, 'unitPrice']}
                                rules={[{ required: true,message: "该项为必填项"},
                                        {
                                            validator: (rules, value, callback) => {
                                                let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ priceDecimalNum +'})?$/');
                                                if (value && !reg.test(value)) {
                                                    callback(`整数部分不能超过10位，小数点后不能超过${priceDecimalNum}位`);
                                                }
                                                callback();
                                            }
                                        }
                                       ]}
                            >
                                <Input  onBlur={(e)=>{this.handleUnitPriceChange(e.target.value, index, record.key, 'unitPrice')}}/>
                            </Form.Item>
                        </React.Fragment>
                    )
                }
            },
            {
                title: '税率',
                dataIndex: 'taxRate',
                key: 'taxRate',
                columnName: 'taxRate',
                required: true,
                width: 200,
                render: (text, record)=> {
                    let {key, productCode} = record;
                    return (
                        <React.Fragment>
                            <Form.Item
                                name={[dataPrefix, record.key, 'taxRate']}
                                rules={[{ required: true,message: "该项为必填项"}]}
                            >
                                <SelectRate showEdit/>
                            </Form.Item>
                        </React.Fragment>
                    )
                }
            },
            {
                title: '价税合计',
                dataIndex: 'amount',
                key: 'amount',
                columnName: 'amount',
                width: 200,
                type: 'INPUT',
                readOnly: true,
            },
            {
                title: '价格有效期',
                dataIndex: 'expiredDate',
                key: 'expiredDate',
                columnName: 'expiredDate',
                required: true,
                width: 200,
                render: (text, record)=> {
                    let {key, productCode} = record;
                    return (
                        <React.Fragment>
                            <Form.Item
                                name={[dataPrefix, key, 'expiredDate']}
                                rules={[{ required: true,message: "该项为必填项"}]}
                            >
                                <DatePicker className={"gb-datepicker"}/>
                            </Form.Item>
                        </React.Fragment>
                    )
                }
            },
            {
                title: '备注',
                dataIndex: 'remarks',
                key: 'remarks',
                maxLength: 2000,
                width: 300,
                type: 'INPUT'
            }
        ];

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

