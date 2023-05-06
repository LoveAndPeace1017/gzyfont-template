import React, {Component} from 'react';
import {
    Button, message,Radio,Checkbox,Table
} from 'antd';
import _ from 'lodash';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import ReactEcharts from 'echarts-for-react';
import {
    asyncFetchSaleSummaryDetailReport
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


export class Index extends ListPage {
    constructor(props) {
        super(props);

        let condition = {
            startTime: moment(new Date().setDate(1)).format("YYYY-MM-DD"),
            endTime: moment(new Date()).format("YYYY-MM-DD"),
            searchFlag: 0
        };

        this.state = {
            listToolBarVisible: true,
            filterToolBarVisible: true,
            optionDate: 0,
            checked: true,
            condition
        };

        //echarts数据源
        this.option = {
            color: ['#2A7EDC', '#E57C7C'],
            grid: {
                top: 56,
                right: 50,
                bottom: 23,
                left: 85
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(param){
                    const moneyParam = param[0], numParam = param[1];
                    return moneyParam.name + '<br/>' + moneyParam.seriesName +'：'+ formatCurrency(moneyParam.data)
                        + '<br />' + numParam.seriesName +'：'+ formatCurrency(numParam.data, 0, true);
                }
            },
            legend: {
                left: 0,
                data: [intl.get("home.saleStatisticsPanel.orderPrice"), intl.get("home.saleStatisticsPanel.orderNum")],
                textStyle: {
                    color: '#222'
                }
            },
            xAxis: {
                //坐标轴线
                axisLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: '#f2f2f2'
                    }
                },
                //坐标轴刻度标签
                axisLabel: {
                    color: '#666'
                }
            },
            yAxis: [
                {
                    //坐标轴线
                    axisLine: {
                        show: false
                    },
                    //坐标轴刻度标签
                    axisLabel: {
                        color: '#666',
                    },
                    //坐标轴刻度
                    axisTick: {
                        show: false
                    },
                    //坐标轴在 grid 区域中的分隔线
                    splitLine: {
                        lineStyle: {
                            type: 'dashed',
                            color: '#f2f2f2'
                        }
                    },
                },
                {
                    //坐标轴线
                    axisLine: {
                        show: false
                    },
                    //坐标轴刻度标签
                    axisLabel: {
                        color: '#666'
                    },
                    //坐标轴刻度
                    axisTick: {
                        show: false
                    },
                    //坐标轴在 grid 区域中的分隔线
                    splitLine: {
                        lineStyle: {
                            type: 'dashed',
                            color: '#f2f2f2'
                        }
                    }
                }
            ],
            series: [
                {
                    name: intl.get("home.saleStatisticsPanel.orderPrice"),
                    type: 'bar',
                    barWidth: '40%'
                },
                {
                    name: intl.get("home.saleStatisticsPanel.orderNum"),
                    type: 'line',
                    yAxisIndex: 1
                }
            ]
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
            console.log(param);
            this.props.asyncFetchSaleSummaryDetailReport(param || {}, (data) => {
                if (data.retCode != 0) {
                    message.error(data.retMsg);
                }
            });
        }else{
            message.error("起始日期为必填项！")
        }

    };

    //改变年月日
    changeDate = (e) =>{
        let condition = this.state.condition;
        condition.searchFlag = e.target.value;
        this.setState({
            optionDate: e.target.value,
            condition
        },()=>{
            this.generateReportForm();
        });

    }

    onChangeChecked = (e)=>{
        this.setState({
            checked: e.target.checked,
        });
    }


    render() {
        const {reportDetail} = this.props;
        let dataSource = reportDetail.getIn(['data', 'data']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let footer = reportDetail.getIn(['data', 'footer']);
        footer = footer && footer.toJS();
        console.log(footer, 'footer');
        let priceDecimalNum = getCookie("priceDecimalNum");

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
        },{
            label: "report.saleSummaryByCustomer.customerName",
            fieldName: 'customerName',
            visibleFlag: true,
            cannotEdit: true,
            type: 'customer'
        },{
            label: "node.sale.depEmployee",
            fieldName: 'depEmployee',
            visibleFlag: true,
            cannotEdit: true,
            type: 'depEmployee'
        }];

        const filterDataSource = {
            selectComponents: [],
            datePickerComponents: [],
            customComponents: [],
            intervalComponents: [],
            categoryComponents: [],
            projectComponents: [],
            multProductComponents: [],
            customerComponents: [],
            depEmployeeComponents: [],
            suffixComponents: [
                <Button ga-data={'global-report-generate'} type="primary" loading={reportDetail && reportDetail.get('isFetching')} onClick={(reportDetail && !reportDetail.get('isFetching')) && this.generateReportForm}>{intl.get("report.sale.getReport")}</Button>
            ]
        };
        filterConfigList.forEach(function(item) {
            item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
        });

        //处理table数据
        let totalAry = [];
        let amountAry = [];
        let timeAry = [];
        let optionDate = this.state.optionDate;
        let lstStr = null;
        let dataSourceForTab = [];
        if(!reportDetail.get('isFetching') && reportDetail.get('data') !== ''){
            console.log(dataSource,'dataSource~~~');
            if(dataSource.length>0){
               //需要对不同的数据进行补0操作
               for(let i=0;i<dataSource.length;i++){
                   //以日为标准
                   if(optionDate === 0){
                       if(i>0){
                           let daysList = [];
                           const start = moment(dataSource[i-1].time);
                           const end = moment(dataSource[i].time);
                           const day = end.diff(start, "day");
                           for (let k = 1; k < day; k++) {
                               daysList.push(start.add(1, "day").format("YYYY-MM-DD"));
                           }
                           if(daysList.length>0){
                               daysList.forEach((item)=>{
                                   totalAry.push(0);
                                   amountAry.push(0);
                                   timeAry.push(item);
                                   dataSourceForTab.push({
                                       amount: 0,
                                       total: 0,
                                       time: item
                                   })
                               })
                           }
                       }
                       totalAry.push(dataSource[i].total);
                       amountAry.push(dataSource[i].amount);
                       timeAry.push(dataSource[i].time);
                       dataSourceForTab.push(dataSource[i]);
                   }else if(optionDate === 1){
                       if(i>0){
                           let daysList = [];
                           const start = moment(dataSource[i-1].time);
                           const end = moment(dataSource[i].time);
                           const day = end.diff(start, "month");
                           for (let k = 1; k < day; k++) {
                               daysList.push(start.add(1, "month").format("YYYY-MM"));
                           }
                           if(daysList.length>0){
                               daysList.forEach((item)=>{
                                   let timeSplit1 = item.split('-');
                                   totalAry.push(0);
                                   amountAry.push(0);
                                   timeAry.push(timeSplit1[0]+'-'+timeSplit1[1]);
                                   dataSourceForTab.push({
                                       amount: 0,
                                       total: 0,
                                       time: timeSplit1[0]+'-'+timeSplit1[1]
                                   })
                               })
                           }
                       }
                       let timeSplit = dataSource[i].time.split('-');
                       totalAry.push(dataSource[i].total);
                       amountAry.push(dataSource[i].amount);
                       timeAry.push(timeSplit[0]+'-'+timeSplit[1]);
                       dataSource[i].time = timeSplit[0]+'-'+timeSplit[1];
                       dataSourceForTab.push(dataSource[i]);
                   }else if(optionDate === 2){
                       if(i>0){
                           let daysList = [];
                           const start = moment(dataSource[i-1].time);
                           const end = moment(dataSource[i].time);
                           const day = end.diff(start, "year");
                           for (let k = 1; k < day; k++) {
                               daysList.push(start.add(1, "year").format("YYYY"));
                           }
                           if(daysList.length>0){
                               daysList.forEach((item)=>{
                                   let timeSplit1 = item.split('-');
                                   totalAry.push(0);
                                   amountAry.push(0);
                                   timeAry.push(timeSplit1[0]);
                                   dataSourceForTab.push({
                                       amount: 0,
                                       total: 0,
                                       time: timeSplit1[0]
                                   })
                               })
                           }
                       }
                       let timeSplit = dataSource[i].time.split('-');
                       totalAry.push(dataSource[i].total);
                       amountAry.push(dataSource[i].amount);
                       timeAry.push(timeSplit[0]);
                       dataSource[i].time = timeSplit[0];
                       dataSourceForTab.push(dataSource[i]);
                   }

                   /*totalAry.push(dataSource[i].total);
                   amountAry.push(dataSource[i].amount);
                   //对时间进行特别处理
                   let timeSplit = dataSource[i].time.split('-');
                   if(optionDate == 0){
                       timeAry.push(dataSource[i].time);
                   }else if(optionDate == 1){
                       timeAry.push(timeSplit[0]+'-'+timeSplit[1]);
                       dataSource[i].time = timeSplit[0]+'-'+timeSplit[1];
                   }else if(optionDate == 2){
                       timeAry.push(timeSplit[0]);
                       dataSource[i].time = timeSplit[0];
                   }*/
               }
                //x轴坐标数据
                this.option.xAxis.data = timeAry;//["12.14", "12.16", "12.18", "12.20", "12.22", "12.24", "12.26", "12.28", "12.30", "01.02", "01.04", "01.05", "01.06"];
                //柱状图数据（金额）
                this.option.series[0].data = amountAry;//[4500, 2000, 7500, 9500, 12000, 13500, 9000, 8030, 7200, 7100, 6800, 7300, 8000];
                //折线图数据(数量)
                this.option.series[1].data = totalAry;//[4500, 3000, 7800, 9500, 12000, 11500, 9000, 8000, 7200, 7100, 6800, 7300, 8000];


                lstStr = (<ReactEcharts option={this.option}
                                        notMerge={false}
                                        lazyUpdate={false}
                                        style={{width: '100%', height: '300px'}}
                />);


            }else{
                lstStr = (<p style={{textAlign: "center",padding: "80px",fontSize: "20px",color: "#d2d2d2"}}>暂无数据</p>);
            }

        }

        dataSourceForTab.push(footer);

        const columns = [
            {
                title: '',
                dataIndex: 'time',
                width: "10%"
            },
            {
                title: '销售金额',
                dataIndex: 'amount',
            },
            {
                title: '销售订单',
                dataIndex: 'total',
            },
            {
                title: '销售均价',
                dataIndex: 'average',
                render: (text, record, index) => {
                    return (
                        <span className="txt-clip">
                            {dataSourceForTab.length-1 !== index ? fixedDecimal(_.divide(record.amount,record.total), priceDecimalNum)||0 : null}
                        </span>
                    )
                }
            }
        ];


        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            title: "销售汇总图"
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
                            exportType="saleSummaryReport"
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
                                sourceName={intl.get("report.sale.sourceName")}
                            />
                            <div>
                                <div className={cx("echarts-dom")}>
                                    <div className={cx("do-option")}>
                                        <Radio.Group options={[
                                            { label: '日', value: 0 },
                                            { label: '月', value: 1 },
                                            { label: '年', value: 2 },
                                        ]} onChange={this.changeDate} value={this.state.optionDate} size={"middle"}  optionType="button" buttonStyle="solid"/>


                                        <span className={cx("span-check")}>
                                            <Checkbox
                                                checked={this.state.checked}
                                                onChange={this.onChangeChecked}
                                            >
                                              显示数据表
                                            </Checkbox>
                                        </span>

                                    </div>

                                    <p className={cx("p-title")}>销售汇总图</p>

                                    {/*{dataSource.length>0?<ReactEcharts ref={(e) => { this.echartsReact = e }} option={this.option}
                                                   notMerge={true}
                                                   lazyUpdate={false}
                                                   style={{width: '100%', height: '300px'}}
                                    />:null}*/}

                                    {lstStr}

                                    <div style={{width: "100%",padding:"30px 0"}}>
                                        {
                                            this.state.checked?<Table bordered={true} dataSource={dataSourceForTab} columns={columns} pagination={false}/>:null
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
    reportDetail: state.getIn(['saleSummaryReport', 'saleSummaryDetail'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchSaleSummaryDetailReport
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)