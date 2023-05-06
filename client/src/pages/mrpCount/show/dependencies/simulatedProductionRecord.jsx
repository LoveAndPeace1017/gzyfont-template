import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {
    Table,
    Button,
    message
} from 'antd';
import { Resizable } from 'react-resizable';
import {Link, withRouter} from 'react-router-dom';
import OperatorLog from 'components/business/operatorLog';
import {getYmd} from "utils/format";
import authComponent from "utils/authComponent";
import {asyncFetchMrpCountDetail} from '../actions'
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import Pagination from 'components/widgets/pagination';
import {reducer as mrpCountReduceDetail} from "../index";
import {AttributeInfo, AttributeBlock} from 'components/business/attributeBlock';

const ResizeableTitle = props => {
    const { onResize, width, ...restProps } = props;

    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable
            width={width}
            height={0}
            handle={
                <span
                    className="react-resizable-handle"
                    onClick={e => {
                        e.stopPropagation();
                    }}
                />
            }
            onResize={onResize}
            draggableOpts={{ enableUserSelectHack: false }}
        >
            <th {...restProps} />
        </Resizable>
    );
};

class Record extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns:[],
            setId: '',
            selectedRowKeys:[]
        }
    }

    componentDidMount() {
        this.fetchData({});
        this.props.onRef && this.props.onRef(this);
        const {type} = this.props;
        if (type === 'simulatedProduction') {
            this.setState({
                columns:[{
                    title: "序号",
                    width: 50,
                    dataIndex: 'serial',
                    className: 'ant-table-selection-column'
                },{
                    title: "销售单号",
                    dataIndex: 'saleCustomNo',
                    width: 160,
                    render: (text, record) => {
                        return (
                            <span className="txt-clip" title={text}>
                                {text}
                                {/* <Link to={`/finance/expend/show/${record.id}`}>{text}</Link>*/}
                            </span>
                        )
                    }
                },{
                    title: "销售日期",
                    dataIndex: 'saleDate',
                    width: 160,
                    render: (saleDate, record) => {
                        return (
                            <span className="txt-clip" title={saleDate && moment(saleDate).format('YYYY-MM-DD')}>
                                {saleDate && moment(saleDate).format('YYYY-MM-DD')}
                            </span>
                        )
                    }
                },{
                    title: "物品编号",
                    dataIndex: 'prodCustomNo',
                    width: 160,
                    render: (prodCustomNo, record) => {
                        return (
                            <span className="txt-clip" title={prodCustomNo}>
                                {prodCustomNo}
                            </span>
                        )
                    }
                },{
                    title: "物品名称",
                    dataIndex: 'prodName',
                    width: 180,
                    render: (prodName, record) => {
                        return (
                            <span className="txt-clip" title={prodName}>
                                {prodName}
                            </span>
                        )
                    }
                },{
                    title: "上级物品编号",
                    dataIndex: 'prodCustomMain',
                    width: 180,
                    render: (prodCustomMain, record) => {
                        return (
                            <span className="txt-clip" title={prodCustomMain}>
                                {prodCustomMain}
                            </span>
                        )
                    }
                },{
                    title: "上级物品名称",
                    dataIndex: 'prodNameMain',
                    width: 160,
                    render: (prodNameMain, record) => {
                        return (
                            <span className="txt-clip" title={prodNameMain}>
                                {prodNameMain}
                            </span>
                        )
                    }
                },{
                    title: "BOM单位用量",
                    dataIndex: 'bomQuantity',
                    width: 100,
                    render: (bomQuantity, record) => {
                        return (
                            <span className="txt-clip" title={bomQuantity}>
                                {bomQuantity}
                            </span>
                        )
                    }
                },{
                    title: "损耗率",
                    dataIndex: 'lossRate',
                    width: 80,
                    render: (lossRate, record) => {
                        return (
                            <span className="txt-clip" title={lossRate}>
                                {lossRate}
                            </span>
                        )
                    }
                },{
                    title: "损耗量",
                    dataIndex: 'lossQuantity',
                    width: 80,
                    render: (lossQuantity, record) => {
                        return (
                            <span className="txt-clip" title={lossQuantity}>
                                {lossQuantity}
                            </span>
                        )
                    }
                },{
                    title: "BOM编号",
                    dataIndex: 'bomCode',
                    width: 160,
                    render: (bomCode, record) => {
                        return (
                            <span className="txt-clip" title={bomCode}>
                                {bomCode}
                            </span>
                        )
                    }
                },{
                    title: "需求日期",
                    dataIndex: 'requiredDate',
                    width: 160,
                    render: (requiredDate, record) => {
                        return (
                            <span className="txt-clip" title={requiredDate && moment(requiredDate).format('YYYY-MM-DD')}>
                                {requiredDate && moment(requiredDate).format('YYYY-MM-DD')}
                            </span>
                        )
                    }
                },{
                    title: "库存量",
                    dataIndex: 'stockNum',
                    width: 80,
                    render: (stockNum, record) => {
                        return (
                            <span className="txt-clip" title={stockNum}>
                                {stockNum}
                            </span>
                        )
                    }
                },{
                    title: "可用库存",
                    dataIndex: 'usableNum',
                    width: 80,
                    render: (usableNum, record) => {
                        return (
                            <span className="txt-clip" title={usableNum}>
                                {usableNum}
                            </span>
                        )
                    }
                },{
                    title: "毛需求",
                    dataIndex: 'grossQuantity',
                    width: 80,
                    render: (grossQuantity, record) => {
                        return (
                            <span className="txt-clip" title={grossQuantity}>
                                {grossQuantity}
                            </span>
                        )
                    }
                },{
                    title: "净需求",
                    dataIndex: 'netQuantity',
                    width: 80,
                    render: (netQuantity, record) => {
                        return (
                            <span className="txt-clip" title={netQuantity}>
                                {netQuantity}
                            </span>
                        )
                    }
                },{
                    title: "建议量",
                    dataIndex: 'suggestQuantity',
                    width: 80,
                    render: (suggestQuantity, record) => {
                        return (
                            <span className="txt-clip" title={suggestQuantity}>
                                {suggestQuantity}
                            </span>
                        )
                    }
                },{
                    title: "供应商",
                    dataIndex: 'supplierName',
                    render: (supplierName, record) => {
                        return (
                            <span className="txt-clip" title={supplierName}>
                                {supplierName}
                            </span>
                        )
                    }
                },{
                    title: "生产总耗时（天）",
                    width: 80,
                    dataIndex: 'produceDay',
                    render: (produceDay, record) => {
                        return (
                            <span className="txt-clip" title={produceDay}>
                                {produceDay}
                            </span>
                        )
                    }
                }]
            })
        }else if(type === "purchaseProposal"){
            this.setState({
                columns:[{
                    title: "序号",
                    width: 50,
                    dataIndex: 'serial',
                    className: 'ant-table-selection-column'
                },{
                    title: "物品编号",
                    dataIndex: 'prodCustomNo',
                    render: (prodCustomNo, record) => {
                        return (
                            <span className="txt-clip" title={prodCustomNo}>
                                {prodCustomNo}
                            </span>
                        )
                    }
                },{
                    title: "物品名称",
                    dataIndex: 'prodName',
                    render: (prodName, record) => {
                        return (
                            <span className="txt-clip" title={prodName}>
                                {prodName}
                            </span>
                        )
                    }
                },{
                    title: "规格型号",
                    dataIndex: 'descItem',
                    render: (descItem, record) => {
                        return (
                            <span className="txt-clip" title={descItem}>
                                {descItem}
                            </span>
                        )
                    }
                },{
                    title: "单位",
                    dataIndex: 'unit',
                    render: (unit, record) => {
                        return (
                            <span className="txt-clip" title={unit}>
                                {unit}
                            </span>
                        )
                    }
                },{
                    title: "品牌",
                    dataIndex: 'brand',
                    render: (brand, record) => {
                        return (
                            <span className="txt-clip" title={brand}>
                                {brand}
                            </span>
                        )
                    }
                },{
                    title: "制造商型号",
                    dataIndex: 'produceModel',
                    render: (produceModel, record) => {
                        return (
                            <span className="txt-clip" title={produceModel}>
                                {produceModel}
                            </span>
                        )
                    }
                },{
                    title: "建议采购日期",
                    dataIndex: 'requiredDate',
                    render: (requiredDate, record) => {
                        return (
                            <span className="txt-clip" title={requiredDate && moment(requiredDate).format('YYYY-MM-DD')}>
                                {requiredDate && moment(requiredDate).format('YYYY-MM-DD')}
                            </span>
                        )
                    }
                },{
                    title: "建议采购量",
                    dataIndex: 'suggestQuantity',
                    render: (suggestQuantity, record) => {
                        return (
                            <span className="txt-clip" title={suggestQuantity}>
                                {suggestQuantity}
                            </span>
                        )
                    }
                },{
                    title: "已采购量",
                    dataIndex: 'finishedQuantity',
                    render: (finishedQuantity, record) => {
                        return (
                            <span className="txt-clip" title={finishedQuantity}>
                                {finishedQuantity}
                            </span>
                        )
                    }
                },{
                    title: "待采购量",
                    dataIndex: 'unQuantity',
                    render: (unQuantity, record) => {
                        return (
                            <span className="txt-clip" title={unQuantity}>
                                {unQuantity}
                            </span>
                        )
                    }
                },{
                    title: "供应商",
                    dataIndex: 'supplierName',
                    render: (supplierName, record) => {
                        return (
                            <span className="txt-clip" title={supplierName}>
                                {supplierName}
                            </span>
                        )
                    }
                }]
            })
        }else if(type === "productionSuggest"){
            this.setState({
                columns:[{
                    title: "序号",
                    width: 50,
                    dataIndex: 'serial',
                    className: 'ant-table-selection-column'
                },{
                    title: "物品编号",
                    dataIndex: 'prodCustomNo',
                    render: (prodCustomNo, record) => {
                        return (
                            <span className="txt-clip" title={prodCustomNo}>
                                {prodCustomNo}
                            </span>
                        )
                    }
                },{
                    title: "物品名称",
                    dataIndex: 'prodName',
                    render: (prodName, record) => {
                        return (
                            <span className="txt-clip" title={prodName}>
                                {prodName}
                            </span>
                        )
                    }
                },{
                    title: "规格型号",
                    dataIndex: 'descItem',
                    render: (descItem, record) => {
                        return (
                            <span className="txt-clip" title={descItem}>
                                {descItem}
                            </span>
                        )
                    }
                },{
                    title: "单位",
                    dataIndex: 'unit',
                    render: (unit, record) => {
                        return (
                            <span className="txt-clip" title={unit}>
                                {unit}
                            </span>
                        )
                    }
                },{
                    title: "品牌",
                    dataIndex: 'brand',
                    render: (brand, record) => {
                        return (
                            <span className="txt-clip" title={brand}>
                                {brand}
                            </span>
                        )
                    }
                },{
                    title: "制造商型号",
                    dataIndex: 'produceModel',
                    render: (produceModel, record) => {
                        return (
                            <span className="txt-clip" title={produceModel}>
                                {produceModel}
                            </span>
                        )
                    }
                },{
                    title: "建议生产日期",
                    dataIndex: 'requiredDate',
                    render: (requiredDate, record) => {
                        return (
                            <span className="txt-clip" title={requiredDate && moment(requiredDate).format('YYYY-MM-DD')}>
                                {requiredDate && moment(requiredDate).format('YYYY-MM-DD')}
                            </span>
                        )
                    }
                },{
                    title: "建议生产量",
                    dataIndex: 'suggestQuantity',
                    render: (suggestQuantity, record) => {
                        return (
                            <span className="txt-clip" title={suggestQuantity}>
                                {suggestQuantity}
                            </span>
                        )
                    }
                },{
                    title: "可供供应商",
                    dataIndex: 'supplierName',
                    render: (supplierName, record) => {
                        return (
                            <span className="txt-clip" title={supplierName}>
                                {supplierName}
                            </span>
                        )
                    }
                },{
                    title: "已生产量",
                    dataIndex: 'finishedQuantity',
                    render: (finishedQuantity, record) => {
                        return (
                            <span className="txt-clip" title={finishedQuantity}>
                                {finishedQuantity}
                            </span>
                        )
                    }
                },{
                    title: "BOM",
                    dataIndex: 'bomCode',
                    render: (bomCode, record) => {
                        return (
                            <span className="txt-clip" title={bomCode}>
                                {bomCode}
                            </span>
                        )
                    }
                },{
                    title: "待生产量",
                    dataIndex: 'unQuantity',
                    render: (unQuantity, record) => {
                        return (
                            <span className="txt-clip" title={unQuantity}>
                                {unQuantity}
                            </span>
                        )
                    }
                }]
            })
        }else if(type === "purchaseRecord"){
            this.setState({
                columns:[{
                    title: "序号",
                    width: 50,
                    dataIndex: 'serial',
                    className: 'ant-table-selection-column'
                },{
                    title: "采购单号",
                    dataIndex: 'displayBillNo',
                    render: (displayBillNo, record) => {
                        return (
                            <span className="txt-clip" title={displayBillNo}>
                                <Link to={`/purchase/show/${record.billNo}`}>{displayBillNo}</Link>
                            </span>
                        )
                    }
                },{
                    title: "采购日期",
                    dataIndex: 'purchaseOrderDate',
                    render: (purchaseOrderDate, record) => {
                        return (
                            <span className="txt-clip" title={purchaseOrderDate && moment(purchaseOrderDate).format('YYYY-MM-DD')}>
                                {purchaseOrderDate && moment(purchaseOrderDate).format('YYYY-MM-DD')}
                            </span>
                        )
                    }
                },{
                    title: "优惠后金额",
                    dataIndex: 'aggregateAmount',
                    render: (aggregateAmount, record) => {
                        return (
                            <span className="txt-clip" title={aggregateAmount}>
                                {aggregateAmount}
                            </span>
                        )
                    }
                },{
                    title: "采购员",
                    dataIndex: 'ourContacterName',
                    render: (ourContacterName, record) => {
                        return (
                            <span className="txt-clip" title={ourContacterName}>
                                {ourContacterName}
                            </span>
                        )
                    }
                }]
            })
        }else if(type === "productionRecord"){
            this.setState({
                columns:[{
                    title: "序号",
                    width: 50,
                    dataIndex: 'serial',
                    className: 'ant-table-selection-column'
                },{
                    title: "生产单号",
                    dataIndex: 'billNo',
                    render: (billNo, record) => {
                        return (
                            <Link to={`/produceOrder/show/${billNo}`}>
                                <span className="txt-clip" title={billNo}>
                                   {billNo}
                                </span>
                            </Link>
                        )
                    }
                },{
                    title: "单据日期",
                    dataIndex: 'orderDate',
                    render: (orderDate, record) => {
                        return (
                            <span className="txt-clip" title={orderDate && moment(orderDate).format('YYYY-MM-DD')}>
                                {orderDate && moment(orderDate).format('YYYY-MM-DD')}
                            </span>
                        )
                    }
                },{
                    title: "负责人",
                    dataIndex: 'addedName',
                    render: (addedName, record) => {
                        return (
                            <span className="txt-clip" title={addedName}>
                                {addedName}
                            </span>
                        )
                    }
                }]
            })
        }
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

    fetchData = ({page, perPage}) => {
        this.props.asyncFetchMrpCountDetail(this.props.type,this.props.id);
    };

    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows
        });
    };

    // 将产品加入到请购订单
    addProdToRequisition = () => {
        let {selectedRows} = this.state;
        if (selectedRows && selectedRows.length > 0) {
            let prodList = selectedRows.map(item => {
                return {code: item.prodNo, quantity: item.suggestQuantity}
            });
            localStorage.setItem('purchaseProposal', JSON.stringify(prodList));
            this.props.history.push('/purchase/requisitionOrder/add/?type=purchaseProposal');
        } else {
            message.error('请选择一条数据进行操作！')
        }
    };

    runClick = ()=>{
        let selectedRowKeys = this.state.selectedRowKeys;
        const {recordList,type,id} = this.props;
        if(selectedRowKeys.length === 0){
            message.error('请选择一条数据进行操作！')
        }else{
            if(type === 'productionSuggest'){
                let getIndex = selectedRowKeys.join(',');
                this.props.history.push(`/produceOrder/add?index=${getIndex}&fkMrpBillNo=${id}`);
            }else if(type === 'purchaseProposal'){
                let recordDataSource = recordList && recordList.getIn([type,'data','data']);
                recordDataSource = recordDataSource && recordDataSource.toJS() || [];
                let purchaseRecord = [];
                let purchaseOrderDate = 0;
                let supplierName = '';
                //筛选出选中的数据
                for(let j=0;j<selectedRowKeys.length;j++){
                    let prodNo = selectedRowKeys[j];
                    for(let m=0;m<recordDataSource.length;m++){
                        let obj = recordDataSource[m];
                        let obj1 = {};
                        if(obj.prodNo === prodNo){
                            if(j === 0) supplierName = obj.supplierName;
                            purchaseOrderDate === 0?(purchaseOrderDate = obj.requiredDate):(purchaseOrderDate>obj.requiredDate?(purchaseOrderDate = obj.requiredDate):null);
                            obj1.code = obj.prodNo;
                            obj1.quantity = obj.suggestQuantity;
                            purchaseRecord.push(obj1);
                            break;
                        }
                    }
                }

                //组装采购页面需要的数据
                let data = {
                    prodList: purchaseRecord,
                    purchaseOrderDate: purchaseOrderDate,
                    fkMrpBillNo : id,
                    supplierName
                }
                //将数据放入到localStorage里
                localStorage.setItem('mrpToPurchaseData', JSON.stringify(data));
                //跳转到采购订单新增页
                this.props.history.push(`/purchase/add?type=mrpToPurchaseData`);
            }

        }
    }



    getOtherProductInfo = ()=>{
        const {recordList,type} = this.props;
        const recordDataSource = (recordList && recordList.getIn([type,'data','data']));
        let stockRule = recordDataSource && recordDataSource.get('stockRule').split(',')||[];
        let map= {
            PURCHASE: "在途数量",
            OUTSOURCE: "委外待入库数量",
            PRODUCE: "在产数量"
        }
        let toc = []
        stockRule.forEach((item)=>{
            let ch = map[item];
            toc.push(ch);
        });
        const data = [{
            name: "MRP编号",
            value: recordDataSource && recordDataSource.get('billNo')
        },{
            name: "建议量取值",
            value: recordDataSource && recordDataSource.get('netFlag') === 1?"净需求":"毛需求"
        }, {
            name: "仓库",
            value: recordDataSource && recordDataSource.get('warehouseName')
        }, {
            name: "可用库存规则",
            value: toc.join(',')
        }];
        return <div style={{marginBottom: "15px"}}><AttributeBlock data={data}/></div>
    }

    getFooterInfo = () => {
        const {recordList,type} = this.props;
        const data = (recordList && recordList.getIn([type,'data','data']));
        return (
            <OperatorLog logInfo={{
                creator: data && (data.get('addedName') || data.get('addedLoginName')),
                createDate: data && getYmd(data.get('addedTime')),
                hideModifier: true
            }}/>
        )
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {

    }

    render() {
        const {recordList,type} = this.props;
        let recordDataSource = [];
        if(type === "simulatedProduction"){
            recordDataSource = (recordList && recordList.getIn([type,'data','data','prodList']));
        }else{
            recordDataSource = (recordList && recordList.getIn([type,'data','data']));
        }
        let dataSource = recordDataSource && recordDataSource.toJS() || [];
        dataSource.forEach((item,index)=>{
            item.serial = index+1;
            if(type === "productionSuggest"){
                item.key = index;
            }else if(type === "purchaseProposal"){
                item.key = item.prodNo;
            }else{
                item.key = index;
            }
        });
        const columns = this.state.columns.map((col, index) => ({
            ...col,
            onHeaderCell: column => ({
                width: column.width,
                onResize: this.handleResize(index),
            }),
        }));

        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        return (
            <React.Fragment>

                {
                    type === "simulatedProduction"?this.getOtherProductInfo():null
                }
                {
                    type === "productionSuggest"?<div style={{paddingBottom: "10px",textAlign: "right"}}>
                        <Button onClick={this.runClick} type={"primary"}>生产</Button>
                    </div>:null
                }
                {
                    type === "purchaseProposal"?<div style={{paddingBottom: "10px",textAlign: "right"}}>
                        <Button onClick={this.addProdToRequisition} type={"primary"} style={{"marginRight": "15px"}}>请购</Button>
                        <Button onClick={this.runClick} type={"primary"}>采购</Button>
                    </div>:null
                }

                <Table
                    bordered
                    columns={columns}
                    components={this.components}
                    dataSource={dataSource}
                    rowSelection={type === "productionSuggest"||type === "purchaseProposal"?rowSelection:null}
                    pagination={false}
                    loading={recordList.get('isFetching')}
                    scroll={{
                        x:true
                    }}
                />

                {
                    type === "simulatedProduction"?this.getFooterInfo():null
                }
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    recordList: state.getIn(['mrpCountReduceDetail', 'mrpContDetail']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchMrpCountDetail
    }, dispatch)
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Record))