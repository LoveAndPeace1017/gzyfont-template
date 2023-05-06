import React, {Component} from 'react';
import intl from 'react-intl-universal';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
import {Table} from 'antd';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import {Auth} from 'utils/authComponent';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import {actions as fieldConfigActions} from 'components/business/goodsTableFieldConfigMenu';
import {ResizeableTitle} from 'components/business/resizeableTitle';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
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

    let totalInfo = productList.reduce((prev, next) => {
            return {
                quantity: prev.quantity + next.quantity,  // 总数量
                amount: prev.amount * 1 + next.amount * 1,  // 原料成本
                processCost: (prev.allocatedAmount-prev.amount) * 1 + (next.allocatedAmount-next.amount) * 1,  // 加工费
                allocatedAmount: prev.allocatedAmount * 1 + next.allocatedAmount * 1  // 总金额
            }
        }, {quantity: 0, amount: 0, processCost: 0, allocatedAmount: 0}
    );

    return (
        <div className={"cf"}>
            <div className="tb-footer-label">{intl.get("components.productList.index.totalPrice")}</div>
            <div className="tb-footer-total">
                <span>总数量：</span>
                <b>
                    <React.Fragment>{fixedDecimal(totalInfo.quantity, quantityDecimalNum)}</React.Fragment>
                </b>
                <span className="ml20">原料成本：</span>
                <b>{Number(totalInfo.amount).toFixed(2)}</b>元

                {
                    moduleType==='preform' && (
                        <React.Fragment>
                            <span className="ml20">加工费：</span>
                            <b>{Number(totalInfo.processCost).toFixed(2)}</b>元
                            <span className="ml20">总金额：</span>
                            <b>{Number(totalInfo.allocatedAmount).toFixed(2)}</b>元
                        </React.Fragment>
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
 * @visibleName subcontractProductList（委外加工物品列表）
 * @author jinb
 */
@connect(mapStateToProps, mapDispatchToProps)
export default class SubcontractProductList extends Component {
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
            prodNo: prodNo,
            prodName: prodName,
            descItem: descItem,
            brand: brand,
            produceModel: produceModel,
            batchNo: batchNo,
            productionDate: productionDate,
            expirationDate: expirationDate,
            quantity: quantity,
            unitCost: unitCost,
            unit: unit,
            amount: amount,
            allocatedPrice: allocatedPrice,
            allocatedAmount: allocatedPrice,
        }
         **/
        dataName: PropTypes.object,
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
        if (this.props.fieldConfigType) {
            this.props.asyncSaveFieldConfig(this.props.fieldConfigType);
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

    componentDidMount() {
        this.props.onRef && this.props.onRef(this);
        let {moduleType, batchShelfLifeVipFlag} = this.props;
        // 物品编号 物品名称 规格型号 品牌 制造商型号 批次号 生产日期 到期日期 入库数量 单位成本 金额 分摊后单价 分摊后金额 总数量 原料成本 加工费 总金额
        let columns = [
            {
                title: "序号",
                key: 'serial',
                dataIndex: 'serial',
                width: 60,
                render: renderContent
            },
            {
                title: "物品编号",
                key: 'prodNo',
                dataIndex: 'prodNo',
                width: 110,
                sorter: (a, b) => a.prodNo.localeCompare(b.prodNo),
                render: renderContent
            },
            {
                title: "物品名称",
                key: 'prodName',
                dataIndex: 'prodName',
                width: 300,
                sorter: (a, b) => a.prodName.localeCompare(b.prodName),
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
                title: "单位",
                key: 'unit',
                dataIndex: 'unit',
                columnName: 'unit',
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
            },
        ];

        batchShelfLifeVipFlag && (columns = columns.concat([
            {
                title: "批次号",
                key: 'batchNo',
                dataIndex: 'batchNo',
                align: 'right',
                width: 100,
                render: renderContent,
            },
            {
                title: "生产日期",
                key: 'productionDate',
                dataIndex: 'productionDate',
                align: 'right',
                width: 115,
                render: renderContent,
            },
            {
                title: "到期日期",
                key: 'expirationDate',
                dataIndex: 'expirationDate',
                align: 'right',
                width: 115,
                render: renderContent,
        }]));

        columns = columns.concat([
            {
                title: moduleType==='preform'?"入库数量":"消耗数量",
                key: 'quantity',
                dataIndex: 'quantity',
                width: 70,
                sorter: (a, b) => a.quantity - b.quantity,
                render: renderContent
            },
            {
                title: "单位成本",
                key: 'unitCost',
                dataIndex: 'unitCost',
                width: 100,
                sorter: (a, b) => a.unitCost - b.unitCost,
                render: renderContent
            },
            {
                title: "金额",
                key: 'amount',
                dataIndex: 'amount',
                width: 100,
                sorter: (a, b) => a.amount - b.amount,
                render: renderContent
            }
        ]);

        moduleType==='preform' && (columns = columns.concat([
            {
                title: "分摊后单价",
                key: 'allocatedPrice',
                dataIndex: 'allocatedPrice',
                width: 100,
                sorter: (a, b) => a.allocatedPrice - b.allocatedPrice,
                render: renderContent
            },

            {
                title: "分摊后金额",
                key: 'allocatedAmount',
                dataIndex: 'allocatedAmount',
                width: 100,
                sorter: (a, b) => a.allocatedAmount - b.allocatedAmount,
                render: renderContent
            }]));

        this.setState({mainColumns: columns, columns});
    }

    render() {
        let {productList} = this.props;
        let {columns, mainColumns} = this.state;
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
