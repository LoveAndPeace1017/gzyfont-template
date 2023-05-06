import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {Modal, Button ,message} from 'antd';
import XLSX from 'xlsx';
import Icon from 'components/widgets/icon';
import axios from 'utils/axios';
import {getTime} from 'utils/format'
import {connect} from "react-redux";
import {isAuthed} from 'utils/isHasAuth';
import IntlTranslation from 'utils/IntlTranslation';
import PropTypes from "prop-types";
import {getCookie} from 'utils/cookie';
const map = {
    supplier:{
        key:'supplierNo',
        name:"components.exportModal.index.supplier",
        url:"/suppliers/excel/export"
    },
    customer:{
        key:'customerNo',
        name:"components.exportModal.index.customer",
        url:"/customers/excel/export"
    },
    goods:{
        key:"prodCode",
        name:"components.exportModal.index.goods",
        url:"/prods/excel/export"
    },
    purchase:{
        name:"components.exportModal.index.purchase",
        url:"/goods/excel/export"
    },
    inquiry:{
        name:"components.exportModal.index.inquiry",
        url:"/goods/excel/export"
    },
    sale:{
        name:"components.exportModal.index.sale",
        url:"/goods/excel/export"
    },
    saleSummaryReport:{
        name:"components.exportModal.index.saleSummaryReport",
        url:"/api/report/saleSummary/export",
        type:"client"
    },
    purchaseSummaryReport:{
        name:"components.exportModal.index.saleSummaryReport",
        url:"/api/report/saleSummary/export",
        type:"client"
    },
    customerReport:{
        name:"components.exportModal.index.customerReport",
        url:"/api/report/check_customer/export",
        type:"client",
    },
    supplierReport:{
        name:"components.exportModal.index.supplierReport",
        url:"/api/report/check_supplier/export",
        type:"client"
    },
    financeReport:{
        name:"components.exportModal.index.financeReport",
        url:"/api/report/financeInOut/export",
        type:"client"
    },
    purchaseInvoiceReport:{
        name:"components.exportModal.index.purchaseInvoiceReport",
        url:"/api/report/purchaseInvoice/export",
        type:"client"
    },
    saleInvoiceReport:{
        name:"components.exportModal.index.saleInvoiceReport",
        url:"/api/report/saleInvoice/export",
        type:"client"
    },
    flowmeterReport:{
        name:"components.exportModal.index.flowmeterReport",
        url:"/api/report/flowmeter/export",
        type:"client"
    },
    inventoryReport:{
        name:"components.exportModal.index.inventoryReport",
        url:"/api/report/inventory/export",
        type:"client"
    },
    inventoryPriceReport:{
        name:"components.exportModal.index.inventoryPriceReport",
        url:"/api/report/inventoryPrice/export",
        type:"client"
    },
    inventoryPriceUntaxReport:{
        name:"home.menu.report.inOutPriceUntax",
        url:"/api/report/inventoryPriceUntax/export",
        type:"client"
    },
    grossProfitReport:{
        name:"components.exportModal.index.grossProfitReport",
        url:"/api/report/grossProfit/export",
        type:"client"
    },
    grossProfitCustomerReport:{
        name:"components.exportModal.index.grossProfitCustomerReport",
        url:"/api/report/grossProfitCustomer/export",
        type:"client"
    },
    purchaseReport:{
        name:"components.exportModal.index.purchaseReport",
        url:"/api/report/purchase/export",
        type:"client"
    },
    saleReport:{
        name:"components.exportModal.index.saleReport",
        url:"/api/report/sale/export",
        type:"client"
    },
    quotationReport:{
        name:"components.exportModal.index.quotationReport",
        url:"/api/report/quotation/export",
        type:"client"
    },
    waresumReport:{
        name:"components.exportModal.index.waresumReport",
        url:"/api/report/waresum/export",
        type:"client"
    },
    inventoryInquiryReport:{
        name:"components.exportModal.index.inventoryInquiryReport",
        url:"/api/report/inventoryInquiry/export",
        type:"client"
    },
    saleTraceReport:{
        name:"components.exportModal.index.saleTraceReport",
        url:"/api/report/saleTrace/export",
        type:"client"
    },
    purchaseTraceReport:{
        name:"components.exportModal.index.purchaseTraceReport",
        url:"/api/report/purchaseTrace/export",
        type:"client"
    },
    purchaseSummaryByProdReport:{
        name:"components.exportModal.index.purchaseSummaryByProdReport",
        url:"/api/report/purchaseSummaryByProd/export",
        type:"client"
    },
    purchaseSummaryBySupplierReport:{
        name:"components.exportModal.index.purchaseSummaryBySupplierReport",
        url:"/api/report/purchaseSummaryBySupplier/export",
        type:"client"
    },
    saleSummaryByProdReport:{
        name:"components.exportModal.index.saleSummaryByProdReport",
        url:"/api/report/saleSummaryByProd/export",
        type:"client"
    },
    saleSummaryBySellerReport:{
        name:"home.menu.report.saleSummaryBySeller",
        url:"/api/report/saleSummaryBySeller/export",
        type:"client"
    },
    saleSummaryByCustomerReport:{
        name:"components.exportModal.index.saleSummaryByCustomerReport",
        url:"/api/report/saleSummaryByCustomer/export",
        type:"client"
    },
    inactiveStockReport:{
        name:"components.exportModal.index.inactiveStockReport",
        url:"/api/report/inactiveStock/export",
        type:"client"
    },
    saleRefundSummaryByProdReport:{
        name:"components.exportModal.index.saleRefundSummaryByProdReport",
        url:"/api/report/saleRefundSummaryByProd/export",
        type:"client"
    },
    purchaseRefundSummaryByProdReport:{
        name:"components.exportModal.index.purchaseRefundSummaryByProdReport",
        url:"/api/report/purchaseRefundSummaryByProd/export",
        type:"client"
    },
    contactRecord: {
        name:"contactRecord.index.contactRecord",
        url:"/api/customer/export/contactRecord/list",
        type:"client"
    },
    batchQuery:{
        name:"components.exportModal.index.batchQuery",
        url:"/api/batchQuery/batchnumber/export",
        type:"client"
    },
    producePerformanceReport:{
        name:"components.exportModal.index.producePerformance",
        url:"/api/report/producePerformance/export",
        type:"client"
    },
    saleProfitReport:{
        name:"components.exportModal.index.saleProfitReport",
        url:"/api/report/saleGrossProfitForecast/export",
        type:"client"
    },
    mergeDeliveryReport:{
        name:"components.exportModal.index.mergeDeliveryReport",
        url:"/api/report/mergeDelivery/export",
        type:"client"
    },
    collectionAndDeliveryReport:{
        name:"components.exportModal.index.collectionAndDeliveryReport",
        url:"/api/report/collectionAndDelivery/export",
        type:"client"
    },
    purchasePriceTrendReport:{
        name:"components.exportModal.index.purchasePriceTrendReport",
        url:"/api/report/purchasePriceTrend/export",
        type:"client"
    },
    tradeSaleProfitReport: {
        name:"components.exportModal.index.tradeSaleProfitReport",
        url:"/api/report/tradeSaleProfit/export",
        type:"client"
    },
    historicalTraceReport: {
        name:"components.exportModal.index.historicalTraceReport",
        url:"/api/report/historicalTrace/export",
        type:"client"
    }
};

