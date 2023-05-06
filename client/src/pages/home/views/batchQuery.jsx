import React, {Component} from 'react';
import {Spin, Tabs, Button, Table, message, Menu, Dropdown,} from 'antd';
import {AddPkgOpen} from 'components/business/vipOpe';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import {bindActionCreators} from "redux";
import {asyncFetchHomeBatchData, asyncFetchTipList, asyncIgnore} from "../actions";
import {connect} from "react-redux";
import moment from 'moment-timezone';
import {Link} from "react-router-dom";
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import {Auth} from 'utils/authComponent';
moment.tz.setDefault("Asia/Shanghai");
import {
    DownOutlined
} from '@ant-design/icons';
const cx = classNames.bind(styles);

const TabPane = Tabs.TabPane;
const billStateMap = {
    0: '超期仍未交付',
    1: '即将到期',
    2: '今日待上线',
    3: '上线延期',
    4: '今日待完成',
    5: '进度落后',
    6: '今日待开工',
    7: '开工延期',
    8: '今日待完工',
    9: '进度落后'
};

const billTypeMap = {
    "采购订单": {url: '/purchase/show/'},
    "销售订单": {url: '/sale/show/'},
    "委外加工单": {url: '/subcontract/show/'}
};

class BatchQuery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource:[],
            orderTipDataSource: [],
            workSheetTipDataSource: [],
            workProcessDataSource: [],
            productTipDataSource: [],
            batchVipFlag: false
        };
    }


    componentDidMount() {
        this.getOrderTipList('order');
    }

    //初始化数据
    getData = (params)=>{
        this.props.asyncFetchHomeBatchData((data)=>{
            if(data.retCode === '0'){
                this.setState({
                    dataSource:data.data,
                    batchVipFlag:data.batchVipFlag
                })
            }
        },params&&params);
    };


    // 获取订单交付提醒列表数据
    getOrderTipList = (type) => {
        this.props.asyncFetchTipList({type}, (res)=>{
            if(res.retCode === '0'){
                this.setState({[type+'TipDataSource']: res.data});
            }
        });
    };

    tabChange = (key)=>{
        if(key === 'expiredReady'){
            this.getData({flag:"0"})
        } else if(key === 'expiredDone') {
            this.getData({flag:"1"})
        } else {
            this.getOrderTipList(key);
        }
    };

    // 忽略操作
    handleIgnore(row, type) {
        row.operate = 0;
        row.type = type;
        this.props.asyncIgnore(row, (res)=>{
            if(res.retCode === '0'){
                message.success('操作成功!');
                this.getOrderTipList(type);
            }
        });
    };


    render() {
        let noAuthContent = (<div className={cx("no-auth")}>
            <p>开启批次保质期，即可更好管理物品保质期信息</p>
            <AddPkgOpen
                openVipSuccess={() => this.getData()}
                source={'batchShelfLeft'}
                render={() => (
                    <Button type="primary">开启批次查询</Button>
                )}
            />

        </div>);

        let noAuthContent1 = (<div className={cx("no-auth")}>
            <p>开启批次保质期，即可更好管理物品保质期信息</p>
            <AddPkgOpen
                openVipSuccess={() => this.getData({flag:"1"})}
                source={'batchShelfLeft'}
                render={() => (
                    <Button type="primary">开启批次查询</Button>
                )}
            />

        </div>);

        const {dataSource, orderTipDataSource, backlogTipDataSource, workSheetTipDataSource, workProcessTipDataSource, productTipDataSource } = this.state;

        const columns = [
            {
                title: '物品编号',
                dataIndex: 'displayCode',
                key: 'displayCode',
                ellipsis: {
                    showTitle: true,
                },
                width: 120
            },
            {
                title: '物品名称',
                dataIndex: 'name',
                key: 'name',
                ellipsis: {
                    showTitle: true,
                },
                width: 180
            },
            {
                title: '批次号',
                dataIndex: 'batchNo',
                ellipsis: {
                    showTitle: true,
                },
                key: 'batchNo',
            },
            {
                title: '生产日期',
                dataIndex: 'productionDate',
                key: 'productionDate',
                width: 100,
                render: (data)=>{
                    return (<span>{moment(data).format('YYYY-MM-DD')}</span>)
                }
            },
            {
                title: '到期日期',
                dataIndex: 'expirationDate',
                key: 'expirationDate',
                width: 100,
                render: (data)=>{
                    return (<span>{moment(data).format('YYYY-MM-DD')}</span>)
                }
            },
            {
                title: '仓库',
                dataIndex: 'warehouseName',
                key: 'warehouseName',
            },
            {
                title: '库存数量',
                dataIndex: 'currentQuantity',
                key: 'currentQuantity',
                align: 'center',
                render: (num)=>{
                    let quantityDecimalNum =getCookie("quantityDecimalNum");
                    return (<span>{fixedDecimal(num,quantityDecimalNum)}</span>)
                }
            },
            {
                title: '操作',
                dataIndex: 'opt',
                key: 'opt',
                align: 'center',
                render: (data,item)=>{
                    return (<Link to={`/inventory/outbound/add?productCode=${item.productCode}&expirationDate=${item.expirationDate}&productionDate=${item.productionDate}&batchNo=${item.batchNo}&warehouseName=${item.warehouseName}&quantity=${item.currentQuantity}`}>出库</Link>)
                }
            },
        ];

        const orderTipColumns = [
            {
                title: '单据编号',
                dataIndex: 'displayBillNo',
                key: 'displayBillNo',
                ellipsis: {
                    showTitle: true,
                },
                width: 180,
                render: (displayBillNo,item)=>{
                    return (<Link to={`${billTypeMap[item.billType].url}${item.billNo}`}>{displayBillNo}</Link>)
                }
            },
            {
                title: '单据类型',
                dataIndex: 'billType',
                key: 'billType',
                ellipsis: {
                    showTitle: true,
                },
                width: 180
            },
            {
                title: '单据状态',
                dataIndex: 'billState',
                key: 'billState',
                ellipsis: {
                    showTitle: true,
                },
                width: 180,
                render: (billState)=>{
                    return (<span>{billStateMap[billState]}</span>)
                }
            },
            {
                title: '交付日期',
                dataIndex: 'deliveryDate',
                key: 'deliveryDate',
                width: 100,
                render: (deliveryDate)=>{
                    return (<span>{moment(deliveryDate).format('YYYY-MM-DD')}</span>)
                }
            },
            {
                title: '操作',
                dataIndex: 'opt',
                key: 'opt',
                align: 'center',
                render: (data,row)=>{
                    return (<span className={cx('ignore')} onClick={() => this.handleIgnore(row, 'order')}>忽略</span>)
                }
            },
        ];

        const backlogTipColumns = [
            {
                title: '关联单号',
                dataIndex: 'displayDataNo',
                key: 'displayDataNo',
                ellipsis: {
                    showTitle: true,
                },
                width: 180,
                render: (displayDataNo,item)=>{
                    return (<Link to={`${billTypeMap[item.todoType].url}${item.dataNo}`}>{displayDataNo}</Link>)
                }
            },
            {
                title: '待办事项',
                dataIndex: 'todoRemarks',
                key: 'todoRemarks',
                ellipsis: {
                    showTitle: true,
                },
                width: 180
            },
            {
                title: '完成日期',
                dataIndex: 'backlogDate',
                key: 'backlogDate',
                ellipsis: {
                    showTitle: true,
                },
                width: 180,
                render: (backlogDate)=>{
                    return (<span>{moment(backlogDate).format('YYYY-MM-DD')}</span>)
                }
            },
            {
                title: '操作',
                dataIndex: 'opt',
                key: 'opt',
                align: 'center',
                width: 100,
                render: (data,row)=>{
                    return (<span className={cx('ignore')} onClick={() => this.handleIgnore(row, 'backlog')}>忽略</span>)
                }
            },
        ];

        const workSheetColumns = [
            {
                title: '单据编号',
                dataIndex: 'billNo',
                key: 'billNo',
                ellipsis: {
                    showTitle: true,
                },
                width: 180,
                render: (billNo)=>{
                    return (<Link to={`/productControl/show/${billNo}`}>{billNo}</Link>)
                }
            },
            {
                title: '生产成品',
                dataIndex: 'prodName',
                key: 'prodName',
                ellipsis: {
                    showTitle: true,
                },
                width: 180
            },
            {
                title: '状态',
                dataIndex: 'billState',
                key: 'billState',
                ellipsis: {
                    showTitle: true,
                },
                width: 100,
                render: (billState)=>{
                    return (<span>{billStateMap[billState]}</span>)
                }
            },
            {
                title: '计划开始时间',
                dataIndex: 'expectStartDate',
                key: 'expectStartDate',
                width: 150,
                render: (expectStartDate)=>{
                    return (<span>{moment(expectStartDate).format('YYYY-MM-DD HH:mm:ss')}</span>)
                }
            },
            {
                title: '计划结束时间',
                dataIndex: 'expectEndDate',
                key: 'expectEndDate',
                width: 150,
                render: (expectEndDate)=>{
                    return (<span>{moment(expectEndDate).format('YYYY-MM-DD HH:mm:ss')}</span>)
                }
            },
            {
                title: '负责人',
                dataIndex: 'officerName',
                key: 'officerName',
                ellipsis: {
                    showTitle: true,
                },
                width: 100
            },
            {
                title: '操作',
                dataIndex: 'opt',
                key: 'opt',
                align: 'center',
                width: 100,
                render: (data,row)=>{
                    return (<span className={cx('ignore')} onClick={() => this.handleIgnore(row, 'workSheet')}>忽略</span>)
                }
            },
        ];

        const workProcessColumns = [
            {
                title: '单据编号',
                dataIndex: 'billNo',
                key: 'billNo',
                ellipsis: {
                    showTitle: true,
                },
                width: 180,
                render: (billNo)=>{
                    return (<Link to={`/productControl/show/${billNo}`}>{billNo}</Link>)
                }
            },
            {
                title: '工序名称',
                dataIndex: 'processName',
                key: 'processName',
                ellipsis: {
                    showTitle: true,
                },
                width: 180
            },
            {
                title: '状态',
                dataIndex: 'billState',
                key: 'billState',
                ellipsis: {
                    showTitle: true,
                },
                width: 100,
                render: (billState)=>{
                    return (<span>{billStateMap[billState]}</span>)
                }
            },
            {
                title: '计划开始时间',
                dataIndex: 'expectStartDate',
                key: 'expectStartDate',
                width: 150,
                render: (expectStartDate)=>{
                    return (<span>{moment(expectStartDate).format('YYYY-MM-DD HH:mm:ss')}</span>)
                }
            },
            {
                title: '计划结束时间',
                dataIndex: 'expectEndDate',
                key: 'expectEndDate',
                width: 150,
                render: (expectEndDate)=>{
                    return (<span>{moment(expectEndDate).format('YYYY-MM-DD HH:mm:ss')}</span>)
                }
            },
            {
                title: "工作中心",
                dataIndex: 'caName',
                key: 'caName',
                ellipsis: {
                    showTitle: true,
                },
                width: 100
            },
            {
                title: '负责人',
                dataIndex: 'officerName',
                key: 'officerName',
                ellipsis: {
                    showTitle: true,
                },
                width: 100
            },
            {
                title: '操作',
                dataIndex: 'opt',
                key: 'opt',
                align: 'center',
                width: 100,
                render: (data,row)=>{
                    return (<span className={cx('ignore')} onClick={() => this.handleIgnore(row, 'workProcess')}>忽略</span>)
                }
            },
        ];

        const productProcessColumns = [
            {
                title: '生产单号',
                dataIndex: 'billNo',
                key: 'billNo',
                ellipsis: {
                    showTitle: true,
                },
                width: 180,
                render: (billNo)=>{
                    return (<Link to={`/produceOrder/show/${billNo}`}>{billNo}</Link>)
                }
            },
            {
                title: '成品概述',
                dataIndex: 'processName',
                key: 'processName',
                ellipsis: {
                    showTitle: true,
                },
                width: 180,
                render: (processName,data)=>{
                    return <Dropdown className={'list-sale-prodAbstract'}
                                     overlay={() => (
                                         <Menu className={cx('abstract-drop-menu') + ' list-prodAbstract'}>
                                             <Menu.Item>
                                                 <div className={cx("abstract-drop")}>
                                                     <div className={cx("tit")}>{"生产成品"}</div>
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
                                <span className={cx("txt-desc-no") + ' txt-clip'}>{data && data.prodList[0].prodName+"等"+data.prodList.length+"项"}</span>
                                <DownOutlined className="ml5"/>
                            </span>
                    </Dropdown>
                }
            },
            {
                title: '状态',
                dataIndex: 'billState',
                key: 'billState',
                ellipsis: {
                    showTitle: true,
                },
                width: 100,
                render: (billState)=>{
                    return (<span>{billStateMap[billState]}</span>)
                }
            },
            {
                title: '交付期限',
                dataIndex: 'deliveryDeadlineDate',
                key: 'deliveryDeadlineDate',
                width: 150,
                render: (deliveryDeadlineDate)=>{
                    return (<span>{deliveryDeadlineDate && moment(deliveryDeadlineDate).format('YYYY-MM-DD')}</span>)
                }
            },
            {
                title: '操作',
                dataIndex: 'opt',
                key: 'opt',
                align: 'center',
                width: 100,
                render: (data,row)=>{
                    return (<span className={cx('ignore')} onClick={() => this.handleIgnore(row,'product')}>忽略</span>)
                }
            },
        ];


        return (
            <React.Fragment>
                <div className={cx("panel-batch")}>
                    <i className={cx("tip-lst")}></i>
                    <Tabs onChange={(key)=>this.tabChange(key)} defaultActiveKey="order" animated={true} tabBarStyle={
                        {
                            borderBottom: "1px solid #e5e5e5"
                        }
                    }>
                        <TabPane tab="订单交付提醒" key="order">
                            <div className={cx("has-auth")}>
                                <div className={"tb-inner"}>
                                    <Table pagination={false} scroll={{ y: 158,x: 810}} dataSource={orderTipDataSource} columns={orderTipColumns} />
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="待办事项" key="backlog">
                            <div className={cx("has-auth")}>
                                <div className={"tb-inner"}>
                                    <Table pagination={false} scroll={{ y: 158,x: 810}} dataSource={backlogTipDataSource} columns={backlogTipColumns} />
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="生产交付提醒" key="product">
                            <div className={cx("has-auth")}>
                                <div className={"tb-inner"}>
                                    <Auth
                                        module="productOrder"
                                        option="show"
                                    >
                                            {
                                                (isAuthed) =>
                                                    isAuthed ? (
                                                        <Table pagination={false} scroll={{ y: 158,x: 810}} dataSource={productTipDataSource} columns={productProcessColumns} />
                                                    ) : "暂无权限，可联系管理员开通"
                                            }
                                    </Auth>

                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="工单提醒" key="workSheet">
                            <div className={cx("has-auth")}>
                                <div className={"tb-inner"}>
                                    <Table pagination={false} scroll={{ y: 158,x: 810}} dataSource={workSheetTipDataSource} columns={workSheetColumns} />
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="工序提醒" key="workProcess">
                            <div className={cx("has-auth")}>
                                <div className={"tb-inner"}>
                                    <Table pagination={false} scroll={{ y: 158,x: 810}} dataSource={workProcessTipDataSource} columns={workProcessColumns} />
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="即将到期物品" key="expiredReady">
                            {!this.state.batchVipFlag?noAuthContent:(
                                <div className={cx("has-auth")}>
                                    <div className={"tb-inner"}>
                                        <Table pagination={false} scroll={{ y: 158,x: 790}} dataSource={dataSource} columns={columns} />
                                    </div>
                                </div>
                            )}
                        </TabPane>
                        <TabPane tab="已到期物品" key="expiredDone">
                            {!this.state.batchVipFlag?noAuthContent1:(
                                <div className={cx("has-auth")}>
                                    <div className={"tb-inner"}>
                                        <Table pagination={false} scroll={{ y: 158,x: 810}} dataSource={dataSource} columns={columns} />
                                    </div>
                                </div>
                            )}
                        </TabPane>
                    </Tabs>
                </div>

            </React.Fragment>
        )
    }
}

/*const mapStateToProps = (state) => ({
    saleOrder: state.getIn(['home', 'saleOrder']),
    purchaseOrder: state.getIn(['home', 'purchaseOrder']),
});*/

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchHomeBatchData,
        asyncFetchTipList,
        asyncIgnore
    }, dispatch)
};

export default connect(null, mapDispatchToProps)(BatchQuery)
