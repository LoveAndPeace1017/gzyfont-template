import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {
    Layout,
    Modal,
    Table,
    Spin,
    Checkbox
} from 'antd';
import Crumb from 'components/business/crumb';
import {asyncFetchSchedulingById} from 'pages/inventory/scheduling/add/actions';
import {asyncDeleteSchedulingInfo} from 'pages/inventory/scheduling/index/actions';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import OpeBar from 'components/business/opeBar';
import {AttributeBlock} from 'components/business/attributeBlock';
import OperatorLog from 'components/business/operatorLog';
import {ResizeableTable} from 'components/business/resizeableTitle';
import FileView from 'components/business/fileView';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {getYmd} from 'utils/format';
import {Auth} from 'utils/authComponent';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import PrintArea from "../../../../../components/widgets/printArea/views";
import PageTurnBtn from 'components/business/pageTurnBtn';

const cx = classNames.bind(styles);
const {Content} = Layout;

export class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteRelatedRecord:false
        }
    }

    componentDidMount() {
        const {match} = this.props;
        const id = match.params.id;
        if (id) {
            this.props.asyncFetchSchedulingById(id, (res) => {
                let errorMsg = res.get('retCode') != '0' && res.get('retMsg');
                if (errorMsg) {
                    Modal.info({
                        title: intl.get("schedule.show.index.warningTip"),
                        content: errorMsg
                    });
                }
            })
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.match.params.id!=this.props.match.params.id){
            let id = nextProps.match.params.id;
            this.props.asyncFetchSchedulingById(id, (res) => {
                let errorMsg = res.get('retCode') != '0' && res.get('retMsg');
                if (errorMsg) {
                    Modal.info({
                        title: intl.get("schedule.show.index.warningTip"),
                        content: errorMsg
                    });
                }
            })
        }
    }

    onDeleteConfirmChange = (e)=>{
        this.setState({
            deleteRelatedRecord:e.target.checked
        });
    };
    showDeleteConfirm = () => {
        let data = this.getInfo().toJS();
        let self = this;
        Modal.confirm({
            title: intl.get("schedule.show.index.warningTip"),
            okText: intl.get("schedule.show.index.okText"),
            cancelText: intl.get("schedule.show.index.cancelText"),
            content:<div>
                <p>{intl.get("schedule.show.index.deleteMsg1")}</p>
                <Checkbox onChange={this.onDeleteConfirmChange} >{intl.get("schedule.show.index.deleteMsg2")}</Checkbox>
            </div>,
            onOk() {
                self.props.asyncDeleteSchedulingInfo({
                    ids: [data.billNo],
                    isCascaded:self.state.deleteRelatedRecord?1:0
                },res=>{
                    if (res.retCode == 0) {
                        Modal.success({
                            title: intl.get("schedule.show.index.warningTip"),
                            content: intl.get("schedule.show.index.deleteSuccessMessage")
                        });
                        self.props.history.replace('/inventory/scheduling/')
                    } else {
                        Modal.error({
                            title: intl.get("schedule.show.index.warningTip"),
                            content: res.retMsg
                        });
                    }
                });
            },
            onCancel() { },
        });
    };

    getInfo() {
        const {schedulingInfo} = this.props;
        return schedulingInfo && schedulingInfo.getIn(['data', 'data']);
    }

    schedulingBillInfo = () => {
        const info = this.getInfo();
        const data = [
            {
                name: intl.get("schedule.show.index.displayBillNo"),
                value: info.get('displayBillNo'),
                highlight: true
            },
            {
                name: intl.get("schedule.show.index.warehouseNameOut"),
                value: info.get('warehouseNameOut')
            },
            {
                name: intl.get("schedule.show.index.warehouseNameIn"),
                value: info.get('warehouseNameIn')
            },
            {
                name: intl.get("schedule.show.index.allocDate"),
                value: moment(info.get('allocDate')).format('YYYY-MM-DD')
            }
        ];
        return (
            <div className={"detail-main-attr cf"}>
                <AttributeBlock data={data}/>
            </div>
        );
    };

    schedulingProductList = () => {
        const {schedulingInfo} = this.props;
        const prodList = schedulingInfo && schedulingInfo.getIn(['data', 'data', 'prodList']).toJS();
        let quantityDecimalNum = getCookie("quantityDecimalNum");

        prodList.forEach((item, index) => {
            item.key = item.prodNo;
            item.serial = index + 1;
            item.quantity = fixedDecimal(item.quantity, quantityDecimalNum);
        });

        const renderContent = (value, row, index, authModule, authOption) => {
            const obj = {
                children: <span className={cx('txt-clip')} title={value}>{value}</span>,
            };
            if (authModule && authOption) {
                obj.children = <Auth module={authModule} option={authOption}>{(isAuthed) => isAuthed ?
                    <React.Fragment><span className={cx('txt-clip')}
                                          title={value}>{value}</span></React.Fragment> : PRICE_NO_AUTH_RENDER}</Auth>
            }
            return obj;
        };

        const columns = [
            {
                title: intl.get("schedule.show.index.serial"),
                key: 'serial',
                dataIndex: 'serial',
                width: 60,
                fixed: true,
                render: renderContent
            },
            {
                title: intl.get("schedule.show.index.prodCustomNo"),
                dataIndex: 'prodCustomNo',
                width: 110,
                fixed: true,
                sorter: (a, b) => a.prodCustomNo.localeCompare(b.prodCustomNo),
                render: renderContent
            },
            {
                title: intl.get("schedule.show.index.prodName"),
                dataIndex: 'prodName',
                width: 300,
                fixed: true,
                sorter: (a, b) => a.prodName.localeCompare(b.prodName),
                render: renderContent
            },
            {
                title: intl.get("schedule.show.index.descItem"),
                dataIndex: 'descItem',
                width: 300,
                render: renderContent
            },
            {
                title: intl.get("schedule.show.index.quantity"),
                dataIndex: 'quantity',
                align: 'right',
                width: 120,
                sorter: (a, b) => a.quantity - b.quantity,
                render: renderContent
            },
            {
                title: intl.get("schedule.show.index.unit"),
                dataIndex: 'unit',
                width: 70,
                render: renderContent
            },
            {
                title: intl.get("schedule.show.index.remarks"),
                dataIndex: 'remarks',
                width: 150,
                render: renderContent
            }];

        return (
            <div className="detail-table-wrap">
                <ResizeableTable
                    columns={columns}
                    dataSource={prodList}
                    bordered
                    pagination={false}
                    scroll={{x: 'auto'}}
                />
            </div>
        );
    };

    operateBar = () => {
        const info = this.getInfo();
        if (!info) {
            return null;
        }

        return <OpeBar data={{
            listData: [
                {
                    name: 'delete',
                    module: 'scheduling',
                    onClick: () => {
                        this.showDeleteConfirm();
                    }
                },
                {
                    name: 'copy',
                    module: 'scheduling',
                    path:`/inventory/scheduling/copy/${info.get('billNo')}`
                },
                {
                    name: 'export',
                    label: intl.get("schedule.show.index.export"),
                    href: `${BASE_URL}/file/download?url=/allocwares/excel/export/${info.get('billNo')}`
                },
                {
                    name: 'print',
                    module: 'scheduling',
                }
            ],
            moreData: [

            ]
        }}/>;
    };

    schedulingBaseInfo = () => {
        const info = this.getInfo();
        return (
            <React.Fragment>
                <div>
                    <AttributeBlock data={[
                        {
                            name: intl.get("schedule.show.index.ourContacterName"),
                            value:info.get('ourContacterName')
                        },
                        {
                            name: intl.get("schedule.show.index.remarks"),
                            value: info.get('remarks')
                        }

                    ]}/>
                    <div>
                        <div style={{
                            display: 'inline-block',
                            verticalAlign: 'top',
                            fontSize: '14px',
                            color: '#666',
                            marginRight: '10px',
                            lineHeight: '30px'
                        }}> {intl.get("schedule.show.index.tempAtt")}：
                        </div>
                        <div style={{display: 'inline-block', lineHeight: '30px'}}>
                            {
                                info && info.get('fileInfo') && info.get('fileInfo').toJS().map((file) => {
                                    return (
                                        <div key={file.fileId}>
                                            <a style={{color: '#499fff'}}
                                               href={`${BASE_URL}/file/download/?url=/file/download/${file.fileId}`}
                                            >
                                                {file.fileName}
                                            </a>
                                            <FileView fileId={file.fileId} fileName={file.fileName}/>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    };

    render() {
        const {schedulingInfo} = this.props;
        const data = schedulingInfo.getIn(['data', 'data']);
        const detailData = schedulingInfo && data !== '' && data;

        let renderContent = null;
        if (schedulingInfo && schedulingInfo.get('isFetching')) {
            renderContent = <Spin className="gb-data-loading"/>;
        } else if (detailData) {
            renderContent = (
                <React.Fragment>
                    <PrintArea>
                        <div style={{position:"relative"}} className="detail-content-bd">
                            <PageTurnBtn type={"scheduling"}  current={detailData.get("billNo")}/>
                            {this.schedulingBillInfo()}
                            {this.schedulingProductList()}
                            {this.schedulingBaseInfo()}
                            <OperatorLog logInfo={{
                                creator: data.get('addedName') || data.get('addedLoginName'),
                                createDate: getYmd(data.get('addedTime')),
                                hideModifier:true
                            }}/>
                        </div>
                    </PrintArea>
                </React.Fragment>
            )
        }

        return (
            <Layout>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            title: intl.get("schedule.show.index.schedule")
                        },
                        {
                            url: '/inventory/scheduling/',
                            title: intl.get("schedule.show.index.scheduleList")
                        },
                        {
                            title: intl.get("schedule.show.index.detail")
                        }

                    ]}/>
                </div>
                <div className="detail-content">
                    {this.operateBar()}
                    {renderContent}
                </div>
            </Layout>
        )
    }
}

const mapStateToProps = (state) => ({
    schedulingInfo: state.getIn(['schedulingAdd', 'schedulingInfo']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchSchedulingById,
        asyncDeleteSchedulingInfo
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);