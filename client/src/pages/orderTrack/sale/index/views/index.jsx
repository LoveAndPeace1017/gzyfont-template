import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {
    Modal, Menu, Dropdown, message, Spin,
} from 'antd';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");

import {Link} from 'react-router-dom';

import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import Tooltip from 'components/widgets/tooltip';
import Icon from 'components/widgets/icon';
import BatchPopTitle from 'components/business/batchPopTitle';
import FooterFixedBar from  'components/layout/footerFixedBar';
import {APPROVE_COLOR_GROUP, backDisabledStatus} from 'components/business/approve';
import {formatCurrency} from 'utils/format';
import {Auth} from 'utils/authComponent';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import {getUrlParamValue} from 'utils/urlParam';
import {getCookie} from 'utils/cookie';
import {
    DownOutlined
} from '@ant-design/icons';
import {
    asyncFetchTraceSaleList,
    asyncUpdateConfig,
    asyncBatchUpdateConfig
} from '../actions'

import {
    WareOutBatchEdit,
    FinanceSaleInvoiceBatchEdit,
    FinanceIncomeBatchEdit
} from 'components/business/batchEditPop';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import Crumb from 'components/business/crumb';
import PageTurnLink from 'components/business/pageTurnLink';
import {parse} from "url";
import {CopyMenu, ModifyMenu, DeleteMenu} from "components/business/authMenu";
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import {Amount} from 'components/business/amount';
import ListPage from  'components/layout/listPage'
const cx = classNames.bind(styles);

export class Index extends ListPage {
    constructor(props) {
        super(props);
        let params = {}
        this.state = {
            ...params,
            listToolBarVisible: true,
            operateModalVisiable: false,
            wareOutPopVisible: false,
            saleInvoicePopVisible: false,
            incomePopVisible: false,
            mergeIncome: false,
            mergeSaleInvoice: false,
            operateType: '',
            billNo: '',
            customerName: '',
        };
    }

    fetchListData = (params,callback)=>{
        const {saleList} = this.props;
        let tags = saleList.getIn(['data', 'tags']);
        params = this.dealCustomField(params,tags && tags.toJS());
        this.props.asyncFetchTraceSaleList(params, callback);
    };


    componentDidMount() {
        let {condition} = this.state;
        //初始化列表数据
        this.fetchListData(condition);
    }


    batchUpdateConfig = (callback) => {
        const {saleList} = this.props;
        let tableConfigList = saleList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let moduleType = {
            search:'traceSaleOrder_search_list',
            table:'traceSaleOrder_list'
        };

        this.batchUpdateConfigSuper(null,tableConfigList,null, moduleType,callback,true);
    };

    render() {
        const {saleList} = this.props;
        let dataSource = saleList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let filterConfigList = saleList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = saleList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        const pageAmount = saleList.getIn(['data', 'pageCurrencyAmount']);
        const totalAmount = saleList.getIn(['data', 'totalCurrencyAmount']);

        let paginationInfo = saleList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};


