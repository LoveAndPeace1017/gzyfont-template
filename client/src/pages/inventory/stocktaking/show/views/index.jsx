import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Layout, Modal, Table, Spin, Checkbox} from 'antd';
import Crumb from 'components/business/crumb';
import {asyncFetchStocktakingById} from 'pages/inventory/stocktaking/add/actions';
import {actions as fieldConfigActions} from 'components/business/goodsTableFieldConfigMenu';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import OpeBar from 'components/business/opeBar';
import FileView from 'components/business/fileView';
import {ShowBasicBlock} from 'components/business/showBasicInfo';
import LimitOnlineTip from 'components/business/limitOnlineTip';
import {AttributeBlock, AttributeInfo} from 'components/business/attributeBlock';
import OperatorLog from 'components/business/operatorLog';
import {ResizeableTable} from 'components/business/resizeableTitle';
import GoodsTableFieldConfigMenu from 'components/business/goodsTableFieldConfigMenu';

import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {getYmd} from 'utils/format';
import {asyncCancelStocktaking} from "../../add/actions";
import {asyncDeleteStocktakingInfo} from "../../index/actions";
import {Auth} from 'utils/authComponent';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import PageTurnBtn from 'components/business/pageTurnBtn';
import PrintArea from "../../../../../components/widgets/printArea/views";

const cx = classNames.bind(styles);
const {Content} = Layout;

