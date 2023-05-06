import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Input, Table, Form } from 'antd';
import {PlusOutlined,MinusOutlined,EllipsisOutlined} from '@ant-design/icons';
import 'url-search-params-polyfill';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import {getCookie} from 'utils/cookie';
import {fixedDecimal} from "utils/Decimal";
import GoodsSuggest from 'components/business/goodsSuggest';
import Base from '../dependencies/base';
import withPreProcessProd from '../dependencies/withPreProcessProd';
import withFormOperate from '../dependencies/withFormOperate';
import withMultiSpecGoods from '../dependencies/withMultiSpecGoods';
import withMultiUnit from '../dependencies/withMultiUnit';
import withGoodsPop from '../dependencies/withGoodsPop';
import withGoodsSuggest from '../dependencies/withGoodsSuggest';
import withScan from '../dependencies/withScan';
import withCustomFields from '../dependencies/withCustomFields';
import withFix from '../dependencies/withFix';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import _ from "lodash";
const cx = classNames.bind(styles);

/**
 *
 * @visibleName Stock（盘点列表）
 * @author jinb
 */
@withPreProcessProd
@withFix
@withCustomFields
@withFormOperate
@withMultiSpecGoods
@withMultiUnit
@withScan
@withGoodsPop
@withGoodsSuggest
export default class Stock extends Base {
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
        /** 多规格对应的column */
        specColumn: PropTypes.object,
        /** 多单位对应的column */
        unitColumn: PropTypes.object,
        /** 默认需要展示的物品信息 */
        defaultForm: PropTypes.object,
    };

    componentDidMount() {
        this.props.getRef && this.props.getRef(this);
    }

    /** 实盘数量发生变化 */
    handleActualNumOnchange = (value, key) => {
        let quantityDecimalNum = getCookie("quantityDecimalNum");
        let {getFormField, setFormField} = this.props;
        const actualNum = value || 0;
        const systemNum = getFormField(key, 'systemNum') || 0;
        const offset = actualNum-systemNum;
        setFormField(key, {
            offsetQuantityShow: fixedDecimal(offset, quantityDecimalNum),
            offsetQuantity: fixedDecimal(offset, quantityDecimalNum),
            result: offset > 0 ? "盘盈" : offset == 0 ? "正常" : "盘亏"
        });
    };

    render() {
        let quantityDecimalNum = getCookie("quantityDecimalNum");

        let { dataPrefix, formData, removeOneRow, goodsTableConfig, defaultForm, isDraft, renderFixIcon, fixed=false, // 是否固定前几列
            specColumn, unitColumn, prodFields, renderProdCustomFields} = this.props;
        //处理字段配置
        const configFields = goodsTableConfig.get('data') && goodsTableConfig.get('data').toJS();
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
                            <a href="#!" className={cx('add-item')} onClick={() => this.props.addOneRow(index, defaultForm)}>
                                <PlusOutlined style={{fontSize: "16px"}}/>
                            </a>
                            {
                                formData.length > 1 ? (
                                    <a href="#!" className={cx('delete-item')} onClick={() => removeOneRow(record.key)}>
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
            {
                title: '系统数量',
                dataIndex: 'systemNum',
                key: 'systemNum',
                columnName: 'systemNum',
                width: 150,
                type: 'INPUT',
                readOnly: true
            },
            {
                title: "实盘数量",
                dataIndex: 'actualNum',
                key: 'actualNum',
                columnName: 'systemNum',
                width: 150,
                align: 'right',
                required: !isDraft,
                render: (text, record, index) => {
                    return (
                        <React.Fragment>
                            <Form.Item
                                name={[dataPrefix, record.key, 'actualNum']}
                                rules={[
                                    {
                                        validator: (rules, value, callback) => {
                                            let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
                                            if(!isDraft){
                                                if(!value){
                                                    callback('该项为必填项');
                                                } else if (!reg.test(value)) {
                                                    callback(`整数部分不能超过10位，小数点后不能超过${quantityDecimalNum}位`);
                                                }
                                            }
                                            callback();
                                        }
                                    }
                                ]}
                            >
                                <Input maxLength={11+Number(quantityDecimalNum)}
                                       onBlur={(e) => this.handleActualNumOnchange(e.target.value, record.key)}
                                />
                            </Form.Item>
                        </React.Fragment>
                    )
                }
            },
            {
                title: "盈亏数量",
                dataIndex: 'offsetQuantity',
                key: 'offsetQuantity',
                columnName: 'offsetQuantity',
                width: 150,
                align: 'right',
                type: 'INPUT',
                readOnly: true,
                render: (offsetQuantity, record) => {
                    let str1 = (
                        <React.Fragment>
                            <Form.Item
                                name={[dataPrefix, record.key, 'offsetQuantityShow']}
                            >
                                <Input className={cx("readOnly")} readOnly style={{"textAlign": 'right'}} />
                            </Form.Item>
                        </React.Fragment>
                    );
                    let str2 = (
                        <React.Fragment>
                            <Form.Item
                                name={[dataPrefix, record.key, 'offsetQuantity']}
                                style={{display:"none"}}
                            >
                                <Input/>
                            </Form.Item>
                        </React.Fragment>
                    );
                    return  <React.Fragment>
                        {str1}
                        {str2}
                    </React.Fragment>
                }
            },
            {
                title: '盘点结果',
                dataIndex: 'result',
                key: 'result',
                columnName: 'result',
                type: 'INPUT',
                readOnly: true,
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
                    // footer={() => footer}
                    className={cx(["goods-table", "sheet-table"])}
                    scroll={{x: tableWidth}}
                />
            </React.Fragment>
        )
    }
}

