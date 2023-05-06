import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
import {Table, Button, Dropdown, Menu} from 'antd';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import {Auth} from 'utils/authComponent';
import IntlTranslation from 'utils/IntlTranslation';
import {formatCurrency, removeCurrency} from 'utils/format';
import {actions as fieldConfigActions} from 'components/business/goodsTableFieldConfigMenu';
import Icon from 'components/widgets/icon';
import {ResizeableTitle} from 'components/business/resizeableTitle';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {
    DownOutlined
} from '@ant-design/icons';
const cx = classNames.bind(styles);

const renderContent = (value, row, index, authModule, authOption) => {
    const obj = {
        children: <span className={cx('txt-clip')} title={value}>{value}</span>,
    };
    if (authModule && authOption) {
        obj.children = <Auth module={authModule} option={authOption}>{(isAuthed) => isAuthed ?
            <React.Fragment>
                <span className={cx('txt-clip')} title={value}>{value}</span>
            </React.Fragment> : PRICE_NO_AUTH_RENDER}</Auth>
    }
    return obj;
};

const footer = (props) => {
    let {priceType, productList, aggregateAmount, discountAmount, taxAllAmount, PRICE_NO_AUTH_RENDER, currencyAggregateAmount, currencyVipFlag} = props;
    let quantityDecimalNum = getCookie("quantityDecimalNum");

    let totalInfo = productList.reduce((prev, next) => {
            return {
                quantity: prev.quantity * 1 + next.quantity * 1,
                amount: prev.amount * 1 + next.amount * 1
            }
        }, {quantity: 0, amount: 0}
    );


    return (
        <div className={"cf"}>
            <div className="tb-footer-label">合计</div>
            <div className="tb-footer-total">
                <span>总数量：</span>
                <b>
                    <React.Fragment>{fixedDecimal(totalInfo.quantity, quantityDecimalNum)}</React.Fragment>
                </b>
                <span className="ml20">总金额：</span>
                <b>
                    <Auth module={priceType} option='show'>{
                        (isAuthed) => isAuthed ?
                            <React.Fragment>{Number(taxAllAmount).toFixed(2)}</React.Fragment> : PRICE_NO_AUTH_RENDER
                    }</Auth>
                </b>元
                <span className="ml20">优惠金额：</span>
                <b>
                    <Auth module={priceType} option='show'>{
                        (isAuthed) => isAuthed ?
                            <React.Fragment>{Number(discountAmount).toFixed(2)}</React.Fragment> : PRICE_NO_AUTH_RENDER
                    }</Auth>
                </b>元
                <span className="ml20">优惠后金额：</span>
                <b>
                    <Auth module={priceType} option='show'>{
                        (isAuthed) => isAuthed ?
                            <React.Fragment>{Number(aggregateAmount).toFixed(2)}</React.Fragment> : PRICE_NO_AUTH_RENDER
                    }</Auth>
                </b>元
                {
                    currencyVipFlag === 'true' && (
                        <>
                            <span className="ml20">本币总金额：</span>
                            <b>
                                <Auth module={priceType} option='show'>{
                                    (isAuthed) => isAuthed ?
                                        <React.Fragment>{Number(currencyAggregateAmount).toFixed(2)}</React.Fragment> : PRICE_NO_AUTH_RENDER
                                }</Auth>
                            </b>元
                        </>
                    )
                }
            </div>
        </div>
    )
};