export class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteRelatedRecord:false,
            showTip: false
        }
    }

    componentDidMount() {
        const {match} = this.props;
        const id = match.params.id;
        if (id) {
            this.props.asyncFetchStocktakingById(id, (res) => {
                let errorMsg = res.retCode != '0' && res.retMsg;
                if (errorMsg) {
                    Modal.info({
                        title: intl.get("stocktaking.show.index.warningTip"),
                        content: errorMsg
                    });
                }
            })
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.match.params.id!=this.props.match.params.id){
            let id = nextProps.match.params.id;
            this.props.asyncFetchStocktakingById(id, (res) => {
                let errorMsg = res.get('retCode') != '0' && res.get('retMsg');
                if (errorMsg) {
                    Modal.info({
                        title: intl.get("stocktaking.show.index.warningTip"),
                        content: errorMsg
                    });
                }
            })
        }
    }

    componentWillUnmount() {
        this.props.asyncSaveFieldConfig(this.props.fieldConfigType);
        this.props.emptyFieldConfig();
    }

    onDeleteConfirmChange = (e)=>{
        this.setState({
            deleteRelatedRecord:e.target.checked
        });
    };

    showDeleteConfirm = () => {
        let data = this.getInfo().toJS();
       // if(data.checkStatus=='盘点中'){
       //      Modal.warning({
       //          title: '提示信息',
       //          content: '此仓库正在盘点，请先结束盘点再操作！',
       //      });
       //      return;
       //  }

        let self = this;
        Modal.confirm({
            title: intl.get("stocktaking.show.index.warningTip"),
            okText: intl.get("stocktaking.show.index.okText"),
            cancelText: intl.get("stocktaking.show.index.cancelText"),
            content:<div>
                <p>{intl.get("stocktaking.show.index.deleteMsg1")}</p>
                {data.checkStatus!=0 && <Checkbox onChange={this.onDeleteConfirmChange} >{intl.get("stocktaking.show.index.deleteMsg2")}</Checkbox>}
            </div>,
            onOk() {
                self.props.asyncDeleteStocktakingInfo({
                    ids: [data.checkNo],
                    isCascaded:self.state.deleteRelatedRecord?1:0
                },res=>{
                    if (res.retCode == 0) {
                        Modal.success({
                            title: intl.get("stocktaking.show.index.warningTip"),
                            content: intl.get("stocktaking.show.index.deleteSuccessMessage")
                        });
                        self.props.history.replace('/inventory/stocktaking/')
                    } else {
                        Modal.error({
                            title: intl.get("stocktaking.show.index.warningTip"),
                            content: res.retMsg
                        });
                    }
                });
            },
            onCancel() { },
        });
    };

    closeModals = () =>{
        this.setState({showTip:false})
    };

    showFinishConfirm = ()=>{
        let data = this.getInfo().toJS();
        console.log(data.fileInfo, 'data.fileInfo');
        if(data.fileInfo && data.fileInfo.length > 0){
            let fileIds =  data.fileInfo.map(item => item.fileId);
            data.fileIds = fileIds;
            delete data.fileInfo;
        }
        let self = this;
        Modal.confirm({
            title: intl.get("stocktaking.show.index.warningTip"),
            okText: intl.get("stocktaking.show.index.okText"),
            cancelText: intl.get("stocktaking.show.index.cancelText"),
            content: intl.get("stocktaking.show.index.message1"),
            onOk() {
                self.props.asyncCancelStocktaking(data.checkNo,data,res=>{
                    if (res.retCode == 0) {
                        Modal.success({
                            title: intl.get("stocktaking.show.index.warningTip"),
                            content: intl.get("stocktaking.show.index.operateSuccessMessage"),
                        });
                        self.props.asyncFetchStocktakingById(data.checkNo);
                    }else if(res && res.retCode == undefined && !res.status){
                        self.setState({showTip:true});
                    }
                    else {
                        Modal.error({
                            title: intl.get("stocktaking.show.index.warningTip"),
                            content: res.retMsg
                        });
                    }
                });
            },
            onCancel() { },
        });
    };

    getInfo() {
        const {stocktakingInfo} = this.props;
        return stocktakingInfo && stocktakingInfo.getIn(['data', 'data']);
    }

    stocktakingBillInfo = () => {
        const info = this.getInfo();
        const title = info.get('checkStatus')==0?<span className="ui-status ui-status-unaccept">{intl.get("stocktaking.show.index.onStocktaking")} </span>:<span className="ui-status ui-status-accepted">{intl.get("stocktaking.show.index.stockFinish")}</span>;
        return (
            <div className={"detail-main-attr cf"}>
                <AttributeInfo data={{
                    name: intl.get("stocktaking.show.index.checkNo"),
                    value: info.get('checkNo'),
                    highlight: true
                }}/>
                <div className={cx("status")}>
                    {title}
                </div>
                <AttributeInfo data={{
                    name: intl.get("stocktaking.show.index.checkDate"),
                    value: moment(info.get('checkDate')).format('YYYY-MM-DD')
                }}/>
            </div>
        );
    };

    stocktakingProductList = () => {
        const {stocktakingInfo} = this.props;
        const prodList = stocktakingInfo && stocktakingInfo.getIn(['data', 'data', 'prodList']).toJS();
        let prodDataTags = stocktakingInfo && stocktakingInfo.getIn(['data', 'prodDataTags']).toJS();
        let quantityDecimalNum = getCookie("quantityDecimalNum");

        prodList.forEach((item, index) => {
            item.key = item.prodNo;
            item.serial = index + 1;
            item.proBarCode = item.proBarcode;
            item.result = item.checkResult > 0 ? intl.get("stocktaking.show.index.state1") : item.checkResult == 0 ? intl.get("stocktaking.show.index.state2") : intl.get("stocktaking.show.index.state3");
            item.systemNum = fixedDecimal(item.systemNum, quantityDecimalNum);
            item.actualNum = fixedDecimal(item.actualNum, quantityDecimalNum);
            item.offsetQuantity = fixedDecimal(item.actualNum - item.systemNum, quantityDecimalNum);
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

        let prodCustomColumns = prodDataTags.filter(item => item.propName)
            .map(item => {
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

        let columns = [
            {
                title: intl.get("stocktaking.show.index.serial"),
                key: 'serial',
                dataIndex: 'serial',
                width: 60,
                fixed: true,
                render: renderContent
            },
            {
                title:intl.get("stocktaking.show.index.prodCustomNo"),
                dataIndex: 'prodCustomNo',
                width: 110,
                fixed: true,
                sorter: (a, b) => a.prodCustomNo.localeCompare(b.prodCustomNo),
                render: renderContent
            },
            {
                title: intl.get("stocktaking.show.index.prodName"),
                dataIndex: 'prodName',
                width: 300,
                fixed: true,
                sorter: (a, b) => a.prodName.localeCompare(b.prodName),
                render: renderContent
            },
            {
                title: intl.get("stocktaking.show.index.descItem"),
                dataIndex: 'descItem',
                columnName: 'descItem',
                width: 300,
                render: renderContent
            },
            {
                title: intl.get("stocktaking.show.index.unit"),
                dataIndex: 'unit',
                columnName: 'unit',
                width: 70,
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
        ];

        columns.push(...prodCustomColumns);

        columns.push(
            {
                title: intl.get("stocktaking.show.index.systemNum"),
                dataIndex: 'systemNum',
                columnName: 'systemNum',
                align: 'right',
                width: 120,
                sorter: (a, b) => a.systemNum - b.systemNum,
                render: renderContent
            },
            {
                title: intl.get("stocktaking.show.index.actualNum"),
                dataIndex: 'actualNum',
                align: 'right',
                width: 120,
                sorter: (a, b) => a.actualNum - b.actualNum,
                render: renderContent
            },
            {
                title: intl.get("stocktaking.show.index.diffNum"),
                dataIndex: 'offsetQuantity',
                columnName: 'offsetQuantity',
                align: 'right',
                width: 120,
                sorter: (a, b) => a.offsetQuantity - b.offsetQuantity,
                render: renderContent
            },
            {
                title: intl.get("stocktaking.show.index.checkDesc"),
                dataIndex: 'result',
                columnName: 'result',
                align: 'center',
                width: 300,
                render: renderContent
            },
            {
                title: intl.get("stocktaking.show.index.remarks"),
                dataIndex: 'remarks',
                columnName: 'remarks',
                width: 150,
                render: renderContent
            }
        );

        //处理字段配置
        const configFields = this.props.goodsTableConfig.get('data');

        let visibleColumns = configFields && columns.filter(column => {
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

        console.log(visibleColumns, 'visibleColumns');
        return (
            <div className="detail-table-wrap">
                <Table
                    columns={visibleColumns}
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
        const status = info.get('checkStatus');
        let listData = [
            {
                name:'edit',
                module: 'stocktaking',
                path:`/inventory/stocktaking/modify/${info.get('checkNo')}`
            },{
                name: 'delete',
                module: 'stocktaking',
                onClick: () => {
                    this.showDeleteConfirm();
                }
            },{
                name: 'disable',
                label: intl.get("stocktaking.show.index.finishStock"),
                onClick: () => {
                    this.showFinishConfirm();
                }
            },{
                name: 'copy',
                module: 'stocktaking',
                disabled: status==0,
                path:`/inventory/stocktaking/copy/${info.get('checkNo')}`
            },{
                name: 'export',
                label: intl.get("stocktaking.show.index.export"),
                href: `${BASE_URL}/file/download?url=/checks/excel/export/${info.get('checkNo')}`
            },
            {
                name: 'print',
                module: 'stocktaking',
            }
        ];
        if(status==1){
            listData.shift();
            listData.splice(1,1);
        }


        return <OpeBar data={{
            listData,
            moreData: [
            ]
        }}/>;
    };

    stocktakingBaseInfo = () => {
        const info = this.getInfo();
        console.log(info, 'infoinfo');
        return (
            <React.Fragment>
                <div>
                    <AttributeBlock data={[
                        {
                            name: intl.get("stocktaking.show.index.checkOperator"),
                            value:info.get('checkOperator')
                        },
                        {
                            name: intl.get("stocktaking.show.index.remarks"),
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
                        }}>{intl.get("stocktaking.show.index.tempAtt")}：
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

    resetDefaultFields = (billNo)=>{
        this.props.asyncFetchStocktakingById(billNo)
    };

    componentWillUnmount() {
        this.props.asyncSaveFieldConfig('warecheck_order');
        this.props.emptyFieldConfig();
    }

    render() {
        const {stocktakingInfo} = this.props;
        const data = stocktakingInfo.getIn(['data', 'data']);
        const listFields = stocktakingInfo && stocktakingInfo.getIn(['data', 'listFields']);
        const billNo = data && data.get('checkNo');
        const detailData = stocktakingInfo && data !== '' && data;

        let renderContent = null;
        if (stocktakingInfo && stocktakingInfo.get('isFetching')) {
            renderContent = <Spin className="gb-data-loading"/>;
        } else if (detailData) {
            renderContent = (
                <React.Fragment>
                    <PrintArea>
                        <div style={{position:"relative"}} className="detail-content-bd">
                            <PageTurnBtn type={"stocktaking"}  current={detailData.get("checkNo")}/>
                            {this.stocktakingBillInfo()}
                            {this.stocktakingProductList()}
                            {this.stocktakingBaseInfo()}
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
                            title: intl.get("stocktaking.show.index.stocktaking")
                        },
                        {
                            url: '/inventory/stocktaking/',
                            title: intl.get("stocktaking.show.index.stocktakingList")
                        },
                        {
                            title: intl.get("stocktaking.show.index.detail")
                        }

                    ]}/>
                    <div className={cx("float-right")}>
                        <GoodsTableFieldConfigMenu
                            tableConfigList={listFields}
                            refresh={() => this.resetDefaultFields(billNo)}
                            type={'warecheck_order'}
                        />
                    </div>
                </div>
                <div className="detail-content">
                    {this.operateBar()}
                    {renderContent}
                </div>
                <LimitOnlineTip onClose={()=>this.closeModals()} show={this.state.showTip}/>
            </Layout>
        )
    }
}

const mapStateToProps = (state) => ({
    stocktakingInfo: state.getIn(['stocktakingAdd', 'stocktakingInfo']),
    goodsTableConfig: state.getIn(['goodsTableFieldConfigMenu', 'goodsTableConfig'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchStocktakingById,
        asyncDeleteStocktakingInfo,
        asyncCancelStocktaking,
        emptyFieldConfig: fieldConfigActions.emptyFieldConfig,
        asyncSaveFieldConfig: fieldConfigActions.asyncSaveFieldConfig,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);