        let tempColumns = [];
        tableConfigList.forEach((item) => {
            if (item.visibleFlag) {
                var obj = {
                    title: item.label,
                    dataIndex: item.fieldName,
                    key: item.fieldName,
                    width: item.width
                };
                if (item.fixed) {
                    obj.fixed = item.fixed;
                }
                if (item.fieldName === "displayBillNo") {
                    obj.render = (displayBillNo, data) => {
                        return (
                            <React.Fragment>
                                <span className={cx("txt-clip")} title={displayBillNo}>
                                    <PageTurnLink data={dataSource} type={"sale"} linkdata={"billNo"} showdata={"displayBillNo"} current={data}/>
                                </span>
                            </React.Fragment>
                        )
                    }
                }else if (item.fieldName === "interchangeState") {
                    obj.align = "center";
                    obj.render = (interchangeState, data) => (
                         <Tooltip
                             type={"info"}
                             title={
                                 data.interchangeStatus == 1 ? intl.get("sale.index.index.interchangeStatus_notReceive") :
                                     data.interchangeStatus == 2 ? intl.get("sale.index.index.interchangeStatus_receive") :
                                         data.interchangeStatus == 3 ? intl.get("sale.index.index.interchangeStatus_cancel") : ''
                             }
                         >
                             {
                                 data.interchangeStatus == 1 ? <Icon type="icon-state-unfinished"  className="icon-state-unfinish"/> :
                                     data.interchangeStatus == 2 ? <Icon type="icon-state-finished"  className="icon-state-finished"/> :
                                         data.interchangeStatus == 3 ? <Icon type="icon-state-finished" className="icon-state-cancel"/> : ''
                             }
                         </Tooltip>
                    )
                } else if (item.fieldName === "state") {
                    obj.align = "center";
                    obj.render = (state) => (
                        <Tooltip
                            type={"info"}
                            title={state == 0 ? intl.get("sale.index.index.outboundStatus_notFinish"): intl.get("sale.index.index.outboundStatus_finish")}
                        >
                            {
                                state == 0 ?  <Icon type="icon-state-unfinished"  className="icon-state-unfinish"/> :
                                    <Icon type="icon-state-finished"  className="icon-state-finished"/>
                            }
                        </Tooltip>
                    )
                } else if (item.fieldName === "invoiceState") {
                    obj.align = "center";
                    obj.render = (invoiceState) => (
                        <Tooltip
                            type={"info"}
                            title={invoiceState == 0 ? intl.get("sale.show.index.invoiceState_notFinish"): intl.get("sale.show.index.invoiceState_finish")}
                        >
                            {
                                invoiceState == 0 ?  <Icon type="icon-state-unfinished"  className="icon-state-unfinish"/> :
                                    <Icon type="icon-state-finished"  className="icon-state-finished"/>
                            }
                        </Tooltip>
                    )
                } else if ( item.fieldName ==="paymentState") {
                    obj.align = "center";
                    obj.render = (paymentState, data) => (
                        <Tooltip
                            type={"info"}
                            title={data.payState == 0 ? intl.get("sale.show.index.payState_notFinish") : intl.get("sale.show.index.payState_finish")}
                        >
                            {
                                data.payState == 0 ?
                                    <Icon type="icon-state-unfinished" className="icon-state-unfinish"/> :
                                    <Icon type="icon-state-finished" className="icon-state-finished"/>
                            }
                        </Tooltip>
                    )
                }
                else if (item.fieldName === "approveStatus") {
                        obj.align = "center";
                        obj.render = (approveStatus) => (
                            <span style={{color: APPROVE_COLOR_GROUP[approveStatus].color}}>{APPROVE_COLOR_GROUP[approveStatus].label}</span>
                        )
                } else if (item.fieldName === "saleOrderDate" ) {
                    obj.render = (date) => (
                        <span className="txt-clip">
                            {date ? moment(date).format('YYYY-MM-DD') : null}
         			    </span>
                    );
                    obj.sorter = (prev, next) => prev.saleOrderDate - next.saleOrderDate;

                }else if (item.fieldName === "deliveryDeadlineDate") {
                    obj.render = (date) => (
                        <span className="txt-clip">
                            {date ? moment(date).format('YYYY-MM-DD') : null}
         			    </span>
                    );

                    obj.sorter = (prev, next) => prev.deliveryDeadlineDate - next.deliveryDeadlineDate;

                }else if (item.fieldName === "aggregateAmount" || item.fieldName === "currencyAggregateAmount") {
                    obj.render = (text) => (
                        <span className="txt-clip" title={formatCurrency(text)}>
                             <strong>{formatCurrency(text)}</strong>
                        </span>
                    );
                    obj.sorter = (prev, next) => prev.aggregateAmount - next.aggregateAmount;
                } else if (item.fieldName === "taxAllAmount" ) {
                    obj.render = (taxAllAmount) => (
                        <span className="txt-clip" title={formatCurrency(taxAllAmount)}>
                            <strong>{formatCurrency(taxAllAmount)}</strong>
                        </span>
                    );
                    obj.sorter = (prev, next) => prev.taxAllAmount - next.taxAllAmount;
                } else if (item.fieldName === "discountAmount" ) {
                    obj.render = (discountAmount) => (
                        <span className="txt-clip" title={formatCurrency(discountAmount)}>
                               <strong>{formatCurrency(discountAmount)}</strong>
                        </span>
                    );

                    obj.sorter = (prev, next) => prev.discountAmount - next.discountAmount;
                } else if (item.fieldName === "payAmount") {
                    obj.render = (payAmount, data) => (
                        <span className="txt-clip" title={formatCurrency(payAmount)}>
                               {formatCurrency(payAmount)}
                        </span>
                    );
                    obj.sorter = (prev, next) => prev.payAmount - next.payAmount;
                }else if (item.fieldName === "invoiceAmount") {
                    obj.render = (invoiceAmount, data) => (
                        <span className="txt-clip" title={formatCurrency(invoiceAmount)}>
                                {formatCurrency(invoiceAmount)}
                         </span>

                    );
                    obj.sorter = (prev, next) => prev.invoiceAmount - next.invoiceAmount;

                }else if (item.fieldName === "deliveryAddress") {
                    obj.render = (deliveryAddress, data) => {
                        const fullAddr = data.deliveryAddress?
                            data.deliveryProvinceText + data.deliveryCityText + deliveryAddress:'';
                        return (
                            <span className="txt-clip" title={fullAddr}>
                                {fullAddr}
                            </span>
                        )
                    };
                }else if (item.fieldName === "remarks") {
                    obj.render = (remarks) => (<span className="txt-clip" title={remarks}>{remarks}</span>)
                }else if (item.fieldName === "prodAbstract") {
                    obj.render = (prodAbstract, data) => (
                        <Dropdown className={'list-sale-prodAbstract'}
                            overlay={() => (
                                <Menu className={cx('abstract-drop-menu') + ' list-prodAbstract'}>
                                    <Menu.Item>
                                        <div className={cx("abstract-drop")}>
                                            <div className={cx("tit")}>{intl.get("sale.index.index.prod_abstract")}</div>
                                            <ul>
                                                {
                                                    data.prodList && data.prodList.map((item, index) =>
                                                        <li key={index}>
                                                            <span className={cx('prod-tit')}>{item.prodName}</span>
                                                            <span className={cx('prod-desc')}>{item.descItem}</span>
                                                            <span className={cx('amount')}>x{item.quantity}</span>
                                                        </li>
                                                    )
                                                }
                                            </ul>
                                        </div>
                                    </Menu.Item>

                                </Menu>
                            )}>
                             <span>
                                <span className={cx("txt-desc-no") + ' txt-clip'} title={prodAbstract}>{prodAbstract}</span>
                                <DownOutlined className="ml5"/>
                            </span>
                        </Dropdown>
                    )
                } else{
                    obj.render = (text) => (<span className="txt-clip" title={text}>{text}</span>)
                }
                tempColumns.push(obj);
            }
        });

