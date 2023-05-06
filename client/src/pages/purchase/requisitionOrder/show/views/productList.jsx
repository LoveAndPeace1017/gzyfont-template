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
import {formatCurrency, removeCurrency} from 'utils/format';
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
    let {productList} = props;
    let quantityDecimalNum = getCookie("quantityDecimalNum");
    let totalInfo = {};
    totalInfo = productList.reduce((prev, next) => {
            return {
                quantity: prev.quantity * 1 + next.quantity * 1,
                amount: prev.amount * 1 + next.amount * 1,
            }
        }, {quantity: 0, amount: 0}
    );

    return (
        <div className={"cf"}>
            <div className="tb-footer-total">
                <span>请购总数量：</span>
                <b>{fixedDecimal(totalInfo.quantity, quantityDecimalNum)}</b>
                <span className="ml20">预计请购总金额：</span>
                <b>{formatCurrency(fixedDecimal(totalInfo.amount, quantityDecimalNum))}</b>
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
        asyncSaveFieldConfigForProduce: fieldConfigActions.asyncSaveFieldConfigForProduce,
    }, dispatch)
};



@connect(mapStateToProps, mapDispatchToProps)
export default class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns:[],
            mainColumns:[]
        }
    }

    static defaultProps = {
        defaultAuthType: 'show',
        PRICE_NO_AUTH_RENDER,
    };

    componentWillUnmount() {
        this.props.asyncSaveFieldConfigForProduce();
        this.props.emptyFieldConfig();
    }

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

        let { prodDataTags } = this.props;

        let columns = [
            {
                title: "物品编号",
                dataIndex: 'prodCustomNo',
                align: 'left',
                width: 150,
                fixed: true,
                className: 'ant-table-selection-column',
                render: renderContent
            },
            {
                title: "物品名称",
                dataIndex: 'prodName',
                align: 'left',
                width: 200,
                fixed: true,
                className: 'ant-table-selection-column',
                render: renderContent
            },
            {
                title: '一级类目',
                dataIndex: 'firstCatName',
                key: 'firstCatName',
                columnName: 'firstCatName',
                width: 100,
                readOnly: true,
                render: renderContent
            },
            {
                title: '二级类目',
                dataIndex: 'secondCatName',
                key: 'secondCatName',
                columnName: 'secondCatName',
                width: 100,
                readOnly: true,
                render: renderContent
            },
            {
                title: '三级类目',
                dataIndex: 'thirdCatName',
                key: 'thirdCatName',
                columnName: 'thirdCatName',
                width: 100,
                readOnly: true,
                render: renderContent
            },
            {
                title: "规格型号",
                dataIndex: 'descItem',
                columnName: 'descItem',
                align: 'left',
                width: 300,
                className: 'ant-table-selection-column',
                render: renderContent
            },
            {
                title: "品牌",
                dataIndex: 'brand',
                columnName: 'brand',
                align: 'left',
                width: 150,
                className: 'ant-table-selection-column',
                render: renderContent
            },
            {
                title: "制造商型号",
                dataIndex: 'produceModel',
                columnName: 'produceModel',
                align: 'left',
                width: 150,
                className: 'ant-table-selection-column',
                render: renderContent
            },
            {
                title: "单位",
                dataIndex: 'unit',
                align: 'left',
                width: 150,
                className: 'ant-table-selection-column',
                render: renderContent
            },
            {
                title: "请购数量",
                dataIndex: 'requisitionQuantity',
                columnName: 'requisitionQuantity',
                align: 'left',
                width: 100,
                className: 'ant-table-selection-column',
                render: renderContent
            },
            {
                title: "已采购数量",
                dataIndex: 'purchaseQuantity',
                columnName: 'purchaseQuantity',
                align: 'left',
                width: 100,
                className: 'ant-table-selection-column',
                render: renderContent
            },
            {
                title: "待采购数量",
                dataIndex: 'toPurchaseQuantity',
                columnName: 'toPurchaseQuantity',
                align: 'left',
                width: 100,
                className: 'ant-table-selection-column',
                render: renderContent
            },
            {
                title: "已入库数量",
                dataIndex: 'enterQuantity',
                columnName: 'enterQuantity',
                align: 'left',
                width: 100,
                className: 'ant-table-selection-column',
                render: renderContent
            },
            {
                title: "退货数量",
                dataIndex: 'returnNum',
                columnName: 'returnNum',
                align: 'left',
                width: 100,
                className: 'ant-table-selection-column',
                render: renderContent
            },
            {
                title: "预计单价",
                dataIndex: 'unitPrice',
                columnName: 'unitPrice',
                align: 'left',
                width: 100,
                className: 'ant-table-selection-column',
                render: renderContent
            },
            {
                title: "预计金额",
                dataIndex: 'amount',
                columnName: 'amount',
                align: 'left',
                width: 80,
                className: 'ant-table-selection-column',
                render: renderContent
            },
            {
                title: "期望交付日期",
                dataIndex: 'deliveryDeadlineDate',
                columnName: 'deliveryDeadlineDate',
                align: 'left',
                width: 180,
                className: 'ant-table-selection-column',
                render: renderContent
            },
            {
                title: "用途",
                dataIndex: 'purpose',
                columnName: 'purpose',
                align: 'left',
                width: 180,
                className: 'ant-table-selection-column',
                render: renderContent
            },
            {
                title: "备注",
                dataIndex: 'remarks',
                columnName: 'remarks',
                align: 'left',
                width: 180,
                className: 'ant-table-selection-column',
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

        this.setState({
            columns,mainColumns:columns
        })
    }

    components = {
        header: {
            cell: ResizeableTitle,
        },
    };

    handleResize = index => (e, { size }) => {
        this.setState(({ columns }) => {
            const nextColumns = [...columns];
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width,
            };
            return { columns: nextColumns };
        });
    };

    render() {
        const {productList} = this.props;
        let {columns, mainColumns} = this.state;
        //处理字段配置
        let configFields;
        configFields = this.props.goodsTableConfig.get('data');

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
