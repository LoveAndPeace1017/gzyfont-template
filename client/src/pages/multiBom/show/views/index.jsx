import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link} from 'react-router-dom';
import {Layout, Modal, Row, Col, Spin, message, Table, Button} from 'antd';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import OpeBar from 'components/business/opeBar';
import Crumb from 'components/business/crumb';
import Fold from 'components/business/fold';
import BomTree from '../dependencies/bomTree';
import FileView from 'components/business/fileView';
import OperatorLog from 'components/business/operatorLog';
import {AttributeInfo,AttributeBlock} from 'components/business/attributeBlock';
import {formatCurrency, removeCurrency} from 'utils/format';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import Tooltip from 'components/widgets/tooltip';
import {QuestionCircleOutlined} from '@ant-design/icons';
import {getYmd} from 'utils/format';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {asyncFetchMultiBomDetail,asyncFetchExportBom} from '../actions';
import {asyncDeleteMultiBomInfo} from '../../index/actions';
import {detailPage} from  'components/layout/listPage';
import {reducer as multiBomShow} from "../index";
import _ from "lodash";   //***
const cx = classNames.bind(styles);

@connect(mapStateToProps, mapDispatchToProps)
export class Index extends Component{
    constructor(props) {
        super(props);
        this.state = {
            bomTreeFlag: false,
        }
    }

    componentDidMount() {
        this.loadData();
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(this.props.match.params.id !== nextProps.match.params.id){
            this.loadData(nextProps.match.params.id);
        }
    }

    //删除确认按钮
    showConfirm = () => {
        const {match} = this.props;
        const id = match.params.id;
        let self = this;
        Modal.confirm({
            title: intl.get("saleInvoice.show.index.warningTip"),
            okText: intl.get("saleInvoice.show.index.okText"),
            cancelText: intl.get("saleInvoice.show.index.cancelText"),
            content: intl.get("saleInvoice.show.index.deleteContent"),
            onOk() {
                return new Promise((resolve, reject) => {
                    self.props.asyncDeleteMultiBomInfo([id], (res) => {
                        resolve();
                        if (res.retCode == 0) {
                            if(res.data === 1){
                                message.success("删除成功！");
                                self.props.history.replace('/multiBom/list');
                            }else{
                                message.error("存在关联的单据，无法删除！");
                            }
                        }
                    });
                }).catch(() => {
                    //alert("操作失败")
                })

            },
            onCancel() {
            },
        });
    };

    loadData = (nextId) => {
        const {match} = this.props;
        const id = nextId || match.params.id;
        if (id) {
            this.props.asyncFetchMultiBomDetail(id);
        }
    };

    clickBomTree = ()=>{
        let bomTreeFlag = true;
        this.setState({
            bomTreeFlag
        })
    }

    colseModal = ()=>{
        this.setState({
            bomTreeFlag: false
        })
    }

    multiBomExport =(level)=>{
        const {multiBomDetail} = this.props;
        const multiBomDetailDataSource = (multiBomDetail && multiBomDetail.getIn(['data','data']));
        let bomCode = multiBomDetailDataSource && multiBomDetailDataSource.get('bomCode');
        this.props.asyncFetchExportBom({
            level,
            bomCode
        },(data)=>{
            if(data.retCode === '0'){
              let modal =  Modal.success({
                    content: (
                        <div>
                            报表正在生成中，完成后可在<span style={{cursor: "pointer",color:"blue"}} onClick={()=>{modal.destroy();this.props.history.push(`/downloadCenter`);}}>下载中心</span>下载
                        </div>
                    )

                });
            }else{
                message.error('导出失败！')
            }
        });
    }

    operateBar = () => {
        const {match} = this.props;
        const id = match.params.id;
        let listData = [{
            name: 'edit',
            module: 'bom',
            path: `/multiBom/modify/${id}`
        }, {
            name: 'delete',
            module: 'bom',
            onClick: () => {
                this.showConfirm();
            }
        }, {
            name: 'copy',
            module: 'bom',
            path: `/multiBom/copy/${id}`
        }, {
            name: 'multiBomExport'
        },{
            name: 'openBom',
            onClick: this.clickBomTree
        }];
        return (
            <React.Fragment>
                <OpeBar multiBomExport={this.multiBomExport}
                    data={{
                    listData: listData,
                    moreData: []
                }}/>
            </React.Fragment>
        )
    };