const mapStateToProps = (state) => ({
    goodsTableConfig: state.getIn(['goodsTableFieldConfigMenu', 'goodsTableConfig'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        emptyFieldConfig: fieldConfigActions.emptyFieldConfig,
        asyncSaveFieldConfig: fieldConfigActions.asyncSaveFieldConfig,
    }, dispatch)
};

/**
 *功能介绍：
 *用于详情页面展示物品列表
 * 涉及模块：
 * 采购、销售、入库、出库详情页面
 * @visibleName ProductList（物品列表）
 * @author jinb
 */
@connect(mapStateToProps, mapDispatchToProps)
export default class ProductList extends Component {
    constructor(props){
        super(props);
        this.state = {
            mainColumns: [],
            columns: []
        };
    }
    static propTypes = {
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
            untaxedPrice: 'untaxedPrice',
            unitPrice: 'unitPrice',
            untaxedAmount: 'untaxedAmount',
            taxRate: 'taxRate',
            tax: 'tax',
            amount: 'amount'
          }
         **/
        dataName: PropTypes.object,
        /**
         *  当前所属模块名称
         **/
        moduleType: PropTypes.string,
        /**
         *  采购拥有采购查看权可以查看
         *  销售拥有销售查看权可查看
         *  入库出库拥有采购查看权可查看，
         *  除了，销售出库是只有拥有销售查看权才可查看
         */
        priceType: PropTypes.string,
        /**
         *   保存配置字段的模块类型，需要和后端确认，如采购'purchase_order'
         **/
        fieldConfigType: PropTypes.string
    };

    static defaultProps = {
        defaultAuthType: 'show',
        PRICE_NO_AUTH_RENDER,
        QUANTITY_MAP: {
            purchase: <IntlTranslation intlKey="components.productList.index.purchaseAmount"/>,
            sale: <IntlTranslation intlKey="components.productList.index.saleAmount"/>,
            inbound: <IntlTranslation intlKey="components.productList.index.inboundAmount"/>,
            outbound: <IntlTranslation intlKey="components.productList.index.outboundAmount"/>,
            outsource: <IntlTranslation intlKey="components.productList.index.purchaseAmount"/>,
        }
    };

    componentWillUnmount() {
        if (this.props.fieldConfigType) {
            //this.props.asyncSaveFieldConfig(this.props.fieldConfigType);
            this.props.emptyFieldConfig();
        }
    }

    components = {
        header: {
            cell: ResizeableTitle,
        },
    };

    onPageInputChange = (page, perPage) => {
        this.fetchData({perPage, page});
    };
    onShowSizeChange = (current, perPage) => {
        console.log(current, perPage, 'current, perPage');
        this.fetchData({perPage, page: 1});
    };

    handleResize = (index, columns) => (e, { size }) => {
        const nextColumns = [...columns];
        nextColumns[index] = {
            ...nextColumns[index],
            width: size.width,
        };
        this.setState({ columns: nextColumns });
    };

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(this.props.batchShelfLeftFlag != nextProps.batchShelfLeftFlag){
            let {columns} = this.state;
            nextProps.batchShelfLeftFlag && (
                columns.push(
                    {
                        title: intl.get("components.productList.index.batchNo"),
                        key: 'batchNo',
                        dataIndex: 'batchNo',
                        align: 'right',
                        width: 100,
                        render: renderContent,
                    },
                    {
                        title: intl.get("components.productList.index.productionDate"),
                        key: 'productionDate',
                        dataIndex: 'productionDate',
                        align: 'right',
                        width: 115,
                        render: renderContent,
                    },
                    {
                        title: intl.get("components.productList.index.expirationDate"),
                        key: 'expirationDate',
                        dataIndex: 'expirationDate',
                        align: 'right',
                        width: 115,
                        render: renderContent,
                    }
                )
            );
            this.setState({mainColumns: columns, columns});
        }
    }

    componentDidMount() {
        this.props.onRef && this.props.onRef(this);
        let {moduleType, priceType, QUANTITY_MAP, batchShelfLeftFlag, currencyVipFlag, billProdDataTags,prodDataTags} = this.props;
        let columns = [
            {
                title: intl.get("components.productList.index.serial"),
                key: 'serial',
                dataIndex: 'serial',
                width: 60,
                render: renderContent
            },
            {
                title: intl.get("components.productList.index.prodCustomNo"),
                key: 'prodCustomNo',
                dataIndex: 'prodCustomNo',
                width: 110,
                sorter: (a, b) => a.prodCustomNo.localeCompare(b.prodCustomNo),
                render: renderContent
            },
            {
                title: intl.get("components.productList.index.prodName"),
                key: 'prodName',
                dataIndex: 'prodName',
                width: 300,
                sorter: (a, b) => a.prodName.localeCompare(b.prodName),
                render: renderContent
            },
            {
                title: intl.get("components.productList.index.descItem"),
                key: 'descItem',
                dataIndex: 'descItem',
                columnName: 'descItem',
                width: 300,
                render: renderContent
            },
            {
                title: intl.get("components.productList.index.firstCatName"),
                key: 'firstCatName',
                dataIndex: 'firstCatName',
                columnName: 'firstCatName',
                width: 300,
                render: renderContent
            },
            {
                title: intl.get("components.productList.index.secondCatName"),
                key: 'secondCatName',
                dataIndex: 'secondCatName',
                columnName: 'secondCatName',
                width: 300,
                render: renderContent
            },
            {
                title: intl.get("components.productList.index.thirdCatName"),
                key: 'thirdCatName',
                dataIndex: 'thirdCatName',
                columnName: 'thirdCatName',
                width: 300,
                render: renderContent
            },
            {
                title: intl.get("components.productList.index.proBarCode"),
                key: 'proBarCode',
                dataIndex: 'proBarCode',
                columnName: 'proBarCode',
                width: 300,
                render: renderContent
            },
            {
                title: '单位',
                key: 'recUnit',
                dataIndex: 'recUnit',
                width: 70,
                render: renderContent
            },
            {
                title: intl.get("components.productList.index.brand"),
                key: 'brand',
                dataIndex: 'brand',
                columnName: 'brand',
                width: 80,
                render: renderContent
            },
            {
                title: intl.get("components.productList.index.produceModel"),
                key: 'produceModel',
                dataIndex: 'produceModel',
                columnName: 'produceModel',
                width: 100,
                render: renderContent
            },
            {
                key: 'propertyValue1',
                dataIndex: 'propertyValue1',
                columnName: 'property_value1',
                width: 100,
                isCustomField: true,
                render: renderContent
            },
            {
                key: 'propertyValue2',
                dataIndex: 'propertyValue2',
                columnName: 'property_value2',
                width: 100,
                isCustomField: true,
                render: renderContent
            },
            {
                key: 'propertyValue3',
                dataIndex: 'propertyValue3',
                columnName: 'property_value3',
                width: 100,
                isCustomField: true,
                render: renderContent
            },
            {
                key: 'propertyValue4',
                dataIndex: 'propertyValue4',
                columnName: 'property_value4',
                width: 100,
                isCustomField: true,
                render: renderContent
            },
            {
                key: 'propertyValue5',
                dataIndex: 'propertyValue5',
                columnName: 'property_value5',
                width: 100,
                isCustomField: true,
                render: renderContent
            }
        ];

        //物品自定义字段
        if(prodDataTags){
            let billTagsColumns = prodDataTags.map(item => {
                let column = {
                    title: item.propName,
                    key: item.mappingName,
                    dataIndex: item.mappingName,
                    width: 100,
                    render: renderContent
                };
                if(!item.required){
                    column.columnName = item.mappingName;
                }
                return column;
            });
            columns.push(...billTagsColumns);
        }


        if(billProdDataTags){  // 自定义字段  注：考虑开发进度较短，暂时这么去写后期有时间优化
            let billTagsColumns = billProdDataTags.map(item => {
                let column = {
                    title: item.propName,
                    key: item.mappingName,
                    dataIndex: item.mappingName,
                    width: 100,
                    render: renderContent
                };
                if(!item.required){
                    column.columnName = item.mappingName;
                }
                return column;
            });
            columns.push(...billTagsColumns);
        } else {
            columns.push(
                {
                    key: 'item_property_value1',
                    dataIndex: 'item_property_value1',
                    columnName: 'item_property_value1',
                    width: 100,
                    isCustomField: true,
                    render: renderContent
                },
                {
                    key: 'item_property_value2',
                    dataIndex: 'item_property_value2',
                    columnName: 'item_property_value2',
                    width: 100,
                    isCustomField: true,
                    render: renderContent
                },
                {
                    key: 'item_property_value3',
                    dataIndex: 'item_property_value3',
                    columnName: 'item_property_value3',
                    width: 100,
                    isCustomField: true,
                    render: renderContent
                },
                {
                    key: 'item_property_value4',
                    dataIndex: 'item_property_value4',
                    columnName: 'item_property_value4',
                    width: 100,
                    isCustomField: true,
                    render: renderContent
                },
                {
                    key: 'item_property_value5',
                    dataIndex: 'item_property_value5',
                    columnName: 'item_property_value5',
                    width: 100,
                    isCustomField: true,
                    render: renderContent
                }
            )
        }

        columns.push(
            {
                title: QUANTITY_MAP[moduleType],
                key: 'recQuantity',
                dataIndex: 'recQuantity',
                align: 'right',
                width: 120,
                sorter: (a, b) => a.recQuantity - b.recQuantity,
                render: renderContent
            },
            {
                title: '单位关系',
                key: 'unitConverter',
                dataIndex: 'unitConverter',
                columnName: 'unitConverter',
                align: 'right',
                width: 120,
                render: renderContent
            },
            {
                title: '基本单位数量',
                key: 'quantity',
                dataIndex: 'quantity',
                columnName: 'quantity',
                align: 'right',
                width: 100,
                sorter: (a, b) => a.quantity - b.quantity,
                render: renderContent
            },
            {
                title: intl.get("components.productList.index.untaxedPrice"),
                key: 'untaxedPrice',
                dataIndex: 'untaxedPrice',
                columnName: 'untaxedPrice',
                align: 'right',
                width: 100,
                sorter: (a, b) => a.untaxedPrice - b.untaxedPrice,
                render: (value, row, index) => renderContent(value, row, index, priceType, 'show')
            },
            {
                title: currencyVipFlag === 'true' ?  '单价' : intl.get("components.productList.index.unitPrice"),
                key: 'unitPrice',
                dataIndex: 'unitPrice',
                align: 'right',
                width: 100,
                sorter: (a, b) => a.unitPrice - b.unitPrice,
                render: (value, row, index) => renderContent(value, row, index, priceType, 'show')
            },
            {
                title: intl.get("components.productList.index.untaxedAmount"),
                key: 'untaxedAmount',
                dataIndex: 'untaxedAmount',
                columnName: 'untaxedAmount',
                align: 'right',
                width: 120,
                sorter: (a, b) => a.untaxedAmount - b.untaxedAmount,
                render: (value, row, index) => renderContent(value, row, index, priceType, 'show')
            },
            {
                title: intl.get("components.productList.index.taxRate"),
                key: 'taxRate',
                dataIndex: 'taxRate',
                columnName: 'taxRate',
                align: 'right',
                width: 70,
                render: (value, row, index) => renderContent(value + '%', row, index, priceType, 'show')
            },
            {
                title: intl.get("components.productList.index.tax"),
                key: 'tax',
                dataIndex: 'tax',
                columnName: 'tax',
                align: 'right',
                width: 100,
                sorter: (a, b) => a.tax - b.tax,
                render: (value, row, index) => renderContent(value, row, index, priceType, 'show')
            },
            {
                title: currencyVipFlag === 'true' ?  '金额' : intl.get("components.productList.index.amount"),
                dataIndex: 'amount',
                key: 'amount',
                align: 'right',
                width: 120,
                sorter: (a, b) => removeCurrency(a.amount)/1 - removeCurrency(b.amount)/1,
                render: (value, row, index) => renderContent(value, row, index, priceType, 'show')
            }
        );

        currencyVipFlag === 'true' && (
            columns.push({
                title: "本币单价",
                key: 'currencyUnitPrice',
                dataIndex: 'currencyUnitPrice',
                columnName: 'currencyUnitPrice',
                align: 'right',
                width: 100,
                sorter: (a, b) => a.currencyUnitPrice - b.currencyUnitPrice,
                render: (value, row, index) => renderContent(value, row, index, priceType, 'show')
            },{
                title: "本币金额",
                dataIndex: 'currencyAmount',
                key: 'currencyAmount',
                columnName: 'currencyAmount',
                align: 'right',
                width: 120,
                sorter: (a, b) => removeCurrency(a.currencyAmount)/1 - removeCurrency(b.currencyAmount)/1,
                render: (value, row, index) => renderContent(value, row, index, priceType, 'show')
            })
        );


        moduleType === 'sale' && (
            columns.splice(-1, 0,
                {
                    title: intl.get("components.productList.index.deliveryDeadlineDate"),
                    dataIndex: 'deliveryDeadlineDate',
                    key: 'deliveryDeadlineDate',
                    width: 115,
                    sorter: (a, b) => new Date(a.deliveryDeadlineDate).getTime() - new Date(b.deliveryDeadlineDate).getTime(),
                    render: renderContent
                },
                {
                    title: intl.get("components.productList.index.outQuantity"),
                    key: 'outQuantity',
                    dataIndex: 'outQuantity',
                    align: 'right',
                    width: 115,
                    render: renderContent,
                },
                {
                    title: "退货数量",
                    key: 'returnNum',
                    dataIndex: 'returnNum',
                    align: 'right',
                    width: 120,
                    render: renderContent,
                },
                {
                    title: "实际出库数量",
                    key: 'actualNum',
                    dataIndex: 'actualNum',
                    align: 'right',
                    width: 120,
                    render: renderContent
                },
                {
                    title: intl.get("components.productList.index.unStockOut"),
                    key: 'unStockOut',
                    dataIndex: 'unStockOut',
                    align: 'right',
                    width: 115,
                    render: renderContent
                },
                {
                    title: "计划生产数量",
                    key: 'producedQuantity',
                    dataIndex: 'producedQuantity',
                    align: 'right',
                    width: 115,
                    render: renderContent
                }
            )
        );

        batchShelfLeftFlag && (
            columns.push(
                {
                    title: intl.get("components.productList.index.batchNo"),
                    key: 'batchNo',
                    dataIndex: 'batchNo',
                    align: 'right',
                    width: 100,
                    render: renderContent,
                },
                {
                    title: intl.get("components.productList.index.productionDate"),
                    key: 'productionDate',
                    dataIndex: 'productionDate',
                    align: 'right',
                    width: 115,
                    render: renderContent,
                },
                {
                    title: intl.get("components.productList.index.expirationDate"),
                    key: 'expirationDate',
                    dataIndex: 'expirationDate',
                    align: 'right',
                    width: 115,
                    render: renderContent,
                }
            )
        );
        this.setState({mainColumns: columns, columns});
    }

    render() {
        /**
         *  aggregateAmount 订单优惠后总金额
         *  discountAmount 订单优惠金额
         *  taxAllAmount  订单含税总金额
         * */
        let {productList} = this.props;
        let {columns, mainColumns} = this.state;
        console.log(columns,'columns');
        //处理字段配置
        const configFields = this.props.goodsTableConfig.get('data');

        let visibleColumns = configFields && mainColumns.filter(column => {
            let isExistCustomField = false;
            //如果不是可配置的字段则为真(显示出来) 否则  是可配置字段&&visibleFlag=1  && （是自定义字段 && 后端返回存在的自定义字段  || 不是自定义字段）
            return configFields.every(field => {
                let flag = false;
                if(field.get('columnName') !== column.columnName){
                    flag = true;
                }else if(field.get('columnName') === column.columnName && field.get('visibleFlag') === 1){
                    //自定义字段title从后端取
                    column.isCustomField ? column.title = field.get('label'):void 0;
                    flag = true;
                    isExistCustomField = true;
                }
                return flag;
            }) && (!column.isCustomField || column.isCustomField && isExistCustomField);
        });

        for(let i = 0; i< visibleColumns.length; i++){
            for(let j = 0; j < columns.length; j++){
                if(visibleColumns[i].dataIndex === columns[j].dataIndex){
                    visibleColumns[i].width = columns[j].width;
                    break;
                }
            }
        }

        let tableWidth = visibleColumns && visibleColumns.reduce(function(width, item) {
            return width + item.width;
        }, 0);

        visibleColumns = visibleColumns && visibleColumns.map((col, index) => ({
            ...col,
            onHeaderCell: column => ({
                width: column.width,
                onResize: this.handleResize(index, visibleColumns)
            }),
        }));

        return (
            <div className="detail-table-wrap">
                <Table columns={visibleColumns}
                       dataSource={Array.from(productList)}
                       bordered
                       pagination={false}
                       components={this.components}
                       footer={()=>footer(this.props)}
                       scroll={{x: tableWidth}}/>
            </div>
        )
    }
}
