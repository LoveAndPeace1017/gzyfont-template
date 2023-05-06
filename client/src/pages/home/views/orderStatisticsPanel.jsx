import React, {Component} from 'react';
import {Select, Spin} from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import ReactEcharts from 'echarts-for-react';

import Panel from 'components/business/panel';
import Icon from 'components/widgets/icon';
import {formatCurrency} from 'utils/format';
import {asyncFetchOrder} from "../actions";
import intl from 'react-intl-universal';
import {
    CaretDownOutlined,
} from '@ant-design/icons';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

const Option = Select.Option;

class orderStatisticsPanel extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.option = {
            color: ['#6db8ed', '#ff9292'],
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
                data: [intl.get("home.orderStatisticsPanel.orderPrice"), intl.get("home.orderStatisticsPanel.orderNum")],
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
                // ,
                // data: ["12.14", "12.16", "12.18", "12.20", "12.22", "12.24", "12.26", "12.28", "12.30", "01.02", "01.04", "01.05", "01.06"]
            },
            yAxis: [
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
                    name: intl.get("home.orderStatisticsPanel.orderPrice"),
                    type: 'bar',
                    barWidth: '40%'
                    // ,
                    // data: [4500, 2000, 7500, 9500, 12000, 13500, 9000, 8030, 7200, 7100, 6800, 7300, 8000]
                },
                {
                    name: intl.get("home.orderStatisticsPanel.orderNum"),
                    type: 'line',
                    yAxisIndex: 1
                    // ,
                    // data: [4500, 3000, 7800, 9500, 12000, 11500, 9000, 8000, 7200, 7100, 6800, 7300, 8000]
                }
            ]
        };
    }

    componentDidMount() {
        this.props.asyncFetchOrder();
    }

    handleChange(value){
        this.props.asyncFetchOrder(value);
    }

    render() {
        const {orderStatistics}  = this.props;
        let lstStr = null;
        if(!orderStatistics.get('isFetching') && orderStatistics.get('data') !== ''){
            if(orderStatistics.getIn(['data','retCode']) === '0' && orderStatistics.getIn(['data','data']).size>0){
                const data = orderStatistics.getIn(['data','data']);
                //x轴坐标数据
                this.option.xAxis.data = data.get('groupNameList').toJS();
                //柱状图数据（金额）
                //如果没有销售金额查看权，带入空数据
                let amountListLength = data.get('amountList') && data.get('amountList').toJS().length || 0;
                this.option.series[0].data = (data.get('totalAmount')||data.get('totalAmount')===0)?data.get('amountList').toJS():new Array(amountListLength).fill(0);
                //折线图数据(数量)
                this.option.series[1].data = data.get('countList').toJS();
                //总金额

                //设置legend的总数量和总金额
                const totalData = [(data.get('totalAmount')||data.get('totalAmount')==0)?formatCurrency(data.get('totalAmount')):'**', formatCurrency(data.get('totalCount'), 0, true)];
                const payTotalAmount = (data.get('payTotalAmount')||data.get('payTotalAmount')==0)?formatCurrency(data.get('payTotalAmount')):'**';
                const legendData = this.option.legend.data;
                this.option.legend.formatter = function(name){
                    let index = 0;
                    legendData.forEach(function(val, i){
                        if(val === name){
                            index = i;
                        }
                    });
                    return name + ' ' + totalData[index]  + '    ' +(index === 1 ? (intl.get("home.orderStatisticsPanel.payNum") + payTotalAmount): '');
                };
                lstStr=(
                    <ReactEcharts option={this.option}
                                  notMerge={true}
                                  lazyUpdate={true}
                                  style={{width: '100%', height: '260px'}}
                    />
                )
            }else{
                lstStr=(
                    <div className="gb-nodata">
                        <span/><p>{intl.get("home.orderStatisticsPanel.noContent")}</p>
                    </div>
                )
            }
        }else{
            lstStr = (
                <Spin className="gb-data-loading"/>
            )
        }
        return (
            <Panel
                title={intl.get("home.orderStatisticsPanel.title")}
                extra={
                    <Select
                        className={cx("panel-select")}
                        defaultValue="month"
                        suffixIcon={<CaretDownOutlined  style={{pointerEvents:"none"}}/>}
                        onChange={this.handleChange}
                    >
                        <Option value="month" className={cx("panel-select-option")}>{intl.get("home.orderStatisticsPanel.month")}</Option>
                        <Option value="year" className={cx("panel-select-option")}>{intl.get("home.orderStatisticsPanel.year")}</Option>
                        {/*<Option value="day" className="panel-select-option">当日</Option>*/}
                    </Select>
                }
            >
                <div className={cx("statics-chart")}>
                    {lstStr}
                </div>
            </Panel>
        )
    }
}

const mapStateToProps = (state) => ({
    orderStatistics: state.getIn(['home','orderStatistics'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchOrder
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(orderStatisticsPanel)
