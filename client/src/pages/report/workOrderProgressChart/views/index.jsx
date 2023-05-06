import React, {Component} from 'react';
import {
    Button, message,Radio,Progress,Table,Tooltip
} from 'antd';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {actions as productControlAction} from "pages/productControl/index";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';
import FilterToolBar from 'components/business/filterToolBar';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import ListOpeBar from 'components/business/listOpeBar';
import Crumb from 'components/business/crumb';
import NewProgress from 'components/business/progress';
import {CateFilter} from 'pages/auxiliary/category';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {Amount} from 'components/business/amount';
import {formatCurrency} from 'utils/format';
import {Auth} from 'utils/authComponent';
import ListPage from  'components/layout/listPage'

const cx = classNames.bind(styles);


export class Index extends ListPage {
    constructor(props) {
        super(props);

        let condition = {
            expectStartDateStart: moment(new Date().setDate(1)).format("YYYY-MM-DD"),
            sheetStatus: "1",
            chartFlag: true
        };

        this.state = {
            listToolBarVisible: true,
            filterToolBarVisible: true,
            optionDate: 0,
            checked: true,
            condition
        };

    }

    componentDidMount() {
        //初始化
        this.generateReportForm();
    }

    doFilter = (condition, resetFlag, performGenerate) => {
        let params = this.state.condition;
        if (resetFlag) {
            params = {
                expectStartDateStart: moment(new Date().setDate(1))
            }
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

    drawPoint = ()=>{
        //antd Table api不提供在其内部渲染其他dom元素
        //js 手动操纵dom
        //延时等dom渲染完成再操作
        setTimeout(()=>{
            let upDom = document.getElementById('spec-tab-id').firstChild.firstChild;
            let className = upDom.className;
            if(className === "ant-table-content"){
                //优先判断dom元素中子元素数量
                if(upDom.lastChild.tagName === "DIV"){
                    upDom.removeChild(upDom.lastChild);
                }
                let drawPoint = document.getElementById('draw-point').firstChild.cloneNode(true);
                console.log(drawPoint,'drawPoint');
                upDom.appendChild(drawPoint);
            }else{
                message.error('渲染图形发生异常！');
            }
        },800);
    }

    generateReportForm = () => {
        const param = {...this.state.condition};
        for (const key in param) {
            if (!param[key]) {
                delete param[key];
            }
        }
        this.setState({
            condition:param
        });

        if(param.expectStartDateStart){
            console.log(param);
            this.props.asyncFetchProductControlList(param || {}, (data) => {
                console.log(data,'data');
                if (data.data.retCode != 0) {
                    message.error(data.data.retMsg);
                }else{
                    this.drawPoint();
                }
            });
        }else{
            // message.error("开始时间为必填项！")
        }

    };

    getDiffDate = (minDate,maxDate)=>{
        let months = [];
        let startDate = new Date(minDate);
        let endDate = new Date(maxDate);
        //把时间的天数都设置成当前月第一天
        startDate.setDate(1)
        endDate.setDate(1)
        // new Date(yyyy-MM-dd) 不知为何有时候小时是 08 有时候是00
        endDate.setHours(0,0,0,0);
        startDate.setHours(0,0,0,0);
        endDate.getTime() === startDate.getTime()?endDate.setMonth(endDate.getMonth()+1):null;
        while (endDate.getTime()>=startDate.getTime()){
            let year = startDate.getFullYear();
            let month = startDate.getMonth()+1;
            //加一个月
            startDate.setMonth(month)
            if (month.toString().length == 1) {
                month = "0" + month;
            }
            months.push({
                year:year,
                month: month,
                title: year+"年"+month+"月"
            })
        }
        return months;
    }

    mGetDate = (year, month)=>{
        var d = new Date(year, month, 0);
        return d.getDate();
    }


    render() {
        const {reportDetail} = this.props;
        let dataSource = reportDetail.getIn(['data','list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        console.log(dataSource,'dataSource');
        const filterConfigList = [{
            label: "report.sale.time1",
            fieldName: 'expectStartDateStart',
            visibleFlag: true,
            cannotEdit: true,
            type: 'singleDate',
            defaultValue: moment(new Date().setDate(1))
        },{
            label: "report.sale.work2",
            fieldName: 'sheetStatus',
            visibleFlag: true,
            cannotEdit: true,
            type: 'select',
            showType: 'full',
            options: [
                {label: intl.get("report.sale.option1"), value: '0'},
                {label: intl.get("report.sale.option5"), value: '1'},
                {label: intl.get("report.sale.option3"), value: '2'},
                {label: intl.get("report.sale.option4"), value: '3'}
            ],
            defaultValue: '1'
        },{
            label: 'node.productControl.prodName1',
            fieldName: 'productCode',
            visibleFlag: true,
            displayFlag: true,
            type: 'product',
            cannotEdit: true
        },{
            label: "node.productControl.officerName",
            fieldName: 'officerId',
            width: '200',
            visibleFlag: true,
            displayFlag: true,
            cannotEdit: true,
            type: 'depEmployeeById'
        }];

        const filterDataSource = {
            selectComponents: [],
            singleDateComponents: [],
            depEmployeeByIdComponents: [],
            productComponents: [],
            suffixComponents: [
                <Button ga-data={'global-report-generate'} type="primary" loading={reportDetail && reportDetail.get('isFetching')} onClick={(reportDetail && !reportDetail.get('isFetching')) && this.generateReportForm}>{intl.get("report.sale.getReport")}</Button>
            ]
        };
        filterConfigList.forEach(function(item) {
            item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
        });
        //处理纵轴数据
        const dataSource1 = [];
        //默认设置展示2个月日期
        let minTimeAry = [];
        let maxTimeAry = [];
        for(let i=0;i<dataSource.length;i++){
            dataSource1.push({
                key: i+1,
                name: <div className={cx("y-dom")}>
                    <ul>
                        <li title={dataSource[i].billNo}>
                            工单编号：{dataSource[i].billNo}
                        </li>
                        <li title={dataSource[i].sheetName}>
                            工单名称：{dataSource[i].sheetName}
                        </li>
                        <li title={dataSource[i].prodDisplayCode+"("+dataSource[i].prodName+")"}>
                            生成物品：{dataSource[i].prodDisplayCode+"("+dataSource[i].prodName+")"}
                        </li>
                        <li title={dataSource[i].officerName}>
                            负责人：{dataSource[i].officerName}
                        </li>
                        <li>
                            状态：{dataSource[i].sheetStatus === 0?"下达":dataSource[i].sheetStatus === 1?"上线":dataSource[i].sheetStatus === 2?"完成":dataSource[i].sheetStatus === 3?"关闭":"未知状态"}
                        </li>
                    </ul>
                </div>
            });
            //处理获得最小/最大日期时间戳
            //expectStartDate  actualStartDate
            //expectEndDate   actualEndDate
            dataSource[i].expectStartDate && minTimeAry.push(dataSource[i].expectStartDate);
            dataSource[i].actualStartDate && minTimeAry.push(dataSource[i].actualStartDate);

            dataSource[i].expectEndDate && maxTimeAry.push(dataSource[i].expectEndDate);
            dataSource[i].actualEndDate && maxTimeAry.push(dataSource[i].actualEndDate);

            //处理实际的偏移位置和进度条长度
            //top 和 left
            //一格单元格表示一天24*60*60*1000（宽度是60px 高度是88px）
            //table第一栏的高度是128px 每个距离顶部的是58px
            let expectWidth = (dataSource[i].expectEndDate - dataSource[i].expectStartDate)/1000/60/60/24*60;
            let expectTop = 162.33*i+150;
            dataSource[i].expectWidth = expectWidth;
            dataSource[i].expectTop = expectTop;

            if(dataSource[i].actualStartDate && dataSource[i].actualEndDate){
                dataSource[i].actualFlag = true;
                let actualWidth = (dataSource[i].actualEndDate - dataSource[i].actualStartDate)/1000/60/60/24*60;
                dataSource[i].actualWidth = actualWidth;
                dataSource[i].actualTop = expectTop;
            }else{
                dataSource[i].actualFlag = false;
            }
        }

        const columns = [
            {
                title: '',
                dataIndex: 'name',
                key: 'name',
                width: 232
            }
        ];

        //处理横轴数据
        //展示月份
        //展示天数
        //展示开始-结束月份
        let minTime = minTimeAry.length>0?minTimeAry.sort()[0]:new Date().getTime();
        let maxTime = maxTimeAry.length>0?maxTimeAry.sort((a,b)=>{return b-a})[0]:new Date().getTime();
        let monthAry = this.getDiffDate(minTime,maxTime);

        for(let j=0;j<monthAry.length;j++){
            let days = this.mGetDate(monthAry[j].year,monthAry[j].month);
            let childrenArys = [];
            for(let m=0;m<days;m++){
                childrenArys.push({
                    title: m+1,
                    dataIndex: m+1,
                    key: m+1,
                    align: 'center',
                    width: 60
                })
            };
            columns.push({
                title: monthAry[j].title,
                dataIndex: 'month'+j,
                key: 'month'+j,
                align: 'left',
                children: childrenArys
            });
        }

        //一次循环取到最小时间，需要二次循环带入和最小事件的计算
        //获取到当前最小时间的月份的0点0分0秒
        let formateMinTime = new Date(new Date(minTime).setDate(1)).setHours(0,0,0,0);
        for(let k=0;k<dataSource.length;k++){
            let expectStartDate = dataSource[k].expectStartDate;
            let expectLeft = (expectStartDate-formateMinTime)/1000/60/60/24*60;
            dataSource[k].expectLeft = expectLeft + 232;
            if(dataSource[k].actualFlag){
                let actualStartDate = dataSource[k].actualStartDate;
                let actualLeft = (actualStartDate-formateMinTime)/1000/60/60/24*60;
                dataSource[k].actualLeft = actualLeft + 218;
            }
        }

        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            title: "报表中心"
                        }
                        ,
                        {
                            title: "工单进度图"
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
                            //exportType="saleSummaryReport"
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
                    <div className={cx("spec-tab")}>
                        <div id={"draw-point"} style={{display: "none"}}>
                            <div>
                                {
                                    dataSource.map((item,index)=>{
                                        if(item.actualFlag){
                                            return <React.Fragment>
                                                        <NewProgress key={index} type={"producer"} data={item} actualFlag={false} status={item.sheetStatus} width={item.expectWidth} index={index+1} top={item.expectTop} left={item.expectLeft}/>
                                                        <NewProgress key={index+'ls'} type={"producer"} data={item} actualFlag={true} status={item.sheetStatus} width={item.actualWidth} index={index+1} top={item.actualTop} left={item.actualLeft}/>
                                                   </React.Fragment>
                                        }else{
                                            return <NewProgress key={index} type={"producer"} data={item} actualFlag={false} status={item.sheetStatus} width={item.expectWidth} index={index+1} top={item.expectTop} left={item.expectLeft}/>
                                        }

                                    })
                                }
                            </div>
                        </div>
                        <Table id={"spec-tab-id"} scroll={
                            {
                                x: true
                            }
                        } bordered={true} dataSource={dataSource1} columns={columns} pagination={false}/>

                    </div>

                </div>

            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    reportDetail: state.getIn(['productControlIndex', 'productControlList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchProductControlList: productControlAction.asyncFetchProductControlList,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)