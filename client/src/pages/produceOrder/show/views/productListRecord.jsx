import React, {Component} from 'react';
import {Link} from "react-router-dom";
import intl from 'react-intl-universal';
import PropTypes from 'prop-types';
import moment from "moment/moment";
import {Table} from 'antd';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import {Auth} from 'utils/authComponent';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import {actions as fieldConfigActions} from 'components/business/goodsTableFieldConfigMenu';
import {ResizeableTitle} from 'components/business/resizeableTitle';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
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
    let {moduleType, productList} = props;
    let quantityDecimalNum = getCookie("quantityDecimalNum");

    let totalInfo = {};
    if(moduleType === 'finish'){
        totalInfo = productList.reduce((prev, next) => {
                return {
                    quantity: prev.quantity * 1 + next.quantity * 1,  // 计划总数量
                    finishCount: prev.finishCount * 1 + next.finishCount * 1,  // 生产总数量
                    enterCount: prev.enterCount * 1 + next.enterCount * 1   // 入库总数量
                }
            }, {quantity: 0, finishCount: 0, enterCount: 0}
        );
    }
    if(moduleType === 'consume'){
        totalInfo = productList.reduce((prev, next) => {
                return {
                    quantity: prev.quantity * 1 + next.quantity *1,  // 计划总数量
                    totalReceiveCount: prev.totalReceiveCount * 1 + next.totalReceiveCount * 1  // 累计领用总量
                }
            }, {quantity: 0, totalReceiveCount: 0}
        );
    }

    return (
        <div className={"cf"}>
            <div className="tb-footer-label">{intl.get("components.productList.index.totalPrice")}</div>
            {
                moduleType === 'finish' && (
                    <div className="tb-footer-total">
                        <span>计划总数量：</span>
                        <b>{fixedDecimal(totalInfo.quantity, quantityDecimalNum)}</b>
                        <span className="ml20">生产总数量：</span>
                        <b>{fixedDecimal(totalInfo.finishCount, quantityDecimalNum)}</b>
                        <span className="ml20">入库总数量：</span>
                        <b>{fixedDecimal(totalInfo.enterCount, quantityDecimalNum)}</b>
                    </div>
                )
            }
            {
                moduleType === 'consume' && (
                    <div className="tb-footer-total">
                        <span>计划总数量：</span>
                        <b>{fixedDecimal(totalInfo.quantity, quantityDecimalNum)}</b>
                        <span className="ml20">累计领用总量：</span>
                        <b>{fixedDecimal(totalInfo.totalReceiveCount, quantityDecimalNum)}</b>
                    </div>
                )
            }
        </div>
    )
};

