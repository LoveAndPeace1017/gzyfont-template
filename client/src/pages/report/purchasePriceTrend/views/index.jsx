import React, {Component} from 'react';
import {
    Button, message,Select,Table
} from 'antd';
import _ from 'lodash';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import ReactEcharts from 'echarts-for-react';
import {
    asyncFetchPurchasePriceTrendDetailReport
} from '../actions'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';
import FilterToolBar from 'components/business/filterToolBar';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import ListOpeBar from 'components/business/listOpeBar';
import Crumb from 'components/business/crumb';
import {CateFilter} from 'pages/auxiliary/category';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import ReportHd from 'components/business/reportHd';
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import {Amount} from 'components/business/amount';
import FooterFixedBar from  'components/layout/footerFixedBar'
import {parse} from "url";
import {formatCurrency} from 'utils/format';
import {Auth} from 'utils/authComponent';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import ListPage from  'components/layout/listPage'
import {reducer as saleSummaryReport} from "../index";
const cx = classNames.bind(styles);
const {Option} = Select;


export class Index extends ListPage {
    constructor(props) {
        super(props);

        let condition = {
            startTime: moment(new Date().setDate(1)).format("YYYY-MM-DD"),
            endTime: moment(new Date()).format("YYYY-MM-DD")
        };

        this.state = {
            listToolBarVisible: true,
            filterToolBarVisible: true,
            checked: true,
            prodCode: '',
            condition
        };

        //echarts数据源
        this.option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: []
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: []
            },
            yAxis: {
                type: 'value'
            },
            series: []
        };
    }

    componentDidMount() {
        //初始化
        this.generateReportForm();
    }

    doFilter = (condition, resetFlag, performGenerate) => {
        let params = this.state.condition;
        if (resetFlag) {
            params = {}
        }else {
            params = {
                ...params,
                ...condition,
            }
        }
        this.setState( {
            condition: params
        }, ()=>{
            if (performGenerate) {
                this.generateReportForm();
            }
        });
    };

    generateReportForm = () => {
        const param = {...this.state.condition};
        if (param['timeStart']) {
            param['startTime'] = param['timeStart'];
            delete param['timeStart'];
        }
        if (param['timeEnd']) {
            param['endTime'] = param['timeEnd'];
            delete param['timeEnd'];
        }
        for (const key in param) {
            if (!param[key]) {
                delete param[key];
            }
        }
        this.setState({
            condition:param
        });

        if(param.endTime && param.startTime){
            this.props.asyncFetchPurchasePriceTrendDetailReport(param || {}, (data) => {
                if (data.retCode != 0) {
                    message.error(data.retMsg);
                }else{
                    let prodCode = this.state.prodCode;
                    data.prodNames && data.prodNames.length>0 && !prodCode && (
                        this.setState({
                            prodCode: data.prodNames[0].productCode
                        })
                    )
                }
            });
        }else{
            message.error("起始日期为必填项！")
        }

    };

    selectGoods = (values)=>{
        let params = this.state.condition;
        params.prodCode = values;
        this.setState({
            condition:params,
            prodCode:values
        },()=>{
            this.generateReportForm()
        });
    }


    render() {
        const {reportDetail} = this.props;
        let dataSource = reportDetail.getIn(['data', 'data']);
        let prodNames = reportDetail.getIn(['data', 'prodNames']);
        let prodPrices = reportDetail.getIn(['data', 'prodPrices']);
        dataSource = dataSource ? dataSource.toJS() : [];
        prodNames = prodNames ? prodNames.toJS() : [];
        prodPrices = prodPrices ? prodPrices.toJS() : [];

        const filterConfigList = [{
            label: "report.sale.time",
            fieldName: 'time',
            fieldStartKey: 'startTime',
            fieldEndKey: 'endTime',
            visibleFlag: true,
            cannotEdit: true,
            type: 'datePicker',
            defaultValue: [moment(new Date().setDate(1)), moment(new Date())]
        }, {
            label: "report.sale.catCode",
            fieldName: 'catCode',
            visibleFlag: true,
            cannotEdit: true,
            type: 'category'
        }, {
            label: "report.sale.prodNo",
            fieldName: 'prodNo',
            visibleFlag: true,
            cannotEdit: true,
            type: 'multProduct'
        }, {
            label:"node.supplier.groupName",
            fieldName: 'supplierGroup',
            width:'200',
            visibleFlag: true,
            cannotEdit: true,
            type:'group',
            typeField: 'supply'
        },{
            label: "report.purchaseSummaryBySupplier.supplierName",
            fieldName: 'supplierName',
            visibleFlag: true,
            cannotEdit: true,
            type: 'supplier'
        }];


        const filterDataSource = {
            selectComponents: [],
            datePickerComponents: [],
            customComponents: [],
            intervalComponents: [],
            categoryComponents: [],
            projectComponents: [],
            multProductComponents: [],
            supplierComponents: [],
            groupComponents: [],
            suffixComponents: [
                <Button ga-data={'global-report-generate'} type="primary" loading={reportDetail && reportDetail.get('isFetching')} onClick={(reportDetail && !reportDetail.get('isFetching')) && this.generateReportForm}>{intl.get("report.sale.getReport")}</Button>
            ]
        };
        filterConfigList.forEach(function(item) {
            item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
        });

        let lstStr = null;
        if(!reportDetail.get('isFetching') && reportDetail.get('data') !== ''){
            if(dataSource.length>0){

               let xData = [];
               let yDate = [];
               let prodName;
               prodPrices.forEach((item)=>{
                   !prodName && (prodName = item.prodName);
                   xData.push(item.purchaseOrderDate);
                   yDate.push(item.unitPrice || 0);
               });
               this.option.xAxis.data = xData;
               this.option.series = [{
                       name: prodName,
                       type: 'line',
                       stack: 'Total',
                       data: yDate
                   }];

                lstStr = (<ReactEcharts option={this.option}
                                        notMerge={false}
                                        lazyUpdate={false}
                                        style={{width: '100%', height: '300px'}}
                />);


            }else{
                lstStr = (<p style={{textAlign: "center",padding: "80px",fontSize: "20px",color: "#d2d2d2"}}>暂无数据</p>);
            }

        }

        const columns = [
            {
                title: '物品编号',
                dataIndex: 'productCode',
            },
            {
                title: '物品名称',
                dataIndex: 'prodName',
            },
            {
                title: '采购日期',
                dataIndex: 'purchaseOrderDate',
            },
            {
                title: '规格型号',
                dataIndex: 'descItem',
            },
            {
                title: '单位',
                dataIndex: 'unit',
            },
            {
                title: '品牌',
                dataIndex: 'brand',
            },
            {
                title: '制造商型号',
                dataIndex: 'produceModel',
            },
            {
                title: '数量',
                dataIndex: 'quantity',
            },
            {
                title: '单价',
                dataIndex: 'unitPrice',
            }
        ];


        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            title: "采购价格走势图"
                        }
                    ]}/>
                </div>
                <div className="content-index-bd">
                    <div className={"tb-inner"}>
                      <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            onFilter={this.filterListData}
                            exportType="purchasePriceTrendReport"
                            onReset={()=> {
                                this.filterToolBarHanler && this.filterToolBarHanler.doReset()
                            }}
                            exportCondition={this.state.condition}
                        />

                        <FilterToolBar dataSource={filterDataSource}
                                       doFilter={this.doFilter}
                                       style={{display: this.state.filterToolBarVisible ? 'block' : 'none'}}
                                       ref={(child) => {
                                           this.filterToolBarHanler = child;
                                       }}
                        />
                    </div>
                    </div>
                    <div className={"data-wrap cf"}>
                        <div className={"tb-wrap"}>
                            <ReportHd
                                sourceLabel={intl.get("report.sale.source")}
                                sourceName={"采购订单"}
                            />
                            <div>
                                <div className={cx("echarts-dom")}>
                                    <div className={cx("do-option")}>
                                        <span>采购物品： </span>
                                        <Select
                                            style={{minWidth: '200px'}}
                                            value={this.state.prodCode}
                                            onChange={this.selectGoods}
                                        >
                                            {
                                                prodNames.map((item)=>{
                                                    return <Option value={item.productCode}>{item.prodName}</Option>
                                                })
                                            }
                                        </Select>
                                    </div>
                                    <p className={cx("p-title")}>采购价格走势表</p>
                                    {lstStr}
                                    <div style={{width: "100%",padding:"30px 0"}}>
                                        {
                                            this.state.checked?<Table bordered={true} dataSource={dataSource} columns={columns} pagination={false}/>:null
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    reportDetail: state.getIn(['purchasePriceTrendReportIndex', 'purchasePriceTrendDetail'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPurchasePriceTrendDetailReport
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)