        const filterDataSource = {
            selectComponents: [],
            datePickerComponents: [],
            customComponents: [],
            depEmployeeComponents: [],
            settlementComponents: [],
            intervalComponents: [],
            inputComponents: [],
            currencyComponents: [],
            numberPickerComponents: []
        };
        filterConfigList.forEach((item) => {
            item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
        });

        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            title: "销售"
                        },
                        {
                            title: "销售列表"
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                                              onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              noNeedDefault={true}
                                              type={'saleOrder'}
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className={"data-wrap cf"}>
                        <div className={"tb-wrap"}>
                            <ListTable
                                columns={tempColumns}
                                dataSource={dataSource}
                                loading={this.props.saleList.get('isFetching')}
                                getRef={this.getRef}
                            />
                            <FooterFixedBar className="list-footer cf">
                                <Amount module="salePrice" pageAmount={pageAmount} totalAmount={totalAmount}/>
                                <Pagination {...paginationInfo}
                                            onChange={this.onPageInputChange}
                                            onShowSizeChange={this.onShowSizeChange}
                                />
                            </FooterFixedBar>
                        </div>
                    </div>

                </div>

            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    saleList: state.getIn(['traceSaleIndex', 'saleTraceList']),
    initListCondition: state.getIn(['commonInfo', 'initListCondition'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchTraceSaleList,
        asyncUpdateConfig,
        asyncBatchUpdateConfig
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)