const mapStateToProps = (state) => ({
    goodsTableConfig: state.getIn(['goodsTableFieldConfigMenu', 'goodsTableConfig'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        emptyFieldConfig: fieldConfigActions.emptyFieldConfig,
        asyncSaveFieldConfigForProduce: fieldConfigActions.asyncSaveFieldConfigForProduce,
    }, dispatch)
};

/**
 *功能介绍：
 * 涉及模块：
 * @visibleName ProductList
 * @author jinb
 */
@connect(mapStateToProps, mapDispatchToProps)
export default class ProductList extends Component {
    constructor(props){
        super(props);
        this.state = {
            mainColumns: [],
            columns: [],
            selectedRowKeys: [],
            selectedRows: [],
        };
    }
    static propTypes = {
        /**
         *  当前所属模块名称
         **/
        moduleType: PropTypes.string,
        /**
         *   保存配置字段的模块类型，需要和后端确认，如采购'purchase_order'
         **/
        fieldConfigType: PropTypes.string
    };

    static defaultProps = {
        defaultAuthType: 'show',
        PRICE_NO_AUTH_RENDER,
    };

    componentWillUnmount() {
        this.props.asyncSaveFieldConfigForProduce();
        this.props.emptyFieldConfig();
    }

    components = {
        header: {
            cell: ResizeableTitle,
        },
    };

    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({selectedRowKeys, selectedRows});
    };

    handleResize = (index, columns) => (e, { size }) => {
        const nextColumns = [...columns];
        nextColumns[index] = {
            ...nextColumns[index],
            width: size.width,
        };
        this.setState({ columns: nextColumns });
    };

    componentDidMount() {
        this.props.getRef && this.props.getRef(this);
        let {moduleType, prodDataTags} = this.props;
        let columns = [
            {
                title: "序号",
                key: 'serial',
                dataIndex: 'serial',
                width: 60,
                fixed: true,
                render: renderContent
            },
            {
                title: "物品编号",
                key: 'prodCustomNo',
                dataIndex: 'prodCustomNo',
                columnName: 'prodCustomNo',
                width: 110,
                fixed: true,
                sorter: (a, b) => a.prodCustomNo.localeCompare(b.prodCustomNo),
                render: renderContent
            },
            {
                title: "物品名称",
                key: 'prodName',
                dataIndex: 'prodName',
                columnName: 'prodName',
                width: 300,
                fixed: true,
                sorter: (a, b) => a.prodName.localeCompare(b.prodName),
                render: renderContent
            },
            {
                title: "单位",
                key: 'unit',
                dataIndex: 'unit',
                columnName: 'unit',
                width: 110,
                render: renderContent
            },
            {
                title: "规格型号",
                key: 'descItem',
                dataIndex: 'descItem',
                columnName: 'descItem',
                width: 300,
                render: renderContent
            },
            {
                title: "品牌",
                key: 'brand',
                dataIndex: 'brand',
                columnName: 'brand',
                width: 80,
                render: renderContent
            },
            {
                title: "制造商型号",
                key: 'produceModel',
                dataIndex: 'produceModel',
                columnName: 'produceModel',
                width: 100,
                render: renderContent
            }
        ];

        if(prodDataTags){
            let prodTagsColumns = prodDataTags.map(item => {
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
            columns.push(...prodTagsColumns);
        }


        // 生产成品 saleQuantity
        moduleType==='finish' && (columns = columns.concat([
            {
                title: "BOM",
                key: 'bomCode',
                dataIndex: 'bomCode',
                columnName: 'bomcode',
                align: 'left',
                width: 100,
                render: renderContent,
            }, {
                title: "销售单号",
                key: 'saleDisplayBillNo',
                dataIndex: 'saleDisplayBillNo',
                columnName: 'saleDisplayBillNo',
                width: 150,
                render: (saleDisplayBillNo, data) => (
                    <span className={cx("txt-clip")} title={saleDisplayBillNo}>
                        <Link to={`/sale/show/${data.saleBillNo}`}>{saleDisplayBillNo}</Link>
                    </span>
                ),
            }, {
                title: "客户订单号",
                key: 'saleCustomerOrderNo',
                dataIndex: 'saleCustomerOrderNo',
                columnName: 'customerOrderNo',
                width: 150
            },{
                title: "销售数量",
                key: 'saleQuantity',
                dataIndex: 'saleQuantity',
                columnName: 'saleQuantity',
                align: 'right',
                width: 100,
                render: renderContent,
            },{
                title: "交付日期",
                key: 'saleDeliveryDeadlineDate',
                dataIndex: 'saleDeliveryDeadlineDate',
                columnName: 'deliveryDeadlineDate',
                width: 100,
                render: (saleDeliveryDeadlineDate)=>{
                    return (<span>{saleDeliveryDeadlineDate ? moment(saleDeliveryDeadlineDate).format('YYYY-MM-DD') : null}</span>)
                }
            }, {
                title: "计划生产数量",
                key: 'quantity',
                dataIndex: 'quantity',
                align: 'right',
                width: 100,
                sorter: (a, b) => a.quantity - b.quantity,
                render: renderContent,
            }, {
                title: "投产数量",
                key: 'expectCount',
                dataIndex: 'expectCount',
                columnName: 'expectCount',
                align: 'right',
                width: 100,
                sorter: (a, b) => a.expectCount - b.expectCount,
                render: renderContent,
            },{
                title: "已生产数量",
                key: 'finishCount',
                dataIndex: 'finishCount',
                columnName: 'finishCount',
                align: 'right',
                width: 100,
                sorter: (a, b) => a.finishCount - b.finishCount,
                render: renderContent,
            },{
                title: "已入库数量",
                key: 'enterCount',
                dataIndex: 'enterCount',
                columnName: 'enterCount',
                align: 'right',
                width: 100,
                sorter: (a, b) => a.enterCount - b.enterCount,
                render: renderContent,
            },{
                title: "待入库数量",
                key: 'unEnterCount',
                dataIndex: 'unEnterCount',
                columnName: 'unEnterCount',
                align: 'right',
                width: 100,
                sorter: (a, b) => a.unEnterCount - b.unEnterCount,
                render: renderContent,
            }])
        );
        // 消耗原料
        moduleType==='consume' && (columns = columns.concat([
            {
                title: "仓库",
                key: 'warehouseName',
                dataIndex: 'warehouseName',
                columnName: 'warehouseName',
                width: 100,
                render: renderContent,
            },{
                title: "供应商",
                key: 'supplierName',
                dataIndex: 'supplierName',
                columnName: 'supplierName',
                width: 100,
                render: renderContent,
            },{
                title: "单位用量",
                key: 'unitConsump',
                dataIndex: 'unitConsump',
                columnName: 'unitConsump',
                align: 'right',
                width: 100,
                render: renderContent,
            }, {
                title: "计划消耗数量",
                key: 'quantity',
                dataIndex: 'quantity',
                align: 'right',
                width: 100,
                sorter: (a, b) => a.quantity - b.quantity,
                render: renderContent,
            }, {
                title: "领用数量",
                key: 'receiveCount',
                dataIndex: 'receiveCount',
                columnName: 'receiveCount',
                align: 'right',
                width: 100,
                sorter: (a, b) => a.receiveCount - b.receiveCount,
                render: renderContent,
            }, {
                title: "退料数量",
                key: 'rejectCount',
                dataIndex: 'rejectCount',
                columnName: 'rejectCount',
                align: 'right',
                width: 100,
                sorter: (a, b) => a.rejectCount - b.rejectCount,
                render: renderContent,
            },{
                title: "累计领用量",
                key: 'totalReceiveCount',
                dataIndex: 'totalReceiveCount',
                columnName: 'totalReceiveCount',
                align: 'right',
                width: 100,
                sorter: (a, b) => a.totalReceiveCount - b.totalReceiveCount,
                render: renderContent,
            }])
        );
        columns = columns.concat([
            {
                title: "备注",
                dataIndex: 'remarks',
                key: 'remarks',
                columnName: 'remarks',
                width: 150,
                render: renderContent
            }
        ]);
        this.setState({mainColumns: columns, columns});
    }

    render() {
        let {productList, moduleType} = this.props;
        let {columns, mainColumns} = this.state;
        //处理字段配置
        let configFields;
        if(moduleType==='finish') configFields = this.props.goodsTableConfig.get('produceData');
        if(moduleType==='consume') configFields = this.props.goodsTableConfig.get('materialData');

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

        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onSelectChange,
        };

        return (
            <div className="detail-table-wrap">
                <Table columns={visibleColumns}
                       dataSource={Array.from(productList)}
                       bordered
                       pagination={false}
                       rowSelection={rowSelection}
                       components={this.components}
                       footer={()=>footer(this.props)}
                       scroll={{x: tableWidth}}/>
            </div>
        )
    }
}