    //获取Bom头部信息
    getTopBomInfo = ()=>{
        const {multiBomDetail} = this.props;
        let priceDecimalNum = getCookie("priceDecimalNum");
        const multiBomDetailDataSource = (multiBomDetail && multiBomDetail.getIn(['data','data']));
        const data = [{
            name: "BOM编号",
            value: multiBomDetailDataSource && multiBomDetailDataSource.get('bomCode')
        },{
            name: "版本",
            value: multiBomDetailDataSource && multiBomDetailDataSource.get('bomVersion')
        }, {
            name: "默认BOM",
            value: multiBomDetailDataSource && multiBomDetailDataSource.get('defaultFlag')?"是":"否"
        }, {
            name: "日产量",
            value: multiBomDetailDataSource && multiBomDetailDataSource.get('dayProductivity') && multiBomDetailDataSource.get('dayProductivity')+''
        }];
        const data1 = [{
            name: "成品编号",
            value: multiBomDetailDataSource && multiBomDetailDataSource.get('prodCustomNo')
        },{
            name: "成品名称",
            value: multiBomDetailDataSource && multiBomDetailDataSource.get('prodName')
        }, {
            name: "规格型号",
            value: multiBomDetailDataSource && multiBomDetailDataSource.get('descItem')
        }, {
            name: "预估成本",
            value: fixedDecimal(multiBomDetailDataSource && multiBomDetailDataSource.get('estimatedCost') || 0, priceDecimalNum)
        }, {
            name: "当前库存",
            value: multiBomDetailDataSource && multiBomDetailDataSource.get('currentQuantity')
        }];

        return <div style={{marginBottom: "15px"}}>
                        <AttributeBlock data={data}/>
                        <AttributeBlock data={data1}/>
                </div>
    }

    //获取Bom底部信息
    getBottomBomInfo = ()=>{
        const {multiBomDetail} = this.props;
        const multiBomDetailDataSource = (multiBomDetail && multiBomDetail.getIn(['data','data']));

        const data = [{
            name: "备注",
            value: multiBomDetailDataSource && multiBomDetailDataSource.get('remarks')
        }];


        return <div style={{marginBottom: "15px"}}>
            <AttributeBlock data={data}/>
            <OperatorLog logInfo={{
                creator: multiBomDetailDataSource && multiBomDetailDataSource.get('addedLoginName'),
                createDate: multiBomDetailDataSource && moment(multiBomDetailDataSource.get('addedTime')).format('YYYY-MM-DD HH:mm:ss'),
                lastModifier: multiBomDetailDataSource && multiBomDetailDataSource.get('updatedLoginName'),
                lastModifyDate: multiBomDetailDataSource && multiBomDetailDataSource.get('updatedTime') && moment(multiBomDetailDataSource.get('updatedTime')).format('YYYY-MM-DD HH:mm:ss')
            }}/>
        </div>
    }