function isAuth(accountInfo, module, option, authCombineType){

    let authed;
    if(accountInfo.get('comName')&&!accountInfo.get('mainUserFlag')) {
        if(option&&option=='main'){
            // 该功能仅主账号可用
            authed = false;
        }
        let authMap = accountInfo.get('authMap').toJS();
        authed = isAuthed(authMap, module, option, authCombineType)
    }else{
        authed = true;
    }
    return authed;
}

/**
 * 导出
 *
 * @visibleName ExportModal（导出）
 * @author qiumingsheng
 */
class ExportModal extends Component{
    static propTypes = {
        /** 导出数据类型（customer-客户，supplier-供应商） */
        type: PropTypes.string,
        /** 需要导出的数据，若为空则导出数据库中所有数据 */
        dataSource:PropTypes.array,
    };
    constructor(props){
        super(props);
        this.state = {
            exportModalVisible: false,
            loading: false,
            name: "",
            value:""
        }
    }
    componentDidMount() {
        const {type} = this.props;
        let data = map[type];
        this.setState({
            name:data.key,
            action:'/api/file/download?url='+data.url
        });
    }
    openModal = ()=>{
        this.setState({
            exportModalVisible:true
        });
    };
    closeModal = ()=>{
        this.setState({
            exportModalVisible:false
        });
    };
    onClickExportBtn = (e,dataSource)=>{
        let {type,beforeExport,name} = this.props;
        if(map[type].type&&map[type].type==='client'){
            if(beforeExport){
                beforeExport(()=>{
                    this.exportByFrontEnd(map[type].url,name||intl.get(map[type].name));
                })
            }else{
                this.exportByFrontEnd(map[type].url,name||intl.get(map[type].name));
            }
        }else{
            if(!dataSource||dataSource.length ===0){
                this.openModal();
            }else{
                this.exportData()
            }
        }
    };



    // 客户端生成excel
    exportByFrontEnd = (url,filename)=>{
        filename = filename||'report';
        filename = filename + '_' + getTime();
        let {type,currentAccountInfo} = this.props;
        const accountInfo = currentAccountInfo.get('data');
        axios.post(url, this.props.condition).then(function (res) {
            if (res.data && res.data.retCode == 0) {
                let data = res.data.tableData;
                // 采购明细表，税额字段需要进行权限判断
                if(type=='purchaseReport'){
                    const authed = isAuth(accountInfo, "purchasePrice", "show", null);
                    console.log('authed',authed);
                    if(!authed){
                        let titles = data[0];
                        let index = -1;
                        for(let i=0;i<titles.length;i++){
                            if(titles[i]==intl.get("components.exportModal.index.tax")){
                                index = i;
                                break;
                            }
                        }
                        if(index!==-1){
                            for(let j=1;j<data.length;j++){
                                data[j][index] = '**';
                            }
                        }
                    }
                }
                let wb = XLSX.utils.book_new();
                wb.SheetNames.push("Sheet1");
                //需要对导出数据进行多语言处理
                let commonData = res.data.tableData||[];
                let singleData = (type === 'mergeDeliveryReport'?commonData[5]:commonData[0]);
                for(let p=0;p<singleData.length;p++){
                    if(singleData[p].indexOf('.')>=0){
                        if(type === 'mergeDeliveryReport'){
                            commonData[5][p] = intl.get(singleData[p])
                        }else{
                            commonData[0][p] = intl.get(singleData[p])
                        }
                    }
                }
                let worksheet = XLSX.utils.aoa_to_sheet(commonData);
                wb.Sheets["Sheet1"] = worksheet;
                XLSX.writeFile(wb, filename+'.xls');
            } else {
                message.error(res.data.retMsg);
            }
        })
            .catch(error => {
                message.error(error);
            });
    };
    exportData = ()=>{
        setTimeout(function(){
            document.getElementById('exportForm').submit();
        },200);
    };

    render(){

        let {type,dataSource,condition} = this.props;
        let ids = dataSource&&dataSource.join(',')||"";
        const modelName = map[type];
        if(!modelName){
            alert(intl.get("components.exportModal.index.exportMsg"));
        }

        return(
            <React.Fragment>
                <form method="post" action={this.state.action} style={{display:'none'}} id="exportForm">
                    <input type="hidden" name="x-csrf-token" value={getCookie('csrfToken')} />
                    <input type="hidden" name="modelName" value={this.state.name || ''} />
                    <input type="hidden" name="ids" value={ids} />
                    {
                        condition && Object.keys(condition).map((key) => (
                            <input type="hidden" name={key} value={condition[key]} />
                        ))
                    }
                </form>
                <Button ga-data={this.props.gadata}
                        onClick={(e)=>this.onClickExportBtn(e,dataSource)}><Icon type={'icon-export'}/>{intl.get("components.billPop.orderPop.export")}</Button>
                <Modal
                    title={intl.get("components.exportModal.index.warningTip")}
                    width={800}
                    visible={this.state.exportModalVisible}
                    onCancel={this.closeModal}
                    onOk={this.exportData}
                    destroyOnClose={true}
                    okText={intl.get("components.exportModal.index.export")}
                    cancelText={intl.get("components.exportModal.index.cancel")}
                >
                    <div>
                        <p>{intl.get("components.exportModal.index.notChoose")} {intl.get(modelName.name)} {intl.get("components.exportModal.index.message")} </p>
                    </div>
                </Modal>
            </React.Fragment>

        )
    }
};
const mapStateToProps = state => ({
    currentAccountInfo: state.getIn(['commonInfo', 'currentAccountInfo']),
});
export default connect(mapStateToProps,null)(ExportModal);