    render() {
        const {multiBomDetail} = this.props;
        const data = multiBomDetail.getIn(['data', 'data']);
        const tags = data && data.get('dataTagList') && data.get('dataTagList').toJS();
        let bomTreeData = [];
        let bomTreeParentData = {
            bomCode: data && data.get('bomCode'),
            bomVersion: data && data.get('bomVersion'),
            prodCustomNo: data && data.get('prodCustomNo'),
            prodName: data && data.get('prodName'),
            descItem: data && data.get('descItem'),
        };
        let renderContent = null;
        if (multiBomDetail.get("isFetching")) {
            renderContent = <Spin className="gb-data-loading"/>;
        } else if (data) {
            let columns = [
                {
                    title: "序号",
                    dataIndex: 'serial',
                    className: 'g-id',
                },
                {
                    title: "物品编号",
                    dataIndex: 'prodCustomNo',
                    className: 'g-remarks',
                    sorter: (a, b) => a.prodCustomNo.localeCompare(b.prodCustomNo),
                },
                {
                    title: "物品名称",
                    dataIndex: 'prodName',
                    className: 'g-remarks',
                    sorter: (a, b) => a.prodName.localeCompare(b.prodName),
                },
                {
                    title: "规格型号",
                    dataIndex: 'descItem',
                    className: 'g-remarks',
                },
                {
                    title: "单位",
                    dataIndex: 'unit',
                    className: 'g-remarks',
                },
                {
                    title: "品牌",
                    dataIndex: 'brand',
                    className: 'g-remarks',
                },
                {
                    title: "制造商型号",
                    dataIndex: 'produceModel',
                    className: 'g-remarks',
                },
                {
                    title: "配件数量",
                    dataIndex: 'quantity',
                    className: 'g-remarks',
                    sorter: (a, b) => a.quantity - b.quantity,
                },
                {
                    title: "损耗率",
                    dataIndex: 'lossRate',
                    className: 'g-remarks',
                    sorter: (a, b) => a.lossRate - b.lossRate,
                },
                {
                    title: "基准采购价",
                    dataIndex: 'orderPrice',
                    className: 'g-remarks',
                },
                {
                    title: "当前库存",
                    dataIndex: 'currentQuantity',
                    className: 'g-remarks',
                }

            ];

            // 自定义字段
            tags && tags.forEach((value) => {
                let propName = value.propName;
                let mappingName = value.mappingName;
                const propertyIndex = mappingName && parseInt(mappingName.substr(mappingName.length - 1));
                if (propName && propName !== "" && mappingName) {
                    columns.push({
                        title: propName,
                        dataIndex: `propertyValue${propertyIndex}`,
                        className: 'g-remarks',
                    })
                }
            });

            columns = columns.concat([
                {
                    title: "操作",
                    dataIndex: 'action',
                    className: 'g-amount',
                    render: (text,data) => (
                        <Link to={`/multiBom/add?prodName=${data.prodName}&prodNo=${data.prodNo}`}>创建子BOM</Link>
                    )
                }
            ]);

            let dataSource = [];
            if(data.get('subList') && data.get('subList').size>0){
                bomTreeData = data.get('subList').toJS();
            }
            if(data.get('accessoryList') && data.get('accessoryList').size>0){
                dataSource = data.get('accessoryList').toJS();
                dataSource.forEach((item,index)=>{
                    item.serial = index+1;
                    item.key = index;
                })
            }

            const columns1 = [
                {
                    title: "顺序号",
                    dataIndex: 'orderNo',
                    className: 'g-id',
                },
                {
                    title: "工序编号",
                    dataIndex: 'processCode',
                    className: 'g-remarks',
                },
                {
                    title: "工序名称",
                    dataIndex: 'processName',
                    className: 'g-remarks',
                },
                {
                    title: <div>
                               <span>单位工作量</span>
                                <Tooltip
                                    type="info"
                                    title={<div>
                                        <p>生产单位成品所需完成的工作量</p>
                                    </div>}
                                >
                                    <QuestionCircleOutlined  className={cx("scan-tip")}/>
                                </Tooltip>
                           </div>,
                    dataIndex: 'workload',
                    className: 'g-remarks',
                },
                {
                    title: "工作中心",
                    dataIndex: 'caName',
                    className: 'g-remarks',
                },
                {
                    title: "负责人",
                    dataIndex: 'officerName',
                    className: 'g-remarks',
                    render: (officerName,record)=>{
                        return <span title={record.departmentName && (record.departmentName+"-"+officerName)}>{record.departmentName && (record.departmentName+"-"+officerName)}</span>
                    }
                },
                {
                    title: "附件",
                    dataIndex: 'opt',
                    className: 'g-remarks',
                    render: (ope,data) => (
                        <React.Fragment>
                            {
                                data.fileInfo && data.fileInfo.map((file) => {
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
                        </React.Fragment>
                    ),
                }
            ];
            let dataSource1 = [];
            if(data.get('processList') && data.get('processList').size>0){
                dataSource1 = data.get('processList').toJS();
                dataSource1.forEach((item,index)=>{
                    item.key = index;
                })
            }

            renderContent = (
                <React.Fragment>
                    {this.operateBar()}
                     <div style={{position:"relative"}} className="detail-content-bd">
                         {
                             this.getTopBomInfo()
                         }
                         <Fold title={"BOM配件"}>
                             <div className="up-bill">
                                 <Table columns={columns} dataSource={dataSource} bordered pagination={false}/>
                             </div>
                         </Fold>

                         <Fold title={"工序"}>
                             <div className="up-bill">
                                 <Table columns={columns1} dataSource={dataSource1} bordered pagination={false}/>
                             </div>
                         </Fold>



                        <Fold title={"其他信息"}>
                            {this.getBottomBomInfo()}
                        </Fold>
                    </div>

                </React.Fragment>
            )
        }

        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            title: "物品"
                        },
                        {
                            url: '/multiBom/list',
                            title: "多级BOM"
                        },
                        {
                            title: "详情页"
                        }
                    ]}/>
                </div>
                <div className="detail-content">
                    {renderContent}
                </div>
                <Modal
                    title= {"BOM结构展开"}
                    width={800}
                    onCancel = {
                        ()=>{
                            this.setState({
                                bomTreeFlag:false
                            })
                        }
                    }
                    visible={this.state.bomTreeFlag}
                    footer={null}
                    destroyOnClose={true}
                >
                    <BomTree close={this.colseModal} bomTreeParentData={bomTreeParentData} data={bomTreeData}/>
                </Modal>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    multiBomDetail: state.getIn(['multiBomShow', 'multiBomDetail'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchMultiBomDetail,
        asyncDeleteMultiBomInfo,
        asyncFetchExportBom
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);